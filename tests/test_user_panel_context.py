import asyncio
from datetime import date, datetime, time

from starlette.requests import Request

import app.main as main


class FakeCursor:
    def __init__(self):
        self.executed = []

    def execute(self, query, params=None):
        self.executed.append((query, params))

    def fetchone(self):
        query = self.executed[-1][0]
        if "FROM leave_report" in query:
            return (5, 2)
        if "FROM ticket_table" in query and "COUNT(*)" in query:
            return (1,)
        if "FROM ticket_table" in query and "TOP 1" in query:
            return (101, "Ticket Title", "alice", "Desc", date(2026, 7, 1))
        if "FROM user_table" in query:
            return ("avatar.png",)
        return None

    def fetchall(self):
        query = self.executed[-1][0]
        if "SELECT overtime_date, daily_overtime, status, description FROM ezafe_table" in query:
            return [(date(2026, 7, 2), time(1, 30), "تایید شده", "desc")]
        if "SELECT daily_overtime FROM ezafe_table" in query:
            return [(time(1, 30),)]
        if "FROM ticket_table" in query and "WHERE username = ? OR target_username = ?" in query:
            return [
                (1, "Ticket Title", "Desc", "alice", "تایید شده", date(2026, 7, 1), 0),
            ]
        if "SELECT request_date, pass_title, pass_duration, status FROM totalpass_table" in query:
            return [(date(2026, 7, 3), "pass title", time(1, 0), "تایید شده")]
        if "SELECT pass_duration FROM totalpass_table WHERE username = ? AND status = 'تایید شده'" in query:
            return [(time(0, 30),)]
        if "SELECT pass_duration FROM totalpass_table" in query and "status = N'تاييد شده'" in query:
            return [(time(0, 30),)]
        if "FROM mrkhc_table" in query:
            return [(date(2026, 7, 4), date(2026, 7, 6), 3, "تایید شده")]
        return []


def test_user_panel_includes_leave_details_in_template_context(monkeypatch):
    captured = {}

    def fake_template_response(name, context):
        captured.update(context)
        return {"template": name, "context": context}

    fake_cursor = FakeCursor()
    monkeypatch.setattr(main, "cursor", fake_cursor)
    monkeypatch.setattr(main.templates, "TemplateResponse", fake_template_response)

    request = Request({
        "type": "http",
        "method": "GET",
        "path": "/user_panel",
        "headers": [],
        "session": {"username": "alice"},
    })

    response = asyncio.run(main.user_panel(request))

    assert response["template"] == "user-panel.html"
    assert "leave_details" in captured
    assert captured["leave_details"]
    assert captured["leave_details"][0]["status"] == "تایید شده"
    assert captured["leave_details"][0]["days"] == 3
