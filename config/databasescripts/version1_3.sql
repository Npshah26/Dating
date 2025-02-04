
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('40', '1', '4', 'disclaimer', 'Disclaimer', '1', '1', '0', '1', '1');


CREATE TABLE `coupons` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL,
  `code` VARCHAR(25) NULL,
  `type` VARCHAR(12) NULL,
  `value` DOUBLE NULL,
  `maxUsage` INT NULL,
  `userUsage` INT NULL,
  `validFrom` DATETIME NULL,
  `validTo` DATETIME NULL,
  `maxDiscountAmount` DOUBLE NULL,
  `description` LONGTEXT NULL,
  `termsCondition` LONGTEXT NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));



CREATE TABLE `packagecoupons` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `packageId` INT NULL,
  `couponId` INT NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_packagecoupon_package_idx` (`packageId` ASC) ,
  INDEX `fk_packagecoupon_coupon_idx` (`couponId` ASC) ,
  CONSTRAINT `fk_packagecoupon_package`
    FOREIGN KEY (`packageId`)
    REFERENCES `package` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_packagecoupon_coupon`
    FOREIGN KEY (`couponId`)
    REFERENCES `coupons` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


ALTER TABLE `userpackage` 
ADD COLUMN `couponId` INT NULL AFTER `paymentId`,
ADD INDEX `fk_userpackage_coupon_idx` (`couponId` ASC) ;

ALTER TABLE `userpackage` 
ADD CONSTRAINT `fk_userpackage_coupon`
  FOREIGN KEY (`couponId`)
  REFERENCES `coupons` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;



INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('12', 'Flutter Wave', 'Flutter Wave', '3', '5', '1', '0', '1', '1');
UPDATE `flaggroup` SET `parentFlagGroupId` = '3', `displayOrder` = '6' WHERE (`id` = '11');



UPDATE `systemflags` SET `valueList` = 'Razorpay;Stripe;PhonePe;Flutter Wave;Manual Payment' WHERE (`id` = '12');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('36', '12', '8', 'flutterWaveMerchantId', 'Flutter Wave Merchant Id', '200436957', '200436957', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('37', '12', '8', 'flutterWavePublicKey', 'Flutter Wave Public Key', 'FLWPUBK_TEST-ac329afbd3373fd6a026ff0defd8af22-X', 'FLWPUBK_TEST-ac329afbd3373fd6a026ff0defd8af22-X', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('38', '12', '8', 'flutterWaveSecretKey', 'Flutter Wave Secret Key', 'FLWSECK_TEST-35df0c1075351a8c78184c87b2696d38-X', 'FLWSECK_TEST-35df0c1075351a8c78184c87b2696d38-X', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('39', '12', '8', 'flutterWaveEncryptionKey', 'Flutter Wave Encryption Key', 'FLWSECK_TEST29d7a62fb9e2', 'FLWSECK_TEST29d7a62fb9e2', '1', '1', '0', '1', '1');



CREATE TABLE `pages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `path` VARCHAR(45) NULL,
  `title` VARCHAR(45) NULL,
  `type` VARCHAR(45) NULL,
  `active` TINYINT NULL,
  `group` VARCHAR(45) NULL,
  `parentId` INT NULL,
  `isActive` TINYINT NULL DEFAULT 1,
  `isDelete` TINYINT NULL DEFAULT 0,
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL,
  `modifiedBy` INT NULL,
  PRIMARY KEY (`id`));



INSERT INTO `pages` (`path`, `title`, `type`, `active`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin', 'Dashboard', 'link', '1', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('', 'Users', 'sub', '1', 'Users', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/appuser', 'App Users', 'link', '1', 'Users', '2', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/blockuser', 'Block Users', 'link', '1', 'Users', '2', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/users', 'Admin Users', 'link', '1', 'Users', '2', '1', '0', '1', '1');
INSERT INTO `pages` (`title`, `type`, `active`, `group`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('Packages', 'sub', '1', 'Packages', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/premiumaccount', 'Premium Account', 'link', '1', 'Packages', '6', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/premiumfacility', 'Premium Facility', 'link', '1', 'Packages', '6', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/timeduration', 'Time Duration', 'link', '1', 'Packages', '6', '1', '0', '1', '1');
INSERT INTO `pages` (`title`, `type`, `active`, `group`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('Master Entry', 'sub', '1', 'Master Entry', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/document-type', 'Document Type', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/religion', 'Religion', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/community', 'Community', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/subcommunity', 'Sub Community', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/maritalstatus', 'Marital Status', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/employment', 'Employment', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/occupation', 'Occupation', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/education', 'Education', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/diet', 'Diet', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/height', 'Height', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('/admin/income', 'Annual income', 'link', '1', 'Master Entry', '10', '1', '0', '1', '1');



INSERT INTO `roles` (`id`, `name`, `isActive`, `isDelete`) VALUES ('3', 'Employee', '1', '0');



ALTER TABLE `countries` 
ADD COLUMN `isDefult` TINYINT NULL DEFAULT 0 AFTER `dialCode`;




UPDATE `countries` SET `isDefult` = '1' WHERE (`id` = '1');



CREATE TABLE `profilefor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));



ALTER TABLE `profilefor` 
ADD COLUMN `gender` VARCHAR(45) NULL AFTER `name`;


ALTER TABLE `userpersonaldetail` 
ADD COLUMN `weight` DECIMAL(6,3) NULL AFTER `employmentTypeId`,
ADD COLUMN `profileForId` INT NULL AFTER `weight`,
ADD INDEX `fk_userpersonaldetail_profilefor_idx` (`profileForId` ASC) ;

ALTER TABLE `userpersonaldetail` 
ADD CONSTRAINT `fk_userpersonaldetail_profilefor`
  FOREIGN KEY (`profileForId`)
  REFERENCES `profilefor` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;



ALTER TABLE `users` 
ADD COLUMN `referalUserId` INT NULL AFTER `id`,
ADD INDEX `fk_users_users_idx` (`referalUserId` ASC) ;

ALTER TABLE `users` 
ADD CONSTRAINT `fk_users_users`
  FOREIGN KEY (`referalUserId`)
  REFERENCES `users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;




INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('13', 'Manage Wallet', 'Manage Wallet', '7', '1', '0', '1', '1');



INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('41', '13', '7', 'isEnableWallet', 'Enable Wallet', '0', '0', '1', '1', '0', '1', '1');



INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('42', '13', '7', 'isEnableReward', 'Enable Reward & Earn', '0', '0', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('43', '13', '2', 'rewardAmount', 'Reward Amount', '0', '0', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('44', '13', '4', 'rewardTermsCondition', 'Reward Terms & Condition', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>', '1', '1', '0', '1', '1');



CREATE TABLE `userwallets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NULL,
  `amount` DECIMAL(10,2) NULL,
  `isActive` TINYINT NULL DEFAULT 1,
  `isDelete` TINYINT NULL DEFAULT 0,
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL,
  `modifiedBy` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_userwallet_user_idx` (`userId` ASC) ,
  CONSTRAINT `fk_userwallet_user`
    FOREIGN KEY (`userId`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);




CREATE TABLE `userwallethistory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userWalletId` INT NULL,
  `amount` DECIMAL(10,2) NULL,
  `isCredit` TINYINT NULL,
  `transactionDate` DATETIME NULL,
  `remark` LONGTEXT NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_userwallethistory_userwallet_idx` (`userWalletId` ASC) ,
  CONSTRAINT `fk_userwallethistory_userwallet`
    FOREIGN KEY (`userWalletId`)
    REFERENCES `userwallets` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



DROP TABLE IF EXISTS `currencies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currencies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `symbol` varchar(5) DEFAULT NULL,
  `code` varchar(10) DEFAULT NULL,
  `isDefault` tinyint DEFAULT '0',
  `isActive` tinyint DEFAULT '1',
  `isDelete` tinyint DEFAULT '0',
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ;


DROP TABLE IF EXISTS `paymentgateway`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paymentgateway` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `jsonData` json DEFAULT NULL,
  `useInWallet` tinyint DEFAULT '0',
  `useInCheckout` tinyint DEFAULT '0',
  `useInAndroid` tinyint DEFAULT NULL,
  `useInApple` tinyint DEFAULT NULL,
  `isActive` tinyint DEFAULT '1',
  `isDelete` tinyint DEFAULT '0',
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL,
  `description` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ;
  


INSERT INTO `currencies` VALUES (1,'Rupees','₹','INR',1,1,0,'2024-01-20 15:54:49','2024-01-20 15:54:49',1,1),(2,'US Dollar','$','USD',0,1,0,'2024-01-20 15:54:49','2024-01-20 15:54:49',1,1),(3,'Nigerian Naira','₦','NGN',0,1,0,'2024-01-20 16:32:00','2024-01-20 16:32:00',1,1),(4,'South African Rand','R','ZAR',0,1,0,'2024-01-20 16:32:00','2024-01-20 16:32:00',1,1);

INSERT INTO `paymentgateway` VALUES (1,'Razorpay','{\"apiKey\": \"YOUR-API-KEY\", \"secretKey\": \"YOUR-SECRET-KEY\"}',1,1,1,NULL,1,0,'2024-01-20 17:48:02','2024-01-20 17:48:02',1,1,NULL),(2,'Stripe','{\"secretKey\": \"YOUR-SECRET-KEY\", \"publishableKey\": \"YOUR-PUBLISHABLE-KEY\"}',1,1,1,NULL,1,0,'2024-01-20 17:48:02','2024-01-20 17:48:02',1,1,NULL),(3,'PhonePe','{\"saltKey\": \"YOUR-SALT-KEY\", \"saltIndex\": \"1\", \"merchantId\": \"YOUR-MERCHANT-ID\", \"apiEndPoint\": \"/pg/v1/pay\", \"redirectMode\": \"REDIRECT\", \"environmentValue\": \"SANDBOX\"}',1,1,1,NULL,1,0,'2024-01-20 17:48:02','2024-01-20 17:48:02',1,1,NULL),(4,'flutterWave','{\"publicKey\": \"YOUR-PUBLIC-KEY\", \"secretKey\": \"YOUR-SECRET-KEY\", \"merchantId\": \"YOUR-MERCHANT-ID\", \"encryptionKey\": \"YOUR-ENCRYPTION-KEY\"}',1,1,1,NULL,0,0,'2024-01-20 17:48:02','2024-01-20 17:48:02',1,1,NULL),(5,'AppleInAppPurchase',NULL,0,1,NULL,1,1,0,'2024-01-27 18:04:50','2024-01-27 18:04:50',NULL,NULL,NULL),(6,'GoogleInAppPurchase',NULL,0,1,1,NULL,1,0,'2024-01-27 18:04:50','2024-01-27 18:04:50',NULL,NULL,NULL),(7,'Wallet',NULL,NULL,1,1,1,1,0,'2024-01-27 18:04:50','2024-01-27 18:04:50',NULL,NULL,NULL),(8,'ManualPayment',NULL,NULL,1,1,1,1,0,'2024-01-31 14:26:16','2024-01-31 14:26:16',NULL,NULL,'<p>Step 1 - Transfer payments</p><p>Step 2 - Send the amount using the following</p><ul><li>Bank Details</li><li class=\"ql-indent-1\">[Your Bank Account Number] e.g.: 8515XX9587</li><li class=\"ql-indent-1\">[IFSC CODE] e.g.: BARBOXXXX</li></ul><p><br></p><p>&nbsp;&nbsp;&nbsp;&nbsp;OR</p><p><br></p><ul><li>[Your UPI ID] e.g: example@bank</li></ul><p><br></p><p>&nbsp;&nbsp;&nbsp;&nbsp;OR</p><p><br></p><ul><li><img src=\"data:image/png;base64,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\"></li></ul><p><br></p><p>Please send payment screen shot to Email([Your Email Address]) OR WhatsApp([Your WhatsApp No])</p><p><br></p><p>Step 3 - Once you are done with the above steps click on the Request button</p><p>Step 4 - Your account will be activated within 24 hours</p><p><br></p><p>[The above content is dummy. Look for the change in Admin Panel]</p>'),(9,'Paypal','{\"clientid\": \"YOUR-CLIENT-ID\", \"secretkey\": \"YOUR-SECRET-KEY\"}',1,1,1,NULL,0,0,'2024-02-02 10:16:16','2024-02-02 10:16:16',NULL,NULL,NULL),(10,'Paystack','{\"publickey\": \"YOUR-API-KEY\", \"secretkey\": \"YOUR-SECRET-KEY\"}',1,1,1,NULL,0,0,'2024-02-02 10:16:16','2024-02-02 10:16:16',NULL,NULL,NULL);


CREATE TABLE `currencypaymentgateway` (
  `id` int NOT NULL AUTO_INCREMENT,
  `currencyId` int DEFAULT NULL,
  `paymentGatewayId` int DEFAULT NULL,
  `isActive` tinyint DEFAULT '1',
  `isDelete` tinyint DEFAULT '0',
  `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int DEFAULT NULL,
  `modifiedBy` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_support_currency_idx` (`currencyId`),
  KEY `fk_support_paymentgateway_idx` (`paymentGatewayId`),
  CONSTRAINT `fk_support_currency` FOREIGN KEY (`currencyId`) REFERENCES `currencies` (`id`),
  CONSTRAINT `fk_support_paymentgateway` FOREIGN KEY (`paymentGatewayId`) REFERENCES `paymentgateway` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ;



INSERT INTO `currencypaymentgateway` VALUES (1,1,1,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(2,2,1,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(3,3,1,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(4,4,1,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(5,1,2,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(6,2,2,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(7,3,2,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(8,4,2,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(9,1,3,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(10,3,4,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(11,4,4,1,0,'2024-01-20 18:01:04','2024-01-20 18:01:04',1,1),(24,1,5,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(25,2,5,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(26,3,5,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(27,4,5,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(28,1,6,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(29,2,6,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(30,3,6,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(31,4,6,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(32,1,7,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(33,2,7,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(34,3,7,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(35,4,7,1,0,'2024-01-29 10:01:30','2024-01-29 10:01:30',NULL,NULL),(37,2,9,1,0,'2024-02-02 10:26:21','2024-02-02 10:26:21',NULL,NULL),(38,3,10,1,0,'2024-02-02 10:26:21','2024-02-02 10:26:21',NULL,NULL),(39,2,10,1,0,'2024-02-02 10:26:21','2024-02-02 10:26:21',NULL,NULL),(40,1,8,1,0,'2024-02-02 10:26:21','2024-02-02 10:26:21',NULL,NULL),(41,2,8,1,0,'2024-02-02 10:26:21','2024-02-02 10:26:21',NULL,NULL),(42,3,8,1,0,'2024-02-02 10:26:21','2024-02-02 10:26:21',NULL,NULL),(43,4,8,1,0,'2024-02-02 10:26:21','2024-02-02 10:26:21',NULL,NULL);


ALTER TABLE `userpersonaldetail` 
CHANGE COLUMN `weight` `weight` FLOAT NULL DEFAULT NULL ;

DROP TABLE IF EXISTS `weight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weight` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` INT NOT NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `weight` 
CHANGE COLUMN `name` `name` FLOAT NOT NULL ;


INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`) VALUES ('/admin/currency', 'Currency', 'link', '1', 'Master Entry', '10', '1', '0');
INSERT INTO `pages` (`path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`) VALUES ('/admin/paymentGateway', 'Payment Gateway', 'link', '1', 'Master Entry', '10', '1', '0');


UPDATE `flaggroup` SET `isDelete` = '1' WHERE (`id` = '4');
UPDATE `flaggroup` SET `isDelete` = '1' WHERE (`id` = '5');
UPDATE `flaggroup` SET `isDelete` = '1' WHERE (`id` = '9');
UPDATE `flaggroup` SET `isDelete` = '1' WHERE (`id` = '11');
UPDATE `flaggroup` SET `isDelete` = '1' WHERE (`id` = '12');




UPDATE `flaggroup` SET `isDelete` = '1' WHERE (`id` = '3');





