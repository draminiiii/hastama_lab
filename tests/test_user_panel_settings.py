from pathlib import Path


def test_user_panel_contains_settings_panel_content():
    template_path = Path("app/templates/user-panel.html")
    content = template_path.read_text(encoding="utf-8")

    assert "تنظیمات سامانه" in content
    assert "حالت روشن / تاریک / خودکار" in content
    assert "تنظیمات" in content
    assert "settings-panel" in content
