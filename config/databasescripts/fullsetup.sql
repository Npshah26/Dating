-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 192.168.29.101    Database: matrimony
-- ------------------------------------------------------
-- Server version	8.0.25
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--
DROP TABLE IF EXISTS `addresses`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `addresses` (
    `id` int NOT NULL AUTO_INCREMENT,
    `addressLine1` varchar(500) DEFAULT NULL,
    `addressLine2` varchar(500) DEFAULT NULL,
    `pincode` varchar(10) DEFAULT NULL,
    `cityId` int DEFAULT NULL,
    `districtId` int DEFAULT NULL,
    `stateId` int DEFAULT NULL,
    `countryId` int DEFAULT NULL,
    `countryName` varchar(100) DEFAULT NULL,
    `stateName` varchar(100) DEFAULT NULL,
    `cityName` varchar(100) DEFAULT NULL,
    `latitude` double DEFAULT NULL,
    `longitude` double DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `annualincome`
--
DROP TABLE IF EXISTS `annualincome`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `annualincome` (
    `id` int NOT NULL AUTO_INCREMENT,
    `value` varchar(200) NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `application`
--
DROP TABLE IF EXISTS `application`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `application` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(45) NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `authproviders`
--
DROP TABLE IF EXISTS `authproviders`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `authproviders` (
    `id` int NOT NULL AUTO_INCREMENT,
    `providerName` varchar(45) NOT NULL,
    `providerIcon` varchar(500) DEFAULT NULL,
    `applicationId` varchar(300) DEFAULT NULL,
    `secretKey` varchar(300) DEFAULT NULL,
    `loginURL` varchar(300) NOT NULL,
    `tokenURL` varchar(300) NOT NULL,
    `userInfoURL` varchar(300) NOT NULL,
    `callbackURL` varchar(300) NOT NULL,
    `permission` varchar(200) NOT NULL,
    `description` varchar(500) DEFAULT NULL,
    `isActive` tinyint NOT NULL DEFAULT '1',
    `isDelete` tinyint NOT NULL DEFAULT '0',
    `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cities`
--
DROP TABLE IF EXISTS `cities`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `cities` (
    `id` int NOT NULL AUTO_INCREMENT,
    `districtId` int DEFAULT NULL,
    `name` varchar(200) DEFAULT NULL,
    `pincode` varchar(10) DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_districtId_idx` (`districtId`),
    CONSTRAINT `fk_districtId` FOREIGN KEY (`districtId`) REFERENCES `districts` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `community`
--
DROP TABLE IF EXISTS `community`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `community` (
    `id` int NOT NULL AUTO_INCREMENT,
    `religionId` int DEFAULT NULL,
    `name` varchar(200) NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_community_religion_idx` (`religionId`),
    CONSTRAINT `fk_community_religion` FOREIGN KEY (`religionId`) REFERENCES `religion` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `countries`
--
DROP TABLE IF EXISTS `countries`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `countries` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(60) DEFAULT NULL,
    `isoCode` varchar(45) DEFAULT NULL,
    `isoCode3` varchar(45) DEFAULT NULL,
    `dialCode` varchar(10) DEFAULT NULL,
    `isDefult` tinyint DEFAULT '0',
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `coupons`
--
DROP TABLE IF EXISTS `coupons`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `coupons` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) DEFAULT NULL,
    `code` varchar(25) DEFAULT NULL,
    `type` varchar(12) DEFAULT NULL,
    `value` double DEFAULT NULL,
    `maxUsage` int DEFAULT NULL,
    `userUsage` int DEFAULT NULL,
    `validFrom` datetime DEFAULT NULL,
    `validTo` datetime DEFAULT NULL,
    `maxDiscountAmount` double DEFAULT NULL,
    `description` longtext,
    `termsCondition` longtext,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `currencies`
--
DROP TABLE IF EXISTS `currencies`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `currencies` (
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
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `currencypaymentgateway`
--
DROP TABLE IF EXISTS `currencypaymentgateway`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `currencypaymentgateway` (
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
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers`
--
DROP TABLE IF EXISTS `customers`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `customers` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) DEFAULT NULL,
    `address` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customfields`
--
DROP TABLE IF EXISTS `customfields`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `customfields` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) DEFAULT NULL,
    `displayName` varchar(100) DEFAULT NULL,
    `mappedFieldName` varchar(100) DEFAULT NULL,
    `description` longtext,
    `valueTypeId` int DEFAULT NULL,
    `isRequired` tinyint DEFAULT '0',
    `allowInSearch` tinyint DEFAULT '0',
    `allowInFilter` tinyint DEFAULT '0',
    `allowIncompleteProfile` tinyint DEFAULT '0',
    `allowInPreferences` tinyint DEFAULT '0',
    `defaultValue` longtext,
    `valueList` longtext,
    `completeprofilesectioname` varchar(100) DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customnotification`
--
DROP TABLE IF EXISTS `customnotification`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `customnotification` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) DEFAULT NULL,
    `title` varchar(200) DEFAULT NULL,
    `description` longtext,
    `imageUrl` longtext,
    `sendCount` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `diet`
--
DROP TABLE IF EXISTS `diet`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `diet` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(200) NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `districts`
--
DROP TABLE IF EXISTS `districts`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `districts` (
    `id` int NOT NULL AUTO_INCREMENT,
    `stateId` int DEFAULT NULL,
    `name` varchar(200) DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_stateId_idx` (`stateId`),
    CONSTRAINT `fk_stateId` FOREIGN KEY (`stateId`) REFERENCES `state` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `documenttype`
--
DROP TABLE IF EXISTS `documenttype`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `documenttype` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) DEFAULT NULL,
    `isRequired` tinyint DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `education`
--
DROP TABLE IF EXISTS `education`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `education` (
    `id` int NOT NULL AUTO_INCREMENT,
    `parentId` int DEFAULT NULL,
    `name` varchar(200) NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employmenttype`
--
DROP TABLE IF EXISTS `employmenttype`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `employmenttype` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `parentId` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `feedback`
--
DROP TABLE IF EXISTS `feedback`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `feedback` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `description` varchar(45) DEFAULT NULL,
    `title` varchar(45) DEFAULT NULL,
    `transactionDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `f_k_user_id_idx` (`userId`),
    CONSTRAINT `f_k_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `flaggroup`
--
DROP TABLE IF EXISTS `flaggroup`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `flaggroup` (
    `id` int NOT NULL,
    `flagGroupName` varchar(50) DEFAULT NULL,
    `detail` longtext,
    `parentFlagGroupId` int DEFAULT NULL,
    `displayOrder` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `height`
--
DROP TABLE IF EXISTS `height`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `height` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` int NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `images`
--
DROP TABLE IF EXISTS `images`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `images` (
    `id` int NOT NULL AUTO_INCREMENT,
    `imageUrl` longtext,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `updatedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maritalstatus`
--
DROP TABLE IF EXISTS `maritalstatus`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `maritalstatus` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(200) NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `occupation`
--
DROP TABLE IF EXISTS `occupation`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `occupation` (
    `id` int NOT NULL AUTO_INCREMENT,
    `parentId` int DEFAULT NULL,
    `name` varchar(200) NOT NULL,
    `imageUrl` longtext,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `package`
--
DROP TABLE IF EXISTS `package`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `package` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(500) NOT NULL,
    `baseAmount` decimal(10, 0) NOT NULL,
    `weightage` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `packagecoupons`
--
DROP TABLE IF EXISTS `packagecoupons`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `packagecoupons` (
    `id` int NOT NULL AUTO_INCREMENT,
    `packageId` int DEFAULT NULL,
    `couponId` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_packagecoupon_package_idx` (`packageId`),
    KEY `fk_packagecoupon_coupon_idx` (`couponId`),
    CONSTRAINT `fk_packagecoupon_coupon` FOREIGN KEY (`couponId`) REFERENCES `coupons` (`id`),
    CONSTRAINT `fk_packagecoupon_package` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `packageduration`
--
DROP TABLE IF EXISTS `packageduration`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `packageduration` (
    `id` int NOT NULL AUTO_INCREMENT,
    `packageId` int DEFAULT NULL,
    `timeDurationId` int DEFAULT NULL,
    `discount` varchar(45) DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `_fk_packageId_idx` (`packageId`),
    KEY `_fk_timeDurationId_idx` (`timeDurationId`),
    CONSTRAINT `_fk_packageId` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`),
    CONSTRAINT `_fk_timeDurationId` FOREIGN KEY (`timeDurationId`) REFERENCES `timeduration` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `packagefacility`
--
DROP TABLE IF EXISTS `packagefacility`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `packagefacility` (
    `id` int NOT NULL AUTO_INCREMENT,
    `packageId` int DEFAULT NULL,
    `premiumFacilityId` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_packageId_idx` (`packageId`),
    KEY `fk_premiumFacilityId_idx` (`premiumFacilityId`),
    CONSTRAINT `fk_packageId` FOREIGN KEY (`packageId`) REFERENCES `package` (`id`),
    CONSTRAINT `fk_premiumFacilityId` FOREIGN KEY (`premiumFacilityId`) REFERENCES `premiumfacility` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pages`
--
DROP TABLE IF EXISTS `pages`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `pages` (
    `id` int NOT NULL AUTO_INCREMENT,
    `path` varchar(45) DEFAULT NULL,
    `title` varchar(45) DEFAULT NULL,
    `type` varchar(45) DEFAULT NULL,
    `active` tinyint DEFAULT NULL,
    `group` varchar(45) DEFAULT NULL,
    `parentId` int DEFAULT NULL,
    `displayOrder` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment`
--
DROP TABLE IF EXISTS `payment`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `payment` (
    `id` int NOT NULL AUTO_INCREMENT,
    `paymentMode` varchar(45) DEFAULT NULL,
    `paymentRefrence` varchar(45) DEFAULT NULL,
    `amount` decimal(10, 0) DEFAULT NULL,
    `userId` int DEFAULT NULL,
    `paymentStatus` varchar(45) DEFAULT NULL,
    `signature` varchar(100) DEFAULT NULL,
    `orderId` varchar(45) DEFAULT NULL,
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paymentgateway`
--
DROP TABLE IF EXISTS `paymentgateway`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `paymentgateway` (
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
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `premiumfacility`
--
DROP TABLE IF EXISTS `premiumfacility`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `premiumfacility` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(200) NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `profilefor`
--
DROP TABLE IF EXISTS `profilefor`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `profilefor` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) DEFAULT NULL,
    `gender` varchar(45) DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `questioncategories`
--
DROP TABLE IF EXISTS `questioncategories`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `questioncategories` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(45) DEFAULT NULL,
    `parentId` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `questions`
--
DROP TABLE IF EXISTS `questions`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `questions` (
    `id` int NOT NULL AUTO_INCREMENT,
    `questionCategoriesId` int DEFAULT NULL,
    `question` longtext,
    `answer` longtext,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `f_k_questionCategories_Id_idx` (`questionCategoriesId`),
    CONSTRAINT `f_k_questionCategories_Id` FOREIGN KEY (`questionCategoriesId`) REFERENCES `questioncategories` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `religion`
--
DROP TABLE IF EXISTS `religion`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `religion` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(200) NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--
DROP TABLE IF EXISTS `roles`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `roles` (
    `id` int NOT NULL,
    `name` varchar(100) NOT NULL,
    `description` varchar(200) DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `state`
--
DROP TABLE IF EXISTS `state`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `state` (
    `id` int NOT NULL AUTO_INCREMENT,
    `countryId` int DEFAULT NULL,
    `name` varchar(45) DEFAULT NULL,
    `code` varchar(45) DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_countriesId_idx` (`countryId`),
    CONSTRAINT `fk_countriesId` FOREIGN KEY (`countryId`) REFERENCES `countries` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `subcommunity`
--
DROP TABLE IF EXISTS `subcommunity`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `subcommunity` (
    `id` int NOT NULL AUTO_INCREMENT,
    `religionId` int DEFAULT NULL,
    `communityId` int DEFAULT NULL,
    `name` varchar(200) NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_religion_subcommunity_idx` (`religionId`),
    KEY `fk_religion_community_idx` (`communityId`),
    CONSTRAINT `fk_religion_community` FOREIGN KEY (`communityId`) REFERENCES `community` (`id`),
    CONSTRAINT `fk_religion_subcommunity` FOREIGN KEY (`religionId`) REFERENCES `religion` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `successstories`
--
DROP TABLE IF EXISTS `successstories`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `successstories` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `partnerUserId` int DEFAULT NULL,
    `imageId` int DEFAULT NULL,
    `maritalStatus` varchar(20) DEFAULT NULL,
    `transactionDate` datetime DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `_fk_user_Id__idx` (`userId`),
    KEY `_fk_partner_User_Id_idx` (`partnerUserId`),
    CONSTRAINT `_fk_partner_User_Id` FOREIGN KEY (`partnerUserId`) REFERENCES `users` (`id`),
    CONSTRAINT `_fk_user_Id_` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `systemflags`
--
DROP TABLE IF EXISTS `systemflags`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `systemflags` (
    `id` int NOT NULL,
    `flagGroupId` int DEFAULT NULL,
    `valueTypeId` int DEFAULT NULL,
    `name` varchar(200) DEFAULT NULL,
    `displayName` varchar(200) DEFAULT NULL,
    `value` longtext,
    `defaultValue` longtext,
    `valueList` longtext,
    `description` longtext,
    `label` varchar(45) DEFAULT NULL,
    `autoRender` tinyint DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_flagGroupId_idx` (`flagGroupId`),
    KEY `fk_valueTypeId_idx` (`valueTypeId`),
    CONSTRAINT `fk_flagGroupId` FOREIGN KEY (`flagGroupId`) REFERENCES `flaggroup` (`id`),
    CONSTRAINT `fk_valueTypeId` FOREIGN KEY (`valueTypeId`) REFERENCES `valuetypes` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timeduration`
--
DROP TABLE IF EXISTS `timeduration`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `timeduration` (
    `id` int NOT NULL AUTO_INCREMENT,
    `value` int NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userauthdata`
--
DROP TABLE IF EXISTS `userauthdata`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userauthdata` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int NOT NULL,
    `oAuthUserId` varchar(100) NOT NULL,
    `oAuthUserName` varchar(100) DEFAULT NULL,
    `oAuthUserPicUrl` longtext,
    `oAuthAccessToken` longtext,
    `authProviderId` int DEFAULT NULL,
    `description` longtext,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `_f_k_user_Id__idx` (`userId`),
    KEY `_fk_authProviderId_idx` (`authProviderId`),
    CONSTRAINT `_f_k_user_Id_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
    CONSTRAINT `_fk_authProviderId` FOREIGN KEY (`authProviderId`) REFERENCES `authproviders` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userblock`
--
DROP TABLE IF EXISTS `userblock`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userblock` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int NOT NULL,
    `userBlockId` int NOT NULL,
    `status` tinyint DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `_f_k_user_Id_idx` (`userId`),
    KEY `_fk_userBlock_Id_idx` (`userBlockId`),
    CONSTRAINT `_f_k_user_Id_` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
    CONSTRAINT `_fk_userBlock_Id` FOREIGN KEY (`userBlockId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userblockrequest`
--
DROP TABLE IF EXISTS `userblockrequest`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userblockrequest` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `blockRequestUserId` int DEFAULT NULL,
    `reason` varchar(500) DEFAULT NULL,
    `status` tinyint DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `_FK_UserId_idx` (`userId`),
    KEY `fk_blockUserId_idx` (`blockRequestUserId`),
    CONSTRAINT `_FK_UserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_blockRequestUserId` FOREIGN KEY (`blockRequestUserId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userchat`
--
DROP TABLE IF EXISTS `userchat`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userchat` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `partnerId` int DEFAULT NULL,
    `chatId` varchar(100) DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `_f_k_u_ser_id_idx` (`userId`),
    KEY `_f_k_p_artner_id_idx` (`partnerId`),
    CONSTRAINT `_f_k_p_artner_id` FOREIGN KEY (`partnerId`) REFERENCES `users` (`id`),
    CONSTRAINT `_f_k_u_ser_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userchats`
--
DROP TABLE IF EXISTS `userchats`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userchats` (
    `id` int NOT NULL AUTO_INCREMENT,
    `senderUserId` int NOT NULL,
    `receiverUserId` int NOT NULL,
    `chatId` int NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_senderUserId_idx` (`senderUserId`),
    KEY `fk_receiverUserId_idx` (`receiverUserId`),
    CONSTRAINT `fk_receiverUserId` FOREIGN KEY (`receiverUserId`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_senderUserId` FOREIGN KEY (`senderUserId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userdevicedetail`
--
DROP TABLE IF EXISTS `userdevicedetail`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userdevicedetail` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `applicationId` int DEFAULT NULL,
    `deviceId` varchar(300) DEFAULT NULL,
    `fcmToken` varchar(300) DEFAULT NULL,
    `deviceLocation` varchar(300) DEFAULT NULL,
    `deviceManufacturer` varchar(300) DEFAULT NULL,
    `deviceModel` varchar(100) DEFAULT NULL,
    `apiCallTime` varchar(100) DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `_userId_idx` (`userId`),
    KEY `_applicationId_idx` (`applicationId`),
    CONSTRAINT `fk_applicationId` FOREIGN KEY (`applicationId`) REFERENCES `application` (`id`),
    CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userdocument`
--
DROP TABLE IF EXISTS `userdocument`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userdocument` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `documentTypeId` int DEFAULT NULL,
    `documentUrl` longtext,
    `isVerified` tinyint DEFAULT NULL,
    `isRequired` tinyint DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_userdocument_user_idx` (`userId`),
    KEY `fk_userdocument_documenttype_idx` (`documentTypeId`),
    CONSTRAINT `fk_userdocument_documenttype` FOREIGN KEY (`documentTypeId`) REFERENCES `documenttype` (`id`),
    CONSTRAINT `fk_userdocument_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userfavourites`
--
DROP TABLE IF EXISTS `userfavourites`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userfavourites` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `favUserId` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FK_userId_idx` (`userId`),
    KEY `FK_favUserId_idx` (`favUserId`),
    CONSTRAINT `FK_favuserId1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
    CONSTRAINT `FK_favUserId2` FOREIGN KEY (`favUserId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userflags`
--
DROP TABLE IF EXISTS `userflags`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userflags` (
    `id` int NOT NULL AUTO_INCREMENT,
    `flagName` varchar(100) NOT NULL,
    `flagGroupId` int NOT NULL,
    `displayName` varchar(100) DEFAULT NULL,
    `description` longtext,
    `tooltip` varchar(45) DEFAULT NULL,
    `valueTypeId` int NOT NULL,
    `valueList` longtext,
    `defaultValue` longtext,
    `limit` longtext,
    `autoRender` tinyint DEFAULT NULL,
    `displayOrder` int DEFAULT NULL,
    `isActive` tinyint DEFAULT NULL,
    `isDelete` tinyint DEFAULT NULL,
    `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` datetime DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `_falg_groupId_idx` (`flagGroupId`),
    KEY `fk_value_typeId_idx` (`valueTypeId`),
    CONSTRAINT `fk_falg_groupId` FOREIGN KEY (`flagGroupId`) REFERENCES `flaggroup` (`id`),
    CONSTRAINT `fk_value_typeId` FOREIGN KEY (`valueTypeId`) REFERENCES `valuetypes` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userflagvalues`
--
DROP TABLE IF EXISTS `userflagvalues`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userflagvalues` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int NOT NULL,
    `userFlagId` int NOT NULL,
    `userFlagValue` tinyint DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
    `updateAt` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_userId_idx` (`userId`),
    KEY `fk_user_flag_Id_idx` (`userFlagId`),
    CONSTRAINT `fk_user_flag_Id` FOREIGN KEY (`userFlagId`) REFERENCES `userflags` (`id`),
    CONSTRAINT `fk_user_Id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usernotifications`
--
DROP TABLE IF EXISTS `usernotifications`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `usernotifications` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `title` varchar(500) DEFAULT NULL,
    `message` longtext,
    `imageUrl` longtext,
    `bodyJson` json DEFAULT NULL,
    `isRead` tinyint DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FK_notificationUserId_idx` (`userId`),
    CONSTRAINT `FK_notificationUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userpackage`
--
DROP TABLE IF EXISTS `userpackage`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userpackage` (
    `id` int NOT NULL AUTO_INCREMENT,
    `packageId` int DEFAULT NULL,
    `packageDurationId` int DEFAULT NULL,
    `startDate` datetime DEFAULT NULL,
    `endDate` datetime DEFAULT NULL,
    `netAmount` decimal(10, 0) DEFAULT NULL,
    `purchaseDate` datetime DEFAULT NULL,
    `userId` int DEFAULT NULL,
    `paymentId` varchar(45) DEFAULT NULL,
    `couponId` int DEFAULT NULL,
    `signature` longtext,
    `originalJson` longtext,
    `purchaseToken` longtext,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedData` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `_F_K_user_Id_idx` (`userId`),
    KEY `fk_userpackage_coupon_idx` (`couponId`),
    CONSTRAINT `_F_K_user_Id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_userpackage_coupon` FOREIGN KEY (`couponId`) REFERENCES `coupons` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userpages`
--
DROP TABLE IF EXISTS `userpages`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userpages` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `pageId` int DEFAULT NULL,
    `isReadPermission` tinyint (1) DEFAULT '0',
    `isAddPermission` tinyint (1) DEFAULT '0',
    `isDeletePermission` tinyint (1) DEFAULT '0',
    `isEditPermission` tinyint (1) DEFAULT '0',
    `isActive` tinyint NOT NULL DEFAULT '1',
    `isDelete` tinyint NOT NULL DEFAULT '0',
    `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_userpage_user_idx` (`userId`),
    KEY `fk_userpage_page_idx` (`pageId`),
    CONSTRAINT `fk_userpage_page` FOREIGN KEY (`pageId`) REFERENCES `pages` (`id`),
    CONSTRAINT `fk_userpage_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userpersonaldetail`
--
DROP TABLE IF EXISTS `userpersonaldetail`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userpersonaldetail` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `addressId` int DEFAULT NULL,
    `religionId` int DEFAULT NULL,
    `communityId` int DEFAULT NULL,
    `maritalStatusId` int DEFAULT NULL,
    `occupationId` int DEFAULT NULL,
    `educationId` int DEFAULT NULL,
    `subCommunityId` int DEFAULT NULL,
    `dietId` int DEFAULT NULL,
    `annualIncomeId` int DEFAULT NULL,
    `heightId` int DEFAULT NULL,
    `birthDate` datetime DEFAULT NULL,
    `languages` varchar(200) DEFAULT NULL,
    `eyeColor` varchar(200) DEFAULT NULL,
    `businessName` varchar(200) DEFAULT NULL,
    `companyName` varchar(200) DEFAULT NULL,
    `employmentTypeId` int DEFAULT NULL,
    `weight` float DEFAULT NULL,
    `profileForId` int DEFAULT NULL,
    `expectation` longtext,
    `aboutMe` longtext,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `_fk_userd_idx` (`userId`),
    KEY `_fk_adressId_idx` (`addressId`),
    KEY `_fk_religionId_idx` (`religionId`),
    KEY `_fk_communityId_idx` (`communityId`),
    KEY `_fk_maritalStatusId_idx` (`maritalStatusId`),
    KEY `_fk_occupationId_idx` (`occupationId`),
    KEY `_fk_educationId_idx` (`educationId`),
    KEY `_fk_subCommunityId_idx` (`subCommunityId`),
    KEY `_fk_dietId_idx` (`dietId`),
    KEY `_fk_annualIncomeId_idx` (`annualIncomeId`),
    KEY `_fk_heightId_idx` (`heightId`),
    KEY `_fk_employmentTypeId_idx` (`employmentTypeId`),
    KEY `fk_userpersonaldetail_profilefor_idx` (`profileForId`),
    CONSTRAINT `_fk_adressId` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`),
    CONSTRAINT `_fk_annualIncomeId` FOREIGN KEY (`annualIncomeId`) REFERENCES `annualincome` (`id`),
    CONSTRAINT `_fk_communityId` FOREIGN KEY (`communityId`) REFERENCES `community` (`id`),
    CONSTRAINT `_fk_dietId` FOREIGN KEY (`dietId`) REFERENCES `diet` (`id`),
    CONSTRAINT `_fk_educationId` FOREIGN KEY (`educationId`) REFERENCES `education` (`id`),
    CONSTRAINT `_fk_employmentTypeId` FOREIGN KEY (`employmentTypeId`) REFERENCES `employmenttype` (`id`),
    CONSTRAINT `_fk_heightId` FOREIGN KEY (`heightId`) REFERENCES `height` (`id`),
    CONSTRAINT `_fk_maritalStatusId` FOREIGN KEY (`maritalStatusId`) REFERENCES `maritalstatus` (`id`),
    CONSTRAINT `_fk_occupationId` FOREIGN KEY (`occupationId`) REFERENCES `occupation` (`id`),
    CONSTRAINT `_fk_religionId` FOREIGN KEY (`religionId`) REFERENCES `religion` (`id`),
    CONSTRAINT `_fk_subCommunityId` FOREIGN KEY (`subCommunityId`) REFERENCES `subcommunity` (`id`),
    CONSTRAINT `_fk_userd` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_userpersonaldetail_profilefor` FOREIGN KEY (`profileForId`) REFERENCES `profilefor` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userpersonaldetailcustomdata`
--
DROP TABLE IF EXISTS `userpersonaldetailcustomdata`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userpersonaldetailcustomdata` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` varchar(45) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_userpersonaldetailcustomdata_user_idx` (`userId`),
    CONSTRAINT `fk_userpersonaldetailcustomdata_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userproposals`
--
DROP TABLE IF EXISTS `userproposals`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userproposals` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int NOT NULL,
    `proposalUserId` int NOT NULL,
    `status` tinyint DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_userId_idx` (`userId`),
    KEY `fk_userId1_idx` (`proposalUserId`),
    CONSTRAINT `fk_proposalUserId` FOREIGN KEY (`proposalUserId`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_userUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userrefreshtoken`
--
DROP TABLE IF EXISTS `userrefreshtoken`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userrefreshtoken` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int NOT NULL,
    `refreshToken` longtext,
    `expireAt` datetime DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userroles`
--
DROP TABLE IF EXISTS `userroles`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userroles` (
    `id` int NOT NULL AUTO_INCREMENT,
    `roleId` int NOT NULL,
    `userId` int NOT NULL,
    PRIMARY KEY (`id`),
    KEY `_roleId_idx` (`roleId`),
    KEY `_userId_idx` (`userId`),
    CONSTRAINT `_roleId` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`),
    CONSTRAINT `_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--
DROP TABLE IF EXISTS `users`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `referalUserId` int DEFAULT NULL,
    `firstName` varchar(100) DEFAULT NULL,
    `middleName` varchar(100) DEFAULT NULL,
    `lastName` varchar(100) DEFAULT NULL,
    `contactNo` varchar(50) DEFAULT NULL,
    `email` varchar(256) DEFAULT NULL,
    `gender` varchar(45) DEFAULT NULL,
    `password` varchar(100) DEFAULT NULL,
    `imageId` int DEFAULT NULL,
    `isPasswordSet` tinyint DEFAULT NULL,
    `isDisable` tinyint DEFAULT NULL,
    `isVerified` tinyint DEFAULT NULL,
    `isTwoFactorEnable` tinyint DEFAULT NULL,
    `otpAuthUrl` longtext,
    `baseSecret` longtext,
    `isReceiveMail` tinyint DEFAULT '0',
    `isReceiveNotification` tinyint DEFAULT '0',
    `isVerifyProfilePic` tinyint DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `_imageId_idx` (`imageId`),
    KEY `fk_users_users_idx` (`referalUserId`),
    CONSTRAINT `_imageId` FOREIGN KEY (`imageId`) REFERENCES `images` (`id`),
    CONSTRAINT `fk_users_users` FOREIGN KEY (`referalUserId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usertokens`
--
DROP TABLE IF EXISTS `usertokens`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `usertokens` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `token` longtext,
    `isUsed` tinyint DEFAULT NULL,
    `expireAt` datetime DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `_FK_user_id_idx` (`userId`),
    CONSTRAINT `_FK_user_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userviewprofilehistories`
--
DROP TABLE IF EXISTS `userviewprofilehistories`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userviewprofilehistories` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `viewProfileByUserId` int DEFAULT NULL,
    `transactionDate` datetime DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_userViewProfileHistory_users_idx` (`userId`),
    KEY `fk_userViewProfileHistory_viewProfileByusers_idx` (`viewProfileByUserId`),
    CONSTRAINT `fk_userViewProfileHistory_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_userViewProfileHistory_viewProfileByusers` FOREIGN KEY (`viewProfileByUserId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userwallethistory`
--
DROP TABLE IF EXISTS `userwallethistory`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userwallethistory` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userWalletId` int DEFAULT NULL,
    `amount` decimal(10, 2) DEFAULT NULL,
    `isCredit` tinyint DEFAULT NULL,
    `transactionDate` datetime DEFAULT NULL,
    `remark` longtext,
    `paymentId` int DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_userwallethistory_userwallet_idx` (`userWalletId`),
    KEY `fk_userwallethistory_payment_idx` (`paymentId`),
    CONSTRAINT `fk_userwallethistory_payment` FOREIGN KEY (`paymentId`) REFERENCES `payment` (`id`),
    CONSTRAINT `fk_userwallethistory_userwallet` FOREIGN KEY (`userWalletId`) REFERENCES `userwallets` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userwallets`
--
DROP TABLE IF EXISTS `userwallets`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `userwallets` (
    `id` int NOT NULL AUTO_INCREMENT,
    `userId` int DEFAULT NULL,
    `amount` decimal(10, 2) DEFAULT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `fk_userwallet_user_idx` (`userId`),
    CONSTRAINT `fk_userwallet_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `valuetypes`
--
DROP TABLE IF EXISTS `valuetypes`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `valuetypes` (
    `id` int NOT NULL,
    `valueTypeName` varchar(100) DEFAULT NULL,
    `description` longtext,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    `isShowInCustomField` tinyint DEFAULT NULL,
    `isUseForFilter` tinyint DEFAULT NULL,
    `remark` varchar(200) DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `weight`
--
DROP TABLE IF EXISTS `weight`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
  `weight` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` int NOT NULL,
    `isActive` tinyint DEFAULT '1',
    `isDelete` tinyint DEFAULT '0',
    `createdDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` datetime DEFAULT CURRENT_TIMESTAMP,
    `createdBy` int DEFAULT NULL,
    `modifiedBy` int DEFAULT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARSET = utf8mb4;

/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-09 10:41:16
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 192.168.29.101    Database: matrimony
-- ------------------------------------------------------
-- Server version	8.0.25
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `application`
--
LOCK TABLES `application` WRITE;

/*!40000 ALTER TABLE `application` DISABLE KEYS */;

INSERT INTO
  `application`
VALUES
  (
    1,
    'MatrimonyAdmin',
    1,
    0,
    '2022-10-17 14:43:27',
    '2022-10-17 14:43:27'
  ),
  (
    2,
    'MatrimonyAndroid',
    1,
    0,
    '2022-10-17 14:43:27',
    '2022-10-17 14:43:27'
  ),
  (
    3,
    'matrimonyiOS',
    1,
    0,
    '2022-10-17 14:43:27',
    '2022-10-17 14:43:27'
  );

/*!40000 ALTER TABLE `application` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `authproviders`
--
LOCK TABLES `authproviders` WRITE;

/*!40000 ALTER TABLE `authproviders` DISABLE KEYS */;

INSERT INTO
  `authproviders`
VALUES
  (
    1,
    'google',
    NULL,
    NULL,
    NULL,
    'http//google.com',
    'http//google.com',
    'http//google.com',
    'http//google.com',
    'yes',
    NULL,
    1,
    0,
    '2023-03-21 14:50:03',
    '2023-03-21 14:50:03'
  ),
  (
    2,
    'facebook',
    NULL,
    NULL,
    NULL,
    'http//google.com',
    'http//google.com',
    'http//google.com',
    'http//google.com',
    'yes',
    NULL,
    1,
    0,
    '2023-03-21 14:50:03',
    '2023-03-21 14:50:03'
  ),
  (
    3,
    'apple',
    NULL,
    NULL,
    NULL,
    'http//google.com',
    'http//google.com',
    'http//google.com',
    'http//google.com',
    'yes',
    NULL,
    1,
    0,
    '2023-03-21 14:50:03',
    '2023-03-21 14:50:03'
  );

/*!40000 ALTER TABLE `authproviders` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `currencies`
--
LOCK TABLES `currencies` WRITE;

/*!40000 ALTER TABLE `currencies` DISABLE KEYS */;

INSERT INTO
  `currencies`
VALUES
  (
    1,
    'Rupees',
    '₹',
    'INR',
    0,
    1,
    0,
    '2024-01-20 15:54:49',
    '2024-01-20 15:54:49',
    1,
    1
  ),
  (
    2,
    'US Dollar',
    '$',
    'USD',
    1,
    1,
    0,
    '2024-01-20 15:54:49',
    '2024-01-20 15:54:49',
    1,
    1
  ),
  (
    3,
    'Nigerian Naira',
    '₦',
    'NGN',
    0,
    1,
    0,
    '2024-01-20 16:32:00',
    '2024-01-20 16:32:00',
    1,
    1
  ),
  (
    4,
    'South African Rand',
    'R',
    'ZAR',
    0,
    1,
    0,
    '2024-01-20 16:32:00',
    '2024-01-20 16:32:00',
    1,
    1
  );

/*!40000 ALTER TABLE `currencies` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `currencypaymentgateway`
--
LOCK TABLES `currencypaymentgateway` WRITE;

/*!40000 ALTER TABLE `currencypaymentgateway` DISABLE KEYS */;

INSERT INTO
  `currencypaymentgateway`
VALUES
  (
    1,
    1,
    1,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    2,
    2,
    1,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    3,
    3,
    1,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    4,
    4,
    1,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    5,
    1,
    2,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    6,
    2,
    2,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    7,
    3,
    2,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    8,
    4,
    2,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    9,
    1,
    3,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    10,
    3,
    4,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    11,
    4,
    4,
    1,
    0,
    '2024-01-20 18:01:04',
    '2024-01-20 18:01:04',
    1,
    1
  ),
  (
    24,
    1,
    5,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    25,
    2,
    5,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    26,
    3,
    5,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    27,
    4,
    5,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    28,
    1,
    6,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    29,
    2,
    6,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    30,
    3,
    6,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    31,
    4,
    6,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    32,
    1,
    7,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    33,
    2,
    7,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    34,
    3,
    7,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    35,
    4,
    7,
    1,
    0,
    '2024-01-29 10:01:30',
    '2024-01-29 10:01:30',
    NULL,
    NULL
  ),
  (
    37,
    2,
    9,
    1,
    0,
    '2024-02-02 10:26:21',
    '2024-02-02 10:26:21',
    NULL,
    NULL
  ),
  (
    38,
    3,
    10,
    1,
    0,
    '2024-02-02 10:26:21',
    '2024-02-02 10:26:21',
    NULL,
    NULL
  ),
  (
    39,
    2,
    10,
    1,
    0,
    '2024-02-02 10:26:21',
    '2024-02-02 10:26:21',
    NULL,
    NULL
  ),
  (
    40,
    1,
    8,
    1,
    0,
    '2024-02-02 10:26:21',
    '2024-02-02 10:26:21',
    NULL,
    NULL
  ),
  (
    41,
    2,
    8,
    1,
    0,
    '2024-02-02 10:26:21',
    '2024-02-02 10:26:21',
    NULL,
    NULL
  ),
  (
    42,
    3,
    8,
    1,
    0,
    '2024-02-02 10:26:21',
    '2024-02-02 10:26:21',
    NULL,
    NULL
  ),
  (
    43,
    4,
    8,
    1,
    0,
    '2024-02-02 10:26:21',
    '2024-02-02 10:26:21',
    NULL,
    NULL
  );

/*!40000 ALTER TABLE `currencypaymentgateway` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `flaggroup`
--
LOCK TABLES `flaggroup` WRITE;

/*!40000 ALTER TABLE `flaggroup` DISABLE KEYS */;

INSERT INTO
  `flaggroup`
VALUES
  (
    1,
    'General',
    'General',
    NULL,
    1,
    1,
    0,
    '2022-10-20 15:50:28',
    '2022-10-20 15:50:28',
    1,
    1
  ),
  (
    2,
    'Email Credential',
    'Email Credential',
    1,
    1,
    1,
    0,
    '2022-10-20 15:50:28',
    '2022-10-20 15:50:28',
    1,
    1
  ),
  (
    3,
    'Payments',
    'Payments',
    NULL,
    2,
    1,
    1,
    '2023-02-28 14:05:41',
    '2023-02-28 14:05:41',
    1,
    1
  ),
  (
    4,
    'Razorpay',
    'Razorpay',
    3,
    2,
    1,
    1,
    '2023-03-25 14:22:54',
    '2023-03-25 14:22:54',
    1,
    1
  ),
  (
    5,
    'Stripe',
    'Stripe',
    3,
    3,
    1,
    1,
    '2023-03-25 14:22:54',
    '2023-03-25 14:22:54',
    1,
    1
  ),
  (
    6,
    'Agora',
    'Agora',
    NULL,
    4,
    1,
    0,
    '2023-05-03 12:57:53',
    '2023-05-03 12:57:53',
    1,
    1
  ),
  (
    7,
    'Agora Credentials',
    'Agora Credentials',
    6,
    5,
    1,
    0,
    '2023-05-03 12:57:53',
    '2023-05-03 12:57:53',
    1,
    1
  ),
  (
    8,
    'Firebase Credential',
    'Firebase Credential',
    NULL,
    6,
    1,
    0,
    '2023-09-12 11:40:04',
    '2023-09-12 11:40:04',
    1,
    1
  ),
  (
    9,
    'PhonePe',
    'PhonePe',
    3,
    4,
    1,
    1,
    '2023-12-06 17:41:00',
    '2023-12-06 17:41:00',
    1,
    1
  ),
  (
    10,
    'Two Factor Authentication',
    'Two Factor Authentication',
    1,
    2,
    1,
    0,
    '2023-12-13 15:25:14',
    '2023-12-13 15:25:14',
    1,
    1
  ),
  (
    11,
    'Manual Payment',
    'Manual Payment',
    3,
    6,
    1,
    1,
    '2023-12-28 17:44:25',
    '2023-12-28 17:44:25',
    1,
    1
  ),
  (
    12,
    'Flutter Wave',
    'Flutter Wave',
    3,
    5,
    1,
    1,
    '2024-01-01 11:18:36',
    '2024-01-01 11:18:36',
    1,
    1
  ),
  (
    13,
    'Manage Wallet',
    'Manage Wallet',
    NULL,
    7,
    1,
    0,
    '2024-01-20 09:28:50',
    '2024-01-20 09:28:50',
    1,
    1
  ),
  (
    14,
    'Modules',
    'Modules',
    NULL,
    8,
    1,
    0,
    '2024-02-10 11:12:12',
    '2024-02-10 11:12:12',
    NULL,
    NULL
  );

/*!40000 ALTER TABLE `flaggroup` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `pages`
--
LOCK TABLES `pages` WRITE;

/*!40000 ALTER TABLE `pages` DISABLE KEYS */;

INSERT INTO
  `pages`
VALUES
  (
    1,
    '/admin',
    'Dashboard',
    'link',
    1,
    NULL,
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 17:30:57',
    '2024-01-15 17:30:57',
    1,
    1
  ),
  (
    2,
    '',
    'Users',
    'sub',
    1,
    'Users',
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 17:30:57',
    '2024-01-15 17:30:57',
    1,
    1
  ),
  (
    3,
    '/admin/appuser',
    'App Users',
    'link',
    1,
    'Users',
    2,
    NULL,
    1,
    0,
    '2024-01-15 17:30:57',
    '2024-01-15 17:30:57',
    1,
    1
  ),
  (
    4,
    '/admin/blockuser',
    'Block Users',
    'link',
    1,
    'Users',
    2,
    NULL,
    1,
    0,
    '2024-01-15 17:32:18',
    '2024-01-15 17:32:18',
    1,
    1
  ),
  (
    5,
    '/admin/users',
    'Admin Users',
    'link',
    1,
    'Users',
    2,
    NULL,
    1,
    0,
    '2024-01-15 17:32:18',
    '2024-01-15 17:32:18',
    1,
    1
  ),
  (
    6,
    NULL,
    'Packages',
    'sub',
    1,
    'Packages',
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 17:33:39',
    '2024-01-15 17:33:39',
    1,
    1
  ),
  (
    7,
    '/admin/premiumaccount',
    'Premium Account',
    'link',
    1,
    'Packages',
    6,
    NULL,
    1,
    0,
    '2024-01-15 17:36:56',
    '2024-01-15 17:36:56',
    1,
    1
  ),
  (
    8,
    '/admin/premiumfacility',
    'Premium Facility',
    'link',
    1,
    'Packages',
    6,
    NULL,
    1,
    0,
    '2024-01-15 17:39:30',
    '2024-01-15 17:39:30',
    1,
    1
  ),
  (
    9,
    '/admin/timeduration',
    'Time Duration',
    'link',
    1,
    'Packages',
    6,
    NULL,
    1,
    0,
    '2024-01-15 17:39:30',
    '2024-01-15 17:39:30',
    1,
    1
  ),
  (
    10,
    NULL,
    'Master Entry',
    'sub',
    1,
    'Master Entry',
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 17:40:20',
    '2024-01-15 17:40:20',
    1,
    1
  ),
  (
    11,
    '/admin/document-type',
    'Document Type',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    12,
    '/admin/religion',
    'Religion',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    13,
    '/admin/community',
    'Community',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    14,
    '/admin/subcommunity',
    'Sub Community',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    15,
    '/admin/maritalstatus',
    'Marital Status',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    16,
    '/admin/employment',
    'Employment',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    17,
    '/admin/occupation',
    'Occupation',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    18,
    '/admin/education',
    'Education',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    19,
    '/admin/diet',
    'Diet',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    20,
    '/admin/height',
    'Height',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    21,
    '/admin/income',
    'Annual income',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-15 17:47:35',
    '2024-01-15 17:47:35',
    1,
    1
  ),
  (
    22,
    NULL,
    'Reports',
    'sub',
    1,
    'Reports',
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 17:58:47',
    '2024-01-15 17:58:47',
    1,
    1
  ),
  (
    23,
    '/admin/requestSendReport',
    'Proposal Request Send',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    24,
    '/admin/requestAcceptReport',
    'Proposal Request Accept',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    25,
    '/admin/requestRejectReport',
    'Proposal Request Reject',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    26,
    '/admin/requestReceiveUser',
    'Proposal Receive User',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    27,
    '/admin/requestRejectUser',
    'Proposal Reject User',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    28,
    '/admin/requestSendUser',
    'Proposal Send User',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    29,
    '/admin/requestsend',
    'Top Request Send',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    30,
    '/admin/requestreceive',
    'Top Request Receive',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    31,
    '/admin/appuser',
    'Application User',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    32,
    '/admin/premiumAppUser',
    'Premium App User',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    33,
    '/admin/systemBlockedUser',
    'System Blocked User',
    'link',
    1,
    'Reports',
    22,
    NULL,
    1,
    0,
    '2024-01-15 18:04:20',
    '2024-01-15 18:04:20',
    1,
    1
  ),
  (
    34,
    '/admin/user-packages',
    'Customer Packages',
    'link',
    1,
    NULL,
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 18:08:26',
    '2024-01-15 18:08:26',
    1,
    1
  ),
  (
    35,
    '/admin/region',
    'Region',
    'link',
    1,
    NULL,
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 18:08:26',
    '2024-01-15 18:08:26',
    1,
    1
  ),
  (
    36,
    '/admin/custom-notification',
    'Custom Notification',
    'link',
    1,
    NULL,
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 18:08:26',
    '2024-01-15 18:08:26',
    1,
    1
  ),
  (
    37,
    '/admin/FAQs',
    'FAQs',
    'link',
    1,
    NULL,
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 18:08:26',
    '2024-01-15 18:08:26',
    1,
    1
  ),
  (
    38,
    '/admin/successStory',
    'Success Story',
    'link',
    1,
    NULL,
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 18:08:26',
    '2024-01-15 18:08:26',
    1,
    1
  ),
  (
    39,
    '/admin/feedback',
    'Feedback',
    'link',
    1,
    NULL,
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 18:08:26',
    '2024-01-15 18:08:26',
    1,
    1
  ),
  (
    40,
    '/admin/setting',
    'Setting',
    'link',
    1,
    NULL,
    NULL,
    NULL,
    1,
    0,
    '2024-01-15 18:08:26',
    '2024-01-15 18:08:26',
    1,
    1
  ),
  (
    41,
    '/admin/currency',
    'Currency',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-27 12:00:38',
    '2024-01-27 12:00:38',
    1,
    1
  ),
  (
    42,
    '/admin/paymentGateway',
    'Payment Gateway',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-01-27 12:00:38',
    '2024-01-27 12:00:38',
    1,
    1
  ),
  (
    43,
    '/admin/profile-for',
    'Profile For',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-02-02 15:10:47',
    '2024-02-02 15:10:47',
    NULL,
    NULL
  ),
  (
    44,
    '/admin/weight',
    'Weight',
    'link',
    1,
    'Master Entry',
    10,
    NULL,
    1,
    0,
    '2024-02-02 15:10:47',
    '2024-02-02 15:10:47',
    NULL,
    NULL
  );

/*!40000 ALTER TABLE `pages` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `paymentgateway`
--
LOCK TABLES `paymentgateway` WRITE;

/*!40000 ALTER TABLE `paymentgateway` DISABLE KEYS */;

INSERT INTO
  `paymentgateway`
VALUES
  (
    1,
    'Razorpay',
    '{\"apiKey\": \"YOUR-API-KEY\", \"secretKey\": \"YOUR-SECRET-KEY\"}',
    1,
    1,
    1,
    NULL,
    1,
    0,
    '2024-01-20 17:48:02',
    '2024-01-20 17:48:02',
    1,
    1,
    NULL
  ),
  (
    2,
    'Stripe',
    '{\"secretKey\": \"YOUR-SECRET-KEY\", \"publishableKey\": \"YOUR-PUBLISHABLE-KEY\"}',
    1,
    1,
    1,
    NULL,
    1,
    0,
    '2024-01-20 17:48:02',
    '2024-01-20 17:48:02',
    1,
    1,
    NULL
  ),
  (
    3,
    'PhonePe',
    '{\"saltKey\": \"YOUR-SALT-KEY\", \"saltIndex\": \"1\", \"merchantId\": \"YOUR-MERCHANT-ID\", \"apiEndPoint\": \"/pg/v1/pay\", \"redirectMode\": \"REDIRECT\", \"environmentValue\": \"SANDBOX\"}',
    1,
    1,
    1,
    NULL,
    1,
    0,
    '2024-01-20 17:48:02',
    '2024-01-20 17:48:02',
    1,
    1,
    NULL
  ),
  (
    4,
    'FlutterWave',
    '{\"publicKey\": \"YOUR-PUBLIC-KEY\", \"secretKey\": \"YOUR-SECRET-KEY\", \"merchantId\": \"YOUR-MERCHANT-ID\", \"encryptionKey\": \"YOUR-ENCRYPTION-KEY\"}',
    1,
    1,
    1,
    NULL,
    1,
    0,
    '2024-01-20 17:48:02',
    '2024-01-20 17:48:02',
    1,
    1,
    NULL
  ),
  (
    5,
    'AppleInAppPurchase',
    NULL,
    0,
    1,
    NULL,
    1,
    1,
    0,
    '2024-01-27 18:04:50',
    '2024-01-27 18:04:50',
    NULL,
    NULL,
    NULL
  ),
  (
    6,
    'GoogleInAppPurchase',
    NULL,
    0,
    1,
    1,
    NULL,
    1,
    0,
    '2024-01-27 18:04:50',
    '2024-01-27 18:04:50',
    NULL,
    NULL,
    NULL
  ),
  (
    7,
    'Wallet',
    NULL,
    NULL,
    1,
    1,
    1,
    1,
    0,
    '2024-01-27 18:04:50',
    '2024-01-27 18:04:50',
    NULL,
    NULL,
    NULL
  ),
  (
    8,
    'ManualPayment',
    NULL,
    NULL,
    1,
    1,
    1,
    1,
    0,
    '2024-01-31 14:26:16',
    '2024-01-31 14:26:16',
    NULL,
    NULL,
    '<p>Step 1 - Transfer payments</p><p>Step 2 - Send the amount using the following</p><ul><li>Bank Details</li><li class=\"ql-indent-1\">[Your Bank Account Number] e.g.: 8515XX9587</li><li class=\"ql-indent-1\">[IFSC CODE] e.g.: BARBOXXXX</li></ul><p><br></p><p>&nbsp;&nbsp;&nbsp;&nbsp;OR</p><p><br></p><ul><li>[Your UPI ID] e.g: example@bank</li></ul><p><br></p><p>&nbsp;&nbsp;&nbsp;&nbsp;OR</p><p><br></p><ul><li><img src=\"data:image/png;base64,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\"></li></ul><p><br></p><p>Please send payment screen shot to Email([Your Email Address]) OR WhatsApp([Your WhatsApp No])</p><p><br></p><p>Step 3 - Once you are done with the above steps click on the Request button</p><p>Step 4 - Your account will be activated within 24 hours</p><p><br></p><p>[The above content is dummy. Look for the change in Admin Panel]</p>'
  ),
  (
    9,
    'Paypal',
    '{\"clientid\": \"YOUR-CLIENT-ID\", \"secretkey\": \"YOUR-SECRET-KEY\"}',
    1,
    1,
    1,
    NULL,
    1,
    0,
    '2024-02-02 10:16:16',
    '2024-02-02 10:16:16',
    NULL,
    NULL,
    NULL
  ),
  (
    10,
    'Paystack',
    '{\"publickey\": \"YOUR-API-KEY\", \"secretkey\": \"YOUR-SECRET-KEY\"}',
    1,
    1,
    1,
    NULL,
    1,
    0,
    '2024-02-02 10:16:16',
    '2024-02-02 10:16:16',
    NULL,
    NULL,
    NULL
  );

/*!40000 ALTER TABLE `paymentgateway` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `premiumfacility`
--
LOCK TABLES `premiumfacility` WRITE;

/*!40000 ALTER TABLE `premiumfacility` DISABLE KEYS */;

INSERT INTO
  `premiumfacility`
VALUES
  (
    1,
    'Video Call',
    1,
    0,
    '2023-03-11 11:32:45',
    '2023-03-11 11:32:45',
    5,
    5
  ),
  (
    3,
    'Chat',
    1,
    0,
    '2023-03-11 13:00:02',
    '2023-03-11 13:00:02',
    5,
    5
  ),
  (
    4,
    'Request for Contact No',
    1,
    0,
    '2023-03-11 16:24:37',
    '2023-03-11 16:24:37',
    5,
    5
  ),
  (
    5,
    'Voice Call',
    1,
    0,
    '2023-03-11 16:24:48',
    '2023-03-11 16:24:48',
    5,
    5
  ),
  (
    6,
    'Request for email',
    1,
    0,
    '2023-03-11 16:25:22',
    '2023-03-11 16:25:22',
    5,
    5
  );

/*!40000 ALTER TABLE `premiumfacility` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `questioncategories`
--
LOCK TABLES `questioncategories` WRITE;

/*!40000 ALTER TABLE `questioncategories` DISABLE KEYS */;

INSERT INTO
  `questioncategories`
VALUES
  (
    1,
    'Registration',
    NULL,
    1,
    0,
    '2023-03-31 14:37:20',
    '2023-03-31 14:37:20',
    5,
    5
  ),
  (
    2,
    'Profiles',
    NULL,
    1,
    1,
    '2023-04-01 16:24:15',
    '2023-04-01 16:24:15',
    5,
    5
  ),
  (
    4,
    'Profile',
    NULL,
    1,
    0,
    '2023-04-03 12:01:30',
    '2023-04-03 12:01:30',
    5,
    5
  ),
  (
    5,
    'testings',
    NULL,
    0,
    1,
    '2023-04-03 12:53:20',
    '2023-04-03 12:53:20',
    5,
    5
  ),
  (
    9,
    'tests',
    NULL,
    1,
    0,
    '2023-04-06 14:54:21',
    '2023-04-06 14:54:21',
    5,
    5
  ),
  (
    10,
    'test',
    NULL,
    1,
    1,
    '2023-04-06 15:00:07',
    '2023-04-06 15:00:07',
    5,
    5
  ),
  (
    11,
    'Dummy questions',
    NULL,
    1,
    1,
    '2023-11-08 10:00:22',
    '2023-11-08 10:00:22',
    77,
    77
  );

/*!40000 ALTER TABLE `questioncategories` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `roles`
--
LOCK TABLES `roles` WRITE;

/*!40000 ALTER TABLE `roles` DISABLE KEYS */;

INSERT INTO
  `roles`
VALUES
  (
    1,
    'Admin',
    NULL,
    1,
    0,
    '2022-10-11 10:23:29',
    '2022-10-11 10:23:29'
  ),
  (
    2,
    'User',
    NULL,
    1,
    0,
    '2022-10-11 10:23:29',
    '2022-10-11 10:23:29'
  ),
  (
    3,
    'Employee',
    NULL,
    1,
    0,
    '2024-01-16 10:11:47',
    '2024-01-16 10:11:47'
  );

/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `systemflags`
--
LOCK TABLES `systemflags` WRITE;

/*!40000 ALTER TABLE `systemflags` DISABLE KEYS */;

INSERT INTO
  `systemflags`
VALUES
  (
    1,
    2,
    6,
    'noReplyEmail',
    'Sender Email Id',
    'Your Sender Email Id',
    'Your Sender Email Id',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2022-10-20 16:05:23',
    '2022-10-20 16:05:23',
    1,
    1
  ),
  (
    2,
    2,
    8,
    'noReplyPassword',
    'Sender Password',
    'Your Sender Password',
    'Your Sender Password',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2022-10-20 16:05:23',
    '2022-10-20 16:05:23',
    1,
    1
  ),
  (
    3,
    2,
    1,
    'noReplyName',
    'Sender Name',
    'Your Sender Name',
    'Your Sender Name',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2022-10-20 16:05:23',
    '2022-10-20 16:05:23',
    1,
    1
  ),
  (
    4,
    2,
    1,
    'noReplyHostName',
    'Host Name',
    'Your Sender Host Name',
    'Your Sender Host Name',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2022-10-20 16:05:23',
    '2022-10-20 16:05:23',
    1,
    1
  ),
  (
    5,
    2,
    2,
    'noReplyPort',
    'Port',
    'Your Sender PORT',
    'Your Sender PORT',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2022-10-20 16:05:23',
    '2022-10-20 16:05:23',
    1,
    1
  ),
  (
    6,
    2,
    7,
    'noReplySecure',
    'Enable SSL',
    '1',
    '1',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2022-10-20 16:05:23',
    '2022-10-20 16:05:23',
    1,
    1
  ),
  (
    7,
    1,
    4,
    'welcomeTextScreen1',
    'Welcome Text Screen 1',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    NULL,
    NULL,
    NULL,
    1,
    0,
    0,
    '2022-10-21 10:04:45',
    '2022-10-21 10:04:45',
    1,
    1
  ),
  (
    8,
    1,
    4,
    'welcomeTextScreen2',
    'Welcome Text Screen 2',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    NULL,
    NULL,
    NULL,
    1,
    0,
    0,
    '2023-02-27 17:53:06',
    '2023-02-27 17:53:06',
    1,
    1
  ),
  (
    9,
    1,
    4,
    'welcomeTextScreen3',
    'Welcome Text Screen 3',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    NULL,
    NULL,
    NULL,
    1,
    0,
    0,
    '2023-02-27 17:53:06',
    '2023-02-27 17:53:06',
    1,
    1
  ),
  (
    10,
    1,
    3,
    'dateFormat',
    'Date Format',
    'dd MMM, yyyy',
    'dd/MM/yyyy',
    'dd/MM/yyyy;MM/dd/yyyy;dd MMM, yyyy',
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-02-27 18:02:06',
    '2023-02-27 18:02:06',
    1,
    1
  ),
  (
    11,
    3,
    3,
    'purchaseType',
    'Purchase Type',
    'wallet',
    'in-app Purchase',
    'in-app Purchase;wallet',
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-03-10 12:52:04',
    '2023-03-10 12:52:04',
    1,
    1
  ),
  (
    12,
    3,
    10,
    'paymentType',
    'Payment Type',
    'Razorpay;Stripe;Manual Payment',
    'Razorpay',
    'Razorpay;Stripe;PhonePe;Flutter Wave;Manual Payment',
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-03-10 12:52:04',
    '2023-03-10 12:52:04',
    1,
    1
  ),
  (
    13,
    4,
    8,
    'razorpayAPIKey',
    'Razorpay API Key',
    'Razorpay API Key',
    'Razorpay API Key',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-03-25 14:28:25',
    '2023-03-25 14:28:25',
    1,
    1
  ),
  (
    14,
    4,
    8,
    'razorpaySecretKey',
    'Razorpay Secret Key',
    'Razorpay Secret Key',
    'Razorpay Secret Key',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-03-25 14:28:25',
    '2023-03-25 14:28:25',
    1,
    1
  ),
  (
    15,
    5,
    8,
    'stripeSecretKey',
    'Stripe Secret Key',
    'Stripe Secret Key',
    'Stripe Secret Key',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-03-25 14:33:48',
    '2023-03-25 14:33:48',
    1,
    1
  ),
  (
    16,
    5,
    8,
    'stripePublishableKey',
    'Stripe Publishable Key',
    'Stripe Publishable Key',
    'Stripe Publishable Key',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-03-25 14:33:48',
    '2023-03-25 14:33:48',
    1,
    1
  ),
  (
    17,
    7,
    8,
    'agoraAppId',
    'Agora App Id',
    'Agora App Id',
    'Agora App Id',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-05-03 14:02:22',
    '2023-05-03 14:02:22',
    1,
    1
  ),
  (
    18,
    7,
    8,
    'agoraCerificate',
    'Agora Certificate',
    'Agora Certificate',
    'Agora Certificate',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-05-03 14:02:22',
    '2023-05-03 14:02:22',
    1,
    1
  ),
  (
    19,
    8,
    8,
    'firebaseServerKey',
    'Server Key',
    'FireBase Server Key',
    'FireBase Server Key',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-05-03 14:02:22',
    '2023-05-03 14:02:22',
    1,
    1
  ),
  (
    20,
    8,
    7,
    'enableFirebasePhoneAuthentication',
    'Enable Firebase Phone Authentication',
    '1',
    '1',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-06 10:57:38',
    '2023-12-06 10:57:38',
    1,
    1
  ),
  (
    21,
    1,
    4,
    'privacyPolicy',
    'Privacy Policy',
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-06 18:08:54',
    '2023-12-06 18:08:54',
    1,
    1
  ),
  (
    22,
    1,
    4,
    'termsCondition',
    'Terms Condition',
    '<p><span style=\"color: rgb(13, 13, 13);\">Welcome to our Matrimony App! By using our services, you agree to the following terms and conditions. Users must be of legal age for marriage to participate. It is the responsibility of users to provide accurate information, and any false data may result in account termination. We prioritize the privacy of our users, and all information shared is subject to our Privacy Policy. Respectful communication is crucial, and any offensive behavior may lead to account suspension. While we facilitate connections, we cannot guarantee success, and users are encouraged to independently verify details. Account security is the user\"s responsibility, and any suspicious activity should be reported promptly. We reserve the right to terminate accounts violating these terms without prior notice. Thank you for choosing our platform for your matrimonial journey!</span></p>',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-06 18:08:54',
    '2023-12-06 18:08:54',
    1,
    1
  ),
  (
    23,
    1,
    4,
    'refundPolicy',
    'Refund Policy',
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-06 18:08:54',
    '2023-12-06 18:08:54',
    1,
    1
  ),
  (
    24,
    1,
    9,
    'watermarkImage',
    'Watermark Image',
    'content/systemflag/watermarkImage/watermarkImage.jpeg',
    NULL,
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-08 17:18:18',
    '2023-12-08 17:18:18',
    1,
    1
  ),
  (
    25,
    10,
    1,
    'twoFactorLabel',
    'Two Factor Authenticator Label',
    'Matrimony',
    'Matrimony',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-13 15:28:26',
    '2023-12-13 15:28:26',
    1,
    1
  ),
  (
    26,
    10,
    1,
    'twoFactorIssuer',
    'Two Factor Authenticator Issues Name',
    'Admin',
    'Admin',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-13 15:28:26',
    '2023-12-13 15:28:26',
    1,
    1
  ),
  (
    27,
    9,
    8,
    'phonePeMerchantId',
    'PhonePe MerchantId',
    'PhonePe MerchantId',
    'PhonePe MerchantId',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-19 11:30:15',
    '2023-12-19 11:30:15',
    1,
    1
  ),
  (
    28,
    9,
    3,
    'phonePeRedirectMode',
    'PhonePe Redirect Mode',
    'REDIRECT',
    'REDIRECT',
    'REDIRECT;POST',
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-19 11:30:15',
    '2023-12-19 11:30:15',
    1,
    1
  ),
  (
    29,
    9,
    8,
    'phonePeSaltKey',
    'PhonePe SaltKey',
    'PhonePe SaltKey',
    'PhonePe SaltKey',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-19 11:30:15',
    '2023-12-19 11:30:15',
    1,
    1
  ),
  (
    30,
    9,
    8,
    'phonePeSaltIndex',
    'PhonePe SaltIndex',
    '1',
    '1',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-19 11:30:15',
    '2023-12-19 11:30:15',
    1,
    1
  ),
  (
    31,
    9,
    3,
    'phonePeEnvironmentValue',
    'PhonePe Environment Value',
    'SANDBOX',
    'SANDBOX',
    'SANDBOX;PRODUCTION',
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-19 11:30:15',
    '2023-12-19 11:30:15',
    1,
    1
  ),
  (
    32,
    9,
    8,
    'phonePeAPIendPoint',
    'PhonePe API End Point',
    '/pg/v1/pay',
    '/pg/v1/pay',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-19 11:30:15',
    '2023-12-19 11:30:15',
    1,
    1
  ),
  (
    33,
    11,
    4,
    'manualPaymentDescription',
    'Manual Payment Description',
    '<p>Step 1 - Transfer payments</p><p>Step 2 - Send the amount using the following</p><ul><li>Bank Details</li><li class=\"ql-indent-1\">[Your Bank Account Number] e.g.: 8515XX9587</li><li class=\"ql-indent-1\">[IFSC CODE] e.g.: BARBOXXXX</li></ul><p><br></p><p>OR</p><p><br></p><ul><li>[Your UPI ID] e.g: example@bank</li></ul><p><br></p><p>OR</p><p><br></p><ul><li><img src=\"data:image/png;base64,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\"></li></ul><p><br></p><p>Please send payment screen shot to Email([Your Email Address]) OR WhatsApp([Your WhatsApp No])</p><p><br></p><p>Step 3 - Once you are done with the above steps click on the Request button</p><p>Step 4 - Your account will be activated within 24 hours</p><p><br></p><p>[The above content is dummy. Look for the change in Admin Panel]</p>',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-29 09:40:59',
    '2023-12-29 09:40:59',
    1,
    1
  ),
  (
    34,
    1,
    7,
    'isProfilePicRequired',
    'Is Profile Picture Required',
    '0',
    '0',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-29 09:42:54',
    '2023-12-29 09:42:54',
    1,
    1
  ),
  (
    35,
    11,
    1,
    'manualPaymentDisplayName',
    'Manual Payment Display Name',
    'Offline Payment Instruction',
    'Offline Payment Instruction',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2023-12-29 16:23:20',
    '2023-12-29 16:23:20',
    1,
    1
  ),
  (
    36,
    12,
    8,
    'flutterWaveMerchantId',
    'Flutter Wave Merchant Id',
    'Flutter Wave Merchant Id',
    'Flutter Wave Merchant Id',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2024-01-01 11:24:00',
    '2024-01-01 11:24:00',
    1,
    1
  ),
  (
    37,
    12,
    8,
    'flutterWavePublicKey',
    'Flutter Wave Public Key',
    'Flutter Wave Public Key',
    'Flutter Wave Public Key',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2024-01-01 11:24:00',
    '2024-01-01 11:24:00',
    1,
    1
  ),
  (
    38,
    12,
    8,
    'flutterWaveSecretKey',
    'Flutter Wave Secret Key',
    'Flutter Wave Secret Key',
    'Flutter Wave Secret Key',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2024-01-01 11:24:00',
    '2024-01-01 11:24:00',
    1,
    1
  ),
  (
    39,
    12,
    8,
    'flutterWaveEncryptionKey',
    'Flutter Wave Encryption Key',
    'Flutter Wave Encryption Key',
    'Flutter Wave Encryption Key',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2024-01-01 11:24:00',
    '2024-01-01 11:24:00',
    1,
    1
  ),
  (
    40,
    1,
    4,
    'disclaimer',
    'Disclaimer',
    '<p><span style=\"color: rgb(13, 13, 13);\">Our matrimonial platform serves as a medium to connect individuals seeking life partners. While we strive to facilitate genuine connections, we do not guarantee the accuracy of user-provided information or the success of any match. Users are encouraged to exercise caution, conduct due diligence, and make informed decisions before committing to any relationship. We are not responsible for the outcomes of connections made through our platform.</span></p>',
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2024-01-09 13:56:22',
    '2024-01-09 13:56:22',
    1,
    1
  ),
  (
    41,
    13,
    7,
    'isEnableWallet',
    'Enable Wallet',
    '1',
    '0',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2024-01-19 17:02:20',
    '2024-01-19 17:02:20',
    1,
    1
  ),
  (
    42,
    13,
    7,
    'isEnableReward',
    'Enable Reward & Earn',
    '0',
    '0',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2024-01-20 09:35:59',
    '2024-01-20 09:35:59',
    1,
    1
  ),
  (
    43,
    13,
    2,
    'rewardAmount',
    'Reward Amount',
    '20',
    '0',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2024-01-20 09:35:59',
    '2024-01-20 09:35:59',
    1,
    1
  ),
  (
    44,
    13,
    4,
    'rewardTermsCondition',
    'Reward Terms & Condition',
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>',
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2024-01-20 09:35:59',
    '2024-01-20 09:35:59',
    1,
    1
  ),
  (
    45,
    14,
    7,
    'isEnableCustomFields',
    'Enable CustomFields',
    '1',
    '1',
    NULL,
    NULL,
    NULL,
    1,
    1,
    0,
    '2024-02-10 11:18:29',
    '2024-02-10 11:18:29',
    NULL,
    NULL
  ),
  (
    46,
    1,
    7,
    'isUserProfilePicApprove',
    'User ProfilePic Approved',
    '1',
    '1',
    NULL,
    'User Profile Pic Approved from admin',
    NULL,
    1,
    1,
    0,
    '2024-02-24 10:07:05',
    '2024-02-24 10:07:05',
    NULL,
    NULL
  );

/*!40000 ALTER TABLE `systemflags` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Dumping data for table `valuetypes`
--
LOCK TABLES `valuetypes` WRITE;

/*!40000 ALTER TABLE `valuetypes` DISABLE KEYS */;

INSERT INTO
  `valuetypes`
VALUES
  (
    1,
    'Text',
    'Text Value',
    1,
    0,
    '2022-10-20 15:44:06',
    '2022-10-20 15:44:06',
    NULL,
    NULL,
    1,
    0,
    'If you enable this flag, the application may cause malware crash'
  ),
  (
    2,
    'Number',
    'Only Number',
    1,
    0,
    '2022-10-20 15:44:06',
    '2022-10-20 15:44:06',
    NULL,
    NULL,
    1,
    0,
    'If you enable this flag, the application may cause malware crash'
  ),
  (
    3,
    'DropDownList',
    'DropDown List',
    1,
    0,
    '2022-10-20 15:44:06',
    '2022-10-20 15:44:06',
    NULL,
    NULL,
    1,
    1,
    NULL
  ),
  (
    4,
    'Html',
    'Html Text',
    1,
    0,
    '2022-10-20 15:44:06',
    '2022-10-20 15:44:06',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    5,
    'Disabled',
    'Disabled Text box',
    1,
    0,
    '2022-10-20 15:44:06',
    '2022-10-20 15:44:06',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    6,
    'Email',
    'Email Id',
    1,
    0,
    '2022-10-20 15:44:06',
    '2022-10-20 15:44:06',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    7,
    'Boolean',
    'Boolean Value',
    1,
    0,
    '2022-10-20 15:44:06',
    '2022-10-20 15:44:06',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    8,
    'Password',
    'Password',
    1,
    0,
    '2022-10-20 15:44:06',
    '2022-10-20 15:44:06',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    9,
    'Image',
    'Image Upload',
    1,
    0,
    '2023-12-08 17:17:19',
    '2023-12-08 17:17:19',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  ),
  (
    10,
    'MultipleDropDownList',
    'MultipleDropDownList',
    1,
    0,
    '2023-12-28 17:42:42',
    '2023-12-28 17:42:42',
    NULL,
    NULL,
    1,
    1,
    NULL
  ),
  (
    11,
    'LongText',
    'LongText',
    1,
    0,
    '2023-12-28 17:42:42',
    '2023-12-28 17:42:42',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
  );

/*!40000 ALTER TABLE `valuetypes` ENABLE KEYS */;

UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-09 10:50:04
LOCK TABLES `users` WRITE;

/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO
  users (
    id,
    referalUserId,
    firstName,
    middleName,
    lastName,
    contactNo,
    email,
    gender,
    password,
    imageId,
    isPasswordSet,
    isDisable,
    isVerified,
    isTwoFactorEnable,
    otpAuthUrl,
    baseSecret,
    isReceiveMail,
    isReceiveNotification,
    isVerifyProfilePic,
    isActive,
    isDelete,
    createdDate,
    modifiedDate
  )
VALUES
  (
    1,
    NULL,
    'admin',
    'a',
    'admin_matrimony',
    '9727839549',
    'admin@admin.com',
    'Male',
    '$2a$10$TLInofvEZbZ92eoTkXS56uYEdl9W5L/683uVdGsN7PivwPCrIMlX2',
    NULL,
    NULL,
    0,
    NULL,
    1,
    NULL,
    NULL,
    1,
    1,
    1,
    1,
    0,
    '2023-03-03 11:34:56',
    '2023-03-03 11:34:56'
  ),
  (
    2,
    NULL,
    'demo',
    'a',
    'demo',
    '9586958965',
    'admin@demo.com',
    'Male',
    '$2a$10$TLInofvEZbZ92eoTkXS56uYEdl9W5L/683uVdGsN7PivwPCrIMlX2',
    NULL,
    NULL,
    0,
    NULL,
    1,
    NULL,
    NULL,
    1,
    1,
    1,
    1,
    0,
    '2023-03-03 11:34:56',
    '2023-03-03 11:34:56'
  );

/*!40000 ALTER TABLE `users` ENABLE KEYS */;

UNLOCK TABLES;

LOCK TABLES `userroles` WRITE;

/*!40000 ALTER TABLE `userroles` DISABLE KEYS */;

INSERT INTO
  `userroles`
VALUES
  (1, 1, 1);

INSERT INTO
  `userroles`
VALUES
  (2, 1, 2);

/*!40000 ALTER TABLE `userroles` ENABLE KEYS */;

UNLOCK TABLES;

INSERT INTO
  `userpages` (
    `id`,
    `userId`,
    `pageId`,
    `isReadPermission`,
    `isAddPermission`,
    `isDeletePermission`,
    `isEditPermission`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    2,
    2,
    1,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    3,
    2,
    40,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    4,
    2,
    44,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    5,
    2,
    3,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    6,
    2,
    4,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    7,
    2,
    5,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    8,
    2,
    7,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    9,
    2,
    8,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    10,
    2,
    9,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    11,
    2,
    11,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    12,
    2,
    12,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    13,
    2,
    13,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    14,
    2,
    14,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    15,
    2,
    16,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    16,
    2,
    17,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    17,
    2,
    18,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    18,
    2,
    20,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    19,
    2,
    21,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    20,
    2,
    35,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    21,
    2,
    36,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    22,
    2,
    37,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    23,
    2,
    41,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    25,
    2,
    23,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    26,
    2,
    24,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    27,
    2,
    25,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    28,
    2,
    26,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    29,
    2,
    27,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    30,
    2,
    28,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    31,
    2,
    29,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    32,
    2,
    30,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    33,
    2,
    31,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    34,
    2,
    32,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    35,
    2,
    33,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    36,
    2,
    34,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    37,
    2,
    38,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    38,
    2,
    39,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  ),
  (
    39,
    2,
    42,
    1,
    0,
    0,
    0,
    1,
    0,
    '2024-08-20 12:45:29',
    '2024-08-20 12:45:29',
    77,
    NULL
  );

ALTER TABLE `userproposals`
ADD COLUMN `hascancelled` TINYINT NULL DEFAULT '0' AFTER `modifiedBy`;

INSERT INTO
  `timeduration` (
    `id`,
    `value`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '1',
    '6',
    '1',
    '0',
    '2023-03-11 12:35:23',
    '2023-03-11 12:35:23',
    '1',
    '1'
  );

INSERT INTO
  `timeduration` (
    `id`,
    `value`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '2',
    '3',
    '1',
    '0',
    '2023-03-11 12:59:44',
    '2023-03-11 12:59:44',
    '1',
    '1'
  );

INSERT INTO
  `timeduration` (
    `id`,
    `value`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '3',
    '12',
    '1',
    '0',
    '2023-03-11 16:27:50',
    '2023-03-11 16:27:50',
    '1',
    '1'
  );

ALTER TABLE `customfields`
ADD COLUMN `textLength` INT NULL DEFAULT NULL AFTER `isRequired`;

ALTER TABLE `userpersonaldetail`
ADD COLUMN `memberid` VARCHAR(45) NULL AFTER `modifiedBy`,
ADD UNIQUE INDEX `memberid_UNIQUE` (`memberid` ASC);

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '51',
    '1',
    '4',
    'copyrightText',
    'CopyRight Text',
    '(©) Copyright 2024 Matrimony. All Rights Reserved.',
    '(©) Copyright 2024 Matrimony. All Rights Reserved.',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

INSERT INTO
  `flaggroup` (
    `id`,
    `flagGroupName`,
    `detail`,
    `parentFlagGroupId`,
    `displayOrder`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '15',
    'App Links',
    'App Links',
    '1',
    '3',
    '1',
    '0',
    '2023-12-13 15:25:14',
    '2023-12-13 15:25:14',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '49',
    '15',
    '1',
    'appstore',
    'App Store',
    'https://www.apple.com/in/app-store/',
    'https://www.apple.com/in/app-store/',
    '1',
    '1',
    '0',
    '2023-12-13 15:28:26',
    '2023-12-13 15:28:26',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '50',
    '15',
    '1',
    'playstore',
    'Play Store',
    'https://www.apple.com/in/app-store/',
    'https://www.apple.com/in/app-store/',
    '1',
    '1',
    '0',
    '2023-12-13 15:28:26',
    '2023-12-13 15:28:26',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '52',
    '1',
    '4',
    'facebookLink',
    'Facebook Link',
    'https://www.facebook.com/',
    'https://www.facebook.com/',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '53',
    '1',
    '4',
    'instagramLink',
    'Instagram Link',
    'https://www.instagram.com/',
    'https://www.instagram.com/',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '54',
    '1',
    '4',
    'twitterLink',
    'Twitter Link',
    'https://x.com/?lang=en',
    'https://x.com/?lang=en',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '55',
    '1',
    '4',
    'linkedinLink',
    'Linkedin Link',
    'https://in.linkedin.com/',
    'https://in.linkedin.com/',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '56',
    '1',
    '4',
    'threadsLink',
    'Threads Link',
    'https://www.threads.net/login/',
    'https://www.threads.net/login/',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

INSERT INTO
  `flaggroup` (
    `id`,
    `flagGroupName`,
    `detail`,
    `parentFlagGroupId`,
    `displayOrder`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '16',
    'Social Links',
    'Social Links',
    '1',
    '3',
    '1',
    '0',
    '2023-12-13 15:25:14',
    '2023-12-13 15:25:14',
    '1',
    '1'
  );

UPDATE `systemflags`
SET
  `flagGroupId` = '1',
  `valueTypeId` = '4'
WHERE
  (`id` = '51');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1'
WHERE
  (`id` = '52');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1'
WHERE
  (`id` = '53');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1'
WHERE
  (`id` = '54');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1'
WHERE
  (`id` = '55');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1'
WHERE
  (`id` = '56');

UPDATE `systemflags`
SET
  `value` = 'https://www.threads.net/login/'
WHERE
  (`id` = '56');

UPDATE `systemflags`
SET
  `value` = 'https://in.linkedin.com/'
WHERE
  (`id` = '55');

UPDATE `systemflags`
SET
  `value` = 'https://x.com/?lang=en'
WHERE
  (`id` = '54');

UPDATE `systemflags`
SET
  `value` = 'https://www.instagram.com/'
WHERE
  (`id` = '53');

UPDATE `systemflags`
SET
  `value` = 'https://www.facebook.com/'
WHERE
  (`id` = '52');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1',
  `value` = '(©) Copyright 2024 Matrimony. All Rights Reserved.'
WHERE
  (`id` = '51');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1',
  `value` = '(©) Copyright 2024 Matrimony. All Rights Reserved.'
WHERE
  (`id` = '51');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1'
WHERE
  (`id` = '52');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1',
  `value` = 'https://www.instagram.com/'
WHERE
  (`id` = '53');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1'
WHERE
  (`id` = '54');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1',
  `value` = 'https://in.linkedin.com/'
WHERE
  (`id` = '55');

UPDATE `systemflags`
SET
  `flagGroupId` = '16',
  `valueTypeId` = '1'
WHERE
  (`id` = '56');

INSERT INTO
  `flaggroup` (
    `id`,
    `flagGroupName`,
    `detail`,
    `parentFlagGroupId`,
    `displayOrder`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '17',
    'App Name',
    'App Name',
    '1',
    '3',
    '1',
    '0',
    '2023-12-13 15:25:14',
    '2023-12-13 15:25:14',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '57',
    '16',
    '1',
    'appName',
    'App Name',
    'Matrimony',
    'Matrimony',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

INSERT INTO
  `flaggroup` (
    `id`,
    `flagGroupName`,
    `detail`,
    `parentFlagGroupId`,
    `displayOrder`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '18',
    'Contact Us',
    'Contact Us',
    '1',
    '3',
    '1',
    '0',
    '2023-12-13 15:25:14',
    '2023-12-13 15:25:14',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '58',
    '18',
    '1',
    'Address',
    'Address',
    '47 W 13th St, New York, NY 10011, USA',
    '47 W 13th St, New York, NY 10011, USA',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '59',
    '18',
    '1',
    'Email',
    'Email',
    'support@matrimony.com',
    'support@matrimony.com',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '60',
    '18',
    '1',
    'Phone Number',
    'Phone Number',
    '9898989898',
    '9898989898',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

UPDATE `systemflags`
SET
  `name` = 'address'
WHERE
  (`id` = '58');

UPDATE `systemflags`
SET
  `name` = 'email'
WHERE
  (`id` = '59');

UPDATE `systemflags`
SET
  `name` = 'phoneNumber'
WHERE
  (`id` = '60');

INSERT INTO
  `userflags` (
    `id`,
    `flagName`,
    `flagGroupId`,
    `displayName`,
    `description`,
    `valueTypeId`,
    `defaultValue`,
    `autoRender`,
    `displayOrder`
  )
VALUES
  (
    '1',
    'pushNotification',
    '1',
    'Push Notification',
    'Push Notification',
    '7',
    'True',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`,
    `isActive`,
    `isDelete`,
    `createdDate`,
    `modifiedDate`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '47',
    '1',
    '4',
    'aboutus',
    'About Us',
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    '1',
    '1',
    '0',
    '2023-12-27 12:06:37',
    '2023-12-27 12:06:37',
    '1',
    '1'
  );

-- version 1.6
INSERT INTO
  `pages` (
    `path`,
    `title`,
    `type`,
    `active`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  (
    '/admin/manage-custom-fields',
    'Manage Custom Fields',
    'link',
    '1',
    '1',
    '1'
  );

INSERT INTO
  `pages` (
    `path`,
    `title`,
    `type`,
    `active`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  ('/admin/blog', 'Blogs', 'link', '1', '1', '1');

UPDATE `pages`
SET
  `createdBy` = '1',
  `modifiedBy` = '1'
WHERE
  (`id` = '43');

UPDATE `pages`
SET
  `createdBy` = '1',
  `modifiedBy` = '1'
WHERE
  (`id` = '44');

DROP TABLE IF EXISTS `blogs`;
CREATE TABLE
  `blogs` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(400) NULL DEFAULT NULL,
    `description` LONGTEXT NULL DEFAULT NULL,
    `authorName` VARCHAR(100) NULL DEFAULT NULL,
    `image` VARCHAR(200) NULL DEFAULT NULL,
    `tags` VARCHAR(400) NULL DEFAULT NULL,
    `publishDate` DATETIME NULL DEFAULT NULL,
    `isActive` TINYINT NULL DEFAULT '1',
    `isDelete` TINYINT NULL DEFAULT '0',
    `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT NULL DEFAULT NULL,
    `updatedBy` INT NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
  );

DROP TABLE IF EXISTS `educationtype`;
CREATE TABLE
  `educationtype` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NULL,
    `isActive` TINYINT NULL DEFAULT '1',
    `isDelete` TINYINT NULL DEFAULT '0',
    `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT NULL DEFAULT NULL,
    `modifiedBy` INT NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
  );

ALTER TABLE `education`
ADD COLUMN `educationTypeId` INT NULL DEFAULT NULL AFTER `name`,
ADD INDEX `_fk_educationTypeId_idx` (`educationTypeId` ASC);

ALTER TABLE `education` ADD CONSTRAINT `_fk_educationTypeId` FOREIGN KEY (`educationTypeId`) REFERENCES `educationtype` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

DROP TABLE IF EXISTS `educationmedium`;
CREATE TABLE
  `educationmedium` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(200) NULL DEFAULT NULL,
    `isActive` TINYINT NULL DEFAULT '1',
    `isDelete` TINYINT NULL DEFAULT '0',
    `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `createdBy` INT NULL DEFAULT NULL,
    `modifiedBy` INT NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
  );
DROP TABLE IF EXISTS `registrationscreens`;
CREATE TABLE
  `registrationscreens` (
    `id` INT NOT NULL,
    `screenDisplayNo` INT NULL,
    `name` VARCHAR(45) NULL DEFAULT NULL,
    `weightage` INT NULL DEFAULT NULL,
    `isSkippable` TINYINT NULL DEFAULT '0',
    `isDisable` TINYINT NULL DEFAULT '0',
    `isActive` TINYINT NULL DEFAULT '1',
    `isDelete` TINYINT NULL DEFAULT '0',
    `createdBy` INT NULL DEFAULT NULL,
    `modifiedBy` INT NULL DEFAULT NULL,
    `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`)
  );

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`, `weightage`)
VALUES
  ('1', '1', 'Create Profile For', '9');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`, `weightage`)
VALUES
  ('2', '2', 'Basic Details', '9');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`, `weightage`)
VALUES
  ('3', '3', 'Personal Details', '9');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`, `weightage`)
VALUES
  ('4', '4', 'Community Details', '9');

INSERT INTO
  `registrationscreens` (
    `id`,
    `screenDisplayNo`,
    `name`,
    `isSkippable`,
    `isDisable`,
    `weightage`
  )
VALUES
  ('5', '5', 'Family Details', '1', '1', '9');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`, `weightage`)
VALUES
  ('6', '6', 'Living Status', '9');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`, `weightage`)
VALUES
  ('7', '7', 'Education Details', '9');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`, `weightage`)
VALUES
  ('8', '8', 'Occupation Details', '9');

INSERT INTO
  `registrationscreens` (
    `id`,
    `screenDisplayNo`,
    `name`,
    `isSkippable`,
    `isDisable`,
    `weightage`
  )
VALUES
  ('9', '9', 'Astrologic Details', '1', '1', '9');

INSERT INTO
  `registrationscreens` (
    `id`,
    `screenDisplayNo`,
    `name`,
    `isSkippable`,
    `isDisable`,
    `weightage`
  )
VALUES
  ('10', '10', 'Life Styles', '1', '1', '9');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`, `weightage`)
VALUES
  ('11', '11', 'Partner Preferences', '9');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`, `weightage`)
VALUES
  ('12', '12', 'KYC', '9');

ALTER TABLE `registrationscreens`
ADD COLUMN `displayName` VARCHAR(200) NULL DEFAULT NULL AFTER `name`,
CHANGE COLUMN `name` `name` VARCHAR(200) NULL DEFAULT NULL;

UPDATE `registrationscreens`
SET
  `name` = 'Education & Career Details',
  `displayName` = 'Education & Career Details'
WHERE
  (`id` = '7');

UPDATE `registrationscreens`
SET
  `displayName` = 'Create Profile For'
WHERE
  (`id` = '1');

UPDATE `registrationscreens`
SET
  `displayName` = 'Basic Details'
WHERE
  (`id` = '2');

UPDATE `registrationscreens`
SET
  `displayName` = 'Personal Details'
WHERE
  (`id` = '3');

UPDATE `registrationscreens`
SET
  `displayName` = 'Community Details'
WHERE
  (`id` = '4');

UPDATE `registrationscreens`
SET
  `displayName` = 'Family Details'
WHERE
  (`id` = '5');

UPDATE `registrationscreens`
SET
  `displayName` = 'Living Status'
WHERE
  (`id` = '6');

DELETE FROM `registrationscreens`
WHERE
  (`id` = '8');

UPDATE `registrationscreens`
SET
  `id` = '8',
  `screenDisplayNo` = '8',
  `displayName` = 'Astrologic Details'
WHERE
  (`id` = '9');

UPDATE `registrationscreens`
SET
  `id` = '9',
  `screenDisplayNo` = '9',
  `displayName` = 'Life Styles'
WHERE
  (`id` = '10');

UPDATE `registrationscreens`
SET
  `id` = '10',
  `screenDisplayNo` = '10',
  `displayName` = 'Partner Preferences'
WHERE
  (`id` = '11');

UPDATE `registrationscreens`
SET
  `id` = '11',
  `screenDisplayNo` = '11',
  `displayName` = 'KYC'
WHERE
  (`id` = '12');

UPDATE `registrationscreens`
SET
  `name` = 'Profile For',
  `displayName` = 'Profile For'
WHERE
  (`id` = '1');

UPDATE `diet`
SET
  `name` = 'Pure Jain'
WHERE
  (`id` = '8');

UPDATE `diet`
SET
  `name` = 'Non-Vegitarian'
WHERE
  (`id` = '3');

UPDATE `diet`
SET
  `name` = 'Occasionally Non-Veg'
WHERE
  (`id` = '4');

INSERT INTO
  `diet` (
    `id`,
    `name`,
    `isActive`,
    `isDelete`,
    `createdBy`,
    `modifiedBy`
  )
VALUES
  ('9', 'Eggitarian', '1', '0', '6', '6');

DROP TABLE IF EXISTS `userfamilydetail`;
CREATE TABLE
  `userfamilydetail` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NULL DEFAULT NULL,
    `name` VARCHAR(200) NULL DEFAULT NULL,
    `memberType` VARCHAR(100) NULL DEFAULT NULL,
    `memberSubType` VARCHAR(100) NULL DEFAULT NULL,
    `educationId` INT NULL DEFAULT NULL,
    `occupationId` INT NULL DEFAULT NULL,
    `maritalStatusId` INT NULL DEFAULT NULL,
    `isAlive` TINYINT NULL DEFAULT NULL,
    `isActive` TINYINT NULL DEFAULT '1',
    `isDelete` TINYINT NULL DEFAULT '0',
    `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    `createdBy` TINYINT NULL DEFAULT NULL,
    `modifiedBy` VARCHAR(45) NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `_fk_userId_idx` (`userId` ASC),
    INDEX `_fk_occupationId_idx` (`occupationId` ASC),
    INDEX `_fk_educationId_idx` (`educationId` ASC),
    CONSTRAINT `_fk_userId_familydetail` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `_fk_occupationId_familydetail` FOREIGN KEY (`occupationId`) REFERENCES `occupation` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
    CONSTRAINT `_fk_educationId_familydetail` FOREIGN KEY (`educationId`) REFERENCES `education` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
  );

ALTER TABLE `addresses`
ADD COLUMN `residentialStatus` VARCHAR(200) NULL DEFAULT NULL AFTER `longitude`;

DROP TABLE IF EXISTS `userastrologicdetail`;

CREATE TABLE
  `userastrologicdetail` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NULL DEFAULT NULL,
    `horoscopeBelief` TINYINT NULL DEFAULT NULL,
    `birthCountryId` INT NULL DEFAULT NULL,
    `birthCityId` INT NULL DEFAULT NULL,
    `birthCountryName` VARCHAR(200) NULL DEFAULT NULL,
    `birthCityName` VARCHAR(200) NULL DEFAULT NULL,
    `zodiacSign` VARCHAR(100) NULL DEFAULT NULL,
    `timeOfBirth` VARCHAR(200) NULL DEFAULT NULL,
    `isHideBirthTime` TINYINT NULL DEFAULT '0',
    `isManglik` TINYINT NULL DEFAULT NULL,
    `isActive` TINYINT NULL DEFAULT '1',
    `isDelete` TINYINT NULL DEFAULT '0',
    `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    `createdBy` INT NULL DEFAULT NULL,
    `modifiedBy` INT NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
  );

ALTER TABLE `userastrologicdetail` CHANGE COLUMN `horoscopeBelief` `isHoroscopeBelief` TINYINT NULL DEFAULT NULL;

ALTER TABLE `userpersonaldetail`
ADD COLUMN `anyDisability` TINYINT NULL DEFAULT NULL AFTER `memberid`,
ADD COLUMN `haveSpecs` TINYINT NULL DEFAULT NULL AFTER `anyDisability`,
ADD COLUMN `haveChildren` TINYINT NULL DEFAULT NULL AFTER `haveSpecs`,
ADD COLUMN `noOfChildren` INT NULL DEFAULT NULL AFTER `haveChildren`,
ADD COLUMN `bloodGroup` VARCHAR(50) NULL DEFAULT NULL AFTER `noOfChildren`,
ADD COLUMN `complexion` VARCHAR(100) NULL DEFAULT NULL AFTER `bloodGroup`,
ADD COLUMN `bodyType` VARCHAR(100) NULL DEFAULT NULL AFTER `complexion`,
ADD COLUMN `familyType` VARCHAR(100) NULL DEFAULT NULL AFTER `bodyType`,
ADD COLUMN `motherTongue` VARCHAR(100) NULL DEFAULT NULL AFTER `familyType`,
ADD COLUMN `currentAddressId` INT NULL DEFAULT NULL AFTER `motherTongue`,
ADD COLUMN `permanentAddressId` INT NULL DEFAULT NULL AFTER `currentAddressId`,
ADD COLUMN `nativePlace` VARCHAR(200) NULL DEFAULT NULL AFTER `permanentAddressId`,
ADD COLUMN `citizenship` VARCHAR(200) NULL DEFAULT NULL AFTER `nativePlace`,
ADD COLUMN `visaStatus` VARCHAR(100) NULL DEFAULT NULL AFTER `citizenship`,
ADD COLUMN `designation` VARCHAR(100) NULL DEFAULT NULL AFTER `visaStatus`,
ADD COLUMN `educationTypeId` INT NULL DEFAULT NULL AFTER `designation`,
ADD COLUMN `educationMediumId` INT NULL DEFAULT NULL AFTER `educationTypeId`,
ADD COLUMN `drinking` VARCHAR(100) NULL DEFAULT NULL AFTER `educationMediumId`,
ADD COLUMN `smoking` VARCHAR(100) NULL DEFAULT NULL AFTER `drinking`,
ADD COLUMN `willingToGoAbroad` TINYINT NULL DEFAULT NULL AFTER `smoking`,
ADD COLUMN `areYouWorking` TINYINT NULL DEFAULT NULL AFTER `willingToGoAbroad`,
ADD COLUMN `stepCompletedNo` INT NULL DEFAULT NULL AFTER `areYouWorking`;

ALTER TABLE `userpersonaldetail`
DROP COLUMN `permanentAddressId`;

ALTER TABLE `userpersonaldetail` ADD CONSTRAINT `fk_userpersonaldetail_currentAddressId` FOREIGN KEY (`currentAddressId`) REFERENCES `addresses` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `userpersonaldetail` ADD CONSTRAINT `fk_userpersonaldetail_educationTypeId` FOREIGN KEY (`educationTypeId`) REFERENCES `educationtype` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
ADD CONSTRAINT `fk_userpersonaldetail_educationMediumId` FOREIGN KEY (`educationMediumId`) REFERENCES `educationmedium` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

DROP TABLE IF EXISTS `userpartnerpreferences`;

CREATE TABLE
  `userpartnerpreferences` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NULL DEFAULT NULL,
    `pFromAge` INT NULL DEFAULT NULL,
    `pToAge` INT NULL DEFAULT NULL,
    `pFromHeight` INT NULL DEFAULT NULL,
    `pMaritalStatusId` VARCHAR(100) NULL DEFAULT NULL,
    `pProfileWithChildren` TINYINT NULL DEFAULT NULL,
    `pFamilyType` VARCHAR(100) NULL DEFAULT NULL,
    `pReligionId` VARCHAR(100) NULL DEFAULT NULL,
    `pCommunityId` VARCHAR(100) NULL DEFAULT NULL,
    `pMotherTongue` VARCHAR(100) NULL DEFAULT NULL,
    `pHorcoscopeBelief` VARCHAR(100) NULL DEFAULT NULL,
    `pManglikMatch` TINYINT NULL DEFAULT NULL,
    `pCountryLivingInId` VARCHAR(100) NULL DEFAULT NULL,
    `pStateLivingInId` VARCHAR(100) NULL DEFAULT NULL,
    `pCityLivingInId` VARCHAR(100) NULL DEFAULT NULL,
    `pEducationTypeId` VARCHAR(100) NULL DEFAULT NULL,
    `pEducationMediumId` VARCHAR(100) NULL DEFAULT NULL,
    `pOccupationId` VARCHAR(100) NULL DEFAULT NULL,
    `pEmploymentTypeId` VARCHAR(100) NULL DEFAULT NULL,
    `pAnnualIncomeId` VARCHAR(100) NULL DEFAULT NULL,
    `pDietId` VARCHAR(100) NULL DEFAULT NULL,
    `pSmokingAcceptance` TINYINT NULL DEFAULT NULL,
    `pAlcoholAcceptance` TINYINT NULL DEFAULT NULL,
    `pDisabilityAcceptance` TINYINT NULL DEFAULT NULL,
    `pComplexion` VARCHAR(100) NULL DEFAULT NULL,
    `pBodyType` VARCHAR(100) NULL DEFAULT NULL,
    `pOtherExpectations` VARCHAR(400) NULL DEFAULT NULL,
    `userpartnerpreferencescol` VARCHAR(45) NULL DEFAULT NULL,
    `isActive` TINYINT NULL DEFAULT '1',
    `isDelete` TINYINT NULL DEFAULT '0',
    `createdBy` INT NULL DEFAULT NULL,
    `modifiedBy` INT NULL DEFAULT NULL,
    `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`)
  );

ALTER TABLE `userpartnerpreferences` ADD INDEX `fk_partnerprefernces_userId_idx` (`userId` ASC);

ALTER TABLE `userpartnerpreferences` ADD CONSTRAINT `fk_partnerprefernces_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE `userpartnerpreferences` CHANGE COLUMN `userpartnerpreferencescol` `pToHeight` INT NULL DEFAULT NULL AFTER `pFromHeight`;

ALTER TABLE `users`
ADD COLUMN `lastCompletedScreen` INT NULL DEFAULT NULL AFTER `isVerifyProfilePic`;

ALTER TABLE `userfamilydetail` CHANGE COLUMN `createdBy` `createdBy` INT NULL DEFAULT NULL,
CHANGE COLUMN `modifiedBy` `modifiedBy` INT NULL DEFAULT NULL;

ALTER TABLE `userastrologicdetail` CHANGE COLUMN `isHoroscopeBelief` `horoscopeBelief` TINYINT NULL DEFAULT NULL,
CHANGE COLUMN `isManglik` `manglik` TINYINT NULL DEFAULT NULL;

ALTER TABLE `userpartnerpreferences` CHANGE COLUMN `pHorcoscopeBelief` `pHoroscopeBelief` VARCHAR(100) NULL DEFAULT NULL;

ALTER TABLE `users`
ADD COLUMN `profileCompletedPercentage` INT NULL DEFAULT NULL AFTER `lastCompletedScreen`;

ALTER TABLE `users`
ADD COLUMN `isProfileCompleted` TINYINT NULL DEFAULT 0 AFTER `profileCompletedPercentage`;

ALTER TABLE `users` CHANGE COLUMN `lastCompletedScreen` `lastCompletedScreen` INT NULL DEFAULT '0';

DROP TABLE IF EXISTS `preferenceweightage`;

CREATE TABLE
  `preferenceweightage` (
    `id` INT NOT NULL,
    `name` VARCHAR(200) NULL DEFAULT NULL,
    `isActive` TINYINT NULL DEFAULT '1',
    `isDelete` TINYINT NULL DEFAULT '0',
    `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`id`)
  );

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('1', 'pAge');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('2', 'pHeight');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('3', 'pMaritalStatus');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('4', 'pProfileWithChildren');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('5', 'pFamilyType');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('6', 'pReligion');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('7', 'pCommunity');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('8', 'pMotherTongue');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('9', 'pHoroscopeBelief');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('10', 'pManglikMatch');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('11', 'pCountryLivingIn');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('12', 'pStateLivingIn');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('13', 'pCityLivingIn');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('14', 'pEducationType');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('15', 'pEducationMedium');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('16', 'pOccupation');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('17', 'pEmploymentType');

ALTER TABLE `preferenceweightage`
ADD COLUMN `weightage` INT NULL DEFAULT 1 AFTER `name`;

ALTER TABLE `userpartnerpreferences` CHANGE COLUMN `pHoroscopeBelief` `pHoroscopeBelief` TINYINT NULL DEFAULT NULL;

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('18', 'pAnnualIncome');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('19', 'pDiet');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('20', 'pSmokingAcceptance');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('21', 'pDisabilityAcceptance');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('22', 'pComplexion');

INSERT INTO
  `preferenceweightage` (`id`, `name`)
VALUES
  ('23', 'pBodyType');

ALTER TABLE `registrationscreens`
ADD COLUMN `canDisable` TINYINT NULL DEFAULT '0' AFTER `isDisable`;

ALTER TABLE `users` CHANGE COLUMN `profileCompletedPercentage` `profileCompletedPercentage` INT NULL DEFAULT '0';

ALTER TABLE `userpersonaldetail`
DROP COLUMN `stepCompletedNo`,
ADD COLUMN `isHideContactDetail` TINYINT NULL DEFAULT NULL AFTER `areYouWorking`;

INSERT INTO
  `preferenceweightage` (`id`, `name`, `weightage`)
VALUES
  ('24', 'pBodyType', '1');

UPDATE `preferenceweightage`
SET
  `name` = 'pAlcoholAcceptance'
WHERE
  (`id` = '21');

UPDATE `preferenceweightage`
SET
  `name` = 'pDisabilityAcceptance'
WHERE
  (`id` = '22');

UPDATE `preferenceweightage`
SET
  `name` = 'pComplexion'
WHERE
  (`id` = '23');

INSERT INTO
  `flaggroup` (
    `id`,
    `flagGroupName`,
    `detail`,
    `parentFlagGroupId`,
    `displayOrder`
  )
VALUES
  ('19', 'Modules', 'Modules', '14', '1');

UPDATE `flaggroup`
SET
  `flagGroupName` = 'Features',
  `detail` = 'Features'
WHERE
  (`id` = '14');

UPDATE `systemflags`
SET
  `flagGroupId` = '19'
WHERE
  (`id` = '45');

ALTER TABLE `systemflags`
ADD COLUMN `parentFlagId` INT NULL DEFAULT NULL AFTER `label`,
ADD COLUMN `parentFlagValue` INT NULL DEFAULT NULL AFTER `parentFlagId`,
ADD COLUMN `isAuthRequired` TINYINT NULL DEFAULT '1' AFTER `parentFlagValue`;

ALTER TABLE `systemflags` CHANGE COLUMN `parentFlagValue` `parentFlagValue` LONGTEXT NULL DEFAULT NULL;

UPDATE `pages`
SET
  `title` = 'User Management'
WHERE
  (`id` = '2');

UPDATE `pages`
SET
  `title` = 'Admin Setup',
  `group` = 'Admin Setup'
WHERE
  (`id` = '10');

UPDATE `pages`
SET
  `group` = 'User Management'
WHERE
  (`id` = '3');

UPDATE `pages`
SET
  `group` = 'User Management'
WHERE
  (`id` = '4');

UPDATE `pages`
SET
  `group` = 'User Management'
WHERE
  (`id` = '5');

UPDATE `pages`
SET
  `title` = 'Packages',
  `group` = 'Package Setup'
WHERE
  (`id` = '7');

UPDATE `pages`
SET
  `title` = 'Package Setup'
WHERE
  (`id` = '6');

UPDATE `pages`
SET
  `title` = 'Facilities',
  `group` = 'Package Setup'
WHERE
  (`id` = '8');

UPDATE `pages`
SET
  `title` = 'Duration',
  `group` = 'Package Setup'
WHERE
  (`id` = '9');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '11');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '12');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '13');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '14');

UPDATE `pages`
SET
  `active` = '1',
  `group` = 'Admin Setup'
WHERE
  (`id` = '15');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '16');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '17');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '18');

UPDATE `pages`
SET
  `active` = '1',
  `group` = 'Admin Setup'
WHERE
  (`id` = '19');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '20');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '21');

INSERT INTO
  `pages` (`id`, `title`, `type`, `group`)
VALUES
  ('47', 'Admin Approvals', 'sub', 'Admin Approvals');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '41');

UPDATE `pages`
SET
  `active` = '1',
  `group` = 'Admin Setup'
WHERE
  (`id` = '43');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '44');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '46');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '45');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '36');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '37');

UPDATE `pages`
SET
  `group` = 'Admin Setup'
WHERE
  (`id` = '35');

UPDATE `pages`
SET
  `group` = 'Admin Approvals',
  `parentId` = '47'
WHERE
  (`id` = '42');

UPDATE `pages`
SET
  `group` = 'Admin Approvals',
  `parentId` = '47'
WHERE
  (`id` = '38');

UPDATE `pages`
SET
  `group` = 'Admin Approvals',
  `parentId` = '47'
WHERE
  (`id` = '39');

UPDATE `pages`
SET
  `group` = 'Admin Approvals',
  `parentId` = '47'
WHERE
  (`id` = '34');

UPDATE `pages`
SET
  `parentId` = '10'
WHERE
  (`id` = '35');

UPDATE `pages`
SET
  `parentId` = '10'
WHERE
  (`id` = '36');

UPDATE `pages`
SET
  `parentId` = '10'
WHERE
  (`id` = '37');

UPDATE `pages`
SET
  `parentId` = '10'
WHERE
  (`id` = '46');

UPDATE `pages`
SET
  `parentId` = '10'
WHERE
  (`id` = '45');

INSERT INTO
  `pages` (
    `path`,
    `title`,
    `type`,
    `active`,
    `group`,
    `parentId`
  )
VALUES
  (
    '/admin/coupon',
    'Coupons',
    'link',
    '1',
    'Admin Setup',
    '10'
  );

UPDATE `pages`
SET
  `active` = '1'
WHERE
  (`id` = '47');

UPDATE `pages`
SET
  `isActive` = '0'
WHERE
  (`id` = '19');

UPDATE `pages`
SET
  `isActive` = '0'
WHERE
  (`id` = '43');

UPDATE `pages`
SET
  `isActive` = '0'
WHERE
  (`id` = '15');

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `valueList`,
    `isAuthRequired`,
    `autoRender`
  )
VALUES
  (
    '61',
    '1',
    '3',
    'memberIdFormat',
    'Member Id Format',
    'Alpha Numeric',
    'Alpha Numeric',
    'Alpha Numeric;Only Numeric;Only Alphabets;Prefix;Postfix',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `description`,
    `parentFlagId`,
    `parentFlagValue`,
    `autoRender`
  )
VALUES
  (
    '62',
    '1',
    '1',
    'prefixLetters',
    'Prefix Letters',
    'MT',
    'MT',
    NULL,
    '61',
    'Prefix',
    '0'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `parentFlagId`,
    `parentFlagValue`,
    `autoRender`
  )
VALUES
  (
    '63',
    '1',
    '1',
    'postfixLetters',
    'Postfix Letters',
    'MT',
    'MT',
    '61',
    'Postfix',
    '0'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`
  )
VALUES
  (
    '64',
    '1',
    '1',
    'apiurl',
    'API Url',
    'http://192.168.29.115:8083',
    'http://192.168.29.115:8083',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `valueList`,
    `autoRender`
  )
VALUES
  (
    '65',
    '14',
    '3',
    'genderVisibility',
    'Gender Visibility',
    'Opposite',
    'Opposite',
    'All;Same;Opposite',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`
  )
VALUES
  (
    '66',
    '19',
    '7',
    'isEnableFamilyDetails',
    'Enable Family Details',
    '1',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `parentFlagId`,
    `parentFlagValue`,
    `autoRender`
  )
VALUES
  (
    '67',
    '19',
    '7',
    'isSkipFamilyDetails',
    'Allow Family Details To Skip During Signup',
    '1',
    '1',
    '66',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`
  )
VALUES
  (
    '68',
    '19',
    '7',
    'isEnableAstrologicDetails',
    'Enable Astrologic Details',
    '1',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `parentFlagId`,
    `parentFlagValue`,
    `autoRender`
  )
VALUES
  (
    '69',
    '19',
    '7',
    'isSkipAstrologicDetails',
    'Allow Astrologic Details To Skip During Signup',
    '1',
    '1',
    '68',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`
  )
VALUES
  (
    '70',
    '19',
    '7',
    'isEnableLifeStyles',
    'Enable Life Styles',
    '1',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `parentFlagId`,
    `parentFlagValue`,
    `autoRender`
  )
VALUES
  (
    '71',
    '19',
    '7',
    'isSkipLifeStyles',
    'Allow Life Styles To Skip During Signup',
    '1',
    '1',
    '70',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `autoRender`
  )
VALUES
  (
    '72',
    '19',
    '7',
    'isEnableCommunity',
    'Enable Community',
    '1',
    '1',
    '1'
  );

INSERT INTO
  `systemflags` (
    `id`,
    `flagGroupId`,
    `valueTypeId`,
    `name`,
    `displayName`,
    `value`,
    `defaultValue`,
    `parentFlagId`,
    `parentFlagValue`,
    `autoRender`
  )
VALUES
  (
    '73',
    '19',
    '7',
    'isEnableSubCommunity',
    'Enable Sub Community',
    '1',
    '1',
    '72',
    '1',
    '1'
  );

ALTER TABLE `users`
ADD COLUMN `stripeCustomerId` VARCHAR(200) NULL DEFAULT NULL AFTER `isProfileCompleted`;

DROP TABLE IF EXISTS `languages`;

CREATE TABLE `languages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `languageCode` VARCHAR(45) NOT NULL,
  `countryCode` VARCHAR(45) NOT NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));

INSERT INTO `languages` (`name`, `languageCode`, `countryCode`) VALUES ('English', 'EN', 'US');
INSERT INTO `languages` (`name`, `languageCode`, `countryCode`) VALUES ('Hindi', 'HI', 'IN');
INSERT INTO `languages` (`name`, `languageCode`, `countryCode`) VALUES ('Gujarati', 'GU', 'IN');
INSERT INTO `languages` (`name`, `languageCode`, `countryCode`) VALUES ('French', 'FR', 'FR');
INSERT INTO `languages` (`name`, `languageCode`, `countryCode`) VALUES ('Spanish', 'ES', 'ES');
INSERT INTO `languages` (`name`, `languageCode`, `countryCode`) VALUES ('Arabic', 'AR', 'AE');
INSERT INTO `languages` (`name`, `languageCode`, `countryCode`) VALUES ('Telugu', 'TE', 'IN');

INSERT INTO `userflags` (`id`, `flagName`, `flagGroupId`, `displayName`, `valueTypeId`, `defaultValue`) VALUES ('2', 'multiLanguage', '1', 'Language', '5', 'EN');

ALTER TABLE `userflagvalues` 
CHANGE COLUMN `userFlagValue` `userFlagValue` VARCHAR(50) NULL DEFAULT NULL ;

UPDATE `userflags` SET `defaultValue` = NULL WHERE (`id` = '2');

UPDATE `userflags` SET `defaultValue` = '1' WHERE (`id` = '1');

INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`) VALUES ('74', '1', '7', 'skipNow', 'Skip Now', '1', '1', '1', '1', '1', '0');

INSERT INTO `premiumfacility` (`id`, `name`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('12', 'Gallery', '1', '0', '2024-08-20 17:10:05', '2024-08-20 17:10:05', '38', '38');

DROP TABLE IF EXISTS `userotp`;

CREATE TABLE `userotp` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mobileNumber` VARCHAR(20) NOT NULL,
  `otp` VARCHAR(6) NOT NULL,
  `createdAt` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `expiresAt` TIMESTAMP NOT NULL,
  `isUsed` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`id`));

DROP TABLE IF EXISTS `userimagegallery`;

CREATE TABLE `userimagegallery` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NULL,
  `imageUrl` LONGTEXT NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL,
  `modifiedBy` INT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `userimagegallery` 
ADD INDEX `userId_idx` (`userId` ASC) VISIBLE;

ALTER TABLE `userimagegallery` 
ADD CONSTRAINT `userId`
  FOREIGN KEY (`userId`)
  REFERENCES `users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `createdBy`, `modifiedBy`) VALUES ('20', 'Gallery Image Count', 'Gallery Image Count', '1', '1', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `displayOrder`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('21', 'Google AdMob', 'Goolge AdMob', '4', '1', '0', '2022-10-20 15:50:28', '2022-10-20 15:50:28', '1', '1');

INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('22', 'AdMob Credentials', 'AdMob Credentials', '21', '5', '1', '0', '2022-10-20 15:50:28', '2022-10-20 15:50:28', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (76, '22', '8', 'adUnitIdForAndroid', 'Ad UnitId For Android', 'ca-app-pub-3940256099942544/6300978111', 'ca-app-pub-3940256099942544/6300978111', NULL, NULL, NULL, NULL, NULL, NULL, '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES (77, '22', '8', 'adUnitIdForIos', 'Ad UnitId For IOS', 'ca-app-pub-3940256099942544/2934735716', 'ca-app-pub-3940256099942544/2934735716', NULL, NULL, NULL, NULL, NULL, NULL, '1', '1');

UPDATE `systemflags` SET `isAuthRequired` = '1', `autoRender` = '1', `isActive` = '1', `isDelete` = '0', `createdDate` = '2024-10-05 12:30:09', `modifiedDate` = '2024-10-05 12:30:09' WHERE (`id` = '76');
UPDATE `systemflags` SET `isAuthRequired` = '1', `autoRender` = '1', `isActive` = '1', `isDelete` = '0', `createdDate` = '2024-10-05 12:30:09', `modifiedDate` = '2024-10-05 12:30:09' WHERE (`id` = '77');

ALTER TABLE `users` 
ADD COLUMN `isDemoUser` INT NULL DEFAULT 0 AFTER `modifiedDate`;

ALTER TABLE `successstories` 
ADD COLUMN `requestStatus` VARCHAR(20) NULL DEFAULT 'pending' AFTER `modifiedBy`;

INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('87', '1', '4', 'accountDeletionPolicy', 'Account Deletion Policy', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</p>', '1', '1', '1', '0', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('29', 'Provider Base URL', 'Provider Base URL', '27', '1', '1', '0', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('30', 'API Key', 'API Key', '27', '1', '1', '0', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('31', 'Sender Id', 'Sender Id', '27', '1', '1', '0', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('32', 'OTP Message Template', 'OTP Message Template', '27', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('89', '29', '1', 'providerBaseURL', 'Provider Base Url', 'https://sms.allworldenterprises.com/api/push.json?', 'https://sms.allworldenterprises.com/api/push.json?', '1', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('90', '30', '1', 'apiKey', 'API key', '670e73c73e7a0', '670e73c73e7a0', '1', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('91', '31', '1', 'senderId', 'Sender ID', 'STJANM', 'STJANM', '1', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('92', '32', '1', 'otpMessageTemplate', 'OTP Message Template', 'is your verification code for 7janm.com ', 'is your verification code for 7janm.com ', '1', '1', '1', '0', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('27', 'Phone Auth', 'Phone Auth', '1', '1', '0', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('28', 'OTP Provider', 'OTP Provider', '27', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `valueList`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('88', '28', '3', 'otpProvider', 'OTP Provider', 'Firebase', 'Firebase', 'Firebase;Third Party Provider', '1', '1', '1', '0', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `displayOrder`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('23', 'Intro Screen', 'Intro Screen', '10', '1', '0', '2024-10-14 18:22:29', '2024-10-14 18:22:29', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('24', 'Intro Images', 'Intro Images', '23', '1', '1', '0', '2024-10-14 19:10:17', '2024-10-14 19:10:17', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('25', 'Intro Title Text', 'Intro Title Text', '23', '2', '1', '0', '2024-10-14 19:10:17', '2024-10-14 19:10:17', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('26', 'Intro Sub Title Text', 'Intro Sub Title Text', '23', '3', '1', '0', '2024-10-14 19:10:17', '2024-10-14 19:10:17', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('78', '24', '9', 'introImage1', 'Intro Image 1', 'content/systemflag/introImages/introImage1/introImage1.jpeg', '1', '1', '1', '0', '2024-10-14 19:14:21', '2024-10-14 19:14:21', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('79', '24', '9', 'introImage2', 'Intro Image 2', 'content/systemflag/introImages/introImage2/introImage2.jpeg', '1', '1', '1', '0', '2024-10-14 19:14:21', '2024-10-14 19:14:21', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('80', '24', '9', 'introImage3', 'Intro Image 3', 'content/systemflag/introImages/introImage3/introImage3.jpeg', '1', '1', '1', '0', '2024-10-14 19:14:21', '2024-10-14 19:14:21', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('81', '25', '1', 'introTitleText1', 'Intro Title Text 1', 'Find Your Best Partner', '1', '1', '1', '0', '2024-10-14 19:14:21', '2024-10-14 19:14:21', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('82', '25', '1', 'introTitleText2', 'Intro Title Text 2', 'Better Solution', '1', '1', '1', '0', '2024-10-14 19:14:21', '2024-10-14 19:14:21', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('83', '25', '1', 'introTitleText3', 'Intro Title Text 3', 'Be Happy With US', '1', '1', '1', '0', '2024-10-14 19:14:21', '2024-10-14 19:14:21', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('84', '26', '1', 'introSubTitleText1', 'Intro Sub Title Text 1', 'Discover your ideal match with us! Find your best partner for a lasting connection and shared happiness.', '1', '1', '1', '0', '2024-10-14 19:14:21', '2024-10-14 19:14:21', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('85', '26', '1', 'introSubTitleText2', 'Intro Sub Title Text 2', 'Unlock happiness with us! Discover genuine connections and find your ideal life partner for a joy-filled journey.', '1', '1', '1', '0', '2024-10-14 19:14:21', '2024-10-14 19:14:21', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `isAuthRequired`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('86', '26', '1', 'introSubTitleText3', 'Intro Sub Title Text 3', 'Join us for happiness! Discover joy and find your ideal partner with us. Embrace a happy journey together', '1', '1', '1', '0', '2024-10-14 19:14:21', '2024-10-14 19:14:21', '1', '1');
INSERT INTO `pages` (`id`, `path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('49', '/admin/appuser/addappuser', 'Edit App Users', 'link', '1', 'Reports', '22', '1', '0', '2024-01-15 18:04:20', '2024-01-15 18:04:20', '1', '1');
INSERT INTO `pages` (`id`, `path`, `title`, `type`, `active`, `group`, `parentId`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('50', '/admin/appuser/addappuser', 'Add App Users', 'link', '1', 'Reports', '22', '1', '0', '2024-01-15 18:04:20', '2024-01-15 18:04:20', '1', '1');