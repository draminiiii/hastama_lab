// فارسی سازی اعداد و فیلدها// فارسی سازی اعداد و فیلدها// فارسی سازی اعداد و فیلدها// فارسی سازی اعداد و فیلدها
// فارسی سازی اعداد و فیلدها// فارسی سازی اعداد و فیلدها// فارسی سازی اعداد و فیلدها// فارسی سازی اعداد و فیلدها
// فارسی سازی اعداد و فیلدها// فارسی سازی اعداد و فیلدها// فارسی سازی اعداد و فیلدها// فارسی سازی اعداد و فیلدها

// فرمت کردن اعداد ورودی به فارسی
function formatPersianNumbers(event) {
    let input = event.target;
    let value = input.value.replace(/[^\d\u0660-\u0669\u06F0-\u06F9]/g, ''); // فقط اعداد فارسی یا انگلیسی مجاز هستند
    input.value = convertToPersianNumbers(parseInt(convertToEnglishNumbers(value)) || 1); // مقدار پیش‌فرض ۱
}

// تبدیل اعداد به فارسی در فیلدها و placeholder به صورت زنده
document.getElementById('startDate').addEventListener('input', function() {this.value = convertToPersianNumbers(this.value);});
document.getElementById('endDate').addEventListener('input', function() {this.value = convertToPersianNumbers(this.value);});
document.getElementById('substitute').addEventListener('input', function() {this.value = convertToPersianNumbers(this.value);});

// تبدیل placeholder ها به فارسی
function convertPlaceholdersToPersian() {
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(function(input) {
        input.placeholder = convertToPersianNumbers(input.placeholder);
    });
}

// اعمال تبدیل placeholderها زمانی که صفحه بارگذاری می‌شود
window.addEventListener('load', function() {convertPlaceholdersToPersian();});

// تبدیل اعداد انگلیسی به فارسی
function convertToPersianNumbers(str) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/\d/g, function (match) {
        return persianNumbers[match];
    });
}

// تبدیل اعداد فارسی به انگلیسی
function convertToEnglishNumbers(str) {
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return str.replace(/[\u0660-\u0669\u06F0-\u06F9]/g, function (match) {
        return englishNumbers['۰۱۲۳۴۵۶۷۸۹'.indexOf(match)];
    });
}

// فرمت کردن اعداد ورودی به فارسی
function formatPersianNumbers(event) {
    let input = event.target;
    let value = input.value.replace(/[^\d\u0660-\u0669\u06F0-\u06F9]/g, ''); // فقط اعداد فارسی یا انگلیسی مجاز هستند
    input.value = convertToPersianNumbers(parseInt(convertToEnglishNumbers(value)) || 1); // مقدار پیش‌فرض ۱
}

// اعمال تبدیل placeholderها زمانی که صفحه بارگذاری می‌شود
window.addEventListener('load', function() {convertPlaceholdersToPersian();});

// تابع تبدیل اعداد به فارسی
function convertToPersian(input) {
    var englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    input.value = input.value.replace(/[0-9]/g, function(w) {
        return persianNumbers[englishNumbers.indexOf(w)];
    });
}

function toPersianDigits(input) {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return input.replace(/\d/g, (digit) => persianDigits[digit]);
}

// تابع برای فرمت کردن زمان
function formatTime(timeString) {
    // تبدیل رشته زمان به شیء Date بدون افزودن 'Z'
    const time = new Date('1970-01-01T' + timeString); 

    const hours = time.getHours().toString().padStart(2, '0'); // گرفتن ساعت و افزودن صفر به ابتدای آن
    const minutes = time.getMinutes().toString().padStart(2, '0'); // گرفتن دقیقه و افزودن صفر به ابتدای آن

    return hours + ':' + minutes; // برگرداندن فرمت جدید
}

// تبدیل اعداد به فارسی
function convertToPersianNumbers(input) {
    const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    let output = input;

    // تبدیل هر عدد انگلیسی به عدد فارسی
    for (let i = 0; i < englishNumbers.length; i++) {
        const regex = new RegExp(englishNumbers[i], 'g');
        output = output.replace(regex, persianNumbers[i]);
    }
    
    return output;
}

//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری
//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری
//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری//تنظمیات نوار ابزار کناری

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

// تنظیمات پاپ اپ ثبت درخواست مرخصی// تنظیمات پاپ اپ ثبت درخواست مرخصی// تنظیمات پاپ اپ ثبت درخواست مرخصی// تنظیمات پاپ اپ ثبت درخواست مرخصی
// تنظیمات پاپ اپ ثبت درخواست مرخصی// تنظیمات پاپ اپ ثبت درخواست مرخصی// تنظیمات پاپ اپ ثبت درخواست مرخصی// تنظیمات پاپ اپ ثبت درخواست مرخصی
// تنظیمات پاپ اپ ثبت درخواست مرخصی// تنظیمات پاپ اپ ثبت درخواست مرخصی// تنظیمات پاپ اپ ثبت درخواست مرخصی// تنظیمات پاپ اپ ثبت درخواست مرخصی

// باز کردن پاپ‌آپ ثبت مرخصی// باز کردن پاپ‌آپ ثبت مرخصی// باز کردن پاپ‌آپ ثبت مرخصی// باز کردن پاپ‌آپ ثبت مرخصی// باز کردن پاپ‌آپ ثبت مرخصی
function openLeaveModal() {document.getElementById("leaveModal").style.display = "block";}

// بستن پاپ‌آپ مرخصی// بستن پاپ‌آپ مرخصی// بستن پاپ‌آپ مرخصی// بستن پاپ‌آپ مرخصی// بستن پاپ‌آپ مرخصی// بستن پاپ‌آپ مرخصی// بستن پاپ‌آپ مرخصی
function closeLeaveModal() {document.getElementById("leaveModal").style.display = "none";}

// تغییر مقدار تعداد روزها (افزایش/کاهش) با محدودیت 1 تا 30
function changeValue(change) {
    let input = document.getElementById('days');
    let currentValue = parseInt(convertToEnglishNumbers(input.value)); // تبدیل اعداد فارسی به انگلیسی

    if (isNaN(currentValue)) {
        currentValue = 1;  // مقدار پیش‌فرض در صورت ورودی نامعتبر
    }

    let newValue = currentValue + change;

    // محدود کردن مقدار به بازه 1 تا 30
    if (newValue < 1) {
        newValue = 1;
    } else if (newValue > 30) {
        newValue = 30;
    }

    input.value = convertToPersianNumbers(newValue.toString()); // تبدیل مقدار جدید به فارسی
}

// ارسال فرم ثبت مرخصی// ارسال فرم ثبت مرخصی// ارسال فرم ثبت مرخصی// ارسال فرم ثبت مرخصی// ارسال فرم ثبت مرخصی// ارسال فرم ثبت مرخصی
document.getElementById('leaveForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;
    let days = document.getElementById('days').value;
    let substitute = document.getElementById('substitute').value;

    // تبدیل اعداد به فارسی قبل از ارسال
    startDate = convertToPersianNumbers(startDate);
    endDate = convertToPersianNumbers(endDate);
    days = convertToPersianNumbers(days);
    substitute = convertToPersianNumbers(substitute);

    const formData = new FormData();
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('days', days);
    formData.append('substitute', substitute);

    fetch('/submit_leave', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('درخواست مرخصی شما با موفقیت ثبت شد!');
            closeLeaveModal(); 
            window.location.href = '/user_panel';
        } else {
            alert('خطا در ثبت درخواست مرخصی!');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('مشکلی در ارسال درخواست پیش آمده است.');
    });
});

// تنظمیات انتخاب جانشین
function toggleSubstituteDropdown() {
    const dropdown = document.getElementById("substituteDropdown");
    const input = document.getElementById("substitute");
    const isDisplayed = dropdown.style.display === "block";

    // اگر منو باز نیست، بازش می‌کنیم
    if (!isDisplayed) {
        dropdown.style.display = "block";
        // تنظیم موقعیت منو نسبت به ورودی
        dropdown.style.left = input.offsetLeft + "px";
        dropdown.style.top = input.offsetTop + input.offsetHeight + "px";
    } else {
        // اگر منو باز بود، می‌بندیم
        dropdown.style.display = "none";
    }
}

// تنظمیات انتخاب جانشین
function selectSubstitute(element) {
    const substituteInput = document.getElementById("substitute");
    substituteInput.value = element.textContent;  // مقدار انتخاب‌شده را به ورودی انتقال می‌دهد
    document.getElementById("substituteDropdown").style.display = "none";  // منو را می‌بندد
}

// بستن منو با کلیک خارج از آن
document.addEventListener("click", function(event) {
    const dropdown = document.getElementById("substituteDropdown");
    const input = document.getElementById("substitute");
    // اگر خارج از منو یا ورودی کلیک شد، منو بسته می‌شود
    if (!dropdown.contains(event.target) && event.target !== input) {
        dropdown.style.display = "none";
    }
});

// تنظیمات باکس گزارش مرخصی ها// تنظیمات باکس گزارش مرخصی ها// تنظیمات باکس گزارش مرخصی ها// تنظیمات باکس گزارش مرخصی ها
// تنظیمات باکس گزارش مرخصی ها// تنظیمات باکس گزارش مرخصی ها// تنظیمات باکس گزارش مرخصی ها// تنظیمات باکس گزارش مرخصی ها
// تنظیمات باکس گزارش مرخصی ها// تنظیمات باکس گزارش مرخصی ها// تنظیمات باکس گزارش مرخصی ها// تنظیمات باکس گزارش مرخصی ها

// تابع دریافت اطلاعات کاربر و نمایش در جدول باکس مرخصی ها
document.addEventListener('DOMContentLoaded', function() {

    // ارسال درخواست GET برای دریافت اطلاعات مرخصی
    fetch('/get_leave_info', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // اگر درخواست موفقیت‌آمیز بود، اطلاعات مرخصی‌ها را به نمایش می‌گذاریم
            let leaveData = data.data;
            let tableBody = document.querySelector('#leaveTable tbody');
            tableBody.innerHTML = ''; // ابتدا جدول را خالی می‌کنیم

            // تابع تبدیل فرمت تاریخ
            function convertDateFormat(dateString) {
                if (dateString) {
                    let [year, month, day] = dateString.split('/');
                    return `${year}/${month.padStart(2, '0')}/${day.padStart(2, '0')}`; // بازسازی در قالب yyyy/mm/dd
                }
                return ''; // اگر تاریخ وجود نداشت، رشته خالی برمی‌گردانیم
            }

            leaveData.forEach(function(leave, index) {
                // فرمت‌دهی تاریخ‌ها
                let formattedStartDate = convertDateFormat(leave.start_date);
                let formattedEndDate = convertDateFormat(leave.end_date);

                // اضافه کردن هر ردیف به جدول
                let row = `<tr>
                    <td>${leave.status}</td>
                    <td>${convertToPersianNumbers(leave.days.toString())}</td>
                    <td>${convertToPersianNumbers(formattedEndDate)}</td>
                    <td>${convertToPersianNumbers(formattedStartDate)}</td>
                    <td>${convertToPersianNumbers((index + 1).toString())}</td> <!-- شماره ردیف فارسی -->
                </tr>`;
                tableBody.innerHTML += row;
            });
        }
    })
    .catch(error => {
        alert('خطا در ارسال درخواست: ' + error);
    });
});

/* باز کردن پاپ اپ مرخصی کاربر */
document.getElementById('showMoreMorakhc').addEventListener('click', function(event) {
    event.preventDefault(); // جلوگیری از بارگذاری مجدد صفحه
    var popupOverlay = document.getElementById('popupOverlayMorakhsi');
    popupOverlay.style.display = 'flex'; // نمایش پاپ‌آپ
});

/* بستن کردن پاپ اپ مرخصی کاربر */
document.getElementById('closePopupMorakhciPopuppbox').addEventListener('click', function(event) {
    event.preventDefault(); // جلوگیری از بارگذاری مجدد صفحه
    var popupOverlay = document.getElementById('popupOverlayMorakhsi');
    popupOverlay.style.display = 'none'; // بستن پاپ‌آپ
});

// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری
// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری
// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری// تنظیمات ثبت اضافه کاری

// باز کردن پاپ‌آپ ثبت اضافه‌کار
function openOvertimeModal() {document.getElementById("overtimeModal").style.display = "block";}

// بستن پاپ‌آپ اضافه‌کار
function closeOvertimeModal() {document.getElementById("overtimeModal").style.display = "none";}

// ارسال فرم ثبت اضافه کاری
document.getElementById("overtimeForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // تبدیل اعداد فارسی به انگلیسی
    function convertToEnglish(input) {
        var persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        var englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        return input.replace(/[۰-۹]/g, function(w) {
            return englishNumbers[persianNumbers.indexOf(w)];
        });
    }

    // دریافت مقادیر و تبدیل اعداد فارسی به انگلیسی
    var overtimeDate = convertToEnglish(document.getElementById("overtimeDate").value);
    var fromTime = convertToEnglish(document.getElementById("fromTime").value);
    var toTime = convertToEnglish(document.getElementById("toTime").value);
    var description = document.getElementById("description").value;

    // نمایش داده‌ها در کنسول برای بررسی
    console.log("Overtime Data to be sent:");
    console.log("Overtime Date: " + overtimeDate);
    console.log("From Time: " + fromTime);
    console.log("To Time: " + toTime);
    console.log("Description: " + description);

    // ارسال اطلاعات به سرور
    fetch('/submit_overtime', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            overtimeDate: overtimeDate,
            fromTime: fromTime,
            toTime: toTime,
            description: description
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('اضافه‌کار با موفقیت ثبت شد!');
            closeOvertimeModal(); 
            window.location.href = '/user_panel';
        } else {
            alert('خطا در ثبت اضافه‌کار: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('مشکلی در ارسال اطلاعات پیش آمده است.');
    });
});

// تنظیمات باکس گزارش اضافه کاری ها //// تنظیمات باکس گزارش اضافه کاری ها //// تنظیمات باکس گزارش اضافه کاری ها //
// تنظیمات باکس گزارش اضافه کاری ها //// تنظیمات باکس گزارش اضافه کاری ها //// تنظیمات باکس گزارش اضافه کاری ها //
// تنظیمات باکس گزارش اضافه کاری ها //// تنظیمات باکس گزارش اضافه کاری ها //// تنظیمات باکس گزارش اضافه کاری ها //

/* باز کردن پاپ اپ اضافه کاری کاربر */
document.getElementById('showMoreEzafetime').addEventListener('click', function(event) {
    event.preventDefault(); // جلوگیری از بارگذاری مجدد صفحه
    var popupOverlay = document.getElementById('popupOverlayezafe');
    popupOverlay.style.display = 'flex'; // نمایش پاپ‌آپ
});

/* بستن پاپ اپ اضافه کاری کاربر */
document.getElementById('closePopupezafekarijadvalbox').addEventListener('click', function(event) {
    event.preventDefault(); // جلوگیری از بارگذاری مجدد صفحه
    var popupOverlay = document.getElementById('popupOverlayezafe');
    popupOverlay.style.display = 'none'; // بستن پاپ‌آپ
});

// تنظمیات ثبت پاس ساعتی کاربر// تنظمیات ثبت پاس ساعتی کاربر// تنظمیات ثبت پاس ساعتی کاربر// تنظمیات ثبت پاس ساعتی کاربر
// تنظمیات ثبت پاس ساعتی کاربر// تنظمیات ثبت پاس ساعتی کاربر// تنظمیات ثبت پاس ساعتی کاربر// تنظمیات ثبت پاس ساعتی کاربر
// تنظمیات ثبت پاس ساعتی کاربر// تنظمیات ثبت پاس ساعتی کاربر// تنظمیات ثبت پاس ساعتی کاربر// تنظمیات ثبت پاس ساعتی کاربر

// باز کردن پاپ‌آپ پاس ساعتی
function openHourlyPassModal() {document.getElementById("hourlyPassModal").style.display = "block";}

// بستن پاپ‌آپ پاس ساعتی
function closeHourlyPassModal() {document.getElementById("hourlyPassModal").style.display = "none";}

// ارسال فرم ثبت پاس ساعتی
document.getElementById('hourlyPassForm').addEventListener('submit', function(e) {
    e.preventDefault(); // جلوگیری از ارسال فرم به طور پیش‌فرض

    // دریافت فیلدهای مختلف فرم
    const officialTime = document.getElementById('officialTime') ? document.getElementById('officialTime').value : '';
    const entryTime = document.getElementById('entryTime') ? document.getElementById('entryTime').value : '';
    const exitTime = document.getElementById('exitTime') ? document.getElementById('exitTime').value : '';
    const date = document.getElementById('date') ? document.getElementById('date').value : '';

    // ایجاد یک شیء برای ارسال به سرور
    const formData = {};

    // بررسی فیلدهایی که مقدار دارند و اضافه کردن به formData
    if (officialTime) formData.officialTime = officialTime;
    if (entryTime) formData.entryTime = entryTime;
    if (exitTime) formData.exitTime = exitTime;
    if (date) formData.date = date;

    // ارسال داده‌ها به سرور
    fetch('/submit_hourly_pass', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('پاس‌ها با موفقیت ثبت شد!');
            closeHourlyPassModal(); // بستن پاپ‌آپ
        } else {
            alert('خطا در ثبت پاس‌ها! ' + (data.message || ''));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('مشکلی در ارسال درخواست پیش آمده است.');
    });
});

// تنظیمات پاس های اول، بین و آخر وقت در ثبت ارسال فرم
function updateHourlyPassFields(passType) {
    const dynamicFields = document.getElementById("dynamicFields");
    dynamicFields.innerHTML = ""; // پاک کردن فیلدهای قبلی

    let content = "";

    if (passType === "first") {
        content = `
            <label for="officialTime">: ساعت موظفی</label>
            <input type="text" id="officialTime" name="officialTime" placeholder="۱۲:۰۰" required oninput="this.value = toPersianDigits(this.value)">

            <label for="entryTime">: ساعت ورودی</label>
            <input type="text" id="entryTime" name="entryTime" placeholder="۱۲:۰۰" required oninput="this.value = toPersianDigits(this.value)">

            <label for="date">: تاریخ</label>
            <input type="text" id="date" name="date" placeholder="۱۴۰۳/۰۱/۰۱" required oninput="this.value = toPersianDigits(this.value)">
        `;
    } else if (passType === "mid") {
        content = `
            <label for="exitTime">: ساعت خروج</label>
            <input type="text" id="exitTime" name="exitTime" placeholder="۱۲:۰۰" required oninput="this.value = toPersianDigits(this.value)">

            <label for="entryTime">: ساعت ورود</label>
            <input type="text" id="entryTime" name="entryTime" placeholder="۱۲:۰۰" required oninput="this.value = toPersianDigits(this.value)">

            <label for="date">: تاریخ</label>
            <input type="text" id="date" name="date" placeholder="۱۴۰۳/۰۱/۰۱" required oninput="this.value = toPersianDigits(this.value)">
        `;
    } else if (passType === "last") {
        content = `
            <label for="officialTime">: ساعت موظفی</label>
            <input type="text" id="officialTime" name="officialTime" placeholder="۱۲:۰۰" required oninput="this.value = toPersianDigits(this.value)">

            <label for="exitTime">: ساعت خروج</label>
            <input type="text" id="exitTime" name="exitTime" placeholder="۱۲:۰۰" required oninput="this.value = toPersianDigits(this.value)">

            <label for="date">: تاریخ</label>
            <input type="text" id="date" name="date" placeholder="۱۴۰۳/۰۱/۰۱" required oninput="this.value = toPersianDigits(this.value)">
        `;
    }

    dynamicFields.innerHTML = content;
}

// به‌روزرسانی فیلدهای پاس بر اساس نوع انتخاب شده
document.getElementById('passType').addEventListener('click', function () {updateHourlyPassFields(this.value);});

// نمایش یا مخفی کردن منوی کشویی برای انتخاب نوع پاس
function togglePassTypeDropdown() {
    const dropdown = document.getElementById('passTypeDropdown');
    dropdown.style.display = (dropdown.style.display === "none" || dropdown.style.display === "") ? "block" : "none";
}

document.querySelectorAll('.dropdown-option').forEach(option => {
    option.addEventListener('click', function() {
        document.getElementById('passType').value = this.textContent;
        document.getElementById("passTypeDropdown").style.display = "none";  // بستن منو
        updateHourlyPassFields(this.getAttribute("data-value"));  // به‌روزرسانی فیلدهای پاس
    });
});

// باز کردن پاپ اپ گزارش پاس ساعتی کاربر
document.getElementById('showMorepopuphourbox').addEventListener('click', function(event) {
    event.preventDefault(); // جلوگیری از بارگذاری مجدد صفحه
    var popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.style.display = 'flex'; // نمایش پاپ‌آپ
});

// بستن پاپ اپ گزارش پاس ساعتی کاربر
document.getElementById('closePopup').addEventListener('click', function(event) {
    event.preventDefault(); // جلوگیری از بارگذاری مجدد صفحه
    var popupOverlay = document.getElementById('popupOverlay');
    popupOverlay.style.display = 'none'; // بستن پاپ‌آپ
});

// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر
// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر
// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر// تنظمیات ثبت تیکت کاربر

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

// ارسال فرم ثبت تیکت
document.getElementById('ticketForm').addEventListener('submit', function(e) {
    e.preventDefault(); // جلوگیری از ارسال فرم به طور پیش‌فرض

    // دریافت فیلدهای مختلف فرم
    const ticketReceiver = document.getElementById('ticketReceiver') ? document.getElementById('ticketReceiver').value : '';
    const ticketTitle = document.getElementById('ticketTitle') ? document.getElementById('ticketTitle').value : '';
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
            setTimeout(() => {
                location.reload(); // رفرش صفحه بعد از کمی تأخیر
            }, 500); // 0.5 ثانیه تأخیر برای تجربه کاربری بهتر
        } else {
            alert('خطا در ثبت تیکت! ' + (data.message || ''));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('مشکلی در ارسال درخواست پیش آمده است.');
    });
});

// تنظیمات پنجره ویرایش تیکت ها// تنظیمات پنجره ویرایش تیکت ها// تنظیمات پنجره ویرایش تیکت ها// تنظیمات پنجره ویرایش تیکت ها
// تنظیمات پنجره ویرایش تیکت ها// تنظیمات پنجره ویرایش تیکت ها// تنظیمات پنجره ویرایش تیکت ها// تنظیمات پنجره ویرایش تیکت ها
// تنظیمات پنجره ویرایش تیکت ها// تنظیمات پنجره ویرایش تیکت ها// تنظیمات پنجره ویرایش تیکت ها// تنظیمات پنجره ویرایش تیکت ها

// بارگذاری لیست دریافت‌کنندگان در باکس ویرایش تیکت
function loadReceivers() {
    fetch('/get_receivers')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('ticketReceiver');
            data.forEach(username => {
                const option = document.createElement('option');
                option.value = username;
                option.textContent = username;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching receivers:', error));
}

// بارگذاری لیست کاربران برای ویرایش
function loadUsersForEdit() {
    fetch('/get_users')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const receiverSelect = document.getElementById('ticketEditReceiver');
                
                receiverSelect.innerHTML = '<option value="" disabled selected>انتخاب کنید</option>';
                
                const adminOption = document.createElement('option');
                adminOption.value = 'admin';
                adminOption.textContent = 'admin';
                receiverSelect.appendChild(adminOption);

                data.users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.value;  // مقدار username
                    option.textContent = user.value;  // نمایش username به جای name
                    receiverSelect.appendChild(option);
                });
            } else {
                console.error('Error fetching users:', data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

// باز کردن پاپ‌آپ ثبت تیکت برای ویرایش
function openEditTicketModal(button) {
    // گرفتن اطلاعات از دکمه
    const ticketId = button.getAttribute('data-id');  // دریافت ID تیکت
    const receiver = button.getAttribute('data-receiver');
    const title = button.getAttribute('data-title');
    const description = button.getAttribute('data-description');

    // پر کردن فیلدها در فرم
    document.getElementById("ticketEditTitle").value = title;
    document.getElementById("ticketEditDescription").value = description;

    // پیدا کردن گزینه صحیح و انتخاب آن در فیلد select
    const receiverSelect = document.getElementById("ticketEditReceiver");
    for (let option of receiverSelect.options) {
        if (option.value === receiver) {
            option.selected = true;
            break;
        }
    }

    // نمایش پاپ‌آپ
    document.getElementById("ticketEditModal").style.display = "block";

    // ذخیره ID تیکت در یک متغیر جهانی
    window.currentTicketId = ticketId;
}

// بستن پاپ‌آپ ویرایش تیکت
function closeEditTicketModal() {document.getElementById("ticketEditModal").style.display = "none";}

// ارسال داده‌ها به سرور هنگام تایید ویرایش
document.getElementById("ticketEditeForm").addEventListener("submit", function(event) {
    event.preventDefault();  // جلوگیری از ارسال فرم به طور معمول

    const receiver = document.getElementById("ticketEditReceiver").value;
    const title = document.getElementById("ticketEditTitle").value;
    const description = document.getElementById("ticketEditDescription").value;

    // ارسال داده‌ها به سرور
    fetch('/update_ticket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: window.currentTicketId,  // ارسال ID تیکت
            receiver: receiver,
            title: title,
            description: description
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("تیکت با موفقیت ویرایش شد.");
            closeEditTicketModal();  // بستن پاپ‌آپ
            location.reload();  // رفرش صفحه برای نمایش تغییرات
        } else {
            alert("خطا در ویرایش تیکت.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("مشکلی پیش آمده است.");
    });
});

let currentTicketId = null;

// نمایش مدال تایید حذف و ذخیره شناسه تیکت انتخابی
function showConfirmDialog(ticketId) {
    currentTicketId = parseInt(ticketId, 10);  // تبدیل به عدد صحیح
    if (isNaN(currentTicketId)) {
        console.error("Invalid ticket ID:", ticketId);  // چاپ شناسه نامعتبر
    }
    document.getElementById('confirmDeleteModal').style.display = "block";
}

// بستن باکس مشاهده پیام
function hideViewDialog() {
    document.getElementById("popupMoshahedeoverlay").style.display = "none";
    document.getElementById("MoshahedePopupbox").style.display = "none";
    location.reload(); // ریلود شدن صفحه
}

// بستن مدال تایید حذف
function closeConfirmDialog() {document.getElementById('confirmDeleteModal').style.display = "none";}

// ارسال درخواست حذف به سرور پس از تایید
document.getElementById('confirmDeleteBtn').onclick = function() {
    if (currentTicketId !== null && !isNaN(currentTicketId)) {
        console.log("Ticket ID to delete:", currentTicketId);  // چاپ شناسه تیکت

        fetch('/delete-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ticket_id: currentTicketId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // حذف تیکت از جدول در صفحه (دقت کنید که تنها ردیف مربوطه حذف شود)
                const row = document.querySelector(`tr[data-ticket-id="${currentTicketId}"]`);
                if (row) row.remove();

                closeConfirmDialog(); // بستن پنجره مدال
                
                // ریلود کردن صفحه
                location.reload();
            } else {
                alert('Error deleting ticket: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        console.error("Invalid ticket ID during confirmation:", currentTicketId);
    }
};
















// تنظمیات باکس تقویم و اطلاعات کاربر// تنظمیات باکس تقویم و اطلاعات کاربر// تنظمیات باکس تقویم و اطلاعات کاربر// تنظمیات باکس تقویم و اطلاعات کاربر
// تنظمیات باکس تقویم و اطلاعات کاربر// تنظمیات باکس تقویم و اطلاعات کاربر// تنظمیات باکس تقویم و اطلاعات کاربر// تنظمیات باکس تقویم و اطلاعات کاربر
// تنظمیات باکس تقویم و اطلاعات کاربر// تنظمیات باکس تقویم و اطلاعات کاربر// تنظمیات باکس تقویم و اطلاعات کاربر// تنظمیات باکس تقویم و اطلاعات کاربر

// دریافت اطلاعات کاربر و نمایش در باکس اطلاعات کاربر
function loadUserInfo() {
    fetch('/get_user_info', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // پر کردن مقادیر و تبدیل اعداد به فارسی
            document.getElementById('userName').textContent = data.data.name || 'نام موجود نیست';
            document.getElementById('userLastName').textContent = data.data.last_name || 'نام خانوادگی موجود نیست';
            document.getElementById('userDepartment').textContent = data.data.department || 'بخش موجود نیست';
            document.getElementById('userWorkHours').textContent = data.data.work_hours ? convertToPersianNumbers(data.data.work_hours) : 'ساعت‌های کاری موجود نیست';
            document.getElementById('userSubstitute').textContent = data.data.substitute || 'جانشین موجود نیست';
        } else {
            alert(data.message || 'خطا در دریافت اطلاعات');
        }
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
        alert('خطا در ارتباط با سرور');
    });
}
window.onload = function() {
    loadReceivers();
    loadUserInfo();
    loadUsersForEdit();
    
    var numberElement = document.querySelector('.NumberNotif');
    var number = numberElement.innerText || numberElement.textContent;
    
    // تبدیل عدد به فارسی
    var persianNumber = number.replace(/\d/g, function(match) {
        var persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return persianDigits[match];
    });
    
    // بروزرسانی عدد در صفحه
    numberElement.innerText = persianNumber;
};

// ماه‌های شمسی
// ماه‌های شمسی
// ماه‌های شمسی
// ماه‌های شمسی
// ماه‌های شمسی
// ماه‌های شمسی
// ماه‌های شمسی
// ماه‌های شمسی
// ماه‌های شمسی
// ماه‌های شمسی
const persianMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

// تعداد روزهای هر ماه شمسی
const daysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];

// تعطیلات (مثال: تعطیلات شمسی ماه‌ها)
const holidays = {
    10: [25],  // مهر - تعطیلات: 25
};

// تبدیل اعداد به فارسی
const convertToPersianNumber = (str) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/\d/g, digit => persianNumbers[digit]);
};

// متغیرهای وضعیت برای ماه و سال
let currentYear, currentMonth, currentDay, firstDayOfWeek;

// به‌روزرسانی تقویم
const updateCalendar = () => {
    const monthYearElement = document.querySelector('.month-year');
    const calendarGrid = document.querySelector('.calendar-grid');

    // به‌روزرسانی نام ماه و سال
    monthYearElement.innerHTML = `${persianMonths[currentMonth - 1]} ${convertToPersianNumber(currentYear.toString())}`;

    // پاک کردن روزهای قبلی
    calendarGrid.innerHTML = '';

    // افزودن نام روزها
    const daysOfWeek = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-name';
        dayElement.textContent = day;
        calendarGrid.appendChild(dayElement);
    });

    // تعداد روزهای ماه جاری
    const days = daysInMonth[currentMonth - 1];
    
    // تعداد خالی‌ها برای شروع ماه جدید
    let emptyDays = firstDayOfWeek;

    // نمایش خالی‌ها در ابتدا
    for (let i = 0; i < emptyDays; i++) {
        const emptyElement = document.createElement('div');
        emptyElement.className = 'day empty';
        calendarGrid.appendChild(emptyElement);
    }

    // نمایش روزهای ماه
    for (let i = 1; i <= days; i++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = convertToPersianNumber(i.toString());

        // اگر روز جمعه باشد، رنگ متن آن قرمز شود
        const dayOfWeek = (firstDayOfWeek + i - 1) % 7;
        if (dayOfWeek === 6) {  // جمعه
            dayElement.style.color = 'red';
        }

        // اگر روز تعطیل باشد، استایل خاصی به آن اعمال شود
        if (holidays[currentMonth] && holidays[currentMonth].includes(i)) {
            dayElement.style.color = 'white';
            dayElement.style.backgroundColor = 'red';
        }

        // اگر روز جاری باشد، استایل خاصی به آن اعمال شود
        if (i === currentDay) {
            dayElement.classList.add('today');
        }

        calendarGrid.appendChild(dayElement);
    }
};

// ذخیره‌سازی روز اول هفته برای هر ماه
const persianMonthFirstDays = {
    1: 6,   // فروردین: شنبه
    2: 2,   // اردیبهشت: سه‌شنبه
    3: 5,   // خرداد: جمعه
    4: 1,   // تیر: دوشنبه
    5: 4,   // مرداد: پنجشنبه
    6: 7,   // شهریور: شنبه
    7: 3,   // مهر: سه‌شنبه
    8: 6,   // آبان: شنبه
    9: 1,   // آذر: دوشنبه
    10: 0,  // دی: پنجشنبه
    11: 2,  // بهمن: شنبه
    12: 4   // اسفند: سه‌شنبه
};

// تعداد روزهای یک سال شمسی
const daysInPersianYear = 365; // در سال‌های عادی (نه کبیسه)

// محاسبه روز اول هفته برای سال بعد
const calculateFirstDayOfWeekForNextYear = (firstDayOfWeek, yearIsLeap) => {
    const totalDaysInYear = yearIsLeap ? daysInPersianYear + 1 : daysInPersianYear;
    return (firstDayOfWeek + totalDaysInYear) % 7;
};

// به‌روزرسانی محاسبه روز اول هفته
const fetchDateFromServer = async () => {
    try {
        const response = await fetch('/api/date');
        const data = await response.json();

        // تنظیم تاریخ اولیه
        currentYear = data.year;
        currentMonth = data.month;
        currentDay = data.day;

        // روز اول هفته برای ماه فعلی را از ذخیره‌سازی بگیرید
        firstDayOfWeek = persianMonthFirstDays[currentMonth];

        // به‌روزرسانی تقویم با استفاده از تاریخ دریافتی
        updateCalendar();
    } catch (error) {
        console.error("Error fetching date:", error);
    }
};

// تغییر ماه به ماه قبل
const prevMonth = () => {
    if (currentMonth === 1) {
        currentMonth = 12;
        currentYear -= 1;
    } else {
        currentMonth -= 1;
    }

    // روز اول هفته ماه قبلی را از ذخیره‌سازی بگیرید
    firstDayOfWeek = persianMonthFirstDays[currentMonth];

    updateCalendar();
};

// تغییر ماه به ماه بعد
const nextMonth = () => {
    if (currentMonth === 12) {
        currentMonth = 1;
        currentYear += 1;
    } else {
        currentMonth += 1;
    }

    // روز اول هفته ماه بعدی را از ذخیره‌سازی بگیرید
    firstDayOfWeek = persianMonthFirstDays[currentMonth];

    updateCalendar();
};

// اضافه کردن رویداد به دکمه‌ها
document.querySelector('.prev-month').addEventListener('click', prevMonth);
document.querySelector('.next-month').addEventListener('click', nextMonth);

// به‌روزرسانی تقویم هنگام بارگذاری صفحه
fetchDateFromServer();

// تنظیمات باز کردن باکس کوچک نوتیف های کاربر// تنظیمات باز کردن باکس کوچک نوتیف های کاربر// تنظیمات باز کردن باکس کوچک نوتیف های کاربر
// تنظیمات باز کردن باکس کوچک نوتیف های کاربر// تنظیمات باز کردن باکس کوچک نوتیف های کاربر// تنظیمات باز کردن باکس کوچک نوتیف های کاربر
// تنظیمات باز کردن باکس کوچک نوتیف های کاربر// تنظیمات باز کردن باکس کوچک نوتیف های کاربر// تنظیمات باز کردن باکس کوچک نوتیف های کاربر

document.addEventListener("DOMContentLoaded", function () {
    const icon = document.getElementById("massageBoxIcon");
    const popup = document.getElementById("massageBoxPopup");
    const closeBtn = document.getElementById("closeMassageBoxPopup");

    // نمایش پاپ‌آپ
    icon.addEventListener("click", function () {
        popup.style.display = "block";
    
        setTimeout(function () {
            // بررسی عرض نمایشگر و تنظیم مقدار top بر اساس آن
            if (window.matchMedia("(max-width: 768px)").matches) {
                popup.style.top = "10.5rem"; 
            } else {
                popup.style.top = "12.5rem"; 
            }
            popup.style.opacity = "1"; // نمایان شدن پاپ‌آپ
        }, 10); 
    });

    // بستن پاپ‌آپ
    closeBtn.addEventListener("click", function () {
        popup.style.top = "-10%";  // موقعیت پنهان شدن
        popup.style.opacity = "0";  // مخفی کردن پاپ‌آپ
        setTimeout(function () {
            popup.style.display = "none";  // پنهان کردن بعد از انیمیشن
        }, 300);  // مدت زمان انیمیشن
    });

    // بستن پاپ‌آپ با کلیک بیرون از آن
    window.addEventListener("click", function (e) {
        if (e.target === popup) {
            popup.style.top = "-10%";  // موقعیت پنهان شدن
            popup.style.opacity = "0";  // مخفی کردن پاپ‌آپ
            setTimeout(function () {
                popup.style.display = "none";  // پنهان کردن بعد از انیمیشن
            }, 300);
        }
    });
});

// تنظمیات کامل باز شدن و چت کردن در تیکت ها// تنظمیات کامل باز شدن و چت کردن در تیکت ها// تنظمیات کامل باز شدن و چت کردن در تیکت ها
// تنظمیات کامل باز شدن و چت کردن در تیکت ها// تنظمیات کامل باز شدن و چت کردن در تیکت ها// تنظمیات کامل باز شدن و چت کردن در تیکت ها
// تنظمیات کامل باز شدن و چت کردن در تیکت ها// تنظمیات کامل باز شدن و چت کردن در تیکت ها// تنظمیات کامل باز شدن و چت کردن در تیکت ها

let ticketData = null;

function openViewDialog(button) {
    // نمایش پاپ‌آپ
    document.querySelector('#popupMoshahedeoverlay').style.display = 'block';
    document.querySelector('#MoshahedePopupbox').style.display = 'block';

    // استخراج عنوان و شناسه تیکت از داده‌های دکمه
    const ticketId = button.getAttribute('data-id');
    const ticketTitle = button.getAttribute('data-title');

    // نمایش عنوان تیکت در پاپ‌آپ
    document.querySelector('#ticketTitle').textContent = ticketTitle;

    // درخواست به سرور برای دریافت جزئیات تیکت
    fetch(`/get_ticket_details_payam/${ticketId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                alert('خطایی در دریافت اطلاعات تیکت رخ داده است.');
                return;
            }

            // ذخیره اطلاعات تیکت در متغیر ticketData
            ticketData = data;

            // دریافت و نمایش پیام‌ها
            const kadrMatnContainer = document.querySelector('#MoshahedePopupbox .kadr-matn');
            kadrMatnContainer.innerHTML = ''; // پاک کردن پیام‌های قبلی

            const sortedMessages = data.messages.sort((a, b) => new Date(a.ticket_date) - new Date(b.ticket_date));

            let userClasses = {};

            sortedMessages.forEach((message) => {
                const messageDiv = document.createElement('div');
                const currentUsername = message.username.trim().toLowerCase();

                if (!userClasses['karbar1']) {
                    userClasses['karbar1'] = currentUsername;
                    messageDiv.classList.add('matn1');
                } else if (!userClasses['karbar2'] && currentUsername !== userClasses['karbar1']) {
                    userClasses['karbar2'] = currentUsername;
                    messageDiv.classList.add('matn2');
                } else if (currentUsername === userClasses['karbar1']) {
                    messageDiv.classList.add('matn1');
                } else if (currentUsername === userClasses['karbar2']) {
                    messageDiv.classList.add('matn2');
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

            // ارسال درخواست برای علامت‌گذاری پیام‌ها به‌عنوان خوانده‌شده
            fetch(`/mark_ticket_as_read/${ticketId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(result => {
                if (!result.success) {
                    console.error('خطا در به‌روزرسانی وضعیت خوانده‌شده:', result.error);
                }
            })
            .catch(error => {
                console.error('Error marking ticket as read:', error);
            });

        })
        .catch(error => {
            console.error('Error fetching ticket details:', error);
        });
}


// رویداد کلیک روی ersal-icon
document.querySelector('.ersal-icon').addEventListener('click', sendTicketResponse);

// رویداد keydown برای دکمه Enter
document.querySelector('#matnErsali').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // جلوگیری از ارسال فرم (اگر فرم وجود داشته باشد)
        sendTicketResponse();
    }
});

function sendTicketResponse() {
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
    fetch('/add_ticket_response_userpanel', {
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
}

function openViewMassageBoxDialog(button) {
    // نمایش پاپ‌آپ
    document.querySelector('#popupMoshahedeoverlay').style.display = 'block';
    document.querySelector('#MoshahedePopupbox').style.display = 'block';

    // استخراج شناسه تیکت
    const ticketId = button.getAttribute('data-id');

    // ارسال درخواست به سرور برای به‌روزرسانی مقدار is_read
    fetch(`/mark_ticket_as_read/${ticketId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('وضعیت تیکت به خوانده‌شده تغییر یافت.');
            } else {
                console.error('خطا در به‌روزرسانی وضعیت تیکت:', data.error);
            }
        })
        .catch(error => {
            console.error('خطای ارتباط با سرور:', error);
        });

    // درخواست به سرور برای دریافت جزئیات تیکت
    fetch(`/get_ticket_details_payam/${ticketId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                alert('خطایی در دریافت اطلاعات تیکت رخ داده است.');
                return;
            }

            // ذخیره اطلاعات تیکت در متغیر ticketData
            ticketData = data;

            // دریافت و نمایش پیام‌ها
            const kadrMatnContainer = document.querySelector('#MoshahedePopupbox .kadr-matn');
            kadrMatnContainer.innerHTML = ''; // پاک کردن پیام‌های قبلی

            const sortedMessages = data.messages.sort((a, b) => new Date(a.ticket_date) - new Date(b.ticket_date));

            let userClasses = {};

            sortedMessages.forEach((message) => {
                const messageDiv = document.createElement('div');
                const currentUsername = message.username.trim().toLowerCase();

                if (!userClasses['karbar1']) {
                    userClasses['karbar1'] = currentUsername;
                    messageDiv.classList.add('matn1');
                } else if (!userClasses['karbar2'] && currentUsername !== userClasses['karbar1']) {
                    userClasses['karbar2'] = currentUsername;
                    messageDiv.classList.add('matn2');
                } else if (currentUsername === userClasses['karbar1']) {
                    messageDiv.classList.add('matn1');
                } else if (currentUsername === userClasses['karbar2']) {
                    messageDiv.classList.add('matn2');
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

// تنظیمات تایمر بستن صفحه پنل کاربر// تنظیمات تایمر بستن صفحه پنل کاربر// تنظیمات تایمر بستن صفحه پنل کاربر// تنظیمات تایمر بستن صفحه پنل کاربر
// تنظیمات تایمر بستن صفحه پنل کاربر// تنظیمات تایمر بستن صفحه پنل کاربر// تنظیمات تایمر بستن صفحه پنل کاربر// تنظیمات تایمر بستن صفحه پنل کاربر
// تنظیمات تایمر بستن صفحه پنل کاربر// تنظیمات تایمر بستن صفحه پنل کاربر// تنظیمات تایمر بستن صفحه پنل کاربر// تنظیمات تایمر بستن صفحه پنل کاربر

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

// تابع برای تبدیل اعداد به فارسی
function convertToPersianNumbers(str) {
    // اطمینان از اینکه ورودی رشته است
    str = String(str);  // تبدیل به رشته

    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/\d/g, function (match) {
        return persianNumbers[match];
    });
}

// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن
// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن
// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن// باز کردن پاپ‌آپ ساعت زن

document.getElementById('hozoorReport').addEventListener('click', function() {
    // نمایش پاپ آپ
    document.getElementById('popupHozoor').style.display = 'flex';

    // پیدا کردن نام کاربر از صفحه
    var welcomeText = document.querySelector('.welcome-text');
    var username = welcomeText.textContent.split('،')[0];

    // دریافت تاریخ از سرور
    fetch('/get_today_date')
        .then(response => response.json())
        .then(today => {
            var startDate = `${today.year}/${today.month.toString().padStart(2, '0')}/01`;
            var endDate = `${today.year}/${today.month.toString().padStart(2, '0')}/${today.day.toString().padStart(2, '0')}`;

            // ارسال درخواست برای دریافت داده‌ها
            fetch(`/get_hozoor/${username}?start_date=${startDate}&end_date=${endDate}`)
                .then(response => response.json())
                .then(data => {
                    // پاک کردن جدول قبلی
                    var tableBody = document.querySelector('#HozoorTableReport tbody');
                    tableBody.innerHTML = '';

                    // پر کردن جدول با داده‌های دریافتی
                    data.forEach((entry, index) => {
                        var row = document.createElement('tr');

                        var statusCell = document.createElement('td');
                        statusCell.classList.add('vazeiyat-hozoorTime');
                        statusCell.textContent = entry.Status;
                        row.appendChild(statusCell);

                        var exitTimeCell = document.createElement('td');
                        exitTimeCell.classList.add('zmnkhrj-hozoorTime');
                        exitTimeCell.textContent = convertToPersianNumbers(entry.ExitTime);
                        row.appendChild(exitTimeCell);

                        var entryTimeCell = document.createElement('td');
                        entryTimeCell.classList.add('zmnvrd-hozoorTime');
                        entryTimeCell.textContent = convertToPersianNumbers(entry.EntryTime);
                        row.appendChild(entryTimeCell);

                        var dateCell = document.createElement('td');
                        dateCell.classList.add('trkhsbt-hozoorTime');
                        dateCell.textContent = convertToPersianNumbers(entry.Date);
                        row.appendChild(dateCell);

                        var rowNumberCell = document.createElement('td');
                        rowNumberCell.classList.add('radif-hozoorTime');
                        rowNumberCell.textContent = convertToPersianNumbers((index + 1).toString());
                        row.appendChild(rowNumberCell);

                        tableBody.appendChild(row);
                    });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching date from server:', error);
        });
});

// بستن پاپ‌آپ ساعت زن
document.getElementById('close-popupHozoor').addEventListener('click', function() {
    document.getElementById('popupHozoor').style.display = 'none';
});

// تنظیمات دراپ باکس در جدول تیکت های کاربر// تنظیمات دراپ باکس در جدول تیکت های کاربر// تنظیمات دراپ باکس در جدول تیکت های کاربر
// تنظیمات دراپ باکس در جدول تیکت های کاربر// تنظیمات دراپ باکس در جدول تیکت های کاربر// تنظیمات دراپ باکس در جدول تیکت های کاربر
// تنظیمات دراپ باکس در جدول تیکت های کاربر// تنظیمات دراپ باکس در جدول تیکت های کاربر// تنظیمات دراپ باکس در جدول تیکت های کاربر

function toggleDropdown(event) {
    let dropdown = event.currentTarget.querySelector('.dropdown');
    let allDropdowns = document.querySelectorAll('.dropdown');

    // بستن سایر دراپ‌دان‌ها
    allDropdowns.forEach(d => {
        if (d !== dropdown) d.style.display = 'none';
    });

    // باز یا بسته کردن دراپ‌دان انتخاب شده
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';

    // جلوگیری از بسته شدن فوری باکس هنگام کلیک روی آن
    event.stopPropagation();
}

function changeStatus(element, newStatus) {
    let td = element.closest('.vazeiyat-ticket');  // پیدا کردن والد `td`
    let statusSpan = td.querySelector('#ticket-status'); // پیدا کردن span داخل td
    let dropdown = td.querySelector('.dropdown'); // پیدا کردن دراپ‌دان مربوطه

    // تغییر وضعیت
    statusSpan.innerText = newStatus;

    // بستن دراپ‌دان
    dropdown.style.display = 'none';
}

// بستن همه دراپ‌دان‌ها هنگام کلیک در خارج از آنها
document.addEventListener('click', function (event) {
    document.querySelectorAll('.dropdown').forEach(d => {
        d.style.display = 'none';
    });
});

// تنظیمات دکمه تایید در تیکت های کاربر// تنظیمات دکمه تایید در تیکت های کاربر// تنظیمات دکمه تایید در تیکت های کاربر
// تنظیمات دکمه تایید در تیکت های کاربر// تنظیمات دکمه تایید در تیکت های کاربر// تنظیمات دکمه تایید در تیکت های کاربر
// تنظیمات دکمه تایید در تیکت های کاربر// تنظیمات دکمه تایید در تیکت های کاربر// تنظیمات دکمه تایید در تیکت های کاربر

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".check-btn").forEach(button => {
        button.addEventListener("click", function () {
            let row = this.closest("tr");
            let ticketId = row.querySelector(".virayesh-ticket .edit-btn")?.getAttribute("data-id") || 
                           row.querySelector(".view-btn")?.getAttribute("data-id");

            if (!ticketId) {
                alert("شناسه تیکت یافت نشد!");
                return;
            }

            let currentStatus = row.querySelector("#ticket-status").innerText.trim();
            let newStatus = "تایید شده"; // مقدار جدید برای وضعیت تیکت

            fetch("/update_ticket_status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: ticketId,
                    ticket_status: newStatus
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    row.querySelector("#ticket-status").innerText = newStatus;
                    alert("وضعیت تیکت با موفقیت به‌روزرسانی شد!");
                } else {
                    alert("خطا در به‌روزرسانی وضعیت: " + (data.error || "نامشخص"));
                }
            })
            .catch(error => console.error("خطا در ارسال درخواست:", error));
        });
    });
});