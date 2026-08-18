# app/api/routes/auth.py

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import pyodbc

from core.password_utils import fetch_user_for_login, verify_password

router = APIRouter()


def get_db_connection():
    """
    Create a SQL Server database connection only when it is needed.

    Keeping the connection out of module-level code prevents the application
    from trying to connect to SQL Server during module import, which is
    important for testing and CI environments such as GitHub Actions.
    """
    return pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        r"SERVER=localhost\SQLEXPRESS;"
        "DATABASE=userDB;"
        "Trusted_Connection=yes;"
    )


@router.post("/login_user")
async def login(request: Request):
    data = await request.json()

    username = str(data.get("username") or "").strip()
    password = str(data.get("password") or "").strip()

    conn = None

    try:
        # Create the database connection only when login is requested.
        conn = get_db_connection()
        cursor = conn.cursor()

        user = fetch_user_for_login(cursor, username)

        if user and verify_password(
            user[2],
            user[3] if len(user) > 3 else None,
            password,
        ):
            request.session["username"] = username

            role = user[1].strip().lower()

            if role == "admin":
                request.session["is_admin"] = True

                return JSONResponse(
                    {
                        "success": True,
                        "redirect": "/admin",
                    }
                )

            request.session["is_admin"] = False

            return JSONResponse(
                {
                    "success": True,
                    "redirect": "/user_panel",
                }
            )

        return JSONResponse(
            {
                "success": False,
                "message": "نام کاربری یا رمز عبور اشتباه است",
            }
        )

    finally:
        if conn is not None:
            conn.close()
