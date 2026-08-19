"""کمک‌کننده‌های ثبت ورود / خروج دستی از صفحهٔ کاربران.

رکورد حضور و غیاب در جدول موجودِ ``hozoor`` نگهداری می‌شود
(``username``، ``date``، ``vrood``، ``khoroj``) — همان جدولی که ثبت دستی
موجود (``/sabt_hozoor``) در آن می‌نویسد و گزارش حضور و غیاب
(``/get_hozoor/{username}``) از آن می‌خواند.  هیچ ساختار ذخیره‌سازیِ
جدیدی معرفی نمی‌شود.
"""
from __future__ import annotations

from datetime import time as _time

STATUS_NOT_CHECKED_IN = "not_checked_in"
STATUS_CHECKED_IN = "checked_in"
STATUS_CHECKED_OUT = "checked_out"


def format_time_value(value) -> str | None:
    """مقدار زمانِ دیتابیس را به رشتهٔ ``HH:MM`` تبدیل می‌کند؛ در صورت خالی بودن ``None``."""
    if value is None:
        return None

    if isinstance(value, _time):
        return value.strftime("%H:%M")

    text = str(value).strip()
    if not text or text.lower() in {"none", "null", "na", "n/a", "-"}:
        return None

    digits = "".join(ch for ch in text if ch.isdigit())
    if len(digits) == 4:
        return f"{digits[:2]}:{digits[2:]}"
    if len(digits) == 6:
        return f"{digits[:2]}:{digits[2:4]}"
    return text


def compute_attendance_status(vrood, khoroj) -> dict:
    """نگاشت یک ردیف از ``hozoor`` (vrood/khoroj) به وضعیت حضور.

    وضعیت‌های ممکن:
      * ``not_checked_in`` — ورودی ثبت نشده
      * ``checked_in`` — ورود ثبت شده و هنوز خروجی ثبت نشده
      * ``checked_out`` — ورود و خروج هر دو ثبت شده
    """
    check_in = format_time_value(vrood)
    check_out = format_time_value(khoroj)

    if check_in and check_out:
        status = STATUS_CHECKED_OUT
    elif check_in:
        status = STATUS_CHECKED_IN
    else:
        status = STATUS_NOT_CHECKED_IN

    return {
        "status": status,
        "check_in": check_in,
        "check_out": check_out,
    }
