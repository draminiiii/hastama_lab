"""Tests for the manual check-in / check-out feature (Users page).

The feature reuses the existing ``hozoor`` table (username, date, vrood,
khoroj).  These tests run without a real database: a small in-memory fake
backs the ``get_db_connection`` used by the three new endpoints, exactly
like the other unit tests in this suite.
"""
import asyncio
import json
from datetime import time

import app.main as main
from app.services.attendance import compute_attendance_status, format_time_value


# --------------------------------------------------------------------------- #
# Service helpers
# --------------------------------------------------------------------------- #

class TestFormatTimeValue:
    def test_none(self):
        assert format_time_value(None) is None

    def test_time_object(self):
        assert format_time_value(time(8, 12)) == "08:12"

    def test_string_hhmm(self):
        assert format_time_value("08:12") == "08:12"

    def test_string_compact(self):
        assert format_time_value("0812") == "08:12"

    def test_empty_string(self):
        assert format_time_value("") is None


class TestComputeAttendanceStatus:
    def test_not_checked_in(self):
        result = compute_attendance_status(None, None)
        assert result["status"] == "not_checked_in"
        assert result["check_in"] is None
        assert result["check_out"] is None

    def test_checked_in(self):
        result = compute_attendance_status(time(8, 12), None)
        assert result["status"] == "checked_in"
        assert result["check_in"] == "08:12"
        assert result["check_out"] is None

    def test_checked_out(self):
        result = compute_attendance_status(time(8, 12), time(16, 35))
        assert result["status"] == "checked_out"
        assert result["check_in"] == "08:12"
        assert result["check_out"] == "16:35"


# --------------------------------------------------------------------------- #
# Endpoint fakes
# --------------------------------------------------------------------------- #

class FakeRequest:
    def __init__(self, session, body=None):
        self.session = session
        self._body = body

    async def json(self):
        return self._body


class FakeDB:
    """In-memory stand-in for userDB (user_table + hozoor)."""

    def __init__(self, users):
        self.users = list(users)
        self.rows = {}  # (username, date) -> (vrood, khoroj)
        self.commits = 0
        self.rollbacks = 0
        self.last_fetchone = None
        self.last_fetchall = []


class FakeCursor:
    def __init__(self, db):
        self.db = db

    def _active(self, username):
        """Latest (date, vrood) row that is checked-in but not checked-out."""
        active = None
        for (u, d), (vr, kh) in self.db.rows.items():
            if u == username and vr is not None and kh is None:
                if active is None or d > active[0]:
                    active = (d, vr)
        return active

    def execute(self, query, params=None):
        db = self.db
        q = query or ""
        db.last_fetchone = None
        db.last_fetchall = []

        if q.startswith("SELECT username FROM user_table"):
            username = params[0]
            db.last_fetchone = (username,) if username in db.users else None
        elif "SELECT TOP 1 [date], vrood FROM hozoor" in q:
            db.last_fetchone = self._active(params[0])
        elif "SELECT vrood, khoroj FROM hozoor" in q:
            key = (params[0], params[1])
            db.last_fetchone = db.rows.get(key)
        elif q.startswith("UPDATE hozoor SET vrood"):
            key = (params[1], params[2])
            existing = db.rows.get(key)
            db.rows[key] = (params[0], existing[1] if existing else None)
        elif q.startswith("INSERT INTO hozoor"):
            key = (params[0], params[1])
            db.rows[key] = (params[2], None)
        elif q.startswith("UPDATE hozoor SET khoroj"):
            key = (params[1], params[2])
            existing = db.rows.get(key)
            db.rows[key] = (existing[0] if existing else None, params[0])
        elif "LEFT JOIN hozoor" in q:
            today = params[0]
            out = []
            for u in db.users:
                active = self._active(u)
                today_row = db.rows.get((u, today))
                if active is not None:
                    out.append((u, active[0], active[1], None))
                if today_row is not None and (active is None or active[0] != today_row[0]):
                    out.append((u, today, today_row[0], today_row[1]))
                if active is None and today_row is None:
                    out.append((u, None, None, None))
            db.last_fetchall = out

    def fetchone(self):
        return self.db.last_fetchone

    def fetchall(self):
        return self.db.last_fetchall

    def close(self):
        pass


class FakeConn:
    def __init__(self, db):
        self.db = db

    def cursor(self):
        return FakeCursor(self.db)

    def commit(self):
        self.db.commits += 1

    def rollback(self):
        self.db.rollbacks += 1

    def close(self):
        pass


ADMIN = {"username": "admin", "is_admin": True}
TODAY = main.datetime.now().date()


def run(endpoint, request):
    return asyncio.run(endpoint(request))


def body_of(response):
    return json.loads(response.body)


# --------------------------------------------------------------------------- #
# Endpoint tests
# --------------------------------------------------------------------------- #

def test_checkin_creates_record(monkeypatch):
    db = FakeDB(users=["IT        "])
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    resp = run(
        main.sabt_hozoor_checkin,
        FakeRequest(ADMIN, {"username": "IT        "}),
    )
    data = body_of(resp)

    assert resp.status_code == 200
    assert data["success"] is True
    assert data["data"]["status"] == "checked_in"
    assert data["data"]["check_in"] is not None
    assert data["data"]["check_out"] is None

    key = ("IT        ", TODAY)
    assert key in db.rows
    assert db.rows[key][0] is not None
    assert db.rows[key][1] is None
    assert db.commits == 1


def test_checkin_duplicate_rejected(monkeypatch):
    db = FakeDB(users=["IT        "])
    db.rows[("IT        ", TODAY)] = (time(8, 0), None)
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    resp = run(
        main.sabt_hozoor_checkin,
        FakeRequest(ADMIN, {"username": "IT        "}),
    )
    data = body_of(resp)

    assert resp.status_code == 409
    assert data["success"] is False
    # no second record / no change
    assert db.rows[("IT        ", TODAY)][0] == time(8, 0)


def test_checkout_succeeds(monkeypatch):
    db = FakeDB(users=["IT        "])
    db.rows[("IT        ", TODAY)] = (time(8, 12), None)
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    resp = run(
        main.sabt_hozoor_checkout,
        FakeRequest(ADMIN, {"username": "IT        "}),
    )
    data = body_of(resp)

    assert resp.status_code == 200
    assert data["success"] is True
    assert data["data"]["status"] == "checked_out"
    assert data["data"]["check_in"] == "08:12"
    assert data["data"]["check_out"] is not None
    assert db.rows[("IT        ", TODAY)][1] is not None


def test_checkout_without_checkin_rejected(monkeypatch):
    db = FakeDB(users=["IT        "])
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    resp = run(
        main.sabt_hozoor_checkout,
        FakeRequest(ADMIN, {"username": "IT        "}),
    )
    data = body_of(resp)

    assert resp.status_code == 409
    assert data["success"] is False
    assert ("IT        ", TODAY) not in db.rows


def test_checkout_duplicate_rejected(monkeypatch):
    db = FakeDB(users=["IT        "])
    db.rows[("IT        ", TODAY)] = (time(8, 12), time(16, 35))
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    resp = run(
        main.sabt_hozoor_checkout,
        FakeRequest(ADMIN, {"username": "IT        "}),
    )
    data = body_of(resp)

    assert resp.status_code == 409
    assert data["success"] is False
    assert db.rows[("IT        ", TODAY)][1] == time(16, 35)


def test_unknown_user_rejected(monkeypatch):
    db = FakeDB(users=["IT        "])
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    resp = run(
        main.sabt_hozoor_checkin,
        FakeRequest(ADMIN, {"username": "ghost"}),
    )
    assert resp.status_code == 404
    assert body_of(resp)["success"] is False


def test_auth_required(monkeypatch):
    db = FakeDB(users=["IT        ", "user"])
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    # no session at all
    resp = run(
        main.sabt_hozoor_checkin,
        FakeRequest({}, {"username": "IT        "}),
    )
    assert resp.status_code == 401
    assert body_of(resp)["success"] is False

    # authenticated users may register only their own attendance
    resp = run(
        main.sabt_hozoor_checkin,
        FakeRequest({"username": "user", "is_admin": False}, {"username": "IT        "}),
    )
    assert resp.status_code == 403

    resp = run(
        main.sabt_hozoor_checkin,
        FakeRequest({"username": "user", "is_admin": False}, {"username": "user"}),
    )
    assert resp.status_code == 200
    assert body_of(resp)["success"] is True


def test_status_batch(monkeypatch):
    db = FakeDB(users=["IT        ", "user2"])
    db.rows[("IT        ", TODAY)] = (time(8, 12), None)
    db.rows[("user2", TODAY)] = (time(9, 0), time(17, 0))
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    resp = run(main.get_hozoor_today, FakeRequest(ADMIN))
    data = body_of(resp)

    assert resp.status_code == 200
    assert data["success"] is True
    users = {u["username"]: u for u in data["data"]["users"]}

    assert users["IT        "]["status"] == "checked_in"
    assert users["IT        "]["check_in"] == "08:12"
    assert users["user2"]["status"] == "checked_out"
    assert users["user2"]["check_out"] == "17:00"


def test_overnight_checkout_targets_active_record(monkeypatch):
    """شیفت شب: ورود دیروز، خروج امروز — خروج باید روی رکوردِ ورود (دیروز) ثبت شود."""
    from datetime import timedelta
    yesterday = TODAY - timedelta(days=1)

    db = FakeDB(users=["IT        "])
    db.rows[("IT        ", yesterday)] = (time(23, 50), None)
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    # وضعیت باید همچنان «در حال کار» باشد (ورود فعال دیروز)
    data = body_of(run(main.get_hozoor_today, FakeRequest(ADMIN)))
    assert data["data"]["users"][0]["status"] == "checked_in"

    # خروج باید موفق باشد و روی رکورد دیروز بنشیند
    resp = run(main.sabt_hozoor_checkout, FakeRequest(ADMIN, {"username": "IT        "}))
    data = body_of(resp)
    assert resp.status_code == 200
    assert data["data"]["status"] == "checked_out"
    assert data["data"]["check_in"] == "23:50"
    assert db.rows[("IT        ", yesterday)][1] is not None
    assert ("IT        ", TODAY) not in db.rows


def test_overnight_duplicate_checkin_rejected(monkeypatch):
    """ورود فعالِ دیروز باید مانع ورود دوبارهٔ امروز شود."""
    from datetime import timedelta
    yesterday = TODAY - timedelta(days=1)

    db = FakeDB(users=["IT        "])
    db.rows[("IT        ", yesterday)] = (time(23, 50), None)
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    resp = run(main.sabt_hozoor_checkin, FakeRequest(ADMIN, {"username": "IT        "}))
    assert resp.status_code == 409
    # رکورد امروز ساخته نشود
    assert ("IT        ", TODAY) not in db.rows


def test_full_flow_reflects_in_status(monkeypatch):
    """Test 1-8: check-in → duplicate rejected → check-out → duplicate rejected,
    with the status endpoint reflecting every step."""
    db = FakeDB(users=["IT        "])
    monkeypatch.setattr(main, "get_db_connection", lambda: FakeConn(db))

    # initial: not checked in
    data = body_of(run(main.get_hozoor_today, FakeRequest(ADMIN)))
    assert data["data"]["users"][0]["status"] == "not_checked_in"

    # check-in
    data = body_of(run(main.sabt_hozoor_checkin, FakeRequest(ADMIN, {"username": "IT        "})))
    assert data["data"]["status"] == "checked_in"

    # duplicate check-in
    dup = run(main.sabt_hozoor_checkin, FakeRequest(ADMIN, {"username": "IT        "}))
    assert dup.status_code == 409

    # status now checked_in
    data = body_of(run(main.get_hozoor_today, FakeRequest(ADMIN)))
    assert data["data"]["users"][0]["status"] == "checked_in"

    # check-out
    data = body_of(run(main.sabt_hozoor_checkout, FakeRequest(ADMIN, {"username": "IT        "})))
    assert data["data"]["status"] == "checked_out"

    # duplicate check-out
    dup = run(main.sabt_hozoor_checkout, FakeRequest(ADMIN, {"username": "IT        "}))
    assert dup.status_code == 409

    # status now checked_out
    data = body_of(run(main.get_hozoor_today, FakeRequest(ADMIN)))
    assert data["data"]["users"][0]["status"] == "checked_out"
