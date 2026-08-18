"""تست‌های لایهٔ ارائهٔ ریسپانسیو جداول (responsive-tables)

این تست‌ها تضمین می‌کنند که:
  ۱) فایل‌های مشترک (JS/CSS) در همهٔ صفحات دارای جدول include شده‌اند؛
  ۲) «هر» جدولِ موجود در قالب‌ها در رجیستری responsive-tables.js یک الگوی
     موبایل (cards/list/scroll/keep) دارد — هیچ جدولی بدون طراحی موبایل نمی‌ماند؛
  ۳) اجزای کلیدی CSS (کارت، شیت، نشان وضعیت، اسکرول، اسکلتون، حالت خالی،
     ستون چسبان، چاپ) موجودند؛
  ۴) هیچ قانونی باعث اسکرول افقی کل صفحه نمی‌شود و ساختار معنایی جدول‌ها
     (display:block روی td/th) شکسته نمی‌شود.
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "app" / "templates"
JS = (ROOT / "app" / "static" / "js" / "responsive-tables.js").read_text(encoding="utf-8")
CSS = (ROOT / "app" / "static" / "css" / "responsive-tables.css").read_text(encoding="utf-8")

# صفحاتی که جدول دارند (login جدول ندارد)
TABLE_PAGES = [
    "admin.html",
    "user-panel.html",
    "final_report_page.html",
    "leave_report_page.html",
    "hourlypass_Report_page.html",
    "overtime_report_page.html",
]


def page(name: str) -> str:
    return (TEMPLATES / name).read_text(encoding="utf-8")


def test_assets_included_on_all_table_pages():
    for name in TABLE_PAGES:
        html = page(name)
        assert "css/responsive-tables.css" in html, f"{name}: CSS مشترک include نشده است"
        assert "js/responsive-tables.js" in html, f"{name}: JS مشترک include نشده است"


def test_js_loads_before_page_scripts():
    """لایهٔ ارائه باید قبل از اسکریپت صفحه بارگذاری شود تا رندر اولیه را ببیند."""
    for name, script in [
        ("admin.html", "js/admin.js"),
        ("user-panel.html", "js/user-panel-script.js"),
        ("leave_report_page.html", "js/leave-report-script.js"),
        ("hourlypass_Report_page.html", "js/hourlypass-report-script.js"),
        ("overtime_report_page.html", "js/overtime-report-script.js"),
        ("final_report_page.html", "js/final-report-script.js"),
    ]:
        html = page(name)
        ours = html.find("js/responsive-tables.js")
        theirs = html.find(script)
        assert ours != -1 and theirs != -1 and ours < theirs, f"{name}: ترتیب بارگذاری اسکریپت‌ها نادرست است"


def _config_selectors() -> dict:
    """استخراج {selector: pattern} از CONFIGS داخل JS."""
    configs = {}
    for m in re.finditer(r"\{\s*sel:\s*'([^']+)',\s*pattern:\s*'(\w+)'", JS):
        configs[m.group(1)] = m.group(2)
    for m in re.finditer(r"\{\s*sel:\s*\"([^\"]+)\",\s*pattern:\s*\"(\w+)\"", JS):
        configs[m.group(1)] = m.group(2)
    return configs


def _tables_in_template(html: str):
    """(id, class-list) هر جدول موجود در قالب."""
    out = []
    for m in re.finditer(r"<table\b([^>]*)>", html):
        attrs = m.group(1)
        id_m = re.search(r'id="([^"]+)"', attrs)
        cls_m = re.search(r'class="([^"]+)"', attrs)
        out.append((id_m.group(1) if id_m else None, (cls_m.group(1) if cls_m else "").split()))
    return out


def _selector_covers(sel: str, table_id, classes, page_name: str) -> bool:
    """آیا انتخابگرِ کانفیگ، این جدول را در این صفحه پوشش می‌دهد؟ (تقریب ایستا)"""
    parts = sel.split()
    last = parts[-1]
    if not last.startswith("#") and not last.startswith("."):
        return False
    html = _page_text_cache[page_name]

    id_m = re.match(r"#([A-Za-z0-9_\-]+)", last)
    if id_m:
        want = id_m.group(1)
        if table_id == want:
            pass  # تطابق مستقیم id جدول
        elif f'<tbody id="{want}"' in html:
            pass  # انتخابگر به tbody جدول اشاره می‌کند (در JS به جدول والد تبدیل می‌شود)
        else:
            return False
    cls_list = re.findall(r"\.([A-Za-z0-9_\-]+)", last)
    if cls_list and not set(cls_list) <= set(classes):
        return False
    if not id_m and not cls_list:
        return False

    # نیاکان انتخابگر (مثل .management-box یا #hozoorbox) باید در صفحه باشند
    for anc in parts[:-1]:
        anc_name = re.sub(r"^[.#]", "", anc)
        if anc.startswith("#"):
            if f'id="{anc_name}"' not in html:
                return False
        elif anc.startswith("."):
            if anc_name not in html:
                return False
        else:
            return False
    return True


_page_text_cache: dict = {}


def test_every_table_has_a_mobile_pattern():
    configs = _config_selectors()
    assert len(configs) >= 24, "انتظار می‌رود دست‌کم ۲۴ کانفیگ جدول وجود داشته باشد"
    for name in TABLE_PAGES:
        html = page(name)
        _page_text_cache[name] = html
        for table_id, classes in _tables_in_template(html):
            covered = any(_selector_covers(sel, table_id, classes, name) for sel in configs)
            assert covered, (
                f"{name}: جدول id={table_id!r} class={classes} هیچ الگوی موبایلی ندارد"
            )


def test_all_four_patterns_used():
    configs = _config_selectors()
    patterns = set(configs.values())
    assert {"cards", "list", "scroll", "keep"} <= patterns, f"الگوهای vorhanden: {patterns}"


def test_core_css_components_exist():
    for token in [
        ".rt-card", ".rt-card__head", ".rt-card__title", ".rt-card__fields",
        ".rt-field__label", ".rt-field__value", ".rt-badge", ".rt-badge__icon",
        ".rt-list", ".rt-list__row", ".rt-list__avatar",
        ".rt-scroll", ".rt-scroll-wrap", ".rt-scroll-hint", ".rt-sticky--e1",
        ".rt-sheet", ".rt-sheet__panel", ".rt-menu__item",
        ".rt-empty", ".rt-skeleton-card", ".rt-more", ".rt-clamp",
        ".rt-actions-menu-btn", ".rt-btn--primary",
    ]:
        assert token in CSS, f"کامپوننت {token} در CSS وجود ندارد"


def test_css_balanced_braces():
    assert CSS.count("{") == CSS.count("}"), "آکولادهای CSS نامتوازن هستند"


def test_no_full_page_horizontal_scroll_rules():
    """لایهٔ موبایل نباید به body/html اسکرول افقی بدهد؛ اسکرول فقط داخل کانتینر."""
    bad = re.findall(r"(?m)^(?!\s*@\s*media)[^{\n]*\b(html|body)\b[^{\n]*\{[^}]*overflow-x:\s*scroll", CSS)
    assert not bad, f"قوانین ممنوع: {bad}"
    # کانتینر اسکرول فقط روی .rt-scroll تعریف شده باشد
    assert re.search(r"\.rt-scroll\s*\{[^}]*overflow-x:\s*auto", CSS)


def test_semantic_table_structure_preserved():
    """قانون صریح: هیچ display:blockی روی td/th/table اعمال نمی‌شود (کارت‌ها DOM جدا دارند)."""
    for m in re.finditer(r"(?m)^([^{\n]*)\{([^}]*)\}", CSS):
        sel, body_m = m.group(1).strip(), m.group(2)
        if re.search(r"(?:^|,)\s*(?:[^,{]*\b(?:td|th)\b[^,{]*)\s*$", sel) or re.search(r"\b(?:td|th)\b", sel):
            assert "display: block" not in body_m and "display:block" not in body_m, (
                f"شکستن ساختار جدول مجاز نیست: {sel}"
            )


def test_status_badge_never_color_only():
    """نشان وضعیت باید متن + آیکون داشته باشد (آیکون aria-hidden و متن جدا)."""
    assert ".rt-badge__text" in CSS
    assert "rt-badge__icon" in JS  # آیکون با JS ساخته می‌شود
    for variant in ["approved", "rejected", "pending", "cancelled", "neutral"]:
        assert f".rt-badge--{variant}" in CSS


def test_touch_targets_defined():
    assert "min-height: 44px" in CSS or "min-height:44px" in CSS
    assert ".rt-actions-menu-btn" in CSS and ("width: 44px" in CSS or "width:44px" in CSS)


def test_print_restores_tables():
    assert "@media print" in CSS
    assert "table.rt-source-hidden { display: table !important; }" in CSS.replace("  ", " ").replace("\n", " ").replace(" !important; }", " !important; }") or \
           re.search(r"table\.rt-source-hidden\s*\{\s*display:\s*table\s*!important;?\s*\}", CSS)


def test_breakpoints_configured():
    assert "bp: 860" in JS, "بریک‌پوینت پنل کاربری (۸۶۰) باید پیکربندی شود"
    assert "matchMedia" in JS
    assert "beforeprint" in JS and "afterprint" in JS


def test_no_duplicated_fetch_endpoints():
    """لایهٔ ارائه فقط وضعیت بارگذاری را نشان می‌دهد؛ درخواست جدیدی نمی‌سازد."""
    m = re.search(r"var ENDPOINT_MAP = \[(.*?)\n  \];", JS, re.S)
    assert m
    body = m.group(1)
    entries = re.findall(r"\{\s*re:\s*/.+?/,\s*sels:\s*\[[^\]]*\]\s*\}", body)
    assert entries and len(entries) == body.count("{"), \
        "ENDPOINT_MAP فقط نگاشت endpoint موجود → جدول است"


def test_single_data_source_architecture():
    """نمای موبایل از همان DOM جدول ساخته می‌شود (عدم دوگانگی داده/منطق)."""
    assert "querySelectorAll('tbody tr')" in JS or "querySelectorAll(\"tbody tr\")" in JS
    assert "MutationObserver" in JS
    # هیچ fetch جدیدی در مسیر رندر نیست
    render_fn = JS[JS.find("ResponsiveTable.prototype.render"):JS.find("ResponsiveTable.prototype.scheduleRender")]
    assert "fetch(" not in render_fn
