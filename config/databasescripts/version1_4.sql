CREATE TABLE `userpersonaldetailcustomdata` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_userpersonaldetailcustomdata_user_idx` (`userId` ASC) ,
  CONSTRAINT `fk_userpersonaldetailcustomdata_user`
    FOREIGN KEY (`userId`)
    REFERENCES `users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT);

    CREATE TABLE `customfields` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL DEFAULT NULL,
  `displayName` VARCHAR(100) NULL DEFAULT NULL,
  `mappedTableName` VARCHAR(100) NULL DEFAULT NULL,
  `description` LONGTEXT NULL DEFAULT NULL,
  `valueTypeId` INT NULL DEFAULT NULL,
  `isRequired` TINYINT NULL DEFAULT NULL,
  `allowInSearch` TINYINT NULL DEFAULT NULL,
  `allowInFilter` TINYINT NULL DEFAULT NULL,
  `allowIncompleteProfile` TINYINT NULL DEFAULT NULL,
  `allowInPreferences` TINYINT NULL DEFAULT NULL,
  `defaultValue` LONGTEXT NULL DEFAULT NULL,
  `valueList` LONGTEXT NULL DEFAULT NULL,
  `isActive` TINYINT NULL DEFAULT '1',
  `isDelete` TINYINT NULL DEFAULT '0',
  `createdDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `modifiedDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` INT NULL DEFAULT NULL,
  `modifiedBy` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

  INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `displayOrder`) VALUES ('14', 'Modules', 'Modules', '8');
  INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`) VALUES ('45', '14', '7', 'isEnableCustomFields', 'Enable CustomFields', '1', '1');
  ALTER TABLE `valuetypes` 
ADD COLUMN `isShowInCustomField` TINYINT NULL DEFAULT NULL AFTER `modifiedBy`;
UPDATE `valuetypes` SET `isShowInCustomField` = '1' WHERE (`id` = '1');
UPDATE `valuetypes` SET `isShowInCustomField` = '1' WHERE (`id` = '2');
UPDATE `valuetypes` SET `isShowInCustomField` = '1' WHERE (`id` = '3');
UPDATE `valuetypes` SET `isShowInCustomField` = '1' WHERE (`id` = '10');
ALTER TABLE `customfields` 
CHANGE COLUMN `mappedTableName` `mappedFieldName` VARCHAR(100) NULL DEFAULT NULL ;
ALTER TABLE `customfields` 
CHANGE COLUMN `isRequired` `isRequired` TINYINT NULL DEFAULT '0' ,
CHANGE COLUMN `allowInSearch` `allowInSearch` TINYINT NULL DEFAULT '0' ,
CHANGE COLUMN `allowInFilter` `allowInFilter` TINYINT NULL DEFAULT '0' ,
CHANGE COLUMN `allowIncompleteProfile` `allowIncompleteProfile` TINYINT NULL DEFAULT '0' ,
CHANGE COLUMN `allowInPreferences` `allowInPreferences` TINYINT NULL DEFAULT '0' ;
ALTER TABLE `valuetypes` 
ADD COLUMN `isUseForFilter` TINYINT NULL DEFAULT NULL AFTER `isShowInCustomField`;
ALTER TABLE `valuetypes` 
ADD COLUMN `remark` VARCHAR(45) NULL DEFAULT NULL AFTER `isUseForFilter`;
UPDATE `valuetypes` SET `isUseForFilter` = '0' WHERE (`id` = '1');
UPDATE `valuetypes` SET `isUseForFilter` = '0' WHERE (`id` = '2');
UPDATE `valuetypes` SET `isUseForFilter` = '1' WHERE (`id` = '3');
UPDATE `valuetypes` SET `isUseForFilter` = '1' WHERE (`id` = '10');
ALTER TABLE `valuetypes` 
CHANGE COLUMN `remark` `remark` VARCHAR(200) NULL DEFAULT NULL ;
UPDATE `valuetypes` SET `remark` = 'If you enable this flag, the application may cause malware crash' WHERE (`id` = '1');
UPDATE `valuetypes` SET `remark` = 'If you enable this flag, the application may cause malware crash' WHERE (`id` = '2');
ALTER TABLE `userauthdata` 
CHANGE COLUMN `oAuthAccessToken` `oAuthAccessToken` LONGTEXT NULL DEFAULT NULL ,
CHANGE COLUMN `description` `description` LONGTEXT NULL DEFAULT NULL ;
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `isActive`, `isDelete`) VALUES ('46', '1', '7', 'isVerifyCustomerProfile', 'Verify Customer Profile', '1', '1', '1', '0');
ALTER TABLE `users` 
ADD COLUMN `isVerifyProfilePic` TINYINT NULL AFTER `isReceiveNotification`;
UPDATE `systemflags` SET `name` = 'isUserProfilePicApprove', `displayName` = 'User ProfilePic Approved', `description` = 'User Profile Pic Approved from admin' WHERE (`id` = '46');
ALTER TABLE `customfields` 
ADD COLUMN `completeprofilesectioname` VARCHAR(100) NULL DEFAULT NULL AFTER `valueList`;
ALTER TABLE `weight` 
CHANGE COLUMN `name` `name` INT NOT NULL ;
ALTER TABLE `userproposals` 
ADD COLUMN `hascancelled` TINYINT NULL DEFAULT '0' AFTER `modifiedBy`;

ALTER TABLE `customfields` 
ADD COLUMN `textLength` INT NULL DEFAULT NULL AFTER `isRequired`;

ALTER TABLE `userpersonaldetail` 
ADD COLUMN `memberid` VARCHAR(45) NULL AFTER `modifiedBy`,
ADD UNIQUE INDEX `memberid_UNIQUE` (`memberid` ASC) ;

ALTER TABLE `feedback` 
CHANGE COLUMN `isActive` `isActive` TINYINT NULL DEFAULT '0' ;