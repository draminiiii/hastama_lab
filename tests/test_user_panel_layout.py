import unittest
from pathlib import Path


class UserPanelLayoutTests(unittest.TestCase):
    def test_today_event_card_is_moved_into_calendar_row(self):
        template_path = Path(__file__).resolve().parents[1] / "app" / "templates" / "user-panel.html"
        template = template_path.read_text(encoding="utf-8")

        stats_start = template.index('<section class="stats-row">')
        stats_end = template.index('</section>', stats_start)
        stats_section = template[stats_start:stats_end]

        calendar_start = template.index('<section class="calendar-row">')
        calendar_end = template.index('</section>', calendar_start + 1)
        calendar_section = template[calendar_start:calendar_end]

        self.assertIn('رویداد امروز', calendar_section)
        self.assertNotIn('رویداد امروز', stats_section)

    def test_profile_panel_markup_exists(self):
        template_path = Path(__file__).resolve().parents[1] / "app" / "templates" / "user-panel.html"
        template = template_path.read_text(encoding="utf-8")

        self.assertIn('id="profilePanel"', template)
        self.assertIn('data-action="open-profile-panel"', template)
        self.assertIn('data-action="close-profile-panel"', template)

    def test_sidebar_animation_is_stable_and_no_scrollbar_jank(self):
        admin_css = (Path(__file__).resolve().parents[1] / "app" / "static" / "css" / "admin.css").read_text(encoding="utf-8")
        user_panel_css = (Path(__file__).resolve().parents[1] / "app" / "static" / "css" / "user-panel-style.css").read_text(encoding="utf-8")

        admin_sidebar_start = admin_css.index('.rightSidebar {')
        admin_sidebar_end = admin_css.index('.icon-container {', admin_sidebar_start)
        admin_sidebar_block = admin_css[admin_sidebar_start:admin_sidebar_end]

        user_sidebar_start = user_panel_css.index('.sidebar-right {')
        user_sidebar_end = user_panel_css.index('.sidebar-top-card {', user_sidebar_start)
        user_sidebar_block = user_panel_css[user_sidebar_start:user_sidebar_end]

        self.assertIn('will-change: width', admin_sidebar_block)
        self.assertNotIn('overflow-y: auto', admin_sidebar_block)
        self.assertIn('will-change: width', user_sidebar_block)
        self.assertNotIn('overflow-y: auto', user_sidebar_block)


if __name__ == '__main__':
    unittest.main()
