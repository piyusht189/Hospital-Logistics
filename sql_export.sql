-- Adminer 4.7.7 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `ambulance_drive_logs`;
CREATE TABLE `ambulance_drive_logs` (
  `adlid` int(11) NOT NULL AUTO_INCREMENT,
  `did` int(10) NOT NULL,
  `record_date` varchar(100) NOT NULL,
  `log` varchar(10000) DEFAULT NULL,
  PRIMARY KEY (`adlid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `ambulance_drive_logs` (`adlid`, `did`, `record_date`, `log`) VALUES
(16,  33, '20200919', '[{\"online\":\"20200919093912\",\"offline\":\"20200919093950\"},{\"online\":\"20200919145022\"}]'),
(30,  33, '20201117', '[{\"online\":\"20201117025037\",\"offline\":\"20201117032721\"},{\"online\":\"20201117032726\"}]'),
(42,  33, '20210117', '[{\"online\":\"20210117183344\",\"offline\":\"20210117185257\"},{\"online\":\"20210117185535\",\"offline\":\"20210117185543\"},{\"online\":\"20210117185547\"}]');

DROP TABLE IF EXISTS `app_ambulance_drivers`;
CREATE TABLE `app_ambulance_drivers` (
  `aadid` int(11) NOT NULL AUTO_INCREMENT,
  `hid` int(100) NOT NULL,
  `dname` varchar(100) NOT NULL,
  `demail` varchar(100) NOT NULL,
  `ddob` varchar(100) NOT NULL,
  `dpassword` varchar(1000) NOT NULL,
  `dphone` varchar(100) NOT NULL,
  `dlicence` varchar(100) DEFAULT NULL,
  `dlicence_exp` varchar(100) DEFAULT NULL,
  `djoining` varchar(100) NOT NULL,
  `current_status` varchar(100) NOT NULL DEFAULT 'offline',
  `user_status` varchar(100) NOT NULL DEFAULT 'true',
  `independent` varchar(100) NOT NULL DEFAULT 'no',
  PRIMARY KEY (`aadid`),
  UNIQUE KEY `demail` (`demail`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `app_ambulance_drivers` (`aadid`, `hid`, `dname`, `demail`, `ddob`, `dpassword`, `dphone`, `dlicence`, `dlicence_exp`, `djoining`, `current_status`, `user_status`, `independent`) VALUES
(33,  10, 'D1', 'd1@gmail.com', '2020-09-19', '6c646768a63584551306b0913424c8a6', '7878787878', 'FL454545554',  '2020-09-19', '2020-09-19', 'online', 'true', 'yes');

DROP TABLE IF EXISTS `auth_ambulance_driver`;
CREATE TABLE `auth_ambulance_driver` (
  `aadid` int(11) NOT NULL AUTO_INCREMENT,
  `did` int(10) NOT NULL,
  `token` varchar(100) NOT NULL,
  `created_at` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`aadid`),
  UNIQUE KEY `did` (`did`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `auth_ambulance_driver` (`aadid`, `did`, `token`, `created_at`) VALUES
(363, 33, '27a694d57f22b3c4f1c747be71ebe44d', NULL);

DROP TABLE IF EXISTS `auth_hospital`;
CREATE TABLE `auth_hospital` (
  `hdid` int(110) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `token` varchar(1000) NOT NULL,
  `created_at` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`hdid`),
  UNIQUE KEY `uid` (`uid`),
  CONSTRAINT `auth_hospital_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `auth_hospital` (`hdid`, `uid`, `token`, `created_at`) VALUES
(273, 24, '007e5d2e89a3dd1199f581ffd5a91e3d', NULL);

DROP TABLE IF EXISTS `completed_ambulance_tasks`;
CREATE TABLE `completed_ambulance_tasks` (
  `catid` int(11) NOT NULL AUTO_INCREMENT,
  `taid` int(10) NOT NULL,
  `aadid` int(10) NOT NULL,
  `work_log` varchar(60000) DEFAULT NULL,
  `status` varchar(100) DEFAULT 'rejected',
  `created_at` varchar(1000) NOT NULL,
  `started_at` varchar(100) DEFAULT NULL,
  `ended_at` varchar(1000) DEFAULT NULL,
  `total_distance` varchar(1000) DEFAULT NULL,
  `time_should` varchar(100) DEFAULT NULL,
  `time_did` varchar(100) DEFAULT NULL,
  `mins` varchar(1000) DEFAULT NULL,
  `vehicle` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`catid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `completed_ambulance_tasks` (`catid`, `taid`, `aadid`, `work_log`, `status`, `created_at`, `started_at`, `ended_at`, `total_distance`, `time_should`, `time_did`, `mins`, `vehicle`) VALUES
(83,  176,  33, '{\"0\":{\"message\":\"Pickup mukesh\",\"phone\":\"555555555\",\"lat\":26.9408632,\"lng\":75.8036333,\"reached\":true,\"oldlat\":\"13.034531578016558\",\"oldlng\":\"77.70244700834155\"},\"1\":{\"message\":\"Reached my home\",\"phone\":\"\",\"lat\":26.9407687,\"lng\":75.8036521,\"reached\":true,\"oldlat\":\"12.95691722259739\",\"oldlng\":\"77.66133008524776\"},\"2\":{\"message\":\"Drop\",\"phone\":\"\",\"lat\":26.9407821,\"lng\":75.8036481,\"reached\":true,\"oldlat\":\"12.959203479408906\",\"oldlng\":\"77.63555807992816\"}}',  'completed',  '2020-11-17 02:51:50',  '2020-11-17 02:51:02',  '2020-11-17 02:51:50',  '2,152 km', '1 day 12 hours', '48 secs',  '0',  '{\"dvid\":\"8\",\"hid\":\"10\",\"dvname\":\"Tata Ambulance Q\",\"dvnumber\":\"KA0192301newQ\",\"dvcolor\":\"RedQ\",\"dvreg_no\":\"2353e32432Q\",\"djoining_date\":\"2020-07-19\",\"dvtankcapacity\":\"201\"}');

DROP TABLE IF EXISTS `driver_vehicles`;
CREATE TABLE `driver_vehicles` (
  `dvid` int(11) NOT NULL AUTO_INCREMENT,
  `hid` int(10) NOT NULL,
  `dvname` varchar(1000) NOT NULL,
  `dvnumber` varchar(100) DEFAULT NULL,
  `dvcolor` varchar(100) DEFAULT NULL,
  `dvreg_no` varchar(100) DEFAULT NULL,
  `dvreg_date` varchar(100) DEFAULT NULL,
  `dvinsurance_no` varchar(100) DEFAULT NULL,
  `dvlast_serviced` varchar(100) DEFAULT NULL,
  `dvtankcapacity` varchar(100) DEFAULT NULL,
  `dvtax_renewals` varchar(10000) DEFAULT NULL,
  `demp_id` int(100) DEFAULT NULL,
  `hired` int(100) NOT NULL DEFAULT '0',
  `djoining_date` varchar(100) NOT NULL,
  PRIMARY KEY (`dvid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `driver_vehicles` (`dvid`, `hid`, `dvname`, `dvnumber`, `dvcolor`, `dvreg_no`, `dvreg_date`, `dvinsurance_no`, `dvlast_serviced`, `dvtankcapacity`, `dvtax_renewals`, `demp_id`, `hired`, `djoining_date`) VALUES
(8, 10, 'Tata Ambulance Q', 'KA0192301newQ',  'RedQ', '2353e32432Q',  '2018-01-01', 'RETBY33534343Q', '2020-01-01', '201',  '3452323Q', NULL, 0,  '2020-07-19'),
(20,  10, 'Mercedes Ambulance 1', 'KA123456', 'Blue', '2353e32432', '2018-03-05', 'RETBY33534343',  '2020-03-01', '20', '3452323',  NULL, 0,  '2020-08-01'),
(21,  10, 'Aston Martin', 'AS123456', 'Grey', 'PORSHE', '2020-08-02', 'PORSHE', '2020-08-02', '15', 'PORSHE', NULL, 0,  '2020-08-02');

DROP TABLE IF EXISTS `hospitals`;
CREATE TABLE `hospitals` (
  `hid` int(11) NOT NULL AUTO_INCREMENT,
  `hname` varchar(100) NOT NULL,
  `hlat` varchar(100) NOT NULL,
  `hlng` varchar(100) NOT NULL,
  `haddress` varchar(1000) NOT NULL,
  `hphone` varchar(100) NOT NULL,
  `hemail` varchar(100) NOT NULL,
  PRIMARY KEY (`hid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `hospitals` (`hid`, `hname`, `hlat`, `hlng`, `haddress`, `hphone`, `hemail`) VALUES
(10,  'Manipal Hospital', '26.212994',  '50.570914',  'Royal Bahrain Hospital, Manama, Bahrain',  '9999999999', 'manipal@gmail.com');

DROP TABLE IF EXISTS `hospital_notifications`;
CREATE TABLE `hospital_notifications` (
  `hnid` int(11) NOT NULL AUTO_INCREMENT,
  `hid` int(11) DEFAULT NULL,
  `title` varchar(20000) NOT NULL,
  `body` varchar(20000) NOT NULL,
  `sent_at` varchar(100) NOT NULL,
  PRIMARY KEY (`hnid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `hospital_notifications` (`hnid`, `hid`, `title`, `body`, `sent_at`) VALUES
(76,  10, 'Yayy, Driver: D1 completed below trip!', 'Pickup mukesh->Reached my home...',  '2020-11-17 02:51:50');

DROP TABLE IF EXISTS `tasks_ambulance`;
CREATE TABLE `tasks_ambulance` (
  `atid` int(11) NOT NULL AUTO_INCREMENT,
  `aadid` int(10) NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'pending',
  `work_log` varchar(63000) DEFAULT NULL,
  `current_work` varchar(100) DEFAULT '0',
  `next_work` varchar(100) DEFAULT '1',
  `assigned_time` varchar(100) NOT NULL,
  `type` varchar(100) DEFAULT NULL,
  `period` varchar(1000) DEFAULT NULL,
  `start_time` varchar(100) DEFAULT NULL,
  `started_at` varchar(100) DEFAULT NULL,
  `ended_at` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`atid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `tasks_ambulance` (`atid`, `aadid`, `status`, `work_log`, `current_work`, `next_work`, `assigned_time`, `type`, `period`, `start_time`, `started_at`, `ended_at`) VALUES
(260, 33, 'pending',  '{\"0\":{\"message\":\"Pikup\",\"lat\":\"27.27872416072849\",\"lng\":\"77.00181291216599\",\"phone\":\"123456789\"},\"1\":{\"message\":\"Do this here\",\"lat\":\"27.102824151260275\",\"lng\":\"76.21079728716599\",\"phone\":\"123456789\"},\"2\":{\"message\":\"Drop here\",\"lat\":\"26.671683515830587\",\"lng\":\"74.69468400591599\",\"phone\":\"123456789\"}}', '0',  '1',  '2020-12-12 16:56:40',  NULL, NULL, NULL, NULL, NULL);

DROP TABLE IF EXISTS `tracking`;
CREATE TABLE `tracking` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `did` int(11) NOT NULL,
  `row` varchar(10) NOT NULL DEFAULT 'new',
  `latitude` varchar(1000) NOT NULL,
  `longitude` varchar(1000) NOT NULL,
  `added_at` varchar(1000) NOT NULL,
  PRIMARY KEY (`tid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `tracking` (`tid`, `did`, `row`, `latitude`, `longitude`, `added_at`) VALUES
(29,  33, 'new',  '47.6897367', '9.2913533',  '2021-01-17 18:58:55'),
(30,  33, 'old',  '47.6897367', '9.2913533',  '2021-01-17 18:58:47');

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `hid` int(10) NOT NULL,
  `uname` varchar(100) NOT NULL,
  `uphone` varchar(100) NOT NULL,
  `uemail` varchar(100) NOT NULL,
  `upassword` varchar(100) NOT NULL,
  `u_status` int(2) NOT NULL DEFAULT '0',
  `u_role` varchar(100) NOT NULL DEFAULT 'user',
  `noti_token` varchar(60000) DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `uemail` (`uemail`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user` (`uid`, `hid`, `uname`, `uphone`, `uemail`, `upassword`, `u_status`, `u_role`, `noti_token`) VALUES
(5, 0,  'Super Admin',  '+917978944758',  'admin@drivecraft.com', '6c646768a63584551306b0913424c8a6', 1,  'superadmin', NULL),
(24,  10, 'Manipal Admin',  '7978944758', 'manipaladmin@gmail.com', '6c646768a63584551306b0913424c8a6', 1,  'admin',  'dybaAyrtsuALWXGnTpbzAs:APA91bEmuq8al-h0duZQLMClsEKxan22WRGGf6QP8CziA_3w7ETbR-VvBT1HhLnCQUpTdAcyGKZBkeiOyIE1_3stqGnpnxLJapl5kmqJqIZ5aWslDvEWOt4gUDZHiYb8sI8O-HqrKeVB');

-- 2021-01-17 19:00:16