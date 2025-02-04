LOCK TABLES `flaggroup` WRITE;
/*!40000 ALTER TABLE `flaggroup` DISABLE KEYS */;
INSERT INTO `flaggroup` VALUES (8, 'Firebase Credential', 'Firebase Credential',NULL,6,1,0,'2023-05-03 12:57:53','2023-05-03 12:57:53',1,1);
/*!40000 ALTER TABLE `flaggroup` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `systemflags` WRITE;
/*!40000 ALTER TABLE `systemflags` DISABLE KEYS */;
INSERT INTO `systemflags` VALUES (19,8,8,'firebaseServerKey','Server Key','FireBase Server Key','FireBase Server Key',NULL,NULL,NULL,1,1,0,'2023-05-03 14:02:22','2023-05-03 14:02:22',1,1);
UNLOCK TABLES;