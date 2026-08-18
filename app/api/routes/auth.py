# app/api/routes/auth.py

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import pyodbc

from core.password_utils import fetch_user_for_login, verify_password

router = APIRouter()

DB_CONN_STR = (
    'DRIVER={ODBC Driver 17 for SQL Server};'
    r'SERVER=localhost\SQLEXPRESS;'
    'DATABASE=userDB;'
    'Trusted_Connection=yes;'
)


class LazyDBCursor:
    def __init__(self, conn_str: str = DB_CONN_STR):
        self.conn_str = conn_str
        self._conn = None
        self._cursor = None

    def _connect(self):
        if self._cursor is not None:
            return self._cursor
        try:
            self._conn = pyodbc.connect(self.conn_str)
            self._cursor = self._conn.cursor()
            return self._cursor
        except Exception:
            self._conn = None
            self._cursor = None
            raise

    def execute(self, *args, **kwargs):
        return self._connect().execute(*args, **kwargs)

    def fetchone(self, *args, **kwargs):
        return self._connect().fetchone(*args, **kwargs)

    def fetchall(self, *args, **kwargs):
        return self._connect().fetchall(*args, **kwargs)

    def __getattr__(self, name):
        return getattr(self._connect(), name)


# اتصال به دیتابیس (میتونی این رو به صورت مشترک تو یه فایل دیگه هم بذاری)
conn = None
cursor = LazyDBCursor()

@router.post("/login_user")
async def login(request: Request):
    data = await request.json()
    username = str(data.get("username") or "").strip()
    password = str(data.get("password") or "").strip()

    user = fetch_user_for_login(cursor, username)

    if user and verify_password(user[2], user[3] if len(user) > 3 else None, password):
        request.session["username"] = username
        role = user[1].strip().lower()

        if role == "admin":
            request.session["is_admin"] = True
            return JSONResponse({"success": True, "redirect": "/admin"})
        else:
            request.session["is_admin"] = False
            return JSONResponse({"success": True, "redirect": "/user_panel"})

    return JSONResponse({"success": False, "message": "نام کاربری یا رمز عبور اشتباه است"})

