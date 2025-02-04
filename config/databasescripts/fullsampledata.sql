
LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` (`id`, `imageUrl`, `isActive`, `isDelete`, `createdDate`, `updatedDate`, `createdBy`, `modifiedBy`) VALUES (1,'content/user/2/1.jpeg',1,0,'2024-03-21 11:08:07','2024-03-21 11:08:07',2,2);
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `referalUserId`, `firstName`, `middleName`, `lastName`, `contactNo`, `email`, `gender`, `password`, `imageId`, `isPasswordSet`, `isDisable`, `isVerified`, `isTwoFactorEnable`, `otpAuthUrl`, `baseSecret`, `isReceiveMail`, `isReceiveNotification`, `isVerifyProfilePic`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`) VALUES (3,NULL,'Rahul','Maheshbhai','Patel','+918888888888','rahul@gmail.com','Male',NULL,1,NULL,0,NULL,NULL,NULL,NULL,0,0,NULL,1,0,'2024-03-21 11:07:14','2024-03-21 11:07:14'),(4,NULL,'Anjali','Sureshbhai','Shah','+919494949494','anjali@gmail.com','Female','$2a$10$sYdda4lC6Wo9Nk0evYy..eE4JeYBp0lGGKF4GWVvBlyZfe5UVQo5G',NULL,NULL,0,NULL,NULL,NULL,NULL,0,0,NULL,1,0,'2024-03-21 11:55:52','2024-03-21 11:55:52');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` (`id`, `addressLine1`, `addressLine2`, `pincode`, `cityId`, `districtId`, `stateId`, `countryId`, `countryName`, `stateName`, `cityName`, `latitude`, `longitude`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,'Baben, Baben','Baben, Baben','394601',5948,17,1,1,'India','GUJARAT','Bardoli H.O',21.1445562,73.0941712,1,0,'2024-03-21 11:47:31','2024-03-21 11:47:31',3,3),(2,'Baben, Baben','Baben, Baben','394601',6239,17,1,1,'India','GUJARAT','Sugar Factory Bardoli',21.1445477,73.0941709,1,0,'2024-03-21 11:58:17','2024-03-21 11:58:17',3,3);
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` (`id`, `name`, `code`, `type`, `value`, `maxUsage`, `userUsage`, `validFrom`, `validTo`, `maxDiscountAmount`, `description`, `termsCondition`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,'10% Discount','DIS10PER','Percentage',10,50,1,'2024-03-21 13:51:21','2024-04-21 13:51:25',5000,'null','null',1,0,'2024-03-21 13:51:51','2024-03-21 13:51:51',1,1);
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `customfields` WRITE;
/*!40000 ALTER TABLE `customfields` DISABLE KEYS */;
INSERT INTO `customfields` (`id`, `name`, `displayName`, `mappedFieldName`, `description`, `valueTypeId`, `isRequired`, `textLength`, `allowInSearch`, `allowInFilter`, `allowIncompleteProfile`, `allowInPreferences`, `defaultValue`, `valueList`, `completeprofilesectioname`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,'Nadi','Nadi','nadi',NULL,1,0,200,0,1,1,0,'null','','Personal Details',1,0,'2024-03-21 12:11:43','2024-03-21 12:11:43',1,1),(2,'Hobbies','Hobbies','hobbies',NULL,10,0,null,0,1,1,0,'Reading','Reading;Playing;WatchMovie','Personal Details',1,0,'2024-03-21 12:12:25','2024-03-21 12:16:19',1,1);
/*!40000 ALTER TABLE `customfields` ENABLE KEYS */;
UNLOCK TABLES;

ALTER TABLE `userpersonaldetailcustomdata` 
ADD COLUMN `nadi` VARCHAR(200) NULL AFTER `modifiedBy`,
ADD COLUMN `hobbies` VARCHAR(100) NULL AFTER `nadi`;



LOCK TABLES `package` WRITE;
/*!40000 ALTER TABLE `package` DISABLE KEYS */;
INSERT INTO `package` (`id`, `name`, `baseAmount`, `weightage`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`)  VALUES (1,'Gold',500,2,1,0,'2024-03-21 12:39:44','2024-03-21 12:41:23',1,1),(2,'Trial',0,1,1,0,'2024-08-14 16:19:30','2024-08-14 16:19:30',1,1);
/*!40000 ALTER TABLE `package` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `packagecoupons`
--

LOCK TABLES `packagecoupons` WRITE;
/*!40000 ALTER TABLE `packagecoupons` DISABLE KEYS */;
INSERT INTO `packagecoupons` (`id`, `packageId`, `couponId`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,1,1,1,0,'2024-03-21 13:51:51','2024-03-21 13:51:51',1,1);
/*!40000 ALTER TABLE `packagecoupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `packageduration`
--

LOCK TABLES `packageduration` WRITE;
/*!40000 ALTER TABLE `packageduration` DISABLE KEYS */;
INSERT INTO `packageduration` (`id`, `packageId`, `timeDurationId`, `discount`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,1,3,'10',1,0,'2024-03-21 12:39:44','2024-03-21 12:41:23',1,1),(2,2,2,'0',1,0,'2024-08-14 16:19:30','2024-08-14 16:19:30',1,1);
/*!40000 ALTER TABLE `packageduration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `packagefacility`
--

LOCK TABLES `packagefacility` WRITE;
/*!40000 ALTER TABLE `packagefacility` DISABLE KEYS */;
INSERT INTO `packagefacility` (`id`, `packageId`, `premiumFacilityId`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,1,3,1,0,'2024-03-21 12:41:23','2024-03-21 12:41:23',1,1),(2,1,4,1,0,'2024-03-21 12:41:23','2024-03-21 12:41:23',1,1),(3,1,6,1,0,'2024-03-21 12:41:23','2024-03-21 12:41:23',1,1),(4,1,1,1,0,'2024-03-21 12:41:23','2024-03-21 12:41:23',1,1),(5,1,5,1,0,'2024-03-21 12:41:23','2024-03-21 12:41:23',1,1);
/*!40000 ALTER TABLE `packagefacility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` (`id`, `paymentMode`, `paymentRefrence`, `amount`, `userId`, `paymentStatus`, `signature`, `orderId`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,'Razorpay','pay_NouAQIVAhIlZ5X',10000,3,'Success','eb1a7c305e5d8fffc7982988b2797a96607aefc2bbedc702d176c1c2b029fe8e','order_NouABMAxBAsvzy','2024-03-21 11:53:22','2024-03-21 11:53:22',2,2),(2,'Razorpay','1',10000,3,'Success','eb1a7c305e5d8fffc7982988b2797a96607aefc2bbedc702d176c1c2b029fe8e','order_NouABMAxBAsvzy','2024-03-21 11:53:22','2024-03-21 11:53:22',2,2),(3,'Razorpay','pay_NouMi1bJseRMxV',25000,3,'Success','5a47082589a468e9a9aaf1350f0d2f0f0c67f79e4bce7673e74ddd2d88dc14c4','order_NouMZ3RQVI3Mug','2024-03-21 12:04:59','2024-03-21 12:04:59',3,3),(4,'Razorpay','3',25000,3,'Success','5a47082589a468e9a9aaf1350f0d2f0f0c67f79e4bce7673e74ddd2d88dc14c4','order_NouMZ3RQVI3Mug','2024-03-21 12:05:00','2024-03-21 12:05:00',3,3),(5,'Razorpay','pay_Nov03F4vupjoGP',1350,3,'Success','f25e4aae58fa57a497def0f0b7409a198353e956c7672be7c3784a1bb1611fdc','order_NouztaK8xqdseR','2024-03-21 12:42:14','2024-03-21 12:42:14',3,3),(6,'Wallet','WalletPayment',1350,3,'Success',NULL,NULL,'2024-03-21 12:44:47','2024-03-21 12:44:47',3,3);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `userchat` WRITE;
/*!40000 ALTER TABLE `userchat` DISABLE KEYS */;
INSERT INTO `userchat` (`id`, `userId`, `partnerId`, `chatId`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,3,2,'3_2',1,0,'2024-03-21 12:43:17','2024-03-21 12:43:17',3,3);
/*!40000 ALTER TABLE `userchat` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `userdevicedetail` WRITE;
/*!40000 ALTER TABLE `userdevicedetail` DISABLE KEYS */;
INSERT INTO `userdevicedetail` (`id`, `userId`, `applicationId`, `deviceId`, `fcmToken`, `deviceLocation`, `deviceManufacturer`, `deviceModel`, `apiCallTime`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,3,2,'SP1A.210812.016','c1KGt7zORSKDXGKjSCfyAl:APA91bHl2TEyZJjhkmvSE46hdwoz0nrpGgoZad961HnJtMRNRvtRe4yGXXBGiACMEiNpUHxUXaN7V7zCAwGTChcwkUJSMQF8QH2FVHxIRhEd3wlCV5G7ZEMRhkESmOMEY0mc-JTb6WKm','undefined','INFINIX','Infinix X666','2024-03-21T08:35:54.721Z',1,0,'2024-03-21 11:07:14','2024-03-21 11:07:14',NULL,NULL),(2,4,3,NULL,'eyPqiZegvZxqDRgCcXRCo7:APA91bE8o2Cu0DkralAiiPh6W5cCfdJZOUHkwrjAnmXbCdx_xHSiXVwQFkYtmVWrQHIDtEFQf8A9ypLgjank6172rkvao-7PypcmsP1dRWOJMpCi3UwXxUiRLqFfpi8yn8th0Xt6VqGv',NULL,NULL,NULL,NULL,1,0,'2024-03-21 11:10:09','2024-03-21 11:10:09',1,1),(3,4,2,'SP1A.210812.016','c1KGt7zORSKDXGKjSCfyAl:APA91bHl2TEyZJjhkmvSE46hdwoz0nrpGgoZad961HnJtMRNRvtRe4yGXXBGiACMEiNpUHxUXaN7V7zCAwGTChcwkUJSMQF8QH2FVHxIRhEd3wlCV5G7ZEMRhkESmOMEY0mc-JTb6WKm','undefined','INFINIX','Infinix X666','2024-03-21T08:39:34.811Z',1,0,'2024-03-21 11:55:52','2024-03-21 11:55:52',NULL,NULL);
/*!40000 ALTER TABLE `userdevicedetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userdocument`
--

LOCK TABLES `userdocument` WRITE;
/*!40000 ALTER TABLE `userdocument` DISABLE KEYS */;
INSERT INTO `userdocument` (`id`, `userId`, `documentTypeId`, `documentUrl`, `isVerified`, `isRequired`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,3,1,'content/userDocument/2/1.jpeg',0,1,1,0,'2024-03-21 11:47:30','2024-03-21 11:47:30',3,3),(2,3,2,'content/userDocument/2/2.jpeg',0,0,1,0,'2024-03-21 11:47:30','2024-03-21 11:47:30',3,3),(3,4,1,'content/userDocument/385/309.jpeg',0,1,1,0,'2024-03-21 11:58:17','2024-03-21 11:58:17',4,4),(4,4,2,'content/userDocument/385/310.jpeg',0,0,1,0,'2024-03-21 11:58:17','2024-03-21 11:58:17',4,4);
/*!40000 ALTER TABLE `userdocument` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userfavourites`
--

LOCK TABLES `userfavourites` WRITE;
/*!40000 ALTER TABLE `userfavourites` DISABLE KEYS */;
INSERT INTO `userfavourites` (`id`, `userId`, `favUserId`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,3,4,1,0,'2024-03-21 12:31:42','2024-03-21 12:31:42',2,2),(2,4,3,1,0,'2024-03-21 14:08:54','2024-03-21 14:08:54',3,3);
/*!40000 ALTER TABLE `userfavourites` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `usernotifications` WRITE;
/*!40000 ALTER TABLE `usernotifications` DISABLE KEYS */;
INSERT INTO `usernotifications` (`id`, `userId`, `title`, `message`, `imageUrl`, `bodyJson`, `isRead`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,1,'New User Register','New User Rahul Patel registered in system. Please verify document',NULL,NULL,NULL,1,0,'2024-03-21 11:47:35','2024-03-21 11:47:35',2,2),(2,1,'New User Register','New User Anjali Shah registered in system. Please verify document',NULL,NULL,NULL,1,0,'2024-03-21 11:58:21','2024-03-21 11:58:21',3,3),(3,2,'Anjali Shah send a proposal to you.','Anjali Shah send a proposal to you.',NULL,'{\"id\": 3, \"json\": null, \"type\": 2, \"title\": \"Anjali Shah send a proposal to you.\", \"message\": \"Anjali Shah send a proposal to you.\", \"dateTime\": null}',NULL,1,0,'2024-03-21 12:03:58','2024-03-21 12:03:58',3,3),(4,3,'Rahul Patel accept your proposal.','Rahul Patel accept your proposal.',NULL,'{\"id\": 2, \"json\": null, \"type\": 3, \"dateTime\": null}',NULL,1,0,'2024-03-21 12:45:08','2024-03-21 12:45:08',2,2);
/*!40000 ALTER TABLE `usernotifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userpackage`
--

LOCK TABLES `userpackage` WRITE;
/*!40000 ALTER TABLE `userpackage` DISABLE KEYS */;
INSERT INTO `userpackage` (`id`, `packageId`, `packageDurationId`, `startDate`, `endDate`, `netAmount`, `purchaseDate`, `userId`, `paymentId`, `couponId`, `signature`, `originalJson`, `purchaseToken`, `isActive`, `isDelete`, `createdDate`, `modifiedData`, `createdBy`, `modifiedBy`) VALUES (1,1,1,'2024-03-21 00:00:00','2025-03-21 23:59:59',1350,'2024-03-21 12:41:48',3,'1',NULL,NULL,NULL,NULL,1,0,'2024-03-21 12:42:14','2024-03-21 12:42:14',3,3),(2,1,1,'2024-03-21 00:00:00','2025-03-21 23:59:59',1350,'2024-03-21 12:41:48',4,'2',NULL,NULL,NULL,NULL,1,0,'2024-03-21 12:44:47','2024-03-21 12:44:47',4,4);
/*!40000 ALTER TABLE `userpackage` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `userpersonaldetail` WRITE;
/*!40000 ALTER TABLE `userpersonaldetail` DISABLE KEYS */;
INSERT INTO `userpersonaldetail` (`id`, `userId`, `addressId`, `religionId`, `communityId`, `maritalStatusId`, `occupationId`, `educationId`, `subCommunityId`, `dietId`, `annualIncomeId`, `heightId`, `birthDate`, `languages`, `eyeColor`, `businessName`, `companyName`, `employmentTypeId`, `weight`, `profileForId`, `expectation`, `aboutMe`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,3,1,1,3,3,6,7,NULL,1,6,4,'1996-03-30 00:00:00','English, Hindi, Gujarati','Blue',NULL,'Native Software ',1,67,1,'Hello','Hello everyone only...',1,0,'2024-03-21 11:47:31','2024-03-21 11:47:31',3,3),(2,4,2,1,3,3,8,8,NULL,1,6,4,'1996-03-31 00:00:00','English, Hindi, Gujarati','Brown','It Park',NULL,2,57,1,'Nothing for others.','Enjoy the life...',1,0,'2024-03-21 11:58:17','2024-03-21 11:58:17',4,4);
/*!40000 ALTER TABLE `userpersonaldetail` ENABLE KEYS */;
UNLOCK TABLES;


LOCK TABLES `userproposals` WRITE;
/*!40000 ALTER TABLE `userproposals` DISABLE KEYS */;
INSERT INTO `userproposals` (`id`, `userId`, `proposalUserId`, `status`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`, `hascancelled`) VALUES (1,4,2,1,1,0,'2024-03-21 12:03:58','2024-03-21 12:45:08',4,3,0);
/*!40000 ALTER TABLE `userproposals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userrefreshtoken`
--

LOCK TABLES `userrefreshtoken` WRITE;
/*!40000 ALTER TABLE `userrefreshtoken` DISABLE KEYS */;
INSERT INTO `userrefreshtoken` (`id`, `userId`, `refreshToken`, `expireAt`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,3,'b2d2cb15-6086-44b4-aa86-874b6e489d3e','2024-03-22 11:07:16',1,0,'2024-03-21 11:07:14','2024-03-21 11:07:14',NULL,NULL),(2,1,'80a9afbb-405c-43f5-bf31-01a3da156ecb','2024-03-22 11:10:06',1,0,'2024-03-21 11:10:04','2024-03-21 11:10:04',NULL,NULL),(3,2,'dd8fa9bb-c96b-4322-91bd-f39832535366','2024-03-22 11:30:42',1,0,'2024-03-21 11:30:40','2024-03-21 11:30:40',NULL,NULL),(5370,1,'42cad422-d3a3-4d0e-be6e-6febb88f01f6','2024-03-22 11:32:18',1,0,'2024-03-21 11:32:17','2024-03-21 11:32:17',NULL,NULL),(4,1,'609228a9-d35d-4058-909e-624859a77d30','2024-03-22 11:38:51',1,0,'2024-03-21 11:38:50','2024-03-21 11:38:50',NULL,NULL),(5,2,'bda51a5a-1465-4e38-ad57-d078122f88bd','2024-03-22 11:43:30',1,0,'2024-03-21 11:43:28','2024-03-21 11:43:28',NULL,NULL),(6,1,'947fa8f9-7d99-4088-894b-cfa01cdc640d','2024-03-22 11:48:09',1,0,'2024-03-21 11:48:07','2024-03-21 11:48:07',NULL,NULL),(7,1,'5e6942b4-1775-4407-a688-8105eb957162','2024-03-22 11:48:49',1,0,'2024-03-21 11:48:48','2024-03-21 11:48:48',NULL,NULL),(8,3,'28556670-f069-4fb7-869d-ef0c4ee6c8fc','2024-03-22 11:55:54',1,0,'2024-03-21 11:55:52','2024-03-21 11:55:52',NULL,NULL),(9,3,'a4d5088a-5076-4e22-8dc8-1b53dab16801','2024-03-22 11:59:07',1,0,'2024-03-21 11:59:06','2024-03-21 11:59:06',NULL,NULL),(10,3,'836081fc-740a-4d07-98d0-981c7847917d','2024-03-22 12:01:32',1,0,'2024-03-21 12:01:30','2024-03-21 12:01:30',NULL,NULL),(11,3,'e6c3232f-c51c-4b05-bae0-d8e1eae61e20','2024-03-22 12:06:49',1,0,'2024-03-21 12:06:48','2024-03-21 12:06:48',NULL,NULL),(12,1,'b13d40f8-fe37-467c-8e9c-bc1a9b3d89b1','2024-03-22 12:08:32',1,0,'2024-03-21 12:08:30','2024-03-21 12:08:30',NULL,NULL),(13,1,'26d5699b-8787-4ad5-a160-06700390bc38','2024-03-22 12:08:52',1,0,'2024-03-21 12:08:51','2024-03-21 12:08:51',NULL,NULL),(14,1,'f731e3b7-1f72-4d87-94a8-17c8aaccd99b','2024-03-22 12:10:09',1,0,'2024-03-21 12:10:08','2024-03-21 12:10:08',NULL,NULL),(15,1,'d2236b03-23e7-4454-8ffa-493cfb3a6982','2024-03-22 12:18:24',1,0,'2024-03-21 12:18:22','2024-03-21 12:18:22',NULL,NULL),(16,2,'910759f0-3c0a-4de4-962b-9ac7f983f49d','2024-03-22 12:18:48',1,0,'2024-03-21 12:18:46','2024-03-21 12:18:46',NULL,NULL),(17,2,'3c8b927b-bfae-45db-af80-ec08926e7a38','2024-03-22 12:19:18',1,0,'2024-03-21 12:19:16','2024-03-21 12:19:16',NULL,NULL),(18,2,'b54f8934-55af-4d8e-a87a-c6fbc1b2efb4','2024-03-22 12:20:09',1,0,'2024-03-21 12:20:08','2024-03-21 12:20:08',NULL,NULL),(19,2,'d689752c-a8bb-4f28-851d-3854928c1856','2024-03-22 12:21:21',1,0,'2024-03-21 12:21:19','2024-03-21 12:21:19',NULL,NULL),(20,2,'24b8961e-975e-4751-9b80-0cf9bbccf1ee','2024-03-22 12:22:01',1,0,'2024-03-21 12:22:00','2024-03-21 12:22:00',NULL,NULL),(21,2,'6c2bc50e-74b1-46fc-bba9-8e835f15a8fa','2024-03-22 12:26:51',1,0,'2024-03-21 12:26:50','2024-03-21 12:26:50',NULL,NULL),(22,2,'58aa2c55-66f0-4670-86d5-070358c6a06e','2024-03-22 12:28:26',1,0,'2024-03-21 12:28:25','2024-03-21 12:28:25',NULL,NULL),(23,1,'f33177b2-baa7-454c-b453-77d405797912','2024-03-22 12:29:48',1,0,'2024-03-21 12:29:48','2024-03-21 12:29:48',NULL,NULL),(24,2,'cf13c641-b771-463d-8b35-03ac60b297ef','2024-03-22 12:30:56',1,0,'2024-03-21 12:30:54','2024-03-21 12:30:54',NULL,NULL),(25,1,'9c83c702-6613-4db2-b642-50ab92c713d8','2024-03-22 12:31:14',1,0,'2024-03-21 12:31:14','2024-03-21 12:31:14',NULL,NULL),(26,3,'83ffd47b-1ccd-4bc5-91df-06d52886eb15','2024-03-22 12:32:23',1,0,'2024-03-21 12:32:22','2024-03-21 12:32:22',NULL,NULL),(27,1,'97ce3182-b27f-40c4-9fd9-c66351758b42','2024-03-22 12:32:52',1,0,'2024-03-21 12:32:52','2024-03-21 12:32:52',NULL,NULL),(28,3,'3ebd65f6-5d40-4f1b-ae69-8b2e87c9a948','2024-03-22 12:35:47',1,0,'2024-03-21 12:35:45','2024-03-21 12:35:45',NULL,NULL),(29,3,'9afa8078-7bec-4d95-9b23-061c84425279','2024-03-22 12:36:28',1,0,'2024-03-21 12:36:27','2024-03-21 12:36:27',NULL,NULL),(30,3,'f05ae8af-b1dc-4857-8d53-dbf99818ef1d','2024-03-22 12:38:16',1,0,'2024-03-21 12:38:15','2024-03-21 12:38:15',NULL,NULL),(31,3,'b23fb283-554f-458c-b2b6-f3ece10a2159','2024-03-22 12:41:50',1,0,'2024-03-21 12:41:49','2024-03-21 12:41:49',NULL,NULL),(32,2,'7968aa43-37cd-4212-8795-c37e324ce091','2024-03-22 12:44:11',1,0,'2024-03-21 12:44:10','2024-03-21 12:44:10',NULL,NULL),(33,2,'6b486c19-3c20-48a2-b05d-9eed87cc0ae3','2024-03-22 12:45:45',1,0,'2024-03-21 12:45:44','2024-03-21 12:45:44',NULL,NULL),(34,2,'bcd5e4e3-915d-47f3-9d17-f2fbd44d036f','2024-03-22 12:46:19',1,0,'2024-03-21 12:46:18','2024-03-21 12:46:18',NULL,NULL),(35,2,'209aba99-6b90-4978-97b4-c90eeea18c64','2024-03-22 12:46:42',1,0,'2024-03-21 12:46:40','2024-03-21 12:46:40',NULL,NULL),(36,1,'f96abee3-1d61-4958-b12f-23af085949f6','2024-03-22 12:54:30',1,0,'2024-03-21 12:54:29','2024-03-21 12:54:29',NULL,NULL),(37,3,'c38f930a-a08f-40e2-9696-6aabc3eedd14','2024-03-22 14:05:55',1,0,'2024-03-21 14:05:53','2024-03-21 14:05:53',NULL,NULL),(38,3,'933a31d8-7c85-4857-a024-ea4a6592abda','2024-03-22 14:08:03',1,0,'2024-03-21 14:08:02','2024-03-21 14:08:02',NULL,NULL),(39,4,'05747960-57e8-449c-b59d-15bea6d1eb0a','2024-03-22 14:09:35',1,0,'2024-03-21 14:09:33','2024-03-21 14:09:33',NULL,NULL);
/*!40000 ALTER TABLE `userrefreshtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userroles`
--

LOCK TABLES `userroles` WRITE;
/*!40000 ALTER TABLE `userroles` DISABLE KEYS */;
INSERT INTO `userroles` (`id`, `roleId`, `userId`) VALUES (3,2,3),(4,2,4);
/*!40000 ALTER TABLE `userroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userviewprofilehistories`
--

LOCK TABLES `userviewprofilehistories` WRITE;
/*!40000 ALTER TABLE `userviewprofilehistories` DISABLE KEYS */;
INSERT INTO `userviewprofilehistories` (`id`, `userId`, `viewProfileByUserId`, `transactionDate`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,3,3,'2024-03-21 12:06:13',1,0,'2024-03-21 12:06:13','2024-03-21 12:06:13',3,3);
/*!40000 ALTER TABLE `userviewprofilehistories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userwallets`
--

LOCK TABLES `userwallets` WRITE;
/*!40000 ALTER TABLE `userwallets` DISABLE KEYS */;
INSERT INTO `userwallets` (`id`, `userId`, `amount`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,3,8650.00,1,0,'2024-03-21 11:53:22','2024-03-21 11:53:22',3,3),(2,4,25000.00,1,0,'2024-03-21 12:05:00','2024-03-21 12:05:00',4,4);
/*!40000 ALTER TABLE `userwallets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `userwallethistory`
--

LOCK TABLES `userwallethistory` WRITE;
/*!40000 ALTER TABLE `userwallethistory` DISABLE KEYS */;
INSERT INTO `userwallethistory` (`id`, `userWalletId`, `amount`, `isCredit`, `transactionDate`, `remark`, `paymentId`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (1,1,10000.00,1,'2024-03-21 11:53:23','Wallet amount added in account',2,1,0,'2024-03-21 11:53:22','2024-03-21 11:53:22',2,2),(2,2,25000.00,1,'2024-03-21 12:05:01','Wallet amount added in account',4,1,0,'2024-03-21 12:05:00','2024-03-21 12:05:00',3,3),(3,2,1350.00,0,'2024-03-21 00:00:00','Purchase Package',6,1,0,'2024-03-21 12:44:47','2024-03-21 12:44:47',2,2);
/*!40000 ALTER TABLE `userwallethistory` ENABLE KEYS */;
UNLOCK TABLES;

