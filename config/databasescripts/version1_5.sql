INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('51', '1', '4', 'copyrightText', 'CopyRight Text', '(©) Copyright 2024 Matrimony. All Rights Reserved.', '(©) Copyright 2024 Matrimony. All Rights Reserved.', '1', '1', '0', '2023-12-27 12:06:37', '2023-12-27 12:06:37', '1', '1');

INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('15', 'App Links', 'App Links', '1', '3', '1', '0', '2023-12-13 15:25:14', '2023-12-13 15:25:14', '1', '1');

INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('49', '15', '1', 'appstore', 'App Store', 'https://www.apple.com/in/app-store/', 'https://www.apple.com/in/app-store/', '1', '1', '0', '2023-12-13 15:28:26', '2023-12-13 15:28:26', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('50', '15', '1', 'playstore', 'Play Store', 'https://www.apple.com/in/app-store/', 'https://www.apple.com/in/app-store/', '1', '1', '0', '2023-12-13 15:28:26', '2023-12-13 15:28:26', '1', '1');

INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('52', '1', '4', 'facebookLink', 'Facebook Link', 'https://www.facebook.com/', 'https://www.facebook.com/', '1', '1', '0', '2023-12-27 12:06:37', '2023-12-27 12:06:37', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('53', '1', '4', 'instagramLink', 'Instagram Link', 'https://www.instagram.com/', 'https://www.instagram.com/', '1', '1', '0', '2023-12-27 12:06:37', '2023-12-27 12:06:37', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('54', '1', '4', 'twitterLink', 'Twitter Link', 'https://x.com/?lang=en', 'https://x.com/?lang=en', '1', '1', '0', '2023-12-27 12:06:37', '2023-12-27 12:06:37', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('55', '1', '4', 'linkedinLink', 'Linkedin Link', 'https://in.linkedin.com/', 'https://in.linkedin.com/', '1', '1', '0', '2023-12-27 12:06:37', '2023-12-27 12:06:37', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('56', '1', '4', 'threadsLink', 'Threads Link', 'https://www.threads.net/login/', 'https://www.threads.net/login/', '1', '1', '0', '2023-12-27 12:06:37', '2023-12-27 12:06:37', '1', '1');

INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('16', 'Social Links', 'Social Links', '1', '3', '1', '0', '2023-12-13 15:25:14', '2023-12-13 15:25:14', '1', '1');

UPDATE `systemflags` SET `flagGroupId` = '1', `valueTypeId` = '4' WHERE (`id` = '51');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1' WHERE (`id` = '52');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1' WHERE (`id` = '53');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1' WHERE (`id` = '54');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1' WHERE (`id` = '55');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1' WHERE (`id` = '56');

UPDATE `systemflags` SET `value` = 'https://www.threads.net/login/' WHERE (`id` = '56');
UPDATE `systemflags` SET `value` = 'https://in.linkedin.com/' WHERE (`id` = '55');
UPDATE `systemflags` SET `value` = 'https://x.com/?lang=en' WHERE (`id` = '54');
UPDATE `systemflags` SET `value` = 'https://www.instagram.com/' WHERE (`id` = '53');
UPDATE `systemflags` SET `value` = 'https://www.facebook.com/' WHERE (`id` = '52');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1', `value` = '(©) Copyright 2024 Matrimony. All Rights Reserved.' WHERE (`id` = '51');

UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1', `value` = '(©) Copyright 2024 Matrimony. All Rights Reserved.' WHERE (`id` = '51');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1' WHERE (`id` = '52');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1', `value` = 'https://www.instagram.com/' WHERE (`id` = '53');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1' WHERE (`id` = '54');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1', `value` = 'https://in.linkedin.com/' WHERE (`id` = '55');
UPDATE `systemflags` SET `flagGroupId` = '16', `valueTypeId` = '1' WHERE (`id` = '56');

INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('17', 'App Name', 'App Name', '1', '3', '1', '0', '2023-12-13 15:25:14', '2023-12-13 15:25:14', '1', '1');

INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('57', '16', '1', 'appName', 'App Name', 'Matrimony', 'Matrimony', '1', '1', '0', '2023-12-27 12:06:37', '2023-12-27 12:06:37', '1', '1');

INSERT INTO `flaggroup` (`id`, `flagGroupName`, `detail`, `parentFlagGroupId`, `displayOrder`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('18', 'Contact Us', 'Contact Us', '1', '3', '1', '0', '2023-12-13 15:25:14', '2023-12-13 15:25:14', '1', '1');

INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('58', '18', '1', 'Address', 'Address', '47 W 13th St, New York, NY 10011, USA', '47 W 13th St, New York, NY 10011, USA', '1', '1', '0', '2023-12-27 12:06:37', '2023-12-27 12:06:37', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('59', '18', '1', 'Email', 'Email', 'support@matrimony.com', 'support@matrimony.com', '1', '1', '0', '2023-12-27 12:06:37', '2023-12-27 12:06:37', '1', '1');
INSERT INTO `systemflags` (`id`, `flagGroupId`, `valueTypeId`, `name`, `displayName`, `value`, `defaultValue`, `autoRender`, `isActive`, `isDelete`, `createdDate`, `modifiedDate`, `createdBy`, `modifiedBy`) VALUES ('60', '18', '1', 'Phone Number', 'Phone Number', '9898989898', '9898989898', '1', '1', '0', '2023-12-27 12:06:37', '2023-12-27 12:06:37', '1', '1');

UPDATE `systemflags` SET `name` = 'address' WHERE (`id` = '58');
UPDATE `systemflags` SET `name` = 'email' WHERE (`id` = '59');
UPDATE `systemflags` SET `name` = 'phoneNumber' WHERE (`id` = '60');