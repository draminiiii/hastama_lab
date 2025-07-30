# app/api/routes/auth.py

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import pyodbc

router = APIRouter()

# اتصال به دیتابیس (میتونی این رو به صورت مشترک تو یه فایل دیگه هم بذاری)
conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                      r'SERVER=localhost\SQLEXPRESS;'
                      'DATABASE=userDB;'
                      'Trusted_Connection=yes;')
cursor = conn.cursor()

@router.post("/login_user")
async def login(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")

    cursor.execute("SELECT username, role FROM user_table WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()

    if user:
        request.session["username"] = username
        role = user[1].strip().lower()

        if role == "admin":
            request.session["is_admin"] = True
            return JSONResponse({"success": True, "redirect": "/admin"})
        else:
            request.session["is_admin"] = False
            return JSONResponse({"success": True, "redirect": "/user_panel"})
    else:
        return JSONResponse({"success": False, "message": "نام کاربری یا رمز عبور اشتباه است"})
