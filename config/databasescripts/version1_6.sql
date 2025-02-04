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
  `registrationscreens` (`id`, `screenDisplayNo`, `name`)
VALUES
  ('1', '1', 'Create Profile For');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`)
VALUES
  ('2', '2', 'Basic Details');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`)
VALUES
  ('3', '3', 'Personal Details');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`)
VALUES
  ('4', '4', 'Community Details');

INSERT INTO
  `registrationscreens` (
    `id`,
    `screenDisplayNo`,
    `name`,
    `isSkippable`,
    `isDisable`
  )
VALUES
  ('5', '5', 'Family Details', '1', '1');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`)
VALUES
  ('6', '6', 'Living Status');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`)
VALUES
  ('7', '7', 'Education Details');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`)
VALUES
  ('8', '8', 'Occupation Details');

INSERT INTO
  `registrationscreens` (
    `id`,
    `screenDisplayNo`,
    `name`,
    `isSkippable`,
    `isDisable`
  )
VALUES
  ('9', '9', 'Astrologic Details', '1', '1');

INSERT INTO
  `registrationscreens` (
    `id`,
    `screenDisplayNo`,
    `name`,
    `isSkippable`,
    `isDisable`
  )
VALUES
  ('10', '10', 'Life Styles', '1', '1');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`)
VALUES
  ('11', '11', 'Partner Preferences');

INSERT INTO
  `registrationscreens` (`id`, `screenDisplayNo`, `name`)
VALUES
  ('12', '12', 'KYC');

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

INSERT INTO
  `valuetypes` (`id`, `valueTypeName`, `description`)
VALUES
  ('11', 'LongText', 'LongText');
