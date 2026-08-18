"""اجرای سوئیت DOM (jsdom) لایهٔ ریسپانسیو جداول.

این تست فقط وقتی اجرا می‌شود که Node.js و jsdom در دسترس باشند
(محیط توسعه؛ در CI بدون Node به‌صورت خودکار skip می‌شود):

    cd tests/js && npm install jsdom

سوئیت رفتار واقعی کامپوننت را می‌سنجد: ساخت کارت از همان DOM جدول،
انتقال کنترل‌های تعاملی با حفظ رویدادها، منوی اقدامات و شیت جزئیات،
حالت‌های خالی/بارگذاری، همگام‌سازی با MutationObserver، بازگشت
بی‌نقص به دسکتاپ و ستون‌های چسبان جدول‌های اسکرول‌شونده.
"""
from __future__ import annotations

import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
HARNESS = ROOT / "tests" / "js" / "responsive-tables.dom.test.js"


def _node() -> str | None:
    return shutil.which("node")


def _jsdom_paths() -> list[Path]:
    return [
        ROOT / "tests" / "js" / "node_modules",
        ROOT / "node_modules",
        ROOT / "rt-sandbox" / "node_modules",
    ]


def test_responsive_tables_dom_suite():
    node = _node()
    if not node:
        pytest.skip("Node.js در دسترس نیست (سوئیت DOM فقط محیط توسعه است)")
    if not HARNESS.exists():
        pytest.fail(f"فایل سوئیت پیدا نشد: {HARNESS}")
    node_path = next((p for p in _jsdom_paths() if (p / "jsdom").exists()), None)
    if not node_path:
        pytest.skip("jsmod نصب نشده است — برای اجرا: cd tests/js && npm install jsdom")

    import os

    env = dict(os.environ)
    env["NODE_PATH"] = str(node_path)
    result = subprocess.run(
        [node, str(HARNESS)],
        capture_output=True,
        text=True,
        timeout=180,
        env=env,
        cwd=str(ROOT),
    )
    tail = "\n".join((result.stdout or "").splitlines()[-8:])
    assert result.returncode == 0, f"DOM suite failed:\n{result.stdout}\n{result.stderr}\n--- tail ---\n{tail}"
    assert " 0 failed" in result.stdout or "0 failed" in result.stdout
