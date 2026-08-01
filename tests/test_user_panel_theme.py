from pathlib import Path


def test_user_panel_dark_mode_rules_cover_core_surfaces():
    css_path = Path(__file__).resolve().parents[1] / "app" / "static" / "css" / "user-panel-style.css"
    css = css_path.read_text(encoding="utf-8")

    assert "body.dark-mode .topbar-user" in css
    assert "body.dark-mode .avatar-menu" in css
    assert "body.dark-mode .calendar-dropdown" in css
    assert "body.dark-mode .modal" in css
    assert "body.dark-mode .leave-date-picker" in css
    assert "body.dark-mode .pass-item" in css
