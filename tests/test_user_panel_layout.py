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


if __name__ == '__main__':
    unittest.main()
