document.addEventListener("DOMContentLoaded", function() {
    let tableData = JSON.parse(localStorage.getItem("hozoorReportData"));

    if (tableData && tableData.length > 0) {
        let tableBody = document.querySelector("#hozoorUsersReportTable tbody");
        tableBody.innerHTML = "";

        tableData.forEach(item => {
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${convertToPersianNumbers(item.calculatedTime)}</td>
                <td>${convertToPersianNumbers(item.overtime)}</td>
                <td>${convertToPersianNumbers(item.earlyExit)}</td>
                <td>${convertToPersianNumbers(item.earlyStart)}</td>
                <td>${convertToPersianNumbers(item.delay)}</td>
                <td>${convertToPersianNumbers(item.exitTime)}</td>
                <td>${convertToPersianNumbers(item.entryTime)}</td>
                <td>${convertToPersianNumbers(item.date)}</td>
                <td>${convertToPersianNumbers(String(item.rowNumber))}</td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelector("#hozoornumBoxID span").textContent = ` ${convertToPersianNumbers(tableData.length.toString())} `;
    }

    // بازیابی و نمایش زمان‌ها در باکس‌های نهایی
    document.querySelector(".samanehTime").textContent = localStorage.getItem("totalOvertime") || "00:00";
    document.querySelector(".numBox:nth-child(2) .attendanceSamanehValue").innerText = localStorage.getItem("totalPresenceTime") || "00:00";
    document.querySelector(".numBox:nth-child(4) .value").innerText = localStorage.getItem("totalDelayTime") || "00:00";
    document.querySelector(".numBox:nth-child(6) .value").innerText = localStorage.getItem("totalEarlyStart") || "00:00";
    document.querySelector(".numBox:nth-child(7) .value").innerText = localStorage.getItem("totalEarlyExit") || "00:00";

    let selectedUsername = localStorage.getItem("selectedUsername");

    if (selectedUsername) {
        console.log("گزارش مربوط به کاربر:", selectedUsername);
    } else {
        console.warn("هیچ کاربری انتخاب نشده است!");
    }

    if (selectedUsername) {
        fetch(`/get_user_info_final_report_page/${selectedUsername}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("در دریافت اطلاعات کاربر خطایی رخ داد");
                }
                return res.json();
            })
            .then(data => {
                document.getElementById("userNameID").textContent = `${data.name} ${data.last_name}`;
                document.getElementById("userIdID").textContent = data.department;
            })
            .catch(err => {
                console.error("خطا:", err);
            });
    } else {
        console.warn("هیچ نام کاربری انتخاب نشده است.");
    }

});


// تابع تبدیل اعداد انگلیسی به فارسی
function convertToPersianNumbers(num) {
    return num.toString().replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d)]);
}

// تنظیمات جداول اضافه کاری، مرخصی و پاس های ساعتی// تنظیمات جداول اضافه کاری، مرخصی و پاس های ساعتی// تنظیمات جداول اضافه کاری، مرخصی و پاس های ساعتی
// تنظیمات جداول اضافه کاری، مرخصی و پاس های ساعتی// تنظیمات جداول اضافه کاری، مرخصی و پاس های ساعتی// تنظیمات جداول اضافه کاری، مرخصی و پاس های ساعتی
// تنظیمات جداول اضافه کاری، مرخصی و پاس های ساعتی// تنظیمات جداول اضافه کاری، مرخصی و پاس های ساعتی// تنظیمات جداول اضافه کاری، مرخصی و پاس های ساعتی

window.onload = function() {
    // خواندن داده‌های اضافه‌کاری از localStorage
    let overtimeData = JSON.parse(localStorage.getItem("overtimeReportData"));
    let leaveData = JSON.parse(localStorage.getItem("leaveReportData"));
    let hourlyPassData = JSON.parse(localStorage.getItem("hourlyPassReportData"));

    // تابع برای تبدیل اعداد فارسی به اعداد انگلیسی
    function convertPersianToEnglishNumbers(persianNumber) {
        const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
        const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        
        return persianNumber.split('').map(char => {
            const index = persianNumbers.indexOf(char);
            return index !== -1 ? englishNumbers[index] : char;
        }).join('');
    }

    // نمایش اطلاعات اضافه کاری ها
    if (overtimeData) {
        let tbody = document.querySelector("#ezafeKarUsersReportTable tbody");
        tbody.innerHTML = '';  // پاک کردن ردیف‌های قبلی

        let totalMinutes = 0;  // متغیر برای جمع‌آوری مجموع دقیقه‌های اضافه‌کاری

        overtimeData.forEach((data, index) => {
            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${data.description}</td>
                <td>${data.daily_overtime ? convertToPersianNumbers(data.daily_overtime) : '۰'}</td>
                <td>${data.to_time}</td>
                <td>${data.from_time}</td>
                <td>${data.overtime_date}</td>
                <td>${convertToPersianNumbers(String(index + 1))}</td>
            `;

            tbody.appendChild(row);

            // دریافت مقدار ستون دوم (مدت زمان اضافه‌کاری)
            const overtimeDate = row.children[1].textContent.trim();  // ستون دوم (مدت زمان)

            // تبدیل اعداد فارسی به انگلیسی
            const englishTime = convertPersianToEnglishNumbers(overtimeDate);
            
            // بررسی اینکه فرمت زمان صحیح است و به دقیقه تبدیل کنیم
            const timeParts = englishTime.split(":");
            if (timeParts.length === 2) {
                const hours = parseInt(timeParts[0], 10) || 0;
                const minutes = parseInt(timeParts[1], 10) || 0;
                totalMinutes += hours * 60 + minutes;  // جمع‌آوری مجموع دقیقه‌ها
            }
        });

        // تبدیل مجموع دقیقه‌ها به فرمت HH:MM
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        const formattedTime = `${totalHours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}`;

        // نمایش مجموع اضافه‌کاری در div با id "ezafeNumBoxID"
        document.querySelector("#ezafeNumBoxID").textContent = convertToPersianNumbers(formattedTime);

    }

    // نمایش اطلاعات مرخصی‌ها
    if (leaveData) {
        let tbody = document.querySelector("#morkhcUsersReportTable tbody");
        tbody.innerHTML = '';  // پاک کردن ردیف‌های قبلی

        let totalLeaveDays = 0;  // متغیر برای جمع‌آوری مجموع روزهای مرخصی

        leaveData.forEach((data, index) => {
            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${data.substitute ? data.substitute : '-'}</td>
                <td>${convertToPersianNumbers(data.days)}</td>
                <td>${convertToPersianNumbers(data.end_date)}</td>
                <td>${convertToPersianNumbers(data.start_date)}</td>
                <td>${convertToPersianNumbers(String(index + 1))}</td>
            `;

            tbody.appendChild(row);

            // جمع‌آوری مجموع روزهای مرخصی
            totalLeaveDays += parseFloat(data.days);
        });

        // نمایش مجموع مرخصی در قسمت مورد نظر
        document.querySelector("#roozeMorkhc").textContent = convertToPersianNumbers(totalLeaveDays.toString());

    }

    // نمایش اطلاعات پاس‌های ساعتی
if (hourlyPassData) {
    let tbody = document.querySelector("#hourlyPassUsersReportTable tbody");
    tbody.innerHTML = '';  // پاک کردن ردیف‌های قبلی

    let totalMinutes = 0;  // برای جمع کردن دقیقه‌ها

    hourlyPassData.forEach((data, index) => {
        // تبدیل مدت زمان به دقیقه و جمع کردن آن
        let passDurationParts = data.pass_duration.split(':');
        let hours = parseInt(passDurationParts[0]);
        let minutes = parseInt(passDurationParts[1]);
        totalMinutes += (hours * 60) + minutes;

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${convertToPersianNumbers(data.pass_duration)}</td>
            <td>${convertToPersianNumbers(data.pass_title)}</td>
            <td>${convertToPersianNumbers(data.request_date)}</td>
            <td>${convertToPersianNumbers(String(index + 1))}</td>
        `;

        tbody.appendChild(row);
    });

    // تبدیل دقیقه‌ها به فرمت HH:MM
    let totalHours = Math.floor(totalMinutes / 60);
    let remainingMinutes = totalMinutes % 60;
    let formattedTotalTime = `${convertToPersianNumbers(String(totalHours).padStart(2, '0'))}:${convertToPersianNumbers(String(remainingMinutes).padStart(2, '0'))}`;

    // نمایش مجموع مدت زمان در داخل div
    let passNumBox = document.querySelector("#passNumBoxID span");
    if (passNumBox) {
        passNumBox.textContent = formattedTotalTime;  // تنظیم مقدار داخل <span>
    }
}




// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم
// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم
// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم// محاسبه مدت زمان حضور سیستم

// تابع برای تبدیل اعداد فارسی به انگلیسی
function convertPersianNumbersToEnglish(str) {
    return str.replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}

// خواندن مجموع مدت زمان حضور از سامانه
let totalPresenceTime = document.querySelector(".numBox:nth-child(2) .attendanceSamanehValue").textContent.trim();
totalPresenceTime = convertPersianNumbersToEnglish(totalPresenceTime);
console.log("مدت زمان مجموع حضور در سامانه:", totalPresenceTime);

// خواندن مجموع مدت زمان اضافه کاری در سیستم
let ezafeSystemTime = document.querySelector("#ezafeNumBoxID").textContent.trim();
ezafeSystemTime = convertPersianNumbersToEnglish(ezafeSystemTime);
console.log("مدت زمان مجموع اضافه کاری در سیستم:", ezafeSystemTime);

// خواندن مجموع مدت زمان اضافه کاری سامانه
let ezafeSamanehTime = localStorage.getItem("totalOvertime") || "00:00";
ezafeSamanehTime = convertPersianNumbersToEnglish(ezafeSamanehTime);
console.log("مدت زمان مجموع اضافه کاری در سامانه:", ezafeSamanehTime);

// تابع برای تبدیل زمان به دقیقه
function convertToMinutes(time) {
    let parts = time.split(':');
    if (parts.length !== 2) {
        console.error("فرمت زمان اشتباه است:", time);
        return 0;
    }

    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1], 10);

    if (isNaN(hours) || isNaN(minutes)) {
        console.error("مقدار زمان نادرست است:", time);
        return 0;
    }

    return (hours * 60) + minutes;
}

// تابع برای تبدیل دقیقه به فرمت HH:MM
function formatMinutesToTime(minutes) {
    let hours = Math.floor(Math.abs(minutes) / 60);
    let mins = Math.abs(minutes) % 60;
    return `${(minutes < 0 ? "-" : "")}${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// تبدیل زمان‌ها به دقیقه
let presenceMinutes = convertToMinutes(totalPresenceTime);
let systemOvertimeMinutes = convertToMinutes(ezafeSystemTime);
let samanehOvertimeMinutes = convertToMinutes(ezafeSamanehTime);

// محاسبه تفاوت بین اضافه کاری در سیستم و اضافه کاری در سامانه
let overtimeDifference = systemOvertimeMinutes - samanehOvertimeMinutes;
let formattedOvertimeDifference = formatMinutesToTime(overtimeDifference);
console.log("تفاوت بین اضافه کاری در سیستم و اضافه کاری در سامانه:", formattedOvertimeDifference);

// 🔥 کم کردن اختلاف از مجموع مدت زمان حضور در سامانه
let adjustedPresenceMinutes = presenceMinutes - Math.abs(overtimeDifference); // کم کردن مقدار تفاوت
let adjustedPresenceTime = formatMinutesToTime(adjustedPresenceMinutes);
console.log("مدت زمان اصلاح‌شده حضور در سامانه بعد از کم کردن اختلاف:", adjustedPresenceTime);

// مقدار جدید را در تگ موردنظر نمایش بده
// تبدیل عدد به فارسی
let adjustedPresenceTimePersian = convertToPersianNumbers(adjustedPresenceTime);

// مقدار جدید را در تگ موردنظر نمایش بده
document.querySelector("#attendanceNumBoxID").textContent = adjustedPresenceTimePersian;

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

// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی
// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی
// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی// تبدیل اعداد به فارسی

function convertToPersianNumbers(number) {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(number).replace(/\d/g, (digit) => persianNumbers[digit]);
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".numBox span").forEach(span => {
        span.textContent = convertToPersianNumbers("     " + span.textContent + "     ");
    });

    document.querySelectorAll(".exportButtons .btn").forEach(button => {
        button.textContent = convertToPersianNumbers(button.textContent);
    });

    // تبدیل اعداد داخل input به فارسی
    const holidayDaysInput = document.getElementById("holidayDays");
    if (holidayDaysInput) {
        holidayDaysInput.addEventListener("input", function() {
            this.value = convertToPersianNumbers(this.value);
        });
    }
});