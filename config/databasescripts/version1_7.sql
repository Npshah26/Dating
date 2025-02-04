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