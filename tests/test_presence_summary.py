import unittest

from app.services.presence_summary import build_presence_summary, time_is_inside_range


class PresenceSummaryTests(unittest.TestCase):
    def test_day_entry_does_not_match_overnight_shift(self):
        self.assertFalse(time_is_inside_range("09:13", "15:00-08:00"))
        self.assertTrue(time_is_inside_range("09:13", "08:00-15:00"))

    def test_shift_with_overtime_uses_blue_segment(self):
        summary = build_presence_summary(
            entry_time="07:15",
            work_start="07:00",
            work_end="14:00",
            now_time="15:30",
        )

        self.assertEqual(summary["check_in_time"], "07:15")
        self.assertEqual(summary["check_out_time"], "--:--")
        self.assertEqual(summary["today_overtime_minutes"], 90)
        self.assertEqual(summary["today_work_minutes"], 405)
        self.assertGreater(summary["ring_blue_percent"], 0)
        self.assertLess(summary["ring_green_percent"], 100)

    def test_today_work_counts_from_entry_until_required_exit(self):
        summary = build_presence_summary(
            entry_time="09:00",
            work_start="08:00",
            work_end="15:00",
            now_time="10:00",
        )

        self.assertEqual(summary["check_in_time"], "09:00")
        self.assertEqual(summary["check_out_time"], "--:--")
        self.assertEqual(summary["today_work_minutes"], 60)
        self.assertEqual(summary["today_work_hours"], "01:00")
        self.assertEqual(summary["today_overtime_minutes"], 0)
        self.assertEqual(summary["ring_green_percent"], 14)

    def test_timeline_uses_scheduled_work_duration(self):
        summary = build_presence_summary(
            entry_time="09:00",
            work_start="08:00",
            work_end="15:00",
            now_time="12:00",
        )

        self.assertEqual(summary["today_work_minutes"], 180)
        self.assertEqual(summary["ring_green_percent"], 42)

    def test_after_required_exit_work_stops_and_overtime_counts(self):
        summary = build_presence_summary(
            entry_time="09:00",
            work_start="08:00",
            work_end="15:00",
            now_time="15:30",
        )

        self.assertEqual(summary["today_work_minutes"], 360)
        self.assertEqual(summary["today_work_hours"], "06:00")
        self.assertEqual(summary["today_overtime_minutes"], 30)
        self.assertEqual(summary["ring_green_percent"], 85)
        self.assertGreater(summary["ring_blue_percent"], 0)

    def test_overnight_shift_uses_next_day_end_time(self):
        summary = build_presence_summary(
            entry_time="09:12",
            work_start="15:00",
            work_end="08:00",
            now_time="19:30",
        )

        self.assertEqual(summary["check_in_time"], "09:12")
        self.assertEqual(summary["check_out_time"], "--:--")
        self.assertEqual(summary["today_work_minutes"], 618)
        self.assertGreater(summary["ring_green_percent"], 0)
        self.assertLess(summary["ring_green_percent"], 100)


if __name__ == "__main__":
    unittest.main()
