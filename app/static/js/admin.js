// تنظیم پلیس هولدر برای فیلدهای تاریخ// تنظیم پلیس هولدر برای فیلدهای تاریخ// تنظیم پلیس هولدر برای فیلدهای تاریخ
// تنظیم پلیس هولدر برای فیلدهای تاریخ// تنظیم پلیس هولدر برای فیلدهای تاریخ// تنظیم پلیس هولدر برای فیلدهای تاریخ
// تنظیم پلیس هولدر برای فیلدهای تاریخ// تنظیم پلیس هولدر برای فیلدهای تاریخ// تنظیم پلیس هولدر برای فیلدهای تاریخ

document.getElementById('fromDate').placeholder = convertToPersianNumbers('1404/01/01');
document.getElementById('toDate').placeholder = convertToPersianNumbers('1404/01/01');
document.getElementById('start_date').placeholder = convertToPersianNumbers('1404/01/01');
document.getElementById('end_date').placeholder = convertToPersianNumbers('1404/01/01');
document.getElementById("start_date").addEventListener("input", convertInputToPersian);
document.getElementById("end_date").addEventListener("input", convertInputToPersian);
document.getElementById('start_date_hourlypass').placeholder = convertToPersianNumbers('1404/01/01');
document.getElementById('end_date_hourlypass').placeholder = convertToPersianNumbers('1404/01/01');
document.getElementById('shanbeh').placeholder = convertToPersianNumbers('12:00 - 24:00');
document.getElementById('yekshanbeh').placeholder = convertToPersianNumbers('12:00 - 24:00');
document.getElementById('doshanbeh').placeholder = convertToPersianNumbers('12:00 - 24:00');
document.getElementById('seshanbeh').placeholder = convertToPersianNumbers('12:00 - 24:00');
document.getElementById('chrshanbeh').placeholder = convertToPersianNumbers('12:00 - 24:00');
document.getElementById('panjshanbeh').placeholder = convertToPersianNumbers('12:00 - 24:00');
document.getElementById('start_date_hozoor').placeholder = convertToPersianNumbers('1404/01/01');
document.getElementById('end_date_hozoor').placeholder = convertToPersianNumbers('1404/01/01');
document.getElementById('newhozoorNum').placeholder = convertToPersianNumbers('باید 8 رقمی وارد کنید');
document.getElementById("start_date_hozoor").addEventListener("input", convertInputToPersian);
document.getElementById("end_date_hozoor").addEventListener("input", convertInputToPersian);

// فارسی شدن ساعت کاری در باکس ایجاد کاربر جدید
document.addEventListener("DOMContentLoaded", function() {
    var options = document.querySelectorAll("select option");
    options.forEach(function(option) {
        option.textContent = convertToPersianNumbers(option.textContent);
    });
});

// تابع برای تبدیل اعداد انگلیسی به فارسی
function convertToPersianNumbers(number) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return number.replace(/\d/g, (digit) => persianNumbers[digit]);
}

// فارسی کردن اعداد جدول گزارش کلی افراد به صورت جامع// فارسی کردن اعداد جدول گزارش کلی افراد به صورت جامع// فارسی کردن اعداد جدول گزارش کلی افراد به صورت جامع
// فارسی کردن اعداد جدول گزارش کلی افراد به صورت جامع// فارسی کردن اعداد جدول گزارش کلی افراد به صورت جامع// فارسی کردن اعداد جدول گزارش کلی افراد به صورت جامع
// فارسی کردن اعداد جدول گزارش کلی افراد به صورت جامع// فارسی کردن اعداد جدول گزارش کلی افراد به صورت جامع// فارسی کردن اعداد جدول گزارش کلی افراد به صورت جامع

function convertToPersian() {
    const elements = document.querySelectorAll('.overTime-allreport-table td');
    elements.forEach(function(element) {
        element.innerHTML = element.innerHTML.replace(/\d+/g, function(match) {
            return match.split('').map(function(digit) {
                return '۰۱۲۳۴۵۶۷۸۹'.charAt(digit);
            }).join('');
        });
    });
}

window.onload = function() {
    convertToPersian();
};

// بستن پیام با کلیک روی ضربدر// بستن پیام با کلیک روی ضربدر// بستن پیام با کلیک روی ضربدر// بستن پیام با کلیک روی ضربدر
// بستن پیام با کلیک روی ضربدر// بستن پیام با کلیک روی ضربدر// بستن پیام با کلیک روی ضربدر// بستن پیام با کلیک روی ضربدر
// بستن پیام با کلیک روی ضربدر// بستن پیام با کلیک روی ضربدر// بستن پیام با کلیک روی ضربدر// بستن پیام با کلیک روی ضربدر

function closeSuccessMessage() {
    var message = document.getElementById('successMessage');
    message.classList.remove('show'); // حذف انیمیشن باز شدن
    setTimeout(function() {
        message.style.display = 'none'; // مخفی کردن پیام بعد از بسته شدن
    }, 500); // تا قبل از انیمیشن بسته شدن
}

// تابع نمایش باکس ها// تابع نمایش باکس ها// تابع نمایش باکس ها// تابع نمایش باکس ها// تابع نمایش باکس ها
// تابع نمایش باکس ها// تابع نمایش باکس ها// تابع نمایش باکس ها// تابع نمایش باکس ها// تابع نمایش باکس ها
// تابع نمایش باکس ها// تابع نمایش باکس ها// تابع نمایش باکس ها// تابع نمایش باکس ها// تابع نمایش باکس ها

function toggleBox(boxId) {
    // پنهان کردن تمام باکس‌ها
    const boxes = document.querySelectorAll('.management-box');
    boxes.forEach(box => box.style.display = 'none');

    // نمایش باکس انتخابی
    const selectedBox = document.getElementById(boxId);
    if (selectedBox) {
        selectedBox.style.display = 'block';
    }

    // اگر مدیریت مرخصی‌ها انتخاب شده باشد، باکس‌های زیر را نیز نمایش دهید
    if (boxId === 'vacationBox') {
        const requestBox = document.getElementById('vacationRequestBox');
        if (requestBox) {
            requestBox.style.display = 'block';
        }

        const individualReportBox = document.getElementById('individualReportBox');
        if (individualReportBox) {
            individualReportBox.style.display = 'block';
        }
    }

    // اگر مدیریت اضافه‌کاری‌ها انتخاب شده باشد، باکس‌های زیر را نیز نمایش دهید
    if (boxId === 'overtimeBox') {
        const overTimeReportBox = document.getElementById('OverTimeReportBox');
        if (overTimeReportBox) {
            overTimeReportBox.style.display = 'block';
        }

        const OverTimeIndivisualReportBox = document.getElementById('OverTimeIndivisualReportBox');
        if (OverTimeIndivisualReportBox) {
            OverTimeIndivisualReportBox.style.display = 'block';
        }
    }

    // اگر مدیریت پاس‌های ساعتی انتخاب شده باشد، باکس زیر را نمایش دهید
    if (boxId === 'hourlyPassBox') {
        const hourlyPassBox = document.getElementById('hourlyPassBox');
        if (hourlyPassBox) {
            hourlyPassBox.style.display = 'block';
        }

        const hourlyPassTotaluser = document.getElementById('hourlyPassTotaluser');
        if (hourlyPassTotaluser) {
            hourlyPassTotaluser.style.display = 'flex';
        }

        const hourlyPassIndivisualuser = document.getElementById('hourlyPassIndivisualuser');
        if (hourlyPassIndivisualuser) {
            hourlyPassIndivisualuser.style.display = 'block';
        }
    }

    // اگر مدیریت تیکت‌ها انتخاب شده باشد، باکس زیر را نمایش دهید
    if (boxId === 'ticketBox') {
        const ticketBox = document.getElementById('ticketBox');
        if (ticketBox) {
            ticketBox.style.display = 'block';
        }
    }

    if (boxId === 'hozoorbox') {
        const hozoorbox = document.getElementById('hozoorbox');
        if (hozoorbox) {
            hozoorbox.style.display = 'block';
        }

        const sabtdst = document.getElementById('sabtdst');
        if (sabtdst) {
            sabtdst.style.display = 'block';
        }

    }

    // اگر همکاران انتخاب شده باشد، نمایش باکس‌های مربوطه
    if (boxId === 'coworkerBox') {
        const newUserBox = document.getElementById('newUserBox');
        const userInfoBox = document.getElementById('userInfoBox');

        // اطمینان از نمایش هر دو باکس
        if (newUserBox) {
            newUserBox.style.display = 'block';
        }

        if (userInfoBox) {
            userInfoBox.style.display = 'block';
        }
    }
}

// تابع برای باز و بسته کردن منوی گزینه‌ها// تابع برای باز و بسته کردن منوی گزینه‌ها// تابع برای باز و بسته کردن منوی گزینه‌ها
// تابع برای باز و بسته کردن منوی گزینه‌ها// تابع برای باز و بسته کردن منوی گزینه‌ها// تابع برای باز و بسته کردن منوی گزینه‌ها
// تابع برای باز و بسته کردن منوی گزینه‌ها// تابع برای باز و بسته کردن منوی گزینه‌ها// تابع برای باز و بسته کردن منوی گزینه‌ها

function toggleMenu() {
    const menuOptions = document.querySelector('.menu-options');
    const menuBtn = document.getElementById("menu-btn");

    // بررسی وضعیت منو
    const isOpen = menuOptions.classList.contains('open');
    
    // تغییر وضعیت منو
    if (isOpen) {
        menuOptions.classList.remove('open'); // بستن منو
    } else {
        menuOptions.classList.add('open'); // باز کردن منو
    }

    // اطمینان از اینکه دکمه منو در جای خود باقی بماند
    menuBtn.classList.toggle("active"); // به دکمه منو کلاس 'active' اضافه می‌کنیم
}

// تابع برای باز و بسته کردن نوار کناری// تابع برای باز و بسته کردن نوار کناری// تابع برای باز و بسته کردن نوار کناری
// تابع برای باز و بسته کردن نوار کناری// تابع برای باز و بسته کردن نوار کناری// تابع برای باز و بسته کردن نوار کناری
// تابع برای باز و بسته کردن نوار کناری// تابع برای باز و بسته کردن نوار کناری// تابع برای باز و بسته کردن نوار کناری

function toggleSidebar() {
    const sidebar = document.querySelector('aside');
    sidebar.classList.toggle('open'); // اضافه یا حذف کردن کلاس 'open' برای باز و بسته شدن نوار منو
}

// تابع برای تبدیل اعداد به فارسی// تابع برای تبدیل اعداد به فارسی// تابع برای تبدیل اعداد به فارسی// تابع برای تبدیل اعداد به فارسی
// تابع برای تبدیل اعداد به فارسی// تابع برای تبدیل اعداد به فارسی// تابع برای تبدیل اعداد به فارسی// تابع برای تبدیل اعداد به فارسی
// تابع برای تبدیل اعداد به فارسی// تابع برای تبدیل اعداد به فارسی// تابع برای تبدیل اعداد به فارسی// تابع برای تبدیل اعداد به فارسی

function convertToPersianNumbers(str) {
    var persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return str.replace(/[0-9]/g, function(digit) {
        return persianNumbers[digit];
    });
}

// تابع برای تغییر فرمت تاریخ از YYYY-MM-DD به YYYY/MM/DD// تابع برای تغییر فرمت تاریخ از YYYY-MM-DD به YYYY/MM/DD
// تابع برای تغییر فرمت تاریخ از YYYY-MM-DD به YYYY/MM/DD// تابع برای تغییر فرمت تاریخ از YYYY-MM-DD به YYYY/MM/DD
// تابع برای تغییر فرمت تاریخ از YYYY-MM-DD به YYYY/MM/DD// تابع برای تغییر فرمت تاریخ از YYYY-MM-DD به YYYY/MM/DD

function formatDate(dateStr) {
    if (!dateStr || typeof dateStr !== "string") return dateStr; // بررسی صحت ورودی
    return dateStr.replace(/-/g, "/"); // جایگزینی '-' با '/'
}

// تابع دریافت اطلاعات درخواست مرخصی های کاربران// تابع دریافت اطلاعات درخواست مرخصی های کاربران// تابع دریافت اطلاعات درخواست مرخصی های کاربران
// تابع دریافت اطلاعات درخواست مرخصی های کاربران// تابع دریافت اطلاعات درخواست مرخصی های کاربران// تابع دریافت اطلاعات درخواست مرخصی های کاربران
// تابع دریافت اطلاعات درخواست مرخصی های کاربران// تابع دریافت اطلاعات درخواست مرخصی های کاربران// تابع دریافت اطلاعات درخواست مرخصی های کاربران

function loadLeaveRequests() {
    fetch('/get_leave_requests')
        .then(response => response.json())
        .then(data => {
            // بررسی اینکه داده دریافتی یک آرایه است
            if (!Array.isArray(data)) {
                console.error('Invalid data received:', data);
                return; // اگر داده آرایه نیست، ادامه نمی‌دهیم
            }

            const tableBody = document.querySelector('#leaveRequestsTable tbody');
            tableBody.innerHTML = ''; // پاک کردن محتوای قبلی

            data.forEach(request => {
                // فقط درخواست‌هایی که وضعیت آنها "انتظار تایید" است نمایش داده می‌شود
                if (request.status === 'انتظار تایید') {
                    const row = document.createElement('tr');
                    row.id = `row_${request.id}`; // اضافه کردن ID برای ردیف جهت حذف بعدی
                    row.innerHTML = `
                        <td>
                            <button class="update-button" onclick="updateStatus(${request.id})">تایید تغییرات</button>
                        </td>
                        <td>
                            <div class="status-container">
                                <div class="status-navbar" id="statusNavbar_${request.id}" onclick="toggleDropdown(${request.id})">
                                    ${convertToPersianNumbers(request.status)} <!-- وضعیت فعلی نمایش داده می‌شود -->
                                </div>
                                <div class="status-dropdown" id="statusDropdown_${request.id}" style="display: none;">
                                    <div class="status-option approved" onclick="changeStatus(${request.id}, 'تایید شده')">تایید شده</div>
                                    <div class="status-option rejected" onclick="changeStatus(${request.id}, 'رد شده')">رد شده</div>
                                    <div class="status-option cancelled" onclick="changeStatus(${request.id}, 'انصراف')">انصراف</div>
                                </div>
                            </div>
                        </td>
                        <td>${convertToPersianNumbers(request.substitute)}</td>
                        <td>${convertToPersianNumbers(request.days)}</td>
                        <td>${convertToPersianNumbers(formatDate(request.end_date))}</td>
                        <td>${convertToPersianNumbers(formatDate(request.start_date))}</td>
                        <td>${convertToPersianNumbers(request.username)}</td>
                    `;
                    tableBody.appendChild(row);

                    changeStatus(request.id, request.status); // اعمال رنگ وضعیت
                    const dropdown = document.querySelector(`#statusDropdown_${request.id}`);
                    dropdown.style.display = 'none'; // پنهان کردن dropdown
                }
            });
        // افزودن event listener برای بستن dropdown زمانی که خارج از آن کلیک می‌شود
        document.addEventListener('click', function (event) {
            // بررسی اینکه آیا کلیک درون یک dropdown نیست
            const dropdowns = document.querySelectorAll('.status-dropdown');
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(event.target) && !event.target.matches('.status-navbar')) {
                    dropdown.style.display = 'none'; // بستن dropdown
                }
            });
        });
    })
    .catch(error => {
        console.error('Error fetching leave requests:', error);
    });
}

// تابع تغییر وضعیت و رنگ navbar هنگام کلیک
function changeStatus(requestId, newStatus) {
    const statusNavbar = document.querySelector(`#statusNavbar_${requestId}`);
    statusNavbar.textContent = convertToPersianNumbers(newStatus);

    // تغییر کلاس navbar بر اساس وضعیت جدید
    if (newStatus === 'تایید شده') {
        statusNavbar.className = 'status-navbar approved';
    } else if (newStatus === 'رد شده') {
        statusNavbar.className = 'status-navbar rejected';
    } else if (newStatus === 'انتظار تایید') {
        statusNavbar.className = 'status-navbar pending';
    } else if (newStatus === 'انصراف') {
        statusNavbar.className = 'status-navbar cancelled';
    }

    toggleDropdown(requestId);
}

// تابع به‌روزرسانی وضعیت در دیتابیس
function updateStatus(requestId) {
    const statusNavbar = document.querySelector(`#statusNavbar_${requestId}`);
    const currentStatus = statusNavbar.textContent.trim(); // وضعیت فعلی که در خانه جدول نمایش داده می‌شود

    // بررسی اینکه وضعیت "انتظار تایید" نباشد
    if (currentStatus === 'انتظار تایید') {
        alert('درخواست در وضعیت انتظار تایید است. تغییرات قابل ثبت نیستند.');
        return; // متوقف کردن ادامه عملیات
    }

    // ارسال وضعیت فعلی به سرور
    fetch('/update_leave_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId, status: currentStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('وضعیت با موفقیت تغییر کرد!');
            // فقط در صورتی که تغییرات با موفقیت انجام شد، ردیف از جدول حذف می‌شود
            setTimeout(() => removeRequestFromTable(requestId), 100); // حذف ردیف بعد از کمی تاخیر
        } else {
            alert('خطا در به‌روزرسانی وضعیت!');
        }
    })
    .catch(error => {
        console.error('Error updating status:', error);
        alert('خطا در به‌روزرسانی وضعیت!');
    });
}

function convertToPersianNumbers(value) {
    if (value === null || value === undefined) {
        return ''; // یا می‌توانید مقدار پیش‌فرض دیگری برگردانید
    }

    // اگر مقدار null یا undefined نبود، آن را به رشته تبدیل می‌کنیم و سپس به اعداد فارسی تبدیل می‌کنیم
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return value.toString().replace(/[0-9]/g, (digit) => persianNumbers[digit]);
}

// حذف ردیف از جدول بعد از تایید
function removeRequestFromTable(requestId) {
    const row = document.querySelector(`#row_${requestId}`);
    if (row) {
        row.remove(); // حذف ردیف از جدول
    }
}

// تابع برای باز و بسته شدن dropdown
function toggleDropdown(requestId) {
    const dropdown = document.querySelector(`#statusDropdown_${requestId}`);
    dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
}

// بارگذاری درخواست‌ها هنگام لود صفحه
document.addEventListener("DOMContentLoaded", loadLeaveRequests);

document.addEventListener("DOMContentLoaded", function() {
    const vacationTable = document.querySelector('.vacation-table');
    if (vacationTable) {
        const cells = vacationTable.querySelectorAll('td');
        cells.forEach(cell => {
            cell.textContent = convertToPersianNumbers(cell.textContent);
        });
    }
});

// تبدیل اعداد انگلیسی به فارسی
function convertToPersianNumbers(input) {
    const englishToPersianMap = {
        '0': '۰',
        '1': '۱',
        '2': '۲',
        '3': '۳',
        '4': '۴',
        '5': '۵',
        '6': '۶',
        '7': '۷',
        '8': '۸',
        '9': '۹'
    };

    return input.replace(/[0-9]/g, (digit) => englishToPersianMap[digit]);
}

// نظارت بر تغییرات در فیلدهای تاریخ
document.getElementById('fromDate').addEventListener('input', function (e) {
    this.value = convertToPersianNumbers(this.value);
});

document.getElementById('toDate').addEventListener('input', function (e) {
    this.value = convertToPersianNumbers(this.value);
});

function convertToFarsiNumbers(text) {
    // اطمینان از اینکه ورودی یک رشته است
    if (typeof text !== 'string') {
        text = String(text);  // اگر ورودی رشته نیست، آن را به رشته تبدیل می‌کنیم
    }

    // تبدیل اعداد انگلیسی به فارسی
    var persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return text.replace(/\d/g, function(match) {
        return persianNumbers[parseInt(match)];
    });
}

//تابع برای تهیه گزارش مرخصی انفرادی//تابع برای تهیه گزارش مرخصی انفرادی//تابع برای تهیه گزارش مرخصی انفرادی
//تابع برای تهیه گزارش مرخصی انفرادی//تابع برای تهیه گزارش مرخصی انفرادی//تابع برای تهیه گزارش مرخصی انفرادی
//تابع برای تهیه گزارش مرخصی انفرادی//تابع برای تهیه گزارش مرخصی انفرادی//تابع برای تهیه گزارش مرخصی انفرادی

document.getElementById('generategozareshmrkReportBtn').addEventListener('click', function () {
    const user = document.getElementById('userSelect').value;
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;

    if (!fromDate || !toDate) {
        alert('لطفاً همه فیلدها را پر کنید');
        return;
    }

    let userSelection = user;
    if (userSelection === 'all') {
        userSelection = '';
    }

    fetch('/generate_individual_report', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: userSelection,
            fromDate: fromDate,
            toDate: toDate,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            const tableBody = document.querySelector('.individual-report-table tbody');
            tableBody.innerHTML = '';
            let rowIndex = 1;

            data.reports.forEach((report) => {
                const row = document.createElement('tr');
                row.id = `row_${report.id}`;
                row.innerHTML = `
                    <td>
                        <button class="update-button" onclick="applyStatusChange(${report.id})">تایید تغییرات</button>
                    </td>
                    <td>
                        <div class="status-container">
                            <div class="status-navbar" id="statusNavbar_${report.id}" onclick="toggleDropdown(${report.id})">
                                ${convertToFarsiNumbers(report.status || 'انتظار تایید')}
                            </div>
                            <div class="status-dropdown" id="statusDropdown_${report.id}" style="display: none;">
                                <div class="status-option approved" onclick="changeStatus(${report.id}, 'تایید شده')">تایید شده</div>
                                <div class="status-option rejected" onclick="changeStatus(${report.id}, 'رد شده')">رد شده</div>
                                <div class="status-option cancelled" onclick="changeStatus(${report.id}, 'انصراف')">انصراف</div>
                            </div>
                        </div>
                    </td>
                    <td>${convertToFarsiNumbers(report.substitute || 'ندارد')}</td>
                    <td>${convertToFarsiNumbers(report.days)}</td>
                    <td>${convertToFarsiNumbers(report.end_date)}</td>
                    <td>${convertToFarsiNumbers(report.start_date)}</td>
                    <td>${report.username ? report.username : 'همه کاربران'}</td>
                    <td>${convertToFarsiNumbers(rowIndex)}</td>
                `;
                tableBody.appendChild(row);
                rowIndex++;
                changeStatus(report.id, report.status);
            });

            document.getElementById('downloadReportBtn').style.display = 'block';
        } else {
            alert(data.message || 'خطا در دریافت گزارش');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('خطا در برقراری ارتباط');
    });
});

// تابع جدید برای تایید تغییرات و ارسال به سرور
function applyStatusChange(requestId) {
    const statusNavbar = document.querySelector(`#statusNavbar_${requestId}`);
    const currentStatus = statusNavbar.textContent.trim(); // وضعیت فعلی که در خانه جدول نمایش داده می‌شود

    // بررسی اینکه وضعیت "انتظار تایید" نباشد
    if (currentStatus === 'انتظار تایید') {
        alert('درخواست در وضعیت انتظار تایید است. تغییرات قابل ثبت نیستند.');
        return; // متوقف کردن ادامه عملیات
    }

    // ارسال وضعیت فعلی به سرور
    fetch('/update_leave_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId, status: currentStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('وضعیت با موفقیت تغییر کرد!');
        } else {
            alert('خطا در به‌روزرسانی وضعیت!');
        }
    })
    .catch(error => {
        console.error('Error updating status:', error);
        alert('خطا در به‌روزرسانی وضعیت!');
    });
}

// تابع تغییر وضعیت و رنگ navbar هنگام کلیک
function changeStatus(requestId, newStatus) {
    const statusNavbar = document.querySelector(`#statusNavbar_${requestId}`);
    statusNavbar.textContent = convertToFarsiNumbers(newStatus);

    // تغییر کلاس navbar بر اساس وضعیت جدید
    if (newStatus === 'تایید شده') {
        statusNavbar.className = 'status-navbar approved';
    } else if (newStatus === 'رد شده') {
        statusNavbar.className = 'status-navbar rejected';
    } else if (newStatus === 'انتظار تایید') {
        statusNavbar.className = 'status-navbar pending';
    } else if (newStatus === 'انصراف') {
        statusNavbar.className = 'status-navbar cancelled';
    }

    // تغییر وضعیت موقت تا تایید نهایی
    const statusDropdown = document.querySelector(`#statusDropdown_${requestId}`);
    statusDropdown.style.display = 'none'; // بستن منو پس از انتخاب
}

// تابع برای نمایش/مخفی کردن منوی وضعیت
function toggleDropdown(requestId) {
    const statusDropdown = document.querySelector(`#statusDropdown_${requestId}`);
    const allDropdowns = document.querySelectorAll('.status-dropdown');

    // بستن تمام dropdown ها
    allDropdowns.forEach(function(dropdown) {
        if (dropdown !== statusDropdown) {
            dropdown.style.display = 'none'; // بستن سایر dropdown ها
        }
    });

    // نمایش یا مخفی کردن منوی وضعیت مربوط به ردیف فعلی
    statusDropdown.style.display = statusDropdown.style.display === 'none' ? 'block' : 'none';
}

// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش
// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش
// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش// تابع دکمه دریافت گزارش

document.getElementById('downloadReportBtn').addEventListener('click', function() {
    // دریافت داده‌های جدول
    const tableRows = document.querySelector('.individual-report-table tbody').rows;
    const reports = [];

    // ساخت آرایه‌ای از داده‌های جدول
    for (let row of tableRows) {
        const status = row.cells[1].innerText.trim();  // وضعیت (معمولاً در ستون دوم است)
        
        // فقط گزارش‌هایی که وضعیت‌شان تایید شده است را اضافه می‌کنیم
        if (status === 'تایید شده') {
            reports.push({
                substitute: row.cells[2].innerText,  // جانشین
                days: row.cells[3].innerText,       // تعداد روزها
                end_date: row.cells[4].innerText,   // تاریخ پایان
                start_date: row.cells[5].innerText, // تاریخ شروع
                row_number: row.cells[6].innerText  // شماره ردیف
            });
        }
    }

    // دریافت username از فرم یا نوار انتخاب کاربر
    const username = document.getElementById('userSelect').value;

    // انتقال داده‌ها و اطلاعات کاربر به صفحه جدید با استفاده از localStorage
    localStorage.setItem('reports', JSON.stringify(reports));
    localStorage.setItem('username', username);

    // باز کردن صفحه جدید در یک تب جدید
    window.open('/leave_report_page', '_blank');
});

// فارسی سازی اعداد درون جدول
function convertNumbersToPersian() {
    // انتخاب تمام سلول‌های جدول
    const tableCells = document.querySelectorAll('#userTable td, #userTable th');

    tableCells.forEach(cell => {
        // بررسی اینکه محتوا عدد است
        if (/\d/.test(cell.textContent)) {
            // تبدیل اعداد انگلیسی به فارسی
            cell.textContent = cell.textContent.replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[digit]);
        }
    });
}

// اجرای تبدیل اعداد پس از بارگذاری صفحه
window.addEventListener('load', convertNumbersToPersian);

// نمایش مدال تایید حذف
function showConfirmDialog(username) {
    document.getElementById('confirmDeleteModal').style.display = "block";
    document.getElementById('confirmDeleteBtn').onclick = function() {
        deleteUser(username);
    };
}

// بستن مدال تایید حذف
function closeConfirmDialog() {
    document.getElementById('confirmDeleteModal').style.display = "none";
}

// حذف کاربر
function deleteUser(username) {
    var form = document.getElementById('form-' + username);
    form.submit(); // ارسال فرم حذف
}

// بستن مدال هنگام کلیک خارج از آن
window.onclick = function(event) {
    if (event.target == document.getElementById('confirmDeleteModal')) {
        closeConfirmDialog();
    }
}

// پاپ برای ویرایش اطلاعات کاربران// پاپ برای ویرایش اطلاعات کاربران// پاپ برای ویرایش اطلاعات کاربران// پاپ برای ویرایش اطلاعات کاربران
// پاپ برای ویرایش اطلاعات کاربران// پاپ برای ویرایش اطلاعات کاربران// پاپ برای ویرایش اطلاعات کاربران// پاپ برای ویرایش اطلاعات کاربران
// پاپ برای ویرایش اطلاعات کاربران// پاپ برای ویرایش اطلاعات کاربران// پاپ برای ویرایش اطلاعات کاربران// پاپ برای ویرایش اطلاعات کاربران

function openEditPopup(username, substitute, work_hours, department) {
    // پاپ‌آپ را نمایش می‌دهیم
    document.getElementById('editPopup').style.display = 'block';

    // فیلدهای فرم را با اطلاعات کاربر پر می‌کنیم
    document.getElementById('editUsername').value = username;

    // انتخاب مقدار جانشین
    var substituteSelect = document.getElementById('editSubstitute');
    substituteSelect.value = substitute;  // مقدار جانشین را انتخاب می‌کنیم

    // انتخاب مقدار ساعت‌های کاری
    var workHoursSelect = document.getElementById('editWorkHours');
    // بررسی می‌کنیم که آیا مقدار ساعت‌های کاری با یکی از گزینه‌ها مطابقت دارد
    workHoursSelect.value = work_hours;  // مقدار ساعت‌های کاری را انتخاب می‌کنیم

    // انتخاب مقدار بخش فعالیت
    var departmentSelect = document.getElementById('editDepartment');
    departmentSelect.value = department;  // مقدار انتخابی را به مقدار department تغییر می‌دهیم
}

function closeEditPopup() {
    // پاپ‌آپ را مخفی می‌کنیم
    document.getElementById('editPopup').style.display = 'none';
}

document.getElementById('saveButton').addEventListener('click', function() {
    document.getElementById('editUserForm').submit(); // فرم را هنگام کلیک روی دکمه ارسال می‌کند
});

function submitForm() {
    // ارسال فرم
    document.getElementById('newUserForm').submit();
}

// هنگام بارگذاری صفحه، انیمیشن باز شدن پیام را اجرا می‌کند
window.addEventListener('DOMContentLoaded', function() {
    var message = document.getElementById('successMessage');
    if (message) {
        setTimeout(function() {
            message.classList.add('show'); // نمایش پیام
        }, 500); // پیام بعد از نیم ثانیه باز می‌شود
    }
});

// تابع جدول درخواست اضافه کاری کاربران// تابع جدول درخواست اضافه کاری کاربران// تابع جدول درخواست اضافه کاری کاربران
// تابع جدول درخواست اضافه کاری کاربران// تابع جدول درخواست اضافه کاری کاربران// تابع جدول درخواست اضافه کاری کاربران
// تابع جدول درخواست اضافه کاری کاربران// تابع جدول درخواست اضافه کاری کاربران// تابع جدول درخواست اضافه کاری کاربران

document.addEventListener("DOMContentLoaded", function() {
    loadOvertimeRequests();  // بارگذاری درخواست‌های اضافه‌کاری
});

// تغییر در بارگذاری داده‌ها
function loadOvertimeRequests() {
    fetch('/get_overtime_requests')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#overTimeRequestTable tbody');
            tableBody.innerHTML = ''; 

            // فیلتر کردن درخواست‌ها به‌طوری که فقط وضعیت "انتظار تایید" نمایش داده شود
            const pendingRequests = data.filter(request => request.status === 'انتظار تایید');

            pendingRequests.forEach((request, index) => {  // اضافه کردن شمارنده index
                const row = document.createElement('tr');
                const rowId = request.id; // استفاده از شناسه یکتا

                let statusClass = '';
                if (request.status === 'انتظار تایید') {
                    statusClass = 'pending-status';
                }

                row.innerHTML = `
                    <td><button class="update-button" onclick="applyStatusChangeForApproval(${rowId})">ثبت تغییرات</button></td>
                    <td>
                        <div class="status-container">
                            <div class="status-navbar ${statusClass}" id="statusNavbar_${rowId}" onclick="toggleRequestDropdown(${rowId})">
                                ${convertToPersianNumbers(request.status)}
                            </div>
                            <div class="status-dropdown" id="requestStatusDropdown_${rowId}" style="display: none;">
                                <div class="status-option approved" onclick="changeStatusForApproval(${rowId}, 'تایید شده')">تایید شده</div>
                                <div class="status-option rejected" onclick="changeStatusForApproval(${rowId}, 'رد شده')">رد شده</div>
                                <div class="status-option cancelled" onclick="changeStatusForApproval(${rowId}, 'انصراف')">انصراف</div>
                            </div>
                        </div>
                    </td>
                    <td>${convertToPersianNumbers(request.description)}</td>
                    <td>${convertToPersianNumbers(request.daily_overtime)}</td>
                    <td>${convertToPersianNumbers(request.overtime_date)}</td>
                    <td>${convertToPersianNumbers(request.username)}</td>
                    <td style="display: none;">${request.id}</td>
                `;

                tableBody.appendChild(row);
            });

            document.addEventListener('click', function (event) {
                const dropdowns = document.querySelectorAll('.status-dropdown');
                dropdowns.forEach(dropdown => {
                    if (!dropdown.contains(event.target) && !event.target.matches('.status-navbar')) {
                        dropdown.style.display = 'none';
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching overtime requests:', error);
        });
}

// تغییرات وضعیت و انتخاب گزینه
function toggleRequestDropdown(rowId) {
    const statusDropdown = document.querySelector(`#requestStatusDropdown_${rowId}`);
    const allDropdowns = document.querySelectorAll('.status-dropdown');

    allDropdowns.forEach(function(dropdown) {
        if (dropdown !== statusDropdown) {
            dropdown.style.display = 'none';
        }
    });

    statusDropdown.style.display = statusDropdown.style.display === 'none' ? 'block' : 'none';
}

// تغییر وضعیت برای ردیف خاص
function changeStatusForApproval(rowId, newStatus) {
    const statusNavbar = document.querySelector(`#statusNavbar_${rowId}`);
    statusNavbar.textContent = convertToPersianNumbers(newStatus);

    let statusClass = '';
    if (newStatus === 'تایید شده') {
        statusClass = 'approved-status';
    } else if (newStatus === 'رد شده') {
        statusClass = 'rejected-status';
    } else if (newStatus === 'انصراف') {
        statusClass = 'cancelled-status';
    }

    statusNavbar.className = 'status-navbar ' + statusClass;

    const statusDropdown = document.querySelector(`#requestStatusDropdown_${rowId}`);
    statusDropdown.style.display = 'none';
}

// تابع تایید تغییرات وضعیت و ارسال به سرور
function applyStatusChangeForApproval(requestId) {
    const statusNavbar = document.querySelector(`#statusNavbar_${requestId}`);
    const currentStatus = statusNavbar.textContent.trim(); // وضعیت فعلی که در خانه جدول نمایش داده می‌شود

    // بررسی اینکه وضعیت "انتظار تایید" نباشد
    if (currentStatus === 'انتظار تایید') {
        alert('درخواست در وضعیت انتظار تایید است. تغییرات قابل ثبت نیستند.');
        return; // متوقف کردن ادامه عملیات
    }

    // دریافت id از سلول مخفی
    const row = document.querySelector(`#statusNavbar_${requestId}`).closest('tr');
    const requestIdFromRow = row.querySelector('td:nth-child(7)').textContent.trim(); // گرفتن id از سلول مخفی

    // ارسال وضعیت فعلی به سرور
    fetch('/update_overtime_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            requestId: requestIdFromRow,
            status: currentStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('وضعیت با موفقیت تغییر کرد!');
            
            // حذف ردیف از جدول پس از ثبت تغییرات
            row.remove(); // حذف ردیف
        } else {
            alert('خطا در به‌روزرسانی وضعیت!');
        }
    })
    .catch(error => {
        console.error('Error updating status:', error);
        alert('خطا در به‌روزرسانی وضعیت!');
    });
}

// تابع تهیه گزارش اضافه کار انفرادی// تابع تهیه گزارش اضافه کار انفرادی// تابع تهیه گزارش اضافه کار انفرادی
// تابع تهیه گزارش اضافه کار انفرادی// تابع تهیه گزارش اضافه کار انفرادی// تابع تهیه گزارش اضافه کار انفرادی
// تابع تهیه گزارش اضافه کار انفرادی// تابع تهیه گزارش اضافه کار انفرادی// تابع تهیه گزارش اضافه کار انفرادی

let filteredData = []; // متغیر برای ذخیره داده‌های فیلتر شده

document.getElementById("submitReport").addEventListener("click", function() {
    const username = document.getElementById("usernameEzafeReport").value;
    const startDate = document.getElementById("start_date").value;
    const endDate = document.getElementById("end_date").value;

    if (!username || !startDate || !endDate) {
        alert("لطفاً تمام فیلدها را پر کنید.");
        return;
    }

    fetch('/get_overtime_report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            start_date: startDate,
            end_date: endDate
        })
    })
    .then(response => response.json())
    .then(data => {
        const tbody = document.getElementById("overTimeIndivisualReportTable").getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';

        filteredData = [];
        let rowNumber = 1; // شماره ردیف از 1 شروع می‌شود
        data.forEach((row, index) => {
            if (['تایید شده', 'رد شده', 'انصراف'].includes(row.status)) {
                const newRow = tbody.insertRow();
                newRow.innerHTML = `
                    <td style="display:none;">${row.id}</td>
                    <td><button class="confirm-changes-btn" onclick="confirmChanges(${rowNumber}, ${row.id})">تایید تغییرات</button></td>
                    <td>
                        <div class="status-container">
                            <div class="status-navbar ${getStatusClass(row.status)}" id="statusNavbar_${rowNumber}" onclick="toggleDropdown(${rowNumber})">
                                ${convertToPersianNumbers(row.status)}
                            </div>
                            <div class="status-dropdown" id="statusDropdown_${rowNumber}" style="display: none;">
                                <div class="status-option approved" onclick="changeEzafeStatusForApproval(${rowNumber}, 'تایید شده')">تایید شده</div>
                                <div class="status-option rejected" onclick="changeEzafeStatusForApproval(${rowNumber}, 'رد شده')">رد شده</div>
                                <div class="status-option cancelled" onclick="changeEzafeStatusForApproval(${rowNumber}, 'انصراف')">انصراف</div>
                            </div>
                        </div>
                    </td>
                    <td>${convertToPersianNumbers(row.description)}</td>
                    <td>${convertToPersianNumbers(row.daily_overtime)}</td>
                    <td>${convertToPersianNumbers(row.overtime_date)}</td>
                    <td>${convertToPersianNumbers(row.username)}</td>
                    <td>${convertToPersianNumbers(rowNumber)}</td>
                `;
                filteredData.push(row);
                rowNumber++; // شماره ردیف را افزایش می‌دهیم
            }
        });

        const downloadReportBtn = document.getElementById("downloadOvertimeReport");
        downloadReportBtn.style.display = 'inline-block';
        document.getElementById('downloadOvertimeReport').style.display = 'block';

    })
    .catch(error => {
        console.error('Error:', error);
        alert("خطا در دریافت داده‌ها.");
    });

});

// تابع دکمه دریافت گزارش برای صفحه جدید
document.getElementById("downloadOvertimeReport").addEventListener("click", function () {
    // پاک کردن داده‌های قبلی localStorage
    localStorage.removeItem("overtimeReports");
    localStorage.removeItem("username");

    const username = document.getElementById("usernameEzafeReport").value;

    // جلوگیری از ذخیره "همه کاربران" یا مقدار خالی
    if (!username || username === "all_users") {
        alert("لطفاً یک کاربر خاص انتخاب کنید.");
        return;
    }

    const reports = [];

    // فقط موارد تایید شده رو اضافه کن
    filteredData.forEach(row => {
        if (row.status === 'تایید شده') {
            reports.push({
                description: row.description,
                daily_overtime: row.daily_overtime,
                overtime_date: row.overtime_date,
                username: row.username
            });
        }
    });

    // ذخیره داده‌ها در localStorage
    localStorage.setItem("overtimeReports", JSON.stringify(reports));
    localStorage.setItem("username", username);

    console.log("کاربر انتخاب‌شده:", username);

    // باز کردن صفحه گزارش
    window.open('/overtime_report_page', '_blank');
});



// تابع تایید تغییرات که وضعیت را در دیتابیس تغییر می‌دهد
function confirmChanges(rowNumber, id) {
    const newStatus = document.getElementById('statusNavbar_' + rowNumber).innerText; // وضعیت جدید از صفحه گرفته می‌شود
    
    // ارسال وضعیت جدید به سرور
    fetch('/update_overtime_Indivisual_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: id,
            status: newStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("وضعیت با موفقیت تغییر کرد.");
        } else {
            alert("خطا در تغییر وضعیت.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("خطا در ارسال درخواست.");
    });
}

// تابع تغییر وضعیت برای گزارش‌های اضافه‌کاری فردی
function changeEzafeStatusForApproval(index, status) {
    const statusNavbar = document.getElementById('statusNavbar_' + index);
    statusNavbar.innerText = convertToPersianNumbers(status);
    statusNavbar.className = 'status-navbar ' + getStatusClass(status);
    
    const currentDropdown = document.getElementById('statusDropdown_' + index);
    currentDropdown.style.display = 'none';
}

// تابع برای باز و بسته کردن منوی وضعیت‌ها
function toggleDropdown(index) {
    const allDropdowns = document.querySelectorAll('.status-dropdown');
    allDropdowns.forEach(dropdown => dropdown.style.display = 'none');
    
    const currentDropdown = document.getElementById('statusDropdown_' + index);
    if (currentDropdown.style.display === 'none' || currentDropdown.style.display === '') {
        currentDropdown.style.display = 'block';
    } else {
        currentDropdown.style.display = 'none';
    }
}

// تابع برای دریافت کلاس مناسب برای وضعیت
function getStatusClass(status) {
    switch (status) {
        case 'تایید شده':
            return 'approved-status';
        case 'رد شده':
            return 'rejected-status';
        case 'انصراف':
            return 'cancelled-status';
        default:
            return 'pending-status';
    }
}

function convertToPersianNumbers(input) {
    if (typeof input !== 'string') {
        input = input.toString(); // تبدیل ورودی به رشته
    }
    return input.replace(/[0-9]/g, function(d) {
        return String.fromCharCode(d.charCodeAt(0) + 1728); // تبدیل اعداد لاتین به فارسی
    });
}

/* جدول مدیریت درخواست پاس های ساعتی کاربران *//* جدول مدیریت درخواست پاس های ساعتی کاربران *//* جدول مدیریت درخواست پاس های ساعتی کاربران */
/* جدول مدیریت درخواست پاس های ساعتی کاربران *//* جدول مدیریت درخواست پاس های ساعتی کاربران *//* جدول مدیریت درخواست پاس های ساعتی کاربران */
/* جدول مدیریت درخواست پاس های ساعتی کاربران *//* جدول مدیریت درخواست پاس های ساعتی کاربران *//* جدول مدیریت درخواست پاس های ساعتی کاربران */

function formatTimeToHourMinute(time) {
    const timeParts = time.split(':'); // جدا کردن ساعت، دقیقه و ثانیه
    return `${timeParts[0]}:${timeParts[1]}`; // فقط ساعت و دقیقه را برمی‌گرداند
}

// فراخوانی این تابع بعد از بارگذاری صفحه یا در هنگام لود شدن بخشی از اپلیکیشن
loadHourlyPassRequests();
function loadHourlyPassRequests() {
    fetch('/get_hourly_pass_requests')  // درخواست به سرور
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#hourlyPassReportTable tbody');
            tableBody.innerHTML = ''; 

            // نمایش داده‌ها در جدول
            data.forEach((request, index) => {
                const row = document.createElement('tr');
                const rowId = request.id;

                // انتخاب کلاس برای هر وضعیت
                let statusClass = getHourlyStatusClass(request.status);

                row.innerHTML = `
                    <td><button class="update-button" onclick="applyStatusChangeForHourlyPass(${rowId})">ثبت تغییرات</button></td>
                    <td>
                        <div class="status-container">
                            <div class="status-navbar ${statusClass}" id="statusNavbarHourly_${rowId}" onclick="toggleRequestHourlypassDropdown(${rowId})">
                                ${convertToPersianNumbers(request.status)}
                            </div>
                            <div class="status-dropdown" id="requestStatusDropdown_${rowId}" style="display: none;">
                                <div class="status-option approved" onclick="changeHourlyPassStatus(${rowId}, 'تایید شده')">تایید شده</div>
                                <div class="status-option rejected" onclick="changeHourlyPassStatus(${rowId}, 'رد شده')">رد شده</div>
                                <div class="status-option cancelled" onclick="changeHourlyPassStatus(${rowId}, 'انصراف')">انصراف</div>
                            </div>
                        </div>
                    </td>
                    <td>${convertToPersianNumbers(formatTimeToHourMinute(request.pass_duration))}</td>  <!-- نمایش زمان به صورت ساعت و دقیقه -->
                    <td>${convertToPersianNumbers(request.pass_title)}</td>
                    <td>${convertToPersianNumbers(request.request_date)}</td>
                    <td>${convertToPersianNumbers(request.username)}</td>
                    <td style="display: none;">${request.id}</td>
                `;

                tableBody.appendChild(row);
            });

            document.addEventListener('click', function (event) {
                const dropdowns = document.querySelectorAll('.status-dropdown');
                dropdowns.forEach(dropdown => {
                    if (!dropdown.contains(event.target) && !event.target.matches('.status-navbar')) {
                        dropdown.style.display = 'none';
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error fetching hourly pass requests:', error);
        });
}

// تغییر وضعیت و باز و بسته کردن منوی کشویی
function toggleRequestHourlypassDropdown(rowId) {
    const statusNavbar = document.querySelector(`#statusNavbarHourly_${rowId}`);
    const currentDropdown = document.querySelector(`#requestStatusDropdown_${rowId}`);

    // بستن همه منوهای کشویی
    const allHourlyDropdowns = document.querySelectorAll('.status-dropdown');
    allHourlyDropdowns.forEach(dropdown => dropdown.style.display = 'none');

    // باز و بسته کردن منوی کشویی مربوطه
    if (currentDropdown.style.display === 'none' || currentDropdown.style.display === '') {
        currentDropdown.style.display = 'block';  // باز کردن منوی کشویی
    } else {
        currentDropdown.style.display = 'none';  // بستن منوی کشویی
    }
}

// تابع برای انتخاب کلاس مناسب به‌ازای هر وضعیت
function getHourlyStatusClass(status) {
    switch (status) {
        case 'تایید شده':
            return 'approved-status';
        case 'رد شده':
            return 'rejected-status';
        case 'انصراف':
            return 'cancelled-status';
        default:
            return 'pending-status';  // وضعیت پیش‌فرض (انتظار تایید)
    }
}



// تابع تغییر وضعیت و رنگ navbar هنگام کلیک
function changeHourlyPassStatus(requestId, newStatus) {
    const statusNavbar = document.getElementById('statusNavbarHourly_' + requestId);
    statusNavbar.innerText = convertToPersianNumbers(newStatus);
    
    // تغییر کلاس navbar بر اساس وضعیت جدید
    statusNavbar.className = 'status-navbar ' + getHourlyStatusClass(newStatus);

    const currentDropdown = document.getElementById('requestStatusDropdown_' + requestId);
    currentDropdown.style.display = 'none';  // بستن منوی کشویی
}

// تابع برای ارسال تغییرات به سرور (برای اعمال تغییرات در دیتابیس)
function applyStatusChangeForHourlyPass(rowId) {
    const statusNavbar = document.querySelector(`#statusNavbarHourly_${rowId}`);
    const currentStatus = statusNavbar.textContent.trim(); // وضعیت فعلی که در خانه جدول نمایش داده می‌شود

    // بررسی اینکه وضعیت "انتظار تایید" نباشد
    if (currentStatus === 'انتظار تایید') {
        alert('درخواست در وضعیت انتظار تایید است. تغییرات قابل ثبت نیستند.');
        return; // متوقف کردن ادامه عملیات
    }

    // دریافت id از سلول مخفی
    const row = document.querySelector(`#statusNavbarHourly_${rowId}`).closest('tr');
    const requestIdFromRow = row.querySelector('td:nth-child(7)').textContent.trim(); // گرفتن id از سلول مخفی

    // ارسال وضعیت فعلی به سرور
    fetch('/change_hourly_pass_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: requestIdFromRow, // ارسال شناسه درخواست
            status: currentStatus // ارسال وضعیت فعلی
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('وضعیت با موفقیت تغییر کرد!');
            
            // بروزرسانی وضعیت نمایش داده‌شده در جدول
            statusNavbar.textContent = convertToPersianNumbers(currentStatus);  // تبدیل وضعیت به اعداد فارسی
    
            // تغییر کلاس‌های وضعیت (برای اعمال رنگ و استایل جدید)
            statusNavbar.className = `status-navbar ${getHourlyStatusClass(currentStatus)}`;
    
            // بستن منوی کشویی
            const statusDropdown = document.querySelector(`#requestStatusDropdown_${rowId}`);
            statusDropdown.style.display = 'none';
    
            // حذف ردیف از جدول پس از تایید
            const row = document.querySelector(`#statusNavbarHourly_${rowId}`).closest('tr');
            row.remove();  // حذف ردیف از جدول
        } else {
            alert('خطا در به‌روزرسانی وضعیت!');
        }
    })
    
    .catch(error => {
        console.error('Error updating status:', error);
        alert('خطا در به‌روزرسانی وضعیت!');
    });
}

/* تابع برای فارسی کردن اعداد جدول گزارش کلی پاس های ساعتی کاربران *//* تابع برای فارسی کردن اعداد جدول گزارش کلی پاس های ساعتی کاربران */
/* تابع برای فارسی کردن اعداد جدول گزارش کلی پاس های ساعتی کاربران *//* تابع برای فارسی کردن اعداد جدول گزارش کلی پاس های ساعتی کاربران */
/* تابع برای فارسی کردن اعداد جدول گزارش کلی پاس های ساعتی کاربران *//* تابع برای فارسی کردن اعداد جدول گزارش کلی پاس های ساعتی کاربران */

function toPersianNumber(number) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return number.toString().replace(/\d/g, function(digit) {
        return persianDigits[parseInt(digit)];
    });
}

// استفاده در جدول‌ها و تبدیل اعداد
function convertTableNumbers() {
    const cells = document.querySelectorAll('td, th');
    cells.forEach(cell => {
        if (cell.innerText.match(/\d/)) {
            cell.innerText = toPersianNumber(cell.innerText);
        }
    });
}

// تبدیل اعداد در زمان بارگذاری صفحه
document.addEventListener('DOMContentLoaded', function() {
    convertTableNumbers();
});

// تابع تبدیل اعداد انگلیسی به فارسی (تعریف‌شده توسط شما)
function toPersianNumber(number) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return number.toString().replace(/\d/g, function(digit) {
        return persianDigits[parseInt(digit)];
    });
}

// رویداد تبدیل اعداد هنگام تایپ
function convertInputToPersian(event) {
    event.target.value = toPersianNumber(event.target.value);
}

// اعمال تبدیل به فیلدهای ورودی
document.getElementById("start_date_hourlypass").addEventListener("input", convertInputToPersian);
document.getElementById("end_date_hourlypass").addEventListener("input", convertInputToPersian);

/* تابع جدول گزارش انفرادی پاس های ساعتی کاربران *//* تابع جدول گزارش انفرادی پاس های ساعتی کاربران */
/* تابع جدول گزارش انفرادی پاس های ساعتی کاربران *//* تابع جدول گزارش انفرادی پاس های ساعتی کاربران */
/* تابع جدول گزارش انفرادی پاس های ساعتی کاربران *//* تابع جدول گزارش انفرادی پاس های ساعتی کاربران */

document.getElementById("submitHourlyPassReport").addEventListener("click", function() {
    const username = document.getElementById("usernameHourlypass").value;
    const startDate = document.getElementById("start_date_hourlypass").value;
    const endDate = document.getElementById("end_date_hourlypass").value;

    if (!username || !startDate || !endDate) {
        alert("لطفاً تمام فیلدها را پر کنید.");
        return;
    }

    fetch('/get_hourly_pass_report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: username,
            start_date: startDate,
            end_date: endDate
        })
    })
    .then(response => response.json())
    .then(data => {
    const tbody = document.getElementById("hourlyPassIndivisualuserReportTable").getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // خالی کردن جدول قبل از پر کردن

    // همیشه دکمه نمایش داده شود
    document.getElementById("downloadHourlyPassReport").style.display = "block";

    data.forEach((row) => {
        const statusClass = getHourlyPassIndivisualStatusClass(row.status); // دریافت کلاس وضعیت
        const newRow = tbody.insertRow();
        newRow.innerHTML = `
            <td style="display:none;">${row.id}</td>
            <td>
                <button class="update-button" data-id="${row.id}" onclick="confirmChangesPass(${row.id})">تأیید تغییرات</button>
            </td>
            <td>
                <div class="status-container">
                    <div class="status-navbar ${statusClass}" id="statusHourlyPassNavbar_${row.id}" onclick="toggleRequestHourlypassDropdownReport(${row.id})">
                        ${convertToPersianNumbers(row.status)}
                    </div>
                    <div class="status-dropdown" id="requestHourlyPassIndiStatusDropdown_${row.id}" style="display: none;">
                        <div class="status-option approved" onclick="changeStatuHourlyPassIndiForApproval(${row.id}, 'تایید شده')">تایید شده</div>
                        <div class="status-option rejected" onclick="changeStatuHourlyPassIndiForApproval(${row.id}, 'رد شده')">رد شده</div>
                        <div class="status-option cancelled" onclick="changeStatuHourlyPassIndiForApproval(${row.id}, 'انصراف')">انصراف</div>
                    </div>
                </div>
            </td>
            <td>${convertToPersianNumbers(row.pass_duration)}</td>
            <td>${convertToPersianNumbers(row.pass_title)}</td>
            <td>${convertToPersianNumbers(row.request_date)}</td>
            <td>${convertToPersianNumbers(row.username)}</td>
        `;
    });
})

    .catch(error => {
        console.error('Error:', error);
        alert("خطا در دریافت داده‌ها.");
    });
});

// هدایت کاربر به صفحه گزارش هنگام کلیک روی دکمه
document.getElementById("downloadHourlyPassReport").addEventListener("click", function () {
    const tableRows = Array.from(document.querySelectorAll("#hourlyPassIndivisualuserReportTable tbody tr"));

    const reportData = tableRows
        .filter(row => {
            const statusElement = row.querySelector(".status-navbar");
            if (!statusElement) return false;
            const statusText = statusElement.textContent.trim();
            return statusText === 'تاييد شده';
        })
        .map((row, index) => {
            const requestDate = row.cells[5].textContent.trim();
            const passTitle = row.cells[4].textContent.trim();
            const passDuration = row.cells[3].textContent.trim();
            return { index: index + 1, requestDate, passTitle, passDuration };
        });

    const username = document.getElementById("usernameHourlypass")?.value || '';

    console.log("اطلاعات گزارش پاس ساعتی (فقط تایید شده):", reportData);
    console.log("یوزرنیم انتخاب‌شده:", username);

    localStorage.setItem("hourlyPassReportData", JSON.stringify(reportData));
    localStorage.setItem("hourlyPassUsername", username);

    window.open("/hourlypass_Report_page", "_blank");
});







// تابع برای باز کردن منوی کشویی وضعیت
function toggleRequestHourlypassDropdownReport(rowId) {
    const statusNavbar = document.querySelector(`#statusHourlyPassNavbar_${rowId}`);
    const currentDropdown = document.querySelector(`#requestHourlyPassIndiStatusDropdown_${rowId}`);

    // بستن همه منوهای کشویی
    const allHourlyDropdowns = document.querySelectorAll('.status-dropdown');
    allHourlyDropdowns.forEach(dropdown => dropdown.style.display = 'none');

    // باز و بسته کردن منوی کشویی مربوطه
    if (currentDropdown.style.display === 'none' || currentDropdown.style.display === '') {
        currentDropdown.style.display = 'block';
    } else {
        currentDropdown.style.display = 'none';
    }
}




// تنظیم اولیه برای پنهان کردن دکمه
document.getElementById("downloadHourlyPassReport").style.display = "none";

// تابع برای تعیین کلاس وضعیت بر اساس وضعیت
function getHourlyPassIndivisualStatusClass(status) {
    // نرمال‌سازی مقدار وضعیت
    const normalizedStatus = status.trim().replace(/\s+/g, ' '); // حذف فاصله‌های اضافی
    switch (normalizedStatus) {
        case 'تایید شده': // وضعیت نرمال‌شده
        case 'تاييد شده': // تطابق با وضعیت متفاوت
            return 'approved-status';
        case 'رد شده':
            return 'rejected-status';
        case 'انصراف':
            return 'cancelled-status';
        default:
            console.warn(`Unknown status: ${status}`); // هشدار برای وضعیت ناشناخته
            return 'unknown-status'; // مقدار پیش‌فرض برای وضعیت‌های ناشناخته
    }
}

// تابع برای تغییر وضعیت درخواست (بدون ارسال به سرور)
function changeStatuHourlyPassIndiForApproval(rowId, status) {
    const statusNavbar = document.getElementById(`statusHourlyPassNavbar_${rowId}`);
    if (!statusNavbar) {
        console.error(`Element with id 'statusHourlyPassNavbar_${rowId}' not found.`);
        return;
    }

    statusNavbar.innerHTML = convertToPersianNumbers(status);

    const statusClass = getHourlyPassIndivisualStatusClass(status);
    statusNavbar.className = `status-navbar ${statusClass}`;

    const dropdown = document.getElementById(`requestHourlyPassIndiStatusDropdown_${rowId}`);
    dropdown.style.display = 'none';
}

// تابع برای تأیید تغییرات و ارسال به سرور
function confirmChangesPass(rowId) {
    const statusNavbar = document.getElementById(`statusHourlyPassNavbar_${rowId}`);
    
    if (!statusNavbar) {
        console.error(`Element with id 'statusHourlyPassNavbar_${rowId}' not found.`);
        return;
    }

    const status = statusNavbar.innerText.trim(); // استفاده از innerText به جای innerHTML برای دریافت محتوای متنی

    console.log(`Confirming changes for row ${rowId} with status: ${status}`);

    fetch('/update_hourly_pass_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: rowId,
            status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("وضعیت با موفقیت تغییر کرد.");
        } else {
            alert("خطا در تغییر وضعیت.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("خطا در ارسال درخواست.");
    });
}

// تنظیمات باکس مدیریت درخواست های تیکت کاربران// تنظیمات باکس مدیریت درخواست های تیکت کاربران// تنظیمات باکس مدیریت درخواست های تیکت کاربران
// تنظیمات باکس مدیریت درخواست های تیکت کاربران// تنظیمات باکس مدیریت درخواست های تیکت کاربران// تنظیمات باکس مدیریت درخواست های تیکت کاربران
// تنظیمات باکس مدیریت درخواست های تیکت کاربران// تنظیمات باکس مدیریت درخواست های تیکت کاربران// تنظیمات باکس مدیریت درخواست های تیکت کاربران

loadTicketRequests();

function loadTicketRequests() {
    fetch('/get_ticket_requests_admin') // درخواست به سرور
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#ticketUsersReportTable tbody');
            tableBody.innerHTML = ''; // پاک کردن محتوای قبلی

            // نمایش داده‌ها در جدول
            data.forEach((ticket) => {
                const row = document.createElement('tr');
                const rowId = ticket.id;

                // تعیین کلاس مرتبط با وضعیت
                let statusClass = '';
                const ticketStatus = ticket.ticket_status.trim(); // حذف فاصله‌های اضافی

                if (ticketStatus === 'ارسال شده') {
                    statusClass = 'status-sent';
                } else if (ticketStatus === 'در حال پیگیری') {
                    statusClass = 'status-following';
                } else if (ticketStatus === 'خوانده شده') {
                    statusClass = 'status-read';
                } else if (ticketStatus === 'پاسخ داده شده') {
                    statusClass = 'status-answered';
                }

                // تبدیل تاریخ به اعداد فارسی
                const persianDate = toPersianDigits(ticket.ticket_date);

                row.innerHTML = `
                    <td>
                        <button class="trash-btn" onclick="openConfirmDialogTicket(${rowId})">
                            <img src="/static/images/trash.png" alt="حذف">
                            <span class="tooltip-text-table-del">حذف</span>
                        </button>
                        <button class="view-btn" onclick="openViewDialog(${rowId})">
                            <img src="/static/images/view.png" alt="مشاهده">
                            <span class="tooltip-text-table-view">مشاهده</span>
                        </button>
                        <button class="check-btn">
                            <img src="/static/images/check-mark.png" alt="تایید تغییرات" onclick="confirmTicketStatusChange(${rowId})">
                            <span class="tooltip-text-table-check">تایید تغییرات</span>
                        </button>
                    </td>
                    <td>
                        <div class="status-container">
                            <div class="status-navbar ${statusClass}" id="statusNavbar_${rowId}" onclick="toggleTicketDropdown(${rowId})">
                                ${ticketStatus}
                            </div>
                            <div class="status-dropdown" id="ticketStatusDropdown_${rowId}" style="display: none;">
                                <div class="status-option" onclick="changeTicketStatus(${rowId}, 'در حال پیگیری')">در حال پیگیری</div>
                                <div class="status-option" onclick="changeTicketStatus(${rowId}, 'خوانده شده')">خوانده شده</div>
                                <div class="status-option" onclick="changeTicketStatus(${rowId}, 'پاسخ داده شده')">پاسخ داده شده</div>
                            </div>
                        </div>
                    </td>
                    <td>${ticket.ticketDescription}</td>
                    <td>${ticket.ticketTitle}</td>
                    <td>${persianDate}</td> <!-- نمایش تاریخ به صورت فارسی -->
                    <td>${ticket.username}</td>
                    <td style="display: none;">${ticket.id}</td> <!-- این ستون برای استفاده داخلی است -->
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching ticket requests:', error);
        });
}

// تابع برای باز و بسته کردن دراپ‌داون
function toggleTicketDropdown(rowId) {
    const dropdown = document.querySelector(`#ticketStatusDropdown_${rowId}`);
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// تابع برای تغییر وضعیت
function changeTicketStatus(rowId, newStatus) {
    const statusNavbar = document.querySelector(`#statusNavbar_${rowId}`);

    // به‌روزرسانی متن وضعیت
    statusNavbar.textContent = newStatus;

    // حذف تمام کلاس‌های وضعیت
    statusNavbar.classList.remove('status-sent', 'status-following', 'status-read', 'status-answered');

    // اضافه کردن کلاس مرتبط با وضعیت جدید
    if (newStatus === 'ارسال شده') {
        statusNavbar.classList.add('status-sent');
    } else if (newStatus === 'در حال پیگیری') {
        statusNavbar.classList.add('status-following');
    } else if (newStatus === 'خوانده شده') {
        statusNavbar.classList.add('status-read');
    } else if (newStatus === 'پاسخ داده شده') {
        statusNavbar.classList.add('status-answered');
    }

    // بستن دراپ‌داون بعد از انتخاب
    const dropdown = document.querySelector(`#ticketStatusDropdown_${rowId}`);
    dropdown.style.display = 'none';
}

// تابع برای ارسال وضعیت جدید به سرور
function confirmTicketStatusChange(rowId) {
    const statusNavbar = document.querySelector(`#statusNavbar_${rowId}`);
    const newStatus = statusNavbar.textContent.trim();

    fetch('/update_ticket_status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: rowId,
            ticket_status: newStatus
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("وضعیت تیکت‌های مرتبط به‌روزرسانی شد.");
        } else {
            alert("خطایی رخ داد: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error updating ticket status:", error);
    });
}

// تنمظیمات پاپ اپ حذف تیکت کاربر
function openConfirmDialogTicket(ticketId) {
    const modal = document.getElementById('confirmDeleteModalHazf');
    modal.style.display = 'block'; // نمایش باکس تایید

    // ذخیره `ticketId` برای استفاده در تایید
    const confirmBtn = document.getElementById('confirmDeleteBtnTicket');
    confirmBtn.onclick = function () {
        deleteTicket(ticketId); // فراخوانی تابع حذف
        closeConfirmDialogTicketKarbr(); // بستن باکس تایید پس از حذف
    };
}

function closeConfirmDialogTicketKarbr() {
    const modal = document.getElementById('confirmDeleteModalHazf');
    modal.style.display = 'none'; // بستن باکس تایید
}

// نمایش مدال تایید حذف و ذخیره شناسه تیکت انتخابی
function showTaaeidConfirmDialog(ticketId) {
    currentTicketId = parseInt(ticketId, 10);  // تبدیل به عدد صحیح
    if (isNaN(currentTicketId)) {
        console.error("Invalid ticket ID:", ticketId);  // چاپ شناسه نامعتبر
    }
    document.getElementById('confirmDeleteModalHazf').style.display = "block";
}

// بستن مدال تایید حذف
function closeConfirmDialogTicketKarbr() {document.getElementById('confirmDeleteModalHazf').style.display = "none";}

// تابع تبدیل اعداد انگلیسی به فارسی
function toPersianDigits(input) {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return input.replace(/\d/g, (digit) => persianDigits[digit]);
}

// تابع برای نمایش پاپ‌آپ
let ticketData = null;

function openViewDialog(ticketId) {
    // نمایش پاپ‌آپ
    document.querySelector('#popupMoshahedeoverlay').style.display = 'block';
    document.querySelector('#MoshahedePopupbox').style.display = 'block';

    // پاک کردن پیام‌های قبلی قبل از نمایش پیام‌های جدید
    const kadrMatnContainer = document.querySelector('#MoshahedePopupbox .kadr-matn');
    kadrMatnContainer.innerHTML = '';  // این خط باعث حذف پیام‌های قبلی می‌شود

    // درخواست به سرور برای دریافت جزئیات تیکت
    fetch(`/get_ticket_details/${ticketId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                alert('خطایی در دریافت اطلاعات تیکت رخ داده است.');
                return;
            }

            // ذخیره اطلاعات تیکت در متغیر ticketData
            ticketData = data;

            // نمایش عنوان تیکت در بخش p
            document.querySelector('#ticketTitle').textContent = data.ticketTitle;

            // مرتب‌سازی پیام‌ها بر اساس تاریخ
            const sortedMessages = data.messages.sort((a, b) => new Date(a.ticket_date) - new Date(b.ticket_date));

            let userClasses = {};
            sortedMessages.forEach((message) => {
                const messageDiv = document.createElement('div');
                const currentUsername = message.username.trim().toLowerCase();

                if (!userClasses['karbar1']) {
                    userClasses['karbar1'] = currentUsername;
                    messageDiv.classList.add('matn2');
                } else if (!userClasses['karbar2'] && currentUsername !== userClasses['karbar1']) {
                    userClasses['karbar2'] = currentUsername;
                    messageDiv.classList.add('matn1');
                } else if (currentUsername === userClasses['karbar1']) {
                    messageDiv.classList.add('matn2');
                } else if (currentUsername === userClasses['karbar2']) {
                    messageDiv.classList.add('matn1');
                } else {
                    messageDiv.classList.add('matn3');
                }

                messageDiv.innerHTML = `
                    <p>${message.ticketDescription}</p>
                    <div class="zaman">${message.ticket_date}</div>
                `;

                kadrMatnContainer.appendChild(messageDiv);
            });

            // اسکرول به پایین‌ترین قسمت پس از بارگذاری پیام‌ها
            kadrMatnContainer.scrollTop = kadrMatnContainer.scrollHeight;
        })
        .catch(error => {
            console.error('Error fetching ticket details:', error);
        });
}


// تابع برای بستن پاپ‌آپ
function hideViewDialog() {
    document.querySelector('#popupMoshahedeoverlay').style.display = 'none';
    document.querySelector('#MoshahedePopupbox').style.display = 'none';
}

// تابع برای ارسال پیام توسط آیکون ارسال پیام// تابع برای ارسال پیام توسط آیکون ارسال پیام// تابع برای ارسال پیام توسط آیکون ارسال پیام
// تابع برای ارسال پیام توسط آیکون ارسال پیام// تابع برای ارسال پیام توسط آیکون ارسال پیام// تابع برای ارسال پیام توسط آیکون ارسال پیام
// تابع برای ارسال پیام توسط آیکون ارسال پیام// تابع برای ارسال پیام توسط آیکون ارسال پیام// تابع برای ارسال پیام توسط آیکون ارسال پیام

document.querySelector('.ersal-icon').addEventListener('click', () => {
    if (!ticketData) {
        alert('اطلاعات تیکت در دسترس نیست.');
        return;
    }

    // اطلاعات لازم برای ثبت پاسخ
    const ticketTitle = ticketData.ticketTitle;
    const ticketDescription = document.querySelector('#matnErsali').value;
    const target_username = ticketData.target_username;
    const username = ticketData.username;
    const parent_id = ticketData.parent_id;
    const ticket_status = ticketData.ticket_status;

    // ارسال درخواست به سرور
    fetch('/add_ticket_response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ticketTitle: ticketTitle,
            ticketDescription: ticketDescription,
            username: username,
            target_username: target_username,
            parent_id: parent_id,
            ticket_status: ticket_status
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {

            // افزودن پیام جدید به DOM
            const kadrMatnContainer = document.querySelector('#MoshahedePopupbox .kadr-matn');
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('matn1');
            const currentDateTime = new Date();
            const formattedDate = `${currentDateTime.toLocaleDateString('fa-IR')} - ${currentDateTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`;

            messageDiv.innerHTML = `
                <p>${ticketDescription}</p>
                <div class="zaman">${formattedDate}</div>
            `;
            kadrMatnContainer.appendChild(messageDiv);

            // اسکرول به انتهای باکس
            kadrMatnContainer.scrollTop = kadrMatnContainer.scrollHeight;

            // پاک کردن متن ورودی
            document.querySelector('#matnErsali').value = '';
        } else {
            console.error(data.error);
            alert('خطا در ارسال پاسخ تیکت');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('خطای سرور');
    });
});

// تنظیمات باز و بسته کردن پاپ تعریف ساعت هفتگی// تنظیمات باز و بسته کردن پاپ تعریف ساعت هفتگی// تنظیمات باز و بسته کردن پاپ تعریف ساعت هفتگی
// تنظیمات باز و بسته کردن پاپ تعریف ساعت هفتگی// تنظیمات باز و بسته کردن پاپ تعریف ساعت هفتگی// تنظیمات باز و بسته کردن پاپ تعریف ساعت هفتگی
// تنظیمات باز و بسته کردن پاپ تعریف ساعت هفتگی// تنظیمات باز و بسته کردن پاپ تعریف ساعت هفتگی// تنظیمات باز و بسته کردن پاپ تعریف ساعت هفتگی

document.getElementById("openSchedulePopup").addEventListener("click", function() {
    // دریافت مقادیر از فرم تعریف کاربر
    document.getElementById("hiddenName").value = document.getElementById("newFirstName").value;
    document.getElementById("hiddenLastName").value = document.getElementById("newLastName").value;
    document.getElementById("hiddenDepartment").value = document.getElementById("newDepartment").value;
    document.getElementById("hiddenWorkHours").value = document.getElementById("newWorkHours").value;
    document.getElementById("hiddenSubstitute").value = document.getElementById("newSubstitute").value;
    document.getElementById("hiddenUsername").value = document.getElementById("newUsername").value;
    document.getElementById("hiddenPassword").value = document.getElementById("nemPassword").value;
    document.getElementById("hiddenRole").value = document.getElementById("newRole").value;
    document.getElementById("hiddenHozoorNum").value = document.getElementById("newhozoorNum").value;

    // نمایش پاپ‌آپ
    document.getElementById("overlaySaatHaftehgi").style.display = "block";
    document.getElementById("schedulePopup").style.display = "block";
});

document.getElementById("closePopupSaatHaftehgi").addEventListener("click", function() {
    document.getElementById("overlaySaatHaftehgi").style.display = "none";
    document.getElementById("schedulePopup").style.display = "none";
});

// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج
// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج
// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج// تنظیمات دکمه خروج

function logout() {
    fetch('/logout', {
        method: 'GET',
        credentials: 'same-origin'
    }).then(response => {
        if (response.redirected) {
            window.location.href = response.url; // ریدایرکت به صفحه مورد نظر
        }
    });
}

// تنظیمات تایمر خروج از صفحه مدیریت// تنظیمات تایمر خروج از صفحه مدیریت// تنظیمات تایمر خروج از صفحه مدیریت// تنظیمات تایمر خروج از صفحه مدیریت
// تنظیمات تایمر خروج از صفحه مدیریت// تنظیمات تایمر خروج از صفحه مدیریت// تنظیمات تایمر خروج از صفحه مدیریت// تنظیمات تایمر خروج از صفحه مدیریت
// تنظیمات تایمر خروج از صفحه مدیریت// تنظیمات تایمر خروج از صفحه مدیریت// تنظیمات تایمر خروج از صفحه مدیریت// تنظیمات تایمر خروج از صفحه مدیریت

let timeout = setTimeout(function() {
    window.location.href = "/login";
}, 300000); // 30 ثانیه

document.addEventListener("mousemove", resetTimer);
document.addEventListener("keydown", resetTimer);

function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        window.location.href = "/login";
    }, 300000); // ریست تایمر
}

// تنظیمات ارسال به صفحه گزارش نهایی کاربر// تنظیمات ارسال به صفحه گزارش نهایی کاربر// تنظیمات ارسال به صفحه گزارش نهایی کاربر
// تنظیمات ارسال به صفحه گزارش نهایی کاربر// تنظیمات ارسال به صفحه گزارش نهایی کاربر// تنظیمات ارسال به صفحه گزارش نهایی کاربر
// تنظیمات ارسال به صفحه گزارش نهایی کاربر// تنظیمات ارسال به صفحه گزارش نهایی کاربر// تنظیمات ارسال به صفحه گزارش نهایی کاربر



// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت
// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت
// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت// تنظیمات ثبت تیکت

// باز کردن پاپ‌آپ ثبت تیکت
function openTicketModal() {
    document.getElementById("ticketModal").style.display = "block";
    fetch('/get_receivers')
        .then(response => response.json())
        .then(data => {
            const receiverSelect = document.getElementById('ticketReceiver');
            receiverSelect.innerHTML = '<option value="" disabled selected>انتخاب کنید</option>';  // ابتدا گزینه پیش‌فرض را قرار می‌دهیم
            data.forEach(receiver => {
                const option = document.createElement('option');
                option.value = receiver;  // نام کاربری
                option.textContent = receiver;  // نام کاربری که در لیست نمایش داده می‌شود
                receiverSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching receivers:', error));
}

// بستن پاپ‌آپ ثبت تیکت
function closeTicketModal() {document.getElementById("ticketModal").style.display = "none";}

// تنظیمات ثبت تیکت

// ارسال فرم ثبت تیکت
document.getElementById('ticketForm').addEventListener('submit', function(e) {
    e.preventDefault(); // جلوگیری از ارسال فرم به طور پیش‌فرض

    // دریافت فیلدهای مختلف فرم
    const ticketReceiver = document.getElementById('ticketReceiver') ? document.getElementById('ticketReceiver').value : '';
    const ticketTitle = document.getElementById('ticketTitleAdmin') ? document.getElementById('ticketTitleAdmin').value : '';
    const ticketDescription = document.getElementById('ticketDescription') ? document.getElementById('ticketDescription').value : '';
    const username = sessionStorage.getItem('username'); // فرض می‌کنیم که نام کاربری در سشن ذخیره شده است

    // ایجاد یک شیء برای ارسال به سرور
    const formData = {};

    // بررسی فیلدهایی که مقدار دارند و اضافه کردن به formData
    if (ticketReceiver) formData.ticketReceiver = ticketReceiver;
    if (ticketTitle) formData.ticketTitle = ticketTitle;
    if (ticketDescription) formData.ticketDescription = ticketDescription;
    if (username) formData.username = username;

    // ارسال داده‌ها به سرور
    fetch('/submit_ticket', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('تیکت شما با موفقیت ثبت شد!');
            closeTicketModal(); // بستن پاپ‌آپ
        } else {
            alert('خطا در ثبت تیکت! ' + (data.message || ''));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('مشکلی در ارسال درخواست پیش آمده است.');
    });
});



















































// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن
// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن
// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن// تنظیمات گزارش گیری ساعت زن

function convertNumbersToPersianNumber(number) {
    // تبدیل ورودی به رشته قبل از استفاده از replace
    return String(number).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[digit]);
}

// تابع برای فرمت کردن زمان
function formatTime(timeValue) {
    let str = String(timeValue).padStart(4, "0");  // تبدیل به رشته 4 رقمی و اضافه کردن صفرهای پیش‌نیاز
    return `${str.substring(0, 2)}:${str.substring(2, 4)}`;  // تبدیل به فرمت HH:MM
}

// تابع برای تبدیل زمان HH:MM به دقیقه
function convertTimeToMinutes(timeValue) {
    let [hours, minutes] = timeValue.split(":").map(Number);  // تقسیم زمان به ساعت و دقیقه
    return hours * 60 + minutes;  // تبدیل به دقیقه
}

document.getElementById("extractButton").addEventListener("click", function () {
    let selectedUsername = document.getElementById("usernameGozareshHozoor").value;
    let startDate = document.getElementById("start_date_hozoor").value;
    let endDate = document.getElementById("end_date_hozoor").value;

    if (!selectedUsername || !startDate || !endDate) {
        alert("لطفاً تمام فیلدها را پر کنید.");
        return;
    }

    // تعریف آرایه تعطیلات رسمی (شمسی به فرمت YYYY-MM-DD)
    const OFFICIAL_HOLIDAYS = [
        "1404-01-01", "1404-01-02", "1404-01-03", "1404-01-04",
        "1404-01-12", "1404-01-13", "1404-02-04", "1404-03-14",
        "1404-03-15", "1404-03-24", "1404-04-14", "1404-04-15",
        "1404-05-23", "1404-06-02", "1404-06-10", "1404-06-19",
        "1404-09-03", "1404-10-13", "1404-10-27", "1404-11-15",
        "1404-11-22", "1404-12-20"
    ];

    fetch(`/get_hozoor/${selectedUsername}?start_date=${startDate}&end_date=${endDate}`)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                let tableBody = document.querySelector("#hozoorUsersReportTable tbody");
                tableBody.innerHTML = "";

                let totalPresenceDuration = 0;
                let totalOvertime = 0;
                let totalDelay = 0;
                let totalEarlyStart = 0;
                let totalEarlyExit = 0;

                data.forEach(day => {
                    let entryTime = formatTime(day.EntryTime);
                    let exitTime = formatTime(day.ExitTime);
                    let workStart = day.WorkStart;
                    let workEnd = day.WorkEnd;

                    let entryMinutes = convertTimeToMinutes(entryTime);
                    let exitMinutes = convertTimeToMinutes(exitTime);
                    let workStartMinutes = convertTimeToMinutes(workStart);
                    let workEndMinutes = convertTimeToMinutes(workEnd);

                    let presenceDuration = exitMinutes - entryMinutes;
                    let overtime = 0, delay = 0, earlyStart = 0, earlyExit = 0;
                    let status = "";

                    // محاسبه وضعیت
                    if (entryMinutes < workStartMinutes) {
                        earlyStart = workStartMinutes - entryMinutes;
                        if (exitMinutes < workEndMinutes) {
                            earlyExit = workEndMinutes - exitMinutes;
                            presenceDuration = exitMinutes - workStartMinutes;
                            status = "خروج زودهنگام";
                        } else if (exitMinutes === workEndMinutes) {
                            presenceDuration = workEndMinutes - workStartMinutes;
                            status = "شروع زودهنگام و تایید سامانه در خروج";
                        } else {
                            overtime = exitMinutes - workEndMinutes;
                            if (overtime < 10) overtime = 0;
                            presenceDuration = overtime > 0 ? exitMinutes - workStartMinutes : workEndMinutes - workStartMinutes;
                            status = "شروع زودهنگام و اضافه کاری";
                        }
                    } else if (entryMinutes === workStartMinutes) {
                        if (exitMinutes < workEndMinutes) {
                            presenceDuration = exitMinutes - workStartMinutes;
                            status = "تایید سامانه در ورود و خروج زود هنگام";
                        } else if (exitMinutes === workEndMinutes) {
                            presenceDuration = workEndMinutes - workStartMinutes;
                            status = "تایید سامانه در ورود و خروج";
                        } else {
                            overtime = exitMinutes - workEndMinutes;
                            if (overtime < 10) overtime = 0;
                            presenceDuration = overtime > 0 ? exitMinutes - workStartMinutes : workEndMinutes - workStartMinutes;
                            status = "تایید سامانه در ورود و اضافه کاری";
                        }
                    } else {
                        if (exitMinutes < workEndMinutes) {
                            delay = entryMinutes - workStartMinutes;
                            presenceDuration = exitMinutes - entryMinutes;
                            status = "تاخیر در ورود و خروج زود هنگام";
                        } else if (exitMinutes === workEndMinutes) {
                            delay = entryMinutes - workStartMinutes;
                            presenceDuration = workEndMinutes - entryMinutes;
                            status = "تاخیر در ورود و تایید سامانه در خروج";
                        } else {
                            overtime = exitMinutes - workEndMinutes;
                            if (overtime < 10) overtime = 0;
                            presenceDuration = overtime > 0 ? exitMinutes - entryMinutes : workEndMinutes - entryMinutes;
                            status = "تاخیر در ورود و اضافه کاری";
                        }
                    }

                    totalPresenceDuration += presenceDuration;
                    totalOvertime += overtime;
                    totalDelay += delay;
                    totalEarlyStart += earlyStart;
                    totalEarlyExit += earlyExit;

                    // محاسبه روز هفته بر اساس تاریخ شمسی
                    let weekdayName = new persianDate(day.Date.split('-').map(Number)).format('dddd');

                    // ایجاد ردیف جدول
                    let row = document.createElement("tr");

                    // اگر جمعه یا تعطیل رسمی بود، ردیف را قرمز کن
                    if (weekdayName === "جمعه" || OFFICIAL_HOLIDAYS.includes(day.Date)) {
                        row.classList.add("holiday-row");
                    }

                    row.innerHTML = `
                        <td class="mjmoo-hozoor-gzrsh">${convertNumbersToPersianNumber(formatTimeFromMinutes(presenceDuration))}</td>
                        <td class="ezafe-hozoor-gzrsh">${convertNumbersToPersianNumber(overtime > 0 ? formatTimeFromMinutes(overtime) : "00:00")}</td>
                        <td class="khorojzd-hozoor-gzrsh">${convertNumbersToPersianNumber(earlyExit > 0 ? formatTimeFromMinutes(earlyExit) : "00:00")}</td>
                        <td class="shorozd-hozoor-gzrsh">${convertNumbersToPersianNumber(earlyStart > 0 ? formatTimeFromMinutes(earlyStart) : "00:00")}</td>
                        <td class="takhir-hozoor-gzrsh">${convertNumbersToPersianNumber(delay > 0 ? formatTimeFromMinutes(delay) : "00:00")}</td>
                        <td class="zmnkhrj-hozoor-gzrsh">${convertNumbersToPersianNumber(exitTime)}</td>
                        <td class="zmnvrd-hozoor-gzrsh">${convertNumbersToPersianNumber(entryTime)}</td>
                        <td class="hfte-hozoor-gzrsh">${weekdayName}</td>
                        <td class="sbt-hozoor-gzrsh">${convertNumbersToPersianNumber(day.Date.replace(/-/g, "/"))}</td>
                    `;
                    tableBody.appendChild(row);
                });

                if (window.matchMedia("(max-width: 768px)").matches) {
                    document.getElementById("sabtdst").style.marginTop = "44.5rem";
                } else {
                    document.getElementById("sabtdst").style.marginTop = "2rem";
                }

                document.querySelector(".box1-hozoor span").innerText =
                    `مجموع مدت زمان حضور : ${convertNumbersToPersianNumber(formatTimeFromMinutes(totalPresenceDuration))}`;

                document.querySelector(".box2-hozoor span").innerText =
                    `مجموع ساعات اضافه کاری : ${convertNumbersToPersianNumber(totalOvertime > 0 ? formatTimeFromMinutes(totalOvertime) : "00:00")}`;

                document.querySelector(".box3-hozoor span").innerText =
                    `مجموع مدت زمان تاخیر : ${convertNumbersToPersianNumber(totalDelay > 0 ? formatTimeFromMinutes(totalDelay) : "00:00")}`;

                document.querySelector(".box4-hozoor span").innerText =
                    `مجموع مدت زمان شروع زود هنگام : ${convertNumbersToPersianNumber(totalEarlyStart > 0 ? formatTimeFromMinutes(totalEarlyStart) : "00:00")}`;

                document.querySelector(".box5-hozoor span").innerText =
                    `مجموع مدت زمان خروج زود هنگام : ${convertNumbersToPersianNumber(totalEarlyExit > 0 ? formatTimeFromMinutes(totalEarlyExit) : "00:00")}`;

                document.getElementById("natigehHozoor").style.display = "block";
            } else {
                console.error("داده‌ها به فرمت صحیح نیستند:", data);
            }
        })
        .catch(error => console.error("خطا در دریافت داده‌ها:", error));
});



function goToFinalReport() {
    let tableRows = document.querySelectorAll("#hozoorUsersReportTable tbody tr");
    let tableData = [];

    // لیست تعطیلات رسمی (شمسی با فرمت yyyy/mm/dd)
    const OFFICIAL_HOLIDAYS = [
        "1404/01/01", "1404/01/02", "1404/01/03", "1404/01/04",
        "1404/01/12", "1404/01/13", "1404/02/04", "1404/03/14",
        "1404/03/15", "1404/03/24", "1404/04/14", "1404/04/15",
        "1404/05/23", "1404/06/02", "1404/06/10", "1404/06/19",
        "1404/09/03", "1404/10/13", "1404/10/27", "1404/11/15",
        "1404/11/22", "1404/12/20"
    ];

    tableRows.forEach((row, index) => {
        let cells = row.getElementsByTagName("td");
        let date = cells[8].innerText;  // تاریخ ثبت (مثلا "۱۴۰۴/۰۴/۰۱")

        // تبدیل تاریخ به فرمت yyyy/mm/dd انگلیسی برای تطبیق با تعطیلات
        let dateEnglish = persianToEnglishNumbers(date).replace(/-/g, "/").replace(/٫/g, "/");

        // بررسی اینکه آیا تعطیل رسمی است یا نه
        let isHoliday = OFFICIAL_HOLIDAYS.includes(dateEnglish);

        // روز هفته (مثلا "جمعه")
        let weekday = cells[7].innerText;

        // روز جمعه هم تعطیل محسوب می‌شود
        if (weekday === "جمعه") isHoliday = true;

        tableData.push({
            rowNumber: index + 1,
            calculatedTime: cells[0].innerText,  // مدت زمان حضور
            overtime: cells[1].innerText,        // اضافه کاری
            earlyExit: cells[2].innerText,       // خروج زودهنگام
            earlyStart: cells[3].innerText,      // شروع زودهنگام
            delay: cells[4].innerText,           // تاخیر
            exitTime: cells[5].innerText,        // زمان خروج
            entryTime: cells[6].innerText,       // زمان ورود
            weekday: weekday,                    // روز هفته
            date: date,                         // تاریخ ثبت
            isHoliday: isHoliday                // آیا تعطیل است؟
        });
    });

    let numRecords = tableData.length;
    localStorage.setItem("numRecords", numRecords);
    localStorage.setItem("hozoorReportData", JSON.stringify(tableData));

    // ذخیره مقادیر از باکس‌های گزارش
    localStorage.setItem("totalPresenceTime", document.querySelector(".box1-hozoor span").innerText.split(": ")[1]);
    localStorage.setItem("totalOvertime", document.querySelector(".box2-hozoor span").innerText.split(": ")[1]);
    localStorage.setItem("totalDelayTime", document.querySelector(".box3-hozoor span").innerText.split(": ")[1]);
    localStorage.setItem("totalEarlyStart", document.querySelector(".box4-hozoor span").innerText.split(": ")[1]);
    localStorage.setItem("totalEarlyExit", document.querySelector(".box5-hozoor span").innerText.split(": ")[1]);

    // دریافت مقادیر فیلتر تاریخ و کاربر
    let username = document.getElementById("usernameGozareshHozoor").value;
    let start_date = document.getElementById("start_date_hozoor").value;
    let end_date = document.getElementById("end_date_hozoor").value;

    // ارسال درخواست برای گزارش اضافه‌کاری
    fetch('/get_overtime_report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, start_date, end_date })
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("overtimeReportData", JSON.stringify(data));

        // ارسال درخواست برای گزارش مرخصی‌ها
        return fetch('/generate_individual_report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: username, fromDate: start_date, toDate: end_date })
        });
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("leaveReportData", JSON.stringify(data.reports));

        // ارسال درخواست برای گزارش پاس‌های ساعتی
        return fetch('/get_hourly_pass_report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, start_date, end_date })
        });
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem("hourlyPassReportData", JSON.stringify(data));

        // ذخیره نام کاربر
        localStorage.setItem("selectedUsername", username);

        // باز کردن صفحه گزارش نهایی
        window.open("/final_report_page", "_blank");
    })
    .catch(error => console.error("❌ خطا در دریافت گزارش:", error));

    // تابع تبدیل اعداد فارسی به انگلیسی
    function persianToEnglishNumbers(str) {
        const persianNums = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        for(let i=0; i<persianNums.length; i++) {
            let regex = new RegExp(persianNums[i], 'g');
            str = str.replace(regex, i.toString());
        }
        return str;
    }
}

// تابع برای فرمت کردن زمان به دقیقه (از فرمت HH:MM)
function formatTimeFromMinutes(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

// تنظیمات دکمه ثبت حضور و غیاب دستی// تنظیمات دکمه ثبت حضور و غیاب دستی// تنظیمات دکمه ثبت حضور و غیاب دستی
// تنظیمات دکمه ثبت حضور و غیاب دستی// تنظیمات دکمه ثبت حضور و غیاب دستی// تنظیمات دکمه ثبت حضور و غیاب دستی
// تنظیمات دکمه ثبت حضور و غیاب دستی// تنظیمات دکمه ثبت حضور و غیاب دستی// تنظیمات دکمه ثبت حضور و غیاب دستی

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("sabt-btn").addEventListener("click", function () {
        const form = document.getElementById("sabtdastHozoor");
        const formData = new FormData(form);

        const data = {
            username: formData.get("usernamedast"),
            tarikh: formData.get("tarikh"),
            vorood: formData.get("vorood"),
            khorooj: formData.get("khorooj")
        };

        fetch("/sabt_hozoor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("خطا در ارسال اطلاعات");
            }
            return response.json();
        })
        .then(result => {
            alert("اطلاعات با موفقیت ثبت شد");
            form.reset();
        })
        .catch(error => {
            alert("خطا در ثبت اطلاعات: " + error.message);
        });
    });
});

// تنظمیات انتخاب روز از تقویم شخصی سازی شده// تنظمیات انتخاب روز از تقویم شخصی سازی شده// تنظمیات انتخاب روز از تقویم شخصی سازی شده
// تنظمیات انتخاب روز از تقویم شخصی سازی شده// تنظمیات انتخاب روز از تقویم شخصی سازی شده// تنظمیات انتخاب روز از تقویم شخصی سازی شده
// تنظمیات انتخاب روز از تقویم شخصی سازی شده// تنظمیات انتخاب روز از تقویم شخصی سازی شده// تنظمیات انتخاب روز از تقویم شخصی سازی شده

const persianMonths = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];

function toJalaali(gy, gm, gd) {
  const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
  let jy, jm, jd;
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return { jy, jm, jd };
}

function toGregorian(jy, jm, jd) {
  jy = parseInt(jy);
  jm = parseInt(jm);
  jd = parseInt(jd);
  let gy, gd;
  let jy2 = jy - 979;
  let days = 365 * jy2 + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4);
  for (let i = 1; i < jm; ++i) days += daysInJMonth(jy, i);
  days += jd - 1;
  gy = 1600 + 400 * Math.floor(days / 146097);
  days %= 146097;
  let leap = true;
  if (days >= 36525) {
    days--;
    gy += 100 * Math.floor(days / 36524);
    days %= 36524;
    if (days >= 365) days++;
    else leap = false;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days >= 366) {
    leap = false;
    days--;
    gy += Math.floor(days / 365);
    days = days % 365;
  }
  gd = days + 1;
  let sal_a = [0,31, (leap ? 29 : 28),31,30,31,30,31,31,30,31,30,31];
  let gm = 0;
  while (gm < 13 && gd > sal_a[gm]) {
    gd -= sal_a[gm];
    gm++;
  }
  return { gy, gm, gd };
}

function isJLeap(jy) {
  let mod = ((jy - ((jy > 0) ? 474 : 473)) % 2820) + 474 + 38;
  return ((mod * 682) % 2816) < 682;
}

function daysInJMonth(jy, jm) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  if (isJLeap(jy)) return 30;
  return 29;
}

function getWeekDay(jy, jm, jd) {
  const g = toGregorian(jy, jm, jd);
  const d = new Date(g.gy, g.gm - 1, g.gd);
  const jsDay = d.getDay();
  return (jsDay + 3) % 7;
}

const inputTarikh = document.getElementById("tarikh");
const calendarBox = document.getElementById("calendar-box");
const calendarMonth = document.getElementById("calendar-month");
const calendarYear = document.getElementById("calendar-year");
const calendarDates = document.getElementById("calendar-dates");

let selectedDate = null;

function renderMonthYearSelectors(currentYear, currentMonth) {
  calendarMonth.innerHTML = persianMonths.map((m, i) => `<option value="${i + 1}" ${i + 1 === currentMonth ? 'selected' : ''}>${m}</option>`).join("");
  const thisYear = toJalaali(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()).jy;
  let yearOptions = "";
  for (let y = 1390; y <= thisYear; y++) {
    yearOptions += `<option value="${y}" ${y === currentYear ? 'selected' : ''}>${y}</option>`;
  }
  calendarYear.innerHTML = yearOptions;
}

// تغییر اعداد تقویم
function renderCalendar(year, month, selectedDay) {
    renderMonthYearSelectors(year, month);
    calendarDates.innerHTML = "";
    let firstDayOfMonth = getWeekDay(year, month, 1);
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDates.appendChild(document.createElement("div"));
    }
    const daysCount = daysInJMonth(year, month);
    for (let day = 1; day <= daysCount; day++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = convertToPersianNumbers(day); // <-- تبدیل به فارسی
        if (selectedDay === day) btn.classList.add("selected");
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            selectedDate = { year, month, day };
            updateInputDate();
            hideCalendar();
        });
        calendarDates.appendChild(btn);
    }
}

// نمایش تاریخ انتخاب شده با اعداد فارسی
function updateInputDate() {
    if (!selectedDate) return;
    const { year, month, day } = selectedDate;
    inputTarikh.value = convertToPersianNumbers(`${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`);
}

function showCalendar() {
  if (window.innerWidth <= 768) {
    calendarBox.style.top = "46%";
    calendarBox.style.left = "4%";
  } else {
    calendarBox.style.top = "87%";
    calendarBox.style.left = "61%";
  }
  calendarBox.style.display = "block";
  calendarBox.setAttribute("aria-hidden", "false");
}


function hideCalendar() {
  calendarBox.style.display = "none";
  calendarBox.setAttribute("aria-hidden", "true");
}

inputTarikh.addEventListener("click", () => {
  const today = new Date();
  const jToday = toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());
  selectedDate = { year: jToday.jy, month: jToday.jm, day: jToday.jd };
  renderCalendar(selectedDate.year, selectedDate.month, selectedDate.day);
  showCalendar();
});

calendarMonth.addEventListener("change", () => {
  selectedDate.month = parseInt(calendarMonth.value);
  renderCalendar(selectedDate.year, selectedDate.month, selectedDate.day);
});

calendarYear.addEventListener("change", () => {
  selectedDate.year = parseInt(calendarYear.value);
  renderCalendar(selectedDate.year, selectedDate.month, selectedDate.day);
});

document.addEventListener("click", (e) => {
  if (!calendarBox.contains(e.target) && e.target !== inputTarikh) hideCalendar();
});

window.addEventListener("load", () => {
  const now = new Date();
  const jNow = toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  selectedDate = { year: jNow.jy, month: jNow.jm, day: jNow.jd };
  updateInputDate();
});


// تنظیمات انتخاب ساعت و دقیقه از باکس ثبت حضور و غیاب دستی // تنظیمات انتخاب ساعت و دقیقه از باکس ثبت حضور و غیاب دستی
// تنظیمات انتخاب ساعت و دقیقه از باکس ثبت حضور و غیاب دستی // تنظیمات انتخاب ساعت و دقیقه از باکس ثبت حضور و غیاب دستی
// تنظیمات انتخاب ساعت و دقیقه از باکس ثبت حضور و غیاب دستی // تنظیمات انتخاب ساعت و دقیقه از باکس ثبت حضور و غیاب دستی

function toggleTimePicker(inputId) {
  // همگام‌سازی ساعت و دقیقه تایم‌پیکر با مقدار داخل input
  const input = document.getElementById(inputId);
  const [hour, minute] = input.value.split(":");

  if (/^\d{2}$/.test(hour) && /^\d{2}$/.test(minute)) {
    document.getElementById(`hour-${inputId}`).innerText = hour;
    document.getElementById(`minute-${inputId}`).innerText = minute;

    // وضعیت انتخاب رو هم فعال کن، که اگه کاربر فقط دقیقه یا فقط ساعت رو تغییر داد، مقدار جدید ثبت بشه
    selectedFields[inputId].hourSelected = true;
    selectedFields[inputId].minuteSelected = true;
  }

  // بقیه کد اصلی
  document.querySelectorAll(".time-picker").forEach(el => el.style.display = "none");
  const picker = document.getElementById(`timepicker-${inputId}`);
  picker.style.display = picker.style.display === "flex" ? "none" : "flex";

}


function positionTimePicker(inputId) {
  const input = document.getElementById(inputId);
  const picker = document.getElementById(`timepicker-${inputId}`);
  const rect = input.getBoundingClientRect();
  picker.style.top = rect.bottom + window.scrollY + "px";
  picker.style.left = rect.left + window.scrollX + "px";
}


const selectedFields = {
  vorood: { hourSelected: false, minuteSelected: false, timer: null },
  khorooj: { hourSelected: false, minuteSelected: false, timer: null }
};

function changeTime(inputId, type, delta) {
  const hourEl = document.getElementById(`hour-${inputId}`);
  const minuteEl = document.getElementById(`minute-${inputId}`);
  const input = document.getElementById(inputId);

  let hour = parseInt(hourEl.innerText);
  let minute = parseInt(minuteEl.innerText);

  if (type === "hour") {
    hour = (hour + delta + 24) % 24;
    selectedFields[inputId].hourSelected = true;
  } else if (type === "minute") {
    minute = (minute + delta + 60) % 60;
    selectedFields[inputId].minuteSelected = true;
  }

  const newHour = hour.toString().padStart(2, '0');
  const newMinute = minute.toString().padStart(2, '0');

  hourEl.innerText = newHour;
  minuteEl.innerText = newMinute;

  // فقط اگر هر دو انتخاب شدن، مقدار توی input نوشته بشه
  if (selectedFields[inputId].hourSelected && selectedFields[inputId].minuteSelected) {
    input.value = `${newHour}:${newMinute}`;

    // اگر فیلد vorood بود، منتظر 1.5 ثانیه بمون و بعد برو به khorooj
    if (inputId === "vorood") {
      if (selectedFields[inputId].timer) {
        clearTimeout(selectedFields[inputId].timer);
      }

      selectedFields[inputId].timer = setTimeout(() => {
        const targetInput = document.getElementById("khorooj");
        targetInput.focus();
        toggleTimePicker("khorooj");
      }, 1500);
    }
  }
}

// تابعی برای اصلاح فرمت ورودی تایم بدون نمایش خطا یا پاک کردن مقدار
function fixTimeFormat(inputId) {
  const input = document.getElementById(inputId);
  let val = input.value.trim();

  // اگر فرمت درست بود، دست نزن
  if (/^\d{2}:\d{2}$/.test(val)) return;

  // حذف کاراکترهای غیرعددی
  val = val.replace(/\D/g, '');

  let hour = "--", minute = "--";

  if (val.length === 3) {
    hour = '0' + val.charAt(0);
    minute = val.slice(1);
  } else if (val.length === 4) {
    hour = val.slice(0, 2);
    minute = val.slice(2);
  } else if (val.length <= 2) {
    hour = val.padStart(2, '-');
  }

  // فقط مقدار رو تنظیم کن، نه alert بده، نه پاکش کن
  input.value = `${hour.padEnd(2, "-")}:${minute.padEnd(2, "-")}`;
}

// وقتی کلیک خارج از تایم‌پیکر شد، باکس رو ببند و تایمر رو لغو کن
document.addEventListener("click", function(event) {
  const timePickers = document.querySelectorAll(".time-picker");

  timePickers.forEach(picker => {
    const inputId = picker.id.replace("timepicker-", "");
    const input = document.getElementById(inputId);

    if (
      !picker.contains(event.target) &&
      event.target !== input
    ) {
      picker.style.display = "none";

      if (selectedFields[inputId] && selectedFields[inputId].timer) {
        clearTimeout(selectedFields[inputId].timer);
        selectedFields[inputId].timer = null;
      }
    }
  });
});

function setupTimeInput(id) {
    const input = document.getElementById(id);
    input.value = "--:--";

    input.addEventListener("input", function (e) {
        let val = input.value.replace(/\D/g, ''); // فقط عددها
        if (val.length > 4) val = val.slice(0, 4);

        let hour = "--";
        let minute = "--";

        if (val.length >= 1) hour = val[0] + "-";
        if (val.length >= 2) hour = val.slice(0, 2);
        if (val.length >= 3) minute = val[2] + "-";
        if (val.length >= 4) minute = val.slice(2, 4);

        input.value = `${hour}:${minute}`;

        if (val.length === 4) {
            // اگر فیلد "vorood" بود و کامل شد، برو روی "khorooj"
            if (id === "vorood") {
                document.getElementById("khorooj").focus();
            }
        }
    });

    // اجازه بده روی بخش خاصی کلیک کنه (ساعت یا دقیقه) و فقط همونو تغییر بده
    input.addEventListener("click", function (e) {
        const pos = input.selectionStart;
        if (pos <= 2) {
            input.setSelectionRange(0, 2); // ساعت
        } else {
            input.setSelectionRange(3, 5); // دقیقه
        }
    });

    // روی blur، اگر فرمت مشکل داشت، پاکش کن
    input.addEventListener("blur", function () {
        const parts = input.value.split(":");
        if (parts.length !== 2 || parts[0].includes("-") || parts[1].includes("-")) {
            input.value = "--:--";
        } else {
            const h = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            if (isNaN(h) || isNaN(m) || h > 23 || m > 59) {
                input.value = "--:--";
                alert("فرمت ساعت نامعتبر است. لطفاً مثلاً 09:16 وارد کنید.");
            }
        }
    });

    // کنترل کلیدها
    input.addEventListener("keydown", function (e) {
        const allowed = ['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab'];
        if (allowed.includes(e.key)) return;

        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
            return;
        }

        const val = input.value.replace(/\D/g, '');
        if (val.length >= 4 && input.selectionStart === input.selectionEnd) {
            e.preventDefault();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupTimeInput("vorood");
    setupTimeInput("khorooj");
});

// هنگام بارگذاری صفحه، به input ها رویدادهای لازم اضافه کن
document.addEventListener("DOMContentLoaded", function () {
  ["vorood", "khorooj"].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("blur", () => fixTimeFormat(id));
  });
});