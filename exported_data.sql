CREATE TABLE IF NOT EXISTS `mrkhc_table` (
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `days` TEXT NULL,
  `substitute` VARCHAR(255) NULL,
  `username` TEXT NULL,
  `status` VARCHAR(255) NULL,
  `id` INT
);

INSERT INTO `mrkhc_table` (`start_date`, `end_date`, `days`, `substitute`, `username`, `status`, `id`) VALUES
(2025-01-01, 2025-01-03, '2         ', 'مريم براتي', 'it        ', 'تایید شده', 42),
(2026-03-06, 2026-03-07, '۱         ', 'بدون جانشين', 'it        ', 'انتظار تایید', 43);

CREATE TABLE IF NOT EXISTS `avalpss_table` (
  `officialtime` TEXT NULL,
  `entrytime` TEXT NULL,
  `date` DATE NULL,
  `username` TEXT NULL,
  `total_time_aval` TEXT NULL,
  `id` INT
);

INSERT INTO `avalpss_table` (`officialtime`, `entrytime`, `date`, `username`, `total_time_aval`, `id`) VALUES
(09:00:00, 09:24:00, 2025-02-22, 'paknafs   ', 00:24:00, 20),
(13:00:00, 13:18:00, 2025-02-27, 'حبیبی     ', 00:18:00, 21),
(12:00:00, 12:14:00, 2025-03-21, 'it        ', 00:14:00, 22);

CREATE TABLE IF NOT EXISTS `akhrpss_table` (
  `officialTime` TEXT NULL,
  `exitTime` TEXT NULL,
  `date` DATE NULL,
  `username` TEXT NULL,
  `total_time_akhr` TEXT NULL,
  `id` INT
);

CREATE TABLE IF NOT EXISTS `beynpss_table` (
  `exitTime` TEXT NULL,
  `entryTime` TEXT NULL,
  `date` DATE NULL,
  `username` TEXT NULL,
  `total_time_beyn` TEXT NULL,
  `id` INT
);

CREATE TABLE IF NOT EXISTS `totalpass_table` (
  `username` TEXT NULL,
  `request_date` DATE NULL,
  `pass_title` VARCHAR(255) NULL,
  `pass_duration` TEXT NULL,
  `status` VARCHAR(255) NULL,
  `id` INT
);

INSERT INTO `totalpass_table` (`username`, `request_date`, `pass_title`, `pass_duration`, `status`, `id`) VALUES
('paknafs   ', 2025-02-22, 'avalpss', 00:24:00, 'تاييد شده', 40),
('حبیبی     ', 2025-02-27, 'avalpss', 00:18:00, 'تاييد شده', 41),
('it        ', 2025-03-02, 'avalpss', 00:12:00, 'تاييد شده', 42),
('it        ', 2024-10-03, 'avalpss', 00:19:00, 'تاييد شده', 43),
('it        ', 2025-03-21, 'avalpss', 00:14:00, 'انتظار تاييد', 44);

CREATE TABLE IF NOT EXISTS `sysdiagrams` (
  `name` VARCHAR(255),
  `principal_id` INT,
  `diagram_id` INT,
  `version` INT NULL,
  `definition` TEXT NULL
);

CREATE TABLE IF NOT EXISTS `ezafe_table` (
  `overtime_date` DATE NULL,
  `from_time` TEXT NULL,
  `to_time` TEXT NULL,
  `description` VARCHAR(255) NULL,
  `status` VARCHAR(255) NULL,
  `username` VARCHAR(255) NULL,
  `daily_overtime` TEXT NULL,
  `id` INT
);

INSERT INTO `ezafe_table` (`overtime_date`, `from_time`, `to_time`, `description`, `status`, `username`, `daily_overtime`, `id`) VALUES
(2025-02-23, 09:20:00, 14:00:00, 'جانشيني خانوم پاک نفس', 'تایید شده', 'حلاجی     ', 04:40:00, 23),
(2025-02-22, 13:30:00, 14:03:00, 'جلسه مارکتينگ', 'تایید شده', 'سقایی', 00:33:00, 27),
(2025-01-09, 16:00:00, 19:30:00, 'لولو', 'تایید شده', 'it', 03:30:00, 29),
(2025-01-01, 20:00:00, 22:00:00, 'تست دوم', 'تایید شده', 'it', 02:00:00, 33),
(2025-01-05, 13:00:00, 20:00:00, 'تست سوم', 'تایید شده', 'it', 07:00:00, 34),
(2024-12-28, 14:00:00, 14:16:00, 'تست چهارم', 'تایید شده', 'it', 00:16:00, 35),
(2025-04-25, 16:21:00, 17:52:00, 'براي تست هستش', 'انتظار تایید', 'it', 01:31:00, 36);

CREATE TABLE IF NOT EXISTS `ezafe_total_table` (
  `username` TEXT NULL,
  `total_ezafe_time` TEXT NULL
);

INSERT INTO `ezafe_total_table` (`username`, `total_ezafe_time`) VALUES
('حلاجی     ', 04:40:00),
('it        ', 12:46:00),
('سقایی     ', 00:33:00);

CREATE TABLE IF NOT EXISTS `leave_report` (
  `username` TEXT NULL,
  `total_days` INT NULL,
  `remaining_days` INT NULL
);

INSERT INTO `leave_report` (`username`, `total_days`, `remaining_days`) VALUES
('it        ', 2, 28);

CREATE TABLE IF NOT EXISTS `user_table` (
  `username` TEXT NULL,
  `password` TEXT NULL,
  `name` VARCHAR(255) NULL,
  `last_name` VARCHAR(255) NULL,
  `department` VARCHAR(255) NULL,
  `work_hours` VARCHAR(255) NULL,
  `substitute` VARCHAR(255) NULL,
  `role` TEXT NULL,
  `hozoor_num` TEXT NULL,
  `shanbeh` VARCHAR(255) NULL,
  `yekshanbeh` VARCHAR(255) NULL,
  `doshanbeh` VARCHAR(255) NULL,
  `seshanbeh` VARCHAR(255) NULL,
  `chrshanbeh` VARCHAR(255) NULL,
  `panjshanbeh` VARCHAR(255) NULL,
  `id` INT
);

INSERT INTO `user_table` (`username`, `password`, `name`, `last_name`, `department`, `work_hours`, `substitute`, `role`, `hozoor_num`, `shanbeh`, `yekshanbeh`, `doshanbeh`, `seshanbeh`, `chrshanbeh`, `panjshanbeh`, `id`) VALUES
('admin     ', 'admin     ', 'مدیر', 'مدیری', 'مدیریت', '00:00 - 00:00', 'بدون جانشین', 'admin     ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1),
('IT        ', '123       ', 'علی', 'شاکری', 'فناوری', '16:00 - 09:00', 'بدون جانشین', 'user      ', '00055858  ', '16:00 - 09:00', '16:00 - 09:00', '16:00 - 09:00', '16:00 - 09:00', '16:00 - 09:00', '14:00 - 07:00', 2),
('سالاری    ', '123       ', 'فاطمه', 'سالاری فر', 'پذیرش', '20:00 - 13:00', 'عالیه سقایی', 'user      ', '00028479  ', NULL, NULL, NULL, NULL, NULL, NULL, 207),
('حبیبی     ', '1377      ', 'کیمیا', 'حبیبی', 'مولکولی', '18:00 - 13:00', 'محمدمهدی صمدیان', 'user      ', '00013778  ', NULL, NULL, NULL, NULL, NULL, NULL, 299),
('paknafs   ', '123       ', 'فاطمه', 'پاک نفس', 'بیوشیمی', '16:00 - 09:00', 'صبا حلاجی', 'user      ', '00054321  ', NULL, NULL, NULL, NULL, NULL, NULL, 312),
('م.براتی   ', '123       ', 'مریم', 'براتی', 'ایمونولوژی', '15:00 - 08:00', 'سید مرتصی موسوی پور', 'user      ', '00096142  ', NULL, NULL, NULL, NULL, NULL, NULL, 438),
('ن.براتی   ', '123       ', 'نگین', 'براتی', 'پذیرش', '14:30 - 07:30', 'عالیه سقایی', 'user      ', '00003737  ', NULL, NULL, NULL, NULL, NULL, NULL, 578),
('حلاجی     ', '137915    ', 'صبا', 'حلاجی', 'هورمون', '20:00 - 14:00', 'فاطمه پاک نفس', 'user      ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 653),
('جعفری     ', '123       ', 'فرشته', 'جعفری', 'حسابداری', '15:00 - 08:00', 'بدون جانشین', 'user      ', '00000888  ', '15:00 - 08:00', '15:00 - 08:00', '15:00 - 08:00', '15:00 - 08:00', '15:00 - 08:00', '15:00 - 08:00', 888),
('جعفری مدیر', '456       ', 'فرشته', 'جعفری', 'حسابداری', '15:00 - 08:00', 'بدون جانشین', 'admin     ', '00000000  ', '15:00 - 08:00', '15:00 - 08:00', '15:00 - 08:00', '15:00 - 08:00', '15:00 - 08:00', '15:00 - 08:00', 889),
('گنجمه     ', '123       ', 'محدثه', 'گنجمه', 'پذیرش', '14:00 - 07:00', 'زهره محمودی', 'user      ', '00007575  ', NULL, NULL, NULL, NULL, NULL, NULL, 901),
('mousavi   ', '1375      ', 'مرتضی', 'موسوی پور', 'هماتولوژی', '20:30 - 13:30', 'مریم براتی', 'user      ', '123456789 ', '13:30 - 20:30', '13:30 - 20:30', '13:30 - 20:30', '13:30 - 20:30', '13:30 - 20:30', '13:30 - 20:00', 945),
('سقایی     ', '123       ', 'عالیه', 'سقایی', 'نمونه گیری', '13:30 - 06:30', 'بدون جانشین', 'user      ', '00002601  ', NULL, NULL, NULL, NULL, NULL, NULL, 959);

CREATE TABLE IF NOT EXISTS `ticket_table` (
  `ticketTitle` VARCHAR(255) NULL,
  `ticketDescription` VARCHAR(255) NULL,
  `username` TEXT NULL,
  `ticket_date` DATETIME NULL,
  `ticket_status` VARCHAR(255) NULL,
  `target_username` TEXT NULL,
  `Parent_id` INT NULL,
  `id` INT,
  `is_read` VARCHAR(255) NULL
);

INSERT INTO `ticket_table` (`ticketTitle`, `ticketDescription`, `username`, `ticket_date`, `ticket_status`, `target_username`, `Parent_id`, `id`, `is_read`) VALUES
('عنوان تست', 'متن تست', 'it        ', 2025-03-25 11:35:00, 'تاييد شده', 'جعفری     ', 1, 104, '1'),
('عنوان دوم', 'متن دوم', 'جعفری     ', 2025-04-01 10:00:00, 'تاييد شده', 'it        ', 1, 105, '1');

