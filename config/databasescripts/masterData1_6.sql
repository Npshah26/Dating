LOCK TABLES `educationmedium` WRITE;
/*!40000 ALTER TABLE `educationmedium` DISABLE KEYS */;
INSERT INTO `educationmedium` VALUES (1,'English',1,0,'2024-08-14 16:49:37','2024-08-14 16:49:37',1,1),(2,'Gujarati',1,0,'2024-08-14 16:50:15','2024-08-14 16:50:15',1,1),(3,'Hindi',1,0,'2024-08-14 16:50:27','2024-08-14 16:50:27',1,1);
/*!40000 ALTER TABLE `educationmedium` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `educationtype` WRITE;
/*!40000 ALTER TABLE `educationtype` DISABLE KEYS */;
-- INSERT INTO `educationtype` VALUES (1,'Bachelor',1,0,'2024-08-14 16:56:18','2024-08-14 16:56:18',1,1),(2,'Master',1,0,'2024-08-14 16:56:26','2024-08-14 16:56:26',1,1);
INSERT INTO `educationtype` (`id`, `name`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES
(1, 'Bachelor', 1, 0, '2024-08-14 17:01:31', '2024-08-14 17:01:31', 1, 1),
(2, 'Master', 1, 0, '2024-08-14 17:01:39', '2024-08-14 17:01:39', 1, 1),
(3, 'Diplomas and Certifications', 1, 0, '2024-08-16 09:12:57', '2024-08-16 09:12:57', 1, 1),
(4, 'Doctor', 1, 0, '2024-08-16 09:13:09', '2024-08-16 09:13:09', 1, 1);
/*!40000 ALTER TABLE `educationtype` ENABLE KEYS */;
UNLOCK TABLES;

