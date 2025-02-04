ALTER TABLE `community` 
ADD COLUMN `religionId` INT NULL AFTER `id`,
ADD INDEX `fk_community_religion_idx` (`religionId` ASC) ;

ALTER TABLE `community` 
ADD CONSTRAINT `fk_community_religion`
  FOREIGN KEY (`religionId`)
  REFERENCES `religion` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `subcommunity` 
ADD COLUMN `religionId` INT NULL AFTER `id`,
ADD INDEX `fk_religion_subcommunity_idx` (`religionId` ASC) ,
ADD INDEX `fk_religion_community_idx` (`communityId` ASC) ;

ALTER TABLE `subcommunity` 
ADD CONSTRAINT `fk_religion_subcommunity`
  FOREIGN KEY (`religionId`)
  REFERENCES `religion` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_religion_community`
  FOREIGN KEY (`communityId`)
  REFERENCES `community` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;



INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('20', '8', '7', 'enableFirebasePhoneAuthentication', 'Enable Firebase Phone Authentication', '1', '1', '1', '1', '0', '1', '1');



CREATE TABLE `documenttype` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL,
  `isRequired` TINYINT NULL,
  `isActive` TINYINT NULL DEFAULT 1,
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `userdocument` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NULL,
  `documentTypeId` INT NULL,
  `documentUrl` LONGTEXT NULL,
  `isVerified` TINYINT NULL,
  `isRequired` TINYINT NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_userdocument_user_idx` (`userId` ASC) ,
  INDEX `fk_userdocument_documenttype_idx` (`documentTypeId` ASC) ,
  CONSTRAINT `fk_userdocument_user`
    FOREIGN KEY (`userId`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_userdocument_documenttype`
    FOREIGN KEY (`documentTypeId`)
    REFERENCES `documenttype` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



UPDATE `systemflags` SET `valueList` = 'Razorpay;Stripe;PhonePe' WHERE (`id` = '12');


INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('21', '1', '4', 'privacyPolicy', 'Privacy Policy', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('22', '1', '4', 'termsCondition', 'Terms Condition', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('23', '1', '4', 'refundPolicy', 'Refund Policy', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', '1', '1', '0', '1', '1');




CREATE TABLE `customnotification` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL,
  `title` VARCHAR(200) NULL,
  `description` LONGTEXT NULL,
  `imageUrl` LONGTEXT NULL,
  `sendCount` INT NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));





INSERT INTO `valuetypes` (`id`, `valueTypeName`, `description`, `isActive`, `isDelete`) VALUES ('9', 'Image', 'Image Upload', '1', '0');



INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('24', '1', '9', 'watermarkImage', 'Watermark Image', '1', '1', '0', '1', '1');



ALTER TABLE `users` 
ADD COLUMN `isTwoFactorEnable` TINYINT NULL AFTER `isVerified`;


ALTER TABLE `users` 
ADD COLUMN `twoFactorCode` VARCHAR(6) NULL AFTER `isTwoFactorEnable`;


ALTER TABLE `users` 
ADD COLUMN `otpAuthUrl` LONGTEXT NULL AFTER `twoFactorCode`,
ADD COLUMN `baseSecret` LONGTEXT NULL AFTER `otpAuthUrl`,
ADD COLUMN `isReceiveMail` TINYINT NULL AFTER `baseSecret`,
ADD COLUMN `isReceiveNotification` TINYINT NULL AFTER `isReceiveMail`;

UPDATE `users` SET `isReceiveMail` = '1', `isReceiveNotification` = '1' WHERE (`id` = '1');




CREATE TABLE `userviewprofilehistories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NULL,
  `viewProfileByUserId` INT NULL,
  `transactionDate` DATETIME NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_userViewProfileHistory_users_idx` (`userId` ASC) ,
  INDEX `fk_userViewProfileHistory_viewProfileByusers_idx` (`viewProfileByUserId` ASC) ,
  CONSTRAINT `fk_userViewProfileHistory_users`
    FOREIGN KEY (`userId`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_userViewProfileHistory_viewProfileByusers`
    FOREIGN KEY (`viewProfileByUserId`)
    REFERENCES `users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);



INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('10', 'Two Factor Authentication', 'Two Factor Authentication', '1', '2', '1', '0', '1', '1');
INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('9', 'PhonePe', 'PhonePe', '3', '4', '1', '0', '1', '1');




INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('25', '10', '1', 'twoFactorLabel', 'Two Factor Authenticator Label', 'Matrimony', 'Matrimony', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('26', '10', '1', 'twoFactorIssuer', 'Two Factor Authenticator Issues Name', 'Admin', 'Admin', '1', '1', '0', '1', '1');




ALTER TABLE `package` 
ADD COLUMN `weightage` INT NULL AFTER `baseAmount`;




ALTER TABLE `addresses` 
ADD COLUMN `districtId` INT NULL AFTER `cityId`;




INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('27', '9', '8', 'phonePeMerchantId', 'PhonePe MerchantId', 'PGTESTPAYUAT', 'PGTESTPAYUAT', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `valueList`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('28', '9', '3', 'phonePeRedirectMode', 'PhonePe Redirect Mode', 'REDIRECT', 'REDIRECT', 'REDIRECT;POST', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('29', '9', '8', 'phonePeSaltKey', 'PhonePe SaltKey', '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399', '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('30', '9', '8', 'phonePeSaltIndex', 'PhonePe SaltIndex', '1', '1', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `valueList`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('31', '9', '3', 'phonePeEnvironmentValue', 'PhonePe Environment Value', 'UAT', 'UAT', 'UAT;UAT_SIM;PRODUCTION', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`,  `createdBy`, `modifiedBy`) VALUES ('32', '9', '8', 'phonePeAPIendPoint', 'PhonePe API End Point', '/pg/v1/pay', '/pg/v1/pay', '1', '1', '0', '1', '1');



INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('11', 'Manual Payment', 'Manual Payment', '3', '5', '1', '0', '1', '1');


UPDATE `systemflags` SET `valueList` = 'Razorpay;Stripe;PhonePe;Manual Payment' WHERE (`id` = '12');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('33', '11', '4', 'manualPaymentDescription', 'Manual Payment Description', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('34', '1', '7', 'isProfilePicRequired', 'Is Profile Picture Required', '0', '0', '1', '1', '0', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdBy`, `modifiedBy`) VALUES ('35', '11', '1', 'manualPaymentDisplayName', 'Manual Payment Display Name', 'Offline Payment Instruction', 'Offline Payment Instruction', '1', '1', '0', '1', '1');

ALTER TABLE `addresses` 
ADD COLUMN `latitude` DOUBLE NULL AFTER `cityName`,
ADD COLUMN `longitude` DOUBLE NULL AFTER `latitude`;



