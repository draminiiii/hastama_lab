import sys
import os
import pyodbc
import jdatetime
import random
import pdfkit
import shutil
from datetime import datetime, date, time, timedelta
from persiantools.jdatetime import JalaliDate
from typing import List
from io import BytesIO

sys.path.append(os.path.abspath(os.path.dirname(__file__)))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.api.routes.api import router as api_router
from app.api.routes.auth import router as auth_router
from app.services.presence_summary import build_presence_summary, time_is_inside_range
from core.config import API_PREFIX, DEBUG, MEMOIZATION_FLAG, PROJECT_NAME, VERSION
from core.events import create_start_app_handler

from fastapi import FastAPI, HTTPException, Request, Form, Query, Response, Path, Body, UploadFile, File
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse, StreamingResponse
from fastapi.requests import Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from jinja2 import Template
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel

# ایجاد اپلیکیشن FastAPI
app = FastAPI(debug=True)

# اضافه کردن Middleware برای مدیریت Session
app.add_middleware(SessionMiddleware, secret_key="your_secret_key")

# ثبت مسیر استاتیک برای فایل‌های CSS و JavaScript
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.include_router(auth_router)

# تنظیمات برای HTML Templates
templates = Jinja2Templates(directory="app/templates")

# اتصال به دیتابیس SQL Server
conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                      r'SERVER=localhost\SQLEXPRESS;'
                      'DATABASE=userDB;'
                      'Trusted_Connection=yes;')
cursor = conn.cursor()

# تبدیل اعداد به اعداد فارسی
def convert_to_persian_numbers(number):
    persian_digits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
    return ''.join([persian_digits[int(digit)] if digit.isdigit() else digit for digit in str(number)])

# تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود
# تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود
# تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود # تابع صفحه ورود

@app.get("/login")
async def home(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری
# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری
# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری# روت مربوط به پنل کاربری

@app.get("/user_panel")
async def user_panel(request: Request):
    username = request.session.get('username')
    if not username:
        return RedirectResponse(url="/login", status_code=303)

    today = datetime.now()
    current_year = today.year
    current_month = today.month

    # دریافت گزارش مرخصی
    cursor.execute("""
        SELECT total_days, remaining_days FROM leave_report WHERE username = ?
    """, (username,))
    report = cursor.fetchone()

    approved_count = report[0] if report else 0
    remaining_count = report[1] if report else 0

    approved_count_farsi = convert_to_persian_numbers(approved_count)
    remaining_count_farsi = convert_to_persian_numbers(remaining_count)

    # دریافت اطلاعات اضافه‌کاری
    cursor.execute("""
        SELECT overtime_date, daily_overtime, status, description FROM ezafe_table WHERE username = ?
    """, (username,))
    all_overtime_records = cursor.fetchall()

    overtime_records = []
    for idx, record in enumerate(all_overtime_records, start=1):
        overtime_date_shamsi = jdatetime.date.fromgregorian(date=record[0]).strftime('%Y/%m/%d')
        overtime_time = record[1].strftime('%H:%M')
        overtime_records.append({
            'index': convert_to_persian_numbers(idx),
            'date': convert_to_persian_numbers(overtime_date_shamsi),
            'time': convert_to_persian_numbers(overtime_time),
            'status': record[2],
            'description': record[3]
        })

    # اطلاعات تیکت‌ها
    cursor.execute("""
        SELECT id, ticketTitle, ticketDescription, target_username, ticket_status, ticket_date, Parent_id
        FROM ticket_table WHERE username = ? OR target_username = ?
    """, (username, username))
    all_ticket_records = cursor.fetchall()

    oldest_ticket_per_parent = {}
    for record in all_ticket_records:
        parent_id = record[6]
        if parent_id not in oldest_ticket_per_parent or record[5] < oldest_ticket_per_parent[parent_id]['ticket_date']:
            oldest_ticket_per_parent[parent_id] = {
                'ticket_id': record[0],
                'ticket_title': record[1],
                'ticket_description': record[2],
                'target_username': record[3],
                'ticket_status': record[4],
                'ticket_date': record[5]
            }

    ticket_records = [{
        'index': convert_to_persian_numbers(idx),
        'ticket_id': v['ticket_id'],
        'ticket_title': v['ticket_title'],
        'ticket_description': v['ticket_description'],
        'target_username': v['target_username'],
        'ticket_status': v['ticket_status'],
        'ticket_date': convert_to_persian_numbers(jdatetime.date.fromgregorian(date=v['ticket_date']).strftime('%Y/%m/%d'))
    } for idx, v in enumerate(oldest_ticket_per_parent.values(), start=1)]

    # اطلاعات مرخصی‌های کاربر
    cursor.execute("""
        SELECT start_date, end_date, days, status
        FROM mrkhc_table
        WHERE username = ?
        ORDER BY id DESC
    """, (username,))
    all_leave_records = cursor.fetchall()

    leave_details = []
    for record in all_leave_records:
        start_date = record[0]
        end_date = record[1]

        formatted_start = 'نامعتبر'
        if start_date:
            try:
                parsed_start = datetime.strptime(start_date, '%Y-%m-%d') if isinstance(start_date, str) else start_date
                formatted_start = jdatetime.date.fromgregorian(date=parsed_start).strftime('%Y/%m/%d')
            except Exception:
                formatted_start = 'نامعتبر'

        formatted_end = 'نامعتبر'
        if end_date:
            try:
                parsed_end = datetime.strptime(end_date, '%Y-%m-%d') if isinstance(end_date, str) else end_date
                formatted_end = jdatetime.date.fromgregorian(date=parsed_end).strftime('%Y/%m/%d')
            except Exception:
                formatted_end = 'نامعتبر'

        leave_details.append({
            'start_date': convert_to_persian_numbers(formatted_start),
            'end_date': convert_to_persian_numbers(formatted_end),
            'days': record[2],
            'status': record[3] if record[3] else 'انتظار تایید'
        })

    # اطلاعات پاس‌ها
    cursor.execute("""
        SELECT request_date, pass_title, pass_duration, status FROM totalpass_table WHERE username = ?
    """, (username,))
    all_pass_records = cursor.fetchall()

    pass_records = []
    for idx, record in enumerate(all_pass_records, start=1):
        duration = record[2]
        total_seconds = duration.hour * 3600 + duration.minute * 60 + duration.second
        hours, minutes = total_seconds // 3600, (total_seconds % 3600) // 60
        formatted_duration = f"{hours:02}:{minutes:02}"
        pass_records.append({
            'index': convert_to_persian_numbers(idx),
            'date': convert_to_persian_numbers(jdatetime.date.fromgregorian(date=record[0]).strftime('%Y/%m/%d')),
            'title': record[1],
            'duration': convert_to_persian_numbers(formatted_duration),
            'status': record[3]
        })

    # مجموع زمان پاس‌های تایید شده
    cursor.execute("""
        SELECT pass_duration FROM totalpass_table WHERE username = ? AND status = 'تایید شده'
    """, (username,))
    approved_pass_records = cursor.fetchall()
    total_seconds = sum(r[0].hour * 3600 + r[0].minute * 60 + r[0].second for r in approved_pass_records)
    total_approved_hours = total_seconds // 3600
    total_approved_minutes = (total_seconds % 3600) // 60
    total_approved_duration = f"{total_approved_hours:02}:{total_approved_minutes:02}"
    
    # پیام خوانده‌نشده
    cursor.execute("""
        SELECT TOP 1 id, ticketTitle, target_username, ticketDescription, ticket_date
        FROM ticket_table
        WHERE target_username = ? AND is_read = 0 AND username <> ?
        ORDER BY ticket_date DESC
    """, (username, username))
    message = cursor.fetchone()
    message_records = []
    if message:
        message_records.append({
            'id': message[0],
            'index': convert_to_persian_numbers(1),
            'ticket_title': message[1],
            'target_username': message[2],
            'ticket_description': message[3],
            'ticket_date': convert_to_persian_numbers(jdatetime.date.fromgregorian(date=message[4]).strftime('%Y/%m/%d'))
        })

    # جستجو برای تعداد پیام‌های خوانده‌نشده، به جز پیام‌هایی که فرستنده آنها برابر با کاربر باشد
    cursor.execute("""
        SELECT COUNT(*)
        FROM ticket_table
        WHERE target_username = ? AND is_read = 0 AND username <> ?
    """, (username, username))

    unread_count = cursor.fetchone()[0]  # دریافت تعداد پیام‌های خوانده‌نشده

    # محاسبه مجموع زمان‌های daily_overtime تایید شده
    cursor.execute("""
        SELECT daily_overtime FROM ezafe_table 
        WHERE username = ? AND status = N'تایید شده'
    """, (username,))
    records = cursor.fetchall()

    total_minutes = 0
    total_seconds = 0

    for record in records:
        overtime = record[0]
        total_minutes += overtime.hour * 60 + overtime.minute
        total_seconds += overtime.second

    total_minutes += total_seconds // 60
    total_seconds %= 60
    total_hours = total_minutes // 60
    remaining_minutes = total_minutes % 60

    # ساخت رشته نهایی برای نمایش
    formatted_time = f"{total_hours:02}:{remaining_minutes:02}"  # اگر نمی‌خوای ثانیه‌ها نمایش داده بشن

    # تبدیل به فارسی در صورت نیاز
    formatted_time_farsi = convert_to_persian_numbers(formatted_time)

    cursor.execute("""
    SELECT pass_duration FROM totalpass_table 
    WHERE username = ? AND status = N'تاييد شده'
    """, (username,))
    records = cursor.fetchall()

    total_seconds = 0
    for row in records:
        duration_str = str(row[0])  # مثلاً '00:15:00'
        h, m, s = map(int, duration_str.split(':'))
        total_seconds += h * 3600 + m * 60 + s

    total_pass_duration = str(timedelta(seconds=total_seconds))

    cursor.execute("SELECT profile_image FROM user_table WHERE username = ?", (username,))
    profile_image_row = cursor.fetchone()
    user_image_url = f"/static/uploads/{profile_image_row[0]}" if profile_image_row and profile_image_row[0] else None

    # محاسبه وضعیت امروز برای کارت رویداد امروز
    presence_summary = {
        "check_in_time": "--:--",
        "check_out_time": "--:--",
        "today_work_hours": "۰۰:۰۰",
        "overtime_hours": "۰۰:۰۰",
        "ring_green_percent": 0,
        "ring_blue_percent": 0,
        "ring_mode": "green",
        "entry_time": None,
        "work_start_time": None,
        "work_end_time": None,
        "server_now_time": None,
    }

    try:
        cursor.execute("""
            SELECT hozoor_num, work_hours, shanbeh, yekshanbeh, doshanbeh, seshanbeh, chrshanbeh, panjshanbeh
            FROM user_table
            WHERE username = ?
        """, (username,))
        user_row = cursor.fetchone()
        if user_row:
            hozoor_num, default_work_hours, shanbeh, yekshanbeh, doshanbeh, seshanbeh, chrshanbeh, panjshanbeh = user_row
            weekday_map = {0: shanbeh, 1: yekshanbeh, 2: doshanbeh, 3: seshanbeh, 4: chrshanbeh, 5: panjshanbeh}

            cursor.execute("""
                SELECT jalali_year, jalali_month, start_day, end_day,
                       shanbeh, yekshanbeh, doshanbeh, seshanbeh, chaharshanbeh, panjshanbeh, jomeh
                FROM shiftha
                WHERE username = ?
                ORDER BY jalali_year, jalali_month, start_day
            """, (username,))
            shift_rows = [{
                'jalali_year': r[0], 'jalali_month': r[1], 'start_day': r[2], 'end_day': r[3],
                'shanbeh': r[4], 'yekshanbeh': r[5], 'doshanbeh': r[6], 'seshanbeh': r[7],
                'chaharshanbeh': r[8], 'panjshanbeh': r[9], 'jomeh': r[10]
            } for r in cursor.fetchall()]

            today_jalali = JalaliDate.today()
            sh_year, sh_month, sh_day = today_jalali.year, today_jalali.month, today_jalali.day
            weekday = jdatetime.date(sh_year, sh_month, sh_day).weekday()

            def resolve_work_hours(sh_year, sh_month, sh_day, wd):
                for row in shift_rows:
                    if row['jalali_year'] == sh_year and row['jalali_month'] == sh_month and row['start_day'] <= sh_day <= row['end_day']:
                        val = row.get(SHIFT_DAY_COLUMNS[wd])
                        if val:
                            return val
                        break
                return weekday_map.get(wd, default_work_hours)

            work_hours = resolve_work_hours(sh_year, sh_month, sh_day, weekday).replace(" ", "")
            work_start, work_end = work_hours.split("-") if "-" in work_hours else ("00:00", "00:00")

            entry_time = None
            try:
                mdb_path = r"E:\Hastama\database\Arazdb.mdb"
                password = "meyer#perko"
                conn_str = (r"DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};"
                            rf"DBQ={mdb_path};"
                            rf"PWD={password};")
                conn_access = pyodbc.connect(conn_str)
                cursor_access = conn_access.cursor()
                cursor_access.execute("""
                    SELECT TOP 1 Time
                    FROM TPrsInOut
                    WHERE CardNo = ? AND Date = ?
                    ORDER BY Time ASC
                """, (hozoor_num, today_jalali.strftime('%Y/%m/%d')))
                access_row = cursor_access.fetchone()
                conn_access.close()
                if access_row:
                    entry_time = str(access_row[0]).zfill(4) if access_row[0] is not None else None
                    if len(entry_time) == 4 and entry_time.isdigit():
                        entry_time = f"{entry_time[:2]}:{entry_time[2:]}"
            except Exception:
                entry_time = None

            if not entry_time:
                cursor.execute("""
                    SELECT TOP 1 vrood
                    FROM hozoor
                    WHERE username = ? AND [date] = ?
                    ORDER BY [date]
                """, (username, today_jalali.to_gregorian()))
                row_sql = cursor.fetchone()
                if row_sql and row_sql[0]:
                    entry_time = row_sql[0].strftime('%H:%M') if isinstance(row_sql[0], time) else str(row_sql[0])

            if entry_time:
                default_today_work_hours = (weekday_map.get(weekday) or default_work_hours or "").replace(" ", "")
                if (
                    default_today_work_hours
                    and default_today_work_hours != work_hours
                    and not time_is_inside_range(entry_time, work_hours)
                    and time_is_inside_range(entry_time, default_today_work_hours)
                ):
                    work_hours = default_today_work_hours
                    work_start, work_end = work_hours.split("-", 1)

                presence_summary = build_presence_summary(
                    entry_time=entry_time,
                    work_start=work_start,
                    work_end=work_end,
                    now_time=datetime.now().strftime('%H:%M'),
                )
                presence_summary['entry_time'] = entry_time
                presence_summary['work_start_time'] = presence_summary.get('normalized_work_start', work_start)
                presence_summary['work_end_time'] = presence_summary.get('normalized_work_end', work_end)
                presence_summary['server_now_time'] = datetime.now().strftime('%H:%M:%S')
                presence_summary['today_work_hours'] = convert_to_persian_numbers(presence_summary['today_work_hours'])
                presence_summary['overtime_hours'] = convert_to_persian_numbers(presence_summary['overtime_hours'])
                presence_summary['check_in_time'] = convert_to_persian_numbers(presence_summary['check_in_time'])
                presence_summary['check_out_time'] = convert_to_persian_numbers(presence_summary['check_out_time'])
    except Exception as exc:
        print("presence summary error:", exc)

    return templates.TemplateResponse("user-panel.html", {
    "request": request,
    "approved_count": approved_count_farsi,
    "remaining_count": remaining_count_farsi,
    "overtime_records": overtime_records,
    "formatted_overtime": formatted_time_farsi,
    "ticket_records": ticket_records,
    "pass_records": pass_records,
    "leave_details": leave_details,
    "total_approved_duration": convert_to_persian_numbers(total_approved_duration),
    "message_records": message_records,
    "unread_count": convert_to_persian_numbers(unread_count),
    "total_overtime": formatted_time_farsi,
    "total_approved_pass_duration": convert_to_persian_numbers(total_pass_duration),
    "user_image_url": user_image_url,
    "username": username,
    "today_work_hours": presence_summary.get("today_work_hours", "۰۰:۰۰"),
    "check_in_time": presence_summary.get("check_in_time", "--:--"),
    "check_out_time": presence_summary.get("check_out_time", "--:--"),
    "overtime_hours": presence_summary.get("overtime_hours", "۰۰:۰۰"),
    "ring_green_percent": presence_summary.get("ring_green_percent", 0),
    "ring_blue_percent": presence_summary.get("ring_blue_percent", 0),
    "ring_mode": presence_summary.get("ring_mode", "green"),
    "entry_time": presence_summary.get("entry_time"),
    "work_start_time": presence_summary.get("work_start_time"),
    "work_end_time": presence_summary.get("work_end_time"),
    "server_now_time": presence_summary.get("server_now_time"),
})

# تابع مربوط به نمایش تقویم در پنل کاربری# تابع مربوط به نمایش تقویم در پنل کاربری# تابع مربوط به نمایش تقویم در پنل کاربری
# تابع مربوط به نمایش تقویم در پنل کاربری# تابع مربوط به نمایش تقویم در پنل کاربری# تابع مربوط به نمایش تقویم در پنل کاربری
# تابع مربوط به نمایش تقویم در پنل کاربری# تابع مربوط به نمایش تقویم در پنل کاربری# تابع مربوط به نمایش تقویم در پنل کاربری

class DateResponse(BaseModel):
    year: int
    month: int
    day: int

@app.get("/api/date", response_model=DateResponse)
async def get_date():
    now = jdatetime.datetime.now()  # تاریخ شمسی جاری
    return DateResponse(year=now.year, month=now.month, day=now.day)

# تابع مربوط به دریافت اطلاعات کاربر# تابع مربوط به دریافت اطلاعات کاربر# تابع مربوط به دریافت اطلاعات کاربر# تابع مربوط به دریافت اطلاعات کاربر
# تابع مربوط به دریافت اطلاعات کاربر# تابع مربوط به دریافت اطلاعات کاربر# تابع مربوط به دریافت اطلاعات کاربر# تابع مربوط به دریافت اطلاعات کاربر
# تابع مربوط به دریافت اطلاعات کاربر# تابع مربوط به دریافت اطلاعات کاربر# تابع مربوط به دریافت اطلاعات کاربر# تابع مربوط به دریافت اطلاعات کاربر

@app.get("/get_users")
async def get_users():
    try:
        # اتصال به دیتابیس SQL Server
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        # بازیابی اطلاعات کاربران
        cursor.execute("""
            SELECT username, name
            FROM user_table
        """)
        users = cursor.fetchall()

        # قالب‌بندی داده‌ها برای ارسال به کلاینت
        user_list = [{'value': user[0], 'label': user[1]} for user in users]

        return JSONResponse(content={'success': True, 'users': user_list})

    except Exception as e:
        return JSONResponse(content={'success': False, 'message': str(e)})

    finally:
        cursor.close()
        conn.close()

# تابع مربوط به دریافت اطلاعات کاربر از سشن# تابع مربوط به دریافت اطلاعات کاربر از سشن# تابع مربوط به دریافت اطلاعات کاربر از سشن
# تابع مربوط به دریافت اطلاعات کاربر از سشن# تابع مربوط به دریافت اطلاعات کاربر از سشن# تابع مربوط به دریافت اطلاعات کاربر از سشن
# تابع مربوط به دریافت اطلاعات کاربر از سشن# تابع مربوط به دریافت اطلاعات کاربر از سشن# تابع مربوط به دریافت اطلاعات کاربر از سشن

@app.get("/get_user_info")
async def get_user_info(request: Request):
    # دریافت نام کاربری از سشن
    username = request.session.get('username')

    if not username:
        return JSONResponse(content={'success': False, 'message': 'نام کاربری پیدا نشد'})

    try:
        # اتصال به دیتابیس SQL Server
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        # جلب اطلاعات فردی از جدول user_table
        cursor.execute("""
            SELECT name, last_name, department, work_hours, substitute
            FROM user_table
            WHERE username = ?
        """, (username,))

        user_info = cursor.fetchone()

        if user_info:
            return JSONResponse(content={
                'success': True,
                'data': {
                    'name': user_info[0],
                    'last_name': user_info[1],
                    'department': user_info[2],
                    'work_hours': user_info[3],
                    'substitute': user_info[4]
                }
            })
        else:
            return JSONResponse(content={'success': False, 'message': 'اطلاعات کاربر پیدا نشد'})

    except Exception as e:
        return JSONResponse(content={'success': False, 'message': str(e)})

    finally:
        cursor.close()
        conn.close()

# تابع دریافت اطلاعات کاربر برای صفحه های گزارش انفرادی مرخصی و اضافه کاری
@app.get("/get_user_info_report")
async def get_user_info_report(username: str = Query(...)):
    if not username:
        return JSONResponse(content={'success': False, 'message': 'نام کاربری ارائه نشده است'})

    try:
        # اتصال به دیتابیس SQL Server
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        # جلب اطلاعات فردی از جدول user_table
        cursor.execute("""
            SELECT name, last_name, department, work_hours, substitute
            FROM user_table
            WHERE username = ?
        """, (username,))

        user_info = cursor.fetchone()

        if user_info:
            return JSONResponse(content={
                'success': True,
                'data': {
                    'name': user_info[0],
                    'last_name': user_info[1],
                    'department': user_info[2],
                    'work_hours': user_info[3],
                    'substitute': user_info[4]
                }
            })
        else:
            return JSONResponse(content={'success': False, 'message': 'اطلاعات کاربر پیدا نشد'})

    except Exception as e:
        return JSONResponse(content={'success': False, 'message': str(e)})

    finally:
        cursor.close()
        conn.close()

# روت مربوط به دریافت اطلاعات مرخصی# روت مربوط به دریافت اطلاعات مرخصی# روت مربوط به دریافت اطلاعات مرخصی# روت مربوط به دریافت اطلاعات مرخصی
# روت مربوط به دریافت اطلاعات مرخصی# روت مربوط به دریافت اطلاعات مرخصی# روت مربوط به دریافت اطلاعات مرخصی# روت مربوط به دریافت اطلاعات مرخصی
# روت مربوط به دریافت اطلاعات مرخصی# روت مربوط به دریافت اطلاعات مرخصی# روت مربوط به دریافت اطلاعات مرخصی# روت مربوط به دریافت اطلاعات مرخصی

@app.get("/get_leave_info")
async def get_leave_info(request: Request):
    username = request.session.get('username')  # دریافت نام کاربری از سشن

    if not username:
        print("نام کاربری پیدا نشد")  # چاپ برای بررسی
        raise HTTPException(status_code=400, detail="نام کاربری پیدا نشد")

    try:
        # اتصال به دیتابیس SQL Server
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        # جلب اطلاعات مرخصی‌های کاربر از جدول mrkhc_table
        cursor.execute("""
            SELECT start_date, end_date, days, status
            FROM mrkhc_table
            WHERE username = ?
        """, (username,))

        leave_info = cursor.fetchall()

        # اگر اطلاعات مرخصی وجود داشته باشد
        if leave_info:
            leaves = []
            for row in leave_info:
                
                # تبدیل تاریخ شروع
                start_date_shamsi = 'نامعتبر'
                if row[0]:
                    try:
                        # بررسی فرمت تاریخ میلادی
                        start_date = datetime.strptime(row[0], '%Y-%m-%d') if isinstance(row[0], str) else row[0]
                        # تبدیل تاریخ میلادی به شمسی
                        start_date_shamsi = jdatetime.date.fromgregorian(date=start_date).strftime('%Y/%m/%d')  
                    except Exception as e:
                        start_date_shamsi = 'نامعتبر'

                # تبدیل تاریخ پایان
                end_date_shamsi = 'نامعتبر'
                if row[1]:
                    try:
                        # بررسی فرمت تاریخ میلادی
                        end_date = datetime.strptime(row[1], '%Y-%m-%d') if isinstance(row[1], str) else row[1]
                        # تبدیل تاریخ میلادی به شمسی
                        end_date_shamsi = jdatetime.date.fromgregorian(date=end_date).strftime('%Y/%m/%d')  
                    except Exception as e:
                        end_date_shamsi = 'نامعتبر'

                # اضافه کردن اطلاعات به لیست
                leaves.append({
                    'start_date': start_date_shamsi,
                    'end_date': end_date_shamsi,
                    'days': row[2],
                    'status': row[3] if row[3] else 'انتظار تایید'
                })

            return JSONResponse(content={
                'success': True,
                'data': leaves
            })
        else:
            # اگر هیچ اطلاعاتی یافت نشد، پیام را به صورت خالی ارسال می‌کنیم
            return JSONResponse(content={
                'success': True,
                'data': []
            })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        conn.close()

# تابع مربوط به دریافت لیست دریافت کنندگان# تابع مربوط به دریافت لیست دریافت کنندگان# تابع مربوط به دریافت لیست دریافت کنندگان
# تابع مربوط به دریافت لیست دریافت کنندگان# تابع مربوط به دریافت لیست دریافت کنندگان# تابع مربوط به دریافت لیست دریافت کنندگان
# تابع مربوط به دریافت لیست دریافت کنندگان# تابع مربوط به دریافت لیست دریافت کنندگان# تابع مربوط به دریافت لیست دریافت کنندگان

@app.get("/get_receivers")
async def get_receivers():
    try:
        # اتصال به دیتابیس SQL Server
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        # گرفتن لیست دریافت کنندگان از جدول user_table
        cursor.execute("SELECT username FROM user_table")
        receivers = cursor.fetchall()

        # تبدیل لیست به فرمت JSON
        receiver_list = [receiver[0] for receiver in receivers]  # دریافت فقط نام کاربری
        return JSONResponse(content=receiver_list)

    except Exception as e:
        return JSONResponse(content={'success': False, 'message': str(e)})

    finally:
        cursor.close()
        conn.close()

# تابع ثبت درخواست مرخصی کاربر # تابع ثبت درخواست مرخصی کاربر # تابع ثبت درخواست مرخصی کاربر # تابع ثبت درخواست مرخصی کاربر
# تابع ثبت درخواست مرخصی کاربر # تابع ثبت درخواست مرخصی کاربر # تابع ثبت درخواست مرخصی کاربر # تابع ثبت درخواست مرخصی کاربر
# تابع ثبت درخواست مرخصی کاربر # تابع ثبت درخواست مرخصی کاربر # تابع ثبت درخواست مرخصی کاربر # تابع ثبت درخواست مرخصی کاربر

def persian_to_english_digits(text):
    persian_digits = '۰۱۲۳۴۵۶۷۸۹'
    english_digits = '0123456789'
    translation_table = str.maketrans(persian_digits, english_digits)
    return text.translate(translation_table)


@app.post("/submit_leave")
async def submit_leave(
    request: Request,
    startDate: str = Form(...),
    endDate: str = Form(...),
    days: str = Form(...),
    substitute: str = Form(...)
):
    session = request.session
    username = session.get("username")
    if not username:
        return JSONResponse(content={"success": False, "message": "User not logged in"})

    try:
        if startDate:
            start_date_persian = jdatetime.date(*map(int, startDate.split('/')))
            start_date_gregorian = start_date_persian.togregorian()

        if endDate:
            end_date_persian = jdatetime.date(*map(int, endDate.split('/')))
            end_date_gregorian = end_date_persian.togregorian()

        # تبدیل عدد فارسی به انگلیسی و سپس تبدیل به int
        days_english_str = persian_to_english_digits(days)
        days_int = int(days_english_str)

        try:
            cursor.execute("""
                INSERT INTO mrkhc_table (start_date, end_date, days, substitute, username)
                VALUES (?, ?, ?, ?, ?)
            """, (start_date_gregorian, end_date_gregorian, days_int, substitute, username))
            conn.commit()
            return JSONResponse(content={"success": True, "message": "مرخصی با موفقیت ثبت شد!"})
        except Exception as e:
            print(f"SQL Error: {e}")
            conn.rollback()
            return JSONResponse(content={"success": False, "message": str(e)})

    except ValueError as e:
        print(f"Date or Days Conversion Error: {e}")
        return JSONResponse(content={"success": False, "message": "تاریخ یا تعداد روزها معتبر نیست."})

# تابع ثبت درخواست اضافه کاری کاربر # تابع ثبت درخواست اضافه کاری کاربر # تابع ثبت درخواست اضافه کاری کاربر # تابع ثبت درخواست اضافه کاری کاربر
# تابع ثبت درخواست اضافه کاری کاربر # تابع ثبت درخواست اضافه کاری کاربر # تابع ثبت درخواست اضافه کاری کاربر # تابع ثبت درخواست اضافه کاری کاربر
# تابع ثبت درخواست اضافه کاری کاربر # تابع ثبت درخواست اضافه کاری کاربر # تابع ثبت درخواست اضافه کاری کاربر # تابع ثبت درخواست اضافه کاری کاربر

@app.post("/submit_overtime")
async def submit_overtime(
    request: Request,
    overtimeDate: str = Form(...),
    fromTime: str = Form(...),
    toTime: str = Form(...),
    description: str = Form(...)
):
    session = request.session
    username = session.get("username")
    if not username:
        return JSONResponse(content={"success": False, "message": "User not logged in"})

    try:
        shamsi_parts = overtimeDate.split('/')
        if len(shamsi_parts) != 3:
            return JSONResponse(content={"success": False, "message": "فرمت تاریخ نامعتبر است"})

        year, month, day = map(int, shamsi_parts)
        gregorian_date = jdatetime.date(year, month, day).togregorian()

        query = """
            INSERT INTO ezafe_table (overtime_date, from_time, to_time, description, username, status)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        cursor.execute(query, (gregorian_date, fromTime, toTime, description, username, 'انتظار تایید'))
        conn.commit()

        return JSONResponse(content={"success": True, "message": "اضافه‌کار با موفقیت ثبت شد!"})

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"success": False, "message": f"خطا در ثبت اضافه‌کار: {str(e)}"})

# تابع ثبت درخواست پاس ساعتی کاربر # تابع ثبت درخواست پاس ساعتی کاربر # تابع ثبت درخواست پاس ساعتی کاربر # تابع ثبت درخواست پاس ساعتی کاربر
# تابع ثبت درخواست پاس ساعتی کاربر # تابع ثبت درخواست پاس ساعتی کاربر # تابع ثبت درخواست پاس ساعتی کاربر # تابع ثبت درخواست پاس ساعتی کاربر
# تابع ثبت درخواست پاس ساعتی کاربر # تابع ثبت درخواست پاس ساعتی کاربر # تابع ثبت درخواست پاس ساعتی کاربر # تابع ثبت درخواست پاس ساعتی کاربر

def persian_to_english_numbers(persian_str):
    persian_digits = '۰۱۲۳۴۵۶۷۸۹'
    english_digits = '0123456789'
    translation_table = str.maketrans(''.join(persian_digits), ''.join(english_digits))
    return persian_str.translate(translation_table)

@app.post("/submit_hourly_pass")
async def submit_hourly_pass(request: Request):
    session = request.session
    username = session.get("username")
    if not username:
        return JSONResponse(content={"success": False, "message": "User not logged in"})

    data = await request.json()
    officialTime = data.get('officialTime')
    entryTime = data.get('entryTime')
    exitTime = data.get('exitTime')
    date = data.get('date')  # تاریخ شمسی

    try:
        # تبدیل تاریخ
        if date:
            date_persian = jdatetime.date(*map(int, date.split('/')))
            date_gregorian = date_persian.togregorian()
            date = date_gregorian.strftime('%Y-%m-%d')

        # تبدیل اعداد فارسی به انگلیسی
        if officialTime:
            officialTime = persian_to_english_numbers(officialTime)
        if entryTime:
            entryTime = persian_to_english_numbers(entryTime)
        if exitTime:
            exitTime = persian_to_english_numbers(exitTime)

        # پاس اول وقت
        if officialTime and entryTime:
            cursor.execute("""
                INSERT INTO avalpss_table (officialTime, entryTime, date, username)
                VALUES (?, ?, ?, ?)
            """, (officialTime, entryTime, date, username))

        # پاس بین وقت
        if entryTime and exitTime:
            cursor.execute("""
                INSERT INTO beynpss_table (entryTime, exitTime, date, username)
                VALUES (?, ?, ?, ?)
            """, (entryTime, exitTime, date, username))

        # پاس آخر وقت
        if officialTime and exitTime:
            cursor.execute("""
                INSERT INTO akhrpss_table (officialTime, exitTime, date, username)
                VALUES (?, ?, ?, ?)
            """, (officialTime, exitTime, date, username))

        conn.commit()
        return JSONResponse(content={"success": True})

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"success": False, "message": str(e)})

# تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر
# تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر
# تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر # تابع ثبت تیکت کاربر

@app.post("/submit_ticket")
async def submit_ticket(request: Request):
    session = request.session
    username = session.get("username")
    if not username:
        return JSONResponse(content={"success": False, "message": "User not logged in"})

    data = await request.json()
    ticketTitle = data.get('ticketTitle')
    ticketDescription = data.get('ticketDescription')
    ticketReceiver = data.get('ticketReceiver')

    try:
        ticketDate = datetime.now().strftime('%Y-%m-%d')
        ticketStatus = 'ارسال شده'

        # دریافت آخرین Parent_id از جدول
        cursor.execute("SELECT MAX(Parent_id) FROM ticket_table")
        last_parent_id = cursor.fetchone()[0]

        # تعیین Parent_id جدید
        new_parent_id = 1 if last_parent_id is None else last_parent_id + 1

        # ثبت تیکت
        cursor.execute("""
            INSERT INTO ticket_table (Parent_id, ticketTitle, ticketDescription, username, target_username, ticket_date, ticket_status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (new_parent_id, ticketTitle, ticketDescription, username, ticketReceiver, ticketDate, ticketStatus))

        conn.commit()
        return JSONResponse(content={"success": True, "message": "Ticket submitted successfully!"})

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"success": False, "message": str(e)})

# تابع دریافت اطلاعات کاربر برای صفحه گزارش جامع# تابع دریافت اطلاعات کاربر برای صفحه گزارش جامع# تابع دریافت اطلاعات کاربر برای صفحه گزارش جامع
# تابع دریافت اطلاعات کاربر برای صفحه گزارش جامع# تابع دریافت اطلاعات کاربر برای صفحه گزارش جامع# تابع دریافت اطلاعات کاربر برای صفحه گزارش جامع
# تابع دریافت اطلاعات کاربر برای صفحه گزارش جامع# تابع دریافت اطلاعات کاربر برای صفحه گزارش جامع# تابع دریافت اطلاعات کاربر برای صفحه گزارش جامع

@app.get("/get_user_info_final_report_page/{username}")
def get_user_info_final_report_page(username: str):
    try:
        username = username.strip()
        cursor.execute("""
            SELECT name, last_name, department
            FROM user_table
            WHERE RTRIM(username) = ?
        """, username)
        row = cursor.fetchone()

        if row:
            return {
                "name": row.name,
                "last_name": row.last_name,
                "department": row.department
            }
        else:
            raise HTTPException(status_code=404, detail="کاربر یافت نشد")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"خطای سرور: {str(e)}")

# تابع ثبت دستی حضور و غیاب کاربران# تابع ثبت دستی حضور و غیاب کاربران# تابع ثبت دستی حضور و غیاب کاربران
# تابع ثبت دستی حضور و غیاب کاربران# تابع ثبت دستی حضور و غیاب کاربران# تابع ثبت دستی حضور و غیاب کاربران
# تابع ثبت دستی حضور و غیاب کاربران# تابع ثبت دستی حضور و غیاب کاربران# تابع ثبت دستی حضور و غیاب کاربران

@app.post("/get_hozoor_filtered")
async def get_hozoor_filtered(data: dict = Body(...)):
    try:
        username = data.get("username")
        from_date = data.get("from_date")
        to_date = data.get("to_date")

        if not username or not from_date or not to_date:
            return JSONResponse(status_code=400, content={"error": "اطلاعات ناقص است."})

        from_g = JalaliDate.strptime(from_date, '%Y/%m/%d').to_gregorian()
        to_g = JalaliDate.strptime(to_date, '%Y/%m/%d').to_gregorian()

        # فرض بر اینکه نام ستون تاریخ 'date' است
        cursor.execute("""
            SELECT [date], vrood, khoroj FROM hozoor
            WHERE username = ? AND [date] BETWEEN ? AND ?
            ORDER BY [date]
        """, (username, from_g, to_g))

        rows = cursor.fetchall()

        results = []
        for row in rows:
            shamsi = JalaliDate(row[0]).strftime('%Y/%m/%d')
            vrood_str = row[1].strftime('%H:%M') if isinstance(row[1], time) else str(row[1])
            khorooj_str = row[2].strftime('%H:%M') if isinstance(row[2], time) else str(row[2])

            results.append({
                "tarikh": shamsi,
                "vorood": vrood_str,
                "khorooj": khorooj_str
            })

        return JSONResponse(content=results)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"error": str(e)})

# تابع بارگزاری عکس پروفایل کاربران# تابع بارگزاری عکس پروفایل کاربران# تابع بارگزاری عکس پروفایل کاربران
# تابع بارگزاری عکس پروفایل کاربران# تابع بارگزاری عکس پروفایل کاربران# تابع بارگزاری عکس پروفایل کاربران
# تابع بارگزاری عکس پروفایل کاربران# تابع بارگزاری عکس پروفایل کاربران# تابع بارگزاری عکس پروفایل کاربران

@app.post("/upload-profile-image")
async def upload_profile_image(request: Request, file: UploadFile = File(...)):
    username = request.session.get('username')
    if not username:
        return RedirectResponse(url="/login", status_code=303)

    upload_folder = "app/static/uploads"
    os.makedirs(upload_folder, exist_ok=True)

    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{username}{file_ext}"
    file_path = os.path.join(upload_folder, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ذخیره مسیر فایل در دیتابیس (اختیاری ولی توصیه شده)
    cursor.execute("""
        UPDATE user_table SET profile_image = ? WHERE username = ?
    """, (filename, username))
    conn.commit()

    return RedirectResponse(url="/user_panel", status_code=303)

# تابع حذف عکس پروفایل کاربران# تابع حذف عکس پروفایل کاربران# تابع حذف عکس پروفایل کاربران# تابع حذف عکس پروفایل کاربران
# تابع حذف عکس پروفایل کاربران# تابع حذف عکس پروفایل کاربران# تابع حذف عکس پروفایل کاربران# تابع حذف عکس پروفایل کاربران
# تابع حذف عکس پروفایل کاربران# تابع حذف عکس پروفایل کاربران# تابع حذف عکس پروفایل کاربران# تابع حذف عکس پروفایل کاربران

@app.post("/delete-profile-image")
async def delete_profile_image(request: Request):
    username = request.session.get('username')
    if not username:
        return RedirectResponse(url="/login", status_code=303)

    # دریافت مسیر فعلی عکس
    cursor.execute("SELECT profile_image FROM user_table WHERE username = ?", (username,))
    row = cursor.fetchone()

    if row and row[0]:
        file_path = os.path.join("app/static/uploads", row[0])
        if os.path.exists(file_path):
            os.remove(file_path)

    # حذف از دیتابیس
    cursor.execute("UPDATE user_table SET profile_image = NULL WHERE username = ?", (username,))
    conn.commit()

    return RedirectResponse(url="/user_panel", status_code=303)

# تابع مربوط به صفحه مدیریت# تابع مربوط به صفحه مدیریت# تابع مربوط به صفحه مدیریت# تابع مربوط به صفحه مدیریت
# تابع مربوط به صفحه مدیریت# تابع مربوط به صفحه مدیریت# تابع مربوط به صفحه مدیریت# تابع مربوط به صفحه مدیریت
# تابع مربوط به صفحه مدیریت# تابع مربوط به صفحه مدیریت# تابع مربوط به صفحه مدیریت# تابع مربوط به صفحه مدیریت

# مدل‌های داده برای استفاده در API
class ReportData:
    def __init__(self, username, total_used, total_remaining):
        self.username = username
        self.total_used = total_used
        self.total_remaining = total_remaining

class UserData:
    def __init__(self, username, department, work_hours, substitute, name):
        self.username = username
        self.department = department
        self.work_hours = work_hours
        self.substitute = substitute
        self.name = name

class PassData:
    def __init__(self, row_number, username, total_pass_time):
        self.row_number = row_number
        self.username = username
        self.total_pass_time = total_pass_time

class OvertimeData:
    def __init__(self, row_number, username, total_ezafe_time):
        self.row_number = row_number
        self.username = username
        self.total_ezafe_time = total_ezafe_time

# اتصال به دیتابیس
def get_db_connection():
    conn = pyodbc.connect('DRIVER={SQL Server};SERVER=localhost\\SQLEXPRESS;DATABASE=userDB;Trusted_Connection=yes;')
    return conn

# دریافت اطلاعات از session (در اینجا به صورت تابع فرضی)
def get_user_from_session():
    # باید برای FastAPI پیاده‌سازی کنید که اطلاعات کاربری را از session یا کوکی دریافت کنید
    return "admin_user"  # فرضی

def get_is_admin_from_session():
    # فرضی
    return True

# تبدیل زمان به فرمت hh:mm
def format_time(time_str):
    time_parts = time_str.split(':')
    hours = int(time_parts[0])
    minutes = int(time_parts[1])
    return f"{hours:02}:{minutes:02}"

# تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت
# تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت
# تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت # تابع صفحه مدیریت

@app.get("/admin", response_class=HTMLResponse)
async def admin(request: Request):
    username = get_user_from_session()
    is_admin = get_is_admin_from_session()

    if not username or not is_admin:
        return RedirectResponse(url="/")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # دریافت اطلاعات از جدول leave_report
        cursor.execute("""
            SELECT username, total_days, remaining_days
            FROM leave_report
        """)
        reports = cursor.fetchall()

        # دریافت اطلاعات از جدول user_table
        cursor.execute("""
            SELECT username, department, work_hours, substitute, name
            FROM user_table
        """)
        users_data = cursor.fetchall()

        # پردازش گزارش‌های مرخصی
        report_data = [ReportData(username=report[0], total_used=report[1], total_remaining=report[2]) for report in reports]

        # پردازش اطلاعات کاربران
        users = [UserData(username=user[0], department=user[1], work_hours=user[2], substitute=user[3], name=user[4]) for user in users_data]

        # دریافت مجموع زمان پاس برای هر کاربر از جدول totalpass_table
        cursor.execute("""
            SELECT username, SUM(DATEDIFF(SECOND, 0, pass_duration)) AS total_pass_seconds
            FROM totalpass_table
            WHERE status = 'تایید شده'
            GROUP BY username
        """)
        pass_data = cursor.fetchall()

        # پردازش داده‌های پاس
        pass_reports = [
            PassData(
                row_number=idx + 1,
                username=pass_record[0],
                total_pass_time=f"{pass_record[1] // 3600:02}:{(pass_record[1] % 3600) // 60:02}"
            )
            for idx, pass_record in enumerate(pass_data)
        ]
       
        # دریافت اطلاعات از جدول overtime (اضافه‌کاری)
        cursor.execute("""
            SELECT username, total_ezafe_time
            FROM ezafe_total_table
        """)
        overtime_data = cursor.fetchall()

        # پردازش داده‌های اضافه‌کاری
        overtime_reports = [
            OvertimeData(row_number=idx + 1, username=overtime[0], total_ezafe_time=format_time(overtime[1]))
            for idx, overtime in enumerate(overtime_data)
        ]

        # ساخت لیست کاربران برای منوی کشویی
        user_options = [{'value': user[0], 'label': user[4]} for user in users_data]

        # حذف کاربر در صورت ارسال درخواست POST
        if request.method == 'POST':
            user_to_delete = request.form['username']
            cursor.execute("DELETE FROM user_table WHERE username = ?", (user_to_delete,))
            conn.commit()
            return RedirectResponse(url="/admin")  # پس از حذف، دوباره صفحه را لود می‌کند

        return templates.TemplateResponse("admin.html", {
            "request": request,
            "users": users,
            "reports": report_data,
            "overtime_reports": overtime_reports,
            "pass_reports": pass_reports,
            "user_options": user_options
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر
# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر
# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر# تابع اضافه کردن کاربر

@app.post("/add_user")
async def add_user(
    request: Request,
    name: str = Form(...),
    last_name: str = Form(...),
    department: str = Form(...),
    work_hours: str = Form(...),
    substitute: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    hozoorNum: str = Form(...),  # دقت کن اینجا از hozoorNum استفاده کردم
    shanbeh: str = Form(...),
    yekshanbeh: str = Form(...),
    doshanbeh: str = Form(...),
    seshanbeh: str = Form(...),
    chrshanbeh: str = Form(...),
    panjshanbeh: str = Form(...),
):
    try:
        user_id = random.randint(100, 999)

        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        cursor.execute(''' 
            INSERT INTO user_table (id, username, password, name, last_name, department, substitute, work_hours, role, hozoor_num, 
                                   shanbeh, yekshanbeh, doshanbeh, seshanbeh, chrshanbeh, panjshanbeh)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (user_id, username, password, name, last_name, department, substitute, work_hours, role, hozoorNum, 
              shanbeh, yekshanbeh, doshanbeh, seshanbeh, chrshanbeh, panjshanbeh))

        conn.commit()
        cursor.close()
        conn.close()

        # ذخیره پیام در session نیاز به starlette-session دارد، یا حذفش کن
        # request.session["message"] = "کاربر با موفقیت ذخیره شد."
        return RedirectResponse(url="/admin", status_code=303)

    except Exception as e:
        return {"error": f"خطا در ذخیره کاربر: {str(e)}"}


# تابع بروزرسانی اطلاعات کاربر# تابع بروزرسانی اطلاعات کاربر# تابع بروزرسانی اطلاعات کاربر# تابع بروزرسانی اطلاعات کاربر
# تابع بروزرسانی اطلاعات کاربر# تابع بروزرسانی اطلاعات کاربر# تابع بروزرسانی اطلاعات کاربر# تابع بروزرسانی اطلاعات کاربر
# تابع بروزرسانی اطلاعات کاربر# تابع بروزرسانی اطلاعات کاربر# تابع بروزرسانی اطلاعات کاربر# تابع بروزرسانی اطلاعات کاربر

@app.post("/update_user")
async def update_user(request: Request):
    try:
        data = await request.json()

        username = data.get("username")
        substitute = data.get("substitute")
        work_hours = data.get("work_hours")
        department = data.get("department")

        conn = pyodbc.connect(
            'DRIVER={ODBC Driver 17 for SQL Server};'
            r'SERVER=localhost\SQLEXPRESS;'
            'DATABASE=userDB;'
            'Trusted_Connection=yes;'
        )

        cursor = conn.cursor()

        cursor.execute("""
            UPDATE user_table
            SET substitute = ?, work_hours = ?, department = ?
            WHERE username = ?
        """, (substitute, work_hours, department, username))

        conn.commit()

        return {"success": True}

    except Exception as e:
        return {"success": False, "error": str(e)}

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass

# تابع مدیریت شیفت‌های ماهانه پرسنل # تابع مدیریت شیفت‌های ماهانه پرسنل # تابع مدیریت شیفت‌های ماهانه پرسنل
# تابع مدیریت شیفت‌های ماهانه پرسنل # تابع مدیریت شیفت‌های ماهانه پرسنل # تابع مدیریت شیفت‌های ماهانه پرسنل
# تابع مدیریت شیفت‌های ماهانه پرسنل # تابع مدیریت شیفت‌های ماهانه پرسنل # تابع مدیریت شیفت‌های ماهانه پرسنل

# نگاشت شماره‌ی روز هفته (weekday شمسی: 0=شنبه ... 6=جمعه) به نام ستون جدول shiftha
SHIFT_DAY_COLUMNS = {
    0: 'shanbeh', 1: 'yekshanbeh', 2: 'doshanbeh', 3: 'seshanbeh',
    4: 'chaharshanbeh', 5: 'panjshanbeh', 6: 'jomeh'
}


@app.get("/get_shifts/{username}/{year}/{month}")
async def get_shifts(username: str, year: int, month: int):
    try:
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, start_day, end_day, shanbeh, yekshanbeh, doshanbeh, seshanbeh,
                   chaharshanbeh, panjshanbeh, jomeh, title
            FROM shiftha
            WHERE username = ? AND jalali_year = ? AND jalali_month = ?
            ORDER BY start_day
        """, (username, year, month))
        rows = cursor.fetchall()

        shifts = [{
            'id': r[0], 'start_day': r[1], 'end_day': r[2],
            'shanbeh': r[3] or '', 'yekshanbeh': r[4] or '', 'doshanbeh': r[5] or '',
            'seshanbeh': r[6] or '', 'chaharshanbeh': r[7] or '', 'panjshanbeh': r[8] or '',
            'jomeh': r[9] or '', 'title': r[10] or ''
        } for r in rows]

        return JSONResponse(content={'success': True, 'shifts': shifts})

    except Exception as e:
        return JSONResponse(content={'success': False, 'message': str(e)})

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


@app.post("/add_shift")
async def add_shift(request: Request):
    try:
        data = await request.json()

        username = data.get("username")
        year = int(data.get("jalali_year"))
        month = int(data.get("jalali_month"))
        start_day = int(data.get("start_day"))
        end_day = int(data.get("end_day"))
        title = data.get("title") or None

        if not username or not (1 <= month <= 12) or not (1 <= start_day <= 31) or end_day < start_day:
            return JSONResponse(content={'success': False, 'message': 'اطلاعات ارسالی نامعتبر است'})

        days = {col: (data.get(col) or None) for col in SHIFT_DAY_COLUMNS.values()}

        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        # جلوگیری از همپوشانی بازه‌ها برای همین کاربر و همین ماه شمسی
        cursor.execute("""
            SELECT COUNT(*) FROM shiftha
            WHERE username = ? AND jalali_year = ? AND jalali_month = ?
              AND start_day <= ? AND end_day >= ?
        """, (username, year, month, end_day, start_day))
        if cursor.fetchone()[0] > 0:
            return JSONResponse(content={'success': False, 'message': 'این بازه با یک بازه‌ی تعریف‌شده‌ی دیگر برای همین ماه همپوشانی دارد'})

        cursor.execute("""
            INSERT INTO shiftha (username, jalali_year, jalali_month, start_day, end_day,
                                  shanbeh, yekshanbeh, doshanbeh, seshanbeh, chaharshanbeh, panjshanbeh, jomeh, title)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (username, year, month, start_day, end_day,
              days['shanbeh'], days['yekshanbeh'], days['doshanbeh'], days['seshanbeh'],
              days['chaharshanbeh'], days['panjshanbeh'], days['jomeh'], title))
        conn.commit()

        return JSONResponse(content={'success': True, 'message': 'شیفت با موفقیت ثبت شد'})

    except Exception as e:
        return JSONResponse(content={'success': False, 'message': str(e)})

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


@app.post("/update_shift")
async def update_shift(request: Request):
    try:
        data = await request.json()

        shift_id = int(data.get("id"))
        start_day = int(data.get("start_day"))
        end_day = int(data.get("end_day"))
        title = data.get("title") or None

        if not (1 <= start_day <= 31) or end_day < start_day:
            return JSONResponse(content={'success': False, 'message': 'بازه‌ی روز نامعتبر است'})

        days = {col: (data.get(col) or None) for col in SHIFT_DAY_COLUMNS.values()}

        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        cursor.execute("SELECT username, jalali_year, jalali_month FROM shiftha WHERE id = ?", (shift_id,))
        row = cursor.fetchone()
        if not row:
            return JSONResponse(content={'success': False, 'message': 'شیفت مورد نظر پیدا نشد'})
        username, year, month = row

        cursor.execute("""
            SELECT COUNT(*) FROM shiftha
            WHERE username = ? AND jalali_year = ? AND jalali_month = ?
              AND id <> ? AND start_day <= ? AND end_day >= ?
        """, (username, year, month, shift_id, end_day, start_day))
        if cursor.fetchone()[0] > 0:
            return JSONResponse(content={'success': False, 'message': 'این بازه با یک بازه‌ی تعریف‌شده‌ی دیگر برای همین ماه همپوشانی دارد'})

        cursor.execute("""
            UPDATE shiftha
            SET start_day = ?, end_day = ?, shanbeh = ?, yekshanbeh = ?, doshanbeh = ?,
                seshanbeh = ?, chaharshanbeh = ?, panjshanbeh = ?, jomeh = ?, title = ?
            WHERE id = ?
        """, (start_day, end_day, days['shanbeh'], days['yekshanbeh'], days['doshanbeh'],
              days['seshanbeh'], days['chaharshanbeh'], days['panjshanbeh'], days['jomeh'], title, shift_id))
        conn.commit()

        return JSONResponse(content={'success': True, 'message': 'شیفت با موفقیت به‌روزرسانی شد'})

    except Exception as e:
        return JSONResponse(content={'success': False, 'message': str(e)})

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


@app.post("/delete_shift/{shift_id}")
async def delete_shift(shift_id: int):
    try:
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()
        cursor.execute("DELETE FROM shiftha WHERE id = ?", (shift_id,))
        conn.commit()
        return JSONResponse(content={'success': True, 'message': 'شیفت حذف شد'})

    except Exception as e:
        return JSONResponse(content={'success': False, 'message': str(e)})

    finally:
        try:
            cursor.close()
            conn.close()
        except:
            pass


# تابع دریافت مرخصی های کاربران # تابع دریافت مرخصی های کاربران # تابع دریافت مرخصی های کاربران # تابع دریافت مرخصی های کاربران
# تابع دریافت مرخصی های کاربران # تابع دریافت مرخصی های کاربران # تابع دریافت مرخصی های کاربران # تابع دریافت مرخصی های کاربران
# تابع دریافت مرخصی های کاربران # تابع دریافت مرخصی های کاربران # تابع دریافت مرخصی های کاربران # تابع دریافت مرخصی های کاربران

@app.get("/get_leave_requests")
async def get_leave_requests():
    try:
        conn = pyodbc.connect('DRIVER={SQL Server};SERVER=localhost\\SQLEXPRESS;DATABASE=userDB;Trusted_Connection=yes;')
        cursor = conn.cursor()
        cursor.execute("SELECT id, start_date, end_date, days, substitute, username, status FROM mrkhc_table")
        requests = cursor.fetchall()

        requests_data = []
        for request in requests:
            start_date = request[1]
            end_date = request[2]

            # تبدیل به datetime.date اگر نوعش str بود
            try:
                if isinstance(start_date, str):
                    start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
                start_date_shamsi = jdatetime.date.fromgregorian(date=start_date).strftime('%Y-%m-%d')
            except Exception:
                start_date_shamsi = 'تاریخ ناموجود'

            try:
                if isinstance(end_date, str):
                    end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
                end_date_shamsi = jdatetime.date.fromgregorian(date=end_date).strftime('%Y-%m-%d')
            except Exception:
                end_date_shamsi = 'تاریخ ناموجود'

            requests_data.append({
                'id': request[0],
                'start_date': start_date_shamsi,
                'end_date': end_date_shamsi,
                'days': request[3],
                'substitute': request[4],
                'username': request[5],
                'status': request[6] if request[6] else 'انتظار تایید'
            })

        cursor.close()
        conn.close()
        return JSONResponse(content=requests_data)

    except Exception as e:
        return JSONResponse(content={'error': 'خطا در دریافت درخواست‌ها', 'message': str(e)}, status_code=500)


# تابع بروزرسانی وضعیت مرخصی کاربر # تابع بروزرسانی وضعیت مرخصی کاربر # تابع بروزرسانی وضعیت مرخصی کاربر # تابع بروزرسانی وضعیت مرخصی کاربر
# تابع بروزرسانی وضعیت مرخصی کاربر # تابع بروزرسانی وضعیت مرخصی کاربر # تابع بروزرسانی وضعیت مرخصی کاربر # تابع بروزرسانی وضعیت مرخصی کاربر
# تابع بروزرسانی وضعیت مرخصی کاربر # تابع بروزرسانی وضعیت مرخصی کاربر # تابع بروزرسانی وضعیت مرخصی کاربر # تابع بروزرسانی وضعیت مرخصی کاربر

@app.post("/update_leave_status")
async def update_leave_status(request: Request):
    data = await request.json()
    request_id = data.get('requestId')
    new_status = data.get('status')

    if not request_id or not new_status:
        return JSONResponse(content={'success': False, 'message': 'اطلاعات ناقص ارسال شده است.'})

    try:
        query = """
            UPDATE mrkhc_table
            SET status = ?
            WHERE id = ?
        """
        cursor.execute(query, (new_status, request_id))
        conn.commit()
        return JSONResponse(content={'success': True, 'message': 'وضعیت با موفقیت به‌روزرسانی شد!'})
    except Exception as e:
        print(f"Error updating status: {e}")
        return JSONResponse(content={'success': False, 'message': 'خطا در به‌روزرسانی وضعیت.'})

# تابع تولید گزارش انفرادی مرخصی کاربر # تابع تولید گزارش انفرادی مرخصی کاربر # تابع تولید گزارش انفرادی مرخصی کاربر
# تابع تولید گزارش انفرادی مرخصی کاربر # تابع تولید گزارش انفرادی مرخصی کاربر # تابع تولید گزارش انفرادی مرخصی کاربر
# تابع تولید گزارش انفرادی مرخصی کاربر # تابع تولید گزارش انفرادی مرخصی کاربر # تابع تولید گزارش انفرادی مرخصی کاربر

@app.post("/generate_individual_report")
async def generate_individual_report(request: Request):
    data = await request.json()
    username = data.get('user')         # نام کاربر
    from_date = data.get('fromDate')    # تاریخ شروع (شمسی)
    to_date = data.get('toDate')        # تاریخ پایان (شمسی)

    try:
        # تبدیل تاریخ شمسی به میلادی
        from_date_gregorian = jdatetime.date.fromisoformat(from_date.replace('/', '-')).togregorian()
        to_date_gregorian = jdatetime.date.fromisoformat(to_date.replace('/', '-')).togregorian()

        # تبدیل به رشته مناسب برای SQL
        from_date_str = from_date_gregorian.strftime('%Y-%m-%d')
        to_date_str = to_date_gregorian.strftime('%Y-%m-%d')

        if not username:
            query = """
                SELECT start_date, end_date, days, id, substitute, status, username
                FROM mrkhc_table
                WHERE CONVERT(date, start_date, 120) >= ? 
                AND CONVERT(date, end_date, 120) <= ?
                AND status IN (N'تایید شده', N'رد شده', N'انصراف')
            """
            cursor.execute(query, (from_date_str, to_date_str))
        else:
            query = """
                SELECT start_date, end_date, days, id, substitute, status, username
                FROM mrkhc_table
                WHERE username = ?
                AND CONVERT(date, start_date, 120) >= ? 
                AND CONVERT(date, end_date, 120) <= ?
                AND status IN (N'تایید شده', N'رد شده', N'انصراف')
            """
            cursor.execute(query, (username, from_date_str, to_date_str))

        reports = cursor.fetchall()

        report_data = []
        for report in reports:
            start_date_shamsi = jdatetime.date.fromgregorian(date=report[0]).strftime('%Y/%m/%d')
            end_date_shamsi = jdatetime.date.fromgregorian(date=report[1]).strftime('%Y/%m/%d')
            report_data.append({
                'start_date': start_date_shamsi,
                'end_date': end_date_shamsi,
                'days': report[2],
                'id': report[3],
                'substitute': report[4],
                'status': report[5],
                'username': report[6] if len(report) > 6 else username
            })

        return JSONResponse(content={'success': True, 'reports': report_data})
    
    except Exception as e:
        print("Error:", e)
        return JSONResponse(content={'success': False, 'message': 'خطا در دریافت اطلاعات'})
    
# تابع صفحه گزارش انفرادی مرخصی کاربران # تابع صفحه گزارش انفرادی مرخصی کاربران # تابع صفحه گزارش انفرادی مرخصی کاربران
# تابع صفحه گزارش انفرادی مرخصی کاربران # تابع صفحه گزارش انفرادی مرخصی کاربران # تابع صفحه گزارش انفرادی مرخصی کاربران
# تابع صفحه گزارش انفرادی مرخصی کاربران # تابع صفحه گزارش انفرادی مرخصی کاربران # تابع صفحه گزارش انفرادی مرخصی کاربران

@app.get("/leave_report_page", response_class=HTMLResponse)
async def report_page(request: Request):
    return templates.TemplateResponse("leave_report_page.html", {"request": request})

@app.get("/fetch_user_data")
async def fetch_user_data(username: str = Query(...)):
    try:
        # جستجوی اطلاعات کاربر
        query = """
            SELECT name, last_name, department
            FROM user_table
            WHERE username = ?
        """
        cursor.execute(query, (username,))
        user_info = cursor.fetchone()

        if user_info:
            return {
                "name": user_info[0],
                "last_name": user_info[1],
                "department": user_info[2]
            }
        else:
            return JSONResponse(status_code=404, content={"error": "User not found"})

    except Exception as e:
        print("Error:", e)
        return JSONResponse(status_code=500, content={"error": "Error retrieving user info"})

# تابع دریافت اضافه کاری های کاربران # تابع دریافت اضافه کاری های کاربران # تابع دریافت اضافه کاری های کاربران
# تابع دریافت اضافه کاری های کاربران # تابع دریافت اضافه کاری های کاربران # تابع دریافت اضافه کاری های کاربران
# تابع دریافت اضافه کاری های کاربران # تابع دریافت اضافه کاری های کاربران # تابع دریافت اضافه کاری های کاربران

@app.get("/get_hourly_pass_requests")
async def get_hourly_pass_requests():
    try:
        # اتصال به دیتابیس
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        # فقط درخواست‌های "در انتظار تایید"
        query = """
            SELECT id, request_date, pass_title, pass_duration, username, status
            FROM totalpass_table
            WHERE status = 'انتظار تایید'
        """
        cursor.execute(query)
        hourly_pass_requests = cursor.fetchall()

        requests_data = []
        for request in hourly_pass_requests:
            request_id = request[0]
            request_date_shamsi = jdatetime.date.fromgregorian(date=request[1]).strftime('%Y/%m/%d') if request[1] else 'تاریخ ناموجود'
            pass_duration_str = str(request[3])  # مدت زمان پاس به صورت رشته

            requests_data.append({
                'id': request_id,
                'request_date': request_date_shamsi,
                'pass_title': request[2],
                'pass_duration': pass_duration_str,
                'username': request[4],
                'status': request[5] if request[5] else 'انتظار تایید'
            })

        cursor.close()
        conn.close()

        return JSONResponse(content=requests_data)

    except Exception as e:
        return JSONResponse(
            content={'error': 'خطا در دریافت داده‌های پاس ساعتی‌ها', 'message': str(e)},
            status_code=500
        )

# تابع تغییر وضعیت درخواست پاس ساعتی کاربران # تابع تغییر وضعیت درخواست پاس ساعتی کاربران # تابع تغییر وضعیت درخواست پاس ساعتی کاربران
# تابع تغییر وضعیت درخواست پاس ساعتی کاربران # تابع تغییر وضعیت درخواست پاس ساعتی کاربران # تابع تغییر وضعیت درخواست پاس ساعتی کاربران
# تابع تغییر وضعیت درخواست پاس ساعتی کاربران # تابع تغییر وضعیت درخواست پاس ساعتی کاربران # تابع تغییر وضعیت درخواست پاس ساعتی کاربران

@app.post("/change_hourly_pass_status")
async def change_hourly_pass_status(request: Request):
    try:
        data = await request.json()
        request_id = data.get("id")
        new_status = data.get("status")

        # بروزرسانی وضعیت در جدول totalpass_table
        update_query = """
            UPDATE totalpass_table
            SET status = ?
            WHERE id = ?
        """
        cursor.execute(update_query, (new_status, request_id))
        conn.commit()

        return JSONResponse(content={"success": True})

    except Exception as e:
        return JSONResponse(
            content={"success": False, "message": str(e)},
            status_code=500
        )

# تابع صفحه گزارش پاس ساعتی انفرادی # تابع صفحه گزارش پاس ساعتی انفرادی # تابع صفحه گزارش پاس ساعتی انفرادی
# تابع صفحه گزارش پاس ساعتی انفرادی # تابع صفحه گزارش پاس ساعتی انفرادی # تابع صفحه گزارش پاس ساعتی انفرادی
# تابع صفحه گزارش پاس ساعتی انفرادی # تابع صفحه گزارش پاس ساعتی انفرادی # تابع صفحه گزارش پاس ساعتی انفرادی

@app.get("/hourlypass_Report_page", response_class=HTMLResponse)
async def hourly_pass_report_page(request: Request):
    return templates.TemplateResponse("hourlypass_Report_page.html", {"request": request})

@app.post("/get_hourly_pass_report")
async def get_hourly_pass_report(request: Request):
    try:
        data = await request.json()
        username = data.get('username')
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')

        # تبدیل تاریخ شمسی به میلادی
        start_date_jalali = JalaliDate(*map(int, start_date_str.split('/')))
        end_date_jalali = JalaliDate(*map(int, end_date_str.split('/')))
        start_date = start_date_jalali.to_gregorian()
        end_date = end_date_jalali.to_gregorian()

        if username == 'all_users':
            query = '''
                SELECT id, request_date, pass_title, pass_duration, status, username
                FROM totalpass_table
                WHERE request_date BETWEEN ? AND ? AND status != 'انتظار تایید'
            '''
            cursor.execute(query, (start_date, end_date))
        else:
            query = '''
                SELECT id, request_date, pass_title, pass_duration, status, username
                FROM totalpass_table
                WHERE username = ? AND request_date BETWEEN ? AND ? AND status != 'انتظار تایید'
            '''
            cursor.execute(query, (username, start_date, end_date))

        rows = cursor.fetchall()

        result = []
        for row in rows:
            request_date_shamsi = JalaliDate(row.request_date).strftime('%Y/%m/%d')
            pass_duration_str = row.pass_duration.strftime('%H:%M') if row.pass_duration else None

            result.append({
                'id': row.id,
                'username': row.username,
                'request_date': request_date_shamsi,
                'pass_title': row.pass_title,
                'pass_duration': pass_duration_str,
                'status': row.status
            })

        return JSONResponse(content=result)

    except ValueError:
        return JSONResponse(content={'error': 'تاریخ وارد شده صحیح نیست. لطفاً فرمت صحیح را وارد کنید.'}, status_code=400)

    except Exception as e:
        return JSONResponse(content={'error': str(e)}, status_code=500)

# تابع بروزرسانی وضعیت پاس ساعتی # تابع بروزرسانی وضعیت پاس ساعتی # تابع بروزرسانی وضعیت پاس ساعتی
# تابع بروزرسانی وضعیت پاس ساعتی # تابع بروزرسانی وضعیت پاس ساعتی # تابع بروزرسانی وضعیت پاس ساعتی
# تابع بروزرسانی وضعیت پاس ساعتی # تابع بروزرسانی وضعیت پاس ساعتی # تابع بروزرسانی وضعیت پاس ساعتی

@app.post("/update_hourly_pass_status")
async def update_hourly_pass_status(request: Request):
    try:
        data = await request.json()
        row_id = data.get("id")
        new_status = data.get("status")

        cursor.execute("UPDATE totalpass_table SET status = ? WHERE id = ?", new_status, row_id)
        conn.commit()

        return JSONResponse(content={"success": True})

    except Exception as e:
        return JSONResponse(content={"success": False, "message": str(e)}, status_code=500)

# تابع دریافت اضافه کاری کاربران # تابع دریافت اضافه کاری کاربران # تابع دریافت اضافه کاری کاربران # تابع دریافت اضافه کاری کاربران
# تابع دریافت اضافه کاری کاربران # تابع دریافت اضافه کاری کاربران # تابع دریافت اضافه کاری کاربران # تابع دریافت اضافه کاری کاربران
# تابع دریافت اضافه کاری کاربران # تابع دریافت اضافه کاری کاربران # تابع دریافت اضافه کاری کاربران # تابع دریافت اضافه کاری کاربران

@app.get("/get_overtime_requests")
async def get_overtime_requests():
    try:
        # اتصال به دیتابیس
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        # دریافت اطلاعات اضافه‌کاری
        query = "SELECT id, overtime_date, daily_overtime, description, username, status FROM ezafe_table"
        cursor.execute(query)
        overtime_requests = cursor.fetchall()

        # اگر داده‌ای موجود نبود
        if not overtime_requests:
            return JSONResponse(content=[])

        requests_data = []
        for request in overtime_requests:
            request_id = request[0]
            overtime_date = request[1]
            daily_overtime = request[2]

            # تبدیل تاریخ میلادی به شمسی
            if isinstance(overtime_date, (datetime, date)):
                overtime_date_shamsi = jdatetime.date.fromgregorian(date=overtime_date).strftime('%Y/%m/%d')
            else:
                overtime_date_shamsi = 'تاریخ ناموجود'

            # تبدیل daily_overtime به رشته ساعت و دقیقه
            if isinstance(daily_overtime, (time, datetime)):
                daily_overtime_str = daily_overtime.strftime('%H:%M')
            else:
                daily_overtime_str = '00:00'

            requests_data.append({
                'id': request_id,
                'overtime_date': overtime_date_shamsi,
                'daily_overtime': daily_overtime_str,
                'description': request[3],
                'username': request[4],
                'status': request[5] if request[5] else 'انتظار تایید'
            })

        cursor.close()
        conn.close()

        return JSONResponse(content=requests_data)

    except Exception as e:
        return JSONResponse(
            content={'error': 'خطا در دریافت داده‌های اضافه کاری‌ها', 'message': str(e)}
        )

# تابع بروزرسانی وضعیت اضافه کاری کاربران # تابع بروزرسانی وضعیت اضافه کاری کاربران # تابع بروزرسانی وضعیت اضافه کاری کاربران
# تابع بروزرسانی وضعیت اضافه کاری کاربران # تابع بروزرسانی وضعیت اضافه کاری کاربران # تابع بروزرسانی وضعیت اضافه کاری کاربران
# تابع بروزرسانی وضعیت اضافه کاری کاربران # تابع بروزرسانی وضعیت اضافه کاری کاربران # تابع بروزرسانی وضعیت اضافه کاری کاربران

# تعریف ساختار ورودی با Pydantic
class OvertimeUpdateRequest(BaseModel):
    requestId: int
    status: str

@app.post("/update_overtime_status")
async def update_overtime_status(data: OvertimeUpdateRequest):
    try:
        cursor.execute("""
            UPDATE ezafe_table
            SET status = ?
            WHERE id = ?
        """, (data.status, data.requestId))
        
        conn.commit()

        if cursor.rowcount == 0:
            return JSONResponse(status_code=404, content={"success": False, "message": "هیچ رکوردی برای بروزرسانی پیدا نشد"})
        
        return {"success": True, "message": "وضعیت با موفقیت تغییر کرد!"}
    
    except Exception as e:
        print("Error updating overtime status:", e)
        return JSONResponse(status_code=500, content={"success": False, "message": "خطا در بروزرسانی وضعیت"})

# تابع به‌روزرسانی وضعیت اضافه‌کاری در دیتابیس # تابع به‌روزرسانی وضعیت اضافه‌کاری در دیتابیس # تابع به‌روزرسانی وضعیت اضافه‌کاری در دیتابیس
# تابع به‌روزرسانی وضعیت اضافه‌کاری در دیتابیس # تابع به‌روزرسانی وضعیت اضافه‌کاری در دیتابیس # تابع به‌روزرسانی وضعیت اضافه‌کاری در دیتابیس
# تابع به‌روزرسانی وضعیت اضافه‌کاری در دیتابیس # تابع به‌روزرسانی وضعیت اضافه‌کاری در دیتابیس # تابع به‌روزرسانی وضعیت اضافه‌کاری در دیتابیس

# تعریف مدل ورودی با Pydantic
class OvertimeStatusUpdate(BaseModel):
    id: int
    status: str

@app.post("/update_overtime_Indivisual_status")
async def update_overtime_indivisual_status(data: OvertimeStatusUpdate):
    try:
        query = '''
            UPDATE ezafe_table
            SET status = ?
            WHERE id = ?
        '''
        cursor.execute(query, (data.status, data.id))
        conn.commit()

        if cursor.rowcount == 0:
            return JSONResponse(status_code=404, content={'success': False, 'message': 'رکوردی برای به‌روزرسانی پیدا نشد.'})

        return {'success': True}

    except Exception as e:
        print("Error updating individual overtime status:", e)
        return JSONResponse(status_code=500, content={'success': False, 'message': 'خطا در به‌روزرسانی وضعیت.'})

# تابع گزارش انفرادی اضافه کاری # تابع گزارش انفرادی اضافه کاری # تابع گزارش انفرادی اضافه کاری
# تابع گزارش انفرادی اضافه کاری # تابع گزارش انفرادی اضافه کاری # تابع گزارش انفرادی اضافه کاری
# تابع گزارش انفرادی اضافه کاری # تابع گزارش انفرادی اضافه کاری # تابع گزارش انفرادی اضافه کاری

# رندر کردن صفحه گزارش اضافه‌کاری
@app.get("/overtime_report_page", response_class=HTMLResponse)
async def overtime_report_page(request: Request):
    return templates.TemplateResponse("overtime_report_page.html", {"request": request})

@app.get("/overtime_report", response_class=HTMLResponse)
async def overtime_report(request: Request):
    try:
        query = "SELECT username, total_ezafe_time FROM ezafe_total_table"
        cursor.execute(query)
        results = cursor.fetchall()

        reports = [
            {
                "username": row[0],
                "total_ezafe_time": row[1],
                "row_number": idx + 1
            }
            for idx, row in enumerate(results)
        ]

        return templates.TemplateResponse("overtime_report.html", {"request": request, "reports": reports})
    except Exception as e:
        print("Error:", e)
        return templates.TemplateResponse("overtime_report.html", {"request": request, "reports": []})

@app.post("/get_overtime_report")
async def get_overtime_report(data: dict):
    username = data.get('username')
    start_date_str = data.get('start_date')
    end_date_str = data.get('end_date')

    try:
        start_date_jalali = JalaliDate(*map(int, start_date_str.split('/')))
        end_date_jalali = JalaliDate(*map(int, end_date_str.split('/')))
        start_date = start_date_jalali.to_gregorian()
        end_date = end_date_jalali.to_gregorian()
    except ValueError:
        return JSONResponse({'error': 'تاریخ وارد شده صحیح نیست. لطفاً فرمت صحیح را وارد کنید.'}, status_code=400)

    if username == 'all_users':
        query = '''
            SELECT id, overtime_date, description, status, username, daily_overtime, from_time, to_time
            FROM ezafe_table
            WHERE overtime_date BETWEEN ? AND ?
        '''
        cursor.execute(query, (start_date, end_date))
    else:
        query = '''
            SELECT id, overtime_date, description, status, username, daily_overtime, from_time, to_time
            FROM ezafe_table
            WHERE username = ? AND overtime_date BETWEEN ? AND ?
        '''
        cursor.execute(query, (username, start_date, end_date))

    rows = cursor.fetchall()
    result = []

    for row in rows:
        overtime_date_shamsi = JalaliDate(row.overtime_date).strftime('%Y/%m/%d')
        daily_overtime_shamsi = row.daily_overtime.strftime('%H:%M') if row.daily_overtime else None
        from_time_shamsi = row.from_time.strftime('%H:%M') if row.from_time else None
        to_time_shamsi = row.to_time.strftime('%H:%M') if row.to_time else None

        result.append({
            'id': row.id,
            'overtime_date': convert_to_persian_numbers(overtime_date_shamsi),
            'description': row.description,
            'status': row.status,
            'username': row.username,
            'daily_overtime': convert_to_persian_numbers(daily_overtime_shamsi) if daily_overtime_shamsi else None,
            'from_time': convert_to_persian_numbers(from_time_shamsi) if from_time_shamsi else None,
            'to_time': convert_to_persian_numbers(to_time_shamsi) if to_time_shamsi else None
        })

    return JSONResponse(result)

# تابع دریافت درخواست ها برای ادمین # تابع دریافت درخواست ها برای ادمین # تابع دریافت درخواست ها برای ادمین # تابع دریافت درخواست ها برای ادمین
# تابع دریافت درخواست ها برای ادمین # تابع دریافت درخواست ها برای ادمین # تابع دریافت درخواست ها برای ادمین # تابع دریافت درخواست ها برای ادمین
# تابع دریافت درخواست ها برای ادمین # تابع دریافت درخواست ها برای ادمین # تابع دریافت درخواست ها برای ادمین # تابع دریافت درخواست ها برای ادمین

@app.get("/get_ticket_requests_admin")
async def get_ticket_requests_admin():
    try:
        # اتصال به دیتابیس
        conn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'
                              r'SERVER=localhost\SQLEXPRESS;'
                              'DATABASE=userDB;'
                              'Trusted_Connection=yes;')
        cursor = conn.cursor()

        # کوئری با CTE برای گرفتن اولین پیام از هر مکالمه
        query = '''
            WITH RankedTickets AS (
                SELECT 
                    id, ticketTitle, ticketDescription, username, ticket_date, ticket_status, target_username, Parent_id,
                    ROW_NUMBER() OVER (PARTITION BY Parent_id ORDER BY ticket_date ASC) AS RowNum
                FROM ticket_table
                WHERE target_username = ?
            )
            SELECT id, ticketTitle, ticketDescription, username, ticket_date, ticket_status, target_username, Parent_id
            FROM RankedTickets
            WHERE RowNum = 1
        '''
        cursor.execute(query, ('admin',))
        tickets = cursor.fetchall()

        # تبدیل داده‌ها به دیکشنری و تاریخ به شمسی
        ticket_data = []
        for ticket in tickets:
            ticket_date_shamsi = JalaliDate(ticket.ticket_date).strftime('%Y/%m/%d') if ticket.ticket_date else 'تاریخ نامشخص'
            ticket_data.append({
                'id': ticket.id,
                'ticketTitle': ticket.ticketTitle,
                'ticketDescription': ticket.ticketDescription,
                'username': ticket.username,
                'ticket_date': ticket_date_shamsi,
                'ticket_status': ticket.ticket_status,
                'target_username': ticket.target_username
            })

        cursor.close()
        conn.close()

        return JSONResponse(content=ticket_data)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت
# تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت
# تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت # تابع حذف تیکت

@app.post("/delete-ticket")
async def delete_ticket(request: Request):
    try:
        data = await request.json()
        ticket_id = data.get('ticket_id')

        if not ticket_id:
            return JSONResponse(content={'success': False, 'error': 'شناسه تیکت معتبر نیست'}, status_code=400)

        # تبدیل به عدد صحیح
        ticket_id = int(ticket_id)

        # گرفتن عنوان تیکت
        cursor.execute("SELECT ticketTitle FROM ticket_table WHERE id = ?", (ticket_id,))
        row = cursor.fetchone()

        if row:
            ticket_title = row[0]

            # حذف همه تیکت‌هایی که عنوانشان یکسان است
            cursor.execute("DELETE FROM ticket_table WHERE ticketTitle = ?", (ticket_title,))
            conn.commit()

            return JSONResponse(content={'success': True})
        else:
            return JSONResponse(content={'success': False, 'error': 'تیکت یافت نشد'}, status_code=404)

    except Exception as e:
        print(f"Error deleting ticket: {e}")
        return JSONResponse(content={'success': False, 'error': str(e)}, status_code=500)

# تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت
# تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت
# تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت # تابع بروزرسانی تیکت

@app.post("/update_ticket")
async def update_ticket(request: Request):
    try:
        data = await request.json()
        receiver = data.get("receiver")
        title = data.get("title")
        description = data.get("description")
        ticket_id = data.get("id")

        if not all([receiver, title, description, ticket_id]):
            return JSONResponse(content={"success": False, "error": "اطلاعات ناقص است"}, status_code=400)

        cursor.execute("""
            UPDATE ticket_table
            SET target_username = ?, ticketTitle = ?, ticketDescription = ?
            WHERE id = ?;
        """, (receiver, title, description, ticket_id))
        conn.commit()

        return JSONResponse(content={"success": True})

    except Exception as e:
        print("Error updating ticket:", e)
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)

# تابع دریافت درخواست تیکت ها # تابع دریافت درخواست تیکت ها # تابع دریافت درخواست تیکت ها # تابع دریافت درخواست تیکت ها
# تابع دریافت درخواست تیکت ها # تابع دریافت درخواست تیکت ها # تابع دریافت درخواست تیکت ها # تابع دریافت درخواست تیکت ها
# تابع دریافت درخواست تیکت ها # تابع دریافت درخواست تیکت ها # تابع دریافت درخواست تیکت ها # تابع دریافت درخواست تیکت ها

@app.get("/get_ticket_requests")
async def get_ticket_requests():
    try:
        # اجرای کوئری برای گرفتن رکوردها از جدول ticket_table
        cursor.execute('SELECT id, ticketTitle, ticketDescription, username, ticket_date, ticket_status, target_username FROM ticket_table')
        tickets = cursor.fetchall()

        # تبدیل داده‌ها به یک لیست از دیکشنری‌ها
        ticket_data = []
        for ticket in tickets:
            ticket_data.append({
                'id': ticket.id,
                'ticketTitle': ticket.ticketTitle,
                'ticketDescription': ticket.ticketDescription,
                'username': ticket.username,
                'ticket_date': ticket.ticket_date.strftime('%Y/%m/%d') if ticket.ticket_date else None,
                'ticket_status': ticket.ticket_status,
                'target_username': ticket.target_username
            })

        return JSONResponse(content=ticket_data)
    
    except Exception as e:
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)

# تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت
# تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت
# تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت # تابع بروزرسانی وضعیت تیکت

@app.post("/update_ticket_status")
async def update_ticket_status(request: Request):
    try:
        data = await request.json()
        ticket_id = data.get('id')
        new_status = data.get('ticket_status')

        if not ticket_id or not new_status:
            return JSONResponse(content={"error": "اطلاعات ناقص است"}, status_code=400)

        # دریافت Parent_id رکورد انتخاب‌شده
        cursor.execute("SELECT Parent_id FROM ticket_table WHERE id = ?", (ticket_id,))
        parent_id_row = cursor.fetchone()

        if not parent_id_row:
            return JSONResponse(content={"error": "تیکت مورد نظر یافت نشد"}, status_code=404)

        parent_id = parent_id_row[0]

        # به‌روزرسانی تمام رکوردهایی که Parent_id مشابه دارند
        cursor.execute("UPDATE ticket_table SET ticket_status = ? WHERE Parent_id = ?", (new_status, parent_id))
        conn.commit()

        return JSONResponse(content={"success": True})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get('/get_ticket_details/{ticket_id}')
async def get_ticket_details(ticket_id: int):
    try:
        # دریافت تیکت اصلی
        cursor.execute('''
            SELECT id, ticketTitle, ticketDescription, username, ticket_date, ticket_status, parent_id, target_username
            FROM ticket_table
            WHERE id = ?
        ''', (ticket_id,))
        ticket = cursor.fetchone()

        if not ticket:
            return JSONResponse(content={"error": "Ticket not found"}, status_code=404)

        ticket_datetime = ticket.ticket_date
        ticket_date_shamsi = JalaliDate(ticket_datetime).strftime('%Y/%m/%d')
        ticket_time = ticket_datetime.strftime('%H:%M')

        parent_id = ticket.parent_id
        target_username = ticket.target_username

        # دریافت پیام‌های مرتبط با parent_id
        cursor.execute('''
            SELECT ticketDescription, username, ticket_date
            FROM ticket_table
            WHERE parent_id = ?
            ORDER BY ticket_date ASC
        ''', (parent_id,))
        messages = cursor.fetchall()

        messages_list = []
        for msg in messages:
            msg_datetime = msg.ticket_date
            msg_date_shamsi = JalaliDate(msg_datetime).strftime('%Y/%m/%d')
            msg_time = msg_datetime.strftime('%H:%M')
            messages_list.append({
                'ticketDescription': msg.ticketDescription,
                'username': msg.username,
                'ticket_date': f"{msg_date_shamsi} - {msg_time}"
            })

        ticket_details = {
            'id': ticket.id,
            'ticketTitle': ticket.ticketTitle,
            'ticketDescription': ticket.ticketDescription,
            'username': ticket.username,
            'ticket_date': f"{ticket_date_shamsi} - {ticket_time}",
            'ticket_status': ticket.ticket_status,
            'parent_id': parent_id,
            'target_username': target_username,
            'messages': messages_list
        }

        return JSONResponse(content=ticket_details)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get('/get_ticket_details_payam/{ticket_id}')
async def get_ticket_details_payam(ticket_id: int):
    try:
        # دریافت تیکت اصلی
        cursor.execute('''
            SELECT id, ticketTitle, ticketDescription, username, ticket_date, ticket_status, parent_id, target_username
            FROM ticket_table
            WHERE id = ?
        ''', (ticket_id,))
        ticket = cursor.fetchone()

        if not ticket:
            return JSONResponse(content={"error": "Ticket not found"}, status_code=404)

        ticket_datetime = ticket.ticket_date
        ticket_date_shamsi = JalaliDate(ticket_datetime).strftime('%Y/%m/%d')
        ticket_time = ticket_datetime.strftime('%H:%M')

        parent_id = ticket.parent_id
        target_username = ticket.target_username

        # دریافت پیام‌های مربوط به parent_id
        cursor.execute('''
            SELECT ticketDescription, username, ticket_date
            FROM ticket_table
            WHERE parent_id = ?
            ORDER BY ticket_date ASC
        ''', (parent_id,))
        messages = cursor.fetchall()

        messages_list = []
        for msg in messages:
            msg_datetime = msg.ticket_date
            msg_date_shamsi = JalaliDate(msg_datetime).strftime('%Y/%m/%d')
            msg_time = msg_datetime.strftime('%H:%M')
            messages_list.append({
                'ticketDescription': msg.ticketDescription,
                'username': msg.username,
                'ticket_date': f"{msg_date_shamsi} - {msg_time}"
            })

        ticket_details = {
            'id': ticket.id,
            'ticketTitle': ticket.ticketTitle,
            'ticketDescription': ticket.ticketDescription,
            'username': ticket.username,
            'ticket_date': f"{ticket_date_shamsi} - {ticket_time}",
            'ticket_status': ticket.ticket_status,
            'parent_id': parent_id,
            'target_username': target_username,
            'messages': messages_list
        }

        return JSONResponse(content=ticket_details)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post('/add_ticket_response')
async def add_ticket_response(request: Request):
    try:
        data = await request.json()

        ticketTitle = data.get('ticketTitle')
        ticketDescription = data.get('ticketDescription')
        username = data.get('username')  # فرستنده
        target_username = data.get('target_username')  # هدف
        parent_id = data.get('parent_id')
        ticket_status = data.get('ticket_status')
        ticket_date = datetime.now()

        cursor.execute("""
            INSERT INTO ticket_table (
                ticketTitle, ticketDescription, username, target_username, parent_id, ticket_date, ticket_status, is_read
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (ticketTitle, ticketDescription, target_username, username, parent_id, ticket_date, ticket_status, 0))

        conn.commit()
        return JSONResponse(content={"success": True}, status_code=200)

    except Exception as e:
        print(str(e))
        return JSONResponse(content={"error": "خطا در ثبت پاسخ تیکت"}, status_code=500)
    
@app.post('/add_ticket_response_userpanel')
async def add_ticket_response_userpanel(request: Request):
    try:
        data = await request.json()

        ticketTitle = data.get('ticketTitle')
        ticketDescription = data.get('ticketDescription')
        username = data.get('username')  # فرستنده (کاربر)
        target_username = data.get('target_username')  # هدف (ادمین یا پاسخ‌دهنده)
        parent_id = data.get('parent_id')
        ticket_status = data.get('ticket_status')
        ticket_date = datetime.now()

        cursor.execute("""
            INSERT INTO ticket_table (
                ticketTitle, ticketDescription, username, target_username, parent_id, ticket_date, ticket_status, is_read
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (ticketTitle, ticketDescription, username, target_username, parent_id, ticket_date, ticket_status, 0))

        conn.commit()
        return JSONResponse(content={"success": True}, status_code=200)

    except Exception as e:
        print("Error:", e)
        return JSONResponse(content={"error": "خطا در ثبت پاسخ تیکت"}, status_code=500)
    
@app.post('/mark_ticket_as_read/{ticket_id}')
async def mark_ticket_as_read(ticket_id: int):
    try:
        # دریافت Parent_id
        cursor.execute("SELECT Parent_id FROM ticket_table WHERE id = ?", (ticket_id,))
        parent_id_row = cursor.fetchone()

        if parent_id_row:
            parent_id = parent_id_row[0]
            # به‌روزرسانی رکوردها با همان parent_id
            cursor.execute("UPDATE ticket_table SET is_read = 1 WHERE Parent_id = ?", (parent_id,))
            conn.commit()
            return JSONResponse(content={"success": True}, status_code=200)
        else:
            return JSONResponse(content={"success": False, "error": "Parent_id یافت نشد"}, status_code=404)

    except Exception as e:
        print("Error updating is_read:", str(e))
        return JSONResponse(content={"success": False, "error": str(e)}, status_code=500)

# تابع دریافت گزارش حضور و غیاب # تابع دریافت گزارش حضور و غیاب # تابع دریافت گزارش حضور و غیاب # تابع دریافت گزارش حضور و غیاب
# تابع دریافت گزارش حضور و غیاب # تابع دریافت گزارش حضور و غیاب # تابع دریافت گزارش حضور و غیاب # تابع دریافت گزارش حضور و غیاب
# تابع دریافت گزارش حضور و غیاب # تابع دریافت گزارش حضور و غیاب # تابع دریافت گزارش حضور و غیاب # تابع دریافت گزارش حضور و غیاب

# تبدیل اعداد فارسی به انگلیسی
def convert_farsi_to_english(text: str) -> str:
    farsi_to_english = {
        '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
        '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
    }
    for farsi, english in farsi_to_english.items():
        text = text.replace(farsi, english)
    return text


def normalize_time_value(value) -> str:
    if value is None:
        return "0000"

    if isinstance(value, time):
        return value.strftime("%H%M")

    if isinstance(value, datetime):
        return value.strftime("%H%M")

    if isinstance(value, (int, float)):
        return f"{int(value):04d}"

    text = str(value).strip()
    if not text:
        return "0000"

    lowered = text.lower()
    if lowered in {"none", "null", "na", "n/a", "no", "nok", "unknown", "-"}:
        return "0000"

    cleaned = ''.join(ch for ch in text if ch.isdigit())
    if not cleaned:
        return "0000"

    return cleaned[:4].zfill(4)

from datetime import time

@app.get("/get_hozoor/{username}")
def get_hozoor(username: str, start_date: str = Query(...), end_date: str = Query(...)):
    # تبدیل اعداد فارسی به انگلیسی (تابع شما)
    start_date = convert_farsi_to_english(start_date)
    end_date = convert_farsi_to_english(end_date)

    # اتصال به SQL Server و گرفتن اطلاعات کاربر (مثل قبل)
    conn = pyodbc.connect(r'DRIVER={ODBC Driver 17 for SQL Server};'
                          r'SERVER=localhost\SQLEXPRESS;'
                          r'DATABASE=userDB;'
                          r'Trusted_Connection=yes;')
    cursor = conn.cursor()

    cursor.execute("""
        SELECT hozoor_num, work_hours, shanbeh, yekshanbeh, doshanbeh, seshanbeh, chrshanbeh, panjshanbeh
        FROM user_table 
        WHERE username = ?
    """, (username,))
    user = cursor.fetchone()

    if not user:
        return JSONResponse(content={"error": "کاربر پیدا نشد."}, status_code=404)

    hozoor_num, default_work_hours, shanbeh, yekshanbeh, doshanbeh, seshanbeh, chrshanbeh, panjshanbeh = user
    weekday_map = {0: shanbeh, 1: yekshanbeh, 2: doshanbeh, 3: seshanbeh, 4: chrshanbeh, 5: panjshanbeh}
    # اگر لازم باشه میتونی برای جمعه هم map بذاری یا از default_work_hours استفاده کنی

    # خواندن شیفت‌های اختصاصی این کاربر از جدول shiftha (مستقل برای هر ماه شمسی و قابل تعریف برای بازه‌های خاص داخل ماه)
    cursor.execute("""
        SELECT jalali_year, jalali_month, start_day, end_day,
               shanbeh, yekshanbeh, doshanbeh, seshanbeh, chaharshanbeh, panjshanbeh, jomeh
        FROM shiftha
        WHERE username = ?
        ORDER BY jalali_year, jalali_month, start_day
    """, (username,))
    shift_rows = [{
        'jalali_year': r[0], 'jalali_month': r[1], 'start_day': r[2], 'end_day': r[3],
        'shanbeh': r[4], 'yekshanbeh': r[5], 'doshanbeh': r[6], 'seshanbeh': r[7],
        'chaharshanbeh': r[8], 'panjshanbeh': r[9], 'jomeh': r[10]
    } for r in cursor.fetchall()]

    def resolve_work_hours(sh_year, sh_month, sh_day, wd):
        # اول دنبال بازه‌ی تعریف‌شده در shiftha برای همین ماه/روز می‌گردیم
        for row in shift_rows:
            if row['jalali_year'] == sh_year and row['jalali_month'] == sh_month and row['start_day'] <= sh_day <= row['end_day']:
                val = row.get(SHIFT_DAY_COLUMNS[wd])
                if val:
                    return val
                break  # بازه پیدا شد ولی برای این روز هفته مقداری ثبت نشده → می‌رویم سراغ شیفت پیش‌فرض کاربر
        # در صورت نبود شیفت اختصاصی، همان منطق قبلی (شیفت هفتگی ثابتِ user_table) اجرا می‌شود
        return weekday_map.get(wd, default_work_hours)

    # اتصال به Access و خواندن رکوردها (مثل قبل)
    mdb_path = r"E:\\Hastama\\database\\Arazdb.mdb"
    password = "meyer#perko"
    conn_str = (r"DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};"
                rf"DBQ={mdb_path};"
                rf"PWD={password};")
    conn_access = pyodbc.connect(conn_str)
    cursor_access = conn_access.cursor()

    query = """
    SELECT CardNo, Date, Time, InOutType
    FROM TPrsInOut
    WHERE CardNo = ? AND Date BETWEEN ? AND ?
    """

    # تاریخ شمسی برای Access (چون فیلد Date از نوع Short Text است)
    from_j = start_date
    to_j = end_date

    # تاریخ میلادی برای SQL Server
    from_g = JalaliDate.strptime(start_date, "%Y/%m/%d").to_gregorian()
    to_g = JalaliDate.strptime(end_date, "%Y/%m/%d").to_gregorian()

    # خواندن اطلاعات از Access
    cursor_access.execute(query, (hozoor_num, from_j, to_j))
    rows = cursor_access.fetchall()
    conn_access.close()

    # ساخت دیکشنری attendance از داده‌های اکسس (کمترین entry، بیشترین exit)
    attendance = {}

    for row in rows:
        card_no, date_val, time_val, in_out_type = row

        date_str = str(date_val).replace("/", "-")
        time_val = normalize_time_value(time_val)

        if date_str not in attendance:
            attendance[date_str] = {
                "CardNo": card_no,
                "Date": date_str,
                "Times": []
            }

        attendance[date_str]["Times"].append(time_val)

    for date_str in attendance:
        times = sorted(attendance[date_str]["Times"])

        attendance[date_str]["EntryTime"] = "0000"
        attendance[date_str]["ExitTime"] = "0000"
        attendance[date_str]["EntryTime2"] = "0000"
        attendance[date_str]["ExitTime2"] = "0000"

        if len(times) >= 1:
            attendance[date_str]["EntryTime"] = times[0]

        if len(times) >= 2:
            attendance[date_str]["ExitTime"] = times[1]

        if len(times) >= 3:
            attendance[date_str]["EntryTime2"] = times[2]

        if len(times) >= 4:
            attendance[date_str]["ExitTime2"] = times[3]

    # حالا از جدول hozoor در SQL Server تاریخ‌های ثبت‌شده رو هم اضافه کن
    cursor.execute("""
        SELECT [date], vrood, khoroj FROM hozoor
        WHERE username = ? AND [date] BETWEEN ? AND ?
        ORDER BY [date]
    """, (username, from_g, to_g))
    rows_sql = cursor.fetchall()

    for row in rows_sql:
        g_date, vrood, khoroj = row
        shamsi = JalaliDate(g_date).strftime('%Y-%m-%d')
        if shamsi not in attendance:
            entry = normalize_time_value(vrood)
            exit_ = normalize_time_value(khoroj)
            attendance[shamsi] = {"CardNo": "DB", "Date": shamsi, "EntryTime": entry, "ExitTime": exit_}

    # **اضافه کردن تمام تاریخ‌های بین from_g و to_g که رکورد ندارند**
    total_days = (to_g - from_g).days
    for i in range(total_days + 1):
        g = from_g + timedelta(days=i)
        shamsi = JalaliDate(g).strftime('%Y-%m-%d')
        if shamsi not in attendance:
            # Entry/Exit پیش‌فرض برای روزهای بدون رکورد
            attendance[shamsi] = {
                "CardNo": "",
                "Date": shamsi,
                "EntryTime": "0000",
                "ExitTime": "0000",
                "EntryTime2": "0000",
                "ExitTime2": "0000"
            }

    # حالا پردازش نهایی و تعیین وضعیت — خروجی را به صورت مرتب (بر اساس تاریخ) می‌دهیم
    result = []
    for date_str in sorted(attendance.keys()):
        data = attendance[date_str]
        entry_time = normalize_time_value(data.get("EntryTime"))
        exit_time = normalize_time_value(data.get("ExitTime"))

        sh_year, sh_month, sh_day = map(int, date_str.split('-'))
        weekday = jdatetime.date(sh_year, sh_month, sh_day).weekday()  # مطابق کد قبلی شما
        work_hours = resolve_work_hours(sh_year, sh_month, sh_day, weekday).replace(" ", "")
        try:
            work_start, work_end = sorted(work_hours.split("-"), key=lambda x: int(x.replace(":", "")))
        except:
            work_start, work_end = "00:00", "00:00"

        data["WorkStart"] = work_start
        data["WorkEnd"] = work_end

        # اگر هیچ رکوردی وجود نداشته باشه (مثلاً جمعه یا روز غیبت)، به صورت مشخص علامت می‌زنیم
        if entry_time == "0000" and exit_time == "0000":
            if weekday == 6:  # جمعه
                data["Status"] = "تعطیل"
            else:
                data["Status"] = "غیبت"
            data["CalculatedTime"] = ""
            data["WorkedHours"] = "00:00"
            result.append(data)
            continue

        # در غیر اینصورت، محاسبات قبلی شما (تاخیر/اضافه کاری/خروج زودهنگام و ...) را انجام بده
        entry_hour, entry_minute = int(entry_time[:2]), int(entry_time[2:])
        exit_hour, exit_minute = int(exit_time[:2]), int(exit_time[2:])
        work_start_hour, work_start_minute = int(work_start[:2]), int(work_start[3:])
        work_end_hour, work_end_minute = int(work_end[:2]), int(work_end[3:])

        status_parts = []
        calculated_time = []
        worked_minutes = 0
        overtime_added = delay_added = early_exit_added = False

        if (entry_hour, entry_minute) == (work_start_hour, work_start_minute):
            status_parts.append("تایید سامانه در ورود")
            worked_minutes = (work_end_hour - work_start_hour) * 60 + (work_end_minute - work_start_minute)
        elif (entry_hour > work_start_hour) or (entry_hour == work_start_hour and entry_minute > work_start_minute):
            status_parts.append("ورود با تاخیر")
            if not delay_added:
                delay = (entry_hour - work_start_hour) * 60 + (entry_minute - work_start_minute)
                calculated_time.append(f"مدت زمان تاخیر: {delay//60:02}:{delay%60:02}")
                delay_added = True
            if (exit_hour > work_end_hour) or (exit_hour == work_end_hour and exit_minute > work_end_minute):
                overtime = (exit_hour - work_end_hour) * 60 + (exit_minute - work_end_minute)
                if overtime > 10 and not overtime_added:
                    status_parts.append("اضافه کاری")
                    calculated_time.append(f"مدت زمان اضافه کاری: {overtime//60:02}:{overtime%60:02}")
                    worked_minutes += overtime
                    overtime_added = True
                else:
                    worked_minutes += (work_end_hour - entry_hour) * 60 + (work_end_minute - entry_minute)
        else:
            status_parts.append("شروع زودهنگام")
            early = (work_start_hour - entry_hour) * 60 + (work_start_minute - entry_minute)
            calculated_time.append(f"مدت زمان شروع زودهنگام: {early//60:02}:{early%60:02}")
            worked_minutes = (work_end_hour - work_start_hour) * 60 + (work_end_minute - work_start_minute)

        if (exit_hour, exit_minute) == (work_end_hour, work_end_minute):
            status_parts.append("تایید سامانه در خروج")
        elif (exit_hour < work_end_hour) or (exit_hour == work_end_hour and exit_minute < work_end_minute):
            if not early_exit_added:
                status_parts.append("خروج زودهنگام")
                early_exit = (work_end_hour - exit_hour) * 60 + (work_end_minute - exit_minute)
                calculated_time.append(f"مدت زمان خروج زودهنگام: {early_exit//60:02}:{early_exit%60:02}")
                early_exit_added = True
        elif (exit_hour > work_end_hour) or (exit_hour == work_end_hour and exit_minute > work_end_minute):
            overtime = (exit_hour - work_end_hour) * 60 + (exit_minute - work_end_minute)
            if overtime > 10 and not overtime_added:
                status_parts.append("اضافه کاری")
                calculated_time.append(f"مدت زمان اضافه کاری: {overtime//60:02}:{overtime%60:02}")

        data["Status"] = ", ".join(status_parts)
        data["CalculatedTime"] = "<br>".join(calculated_time)
        data["WorkedHours"] = f"{worked_minutes // 60:02}:{worked_minutes % 60:02}"

        result.append(data)

    # نتیجه مرتب‌شده برگردون
    return result

# ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن
# ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن
# ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن # ثبت دستی ساعت زن

@app.post("/sabt_hozoor")
async def sabt_hozoor(request: Request):
    data = await request.json()

    username = data.get("username") or data.get("usernamedast")
    tarikh_shamsi = data.get("tarikh")
    vorood_str = data.get("vorood")
    khorooj_str = data.get("khorooj")

    if not username or not tarikh_shamsi or not vorood_str or not khorooj_str:
        return JSONResponse(content={"success": False, "message": "لطفاً تمام فیلدها را پر کنید"})

    try:
        # تبدیل تاریخ شمسی به میلادی
        y, m, d = map(int, tarikh_shamsi.split("/"))
        tarikh_miladi = JalaliDate(y, m, d).to_gregorian()
        tarikh_obj = date(tarikh_miladi.year, tarikh_miladi.month, tarikh_miladi.day)

        # تبدیل ساعت‌ها
        vorood_obj = datetime.strptime(vorood_str, "%H:%M").time()
        khorooj_obj = datetime.strptime(khorooj_str, "%H:%M").time()

        # بررسی وجود رکورد قبلی
        cursor.execute("""
            SELECT COUNT(*) FROM hozoor
            WHERE username = ? AND [date] = ?
        """, (username, tarikh_obj))
        record_exists = cursor.fetchone()[0] > 0

        if record_exists:
            # اگر وجود داشت → UPDATE
            cursor.execute("""
                UPDATE hozoor
                SET vrood = ?, khoroj = ?
                WHERE username = ? AND [date] = ?
            """, (vorood_obj, khorooj_obj, username, tarikh_obj))
            message = "اطلاعات قبلی با موفقیت به‌روزرسانی شد"
        else:
            # اگر نبود → INSERT
            cursor.execute("""
                INSERT INTO hozoor (username, [date], vrood, khoroj)
                VALUES (?, ?, ?, ?)
            """, (username, tarikh_obj, vorood_obj, khorooj_obj))
            message = "اطلاعات با موفقیت ثبت شد"

        conn.commit()
        return JSONResponse(content={"success": True, "message": message})

    except Exception as e:
        conn.rollback()
        return JSONResponse(content={"success": False, "message": f"خطا در ثبت اطلاعات: {str(e)}"})


@app.get("/final_report_page", response_class=HTMLResponse)
async def final_report(request: Request):
    MONTH_NAMES = [
        "", "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
    ]

    today = JalaliDate.today()
    month_name = MONTH_NAMES[today.month]
    year = today.year

    # ✅ چاپ در ترمینال برای تست
    print(f"📅 تاریخ امروز شمسی: {month_name} {year}")

    return templates.TemplateResponse("final_report_page.html", {
        "request": request,
        "month_name": month_name,
        "year": year
    })

@app.get("/download_pdf")
async def download_pdf(request: Request):
    # مسیر فایل CSS برای استایل‌دهی PDF
    css_path = os.path.join("static", 'finalReportUserPrint.css')

    # رندر کردن صفحه HTML
    html_content = templates.get_template('finalReportUser.html').render(request=request)

    # تبدیل HTML به PDF همراه با CSS
    pdf_file = pdfkit.from_string(html_content, False, css=css_path)

    # ارسال PDF به عنوان دانلود
    pdf_io = BytesIO(pdf_file)
    return StreamingResponse(pdf_io, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=final_report.pdf"})

@app.get("/get_today_date")
async def get_today_date():
    today = JalaliDate.today()
    return JSONResponse(content={'year': today.year, 'month': today.month, 'day': today.day})   

# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه
# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه
# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه# تابع خروج از سامانه

@app.get("/logout")
async def logout(request: Request, response: Response):
    # حذف username از session
    request.session.pop("username", None)
    
    # ریدایرکت به صفحه اصلی
    return RedirectResponse(url="/login")


