"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOTP = void 0;
exports.deleteImage = deleteImage;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const axios_1 = __importDefault(require("axios"));
const logging_1 = __importDefault(require("../../config/logging"));
const config_1 = __importDefault(require("../../config/config"));
const apiHeader_1 = __importDefault(require("../../middleware/apiHeader"));
const resultsuccess_1 = require("../../classes/response/resultsuccess");
const resulterror_1 = require("../../classes/response/resulterror");
const signJTW_1 = __importDefault(require("../../function/signJTW"));
const refreshToken_1 = __importDefault(require("../../function/refreshToken"));
const users_1 = require("../../classes/output/admin/users");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const notifications_1 = __importDefault(require("./../notifications"));
const customFields_1 = __importDefault(require("../../controllers/app/customFields"));
const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
// const sharp = require('sharp');
var Jimp = require('jimp');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
const nodemailer = require('nodemailer');
const NAMESPACE = 'Users';
const verifyEmailContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Verify Email and Contact');
        let message = '';
        let sql = `SELECT * FROM users `;
        if (req.body.email) {
            if (!sql.includes(` WHERE `)) {
                sql += ` WHERE `;
            }
            else {
                sql += ` AND `;
            }
            sql += ` LOWER(email) = '` + req.body.email.toLowerCase() + `' `;
        }
        if (req.body.contactNo) {
            if (!sql.includes(` WHERE `)) {
                sql += ` WHERE `;
            }
            else {
                sql += ` OR `;
            }
            sql += ` contactNo = '` + req.body.contactNo + `' `;
        }
        let result = yield apiHeader_1.default.query(sql);
        if (result && result.length > 0) {
            if (req.body.email && !req.body.contactNo) {
                if (req.body.email.toLowerCase() == result[0].email.toLowerCase()) {
                    message = 'Email Already Exist';
                }
            }
            if (req.body.contactNo && !req.body.email) {
                if (req.body.contactNo == result[0].contactNo) {
                    message = 'ContactNo Already Exist';
                }
            }
            if (req.body.contactNo && req.body.email) {
                if (req.body.email.toLowerCase() == result[0].email.toLowerCase()) {
                    message = 'Email Already Exist';
                }
                if (req.body.contactNo == result[0].contactNo) {
                    if (message) {
                        message += ' and ContactNo Already Exist change both';
                    }
                    else {
                        message = 'ContactNo Already Exist';
                    }
                }
            }
            let errorResult = new resulterror_1.ResultError(203, true, message, new Error(message), '');
            next(errorResult);
            // let successResult = new ResultSuccess(200, true, message, result, 1, "null");
            // return res.status(200).send(successResult);
        }
        else {
            let successResult = new resultsuccess_1.ResultSuccess(200, true, message, [], 1, 'null');
            return res.status(200).send(successResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getUsers() Exception', error, '');
        next(errorResult);
    }
});
const getAuthProvider = (searchString) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        let sql = 'SELECT * FROM authproviders WHERE isActive = 1 AND isDelete = 0';
        if (searchString != undefined) {
            if (!sql.includes('WHERE')) {
                sql += ' WHERE ';
            }
            else {
                sql += ' AND ';
            }
            sql += " (providerName LIKE '%" + searchString + "%')";
        }
        result = yield apiHeader_1.default.query(sql);
        result = JSON.parse(JSON.stringify(result));
    }
    catch (err) {
        result = err;
    }
    return result;
});
const addUserAuthData = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        body.description = body.description ? body.description : '';
        let checkSql = `SELECT * FROM userauthdata WHERE userId = ` + body.userId + ` AND authProviderId=` + body.authProviderId;
        let checkResult = yield apiHeader_1.default.query(checkSql);
        if (checkResult && checkResult.length > 0) {
            let sql = `UPDATE userauthdata SET  oAuthAccessToken =  '` +
                body.oAuthAccessToken +
                `', oAuthUserPicUrl = '` +
                body.oAuthUserPicUrl +
                `'
            ,authProviderId = ` +
                body.authProviderId +
                `, modifiedDate = ? WHERE userId = ` +
                body.userId +
                ``;
            result = yield apiHeader_1.default.query(sql, [new Date(new Date().toUTCString())]);
            if (result.changedRows > 0) {
                result = JSON.parse(JSON.stringify(result));
            }
        }
        else {
            let sql = `INSERT INTO userauthdata (userId, oAuthUserId, oAuthUserName, oAuthUserPicUrl, oAuthAccessToken, authProviderId, description) 
            VALUES (` +
                body.userId +
                `,'` +
                body.oAuthUserId +
                `','` +
                body.oAuthUserName +
                `','` +
                body.oAuthUserPicUrl +
                `','` +
                body.oAuthAccessToken +
                `',` +
                body.authProviderId +
                `,'` +
                body.description +
                `')`;
            let result = yield apiHeader_1.default.query(sql);
            if (result.affectedRows > 0) {
                result = JSON.parse(JSON.stringify(result));
            }
            else {
                result = JSON.parse(JSON.stringify(result));
            }
        }
    }
    catch (error) {
        return error;
    }
    return result;
});
const updateUserAuthLoginData = (body) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        let updatedDate = new Date(new Date().toUTCString());
        let sql = `UPDATE userauthdata SET  oAuthAccessToken =  '` +
            body.oAuthAccessToken +
            `', oAuthUserPicUrl = '` +
            body.oAuthUserPicUrl +
            `',authProviderId = ` +
            body.authProviderId +
            `, modifiedDate = '` +
            updatedDate +
            `' WHERE oAuthUserId = '` +
            body.oAuthUserId +
            `' AND userId = ` +
            body.userId +
            ``;
        result = yield apiHeader_1.default.query(sql);
        if (result.changedRows > 0) {
            result = JSON.parse(JSON.stringify(result));
        }
    }
    catch (error) {
        return error;
    }
    return result;
});
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'SignUp');
        let insertRefTokenResult;
        let deviceDetailResult;
        let requiredFields = ['email', 'contactNo', 'password'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userDevice = authorizationResult.currentUserDevice;
                let appId;
                if (userDevice.app == 'MatrimonyAdmin') {
                    appId = 1;
                }
                else if (userDevice.app == 'MatrimonyAndroid') {
                    appId = 2;
                }
                else {
                    appId = 3;
                }
                req.body.imageId = req.body.imageId ? req.body.imageId : null;
                yield apiHeader_1.default.beginTransaction();
                let checkEmail = `SELECT * FROM users WHERE email = '` + req.body.email + `'`;
                let checkEmailResult = yield apiHeader_1.default.query(checkEmail);
                if (checkEmailResult && checkEmailResult.length > 0) {
                    yield apiHeader_1.default.rollback();
                    let successResult = 'Email Already Inserted';
                    return res.status(200).send(successResult);
                }
                else {
                    bcryptjs_1.default.hash(req.body.password, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                        if (hashError) {
                            return res.status(401).json({
                                message: hashError.message,
                                error: hashError
                            });
                        }
                        let sql = `INSERT INTO users(contactNo, email, password, isDisable, referalUserId) VALUES ('` +
                            req.body.contactNo +
                            `','` +
                            req.body.email +
                            `','` +
                            hash +
                            `', 0,` +
                            (req.body.referalUserId ? req.body.referalUserId : null) +
                            `)`;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.insertId > 0) {
                            let userId = result.insertId;
                            let userRoleSql = `INSERT INTO userroles(userId, roleId) VALUES (` + userId + `, 2) `;
                            result = yield apiHeader_1.default.query(userRoleSql);
                            if (result && result.affectedRows > 0) {
                                if (userDevice) {
                                    userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                    let deviceDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) 
                                    VALUES(` +
                                        userId +
                                        `,` +
                                        appId +
                                        `,'` +
                                        userDevice.deviceId +
                                        `','` +
                                        userDevice.fcmToken +
                                        `','` +
                                        userDevice.deviceLocation +
                                        `','` +
                                        userDevice.deviceManufacturer +
                                        `','` +
                                        userDevice.deviceModel +
                                        `','` +
                                        userDevice.apiCallTime +
                                        `')`;
                                    deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                }
                                let userFlag = yield apiHeader_1.default.query(`SELECT * FROM userflags`);
                                if (userFlag && userFlag.length > 0) {
                                    for (let index = 0; index < userFlag.length; index++) {
                                        let userFlagSql = `INSERT INTO userflagvalues(userId, userFlagId, userFlagValue) VALUES (` + userId + `, ` + userFlag[index].id + `, '` + userFlag[index].defaultValue + `')`;
                                        let userFlagSqlResult = yield apiHeader_1.default.query(userFlagSql);
                                    }
                                }
                                let userPerDetailSql = `SELECT u.id, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome,  h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                 WHERE ur.roleId = 2 AND u.id =  ` +
                                    userId +
                                    ``;
                                let userResult = yield apiHeader_1.default.query(userPerDetailSql);
                                if (userResult && userResult.length > 0) {
                                    for (let i = 0; i < userResult.length; i++) {
                                        let userDetailResponse = yield customFields_1.default.getUserData(userResult[i]);
                                        userResult[i] = Object.assign(Object.assign({}, userResult[i]), userDetailResponse);
                                    }
                                }
                                let signJWTResult = yield (0, signJTW_1.default)(userResult[0]);
                                if (signJWTResult && signJWTResult.token) {
                                    userResult[0].token = signJWTResult.token;
                                    let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                                    //insert refresh token
                                    let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                                    insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                                    if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                        userResult[0].refreshToken = refreshToken.token;
                                        let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                        LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                        WHERE ufv.userId = ` +
                                            userId +
                                            ``;
                                        userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                        var authProvider = yield getAuthProvider(req.body.oAuthProviderName);
                                        if (authProvider.length > 0 && req.body.oAuthUserId) {
                                            let data = {
                                                userId: userId,
                                                oAuthUserId: req.body.oAuthUserId,
                                                oAuthUserName: req.body.oAuthUserName,
                                                oAuthUserPicUrl: req.body.oAuthUserPicUrl,
                                                oAuthAccessToken: req.body.oAuthAccessToken,
                                                authProviderId: authProvider[0].id,
                                                description: req.body.description ? req.body.description : ''
                                            };
                                            let userOauthDataResult = yield addUserAuthData(data);
                                            if (userOauthDataResult && userOauthDataResult.affectedRows <= 0) {
                                                yield apiHeader_1.default.rollback();
                                            }
                                        }
                                        let todayDate = new Date();
                                        let date = new Date(todayDate).getFullYear() +
                                            '-' +
                                            ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) +
                                            '-' +
                                            ('0' + new Date(todayDate).getDate()).slice(-2) +
                                            '';
                                        let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                        LEFT JOIN package p ON p.id = up.packageId
                                        LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                        WHERE up.userId = ` +
                                            userId +
                                            ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                        order by p.weightage DESC`;
                                        let userPackage = yield apiHeader_1.default.query(userPackages);
                                        if (userPackage && userPackage.length > 0) {
                                            for (let k = 0; k < userPackage.length; k++) {
                                                let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                 WHERE pf.packageId = ` + userPackage[k].packageId);
                                                userPackage[k].packageFacility = packageFacility;
                                            }
                                        }
                                        userResult[0].userPackage = userPackage[0];
                                        // let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                        //     FROM users u
                                        //     LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                        //     LEFT JOIN userroles ur ON ur.userId = u.id
                                        //     WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                        // let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                        //     FROM users u
                                        //     LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                        //     LEFT JOIN userroles ur ON ur.userId = u.id
                                        //     WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                        // let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                        // let occupationResult = await header.query(occupationSql);
                                        // let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                        // let educationResult = await header.query(educationSql);
                                        // let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                        // let maritalStatusResult = await header.query(maritalStatusSql);
                                        // let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                        // let religionResult = await header.query(religionSql);
                                        // let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                        // let communityResult = await header.query(communitySql);
                                        // let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                        // let subCommunityResult = await header.query(subCommunitySql);
                                        // let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                        // let dietResult = await header.query(dietSql);
                                        // let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                        // let heightResult = await header.query(heightSql);
                                        // let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                        // let annualIncomeResult = await header.query(annualIncomeSql);
                                        // let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                        // let employmentTypeResult = await header.query(employmentTypeSql);
                                        // let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                        // let documentTypeResult = await header.query(documentTypeSql);
                                        // userResult[0].masterEntryData = {
                                        //     "occupation": occupationResult,
                                        //     "education": educationResult,
                                        //     "maritalStatus": maritalStatusResult,
                                        //     "religion": religionResult,
                                        //     "community": communityResult,
                                        //     "subCommunity": subCommunityResult,
                                        //     "diet": dietResult,
                                        //     "height": heightResult,
                                        //     "annualIncome": annualIncomeResult,
                                        //     "employmentType": employmentTypeResult,
                                        //     "maxAge": maxAge[0].maxAge,
                                        //     "minAge": minAge[0].minAge,
                                        //     "documentType": documentTypeResult
                                        // }
                                        userResult[0].isVerified = false;
                                        let isVerified = true;
                                        let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + userResult[0].id;
                                        let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                        userResult[0].userDocuments = documentsResult;
                                        if (documentsResult && documentsResult.length > 0) {
                                            for (let j = 0; j < documentsResult.length; j++) {
                                                if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                    isVerified = false;
                                                }
                                            }
                                        }
                                        else {
                                            isVerified = false;
                                        }
                                        userResult[0].isVerifiedProfile = isVerified;
                                        if (req.body.password) {
                                            userResult[0].isOAuth = false;
                                        }
                                        else {
                                            userResult[0].isOAuth = true;
                                        }
                                        userResult[0].isAppleLogin = authProvider[0].id == 3 ? true : false;
                                        userResult[0].userWalletAmount = 0;
                                        let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                        let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                        if (getUserWalletResult && getUserWalletResult.length > 0) {
                                            userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                        }
                                        if (userResult[0].isDemoUser == 1) {
                                            userResult[0].isDemoUser = true;
                                        }
                                        else {
                                            userResult[0].isDemoUser = false;
                                        }
                                        yield apiHeader_1.default.commit();
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Login User', userResult, 1, '');
                                        return res.status(200).send(successResult);
                                    }
                                    else {
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    return res.status(401).json({
                                        message: 'Unable to Sign JWT',
                                        error: signJWTResult.error
                                    });
                                }
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                            next(errorResult);
                        }
                    }));
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.signUp() Exception', error, '');
        next(errorResult);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Login');
        const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
        console.log(isCustomFieldEnabled);
        if (req.body.isOAuth) {
            let requiredFields = ['email'];
            let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
            if (validationResult && validationResult.statusCode == 200) {
                let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
                if (authorizationResult.statusCode == 200) {
                    let userDevice = authorizationResult.currentUserDevice;
                    let deviceDetailResult;
                    let appId;
                    if (userDevice.app == 'MatrimonyAdmin') {
                        appId = 1;
                    }
                    else if (userDevice.app == 'MatrimonyAndroid') {
                        appId = 2;
                    }
                    else {
                        appId = 3;
                    }
                    yield apiHeader_1.default.beginTransaction();
                    let userId;
                    let insertRefTokenResult;
                    let _UserData;
                    let _ValidateUser = yield apiHeader_1.default.query(`SELECT * FROM users WHERE email = '` + req.body.email + `'`);
                    // checking if this email already registered using simple email password method
                    if (_ValidateUser && _ValidateUser.length > 0 && _ValidateUser[0].password != undefined) {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'This email is already registered using a password', [], 1, '');
                        return res.status(200).send(successResult);
                    }
                    if (_ValidateUser && _ValidateUser.length <= 0) {
                        let sql = `INSERT INTO users(email, isDisable, referalUserId) VALUES ('` + req.body.email + `', 0, ` + (req.body.referalUserId ? req.body.referalUserId : null) + `)`;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.insertId > 0) {
                            let userId = result.insertId;
                            let userRoleSql = `INSERT INTO userroles(userId, roleId) VALUES (` + userId + `, 2) `;
                            result = yield apiHeader_1.default.query(userRoleSql);
                            if (result && result.affectedRows > 0) {
                                if (userDevice) {
                                    userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                    let deviceDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) VALUES(` +
                                        userId +
                                        `,` +
                                        appId +
                                        `,'` +
                                        userDevice.deviceId +
                                        `','` +
                                        userDevice.fcmToken +
                                        `','` +
                                        userDevice.deviceLocation +
                                        `','` +
                                        userDevice.deviceManufacturer +
                                        `','` +
                                        userDevice.deviceModel +
                                        `','` +
                                        userDevice.apiCallTime +
                                        `')`;
                                    deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                }
                                let userFlag = yield apiHeader_1.default.query(`SELECT * FROM userflags`);
                                if (userFlag && userFlag.length > 0) {
                                    for (let index = 0; index < userFlag.length; index++) {
                                        let userFlagSql = `INSERT INTO userflagvalues(userId, userFlagId, userFlagValue) VALUES (` + userId + `, ` + userFlag[index].id + `, ` + userFlag[index].defaultValue + `)`;
                                        let userFlagSqlResult = yield apiHeader_1.default.query(userFlagSql);
                                    }
                                }
                                var authProvider = yield getAuthProvider(req.body.oAuthProviderName);
                                if (authProvider.length > 0) {
                                    let data = {
                                        userId: userId,
                                        oAuthUserId: req.body.oAuthUserId,
                                        oAuthUserName: req.body.oAuthUserName,
                                        oAuthUserPicUrl: req.body.oAuthUserPicUrl,
                                        oAuthAccessToken: req.body.oAuthAccessToken,
                                        authProviderId: authProvider[0].id,
                                        description: req.body.description ? req.body.description : ''
                                    };
                                    let userOauthDataResult = yield addUserAuthData(data);
                                    if (userOauthDataResult && userOauthDataResult.affectedRows <= 0) {
                                        yield apiHeader_1.default.rollback();
                                    }
                                }
                                let userPerDetailSql = `SELECT u.id,udd.fcmtoken,img.imageUrl,u.stripeCustomerId, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome,  h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                     WHERE ur.roleId = 2
                                      AND u.id =  ` +
                                    userId +
                                    ``;
                                let userResult = yield apiHeader_1.default.query(userPerDetailSql);
                                if (userResult && userResult.length > 0) {
                                    for (let i = 0; i < userResult.length; i++) {
                                        let userDetailResponse = yield customFields_1.default.getUserData(userResult[i]);
                                        userResult[i] = Object.assign(Object.assign({}, userResult[i]), userDetailResponse);
                                    }
                                    // for (let detail of userResult) {
                                    //     let userDetailResponse: any = await controller.getUserResponse(detail.permanentAddress, detail.currentAddress, detail.familyDetail, detail.fatherDetails, detail.motherDetails,
                                    //         detail.pCountryLivingInId, detail.pCityLivingInId, detail.pReligionId, detail.pCommunityId, detail.pStateLivingInId, detail.pEducationMediumId, detail.pOccupationId,
                                    //         detail.pEmploymentTypeId, detail.pMaritalStatusId, detail.pAnnualIncomeId, detail.pDietId, detail.pEducationTypeId, detail.pComplexion, detail.pBodyType);
                                    //     console.log(userDetailResponse);
                                    //     // detail = { ...detail, ...userDetailResponse };
                                    //     detail.permanentAddress = userDetailResponse.permanentAddress
                                    //     detail.currentAddress = userDetailResponse.currentAddress
                                    //     detail.familyDetail = userDetailResponse.familyDetail
                                    //     detail.fatherDetails = userDetailResponse.fatherDetails
                                    //     detail.motherDetails = userDetailResponse.motherDetail
                                    //     detail.pCountryLivingInId = userDetailResponse.pCountryLivingInId
                                    //     detail.pCityLivingInId = userDetailResponse.pCityLivingInId
                                    //     detail.pReligionId = userDetailResponse.pReligionId;
                                    //     detail.pCommunityId = userDetailResponse.pCommunityId;
                                    //     detail.pStateLivingInId = userDetailResponse.pStateLivingInId;
                                    //     detail.pEducationMediumId = userDetailResponse.pEducationMediumId;
                                    //     detail.pEducationTypeId = userDetailResponse.pEducationTypeId;
                                    //     detail.pOccupationId = userDetailResponse.pOccupationId;
                                    //     detail.pEmploymentTypeId = userDetailResponse.pEmploymentTypeId;
                                    //     detail.pAnnualIncomeId = userDetailResponse.pAnnualIncomeId;
                                    //     detail.pDietId = userDetailResponse.pDietId;
                                    //     detail.pMaritalStatusId = userDetailResponse.pMaritalStatusId;
                                    //     detail.pCountries = userDetailResponse.pCountries;
                                    //     detail.pReligions = userDetailResponse.pReligions;
                                    //     detail.pCommunities = userDetailResponse.pCommunities;
                                    //     detail.pStates = userDetailResponse.pStates;
                                    //     detail.pEducationMedium = userDetailResponse.pEducationMedium;
                                    //     detail.pOccupation = userDetailResponse.pOccupation;
                                    //     detail.pEmploymentType = userDetailResponse.pEmploymentType;
                                    //     detail.pAnnualIncome = userDetailResponse.pAnnualIncome;
                                    //     detail.pMaritalStatus = userDetailResponse.pMaritalStatus,
                                    //     detail.pDiet = userDetailResponse.pDiet,
                                    //     detail.pComplexion = userDetailResponse.pComplexion
                                    //     detail.pBodyType = userDetailResponse.pBodyType
                                    //     // detail.permanentAddress = detail.permanentAddress ? JSON.parse(detail.permanentAddress) : null;
                                    //     // detail.currentAddress = detail.currentAddress ? JSON.parse(detail.currentAddress) : null;
                                    //     // detail.familyDetail = detail.familyDetail ? JSON.parse(detail.familyDetail) : null;
                                    //     // detail.fatherDetails = detail.fatherDetails ? JSON.parse(detail.fatherDetails) : null;
                                    //     // detail.motherDetails = detail.motherDetails ? JSON.parse(detail.motherDetails) : null;
                                    // }
                                }
                                let signJWTResult = yield (0, signJTW_1.default)(userResult[0]);
                                if (signJWTResult && signJWTResult.token) {
                                    userResult[0].token = signJWTResult.token;
                                    let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                                    //insert refresh token
                                    let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                                    insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                                    if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                        userResult[0].refreshToken = refreshToken.token;
                                        let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                            LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                            WHERE ufv.userId = ` +
                                            userId +
                                            ``;
                                        userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                        let todayDate = new Date();
                                        let date = new Date(todayDate).getFullYear() +
                                            '-' +
                                            ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) +
                                            '-' +
                                            ('0' + new Date(todayDate).getDate()).slice(-2) +
                                            '';
                                        let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value FROM userpackage up
                                            LEFT JOIN package p ON p.id = up.packageId
                                            LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                            LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                WHERE up.userId = ` +
                                            userId +
                                            ` order by createdDate DESC`;
                                        let userPackage = yield apiHeader_1.default.query(userPackages);
                                        if (userPackage && userPackage.length > 0) {
                                            for (let k = 0; k < userPackage.length; k++) {
                                                let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                    LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                     WHERE pf.packageId = ` + userPackage[k].packageId);
                                                userPackage[k].packageFacility = packageFacility;
                                            }
                                        }
                                        userResult[0].userPackage = userPackage[0];
                                        // let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                        //         FROM users u
                                        //         LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                        //         LEFT JOIN userroles ur ON ur.userId = u.id
                                        //         WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                        // let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                        //         FROM users u
                                        //         LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                        //         LEFT JOIN userroles ur ON ur.userId = u.id
                                        //         WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                        // let ageList = [];
                                        // for (let i = 18; i <= 60; i++) {
                                        //     ageList.push(i)
                                        // }
                                        // let cityName = await header.query(`select (cityName) FROM addresses where cityName is not null or cityName !='' group by cityName  having  cityName !=''`)
                                        // let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                        // let occupationResult = await header.query(occupationSql);
                                        // let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                        // let educationResult = await header.query(educationSql);
                                        // let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                        // let maritalStatusResult = await header.query(maritalStatusSql);
                                        // let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                        // let religionResult = await header.query(religionSql);
                                        // let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                        // let communityResult = await header.query(communitySql);
                                        // let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                        // let subCommunityResult = await header.query(subCommunitySql);
                                        // let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                        // let dietResult = await header.query(dietSql);
                                        // let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                        // let heightResult = await header.query(heightSql);
                                        // let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                        // let annualIncomeResult = await header.query(annualIncomeSql);
                                        // let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                        // let employmentTypeResult = await header.query(employmentTypeSql);
                                        // let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                        // let documentTypeResult = await header.query(documentTypeSql);
                                        // userResult[0].masterEntryData = {
                                        //     "occupation": occupationResult,
                                        //     "education": educationResult,
                                        //     "maritalStatus": maritalStatusResult,
                                        //     "religion": religionResult,
                                        //     "community": communityResult,
                                        //     "subCommunity": subCommunityResult,
                                        //     "diet": dietResult,
                                        //     "height": heightResult,
                                        //     "annualIncome": annualIncomeResult,
                                        //     "employmentType": employmentTypeResult,
                                        //     "maxAge": maxAge[0].maxAge,
                                        //     "minAge": minAge[0].minAge,
                                        //     "ageList": ageList,
                                        //     "cityName": cityName,
                                        //     "documentType": documentTypeResult
                                        // }
                                        userResult[0].isVerified = false;
                                        let isVerified = true;
                                        let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + userResult[0].id;
                                        let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                        userResult[0].userDocuments = documentsResult;
                                        if (documentsResult && documentsResult.length > 0) {
                                            for (let j = 0; j < documentsResult.length; j++) {
                                                if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                    isVerified = false;
                                                }
                                            }
                                        }
                                        else {
                                            isVerified = false;
                                        }
                                        userResult[0].isVerifiedProfile = isVerified;
                                        userResult[0].isOAuth = true;
                                        userResult[0].isAppleLogin = authProvider[0].id == 3 ? true : false;
                                        if (userResult[0].isVerifyProfilePic) {
                                            userResult[0].isVerifyProfilePic = true;
                                        }
                                        else {
                                            userResult[0].isVerifyProfilePic = false;
                                        }
                                        userResult[0].userWalletAmount = 0;
                                        let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                        let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                        if (getUserWalletResult && getUserWalletResult.length > 0) {
                                            userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                        }
                                        userResult[0].totalView = 0;
                                        userResult[0].todayView = 0;
                                        let totalViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + userResult[0].id;
                                        let totalViewResult = yield apiHeader_1.default.query(totalViewSql);
                                        if (totalViewResult && totalViewResult.length > 0) {
                                            userResult[0].totalView = totalViewResult[0].totalView;
                                        }
                                        let todayViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + userResult[0].id + ` AND DATE(transactionDate) = DATE(CURRENT_TIMESTAMP())`;
                                        let todayViewResult = yield apiHeader_1.default.query(todayViewSql);
                                        if (todayViewResult && todayViewResult.length > 0) {
                                            userResult[0].todayView = todayViewResult[0].totalView;
                                        }
                                        let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(userResult[0].id);
                                        if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                                            // console.log(_customFieldDataResult);
                                            userResult[0].customFields = _customFieldDataResult;
                                        }
                                        // region to get user personal custom data
                                        // if (isCustomFieldEnabled) {
                                        //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + userResult[0].id;
                                        //     let userCustomDataResult = await header.query(userCustomDataSql);
                                        //     let customdata: any[] = [];
                                        //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                                        //         const userCustomDataArrays = [];
                                        //         const keys = Object.keys(userCustomDataResult[0]);
                                        //         userCustomDataArrays.push(keys);
                                        //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                                        //         for (let i = 0; i < filteredColumns.length; i++) {
                                        //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[i] + `' and isActive = 1`;
                                        //             let result = await header.query(sql);
                                        //             let userDataSql = `SELECT ` + filteredColumns[i] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + userResult[0].id;
                                        //             let userDataResult = await header.query(userDataSql);
                                        //             let mergedResult = Object.assign({}, result[0], userDataResult[0]);
                                        //             customdata.push(mergedResult);
                                        //             console.log(userCustomDataResult);
                                        //         }
                                        //         if (customdata && customdata.length > 0) {
                                        //             for (let i = 0; i < customdata.length; i++) {
                                        //                 if (customdata[i].valueList) {
                                        //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                                        //                     customdata[i].valueList = valueListArray;
                                        //                 }
                                        //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                                        //                     if (customdata[i].valueTypeId == 10 || customdata[i].valueTypeId == 3) {
                                        //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                                        //                         customdata[i].value = valueArray;
                                        //                     }
                                        //                 }
                                        //             }
                                        //         }
                                        //         userResult[0].customFields = customdata;
                                        //     }
                                        // }
                                        // else {
                                        //     await header.rollback();
                                        //     let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                                        //     next(errorResult);
                                        // }
                                        // end region to get user personal custom data 
                                        if (userResult[0].isDemoUser == 1) {
                                            userResult[0].isDemoUser = true;
                                        }
                                        else {
                                            userResult[0].isDemoUser = false;
                                        }
                                        yield apiHeader_1.default.commit();
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Login User', userResult, 1, '');
                                        return res.status(200).send(successResult);
                                    }
                                    else {
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    return res.status(401).json({
                                        message: 'Unable to Sign JWT',
                                        error: signJWTResult.error
                                    });
                                }
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                            next(errorResult);
                        }
                    }
                    else {
                        let isAppleLogin = false;
                        if (req.body.isAppleLogin) {
                            _UserData = yield apiHeader_1.default.query(`SELECT * FROM userauthdata WHERE oAuthUserId = '` + req.body.oAuthUserId + `'`);
                            userId = _UserData[0].userId;
                            isAppleLogin = true;
                        }
                        else {
                            _UserData = yield apiHeader_1.default.query(`SELECT uad.* FROM users u
                                Inner JOIN userauthdata uad ON uad.userId = u.id
                                WHERE u.email = '` +
                                req.body.email +
                                `' AND oAuthUserId = '` +
                                req.body.oAuthUserId +
                                `'`);
                            if (_UserData.length > 0) {
                                userId = _UserData[0].id;
                            }
                        }
                        if (_UserData && _UserData.length <= 0) {
                            _UserData = yield apiHeader_1.default.query(`SELECT * FROM users WHERE email = '` + req.body.email + `'`);
                            if (_UserData && _UserData.length > 0) {
                                let checkuserflagvalues = yield apiHeader_1.default.query(`SELECT * FROM userflagvalues WHERE userId = ` + _UserData[0].id);
                                if (checkuserflagvalues && checkuserflagvalues.length <= 0) {
                                    let userFlag = yield apiHeader_1.default.query(`SELECT * FROM userflags`);
                                    if (userFlag && userFlag.length > 0) {
                                        for (let index = 0; index < userFlag.length; index++) {
                                            let userFlagSql = `INSERT INTO userflagvalues(userId, userFlagId, userFlagValue) VALUES (` +
                                                _UserData[0].id +
                                                `, ` +
                                                userFlag[index].id +
                                                `, ` +
                                                userFlag[index].defaultValue +
                                                `)`;
                                            let userFlagSqlResult = yield apiHeader_1.default.query(userFlagSql);
                                        }
                                    }
                                }
                                // _UserData[0].userId = _UserData[0].id
                                var authProvider = yield getAuthProvider(req.body.oAuthProviderName);
                                if (authProvider.length > 0) {
                                    let data = {
                                        userId: _UserData[0].id,
                                        oAuthUserId: req.body.oAuthUserId,
                                        oAuthUserName: req.body.oAuthUserName,
                                        oAuthUserPicUrl: req.body.oAuthUserPicUrl,
                                        oAuthAccessToken: req.body.oAuthAccessToken,
                                        authProviderId: authProvider[0].id,
                                        description: req.body.description ? req.body.description : ''
                                    };
                                    let userOauthDataResult = yield addUserAuthData(data);
                                    if (userOauthDataResult && userOauthDataResult.affectedRows <= 0) {
                                        yield apiHeader_1.default.rollback();
                                    }
                                }
                            }
                            else {
                            }
                        }
                        else {
                            var authProvider = yield getAuthProvider(req.body.oAuthProviderName);
                            if (authProvider.length > 0) {
                                let data = {
                                    oAuthAccessToken: _UserData[0].oAuthAccessToken,
                                    oAuthUserPicUrl: _UserData[0].oAuthUserPicUrl,
                                    oAuthUserId: _UserData[0].oAuthUserId,
                                    userId: _UserData[0].userId,
                                    authProviderId: authProvider[0].id
                                };
                                yield updateUserAuthLoginData(data);
                            }
                        }
                        let result = [];
                        result.push({ id: _UserData[0].userId ? _UserData[0].userId : _UserData[0].id });
                        userId = result[0].id;
                        let userPerDetailSql = `SELECT u.id,udd.fcmtoken,img.imageUrl,u.stripeCustomerId, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome,  h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                             WHERE ur.roleId = 2
                              AND u.email =  '` +
                            req.body.email +
                            `' `;
                        let userResult = yield apiHeader_1.default.query(userPerDetailSql);
                        if (userResult && userResult.length > 0) {
                            for (let i = 0; i < userResult.length; i++) {
                                let userDetailResponse = yield customFields_1.default.getUserData(userResult[i]);
                                userResult[i] = Object.assign(Object.assign({}, userResult[i]), userDetailResponse);
                            }
                            // for (let detail of userResult) {
                            //     let userDetailResponse: any = await controller.getUserResponse(detail.permanentAddress, detail.currentAddress, detail.familyDetail, detail.fatherDetails, detail.motherDetails,
                            //         detail.pCountryLivingInId, detail.pCityLivingInId, detail.pReligionId, detail.pCommunityId, detail.pStateLivingInId, detail.pEducationMediumId, detail.pOccupationId,
                            //         detail.pEmploymentTypeId, detail.pMaritalStatusId, detail.pAnnualIncomeId, detail.pDietId, detail.pEducationTypeId, detail.pComplexion, detail.pBodyType);
                            //     // detail = { ...detail, ...userDetailResponse };
                            //     console.log(userDetailResponse);
                            //     detail.permanentAddress = userDetailResponse.permanentAddress
                            //     detail.currentAddress = userDetailResponse.currentAddress
                            //     detail.familyDetail = userDetailResponse.familyDetail
                            //     detail.fatherDetails = userDetailResponse.fatherDetails
                            //     detail.motherDetails = userDetailResponse.motherDetail
                            //     detail.pCountryLivingInId = userDetailResponse.pCountryLivingInId
                            //     detail.pCityLivingInId = userDetailResponse.pCityLivingInId
                            //     detail.pReligionId = userDetailResponse.pReligionId;
                            //     detail.pCommunityId = userDetailResponse.pCommunityId;
                            //     detail.pStateLivingInId = userDetailResponse.pStateLivingInId;
                            //     detail.pEducationMediumId = userDetailResponse.pEducationMediumId;
                            //     detail.pEducationTypeId = userDetailResponse.pEducationTypeId;
                            //     detail.pOccupationId = userDetailResponse.pOccupationId;
                            //     detail.pEmploymentTypeId = userDetailResponse.pEmploymentTypeId;
                            //     detail.pAnnualIncomeId = userDetailResponse.pAnnualIncomeId;
                            //     detail.pDietId = userDetailResponse.pDietId;
                            //     detail.pMaritalStatusId = userDetailResponse.pMaritalStatusId;
                            //     detail.pCountries = userDetailResponse.pCountries;
                            //     detail.pReligions = userDetailResponse.pReligions;
                            //     detail.pCommunities = userDetailResponse.pCommunities;
                            //     detail.pStates = userDetailResponse.pStates;
                            //     detail.pEducationMedium = userDetailResponse.pEducationMedium;
                            //     detail.pOccupation = userDetailResponse.pOccupation;
                            //     detail.pEmploymentType = userDetailResponse.pEmploymentType;
                            //     detail.pAnnualIncome = userDetailResponse.pAnnualIncome;
                            //     detail.pMaritalStatus = userDetailResponse.pMaritalStatus,
                            //         detail.pDiet = userDetailResponse.pDiet
                            //     detail.pComplexion = userDetailResponse.pComplexion
                            //     detail.pBodyType = userDetailResponse.pBodyType
                            // }
                        }
                        if (userResult && userResult.length > 0) {
                            let checkbloclsql = `SELECT * FROM userblockrequest WHERE blockRequestUserId = ` + userResult[0].id;
                            let checkbloclResult = yield apiHeader_1.default.query(checkbloclsql);
                            if (checkbloclResult && checkbloclResult.length > 0) {
                                let successResult = new resultsuccess_1.ResultSuccess(401, true, 'Your account was bloacked', [], 1, '');
                                return res.status(200).send(successResult);
                            }
                            else {
                                let signJWTResult = yield (0, signJTW_1.default)(result[0]);
                                if (signJWTResult && signJWTResult.token) {
                                    userResult[0].token = signJWTResult.token;
                                    if (userDevice) {
                                        let checkDeviceSql = `SELECT * FROM userdevicedetail WHERE userId = ` + userId + ``;
                                        result = yield apiHeader_1.default.query(checkDeviceSql);
                                        userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                        if (result && result.length > 0) {
                                            let updateDetailSql = `UPDATE userdevicedetail SET userId = ` +
                                                userId +
                                                `,applicationId = ` +
                                                appId +
                                                `,deviceId = '` +
                                                userDevice.deviceId +
                                                `',fcmToken = '` +
                                                userDevice.fcmToken +
                                                `',deviceLocation = '` +
                                                userDevice.deviceLocation +
                                                `',deviceManufacturer = '` +
                                                userDevice.deviceManufacturer +
                                                `',deviceModel = '` +
                                                userDevice.deviceModel +
                                                `',apiCallTime = '` +
                                                userDevice.apiCallTime +
                                                `' WHERE userId = ` +
                                                userId;
                                            result = yield apiHeader_1.default.query(updateDetailSql);
                                        }
                                        else {
                                            let insertDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) VALUES(` +
                                                userId +
                                                `,` +
                                                appId +
                                                `,'` +
                                                userDevice.deviceId +
                                                `','` +
                                                userDevice.fcmToken +
                                                `','` +
                                                userDevice.deviceLocation +
                                                `','` +
                                                userDevice.deviceManufacturer +
                                                `','` +
                                                userDevice.deviceModel +
                                                `','` +
                                                userDevice.apiCallTime +
                                                `')`;
                                            result = yield apiHeader_1.default.query(insertDetailSql);
                                        }
                                    }
                                    let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                                    //insert refresh token
                                    let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                                    insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                                    if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                        userResult[0].refreshToken = refreshToken.token;
                                        let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                    LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                    WHERE ufv.userId = ` +
                                            userId +
                                            ``;
                                        userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                        let todayDate = new Date();
                                        let date = new Date(todayDate).getFullYear() +
                                            '-' +
                                            ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) +
                                            '-' +
                                            ('0' + new Date(todayDate).getDate()).slice(-2) +
                                            '';
                                        let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                    LEFT JOIN package p ON p.id = up.packageId
                                    LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                    LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                        WHERE up.userId = ` +
                                            userId +
                                            ` AND DATE(up.startDate) <+ DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                        ORDER BY p.weightage DESC`;
                                        let userPackage = yield apiHeader_1.default.query(userPackages);
                                        if (userPackage && userPackage.length > 0) {
                                            for (let k = 0; k < userPackage.length; k++) {
                                                let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                            LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                             WHERE pf.packageId = ` + userPackage[k].packageId);
                                                userPackage[k].packageFacility = packageFacility;
                                            }
                                        }
                                        userResult[0].userPackage = userPackage[0];
                                        //     let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                        // FROM users u
                                        // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                        // LEFT JOIN userroles ur ON ur.userId = u.id
                                        // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                        //     let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                        // FROM users u
                                        // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                        // LEFT JOIN userroles ur ON ur.userId = u.id
                                        // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                        //     let ageList = [];
                                        //     for (let i = 18; i <= 60; i++) {
                                        //         ageList.push(i)
                                        //     }
                                        //     let cityName = await header.query(`select (cityName) FROM addresses where cityName is not null or cityName !='' group by cityName  having  cityName !=''`)
                                        //     let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                        //     let occupationResult = await header.query(occupationSql);
                                        //     let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                        //     let educationResult = await header.query(educationSql);
                                        //     let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                        //     let maritalStatusResult = await header.query(maritalStatusSql);
                                        //     let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                        //     let religionResult = await header.query(religionSql);
                                        //     let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                        //     let communityResult = await header.query(communitySql);
                                        //     let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                        //     let subCommunityResult = await header.query(subCommunitySql);
                                        //     let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                        //     let dietResult = await header.query(dietSql);
                                        //     let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                        //     let heightResult = await header.query(heightSql);
                                        //     let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                        //     let annualIncomeResult = await header.query(annualIncomeSql);
                                        //     let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                        //     let employmentTypeResult = await header.query(employmentTypeSql);
                                        //     let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                        //     let documentTypeResult = await header.query(documentTypeSql);
                                        //     userResult[0].masterEntryData = {
                                        //         "occupation": occupationResult,
                                        //         "education": educationResult,
                                        //         "maritalStatus": maritalStatusResult,
                                        //         "religion": religionResult,
                                        //         "community": communityResult,
                                        //         "subCommunity": subCommunityResult,
                                        //         "diet": dietResult,
                                        //         "height": heightResult,
                                        //         "annualIncome": annualIncomeResult,
                                        //         "employmentType": employmentTypeResult,
                                        //         "maxAge": maxAge[0].maxAge,
                                        //         "minAge": minAge[0].minAge,
                                        //         "ageList": ageList,
                                        //         "cityName": cityName,
                                        //         "documentType": documentTypeResult
                                        //     }
                                        userResult[0].isVerified = false;
                                        let isVerified = true;
                                        let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + userResult[0].id;
                                        let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                        userResult[0].userDocuments = documentsResult;
                                        if (documentsResult && documentsResult.length > 0) {
                                            for (let j = 0; j < documentsResult.length; j++) {
                                                if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                    isVerified = false;
                                                }
                                            }
                                        }
                                        else {
                                            isVerified = false;
                                        }
                                        userResult[0].isVerifiedProfile = isVerified;
                                        userResult[0].isOAuth = true;
                                        userResult[0].isAppleLogin = isAppleLogin;
                                        if (userResult[0].isVerifyProfilePic) {
                                            userResult[0].isVerifyProfilePic = true;
                                        }
                                        else {
                                            userResult[0].isVerifyProfilePic = false;
                                        }
                                        userResult[0].userWalletAmount = 0;
                                        let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                        let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                        if (getUserWalletResult && getUserWalletResult.length > 0) {
                                            userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                        }
                                        // region to get user personal custom data
                                        let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(userResult[0].id);
                                        if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                                            // console.log(_customFieldDataResult);
                                            userResult[0].customFields = _customFieldDataResult;
                                        }
                                        // if (isCustomFieldEnabled) {
                                        //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + userResult[0].id;
                                        //     let userCustomDataResult = await header.query(userCustomDataSql);
                                        //     let customdata: any[] = [];
                                        //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                                        //         const userCustomDataArrays = [];
                                        //         const keys = Object.keys(userCustomDataResult[0]);
                                        //         userCustomDataArrays.push(keys);
                                        //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                                        //         for (let i = 0; i < filteredColumns.length; i++) {
                                        //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[i] + `' and isActive = 1`;
                                        //             let result = await header.query(sql);
                                        //             let userDataSql = `SELECT ` + filteredColumns[i] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + userResult[0].id;
                                        //             let userDataResult = await header.query(userDataSql);
                                        //             let mergedResult = Object.assign({}, result[0], userDataResult[0]);
                                        //             customdata.push(mergedResult);
                                        //             console.log(userCustomDataResult);
                                        //         }
                                        //         if (customdata && customdata.length > 0) {
                                        //             for (let i = 0; i < customdata.length; i++) {
                                        //                 if (customdata[i].valueList) {
                                        //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                                        //                     customdata[i].valueList = valueListArray;
                                        //                 }
                                        //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                                        //                     if (customdata[i].valueTypeId == 10 || customdata[i].valueTypeId == 3) {
                                        //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                                        //                         customdata[i].value = valueArray;
                                        //                     }
                                        //                 }
                                        //             }
                                        //         }
                                        //         userResult[0].customFields = customdata;
                                        //     }
                                        // }
                                        // else {
                                        //     await header.rollback();
                                        //     let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                                        //     next(errorResult);
                                        // }
                                        // end region to get user personal custom data 
                                        if (userResult[0].isDemoUser == 1) {
                                            userResult[0].isDemoUser = true;
                                        }
                                        else {
                                            userResult[0].isDemoUser = false;
                                        }
                                        yield apiHeader_1.default.commit();
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Login User', userResult, 1, '');
                                        return res.status(200).send(successResult);
                                    }
                                    else {
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    return res.status(401).json({
                                        message: 'Unable to Sign JWT',
                                        error: signJWTResult.error
                                    });
                                }
                            }
                        }
                        else {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Email is incorrect!', [], 1, '');
                            return res.status(200).send(successResult);
                        }
                    }
                }
                else {
                    let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                    next(errorResult);
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let requiredFields = ['email', 'password'];
            let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
            if (validationResult && validationResult.statusCode == 200) {
                let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
                if (authorizationResult.statusCode == 200) {
                    let userDevice = authorizationResult.currentUserDevice;
                    let deviceDetailResult;
                    let appId;
                    if (userDevice.app == 'MatrimonyAdmin') {
                        appId = 1;
                    }
                    else if (userDevice.app == 'MatrimonyAndroid') {
                        appId = 2;
                    }
                    else {
                        appId = 3;
                    }
                    yield apiHeader_1.default.beginTransaction();
                    let userId;
                    let insertRefTokenResult;
                    let sql = `SELECT u.*, ur.roleId, img.imageUrl FROM users u
                        LEFT JOIN userroles ur ON ur.userId = u.id
                        LEFT JOIN images img ON img.id =u.imageId
                        WHERE (u.email = '` +
                        req.body.email +
                        `' OR u.contactNo = '` +
                        req.body.email +
                        `') AND u.isActive = true AND ur.roleId = 2`;
                    let result = yield apiHeader_1.default.query(sql);
                    let userPerDetailSql = `SELECT u.id,udd.fcmtoken,img.imageUrl,u.stripeCustomerId,u.stripeCustomerId, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.password, u.isVerifyProfilePic , u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome,  h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                         WHERE ur.roleId = 2
                          AND (u.email = '` +
                        req.body.email +
                        `' OR u.contactNo = '` +
                        req.body.email +
                        `') `;
                    let userResult = yield apiHeader_1.default.query(userPerDetailSql);
                    if (userResult && userResult.length > 0) {
                        for (let i = 0; i < userResult.length; i++) {
                            let userDetailResponse = yield customFields_1.default.getUserData(userResult[i]);
                            userResult[i] = Object.assign(Object.assign({}, userResult[i]), userDetailResponse);
                        }
                        // for (let detail of userResult) {
                        //     let userDetailResponse: any = await controller.getUserResponse(detail.permanentAddress, detail.currentAddress, detail.familyDetail, detail.fatherDetails, detail.motherDetails,
                        //         detail.pCountryLivingInId, detail.pCityLivingInId, detail.pReligionId, detail.pCommunityId, detail.pStateLivingInId, detail.pEducationMediumId, detail.pOccupationId,
                        //         detail.pEmploymentTypeId, detail.pMaritalStatusId, detail.pAnnualIncomeId, detail.pDietId, detail.pEducationTypeId, detail.pComplexion, detail.pBodyType);
                        //     // detail = { ...detail, ...userDetailResponse };
                        //     console.log(userDetailResponse);
                        //     detail.permanentAddress = userDetailResponse.permanentAddress
                        //     detail.currentAddress = userDetailResponse.currentAddress
                        //     detail.familyDetail = userDetailResponse.familyDetail
                        //     detail.fatherDetails = userDetailResponse.fatherDetails
                        //     detail.motherDetails = userDetailResponse.motherDetail
                        //     detail.pCountryLivingInId = userDetailResponse.pCountryLivingInId
                        //     detail.pCityLivingInId = userDetailResponse.pCityLivingInId
                        //     detail.pReligionId = userDetailResponse.pReligionId;
                        //     detail.pCommunityId = userDetailResponse.pCommunityId;
                        //     detail.pStateLivingInId = userDetailResponse.pStateLivingInId;
                        //     detail.pEducationMediumId = userDetailResponse.pEducationMediumId;
                        //     detail.pEducationTypeId = userDetailResponse.pEducationTypeId;
                        //     detail.pOccupationId = userDetailResponse.pOccupationId;
                        //     detail.pEmploymentTypeId = userDetailResponse.pEmploymentTypeId;
                        //     detail.pAnnualIncomeId = userDetailResponse.pAnnualIncomeId;
                        //     detail.pDietId = userDetailResponse.pDietId;
                        //     detail.pMaritalStatusId = userDetailResponse.pMaritalStatusId;
                        //     detail.pCountries = userDetailResponse.pCountries;
                        //     detail.pReligions = userDetailResponse.pReligions;
                        //     detail.pCommunities = userDetailResponse.pCommunities;
                        //     detail.pStates = userDetailResponse.pStates;
                        //     detail.pEducationMedium = userDetailResponse.pEducationMedium;
                        //     detail.pOccupation = userDetailResponse.pOccupation;
                        //     detail.pEmploymentType = userDetailResponse.pEmploymentType;
                        //     detail.pAnnualIncome = userDetailResponse.pAnnualIncome;
                        //     detail.pMaritalStatus = userDetailResponse.pMaritalStatus,
                        //         detail.pDiet = userDetailResponse.pDiet
                        //     detail.pComplexion = userDetailResponse.pComplexion
                        //     detail.pBodyType = userDetailResponse.pBodyType
                        // }
                    }
                    // checking if this email already registered using google or mobile and otp method
                    if (userResult && userResult.length > 0 && req.body.email.includes('@') && userResult[0].password == undefined) {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'This email is already registered using google or mobile and OTP', [], 1, '');
                        return res.status(200).send(successResult);
                    }
                    if (result && result.length > 0) {
                        let checkbloclsql = `SELECT * FROM userblockrequest WHERE blockRequestUserId = ` + result[0].id;
                        let checkbloclResult = yield apiHeader_1.default.query(checkbloclsql);
                        if (checkbloclResult && checkbloclResult.length > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(401, true, 'Your account was bloacked', [], 1, '');
                            return res.status(200).send(successResult);
                        }
                        else {
                            if (result[0].isDisable) {
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.login() Error', new Error('Your profile was block by Admin. You cannot login.'), '');
                                next(errorResult);
                            }
                            else {
                                userId = result[0].id;
                                if (result && result.length > 0) {
                                    if (result[0].password == null) {
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'This mobile no. is registered using OTP or google', [], 1, '');
                                        return res.status(200).send(successResult);
                                    }
                                    bcryptjs_1.default.compare(req.body.password, result[0].password, (error, hashresult) => __awaiter(void 0, void 0, void 0, function* () {
                                        if (hashresult == false) {
                                            return res.status(401).json({
                                                message: 'Password Mismatch'
                                            });
                                        }
                                        else if (hashresult) {
                                            let signJWTResult = yield (0, signJTW_1.default)(result[0]);
                                            if (signJWTResult && signJWTResult.token) {
                                                userResult[0].token = signJWTResult.token;
                                                if (userDevice) {
                                                    let checkDeviceSql = `SELECT * FROM userdevicedetail WHERE userId = ` + userId + ``;
                                                    result = yield apiHeader_1.default.query(checkDeviceSql);
                                                    userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                                    if (result && result.length > 0) {
                                                        let updateDetailSql = `UPDATE userdevicedetail SET userId = ` +
                                                            userId +
                                                            `,applicationId = ` +
                                                            appId +
                                                            `,deviceId = '` +
                                                            userDevice.deviceId +
                                                            `',fcmToken = '` +
                                                            userDevice.fcmToken +
                                                            `',deviceLocation = '` +
                                                            userDevice.deviceLocation +
                                                            `',deviceManufacturer = '` +
                                                            userDevice.deviceManufacturer +
                                                            `',deviceModel = '` +
                                                            userDevice.deviceModel +
                                                            `',apiCallTime = '` +
                                                            userDevice.apiCallTime +
                                                            `' WHERE userId = ` +
                                                            userId;
                                                        result = yield apiHeader_1.default.query(updateDetailSql);
                                                    }
                                                    else {
                                                        let insertDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) VALUES(` +
                                                            userId +
                                                            `,` +
                                                            appId +
                                                            `,'` +
                                                            userDevice.deviceId +
                                                            `','` +
                                                            userDevice.fcmToken +
                                                            `','` +
                                                            userDevice.deviceLocation +
                                                            `','` +
                                                            userDevice.deviceManufacturer +
                                                            `','` +
                                                            userDevice.deviceModel +
                                                            `','` +
                                                            userDevice.apiCallTime +
                                                            `')`;
                                                        result = yield apiHeader_1.default.query(insertDetailSql);
                                                    }
                                                }
                                                let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                                                //insert refresh token
                                                let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                                                insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                                                if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                                    userResult[0].refreshToken = refreshToken.token;
                                                    let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                                LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                                WHERE ufv.userId = ` +
                                                        userId +
                                                        ``;
                                                    userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                                    let todayDate = new Date();
                                                    let date = new Date(todayDate).getFullYear() +
                                                        '-' +
                                                        ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) +
                                                        '-' +
                                                        ('0' + new Date(todayDate).getDate()).slice(-2) +
                                                        '';
                                                    let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                                    LEFT JOIN package p ON p.id = up.packageId
                                                    LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                    LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                    WHERE up.userId = ` +
                                                        userId +
                                                        ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                                    order by p.weightage DESC`;
                                                    let userPackage = yield apiHeader_1.default.query(userPackages);
                                                    if (userPackage && userPackage.length > 0) {
                                                        for (let k = 0; k < userPackage.length; k++) {
                                                            let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                            LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                             WHERE pf.packageId = ` + userPackage[k].packageId);
                                                            userPackage[k].packageFacility = packageFacility;
                                                        }
                                                    }
                                                    userResult[0].userPackage = userPackage[0];
                                                    //     let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                                    // FROM users u
                                                    // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                                    // LEFT JOIN userroles ur ON ur.userId = u.id
                                                    // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id)
                                                    // AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                                    //     let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                                    // FROM users u
                                                    // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                                    // LEFT JOIN userroles ur ON ur.userId = u.id
                                                    // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id)
                                                    // AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                                    //     let ageList = [];
                                                    //     for (let i = 18; i <= 60; i++) {
                                                    //         ageList.push(i)
                                                    //     }
                                                    //     console.log(ageList)
                                                    // let cityName = await header.query(`select (cityName) FROM addresses where cityName is not null or cityName !='' group by cityName  having  cityName !=''`)
                                                    // let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                                    // let occupationResult = await header.query(occupationSql);
                                                    // let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                                    // let educationResult = await header.query(educationSql);
                                                    // let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                                    // let maritalStatusResult = await header.query(maritalStatusSql);
                                                    // let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                                    // let religionResult = await header.query(religionSql);
                                                    // let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                                    // let communityResult = await header.query(communitySql);
                                                    // let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                                    // let subCommunityResult = await header.query(subCommunitySql);
                                                    // let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                                    // let dietResult = await header.query(dietSql);
                                                    // let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                                    // let heightResult = await header.query(heightSql);
                                                    // let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                                    // let annualIncomeResult = await header.query(annualIncomeSql);
                                                    // let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                                    // let employmentTypeResult = await header.query(employmentTypeSql);
                                                    // let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                                    // let documentTypeResult = await header.query(documentTypeSql);
                                                    // userResult[0].masterEntryData = {
                                                    //     "occupation": occupationResult,
                                                    //     "education": educationResult,
                                                    //     "maritalStatus": maritalStatusResult,
                                                    //     "religion": religionResult,
                                                    //     "community": communityResult,
                                                    //     "subCommunity": subCommunityResult,
                                                    //     "diet": dietResult,
                                                    //     "height": heightResult,
                                                    //     "annualIncome": annualIncomeResult,
                                                    //     "employmentType": employmentTypeResult,
                                                    //     "maxAge": maxAge[0].maxAge,
                                                    //     "minAge": minAge[0].minAge,
                                                    //     "ageList": ageList,
                                                    //     "cityName": cityName,
                                                    //     "documentType": documentTypeResult
                                                    // }
                                                    userResult[0].isVerified = false;
                                                    let isVerified = true;
                                                    let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` +
                                                        userResult[0].id;
                                                    let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                                    userResult[0].userDocuments = documentsResult;
                                                    if (documentsResult && documentsResult.length > 0) {
                                                        for (let j = 0; j < documentsResult.length; j++) {
                                                            if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                                isVerified = false;
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        isVerified = false;
                                                    }
                                                    userResult[0].isVerifiedProfile = isVerified;
                                                    userResult[0].isOAuth = false;
                                                    userResult[0].isAppleLogin = false;
                                                    if (userResult[0].isVerifyProfilePic) {
                                                        userResult[0].isVerifyProfilePic = true;
                                                    }
                                                    else {
                                                        userResult[0].isVerifyProfilePic = false;
                                                    }
                                                    userResult[0].userWalletAmount = 0;
                                                    let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                                    let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                                    if (getUserWalletResult && getUserWalletResult.length > 0) {
                                                        userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                                    }
                                                    // region to get user personal custom data
                                                    let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(userResult[0].id);
                                                    if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                                                        // console.log(_customFieldDataResult);
                                                        userResult[0].customFields = _customFieldDataResult;
                                                    }
                                                    // if (isCustomFieldEnabled) {
                                                    //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + userResult[0].id;
                                                    //     let userCustomDataResult = await header.query(userCustomDataSql);
                                                    //     let customdata: any[] = [];
                                                    //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                                                    //         const userCustomDataArrays = [];
                                                    //         const keys = Object.keys(userCustomDataResult[0]);
                                                    //         userCustomDataArrays.push(keys);
                                                    //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                                                    //         for (let i = 0; i < filteredColumns.length; i++) {
                                                    //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[i] + `' and isActive = 1`;
                                                    //             let result = await header.query(sql);
                                                    //             let userDataSql = `SELECT ` + filteredColumns[i] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + userResult[0].id;
                                                    //             let userDataResult = await header.query(userDataSql);
                                                    //             let mergedResult = Object.assign({}, result[0], userDataResult[0]);
                                                    //             customdata.push(mergedResult);
                                                    //             console.log(userCustomDataResult);
                                                    //         }
                                                    //         if (customdata && customdata.length > 0) {
                                                    //             for (let i = 0; i < customdata.length; i++) {
                                                    //                 if (customdata[i].valueList) {
                                                    //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                                                    //                     customdata[i].valueList = valueListArray;
                                                    //                 }
                                                    //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                                                    //                     if (customdata[i].valueTypeId == 10 || customdata[i].valueTypeId == 3) {
                                                    //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                                                    //                         customdata[i].value = valueArray;
                                                    //                     }
                                                    //                 }
                                                    //             }
                                                    //         }
                                                    //         userResult[0].customFields = customdata;
                                                    //     }
                                                    // }
                                                    // else {
                                                    //     await header.rollback();
                                                    //     let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                                                    //     next(errorResult);
                                                    // }
                                                    // end region to get user personal custom data 
                                                    if (userResult[0].isDemoUser == 1) {
                                                        userResult[0].isDemoUser = true;
                                                    }
                                                    else {
                                                        userResult[0].isDemoUser = false;
                                                    }
                                                    yield apiHeader_1.default.commit();
                                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Login User', userResult, 1, '');
                                                    return res.status(200).send(successResult);
                                                }
                                                else {
                                                    yield apiHeader_1.default.rollback();
                                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                                    next(errorResult);
                                                }
                                            }
                                            else {
                                                return res.status(401).json({
                                                    message: 'Unable to Sign JWT',
                                                    error: signJWTResult.error
                                                });
                                            }
                                        }
                                    }));
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.login() Error', new Error('Error While Login'), '');
                                    next(errorResult);
                                }
                            }
                        }
                    }
                    else {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Email is incorrect!', [], 1, '');
                        let isnum = /^\d+$/.test(req.body.email);
                        if (isnum) {
                            successResult = new resultsuccess_1.ResultSuccess(200, true, 'Please enter mobile no. with country code', [], 1, '');
                        }
                        else {
                            if (req.body.email.includes('+')) {
                                successResult = new resultsuccess_1.ResultSuccess(200, true, 'Moble no. is incorrect!', [], 1, '');
                            }
                        }
                        return res.status(200).send(successResult);
                    }
                }
                else {
                    let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                    next(errorResult);
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                next(errorResult);
            }
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'Users.login() Exception', error, '');
        next(errorResult);
    }
});
const checkContactNoExist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Check ContactNo Exist');
        let requiredFields = ['contactNo'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userDevice = authorizationResult.currentUserDevice;
                let appId;
                if (userDevice.app == 'MatrimonyAdmin') {
                    appId = 1;
                }
                else if (userDevice.app == 'MatrimonyAndroid') {
                    appId = 2;
                }
                else {
                    appId = 3;
                }
                yield apiHeader_1.default.beginTransaction();
                let userId;
                let insertRefTokenResult;
                let sql = `SELECT u.*, ur.roleId, img.imageUrl FROM users u
                        LEFT JOIN userroles ur ON ur.userId = u.id
                        LEFT JOIN images img ON img.id =u.imageId
                        WHERE u.contactNo = '` +
                    req.body.contactNo +
                    `' AND u.isActive = true AND ur.roleId = 2`;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    let userPerDetailSql = `SELECT u.id,udd.fcmtoken,img.imageUrl,u.stripeCustomerId,img.imageUrl, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.memberid,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father'  ) AS fatherDetails,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									)FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1 ) AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                   WHERE ur.roleId = 2
                                   AND u.contactNo =  '` +
                        req.body.contactNo +
                        `' `;
                    console.log(userPerDetailSql);
                    let userResult = yield apiHeader_1.default.query(userPerDetailSql);
                    if (userResult && userResult.length > 0) {
                        for (let i = 0; i < userResult.length; i++) {
                            let userDetailResponse = yield customFields_1.default.getUserData(userResult[i]);
                            userResult[i] = Object.assign(Object.assign({}, userResult[i]), userDetailResponse);
                        }
                    }
                    if (userResult && userResult.length > 0) {
                        let checkbloclsql = `SELECT * FROM userblockrequest WHERE blockRequestUserId = ` + result[0].id;
                        let checkbloclResult = yield apiHeader_1.default.query(checkbloclsql);
                        if (checkbloclResult && checkbloclResult.length > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(401, true, 'Your account was bloacked', [], 1, '');
                            return res.status(200).send(successResult);
                        }
                        else {
                            if (result[0].isDisable) {
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.login() Error', new Error('Your profile was block by Admin. You cannot login.'), '');
                                next(errorResult);
                            }
                            else {
                                userId = result[0].id;
                                if (result && result.length > 0) {
                                    //bcryptjs.compare(req.body.password, result[0].password, async (error, hashresult: any) => {
                                    // if (hashresult == false) {
                                    //     return res.status(401).json({
                                    //         message: 'Password Mismatch'
                                    //     });
                                    // } else if (hashresult) {
                                    let signJWTResult = yield (0, signJTW_1.default)(result[0]);
                                    if (signJWTResult && signJWTResult.token) {
                                        userResult[0].token = signJWTResult.token;
                                        if (userDevice) {
                                            let checkDeviceSql = `SELECT * FROM userdevicedetail WHERE userId = ` + userId + ``;
                                            result = yield apiHeader_1.default.query(checkDeviceSql);
                                            userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                            if (result && result.length > 0) {
                                                let updateDetailSql = `UPDATE userdevicedetail SET userId = ` +
                                                    userId +
                                                    `,applicationId = ` +
                                                    appId +
                                                    `,deviceId = '` +
                                                    userDevice.deviceId +
                                                    `',fcmToken = '` +
                                                    userDevice.fcmToken +
                                                    `',deviceLocation = '` +
                                                    userDevice.deviceLocation +
                                                    `',deviceManufacturer = '` +
                                                    userDevice.deviceManufacturer +
                                                    `',deviceModel = '` +
                                                    userDevice.deviceModel +
                                                    `',apiCallTime = '` +
                                                    userDevice.apiCallTime +
                                                    `' WHERE userId = ` +
                                                    userId;
                                                result = yield apiHeader_1.default.query(updateDetailSql);
                                            }
                                            else {
                                                let insertDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) VALUES(` +
                                                    userId +
                                                    `,` +
                                                    appId +
                                                    `,'` +
                                                    userDevice.deviceId +
                                                    `','` +
                                                    userDevice.fcmToken +
                                                    `','` +
                                                    userDevice.deviceLocation +
                                                    `','` +
                                                    userDevice.deviceManufacturer +
                                                    `','` +
                                                    userDevice.deviceModel +
                                                    `','` +
                                                    userDevice.apiCallTime +
                                                    `')`;
                                                result = yield apiHeader_1.default.query(insertDetailSql);
                                            }
                                        }
                                        let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                                        //insert refresh token
                                        let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                                        insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                                        if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                            userResult[0].refreshToken = refreshToken.token;
                                            let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                                LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                                WHERE ufv.userId = ` +
                                                userId +
                                                ``;
                                            userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                            let todayDate = new Date();
                                            let date = new Date(todayDate).getFullYear() +
                                                '-' +
                                                ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) +
                                                '-' +
                                                ('0' + new Date(todayDate).getDate()).slice(-2) +
                                                '';
                                            let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                                    LEFT JOIN package p ON p.id = up.packageId
                                                    LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                    LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                        WHERE up.userId = ` +
                                                userId +
                                                ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                                        order by p.weightage DESC`;
                                            let userPackage = yield apiHeader_1.default.query(userPackages);
                                            if (userPackage && userPackage.length > 0) {
                                                for (let k = 0; k < userPackage.length; k++) {
                                                    let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                            LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                             WHERE pf.packageId = ` + userPackage[k].packageId);
                                                    userPackage[k].packageFacility = packageFacility;
                                                }
                                            }
                                            userResult[0].userPackage = userPackage[0];
                                            userResult[0].totalView = 0;
                                            userResult[0].todayView = 0;
                                            let totalViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + userResult[0].id;
                                            let totalViewResult = yield apiHeader_1.default.query(totalViewSql);
                                            if (totalViewResult && totalViewResult.length > 0) {
                                                userResult[0].totalView = totalViewResult[0].totalView;
                                            }
                                            let todayViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` +
                                                userResult[0].id +
                                                ` AND DATE(transactionDate) = DATE(CURRENT_TIMESTAMP())`;
                                            let todayViewResult = yield apiHeader_1.default.query(todayViewSql);
                                            if (todayViewResult && todayViewResult.length > 0) {
                                                userResult[0].todayView = todayViewResult[0].totalView;
                                            }
                                            // let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                            //     FROM users u
                                            //     LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                            //     LEFT JOIN userroles ur ON ur.userId = u.id
                                            //     WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id)
                                            //     AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                            // let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                            //     FROM users u
                                            //     LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                            //     LEFT JOIN userroles ur ON ur.userId = u.id
                                            //     WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id)
                                            //     AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                            // let ageList = [];
                                            // for (let i = 18; i <= 60; i++) {
                                            //     ageList.push(i)
                                            // }
                                            // console.log(ageList)
                                            // let cityName = await header.query(`select (cityName) FROM addresses where cityName is not null or cityName !='' group by cityName  having  cityName !=''`)
                                            // let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                            // let occupationResult = await header.query(occupationSql);
                                            // let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                            // let educationResult = await header.query(educationSql);
                                            // let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                            // let maritalStatusResult = await header.query(maritalStatusSql);
                                            // let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                            // let religionResult = await header.query(religionSql);
                                            // let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                            // let communityResult = await header.query(communitySql);
                                            // let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                            // let subCommunityResult = await header.query(subCommunitySql);
                                            // let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                            // let dietResult = await header.query(dietSql);
                                            // let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                            // let heightResult = await header.query(heightSql);
                                            // let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                            // let annualIncomeResult = await header.query(annualIncomeSql);
                                            // let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                            // let employmentTypeResult = await header.query(employmentTypeSql);
                                            // let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                            // let documentTypeResult = await header.query(documentTypeSql);
                                            // userResult[0].masterEntryData = {
                                            //     "occupation": occupationResult,
                                            //     "education": educationResult,
                                            //     "maritalStatus": maritalStatusResult,
                                            //     "religion": religionResult,
                                            //     "community": communityResult,
                                            //     "subCommunity": subCommunityResult,
                                            //     "diet": dietResult,
                                            //     "height": heightResult,
                                            //     "annualIncome": annualIncomeResult,
                                            //     "employmentType": employmentTypeResult,
                                            //     "maxAge": maxAge[0].maxAge,
                                            //     "minAge": minAge[0].minAge,
                                            //     "ageList": ageList,
                                            //     "cityName": cityName,
                                            //     "documentType": documentTypeResult
                                            // }
                                            userResult[0].isVerified = false;
                                            let isVerified = true;
                                            let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` +
                                                userResult[0].id;
                                            let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                            userResult[0].userDocuments = documentsResult;
                                            if (documentsResult && documentsResult.length > 0) {
                                                for (let j = 0; j < documentsResult.length; j++) {
                                                    if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                        isVerified = false;
                                                    }
                                                }
                                            }
                                            else {
                                                isVerified = false;
                                            }
                                            userResult[0].isVerifiedProfile = isVerified;
                                            userResult[0].isOAuth = false;
                                            userResult[0].isAppleLogin = false;
                                            userResult[0].userWalletAmount = 0;
                                            let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                            let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                            if (getUserWalletResult && getUserWalletResult.length > 0) {
                                                userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                            }
                                            if (userResult[0].isDemoUser == 1) {
                                                userResult[0].isDemoUser = true;
                                            }
                                            else {
                                                userResult[0].isDemoUser = false;
                                            }
                                            yield apiHeader_1.default.commit();
                                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Login User', userResult, 1, '');
                                            return res.status(200).send(successResult);
                                        }
                                        else {
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                            next(errorResult);
                                        }
                                    }
                                    else {
                                        return res.status(401).json({
                                            message: 'Unable to Sign JWT',
                                            error: signJWTResult.error
                                        });
                                    }
                                    // }
                                    //});
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.login() Error', new Error('Error While Login'), '');
                                    next(errorResult);
                                }
                            }
                        }
                    }
                    else {
                        // let errorResult = new ResultError(203, true, "User Not Available", new Error("User Not Available"), '');
                        // next(errorResult);
                        let userDevice = authorizationResult.currentUserDevice;
                        let appId;
                        if (userDevice.app == 'MatrimonyAdmin') {
                            appId = 1;
                        }
                        else if (userDevice.app == 'MatrimonyAndroid') {
                            appId = 2;
                        }
                        else {
                            appId = 3;
                        }
                        req.body.imageId = req.body.imageId ? req.body.imageId : null;
                        yield apiHeader_1.default.beginTransaction();
                        if (req.body.email) {
                            let checkEmail = `SELECT * FROM users WHERE email = '` + req.body.email + `'`;
                            let checkEmailResult = yield apiHeader_1.default.query(checkEmail);
                            if (checkEmailResult && checkEmailResult.length > 0) {
                                yield apiHeader_1.default.rollback();
                                let successResult = 'Email Already Inserted';
                                return res.status(200).send(successResult);
                            }
                            else {
                                let sql = `INSERT INTO users(contactNo, email, isDisable) VALUES ('` + req.body.contactNo + `','` + req.body.email + `', 0)`;
                                let result = yield apiHeader_1.default.query(sql);
                                if (result && result.insertId > 0) {
                                    let userId = result.insertId;
                                    let userRoleSql = `INSERT INTO userroles(userId, roleId) VALUES (` + userId + `, 2) `;
                                    result = yield apiHeader_1.default.query(userRoleSql);
                                    if (result && result.affectedRows > 0) {
                                        if (userDevice) {
                                            userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                            let deviceDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) VALUES(` +
                                                userId +
                                                `,` +
                                                appId +
                                                `,'` +
                                                userDevice.deviceId +
                                                `','` +
                                                userDevice.fcmToken +
                                                `','` +
                                                userDevice.deviceLocation +
                                                `','` +
                                                userDevice.deviceManufacturer +
                                                `','` +
                                                userDevice.deviceModel +
                                                `','` +
                                                userDevice.apiCallTime +
                                                `')`;
                                            let deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                        }
                                        let userFlag = yield apiHeader_1.default.query(`SELECT * FROM userflags`);
                                        if (userFlag && userFlag.length > 0) {
                                            for (let index = 0; index < userFlag.length; index++) {
                                                let userFlagSql = `INSERT INTO userflagvalues(userId, userFlagId, userFlagValue) VALUES (` +
                                                    userId +
                                                    `, ` +
                                                    userFlag[index].id +
                                                    `, ` +
                                                    userFlag[index].defaultValue +
                                                    `)`;
                                                let userFlagSqlResult = yield apiHeader_1.default.query(userFlagSql);
                                            }
                                        }
                                        let userPerDetailSql = `SELECT u.id,udd.fcmtoken,img.imageUrl,u.stripeCustomerId, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.memberid,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                 WHERE ur.roleId = 2 AND u.id =  ` +
                                            userId +
                                            ` `;
                                        let userResult = yield apiHeader_1.default.query(userPerDetailSql);
                                        if (userResult && userResult.length > 0) {
                                            for (let i = 0; i < userResult.length; i++) {
                                                let userDetailResponse = yield customFields_1.default.getUserData(userResult[i]);
                                                userResult[i] = Object.assign(Object.assign({}, userResult[i]), userDetailResponse);
                                            }
                                            // for (let detail of userResult) {
                                            //     let userDetailResponse: any = await controller.getUserResponse(detail.permanentAddress, detail.currentAddress, detail.familyDetail, detail.fatherDetails, detail.motherDetails,
                                            //         detail.pCountryLivingInId, detail.pCityLivingInId, detail.pReligionId, detail.pCommunityId, detail.pStateLivingInId, detail.pEducationMediumId, detail.pOccupationId,
                                            //         detail.pEmploymentTypeId, detail.pMaritalStatusId, detail.pAnnualIncomeId, detail.pDietId, detail.pEducationTypeId, detail.pComplexion, detail.pBodyType);
                                            //     console.log(userDetailResponse);
                                            //     // detail = { ...detail, ...userDetailResponse };
                                            //     detail.permanentAddress = userDetailResponse.permanentAddress
                                            //     detail.currentAddress = userDetailResponse.currentAddress
                                            //     detail.familyDetail = userDetailResponse.familyDetail
                                            //     detail.fatherDetails = userDetailResponse.fatherDetails
                                            //     detail.motherDetails = userDetailResponse.motherDetails
                                            //     detail.pCountryLivingInId = userDetailResponse.pCountryLivingInId
                                            //     detail.pCityLivingInId = userDetailResponse.pCityLivingInId
                                            //     detail.pReligionId = userDetailResponse.pReligionId;
                                            //     detail.pCommunityId = userDetailResponse.pCommunityId;
                                            //     detail.pStateLivingInId = userDetailResponse.pStateLivingInId;
                                            //     detail.pEducationMediumId = userDetailResponse.pEducationMediumId;
                                            //     detail.pEducationTypeId = userDetailResponse.pEducationTypeId;
                                            //     detail.pOccupationId = userDetailResponse.pOccupationId;
                                            //     detail.pEmploymentTypeId = userDetailResponse.pEmploymentTypeId;
                                            //     detail.pAnnualIncomeId = userDetailResponse.pAnnualIncomeId;
                                            //     detail.pDietId = userDetailResponse.pDietId;
                                            //     detail.pMaritalStatusId = userDetailResponse.pMaritalStatusId;
                                            //     detail.pCountries = userDetailResponse.pCountries;
                                            //     detail.pReligions = userDetailResponse.pReligions;
                                            //     detail.pCommunities = userDetailResponse.pCommunities;
                                            //     detail.pStates = userDetailResponse.pStates;
                                            //     detail.pEducationMedium = userDetailResponse.pEducationMedium;
                                            //     detail.pOccupation = userDetailResponse.pOccupation;
                                            //     detail.pEmploymentType = userDetailResponse.pEmploymentType;
                                            //     detail.pAnnualIncome = userDetailResponse.pAnnualIncome;
                                            //     detail.pMaritalStatus = userDetailResponse.pMaritalStatus,
                                            //         detail.pDiet = userDetailResponse.pDiet,
                                            //         detail.pComplexion = userDetailResponse.pComplexion
                                            //     detail.pBodyType = userDetailResponse.pBodyType
                                            //     detail.permanentAddress = detail.permanentAddress ? JSON.parse(detail.permanentAddress) : null;
                                            //     detail.currentAddress = detail.currentAddress ? JSON.parse(detail.currentAddress) : null;
                                            //     detail.familyDetail = detail.familyDetail ? JSON.parse(detail.familyDetail) : null;
                                            //     detail.fatherDetails = detail.fatherDetails ? JSON.parse(detail.fatherDetails) : null;
                                            //     detail.motherDetails = detail.motherDetails ? JSON.parse(detail.motherDetails) : null;
                                            // }
                                        }
                                        let signJWTResult = yield (0, signJTW_1.default)(userResult[0]);
                                        if (signJWTResult && signJWTResult.token) {
                                            userResult[0].token = signJWTResult.token;
                                            let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                                            //insert refresh token
                                            let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                                            insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                                            if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                                userResult[0].refreshToken = refreshToken.token;
                                                let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                                            LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                                            WHERE ufv.userId = ` +
                                                    userId +
                                                    ``;
                                                userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                                let todayDate = new Date();
                                                let date = new Date(todayDate).getFullYear() +
                                                    '-' +
                                                    ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) +
                                                    '-' +
                                                    ('0' + new Date(todayDate).getDate()).slice(-2) +
                                                    '';
                                                let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value FROM userpackage up
                                                            LEFT JOIN package p ON p.id = up.packageId
                                                            LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                            LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                            WHERE up.userId = ` +
                                                    userId +
                                                    ` order by createdDate DESC`;
                                                let userPackage = yield apiHeader_1.default.query(userPackages);
                                                if (userPackage && userPackage.length > 0) {
                                                    for (let k = 0; k < userPackage.length; k++) {
                                                        let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                 WHERE pf.packageId = ` + userPackage[k].packageId);
                                                        userPackage[k].packageFacility = packageFacility;
                                                    }
                                                }
                                                userResult[0].userPackage = userPackage[0];
                                                userResult[0].totalView = 0;
                                                userResult[0].todayView = 0;
                                                //     let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                                // FROM users u
                                                // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                                // LEFT JOIN userroles ur ON ur.userId = u.id
                                                // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                                //     let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                                // FROM users u
                                                // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                                // LEFT JOIN userroles ur ON ur.userId = u.id
                                                // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                                //     let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                                //     let occupationResult = await header.query(occupationSql);
                                                //     let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                                //     let educationResult = await header.query(educationSql);
                                                //     let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                                //     let maritalStatusResult = await header.query(maritalStatusSql);
                                                //     let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                                //     let religionResult = await header.query(religionSql);
                                                //     let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                                //     let communityResult = await header.query(communitySql);
                                                //     let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                                //     let subCommunityResult = await header.query(subCommunitySql);
                                                //     let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                                //     let dietResult = await header.query(dietSql);
                                                //     let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                                //     let heightResult = await header.query(heightSql);
                                                //     let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                                //     let annualIncomeResult = await header.query(annualIncomeSql);
                                                //     let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                                //     let employmentTypeResult = await header.query(employmentTypeSql);
                                                //     let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                                //     let documentTypeResult = await header.query(documentTypeSql);
                                                //     userResult[0].masterEntryData = {
                                                //         "occupation": occupationResult,
                                                //         "education": educationResult,
                                                //         "maritalStatus": maritalStatusResult,
                                                //         "religion": religionResult,
                                                //         "community": communityResult,
                                                //         "subCommunity": subCommunityResult,
                                                //         "diet": dietResult,
                                                //         "height": heightResult,
                                                //         "annualIncome": annualIncomeResult,
                                                //         "employmentType": employmentTypeResult,
                                                //         "maxAge": maxAge[0].maxAge,
                                                //         "minAge": minAge[0].minAge,
                                                //         "documentType": documentTypeResult
                                                //     }
                                                userResult[0].isVerified = false;
                                                let isVerified = true;
                                                let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` +
                                                    userResult[0].id;
                                                let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                                userResult[0].userDocuments = documentsResult;
                                                if (documentsResult && documentsResult.length > 0) {
                                                    for (let j = 0; j < documentsResult.length; j++) {
                                                        if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                            isVerified = false;
                                                        }
                                                    }
                                                }
                                                else {
                                                    isVerified = false;
                                                }
                                                userResult[0].isVerifiedProfile = isVerified;
                                                userResult[0].isOAuth = false;
                                                userResult[0].isAppleLogin = false;
                                                userResult[0].userWalletAmount = 0;
                                                let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                                let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                                if (getUserWalletResult && getUserWalletResult.length > 0) {
                                                    userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                                }
                                                if (userResult[0].isDemoUser == 1) {
                                                    userResult[0].isDemoUser = true;
                                                }
                                                else {
                                                    userResult[0].isDemoUser = false;
                                                }
                                                yield apiHeader_1.default.commit();
                                                //Note: Return 203 Status because in app need to complete profile screen
                                                let successResult = new resultsuccess_1.ResultSuccess(203, true, 'Login User', userResult, 1, '');
                                                return res.status(203).send(successResult);
                                            }
                                            else {
                                                yield apiHeader_1.default.rollback();
                                                let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                                next(errorResult);
                                            }
                                        }
                                        else {
                                            yield apiHeader_1.default.rollback();
                                            return res.status(401).json({
                                                message: 'Unable to Sign JWT',
                                                error: signJWTResult.error
                                            });
                                        }
                                    }
                                    else {
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                                    next(errorResult);
                                }
                            }
                        }
                        else {
                            let checkEmail = `SELECT * FROM users WHERE contactNo = '` + req.body.contactNo + `'`;
                            let checkEmailResult = yield apiHeader_1.default.query(checkEmail);
                            if (checkEmailResult && checkEmailResult.length > 0) {
                                yield apiHeader_1.default.rollback();
                                let successResult = 'Contact No Already Inserted';
                                return res.status(200).send(successResult);
                            }
                            else {
                                let sql = `INSERT INTO users(contactNo, isDisable, referalUserId) VALUES ('` + req.body.contactNo + `', 0,` + (req.body.referalUserId ? req.body.referalUserId : null) + `)`;
                                let result = yield apiHeader_1.default.query(sql);
                                if (result && result.insertId > 0) {
                                    let userId = result.insertId;
                                    let userRoleSql = `INSERT INTO userroles(userId, roleId) VALUES (` + userId + `, 2) `;
                                    result = yield apiHeader_1.default.query(userRoleSql);
                                    if (result && result.affectedRows > 0) {
                                        if (userDevice) {
                                            userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                            let deviceDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) VALUES(` +
                                                userId +
                                                `,` +
                                                appId +
                                                `,'` +
                                                userDevice.deviceId +
                                                `','` +
                                                userDevice.fcmToken +
                                                `','` +
                                                userDevice.deviceLocation +
                                                `','` +
                                                userDevice.deviceManufacturer +
                                                `','` +
                                                userDevice.deviceModel +
                                                `','` +
                                                userDevice.apiCallTime +
                                                `')`;
                                            let deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                        }
                                        let userFlag = yield apiHeader_1.default.query(`SELECT * FROM userflags`);
                                        if (userFlag && userFlag.length > 0) {
                                            for (let index = 0; index < userFlag.length; index++) {
                                                let userFlagSql = `INSERT INTO userflagvalues(userId, userFlagId, userFlagValue) VALUES (` +
                                                    userId +
                                                    `, ` +
                                                    userFlag[index].id +
                                                    `, ` +
                                                    userFlag[index].defaultValue +
                                                    `)`;
                                                let userFlagSqlResult = yield apiHeader_1.default.query(userFlagSql);
                                            }
                                        }
                                        let userPerDetailSql = `SELECT u.id, udd.fcmtoken,img.imageUrl,u.stripeCustomerId,u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic,  u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.memberid,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                    WHERE ur.roleId = 2 AND u.id =  ` +
                                            userId +
                                            ` `;
                                        let userResult = yield apiHeader_1.default.query(userPerDetailSql);
                                        if (userResult && userResult.length > 0) {
                                            for (let i = 0; i < userResult.length; i++) {
                                                let userDetailResponse = yield customFields_1.default.getUserData(userResult[i]);
                                                userResult[i] = Object.assign(Object.assign({}, userResult[i]), userDetailResponse);
                                            }
                                            // for (let detail of userResult) {
                                            //     let userDetailResponse: any = await controller.getUserResponse(detail.permanentAddress, detail.currentAddress, detail.familyDetail, detail.fatherDetails, detail.motherDetails,
                                            //         detail.pCountryLivingInId, detail.pCityLivingInId, detail.pReligionId, detail.pCommunityId, detail.pStateLivingInId, detail.pEducationMediumId, detail.pOccupationId,
                                            //         detail.pEmploymentTypeId, detail.pMaritalStatusId, detail.pAnnualIncomeId, detail.pDietId, detail.pEducationTypeId, detail.pComplexion, detail.pBodyType);
                                            //     console.log(userDetailResponse);
                                            //     // detail = { ...detail, ...userDetailResponse };
                                            //     detail.permanentAddress = userDetailResponse.permanentAddress
                                            //     detail.currentAddress = userDetailResponse.currentAddress
                                            //     detail.familyDetail = userDetailResponse.familyDetail
                                            //     detail.fatherDetails = userDetailResponse.fatherDetails
                                            //     detail.motherDetails = userDetailResponse.motherDetails
                                            //     detail.pCountryLivingInId = userDetailResponse.pCountryLivingInId
                                            //     detail.pCityLivingInId = userDetailResponse.pCityLivingInId
                                            //     detail.pReligionId = userDetailResponse.pReligionId;
                                            //     detail.pCommunityId = userDetailResponse.pCommunityId;
                                            //     detail.pStateLivingInId = userDetailResponse.pStateLivingInId;
                                            //     detail.pEducationMediumId = userDetailResponse.pEducationMediumId;
                                            //     detail.pEducationTypeId = userDetailResponse.pEducationTypeId;
                                            //     detail.pOccupationId = userDetailResponse.pOccupationId;
                                            //     detail.pEmploymentTypeId = userDetailResponse.pEmploymentTypeId;
                                            //     detail.pAnnualIncomeId = userDetailResponse.pAnnualIncomeId;
                                            //     detail.pDietId = userDetailResponse.pDietId;
                                            //     detail.pMaritalStatusId = userDetailResponse.pMaritalStatusId;
                                            //     detail.pCountries = userDetailResponse.pCountries;
                                            //     detail.pReligions = userDetailResponse.pReligions;
                                            //     detail.pCommunities = userDetailResponse.pCommunities;
                                            //     detail.pStates = userDetailResponse.pStates;
                                            //     detail.pEducationMedium = userDetailResponse.pEducationMedium;
                                            //     detail.pOccupation = userDetailResponse.pOccupation;
                                            //     detail.pEmploymentType = userDetailResponse.pEmploymentType;
                                            //     detail.pAnnualIncome = userDetailResponse.pAnnualIncome;
                                            //     detail.pMaritalStatus = userDetailResponse.pMaritalStatus,
                                            //         detail.pDiet = userDetailResponse.pDiet,
                                            //         detail.pComplexion = userDetailResponse.pComplexion
                                            //     detail.pBodyType = userDetailResponse.pBodyType
                                            //     detail.permanentAddress = detail.permanentAddress ? JSON.parse(detail.permanentAddress) : null;
                                            //     detail.currentAddress = detail.currentAddress ? JSON.parse(detail.currentAddress) : null;
                                            //     detail.familyDetail = detail.familyDetail ? JSON.parse(detail.familyDetail) : null;
                                            //     detail.fatherDetails = detail.fatherDetails ? JSON.parse(detail.fatherDetails) : null;
                                            //     detail.motherDetails = detail.motherDetails ? JSON.parse(detail.motherDetails) : null;
                                            // }
                                        }
                                        let signJWTResult = yield (0, signJTW_1.default)(userResult[0]);
                                        if (signJWTResult && signJWTResult.token) {
                                            userResult[0].token = signJWTResult.token;
                                            let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                                            //insert refresh token
                                            let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                                            insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                                            if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                                userResult[0].refreshToken = refreshToken.token;
                                                let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                                                    LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                                                    WHERE ufv.userId = ` +
                                                    userId +
                                                    ``;
                                                userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                                let todayDate = new Date();
                                                let date = new Date(todayDate).getFullYear() +
                                                    '-' +
                                                    ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) +
                                                    '-' +
                                                    ('0' + new Date(todayDate).getDate()).slice(-2) +
                                                    '';
                                                let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value FROM userpackage up
                                                                    LEFT JOIN package p ON p.id = up.packageId
                                                                    LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                                    WHERE up.userId = ` +
                                                    userId +
                                                    ` order by createdDate DESC`;
                                                let userPackage = yield apiHeader_1.default.query(userPackages);
                                                if (userPackage && userPackage.length > 0) {
                                                    for (let k = 0; k < userPackage.length; k++) {
                                                        let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                 WHERE pf.packageId = ` + userPackage[k].packageId);
                                                        userPackage[k].packageFacility = packageFacility;
                                                    }
                                                }
                                                userResult[0].userPackage = userPackage[0];
                                                userResult[0].totalView = 0;
                                                userResult[0].todayView = 0;
                                                //     let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                                // FROM users u
                                                // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                                // LEFT JOIN userroles ur ON ur.userId = u.id
                                                // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                                //     let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                                // FROM users u
                                                // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                                // LEFT JOIN userroles ur ON ur.userId = u.id
                                                // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                                //     let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                                //     let occupationResult = await header.query(occupationSql);
                                                //     let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                                //     let educationResult = await header.query(educationSql);
                                                //     let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                                //     let maritalStatusResult = await header.query(maritalStatusSql);
                                                //     let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                                //     let religionResult = await header.query(religionSql);
                                                //     let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                                //     let communityResult = await header.query(communitySql);
                                                //     let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                                //     let subCommunityResult = await header.query(subCommunitySql);
                                                //     let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                                //     let dietResult = await header.query(dietSql);
                                                //     let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                                //     let heightResult = await header.query(heightSql);
                                                //     let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                                //     let annualIncomeResult = await header.query(annualIncomeSql);
                                                //     let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                                //     let employmentTypeResult = await header.query(employmentTypeSql);
                                                //     let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                                //     let documentTypeResult = await header.query(documentTypeSql);
                                                //     userResult[0].masterEntryData = {
                                                //         "occupation": occupationResult,
                                                //         "education": educationResult,
                                                //         "maritalStatus": maritalStatusResult,
                                                //         "religion": religionResult,
                                                //         "community": communityResult,
                                                //         "subCommunity": subCommunityResult,
                                                //         "diet": dietResult,
                                                //         "height": heightResult,
                                                //         "annualIncome": annualIncomeResult,
                                                //         "employmentType": employmentTypeResult,
                                                //         "maxAge": maxAge[0].maxAge,
                                                //         "minAge": minAge[0].minAge,
                                                //         "documentType": documentTypeResult
                                                //     }
                                                userResult[0].isVerified = false;
                                                let isVerified = true;
                                                let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` +
                                                    userResult[0].id;
                                                let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                                userResult[0].userDocuments = documentsResult;
                                                if (documentsResult && documentsResult.length > 0) {
                                                    for (let j = 0; j < documentsResult.length; j++) {
                                                        if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                            isVerified = false;
                                                        }
                                                    }
                                                }
                                                else {
                                                    isVerified = false;
                                                }
                                                userResult[0].isVerifiedProfile = isVerified;
                                                userResult[0].isOAuth = false;
                                                userResult[0].isAppleLogin = false;
                                                userResult[0].userWalletAmount = 0;
                                                let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                                let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                                if (getUserWalletResult && getUserWalletResult.length > 0) {
                                                    userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                                }
                                                if (userResult[0].isDemoUser == 1) {
                                                    userResult[0].isDemoUser = true;
                                                }
                                                else {
                                                    userResult[0].isDemoUser = false;
                                                }
                                                yield apiHeader_1.default.commit();
                                                //Note: Return 203 Status because in app need to complete profile screen
                                                let successResult = new resultsuccess_1.ResultSuccess(203, true, 'Login User', userResult, 1, '');
                                                return res.status(203).send(successResult);
                                            }
                                            else {
                                                yield apiHeader_1.default.rollback();
                                                let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                                next(errorResult);
                                            }
                                        }
                                        else {
                                            yield apiHeader_1.default.rollback();
                                            return res.status(401).json({
                                                message: 'Unable to Sign JWT',
                                                error: signJWTResult.error
                                            });
                                        }
                                    }
                                    else {
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                                    next(errorResult);
                                }
                            }
                        }
                    }
                }
                else {
                    // let errorResult = new ResultError(203, true, "User Not Available", new Error("User Not Available"), '');
                    // next(errorResult);
                    let userDevice = authorizationResult.currentUserDevice;
                    let appId;
                    if (userDevice.app == 'MatrimonyAdmin') {
                        appId = 1;
                    }
                    else if (userDevice.app == 'MatrimonyAndroid') {
                        appId = 2;
                    }
                    else {
                        appId = 3;
                    }
                    req.body.imageId = req.body.imageId ? req.body.imageId : null;
                    yield apiHeader_1.default.beginTransaction();
                    if (req.body.email) {
                        let checkEmail = `SELECT * FROM users WHERE email = '` + req.body.email + `'`;
                        let checkEmailResult = yield apiHeader_1.default.query(checkEmail);
                        if (checkEmailResult && checkEmailResult.length > 0) {
                            yield apiHeader_1.default.rollback();
                            let successResult = 'Email Already Inserted';
                            return res.status(200).send(successResult);
                        }
                        else {
                            let sql = `INSERT INTO users(contactNo, email, isDisable, referalUserId) VALUES ('` +
                                req.body.contactNo +
                                `','` +
                                req.body.email +
                                `', 0, ` +
                                (req.body.referalUserId ? req.body.referalUserId : null) +
                                `)`;
                            let result = yield apiHeader_1.default.query(sql);
                            if (result && result.insertId > 0) {
                                let userId = result.insertId;
                                let userRoleSql = `INSERT INTO userroles(userId, roleId) VALUES (` + userId + `, 2) `;
                                result = yield apiHeader_1.default.query(userRoleSql);
                                if (result && result.affectedRows > 0) {
                                    if (userDevice) {
                                        userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                        let deviceDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) VALUES(` +
                                            userId +
                                            `,` +
                                            appId +
                                            `,'` +
                                            userDevice.deviceId +
                                            `','` +
                                            userDevice.fcmToken +
                                            `','` +
                                            userDevice.deviceLocation +
                                            `','` +
                                            userDevice.deviceManufacturer +
                                            `','` +
                                            userDevice.deviceModel +
                                            `','` +
                                            userDevice.apiCallTime +
                                            `')`;
                                        let deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                    }
                                    let userFlag = yield apiHeader_1.default.query(`SELECT * FROM userflags`);
                                    if (userFlag && userFlag.length > 0) {
                                        for (let index = 0; index < userFlag.length; index++) {
                                            let userFlagSql = `INSERT INTO userflagvalues(userId, userFlagId, userFlagValue) VALUES (` +
                                                userId +
                                                `, ` +
                                                userFlag[index].id +
                                                `, ` +
                                                userFlag[index].defaultValue +
                                                `)`;
                                            let userFlagSqlResult = yield apiHeader_1.default.query(userFlagSql);
                                        }
                                    }
                                    let userPerDetailSql = `SELECT u.id,udd.fcmtoken,img.imageUrl,u.stripeCustomerId, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.memberid,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome,  h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                 WHERE ur.roleId = 2 AND u.id =  ` +
                                        userId +
                                        ` `;
                                    let userResult = yield apiHeader_1.default.query(userPerDetailSql);
                                    if (userResult && userResult.length > 0) {
                                        for (let i = 0; i < userResult.length; i++) {
                                            let userDetailResponse = yield customFields_1.default.getUserData(userResult[i]);
                                            userResult[i] = Object.assign(Object.assign({}, userResult[i]), userDetailResponse);
                                        }
                                        // for (let detail of userResult) {
                                        //     let userDetailResponse: any = await controller.getUserResponse(detail.permanentAddress, detail.currentAddress, detail.familyDetail, detail.fatherDetails, detail.motherDetails,
                                        //         detail.pCountryLivingInId, detail.pCityLivingInId, detail.pReligionId, detail.pCommunityId, detail.pStateLivingInId, detail.pEducationMediumId, detail.pOccupationId,
                                        //         detail.pEmploymentTypeId, detail.pMaritalStatusId, detail.pAnnualIncomeId, detail.pDietId, detail.pEducationTypeId, detail.pComplexion, detail.pBodyType);
                                        //     console.log(userDetailResponse);
                                        //     // detail = { ...detail, ...userDetailResponse };
                                        //     detail.permanentAddress = userDetailResponse.permanentAddress
                                        //     detail.currentAddress = userDetailResponse.currentAddress
                                        //     detail.familyDetail = userDetailResponse.familyDetail
                                        //     detail.fatherDetails = userDetailResponse.fatherDetails
                                        //     detail.motherDetails = userDetailResponse.motherDetails
                                        //     detail.pCountryLivingInId = userDetailResponse.pCountryLivingInId
                                        //     detail.pCityLivingInId = userDetailResponse.pCityLivingInId
                                        //     detail.pReligionId = userDetailResponse.pReligionId;
                                        //     detail.pCommunityId = userDetailResponse.pCommunityId;
                                        //     detail.pStateLivingInId = userDetailResponse.pStateLivingInId;
                                        //     detail.pEducationMediumId = userDetailResponse.pEducationMediumId;
                                        //     detail.pEducationTypeId = userDetailResponse.pEducationTypeId;
                                        //     detail.pOccupationId = userDetailResponse.pOccupationId;
                                        //     detail.pEmploymentTypeId = userDetailResponse.pEmploymentTypeId;
                                        //     detail.pAnnualIncomeId = userDetailResponse.pAnnualIncomeId;
                                        //     detail.pDietId = userDetailResponse.pDietId;
                                        //     detail.pMaritalStatusId = userDetailResponse.pMaritalStatusId;
                                        //     detail.pCountries = userDetailResponse.pCountries;
                                        //     detail.pReligions = userDetailResponse.pReligions;
                                        //     detail.pCommunities = userDetailResponse.pCommunities;
                                        //     detail.pStates = userDetailResponse.pStates;
                                        //     detail.pEducationMedium = userDetailResponse.pEducationMedium;
                                        //     detail.pOccupation = userDetailResponse.pOccupation;
                                        //     detail.pEmploymentType = userDetailResponse.pEmploymentType;
                                        //     detail.pAnnualIncome = userDetailResponse.pAnnualIncome;
                                        //     detail.pMaritalStatus = userDetailResponse.pMaritalStatus,
                                        //         detail.pDiet = userDetailResponse.pDiet,
                                        //         detail.pComplexion = userDetailResponse.pComplexion
                                        //     detail.pBodyType = userDetailResponse.pBodyType
                                        //     // detail.permanentAddress = detail.permanentAddress ? JSON.parse(detail.permanentAddress) : null;
                                        //     // detail.currentAddress = detail.currentAddress ? JSON.parse(detail.currentAddress) : null;
                                        //     // detail.familyDetail = detail.familyDetail ? JSON.parse(detail.familyDetail) : null;
                                        //     // detail.fatherDetails = detail.fatherDetails ? JSON.parse(detail.fatherDetails) : null;
                                        //     // detail.motherDetails = detail.motherDetails ? JSON.parse(detail.motherDetails) : null;
                                        // }
                                    }
                                    let signJWTResult = yield (0, signJTW_1.default)(userResult[0]);
                                    if (signJWTResult && signJWTResult.token) {
                                        userResult[0].token = signJWTResult.token;
                                        let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                                        //insert refresh token
                                        let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                                        insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                                        if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                            userResult[0].refreshToken = refreshToken.token;
                                            let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                                LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                                 WHERE ufv.userId = ` +
                                                userId +
                                                ``;
                                            userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                            let todayDate = new Date();
                                            let date = new Date(todayDate).getFullYear() +
                                                '-' +
                                                ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) +
                                                '-' +
                                                ('0' + new Date(todayDate).getDate()).slice(-2) +
                                                '';
                                            let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value FROM userpackage up
                                                                LEFT JOIN package p ON p.id = up.packageId
                                                            LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                             LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                             WHERE up.userId = ` +
                                                userId +
                                                ` order by createdDate DESC`;
                                            let userPackage = yield apiHeader_1.default.query(userPackages);
                                            if (userPackage && userPackage.length > 0) {
                                                for (let k = 0; k < userPackage.length; k++) {
                                                    let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                 WHERE pf.packageId = ` + userPackage[k].packageId);
                                                    userPackage[k].packageFacility = packageFacility;
                                                }
                                            }
                                            userResult[0].userPackage = userPackage[0];
                                            userResult[0].totalView = 0;
                                            userResult[0].todayView = 0;
                                            // let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                            // FROM users u
                                            // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                            // LEFT JOIN userroles ur ON ur.userId = u.id
                                            // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                            // let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                            // FROM users u
                                            // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                            // LEFT JOIN userroles ur ON ur.userId = u.id
                                            // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                            // let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                            // let occupationResult = await header.query(occupationSql);
                                            // let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                            // let educationResult = await header.query(educationSql);
                                            // let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                            // let maritalStatusResult = await header.query(maritalStatusSql);
                                            // let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                            // let religionResult = await header.query(religionSql);
                                            // let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                            // let communityResult = await header.query(communitySql);
                                            // let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                            // let subCommunityResult = await header.query(subCommunitySql);
                                            // let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                            // let dietResult = await header.query(dietSql);
                                            // let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                            // let heightResult = await header.query(heightSql);
                                            // let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                            // let annualIncomeResult = await header.query(annualIncomeSql);
                                            // let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                            // let employmentTypeResult = await header.query(employmentTypeSql);
                                            // let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                            // let documentTypeResult = await header.query(documentTypeSql);
                                            // userResult[0].masterEntryData = {
                                            //     "occupation": occupationResult,
                                            //     "education": educationResult,
                                            //     "maritalStatus": maritalStatusResult,
                                            //     "religion": religionResult,
                                            //     "community": communityResult,
                                            //     "subCommunity": subCommunityResult,
                                            //     "diet": dietResult,
                                            //     "height": heightResult,
                                            //     "annualIncome": annualIncomeResult,
                                            //     "employmentType": employmentTypeResult,
                                            //     "maxAge": maxAge[0].maxAge,
                                            //     "minAge": minAge[0].minAge,
                                            //     "documentType": documentTypeResult
                                            // }
                                            userResult[0].isVerified = false;
                                            let isVerified = true;
                                            let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` +
                                                userResult[0].id;
                                            let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                            userResult[0].userDocuments = documentsResult;
                                            if (documentsResult && documentsResult.length > 0) {
                                                for (let j = 0; j < documentsResult.length; j++) {
                                                    if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                        isVerified = false;
                                                    }
                                                }
                                            }
                                            else {
                                                isVerified = false;
                                            }
                                            userResult[0].isVerifiedProfile = isVerified;
                                            userResult[0].isOAuth = false;
                                            userResult[0].isAppleLogin = false;
                                            userResult[0].userWalletAmount = 0;
                                            let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                            let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                            if (getUserWalletResult && getUserWalletResult.length > 0) {
                                                userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                            }
                                            yield apiHeader_1.default.commit();
                                            // let successResult = new ResultSuccess(200, true, 'Login User', userResult, 1, "");
                                            // return res.status(200).send(successResult);
                                            //Note: Return 203 Status because in app need to complete profile screen
                                            if (userResult[0].isDemoUser == 1) {
                                                userResult[0].isDemoUser = true;
                                            }
                                            else {
                                                userResult[0].isDemoUser = false;
                                            }
                                            let successResult = new resultsuccess_1.ResultSuccess(203, true, 'Login User', userResult, 1, "");
                                            return res.status(203).send(successResult);
                                        }
                                        else {
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                            next(errorResult);
                                        }
                                    }
                                    else {
                                        yield apiHeader_1.default.rollback();
                                        return res.status(401).json({
                                            message: 'Unable to Sign JWT',
                                            error: signJWTResult.error
                                        });
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                        }
                    }
                    else {
                        let checkEmail = `SELECT * FROM users WHERE contactNo = '` + req.body.contactNo + `'`;
                        let checkEmailResult = yield apiHeader_1.default.query(checkEmail);
                        if (checkEmailResult && checkEmailResult.length > 0) {
                            yield apiHeader_1.default.rollback();
                            let successResult = 'ContactNo Already Inserted';
                            return res.status(200).send(successResult);
                        }
                        else {
                            let sql = `INSERT INTO users(contactNo, isDisable, referalUSerId) VALUES ('` + req.body.contactNo + `', 0, ` + (req.body.referalUserId ? req.body.referalUserId : null) + `)`;
                            let result = yield apiHeader_1.default.query(sql);
                            if (result && result.insertId > 0) {
                                let userId = result.insertId;
                                let userRoleSql = `INSERT INTO userroles(userId, roleId) VALUES (` + userId + `, 2) `;
                                result = yield apiHeader_1.default.query(userRoleSql);
                                if (result && result.affectedRows > 0) {
                                    if (userDevice) {
                                        userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                        let deviceDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) VALUES(` +
                                            userId +
                                            `,` +
                                            appId +
                                            `,'` +
                                            userDevice.deviceId +
                                            `','` +
                                            userDevice.fcmToken +
                                            `','` +
                                            userDevice.deviceLocation +
                                            `','` +
                                            userDevice.deviceManufacturer +
                                            `','` +
                                            userDevice.deviceModel +
                                            `','` +
                                            userDevice.apiCallTime +
                                            `')`;
                                        let deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                    }
                                    let userFlag = yield apiHeader_1.default.query(`SELECT * FROM userflags`);
                                    if (userFlag && userFlag.length > 0) {
                                        for (let index = 0; index < userFlag.length; index++) {
                                            let userFlagSql = `INSERT INTO userflagvalues(userId, userFlagId, userFlagValue) VALUES (` +
                                                userId +
                                                `, ` +
                                                userFlag[index].id +
                                                `, ` +
                                                userFlag[index].defaultValue +
                                                `)`;
                                            let userFlagSqlResult = yield apiHeader_1.default.query(userFlagSql);
                                        }
                                    }
                                    let userPerDetailSql = `SELECT u.id,udd.fcmtoken,img.imageUrl, u.stripeCustomerId,u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.memberid,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome,  h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                 WHERE ur.roleId = 2 AND u.id =  ` +
                                        userId +
                                        ``;
                                    let userResult = yield apiHeader_1.default.query(userPerDetailSql);
                                    if (userResult && userResult.length > 0) {
                                        for (let i = 0; i < userResult.length; i++) {
                                            let userDetailResponse = yield customFields_1.default.getUserData(userResult[i]);
                                            userResult[i] = Object.assign(Object.assign({}, userResult[i]), userDetailResponse);
                                        }
                                        // for (let detail of userResult) {
                                        //     let userDetailResponse: any = await controller.getUserResponse(detail.permanentAddress, detail.currentAddress, detail.familyDetail, detail.fatherDetails, detail.motherDetails,
                                        //         detail.pCountryLivingInId, detail.pCityLivingInId, detail.pReligionId, detail.pCommunityId, detail.pStateLivingInId, detail.pEducationMediumId, detail.pOccupationId,
                                        //         detail.pEmploymentTypeId, detail.pMaritalStatusId, detail.pAnnualIncomeId, detail.pDietId, detail.pEducationTypeId, detail.pComplexion, detail.pBodyType);
                                        //     console.log(userDetailResponse);
                                        //     // detail = { ...detail, ...userDetailResponse };
                                        //     detail.permanentAddress = userDetailResponse.permanentAddress
                                        //     detail.currentAddress = userDetailResponse.currentAddress
                                        //     detail.familyDetail = userDetailResponse.familyDetail
                                        //     detail.fatherDetails = userDetailResponse.fatherDetails
                                        //     detail.motherDetails = userDetailResponse.motherDetails
                                        //     detail.pCountryLivingInId = userDetailResponse.pCountryLivingInId
                                        //     detail.pCityLivingInId = userDetailResponse.pCityLivingInId
                                        //     detail.pReligionId = userDetailResponse.pReligionId;
                                        //     detail.pCommunityId = userDetailResponse.pCommunityId;
                                        //     detail.pStateLivingInId = userDetailResponse.pStateLivingInId;
                                        //     detail.pEducationMediumId = userDetailResponse.pEducationMediumId;
                                        //     detail.pEducationTypeId = userDetailResponse.pEducationTypeId;
                                        //     detail.pOccupationId = userDetailResponse.pOccupationId;
                                        //     detail.pEmploymentTypeId = userDetailResponse.pEmploymentTypeId;
                                        //     detail.pAnnualIncomeId = userDetailResponse.pAnnualIncomeId;
                                        //     detail.pDietId = userDetailResponse.pDietId;
                                        //     detail.pMaritalStatusId = userDetailResponse.pMaritalStatusId;
                                        //     detail.pCountries = userDetailResponse.pCountries;
                                        //     detail.pReligions = userDetailResponse.pReligions;
                                        //     detail.pCommunities = userDetailResponse.pCommunities;
                                        //     detail.pStates = userDetailResponse.pStates;
                                        //     detail.pEducationMedium = userDetailResponse.pEducationMedium;
                                        //     detail.pOccupation = userDetailResponse.pOccupation;
                                        //     detail.pEmploymentType = userDetailResponse.pEmploymentType;
                                        //     detail.pAnnualIncome = userDetailResponse.pAnnualIncome;
                                        //     detail.pMaritalStatus = userDetailResponse.pMaritalStatus,
                                        //         detail.pDiet = userDetailResponse.pDiet,
                                        //         detail.pComplexion = userDetailResponse.pComplexion
                                        //     detail.pBodyType = userDetailResponse.pBodyType
                                        //     // detail.permanentAddress = detail.permanentAddress ? JSON.parse(detail.permanentAddress) : null;
                                        //     // detail.currentAddress = detail.currentAddress ? JSON.parse(detail.currentAddress) : null;
                                        //     // detail.familyDetail = detail.familyDetail ? JSON.parse(detail.familyDetail) : null;
                                        //     // detail.fatherDetails = detail.fatherDetails ? JSON.parse(detail.fatherDetails) : null;
                                        //     // detail.motherDetails = detail.motherDetails ? JSON.parse(detail.motherDetails) : null;
                                        // }
                                    }
                                    let signJWTResult = yield (0, signJTW_1.default)(userResult[0]);
                                    console.log('HEY');
                                    if (signJWTResult && signJWTResult.token) {
                                        userResult[0].token = signJWTResult.token;
                                        let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                                        //insert refresh token
                                        let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                                        insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                                        if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                            userResult[0].refreshToken = refreshToken.token;
                                            let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                                LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                                WHERE ufv.userId = ` +
                                                userId +
                                                ``;
                                            userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                            let todayDate = new Date();
                                            let date = new Date(todayDate).getFullYear() +
                                                '-' +
                                                ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) +
                                                '-' +
                                                ('0' + new Date(todayDate).getDate()).slice(-2) +
                                                '';
                                            let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value FROM userpackage up
                                                                LEFT JOIN package p ON p.id = up.packageId
                                                                 LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                                 LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                                WHERE up.userId = ` +
                                                userId +
                                                ` order by createdDate DESC`;
                                            let userPackage = yield apiHeader_1.default.query(userPackages);
                                            if (userPackage && userPackage.length > 0) {
                                                for (let k = 0; k < userPackage.length; k++) {
                                                    let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                 WHERE pf.packageId = ` + userPackage[k].packageId);
                                                    userPackage[k].packageFacility = packageFacility;
                                                }
                                            }
                                            userResult[0].userPackage = userPackage[0];
                                            userResult[0].totalView = 0;
                                            userResult[0].todayView = 0;
                                            // let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                            // FROM users u
                                            // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                            // LEFT JOIN userroles ur ON ur.userId = u.id
                                            // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                            // let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                            // FROM users u
                                            // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                            // LEFT JOIN userroles ur ON ur.userId = u.id
                                            // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                            // let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                            // let occupationResult = await header.query(occupationSql);
                                            // let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                            // let educationResult = await header.query(educationSql);
                                            // let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                            // let maritalStatusResult = await header.query(maritalStatusSql);
                                            // let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                            // let religionResult = await header.query(religionSql);
                                            // let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                            // let communityResult = await header.query(communitySql);
                                            // let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                            // let subCommunityResult = await header.query(subCommunitySql);
                                            // let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                            // let dietResult = await header.query(dietSql);
                                            // let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                            // let heightResult = await header.query(heightSql);
                                            // let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                            // let annualIncomeResult = await header.query(annualIncomeSql);
                                            // let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                            // let employmentTypeResult = await header.query(employmentTypeSql);
                                            // let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                            // let documentTypeResult = await header.query(documentTypeSql);
                                            // userResult[0].masterEntryData = {
                                            //     "occupation": occupationResult,
                                            //     "education": educationResult,
                                            //     "maritalStatus": maritalStatusResult,
                                            //     "religion": religionResult,
                                            //     "community": communityResult,
                                            //     "subCommunity": subCommunityResult,
                                            //     "diet": dietResult,
                                            //     "height": heightResult,
                                            //     "annualIncome": annualIncomeResult,
                                            //     "employmentType": employmentTypeResult,
                                            //     "maxAge": maxAge[0].maxAge,
                                            //     "minAge": minAge[0].minAge,
                                            //     "documentType": documentTypeResult
                                            // }
                                            userResult[0].isVerified = false;
                                            let isVerified = true;
                                            let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` +
                                                userResult[0].id;
                                            let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                            userResult[0].userDocuments = documentsResult;
                                            if (documentsResult && documentsResult.length > 0) {
                                                for (let j = 0; j < documentsResult.length; j++) {
                                                    if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                        isVerified = false;
                                                    }
                                                }
                                            }
                                            else {
                                                isVerified = false;
                                            }
                                            userResult[0].isVerifiedProfile = isVerified;
                                            userResult[0].isOAuth = false;
                                            userResult[0].isAppleLogin = false;
                                            userResult[0].userWalletAmount = 0;
                                            let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                            let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                            if (getUserWalletResult && getUserWalletResult.length > 0) {
                                                userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                            }
                                            if (userResult[0].isDemoUser == 1) {
                                                userResult[0].isDemoUser = true;
                                            }
                                            else {
                                                userResult[0].isDemoUser = false;
                                            }
                                            yield apiHeader_1.default.commit();
                                            // let successResult = new ResultSuccess(200, true, 'Login User', userResult, 1, "");
                                            // return res.status(200).send(successResult);
                                            //Note: Return 203 Status because in app need to complete profile screen
                                            let successResult = new resultsuccess_1.ResultSuccess(203, true, 'Login User', userResult, 1, '');
                                            return res.status(203).send(successResult);
                                        }
                                        else {
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                            next(errorResult);
                                        }
                                    }
                                    else {
                                        yield apiHeader_1.default.rollback();
                                        return res.status(401).json({
                                            message: 'Unable to Sign JWT',
                                            error: signJWTResult.error
                                        });
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                        }
                    }
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.validateAuthToken() Exception', error, '');
        next(errorResult);
    }
});
const validateAuthToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Validate auth token');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let currentUser = authorizationResult.currentUser;
            let userDevice = authorizationResult.currentUserDevice;
            let deviceDetailResult;
            let appId;
            if (userDevice.app == 'MatrimonyAdmin') {
                appId = 1;
            }
            else if (userDevice.app == 'MatrimonyAndroid') {
                appId = 2;
            }
            else {
                appId = 3;
            }
            const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
            console.log(isCustomFieldEnabled);
            yield apiHeader_1.default.beginTransaction();
            let userId;
            let insertRefTokenResult;
            let sql = `SELECT u.*, ur.roleId, img.imageUrl FROM users u
                LEFT JOIN userroles ur ON ur.userId = u.id
                LEFT JOIN images img ON img.id =u.imageId
                WHERE u.id = ` +
                currentUser.id +
                ` AND u.isActive = true AND ur.roleId = 2`;
            let result = yield apiHeader_1.default.query(sql);
            let userPerDetailSql = `SELECT u.id, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.memberid, upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = ` +
                currentUser.id +
                ` AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = ` +
                currentUser.id +
                ` AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = ` +
                currentUser.id +
                ` AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                   WHERE ur.roleId = 2
                                   AND u.id = ` +
                currentUser.id +
                ` `;
            let userResult = yield apiHeader_1.default.query(userPerDetailSql);
            if (userResult && userResult.length > 0) {
                for (let i = 0; i < userResult.length; i++) {
                    let userDetailResponse = yield customFields_1.default.getUserData(userResult[i]);
                    userResult[i] = Object.assign(Object.assign({}, userResult[i]), userDetailResponse);
                }
                //     for (let detail of userResult) {
                // let userDetailResponse: any = await controller.getUserResponse(detail.permanentAddress, detail.currentAddress, detail.familyDetail, detail.fatherDetails, detail.motherDetails,
                //     detail.pCountryLivingInId, detail.pCityLivingInId, detail.pReligionId, detail.pCommunityId, detail.pStateLivingInId, detail.pEducationMediumId, detail.pOccupationId,
                //     detail.pEmploymentTypeId, detail.pMaritalStatusId, detail.pAnnualIncomeId, detail.pDietId, detail.pEducationTypeId, detail.pComplexion, detail.pBodyType);
                // console.log(userDetailResponse);
                // detail = { ...detail, ...userDetailResponse };
                // detail.permanentAddress = userDetailResponse.permanentAddress
                // detail.currentAddress = userDetailResponse.currentAddress
                // detail.familyDetail = userDetailResponse.familyDetail
                // detail.fatherDetails = userDetailResponse.fatherDetails
                // detail.motherDetails = userDetailResponse.motherDetails
                // detail.pCountryLivingInId = userDetailResponse.pCountryLivingInId
                // detail.pCityLivingInId = userDetailResponse.pCityLivingInId
                // detail.pReligionId = userDetailResponse.pReligionId;
                // detail.pCommunityId = userDetailResponse.pCommunityId;
                // detail.pStateLivingInId = userDetailResponse.pStateLivingInId;
                // detail.pEducationMediumId = userDetailResponse.pEducationMediumId;
                // detail.pEducationTypeId = userDetailResponse.pEducationTypeId;
                // detail.pOccupationId = userDetailResponse.pOccupationId;
                // detail.pEmploymentTypeId = userDetailResponse.pEmploymentTypeId;
                // detail.pAnnualIncomeId = userDetailResponse.pAnnualIncomeId;
                // detail.pDietId = userDetailResponse.pDietId;
                // detail.pMaritalStatusId = userDetailResponse.pMaritalStatusId;
                // detail.pCountries = userDetailResponse.pCountries;
                // detail.pReligions = userDetailResponse.pReligions;
                // detail.pCommunities = userDetailResponse.pCommunities;
                // detail.pStates = userDetailResponse.pStates;
                // detail.pEducationMedium = userDetailResponse.pEducationMedium;
                // detail.pOccupation = userDetailResponse.pOccupation;
                // detail.pEmploymentType = userDetailResponse.pEmploymentType;
                // detail.pAnnualIncome = userDetailResponse.pAnnualIncome;
                // detail.pMaritalStatus = userDetailResponse.pMaritalStatus,
                //     detail.pDiet = userDetailResponse.pDiet
                // detail.pComplexion = userDetailResponse.pComplexion
                // detail.pBodyType = userDetailResponse.pBodyType
                // detail.permanentAddress = detail.permanentAddress ? JSON.parse(detail.permanentAddress) : null;
                // detail.currentAddress = detail.currentAddress ? JSON.parse(detail.currentAddress) : null;
                // detail.familyDetail = detail.familyDetail ? JSON.parse(detail.familyDetail) : null;
                // detail.fatherDetails = detail.fatherDetails ? JSON.parse(detail.fatherDetails) : null;
                // detail.motherDetails = detail.motherDetails ? JSON.parse(detail.motherDetails) : null;
                //     }
            }
            if (result && result.length > 0) {
                let checkbloclsql = `SELECT * FROM userblockrequest WHERE blockRequestUserId = ` + result[0].id + ` AND status = true`;
                let checkbloclResult = yield apiHeader_1.default.query(checkbloclsql);
                if (checkbloclResult && checkbloclResult.length > 0) {
                    // let errorResult = new ResultSuccess(401, true, 'Your account was bloacked', [], 1, "");
                    // return res.status(200).send(successResult);
                    let errorResult = new resulterror_1.ResultError(203, true, '', new Error('Name Already Exist'), '');
                    next(errorResult);
                }
                else {
                    if (result[0].isDisable) {
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.login() Error', new Error('Your profile was block by Admin. You cannot login.'), '');
                        next(errorResult);
                    }
                    else {
                        userId = result[0].id;
                        if (result && result.length > 0) {
                            // bcryptjs.compare(req.body.password, result[0].password, async (error, hashresult: any) => {
                            //     if (hashresult == false) {
                            //         return res.status(401).json({
                            //             message: 'Password Mismatch'
                            //         });
                            //     } else if (hashresult) {
                            //         let signJWTResult: any = await signJWT(result[0]);
                            //         if (signJWTResult && signJWTResult.token) {
                            let authorization = '';
                            if (req.headers['authorization'] != undefined && req.headers['authorization'] != '') {
                                let authorizationHeader = req.headers['authorization'];
                                if (authorizationHeader.indexOf('|') > 0) {
                                    authorization = authorizationHeader.split('|')[1];
                                }
                                else {
                                    authorization = authorizationHeader;
                                }
                                if (authorization != '') {
                                    let token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
                                    userResult[0].token = token;
                                }
                            }
                            if (userDevice) {
                                let checkDeviceSql = `SELECT * FROM userdevicedetail WHERE userId = ` + userId + ``;
                                result = yield apiHeader_1.default.query(checkDeviceSql);
                                userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                if (result && result.length > 0) {
                                    let updateDetailSql = `UPDATE userdevicedetail SET userId = ` +
                                        userId +
                                        `,applicationId = ` +
                                        appId +
                                        `,deviceId = '` +
                                        userDevice.deviceId +
                                        `',fcmToken = '` +
                                        userDevice.fcmToken +
                                        `',deviceLocation = '` +
                                        userDevice.deviceLocation +
                                        `',deviceManufacturer = '` +
                                        userDevice.deviceManufacturer +
                                        `',deviceModel = '` +
                                        userDevice.deviceModel +
                                        `',apiCallTime = '` +
                                        userDevice.apiCallTime +
                                        `' WHERE userId = ` +
                                        userId;
                                    result = yield apiHeader_1.default.query(updateDetailSql);
                                }
                                else {
                                    let insertDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) VALUES(` +
                                        userId +
                                        `,` +
                                        appId +
                                        `,'` +
                                        userDevice.deviceId +
                                        `','` +
                                        userDevice.fcmToken +
                                        `','` +
                                        userDevice.deviceLocation +
                                        `','` +
                                        userDevice.deviceManufacturer +
                                        `','` +
                                        userDevice.deviceModel +
                                        `','` +
                                        userDevice.apiCallTime +
                                        `')`;
                                    result = yield apiHeader_1.default.query(insertDetailSql);
                                }
                            }
                            let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                            //insert refresh token
                            let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                            insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                            if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                userResult[0].refreshToken = refreshToken.token;
                                let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                        LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                        WHERE ufv.userId = ` +
                                    userId +
                                    ``;
                                userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                let todayDate = new Date();
                                let date = new Date(todayDate).getFullYear() + '-' + ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(todayDate).getDate()).slice(-2) + '';
                                let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                            LEFT JOIN package p ON p.id = up.packageId
                                            LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                            LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                            WHERE up.userId = ` +
                                    userId +
                                    ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                            order by p.weightage DESC`;
                                let userPackage = yield apiHeader_1.default.query(userPackages);
                                if (userPackage && userPackage.length > 0) {
                                    for (let k = 0; k < userPackage.length; k++) {
                                        let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                    LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                     WHERE pf.packageId = ` + userPackage[k].packageId);
                                        userPackage[k].packageFacility = packageFacility;
                                    }
                                }
                                userResult[0].userPackage = userPackage[0];
                                //     let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                // FROM users u
                                // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                // LEFT JOIN userroles ur ON ur.userId = u.id
                                // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id)
                                // AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                //     let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                // FROM users u
                                // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                // LEFT JOIN userroles ur ON ur.userId = u.id
                                // WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id)
                                // AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                //     let ageList = [];
                                //     for (let i = 18; i <= 60; i++) {
                                //         ageList.push(i)
                                //     }
                                //     console.log(ageList)
                                // let cityName = await header.query(`select (cityName) FROM addresses where cityName is not null or cityName !='' group by cityName  having  cityName !=''`)
                                // let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                // let occupationResult = await header.query(occupationSql);
                                // let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                // let educationResult = await header.query(educationSql);
                                // let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                // let maritalStatusResult = await header.query(maritalStatusSql);
                                // let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                // let religionResult = await header.query(religionSql);
                                // let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                // let communityResult = await header.query(communitySql);
                                // let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                // let subCommunityResult = await header.query(subCommunitySql);
                                // let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                // let dietResult = await header.query(dietSql);
                                // let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                // let heightResult = await header.query(heightSql);
                                // let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                // let annualIncomeResult = await header.query(annualIncomeSql);
                                // let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                // let employmentTypeResult = await header.query(employmentTypeSql);
                                // let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                // let documentTypeResult = await header.query(documentTypeSql);
                                // userResult[0].masterEntryData = {
                                //     "occupation": occupationResult,
                                //     "education": educationResult,
                                //     "maritalStatus": maritalStatusResult,
                                //     "religion": religionResult,
                                //     "community": communityResult,
                                //     "subCommunity": subCommunityResult,
                                //     "diet": dietResult,
                                //     "height": heightResult,
                                //     "annualIncome": annualIncomeResult,
                                //     "employmentType": employmentTypeResult,
                                //     "maxAge": maxAge[0].maxAge,
                                //     "minAge": minAge[0].minAge,
                                //     "ageList": ageList,
                                //     "cityName": cityName,
                                //     "documentType": documentTypeResult
                                // }
                                userResult[0].isVerified = false;
                                let isVerified = true;
                                let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + userResult[0].id;
                                let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                userResult[0].userDocuments = documentsResult;
                                if (documentsResult && documentsResult.length > 0) {
                                    for (let j = 0; j < documentsResult.length; j++) {
                                        if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                            isVerified = false;
                                        }
                                    }
                                }
                                else {
                                    isVerified = false;
                                }
                                userResult[0].isVerifiedProfile = isVerified;
                                if (userResult[0].isVerifyProfilePic) {
                                    userResult[0].isVerifyProfilePic = true;
                                }
                                else {
                                    userResult[0].isVerifyProfilePic = false;
                                }
                                let getUserAuthSql = `SELECT * FROM userauthdata WHERE userId = ` + userResult[0].id;
                                let getUserAuthResult = yield apiHeader_1.default.query(getUserAuthSql);
                                userResult[0].isOAuth = getUserAuthResult && getUserAuthResult.length > 0 ? true : false;
                                userResult[0].isAppleLogin = getUserAuthResult && getUserAuthResult.length > 0 && getUserAuthResult[0].authProviderId == 3 ? true : false;
                                userResult[0].userWalletAmount = 0;
                                let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                if (getUserWalletResult && getUserWalletResult.length > 0) {
                                    userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                }
                                // region to get user personal custom data
                                let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(userResult[0].id);
                                if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                                    // console.log(_customFieldDataResult);
                                    userResult[0].customFields = _customFieldDataResult;
                                }
                                // if (isCustomFieldEnabled) {
                                //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + userResult[0].id;
                                //     let userCustomDataResult = await header.query(userCustomDataSql);
                                //     let customdata: any[] = [];
                                //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                                //         const userCustomDataArrays = [];
                                //         const keys = Object.keys(userCustomDataResult[0]);
                                //         userCustomDataArrays.push(keys);
                                //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                                //         for (let i = 0; i < filteredColumns.length; i++) {
                                //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[i] + `' and isActive = 1`;
                                //             let result = await header.query(sql);
                                //             let userDataSql = `SELECT ` + filteredColumns[i] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + userResult[0].id;
                                //             let userDataResult = await header.query(userDataSql);
                                //             let mergedResult = Object.assign({}, result[0], userDataResult[0]);
                                //             customdata.push(mergedResult);
                                //             console.log(userCustomDataResult);
                                //         }
                                //         if (customdata && customdata.length > 0) {
                                //             for (let i = 0; i < customdata.length; i++) {
                                //                 if (customdata[i].valueList) {
                                //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                                //                     customdata[i].valueList = valueListArray;
                                //                 }
                                //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                                //                     if (customdata[i].valueTypeId == 10) {
                                //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                                //                         customdata[i].value = valueArray;
                                //                     }
                                //                 }
                                //             }
                                //         }
                                //         userResult[0].customFields = customdata;
                                //     }
                                // }
                                // else {
                                //     await header.rollback();
                                //     let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                                //     next(errorResult);
                                // }
                                // end region to get user personal custom data 
                                if (userResult[0].isDemoUser == 1) {
                                    userResult[0].isDemoUser = true;
                                }
                                else {
                                    userResult[0].isDemoUser = false;
                                }
                                yield apiHeader_1.default.commit();
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Login User', userResult, 1, '');
                                return res.status(200).send(successResult);
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                next(errorResult);
                            }
                            //         } else {
                            //             return res.status(401).json({
                            //                 message: 'Unable to Sign JWT',
                            //                 error: signJWTResult.error
                            //             });
                            //         }
                            //     }
                            // });
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, 'users.login() Error', new Error('Error While Login'), '');
                            next(errorResult);
                        }
                    }
                }
            }
            else {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Email is incorrect!', [], 1, '');
                return res.status(200).send(successResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.validateAuthToken() Exception', error, '');
        next(errorResult);
    }
});
const validateAuthTokenOld = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Validate auth token');
        let authorization = '';
        if (req.headers['authorization'] != undefined && req.headers['authorization'] != '') {
            let authorizationHeader = req.headers['authorization'];
            if (authorizationHeader.indexOf('|') > 0) {
                authorization = authorizationHeader.split('|')[1];
            }
            else {
                authorization = authorizationHeader;
            }
            if (authorization != '') {
                let token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
                if (token) {
                    yield jsonwebtoken_1.default.verify(token, config_1.default.server.token.secret, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                        if (error) {
                            let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error('Unauthorized request'), '');
                            next(errorResult);
                        }
                        else {
                            let decodeVal = decoded;
                            let currentUser; //= await getcurrentUser(decodeVal.userId);
                            let userSql = `SELECT * FROM users WHERE id = ` + decodeVal.userId;
                            let userResult = yield apiHeader_1.default.query(userSql);
                            if (userResult && userResult.length > 0) {
                                let roleSql = `SELECT roleId,roles.name as roleName FROM userroles INNER JOIN roles  ON  roles.id = userroles.roleId LEFT JOIN userdevicedetail ON userdevicedetail.userId = userroles.userId WHERE userId =` +
                                    decodeVal.userId;
                                let roleResult = yield apiHeader_1.default.query(roleSql);
                                let roles = {
                                    id: roleResult[0].roleId,
                                    name: roleResult[0].roleName
                                };
                                let data = new users_1.Users(userResult[0].id, userResult[0].firstName, userResult[0].middleName, userResult[0].lastName, userResult[0].contactNo, userResult[0].email, userResult[0].gender, userResult[0].password, userResult[0].imageId, userResult[0].isPasswordSet, userResult[0].isDisable, userResult[0].isVerified, userResult[0].isActive, userResult[0].isDelete, userResult[0].createdDate, userResult[0].modifiedDate, userResult[0].createdBy, userResult[0].modifiedBy, roles.id, roles, '', roleResult[0].applicationId);
                                currentUser = data;
                                currentUser.token = token;
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Session Validate', [currentUser, currentUser.token], 1, 'null');
                                return res.status(200).send(successResult);
                            }
                            else {
                                let errorResult = new resulterror_1.ResultError(300, true, 'User not available.', new Error('User not available.'), '');
                                next(errorResult);
                            }
                        }
                    }));
                }
                else {
                    let errorResult = new resulterror_1.ResultError(300, true, 'Authorization header is required.', new Error('Authorization header is required.'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(300, true, 'Authorization header is required.', new Error('Authorization header is required.'), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error('Unauthorized request'), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.validateAuthToken() Exception', error, '');
        next(errorResult);
    }
});
const registerViaPhone = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Sign Up Via Phone');
        let insertRefTokenResult;
        let deviceDetailResult;
        let requiredFields = ['email', 'contactNo'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userDevice = authorizationResult.currentUserDevice;
                let appId;
                if (userDevice.app == 'MatrimonyAdmin') {
                    appId = 1;
                }
                else if (userDevice.app == 'MatrimonyAndroid') {
                    appId = 2;
                }
                else {
                    appId = 3;
                }
                req.body.imageId = req.body.imageId ? req.body.imageId : null;
                yield apiHeader_1.default.beginTransaction();
                let checkEmail = `SELECT * FROM users WHERE email = '` + req.body.email + `'`;
                let checkEmailResult = yield apiHeader_1.default.query(checkEmail);
                if (checkEmailResult && checkEmailResult.length > 0) {
                    yield apiHeader_1.default.rollback();
                    let successResult = 'Email Already Inserted';
                    return res.status(200).send(successResult);
                }
                else {
                    let sql = `INSERT INTO users(contactNo, email, isDisable, referalUserId) VALUES ('` +
                        req.body.contactNo +
                        `','` +
                        req.body.email +
                        `', 0, ` +
                        (req.body.referalUserId ? req.body.referalUserId : null) +
                        `)`;
                    let result = yield apiHeader_1.default.query(sql);
                    if (result && result.insertId > 0) {
                        let userId = result.insertId;
                        let userRoleSql = `INSERT INTO userroles(userId, roleId) VALUES (` + userId + `, 2) `;
                        result = yield apiHeader_1.default.query(userRoleSql);
                        if (result && result.affectedRows > 0) {
                            if (userDevice) {
                                userDevice.apiCallTime = userDevice.apiCallTime ? userDevice.apiCallTime : '';
                                let deviceDetailSql = `INSERT INTO userdevicedetail(userId, applicationId, deviceId, fcmToken, deviceLocation, deviceManufacturer, deviceModel, apiCallTime) VALUES(` +
                                    userId +
                                    `,` +
                                    appId +
                                    `,'` +
                                    userDevice.deviceId +
                                    `','` +
                                    userDevice.fcmToken +
                                    `','` +
                                    userDevice.deviceLocation +
                                    `','` +
                                    userDevice.deviceManufacturer +
                                    `','` +
                                    userDevice.deviceModel +
                                    `','` +
                                    userDevice.apiCallTime +
                                    `')`;
                                deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                            }
                            let userFlag = yield apiHeader_1.default.query(`SELECT * FROM userflags`);
                            if (userFlag && userFlag.length > 0) {
                                for (let index = 0; index < userFlag.length; index++) {
                                    let userFlagSql = `INSERT INTO userflagvalues(userId, userFlagId, userFlagValue) VALUES (` + userId + `, ` + userFlag[index].id + `, ` + userFlag[index].defaultValue + `)`;
                                    let userFlagSqlResult = yield apiHeader_1.default.query(userFlagSql);
                                }
                            }
                            let userPerDetailSql = `SELECT u.id, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo
                            , upd.birthDate, upd.languages, upd.eyeColor, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId, pf.name as profileForName
                            , img.imageUrl, r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                            , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
                            , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                            , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age
                            , addr.latitude, addr.longitude
                                FROM users u
                                LEFT JOIN userroles ur ON ur.userId = u.id
                                LEFT JOIN images img ON img.id = u.imageId
                                LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                LEFT JOIN religion r ON r.id = upd.religionId
                                LEFT JOIN community c ON c.id = upd.communityId
                                LEFT JOIN occupation o ON o.id = upd.occupationId
                                LEFT JOIN education e ON e.id = upd.educationId
                                LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                LEFT JOIN height h ON h.id = upd.heightId
                                LEFT JOIN addresses addr ON addr.id = upd.addressId
                                LEFT JOIN cities cit ON addr.cityId = cit.id
                                LEFT JOIN districts ds ON addr.districtId = ds.id
                                LEFT JOIN state st ON addr.stateId = st.id
                                LEFT JOIN countries cou ON addr.countryId = cou.id
                                LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                LEFT JOIN profilefor pf ON pf.id = upd.profileForId
                                 WHERE ur.roleId = 2 AND u.id =  ` +
                                userId +
                                ``;
                            let userResult = yield apiHeader_1.default.query(userPerDetailSql);
                            let signJWTResult = yield (0, signJTW_1.default)(userResult[0]);
                            if (signJWTResult && signJWTResult.token) {
                                userResult[0].token = signJWTResult.token;
                                let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                                //insert refresh token
                                let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                                insertRefTokenResult = yield apiHeader_1.default.query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                                if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                    userResult[0].refreshToken = refreshToken.token;
                                    let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                        LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                        WHERE ufv.userId = ` +
                                        userId +
                                        ``;
                                    userResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                    let todayDate = new Date();
                                    let date = new Date(todayDate).getFullYear() + '-' + ('0' + (new Date(todayDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(todayDate).getDate()).slice(-2) + '';
                                    let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value FROM userpackage up
                                        LEFT JOIN package p ON p.id = up.packageId
                                        LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                            WHERE up.userId = ` +
                                        userId +
                                        ` order by createdDate DESC`;
                                    let userPackage = yield apiHeader_1.default.query(userPackages);
                                    if (userPackage && userPackage.length > 0) {
                                        for (let k = 0; k < userPackage.length; k++) {
                                            let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                 WHERE pf.packageId = ` + userPackage[k].packageId);
                                            userPackage[k].packageFacility = packageFacility;
                                        }
                                    }
                                    userResult[0].userPackage = userPackage[0];
                                    // let minAge = await header.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                    //         FROM users u
                                    //         LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                    //         LEFT JOIN userroles ur ON ur.userId = u.id
                                    //         WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                    // let maxAge = await header.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                    //         FROM users u
                                    //         LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                    //         LEFT JOIN userroles ur ON ur.userId = u.id
                                    //         WHERE ur.roleId = 2 AND u.id != ` + userResult[0].id + ` AND (upa.userId = u.id) AND u.id NOT IN (select userBlockId from userblock where userId = ` + userResult[0].id + `)`);
                                    // let occupationSql = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0`;
                                    // let occupationResult = await header.query(occupationSql);
                                    // let educationSql = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0`;
                                    // let educationResult = await header.query(educationSql);
                                    // let maritalStatusSql = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0`;
                                    // let maritalStatusResult = await header.query(maritalStatusSql);
                                    // let religionSql = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
                                    // let religionResult = await header.query(religionSql);
                                    // let communitySql = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0`;
                                    // let communityResult = await header.query(communitySql);
                                    // let subCommunitySql = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0`;
                                    // let subCommunityResult = await header.query(subCommunitySql);
                                    // let dietSql = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0`;
                                    // let dietResult = await header.query(dietSql);
                                    // let heightSql = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name`;
                                    // let heightResult = await header.query(heightSql);
                                    // let annualIncomeSql = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0`;
                                    // let annualIncomeResult = await header.query(annualIncomeSql);
                                    // let employmentTypeSql = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0`;
                                    // let employmentTypeResult = await header.query(employmentTypeSql);
                                    // let documentTypeSql = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0`;
                                    // let documentTypeResult = await header.query(documentTypeSql);
                                    // userResult[0].masterEntryData = {
                                    //     "occupation": occupationResult,
                                    //     "education": educationResult,
                                    //     "maritalStatus": maritalStatusResult,
                                    //     "religion": religionResult,
                                    //     "community": communityResult,
                                    //     "subCommunity": subCommunityResult,
                                    //     "diet": dietResult,
                                    //     "height": heightResult,
                                    //     "annualIncome": annualIncomeResult,
                                    //     "employmentType": employmentTypeResult,
                                    //     "maxAge": maxAge[0].maxAge,
                                    //     "minAge": minAge[0].minAge,
                                    //     "documentType": documentTypeResult
                                    // }
                                    userResult[0].isVerified = false;
                                    let isVerified = true;
                                    let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + userResult[0].id;
                                    let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                    userResult[0].userDocuments = documentsResult;
                                    if (documentsResult && documentsResult.length > 0) {
                                        for (let j = 0; j < documentsResult.length; j++) {
                                            if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                isVerified = false;
                                            }
                                        }
                                    }
                                    else {
                                        isVerified = false;
                                    }
                                    userResult[0].isVerifiedProfile = isVerified;
                                    let getUserAuthSql = `SELECT * FROM userauthdata WHERE userId = ` + userResult[0].id;
                                    let getUserAuthResult = yield apiHeader_1.default.query(getUserAuthSql);
                                    userResult[0].isOAuth = getUserAuthResult && getUserAuthResult.length > 0 ? true : false;
                                    userResult[0].isAppleLogin = getUserAuthResult && getUserAuthResult.length > 0 && getUserAuthResult[0].authProviderId == 3 ? true : false;
                                    userResult[0].userWalletAmount = 0;
                                    let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + userResult[0].id;
                                    let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                    if (getUserWalletResult && getUserWalletResult.length > 0) {
                                        userResult[0].userWalletAmount = getUserWalletResult[0].amount;
                                    }
                                    yield apiHeader_1.default.commit();
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Login User', userResult, 1, '');
                                    return res.status(200).send(successResult);
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                return res.status(401).json({
                                    message: 'Unable to Sign JWT',
                                    error: signJWTResult.error
                                });
                            }
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                            next(errorResult);
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Inserting Data'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) { }
});
const getMasterData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Get Master Data');
        let result;
        const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
        console.log(isCustomFieldEnabled);
        // let sql = "CALL getMasterData()";
        // let masterData = await header.query(sql);
        let sql1 = `SELECT * FROM occupation WHERE isActive = 1 AND isDelete = 0;`;
        let result1 = yield apiHeader_1.default.query(sql1);
        let sql2 = `SELECT * FROM education WHERE isActive = 1 AND isDelete = 0;`;
        let result2 = yield apiHeader_1.default.query(sql2);
        let sql3 = `SELECT * FROM maritalstatus WHERE isActive = 1 AND isDelete = 0;`;
        let result3 = yield apiHeader_1.default.query(sql3);
        let sql4 = `SELECT * FROM religion WHERE isActive = 1 AND isDelete = 0`;
        let result4 = yield apiHeader_1.default.query(sql4);
        let sql5 = `SELECT * FROM community WHERE isActive = 1 AND isDelete = 0;`;
        let result5 = yield apiHeader_1.default.query(sql5);
        let sql6 = `SELECT * FROM subcommunity WHERE isActive = 1 AND isDelete = 0;`;
        let result6 = yield apiHeader_1.default.query(sql6);
        let sql7 = `SELECT * FROM diet WHERE isActive = 1 AND isDelete = 0;`;
        let result7 = yield apiHeader_1.default.query(sql7);
        let sql8 = `SELECT * FROM height WHERE isActive = 1 AND isDelete = 0 order by name;`;
        let result8 = yield apiHeader_1.default.query(sql8);
        let sql9 = `SELECT * FROM annualincome WHERE isActive = 1 AND isDelete = 0;`;
        let result9 = yield apiHeader_1.default.query(sql9);
        let sql10 = `SELECT * FROM employmenttype WHERE isActive = 1 AND isDelete = 0;`;
        let result10 = yield apiHeader_1.default.query(sql10);
        let sql11 = `SELECT * FROM documenttype WHERE isActive = 1 AND isDelete = 0;`;
        let result11 = yield apiHeader_1.default.query(sql11);
        let sql12 = `SELECT * FROM profilefor WHERE isActive = 1 AND isDelete = 0;`;
        let result12 = yield apiHeader_1.default.query(sql12);
        let sql13 = `SELECT * FROM weight WHERE isActive = 1 AND isDelete = 0 order by name;`;
        let result13 = yield apiHeader_1.default.query(sql13);
        let result14 = [];
        if (isCustomFieldEnabled) {
            let sql14 = `SELECT * FROM customfields WHERE isActive = 1`;
            result14 = yield apiHeader_1.default.query(sql14);
            if (result14 && result14.length > 0) {
                for (let i = 0; i < result14.length; i++) {
                    if (result14[i].valueList) {
                        const valueListArray = result14[i].valueList.includes(';') ? result14[i].valueList.split(';') : [result14[i].valueList];
                        result14[i].valueList = valueListArray;
                    }
                    if (result14[i].valueTypeId == 10 && result14[i].defaultValue) {
                        const valueListArray = result14[i].defaultValue.includes(';') ? result14[i].defaultValue.split(';') : [result14[i].defaultValue];
                        result14[i].defaultValue = valueListArray;
                    }
                }
            }
        }
        let sql15 = `SELECT * FROM educationtype WHERE isActive = 1 AND isDelete = 0`;
        let result15 = yield apiHeader_1.default.query(sql15);
        let sql16 = `SELECT * FROM educationmedium WHERE isActive = 1 AND isDelete = 0`;
        let result16 = yield apiHeader_1.default.query(sql16);
        let sql17 = `SELECT * FROM registrationscreens WHERE isActive = 1 AND isDelete = 0`;
        let result17 = yield apiHeader_1.default.query(sql17);
        // if (masterData && masterData.length > 0) {
        let minAge = yield apiHeader_1.default.query(`SELECT min(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as minAge
                                            FROM users u
                                            LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                            LEFT JOIN userroles ur ON ur.userId = u.id
                                            WHERE ur.roleId = 2 `);
        let maxAge = yield apiHeader_1.default.query(`SELECT max(DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0) as maxAge
                                            FROM users u
                                            LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                                            LEFT JOIN userroles ur ON ur.userId = u.id
                                            WHERE ur.roleId = 2`);
        if (maxAge[0].maxAge == minAge[0].minAge) {
            maxAge[0].maxAge = 60;
        }
        let ageList = [];
        for (let i = 18; i <= 60; i++) {
            ageList.push(i);
        }
        let cityName = yield apiHeader_1.default.query(`select (cityName) FROM addresses where cityName is not null or cityName !='' group by cityName  having  cityName !=''`);
        result = {
            occupation: result1,
            education: result2,
            // "maritalStatus": result3,
            religion: result4,
            community: result5,
            subCommunity: result6,
            // "diet": result7,
            height: result8,
            annualIncome: result9,
            employmentType: result10,
            maxAge: maxAge[0].maxAge ? maxAge[0].maxAge : 60,
            minAge: minAge[0].minAge ? minAge[0].minAge : 18,
            ageList: ageList,
            cityName: cityName,
            documentType: result11,
            // "profileFor": result12,
            weight: result13,
            customFields: result14,
            educationType: result15,
            educationMedium: result16,
            registrationScreens: result17
        };
        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Master Data Successfully', result, 1, '');
        return res.status(200).send(successResult);
        // } else {
        //     let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
        //     next(errorResult);
        // }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getUsers() Exception', error, '');
        next(errorResult);
    }
});
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Users');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let currentUser = authorizationResult.currentUser;
            let userId = currentUser.id;
            let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let sql = `SELECT  u.id, u.firstName, u.middleName, u.lastName, u.gender, u.contactNo, u.email, img.imageUrl ,
                u.id IN (select proposalUserId from userproposals where userId = ` +
                userId +
                `) as isProposed,
                u.id IN (select favUserId from userfavourites where userId = ` +
                userId +
                `) as isFavourite
                 FROM users u
                LEFT JOIN userroles ur ON ur.userId = u.id
                LEFT JOIN images img ON img.id = u.imageId
                WHERE u.isDelete = 0 ANd ur.roleId = 2 AND u.id != ` +
                userId +
                ` AND
                u.id NOT IN (select userBlockId from userblock where userId = ` +
                userId +
                `) AND
                u.id NOT IN (select userId from userblock where userBlockId = ` +
                userId +
                `)
                and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` +
                userId +
                `)
                AND u.isDisable = 0
                 group by u.id`;
            if (startIndex != null && fetchRecord != null) {
                sql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result && result.length > 0) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Users Successfully', result, result.length, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getUsers() Exception', error, '');
        next(errorResult);
    }
});
const viewUserDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield apiHeader_1.default.beginTransaction();
        logging_1.default.info(NAMESPACE, 'Getting User Detail');
        let requiredFields = ['id'];
        const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
        console.log(isCustomFieldEnabled);
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser ? currentUser.id : 0;
                let sql = `SELECT u.id, udd.fcmToken,u.stripeCustomerId,img.imageUrl, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo,u.isVerifyProfilePic,  u.isDemoUser, upa.memberid,upa.isHideContactDetail
                         , upa.religionId, upa.communityId, upa.maritalStatusId, upa.occupationId, upa.educationId, upa.subCommunityId, upa.dietId, upa.annualIncomeId, upa.heightId, upa.birthDate
                        , upa.languages, upa.eyeColor, upa.businessName, upa.companyName, upa.employmentTypeId, upa.weight as weightId, upa.profileForId, upa.expectation, upa.aboutMe
                        ,upa.memberid, upa.anyDisability, upa.haveSpecs, upa.haveChildren, upa.noOfChildren, upa.bloodGroup, upa.complexion, upa.bodyType, upa.familyType, upa.motherTongue
                        , upa.currentAddressId, upa.nativePlace, upa.citizenship, upa.visaStatus, upa.designation, upa.educationTypeId, upa.educationMediumId, upa.drinking, upa.smoking
                        , upa.willingToGoAbroad, upa.areYouWorking,upa.addressId ,edt.name as educationType, edme.name as educationMedium
                        , r.name as religion,  c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                        , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                        , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y')+0 AS age,
                         JSON_OBJECT(
                                 'id',addr.id,
								'addressLine1', addr.addressLine1, 
								'addressLine2', addr.addressLine2, 
								'pincode', addr.pincode, 
								'cityId', addr.cityId, 
								'districtId', addr.districtId, 
								'stateId', addr.stateId, 
								'countryId', addr.countryId,
								'cityName', addr.cityName,
								'stateName', addr.stateName,
								'countryName', addr.countryName,
                                 'residentialStatus',addr.residentialStatus,
                                 'latitude',addr.latitude,
                                 'longitude',addr.longitude
                         ) AS permanentAddress,
                         JSON_OBJECT(
                                 'id', cuaddr.id,
								'addressLine1', cuaddr.addressLine1, 
								'addressLine2', cuaddr.addressLine2, 
								'pincode', cuaddr.pincode, 
								'cityId', cuaddr.cityId, 
								'districtId', cuaddr.districtId, 
								'stateId', cuaddr.stateId, 
								'countryId', cuaddr.countryId,
								'cityName', cuaddr.cityName,
								'stateName', cuaddr.stateName,
								'countryName', cuaddr.countryName,
                                 'residentialStatus',cuaddr.residentialStatus,
                                 'latitude',cuaddr.latitude,
                                 'longitude',cuaddr.longitude
                         ) AS currentAddress,
                         (SELECT JSON_ARRAYAGG(JSON_OBJECT(
								'id', ufdfd.id,
								'userId', ufdfd.userId,
								'name', ufdfd.name,
								'memberType', ufdfd.memberType,
								'memberSubType', ufdfd.memberSubType,
								'educationId', ufdfd.educationId,
								'occupationId', ufdfd.occupationId,
								'maritalStatusId', ufdfd.maritalStatusId,
								'isAlive', ufdfd.isAlive
						)) 
						 FROM userfamilydetail ufdfd
						 WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                         (SELECT JSON_OBJECT(
                                 'id',ufdf.id, 
                                 'userId',ufdf.userId, 
                                 'name',ufdf.name, 
                                 'memberType',ufdf.memberType, 
                                 'memberSubType',ufdf.memberSubType, 
                                 'educationId',ufdf.educationId, 
                                 'occupationId',ufdf.occupationId, 
                                 'maritalStatusId',ufdf.maritalStatusId, 
                                 'isAlive',ufdf.isAlive
						) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                           (SELECT JSON_OBJECT(
                                 'id',ufdm.id, 
                                 'userId',ufdm.userId, 
                                 'name',ufdm.name, 
                                 'memberType',ufdm.memberType, 
                                 'memberSubType',ufdm.memberSubType, 
                                 'educationId',ufdm.educationId, 
                                 'occupationId',ufdm.occupationId, 
                                 'maritalStatusId',ufdm.maritalStatusId, 
                                 'isAlive',ufdm.isAlive
						) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                        uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                        upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                        upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                        upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight

                , u.id IN (select favUserId from userfavourites where userId = ` +
                    req.body.id +
                    ` OR userId = ` +
                    userId +
                    `) as isFavourite
                , IF((select COUNT(id) from userproposals where (userId = ` +
                    userId +
                    ` AND proposalUserId = ` +
                    req.body.id +
                    `) OR (proposalUserId = ` +
                    userId +
                    ` AND userId = ` +
                    req.body.id +
                    `)) > 0,true,false) as isProposed
                , IF((select COUNT(id) from userproposals where (userId = ` +
                    userId +
                    ` AND proposalUserId = ` +
                    req.body.id +
                    `) ) > 0,true,false) as isProposalReceived
                , IF((select COUNT(id) from userproposals where (proposalUserId = ` +
                    userId +
                    ` AND userId = ` +
                    req.body.id +
                    `)) > 0,true,false) as isProposalSent
                ,  IF((select COUNT(id) from userproposals where (proposalUserId = ` +
                    req.body.id +
                    `) AND hascancelled = 1) > 0,true,false) as hascancelled
                , (select status from userproposals where (proposalUserId = ` +
                    req.body.id +
                    ` AND userId = ` +
                    userId +
                    `) AND hascancelled = 0) as proposalStatus
                
                FROM users u
                 LEFT JOIN userdevicedetail udd ON udd.userId = u.id
            LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
            LEFT JOIN userroles ur ON ur.userId = u.id
            LEFT JOIN images img ON img.id = u.imageId
            LEFT JOIN religion r ON r.id = upa.religionId
            LEFT JOIN community c ON c.id = upa.communityId
            LEFT JOIN occupation o ON o.id = upa.occupationId
            LEFT JOIN education e ON e.id = upa.educationId
            LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
            LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
            LEFT JOIN addresses addr ON addr.id = upa.addressId
            LEFT JOIN cities cit ON addr.cityId = cit.id
            LEFT JOIN districts ds ON addr.districtId = ds.id
            LEFT JOIN state st ON addr.stateId = st.id
            LEFT JOIN countries cou ON addr.countryId = cou.id
            LEFT JOIN height h ON h.id = upa.heightId            
            LEFT JOIN employmenttype em ON em.id = upa.employmenttypeId
            LEFT JOIN userpersonaldetailcustomdata updcd ON updcd.userId = u.id
            LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
            LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
            LEFT JOIN addresses cuaddr ON cuaddr.id = upa.currentAddressId
            LEFT JOIN weight w ON w.id = upa.weight
            LEFT JOIN educationmedium edme ON edme.id = upa.educationMediumId
            LEFT JOIN educationtype edt ON edt.id = upa.educationTypeId
            LEFT JOIN userpartnerpreferences uppu ON uppu.userId = ` +
                    userId +
                    `
                 WHERE ur.roleId = 2 AND u.id = ` +
                    req.body.id;
                console.log(sql);
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    // if (isCustomFieldEnabled) {
                    //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + req.body.id;
                    //     let userCustomDataResult = await header.query(userCustomDataSql);
                    //     let customdata: any[] = [];
                    //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                    //         const userCustomDataArrays = [];
                    //         const keys = Object.keys(userCustomDataResult[0]);
                    //         userCustomDataArrays.push(keys);
                    //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                    //         for (let i = 0; i < filteredColumns.length; i++) {
                    //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[i] + `' and isActive = 1`;
                    //             let result = await header.query(sql);
                    //             if (result && result.length > 0) {
                    //                 let userDataSql = `SELECT ` + filteredColumns[i] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + req.body.id;
                    //                 let userDataResult = await header.query(userDataSql);
                    //                 let mergedResult = Object.assign({}, result[0], userDataResult[0]);
                    //                 customdata.push(mergedResult);
                    //             }
                    //             console.log(userCustomDataResult);
                    //         }
                    //         if (customdata && customdata.length > 0) {
                    //             for (let i = 0; i < customdata.length; i++) {
                    //                 if (customdata[i].valueList) {
                    //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                    //                     customdata[i].valueList = valueListArray;
                    //                 }
                    //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                    //                     if (customdata[i].valueTypeId == 10) {
                    //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                    //                         customdata[i].value = valueArray;
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //         result[0].customFields = customdata;
                    //     }
                    // }
                    // else {
                    //     await header.rollback();
                    //     let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                    //     next(errorResult);
                    // }
                    // end region to get user personal custom data
                    // sql = `SELECT up.packageId,p.name as packageName,up.packageDurationId,up.startDate,up.endDate,up.netAmount,pay.paymentMode
                    // ,t.value   FROM  userpackage up
                    // LEFT JOIN package p on p.id= up.packageId
                    // LEFT join payment pay on pay.id= up.paymentId
                    // left join packageduration pd on pd.packageId = up.packageId
                    // left join timeduration t on t.id = pd.timeDurationId
                    // WHERE up.userId = `+ req.body.id + ` order by up.createdDate desc;`
                    // let userPackage = await header.query(sql);
                    // let packages = userPackage[0]
                    // // result[0].packages = packages
                    // // console.log(result[0].packages )
                    // if (packages) {
                    //     let packageFacility = await header.query(`SELECT  pff.name  FROM packagefacility pf
                    //         LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                    //          WHERE pf.packageId = ` + packages.packageId);
                    //     packages.packageFacility = packageFacility;
                    //     result[0].userPackage = packages
                    // }
                    if (authorizationResult.token == '') {
                        let authorizationHeader = req.headers['authorization'];
                        let token = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(' ')[1];
                        authorizationResult.token = token;
                    }
                    let isVerifyProfile = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'isUserProfilePicApprove'`);
                    for (let i = 0; i < result.length; i++) {
                        // result[i].isVerifiedProfile = false;
                        let isVerified = true;
                        let docVerifiedSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE ud.userId =` + result[i].id;
                        let docVerifiedResult = yield apiHeader_1.default.query(docVerifiedSql);
                        result[i].userDocuments = docVerifiedResult;
                        if (docVerifiedResult && docVerifiedResult.length > 0) {
                            for (let j = 0; j < docVerifiedResult.length; j++) {
                                if (docVerifiedResult[j].isRequired && !docVerifiedResult[j].isVerified) {
                                    isVerified = false;
                                }
                            }
                        }
                        else {
                            isVerified = false;
                        }
                        // result[i].isVerifiedProfile = isVerified;
                        // if (result[i].isVerifyProfilePic) {
                        //     result[i].isVerifyProfilePic = true;
                        // } else {
                        //     result[i].isVerifyProfilePic = false;
                        // }
                        if (isVerifyProfile && isVerifyProfile.length > 0) {
                            if (isVerifyProfile[0].value == true) {
                                if (!result[i].isVerifyProfilePic) {
                                    result[i].imageUrl = null;
                                    result[i].isVerifyProfilePic = false;
                                }
                                else {
                                    result[i].isVerifyProfilePic = true;
                                }
                            }
                            else {
                                result[i].isVerifyProfilePic = true;
                            }
                        }
                        else {
                            result[i].isVerifyProfilePic = true;
                        }
                        let getUserAuthSql = `SELECT * FROM userauthdata WHERE userId = ` + result[i].id;
                        let getUserAuthResult = yield apiHeader_1.default.query(getUserAuthSql);
                        result[i].isOAuth = getUserAuthResult && getUserAuthResult.length > 0 ? true : false;
                        result[i].isAppleLogin = getUserAuthResult && getUserAuthResult.length > 0 && getUserAuthResult[0].authProviderId == 3 ? true : false;
                        result[i].userWalletAmount = 0;
                        let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + result[i].id;
                        let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                        if (getUserWalletResult && getUserWalletResult.length > 0) {
                            result[i].userWalletAmount = getUserWalletResult[0].amount;
                        }
                        // result[i].userPackage = null;
                        // let packageSql = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value FROM userpackage up
                        // LEFT JOIN package p ON p.id = up.packageId
                        // LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                        // LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                        //     WHERE up.userId = ` + result[i].id + ` AND up.isActive=true AND up.isDelete = false AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP()) order by p.weightage DESC LIMIT 1`;
                        // let packageResult = await header.query(packageSql);
                        // if (packageResult && packageResult.length > 0) {
                        //     result[i].userPackage = packageResult[0];
                        //     let packageFacility = await header.query(`SELECT  pff.name  FROM packagefacility pf
                        //     LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                        //      WHERE pf.packageId = ` + result[i].userPackage.packageId);
                        //     result[i].userPackage.packageFacility = packageFacility;
                        // }
                        let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                            LEFT JOIN package p ON p.id = up.packageId
                                            LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                            LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                            WHERE up.userId = ` +
                            result[i].id +
                            ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                            order by p.weightage DESC`;
                        let userPackage = yield apiHeader_1.default.query(userPackages);
                        if (userPackage && userPackage.length > 0) {
                            for (let k = 0; k < userPackage.length; k++) {
                                let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                    LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                     WHERE pf.packageId = ` + userPackage[k].packageId);
                                userPackage[k].packageFacility = packageFacility;
                            }
                        }
                        result[i].userPackage = userPackage[0];
                        // region to get user personal custom data
                        let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(result[i].id);
                        if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                            // console.log(_customFieldDataResult);
                            result[i].customFields = _customFieldDataResult;
                        }
                        for (let i = 0; i < result.length; i++) {
                            let userDetailResponse = yield customFields_1.default.getUserData(result[i]);
                            result[i] = Object.assign(Object.assign({}, result[i]), userDetailResponse);
                        }
                        // let userDetailResponse: any = await controller.getUserResponse(result[i].permanentAddress, result[i].currentAddress, result[i].familyDetail, result[i].fatherDetails, result[i].motherDetails,
                        //     result[i].pCountryLivingInId, result[i].pCityLivingInId, result[i].pReligionId, result[i].pCommunityId, result[i].pStateLivingInId, result[i].pEducationMediumId, result[i].pOccupationId,
                        //     result[i].pEmploymentTypeId, result[i].pMaritalStatusId, result[i].pAnnualIncomeId, result[i].pDietId, result[i].pEducationTypeId, result[i].pComplexion, result[i].pBodyType);
                        // console.log(userDetailResponse);
                        // // result[i] = { ...result[i], ...userDetailResponse };
                        // result[i].permanentAddress = userDetailResponse.permanentAddress ? userDetailResponse.permanentAddress : null;
                        // result[i].currentAddress = userDetailResponse.currentAddress ? userDetailResponse.currentAddress : null;
                        // result[i].familyDetail = userDetailResponse.familyDetail ? userDetailResponse.familyDetail : null;
                        // result[i].fatherDetails = userDetailResponse.fatherDetails ? userDetailResponse.fatherDetails : null;
                        // result[i].motherDetails = userDetailResponse.motherDetails ? userDetailResponse.motherDetails : null;
                        // result[i].pCountryLivingInId = userDetailResponse.pCountryLivingInId ? userDetailResponse.pCountryLivingInId : null;
                        // result[i].pCityLivingInId = userDetailResponse.pCityLivingInId ? userDetailResponse.pCityLivingInId : null;
                        // result[i].pReligionId = userDetailResponse.pReligionId ? userDetailResponse.pReligionId : null;
                        // result[i].pCommunityId = userDetailResponse.pCommunityId ? userDetailResponse.pCommunityId : null;
                        // result[i].pStateLivingInId = userDetailResponse.pStateLivingInId ? userDetailResponse.pStateLivingInId : null;
                        // result[i].pEducationMediumId = userDetailResponse.pEducationMediumId ? userDetailResponse.pEducationMediumId : null;
                        // result[i].pEducationTypeId = userDetailResponse.pEducationTypeId ? userDetailResponse.pEducationTypeId : null;
                        // result[i].pOccupationId = userDetailResponse.pOccupationId ? userDetailResponse.pOccupationId : null;
                        // result[i].pEmploymentTypeId = userDetailResponse.pEmploymentTypeId ? userDetailResponse.pEmploymentTypeId : null;
                        // result[i].pAnnualIncomeId = userDetailResponse.pAnnualIncomeId ? userDetailResponse.pAnnualIncomeId : null;
                        // result[i].pDietId = userDetailResponse.pDietId ? userDetailResponse.pDietId : null;
                        // result[i].pMaritalStatusId = userDetailResponse.pMaritalStatusId ? userDetailResponse.pMaritalStatusId : null;
                        // result[i].pCountries = userDetailResponse.pCountries ? userDetailResponse.pCountries : null;
                        // result[i].pReligions = userDetailResponse.pReligions ? userDetailResponse.pReligions : null;
                        // result[i].pCommunities = userDetailResponse.pCommunities ? userDetailResponse.pCommunities : null;
                        // result[i].pStates = userDetailResponse.pStates ? userDetailResponse.pStates : null;
                        // result[i].pEducationMedium = userDetailResponse.pEducationMedium ? userDetailResponse.pEducationMedium : null;
                        // result[i].pOccupation = userDetailResponse.pOccupation ? userDetailResponse.pOccupation : null;
                        // result[i].pEmploymentType = userDetailResponse.pEmploymentType ? userDetailResponse.pEmploymentType : null;
                        // result[i].pAnnualIncome = userDetailResponse.pAnnualIncome ? userDetailResponse.pAnnualIncome : null;
                        // result[i].pMaritalStatus = userDetailResponse.pMaritalStatus ? userDetailResponse.pMaritalStatus : null;
                        // result[i].pDiet = userDetailResponse.pDiet ? userDetailResponse.pDiet : null;
                        // result[i].pComplexion = userDetailResponse.pComplexion ? userDetailResponse.pComplexion : null;
                        // result[i].pBodyType = userDetailResponse.pBodyType ? userDetailResponse.pBodyType : null;
                        // result[i].pComplexion = userDetailResponse.pComplexion ? userDetailResponse.pComplexion : null;
                        // result[i].pBodyType = userDetailResponse.pBodyType ? userDetailResponse.pBodyType : null;
                    }
                    if (userId) {
                        if (userId != req.body.id) {
                            let getViewProfileHistorySql = `SELECT * FROM userviewprofilehistories where userId =` + req.body.id + ` and viewProfileByUserId =` + userId + `;`;
                            let getViewProfileHistoryResult = yield apiHeader_1.default.query(getViewProfileHistorySql);
                            if (getViewProfileHistoryResult && getViewProfileHistoryResult.length > 0) {
                                // get today and total view count
                                result[0].totalView = 0;
                                result[0].todayView = 0;
                                let totalViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id;
                                let totalViewResult = yield apiHeader_1.default.query(totalViewSql);
                                if (totalViewResult && totalViewResult.length > 0) {
                                    result[0].totalView = totalViewResult[0].totalView;
                                }
                                let todayViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id + ` AND DATE(transactionDate) = DATE(CURRENT_TIMESTAMP())`;
                                let todayViewResult = yield apiHeader_1.default.query(todayViewSql);
                                if (todayViewResult && todayViewResult.length > 0) {
                                    result[0].todayView = todayViewResult[0].totalView;
                                }
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Users Detail Successfully', result, result.length, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                            else {
                                result[0].totalView = 0;
                                result[0].todayView = 0;
                                //notification send to req.body.id
                                let insertProfileHistorySql = `INSERT INTO userviewprofilehistories(userId, viewProfileByUserId, transactionDate, createdBy, modifiedBy) 
                                                            VALUES(` +
                                    req.body.id +
                                    `,` +
                                    userId +
                                    `, CURRENT_TIMESTAMP(),` +
                                    userId +
                                    `,` +
                                    userId +
                                    `)`;
                                let insertProfileHistoryResult = yield apiHeader_1.default.query(insertProfileHistorySql);
                                if (insertProfileHistoryResult && insertProfileHistoryResult.insertId) {
                                    let fcmToken;
                                    let customerFcmSql = 'SELECT fcmToken FROM userdevicedetail WHERE userId = ' + req.body.id + ' ORDER BY id DESC LIMIT 1';
                                    let customerFcmResult = yield apiHeader_1.default.query(customerFcmSql);
                                    if (customerFcmResult && customerFcmResult.length > 0) {
                                        fcmToken = customerFcmResult[0].fcmToken;
                                    }
                                    let check = `SELECT uf.id as userflagId , ufv.userId FROM userflags uf
                            LEFT JOIN userflagvalues ufv ON ufv.userId = ` +
                                        req.body.id +
                                        `
                            WHERE uf.flagName = 'pushNotification' AND ufv.userFlagValue = 1`;
                                    let checkResult = yield apiHeader_1.default.query(check);
                                    if (checkResult && checkResult.length > 0) {
                                        if (fcmToken) {
                                            let title = 'Profile Viewed';
                                            let userSql = `SELECT * FROM users WHERE id = ` + userId;
                                            let userResult = yield apiHeader_1.default.query(userSql);
                                            let description = userResult && userResult.length > 0 ? userResult[0].firstName + ' ' + userResult[0].lastName + ' viewed your profile' : '';
                                            let dataBody = {
                                                type: 6,
                                                id: userId,
                                                title: title,
                                                message: description,
                                                json: null,
                                                dateTime: null
                                            };
                                            let notificationRes = yield notifications_1.default.sendMultipleNotification([fcmToken], req.body.id, title, description, '', null, null, 1);
                                            let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                                     VALUES(` +
                                                req.body.id +
                                                `,'` +
                                                title +
                                                `', '` +
                                                description +
                                                `', '` +
                                                JSON.stringify(dataBody) +
                                                `', null, ` +
                                                authorizationResult.currentUser.id +
                                                `, ` +
                                                authorizationResult.currentUser.id +
                                                `)`;
                                            let notificationresult = yield apiHeader_1.default.query(notificationSql);
                                            if (notificationresult && notificationresult.insertId > 0) {
                                                if (result[0].isDemoUser == 1) {
                                                    result[0].isDemoUser = true;
                                                }
                                                else {
                                                    result[0].isDemoUser = false;
                                                }
                                                yield apiHeader_1.default.commit();
                                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Users Detail Successfully', result, result.length, authorizationResult.token);
                                                return res.status(200).send(successResult);
                                            }
                                            else {
                                                yield apiHeader_1.default.rollback();
                                                let errorResult = new resulterror_1.ResultError(400, true, 'favourites.addRemoveFavourite() Error', new Error('Error While Updating Data'), '');
                                                next(errorResult);
                                            }
                                        }
                                        else {
                                            yield apiHeader_1.default.commit();
                                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Users Detail Successfully', result, result.length, authorizationResult.token);
                                            return res.status(200).send(successResult);
                                        }
                                    }
                                    else {
                                        if (result[0].isDemoUser == 1) {
                                            result[0].isDemoUser = true;
                                        }
                                        else {
                                            result[0].isDemoUser = false;
                                        }
                                        yield apiHeader_1.default.commit();
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Users Detail Successfully', result, result.length, authorizationResult.token);
                                        return res.status(200).send(successResult);
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'Error While Insert Data', new Error('Error While Insert Data'), '');
                                    next(errorResult);
                                }
                            }
                        }
                        else {
                            // get today and total view count
                            result[0].totalView = 0;
                            result[0].todayView = 0;
                            let totalViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + userId;
                            let totalViewResult = yield apiHeader_1.default.query(totalViewSql);
                            if (totalViewResult && totalViewResult.length > 0) {
                                result[0].totalView = totalViewResult[0].totalView;
                            }
                            let todayViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + userId + ` AND DATE(transactionDate) = DATE(CURRENT_TIMESTAMP())`;
                            let todayViewResult = yield apiHeader_1.default.query(todayViewSql);
                            if (todayViewResult && todayViewResult.length > 0) {
                                result[0].todayView = todayViewResult[0].totalView;
                            }
                            if (result[0].isDemoUser == 1) {
                                result[0].isDemoUser = true;
                            }
                            else {
                                result[0].isDemoUser = false;
                            }
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Users Detail Successfully', result, result.length, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                    }
                    else {
                        result[0].totalView = 0;
                        result[0].todayView = 0;
                        if (result[0].isDemoUser == 1) {
                            result[0].isDemoUser = true;
                        }
                        else {
                            result[0].isDemoUser = false;
                        }
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Users Detail Successfully', result, result.length, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getUserDetail() Exception', error, '');
        next(errorResult);
    }
});
const updateUserProfilePic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        logging_1.default.info(NAMESPACE, 'Updating Users');
        let requiredFields = ['id', 'image'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let result;
                let imageId;
                req.body.userId = req.body.id;
                try {
                    let checkSql = `SELECT * FROM users WHERE id = ` + req.body.userId;
                    let checkResult = yield apiHeader_1.default.query(checkSql);
                    if (checkResult && checkResult.length) {
                        let oldImageId = checkResult[0].imageId;
                        if (oldImageId) {
                            if (req.body.image && req.body.image.indexOf('content') == -1) {
                                let sql = `INSERT INTO images(createdBy, modifiedBy) VALUES (` + req.body.userId + `,` + req.body.userId + `)`;
                                result = yield apiHeader_1.default.query(sql);
                                if (result.affectedRows > 0) {
                                    imageId = result.insertId;
                                    let image = req.body.image;
                                    let data = image.split(',');
                                    if (data && data.length > 1) {
                                        image = image.split(',')[1];
                                    }
                                    let dir = './content';
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    let dir1 = './content/user';
                                    if (!fs.existsSync(dir1)) {
                                        fs.mkdirSync(dir1);
                                    }
                                    let dir2 = './content/user/' + req.body.userId;
                                    if (!fs.existsSync(dir2)) {
                                        fs.mkdirSync(dir2);
                                    }
                                    const fileContentsUser = new Buffer(image, 'base64');
                                    let imgPath = './content/user/' + req.body.userId + '/' + imageId + '-realImg.jpeg';
                                    fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                        if (err)
                                            return console.error(err);
                                        console.log('file saved imagePath');
                                    });
                                    let imagePath = './content/user/' + req.body.userId + '/' + imageId + '.jpeg';
                                    // sharp(imgPath).resize({
                                    //     height: 100,
                                    //     width: 100
                                    // }).toFile(imagePath)
                                    //     .then(function (newFileInfo: any) {
                                    //         console.log(newFileInfo);
                                    //     });
                                    yield Jimp.read(imgPath)
                                        .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                        // return lenna
                                        //     .resize(100, 100) // resize
                                        //     // .quality(60) // set JPEG quality
                                        //     // .greyscale() // set greyscale
                                        //     // .write("lena-small-bw.jpg"); // save
                                        //     .write(imagePath);
                                        let data = lenna
                                            //.resize(100, 100) // resize
                                            // .quality(60) // set JPEG quality
                                            // .greyscale() // set greyscale
                                            // .write("lena-small-bw.jpg"); // save
                                            .write(imagePath);
                                        const image_act = yield Jimp.read(imagePath);
                                        const watermark = yield Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                        watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                        const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                        const y = image_act.getHeight() - watermark.getHeight() * 2;
                                        image_act.composite(watermark, x, y, {
                                            mode: Jimp.BLEND_SOURCE_OVER,
                                            opacitySource: 0.5 // Adjust the opacity of the watermark
                                        });
                                        //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                        yield image_act.writeAsync(imagePath);
                                        return data;
                                    }))
                                        .catch((err) => {
                                        console.error(err);
                                    });
                                    let updateimagePathSql = `UPDATE images SET imageUrl='` + imagePath.substring(2) + `' WHERE id=` + imageId;
                                    let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                                    if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                        let addUserImageId = `UPDATE users SET imageId = ` + imageId + ` WHERE id = ` + req.body.userId;
                                        result = yield apiHeader_1.default.query(addUserImageId);
                                        if (result && result.affectedRows > 0) {
                                            let getOldImageSql = `SELECT * FROM images where Id = ` + oldImageId;
                                            let getOldImageResult = yield apiHeader_1.default.query(getOldImageSql);
                                            if (getOldImageResult && getOldImageResult.length > 0) {
                                                let delSql = `DELETE FROM images where Id = ` + oldImageId;
                                                let delResult = yield apiHeader_1.default.query(delSql);
                                                if (delResult && delResult.affectedRows > 0) {
                                                    if (getOldImageResult[0].imageUrl) {
                                                        let imagePath = './' + getOldImageResult[0].imageUrl;
                                                        if (fs.existsSync(imagePath)) {
                                                            fs.unlink(imagePath, (err) => {
                                                                if (err)
                                                                    throw err;
                                                                console.log(imagePath + ' was deleted');
                                                            });
                                                        }
                                                        let realImg = './' + getOldImageResult[0].imageUrl.split('.')[0] + '-realImg.' + getOldImageResult[0].imageUrl.split('.')[1];
                                                        if (fs.existsSync(realImg)) {
                                                            fs.unlink(realImg, (err) => {
                                                                if (err)
                                                                    throw err;
                                                                console.log(realImg + ' was deleted');
                                                            });
                                                        }
                                                    }
                                                    // if (fs.existsSync("./content/user/" + req.body.userId + "/" + oldImageId + ".jpeg")) {
                                                    //     fs.unlink("./content/user/" + req.body.userId + "/" + oldImageId + ".jpeg", (err: any) => {
                                                    //         if (err) throw err;
                                                    //         console.log(imagePath + ' was deleted');
                                                    //     });
                                                    // }
                                                    // if (fs.existsSync("./content/user/" + req.body.userId + "/" + oldImageId + "-realImg.jpeg")) {
                                                    //     fs.unlink("./content/user/" + req.body.userId + "/" + oldImageId + "-realImg.jpeg", (err: any) => {
                                                    //         if (err) throw err;
                                                    //         console.log(imagePath + ' was deleted');
                                                    //     });
                                                    // }
                                                    //let userSql = `SELECT u.*, img.imageUrl FROM users u LEFT JOIN images img ON img.id = u.imageId WHERE u.id = ` + req.body.userId;
                                                    let userSql = `SELECT img.imageUrl FROM users u LEFT JOIN images img ON img.id = u.imageId WHERE u.id = ` + req.body.userId;
                                                    let userResult = yield apiHeader_1.default.query(userSql);
                                                    if (userResult && userResult.length > 0) {
                                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Profile Pic', userResult, userResult.length, authorizationResult.token);
                                                        return res.status(200).send(successResult);
                                                    }
                                                    else {
                                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                                        next(errorResult);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                let addUserImageId = `UPDATE users SET imageId = ` + oldImageId + ` WHERE id = ` + req.body.userId;
                                result = yield apiHeader_1.default.query(addUserImageId);
                                //let userSql = `SELECT u.*, img.imageUrl FROM users u LEFT JOIN images img ON img.id = u.imageId WHERE u.id = ` + req.body.userId;
                                let userSql = `SELECT img.imageUrl FROM users u LEFT JOIN images img ON img.id = u.imageId WHERE u.id = ` + req.body.userId;
                                let userResult = yield apiHeader_1.default.query(userSql);
                                if (userResult && userResult.length > 0) {
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Profile Pic', userResult, userResult.length, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                                else {
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Data'), '');
                                    next(errorResult);
                                }
                            }
                        }
                        else {
                            if (req.body.image && req.body.image.indexOf('content') == -1) {
                                let sql = `INSERT INTO images(createdBy, modifiedBy) VALUES (` + req.body.userId + `,` + req.body.userId + `)`;
                                result = yield apiHeader_1.default.query(sql);
                                if (result.affectedRows > 0) {
                                    imageId = result.insertId;
                                    let image = req.body.image;
                                    let data = image.split(',');
                                    if (data && data.length > 1) {
                                        image = image.split(',')[1];
                                    }
                                    let dir = './content';
                                    if (!fs.existsSync(dir)) {
                                        fs.mkdirSync(dir);
                                    }
                                    let dir1 = './content/user';
                                    if (!fs.existsSync(dir1)) {
                                        fs.mkdirSync(dir1);
                                    }
                                    let dir2 = './content/user/' + req.body.userId;
                                    if (!fs.existsSync(dir2)) {
                                        fs.mkdirSync(dir2);
                                    }
                                    const fileContentsUser = new Buffer(image, 'base64');
                                    let imgPath = './content/user/' + req.body.userId + '/' + imageId + '-realImg.jpeg';
                                    fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                        if (err)
                                            return console.error(err);
                                        console.log('file saved imagePath');
                                    });
                                    let imagePath = './content/user/' + req.body.userId + '/' + imageId + '.jpeg';
                                    // sharp(imgPath).resize({
                                    //     height: 100,
                                    //     width: 100
                                    // }).toFile(imagePath)
                                    //     .then(function (newFileInfo: any) {
                                    //         console.log(newFileInfo);
                                    //     });
                                    yield Jimp.read(imgPath)
                                        .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                        // return lenna
                                        //     .resize(100, 100) // resize
                                        //     // .quality(60) // set JPEG quality
                                        //     // .greyscale() // set greyscale
                                        //     // .write("lena-small-bw.jpg"); // save
                                        //     .write(imagePath);
                                        let data = lenna
                                            //.resize(100, 100) // resize
                                            // .quality(60) // set JPEG quality
                                            // .greyscale() // set greyscale
                                            // .write("lena-small-bw.jpg"); // save
                                            .write(imagePath);
                                        const image_act = yield Jimp.read(imagePath);
                                        const watermark = yield Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                        watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                        const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                        const y = image_act.getHeight() - watermark.getHeight() * 2;
                                        image_act.composite(watermark, x, y, {
                                            mode: Jimp.BLEND_SOURCE_OVER,
                                            opacitySource: 0.5 // Adjust the opacity of the watermark
                                        });
                                        //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                        yield image_act.writeAsync(imagePath);
                                        return data;
                                    }))
                                        .catch((err) => {
                                        console.error(err);
                                    });
                                    let updateimagePathSql = `UPDATE images SET imageUrl='` + imagePath.substring(2) + `' WHERE id=` + imageId;
                                    let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                                    if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                        let addUserImageId = `UPDATE users SET imageId = ` + imageId + ` WHERE id = ` + req.body.userId;
                                        result = yield apiHeader_1.default.query(addUserImageId);
                                        //let userSql = `SELECT u.*, img.imageUrl FROM users u  LEFT JOIN images img ON img.id = u.imageId                                        WHERE u.id = ` + req.body.userId;
                                        let userSql = `SELECT img.imageUrl FROM users u LEFT JOIN images img ON img.id = u.imageId WHERE u.id = ` + req.body.userId;
                                        let userResult = yield apiHeader_1.default.query(userSql);
                                        if (userResult && userResult.length > 0) {
                                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Profile Pic', userResult, userResult.length, authorizationResult.token);
                                            return res.status(200).send(successResult);
                                        }
                                        else {
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                            next(errorResult);
                                        }
                                    }
                                    else {
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Image Not Found'), '');
                                next(errorResult);
                            }
                        }
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('User Not Found'), '');
                        next(errorResult);
                    }
                }
                catch (err) {
                    let imagePath = './content/user/' + req.body.userId + '/' + imageId + '.jpeg';
                    if (fs.existsSync(imagePath)) {
                        fs.unlink(imagePath, (err) => {
                            if (err)
                                throw err;
                            console.log(imagePath + ' was deleted');
                        });
                    }
                    let dir = './content/user/' + req.body.userId;
                    if (fs.existsSync(dir)) {
                        fs.rmdir(dir, (err) => {
                            if (err)
                                throw err;
                            console.log(dir + ' was deleted');
                        });
                    }
                    result = err;
                }
                return result;
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateUserProfilePic() Exception', error, '');
        next(errorResult);
    }
});
const updateUserProfileDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Updating Users');
        let requiredFields = [
            'id',
            'firstName',
            'lastName',
            'email',
            'gender',
            'birthDate',
            'addressLine1',
            'pincode',
            'religionId',
            'communityId',
            'maritalStatusId',
            'occupationId',
            'educationId',
            'annualIncomeId',
            'heightId',
            'languages',
            'employmentTypeId'
        ];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                yield apiHeader_1.default.beginTransaction();
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                req.body.contactNo = req.body.contactNo ? req.body.contactNo : '';
                req.body.middleName = req.body.middleName ? req.body.middleName : '';
                req.body.countryName = req.body.countryName ? req.body.countryName : '';
                req.body.stateName = req.body.stateName ? req.body.stateName : '';
                req.body.cityName = req.body.cityName ? req.body.cityName : '';
                req.body.aboutMe = req.body.aboutMe ? req.body.aboutMe : '';
                req.body.expectation = req.body.expectation ? req.body.expectation : '';
                req.body.eyeColor = req.body.eyeColor ? req.body.eyeColor : '';
                let birthDate = req.body.birthDate ? new Date(req.body.birthDate) : '';
                let bDate = new Date(birthDate).getFullYear().toString() +
                    '-' +
                    ('0' + (new Date(birthDate).getMonth() + 1)).slice(-2) +
                    '-' +
                    ('0' + new Date(birthDate).getDate()).slice(-2) +
                    ' ' +
                    ('0' + new Date(birthDate).getHours()).slice(-2) +
                    ':' +
                    ('0' + new Date(birthDate).getMinutes()).slice(-2) +
                    ':' +
                    ('0' + new Date(birthDate).getSeconds()).slice(-2);
                const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
                console.log(isCustomFieldEnabled);
                let checkSql = `SELECT * FROM users WHERE email = '` + req.body.email + `' AND id != ` + req.body.id;
                let checkResult = yield apiHeader_1.default.query(checkSql);
                if (checkResult && checkResult.length > 0) {
                    yield apiHeader_1.default.rollback();
                    let message = 'Email Already Inserted';
                    return res.status(200).send(message);
                    // let errorResult = new ResultError(203, true, message, new Error(message), '');
                    // next(errorResult);
                }
                else {
                    let result;
                    let sql = `UPDATE users SET firstName = '` +
                        req.body.firstName +
                        `', middleName = '` +
                        req.body.middleName +
                        `', lastName = '` +
                        req.body.lastName +
                        `'
                , contactNo = '` +
                        req.body.contactNo +
                        `',email = '` +
                        req.body.email +
                        `',gender = '` +
                        req.body.gender +
                        `' WHERE id = ` +
                        req.body.id +
                        ``;
                    result = yield apiHeader_1.default.query(sql);
                    if (result && result.affectedRows > 0) {
                        if (req.body.documents && req.body.documents.length > 0) {
                            for (let i = 0; i < req.body.documents.length; i++) {
                                if (req.body.documents[i].isRequired) {
                                    if (!req.body.documents[i].documentUrl) {
                                        let errorResult = new resulterror_1.ResultError(400, true, 'Document is Required', new Error('Document is Required'), '');
                                        next(errorResult);
                                        return errorResult;
                                    }
                                }
                                if (req.body.documents[i].documentUrl) {
                                    if (req.body.documents[i].id) {
                                        if (req.body.documents[i].documentUrl && req.body.documents[i].documentUrl.indexOf('content') == -1) {
                                            let userDocumentId = req.body.documents[i].id;
                                            let oldDocummentSql = `SELECT * FROM userdocument WHERE id = ` + userDocumentId;
                                            let oldDocummentResult = yield apiHeader_1.default.query(oldDocummentSql);
                                            let image = req.body.documents[i].documentUrl;
                                            let data = image.split(',');
                                            if (data && data.length > 1) {
                                                image = image.split(',')[1];
                                            }
                                            let dir = './content';
                                            if (!fs.existsSync(dir)) {
                                                fs.mkdirSync(dir);
                                            }
                                            let dir1 = './content/userDocument';
                                            if (!fs.existsSync(dir1)) {
                                                fs.mkdirSync(dir1);
                                            }
                                            let dir2 = './content/userDocument/' + req.body.id;
                                            if (!fs.existsSync(dir2)) {
                                                fs.mkdirSync(dir2);
                                            }
                                            const fileContentsUser = new Buffer(image, 'base64');
                                            let imgPath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '-realImg.jpeg';
                                            fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                                if (err)
                                                    return console.error(err);
                                                console.log('file saved imagePath');
                                            });
                                            let imagePath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '.jpeg';
                                            yield Jimp.read(imgPath)
                                                .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                                // return lenna
                                                //     //.resize(100, 100) // resize
                                                //     .quality(60) // set JPEG quality
                                                //     // .greyscale() // set greyscale
                                                //     // .write("lena-small-bw.jpg"); // save
                                                //     .write(imagePath);
                                                let data = lenna
                                                    //.resize(100, 100) // resize
                                                    // .quality(60) // set JPEG quality
                                                    // .greyscale() // set greyscale
                                                    // .write("lena-small-bw.jpg"); // save
                                                    .write(imagePath);
                                                const image_act = yield Jimp.read(imagePath);
                                                const watermark = yield Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                                watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                                const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                                const y = image_act.getHeight() - watermark.getHeight() * 2;
                                                image_act.composite(watermark, x, y, {
                                                    mode: Jimp.BLEND_SOURCE_OVER,
                                                    opacitySource: 0.5 // Adjust the opacity of the watermark
                                                });
                                                //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                                yield image_act.writeAsync(imagePath);
                                                return data;
                                            }))
                                                .catch((err) => {
                                                console.error(err);
                                            });
                                            let updateimagePathSql = `UPDATE userdocument SET documentUrl='` + imagePath.substring(2) + `' WHERE id=` + userDocumentId;
                                            let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                                            if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                                // if (oldDocummentResult && oldDocummentResult.length > 0) {
                                                //     for (let d = 0; d < oldDocummentResult.length; d++) {
                                                //         if (oldDocummentResult[d].documentUrl) {
                                                //             let oldUrl = oldDocummentResult[d].documentUrl;
                                                //             let imagePath = "./" + oldUrl;
                                                //             if (fs.existsSync(imagePath)) {
                                                //                 fs.unlink(imagePath, (err: any) => {
                                                //                     if (err) throw err;
                                                //                     console.log(imagePath + ' was deleted');
                                                //                 });
                                                //             }
                                                //             let realImg = "./" + oldUrl.split(".")[0] + "-realImg." + oldUrl.split(".")[1];
                                                //             if (fs.existsSync(realImg)) {
                                                //                 fs.unlink(realImg, (err: any) => {
                                                //                     if (err) throw err;
                                                //                     console.log(realImg + ' was deleted');
                                                //                 });
                                                //             }
                                                //         }
                                                //     }
                                                // }
                                            }
                                            else {
                                                let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                                next(errorResult);
                                            }
                                        }
                                    }
                                    else {
                                        if (req.body.documents[i].documentUrl && req.body.documents[i].documentUrl.indexOf('content') == -1) {
                                            //let imageSql = `INSERT INTO images(createdBy, modifiedBy) VALUES (` + req.body.id + `,` + req.body.id + `)`;
                                            let userDocumentSql = `INSERT INTO userdocument(userId, documentTypeId, isVerified, isRequired, createdBy, modifiedBy) 
                                        VALUES(` +
                                                req.body.id +
                                                `,` +
                                                req.body.documents[i].documentTypeId +
                                                `, 0, ` +
                                                req.body.documents[i].isRequired +
                                                `,` +
                                                req.body.id +
                                                `,` +
                                                req.body.id +
                                                `)`;
                                            result = yield apiHeader_1.default.query(userDocumentSql);
                                            if (result.insertId) {
                                                let userDocumentId = result.insertId;
                                                let image = req.body.documents[i].documentUrl;
                                                let data = image.split(',');
                                                if (data && data.length > 1) {
                                                    image = image.split(',')[1];
                                                }
                                                let dir = './content';
                                                if (!fs.existsSync(dir)) {
                                                    fs.mkdirSync(dir);
                                                }
                                                let dir1 = './content/userDocument';
                                                if (!fs.existsSync(dir1)) {
                                                    fs.mkdirSync(dir1);
                                                }
                                                let dir2 = './content/userDocument/' + req.body.id;
                                                if (!fs.existsSync(dir2)) {
                                                    fs.mkdirSync(dir2);
                                                }
                                                const fileContentsUser = new Buffer(image, 'base64');
                                                let imgPath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '-realImg.jpeg';
                                                fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                                    if (err)
                                                        return console.error(err);
                                                    console.log('file saved imagePath');
                                                });
                                                let imagePath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '.jpeg';
                                                yield Jimp.read(imgPath)
                                                    .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                                    // return lenna
                                                    //     //.resize(100, 100) // resize
                                                    //     .quality(60) // set JPEG quality
                                                    //     // .greyscale() // set greyscale
                                                    //     // .write("lena-small-bw.jpg"); // save
                                                    //     .write(imagePath);
                                                    let data = lenna
                                                        //.resize(100, 100) // resize
                                                        // .quality(60) // set JPEG quality
                                                        // .greyscale() // set greyscale
                                                        // .write("lena-small-bw.jpg"); // save
                                                        .write(imagePath);
                                                    const image_act = yield Jimp.read(imagePath);
                                                    const watermark = yield Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                                    watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                                    const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                                    const y = image_act.getHeight() - watermark.getHeight() * 2;
                                                    image_act.composite(watermark, x, y, {
                                                        mode: Jimp.BLEND_SOURCE_OVER,
                                                        opacitySource: 0.5 // Adjust the opacity of the watermark
                                                    });
                                                    //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                                    yield image_act.writeAsync(imagePath);
                                                    return data;
                                                }))
                                                    .catch((err) => {
                                                    console.error(err);
                                                });
                                                let updateimagePathSql = `UPDATE userdocument SET documentUrl='` + imagePath.substring(2) + `' WHERE id=` + userDocumentId;
                                                let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                                                if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                                }
                                                else {
                                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                                    next(errorResult);
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (req.body.documents[i].id) {
                                        let oldDocummentSql = `SELECT * FROM userdocument WHERE id = ` + req.body.documents[i].id;
                                        let oldDocummentResult = yield apiHeader_1.default.query(oldDocummentSql);
                                        let updateimagePathSql = `DELETE FROM userdocument WHERE id=` + req.body.documents[i].id;
                                        let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                                        if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                            if (oldDocummentResult && oldDocummentResult.length > 0) {
                                                for (let d = 0; d < oldDocummentResult.length; d++) {
                                                    if (oldDocummentResult[d].documentUrl) {
                                                        let oldUrl = oldDocummentResult[d].documentUrl;
                                                        let imagePath = './' + oldUrl;
                                                        if (fs.existsSync(imagePath)) {
                                                            fs.unlink(imagePath, (err) => {
                                                                if (err)
                                                                    throw err;
                                                                console.log(imagePath + ' was deleted');
                                                            });
                                                        }
                                                        let realImg = './' + oldUrl.split('.')[0] + '-realImg.' + oldUrl.split('.')[1];
                                                        if (fs.existsSync(realImg)) {
                                                            fs.unlink(realImg, (err) => {
                                                                if (err)
                                                                    throw err;
                                                                console.log(realImg + ' was deleted');
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                            next(errorResult);
                                        }
                                    }
                                }
                            }
                        }
                        let userPerDetailSql = `SELECT * FROM userpersonaldetail WHERE userId = ` + req.body.id + ``;
                        result = yield apiHeader_1.default.query(userPerDetailSql);
                        if (result && result.length > 0) {
                            let userpersonaldetailId = result[0].id;
                            req.body.addressId = result[0].addressId;
                            req.body.birthDate = req.body.birthDate ? req.body.birthDate : '';
                            let updateAddSql = `UPDATE addresses SET addressLine1 = '` +
                                req.body.addressLine1 +
                                `', addressLine2 = '` +
                                req.body.addressLine2 +
                                `', pincode = '` +
                                req.body.pincode +
                                `'
                        , cityId = ` +
                                (req.body.cityId ? req.body.cityId : null) +
                                `, districtId = ` +
                                (req.body.districtId ? req.body.districtId : null) +
                                `
                        , stateId = ` +
                                (req.body.stateId ? req.body.stateId : null) +
                                `, countryId = ` +
                                (req.body.countryId ? req.body.countryId : null) +
                                `
                        , countryName = '` +
                                req.body.countryName +
                                `', stateName = '` +
                                req.body.stateName +
                                `', cityName = '` +
                                req.body.cityName +
                                `' 
                        , latitude = ` +
                                (req.body.latitude ? req.body.latitude : null) +
                                `, longitude = ` +
                                (req.body.longitude ? req.body.longitude : null) +
                                ` WHERE id = ` +
                                req.body.addressId +
                                ``;
                            console.log(updateAddSql);
                            let updateAddressResult = yield apiHeader_1.default.query(updateAddSql);
                            if (updateAddressResult && updateAddressResult.affectedRows > 0) {
                                // let addressId = updateAddressResult[0].id;
                                let updateSql = `UPDATE userpersonaldetail SET addressId = ` +
                                    req.body.addressId +
                                    `, religionId = ` +
                                    req.body.religionId +
                                    `,communityId = ` +
                                    req.body.communityId +
                                    `,maritalStatusId = ` +
                                    req.body.maritalStatusId +
                                    `,occupationId = ` +
                                    req.body.occupationId +
                                    `,educationId = ` +
                                    req.body.educationId +
                                    `,subCommunityId = ` +
                                    req.body.subCommunityId +
                                    `,dietId = ` +
                                    req.body.dietId +
                                    `,annualIncomeId = ` +
                                    req.body.annualIncomeId +
                                    `,heightId = ` +
                                    req.body.heightId +
                                    `,birthDate = '` +
                                    bDate +
                                    `',languages = '` +
                                    req.body.languages +
                                    `',eyeColor = '` +
                                    req.body.eyeColor +
                                    `', businessName = ` +
                                    (req.body.businessName && req.body.businessName != '' ? "'" + req.body.businessName + "'" : null) +
                                    `, companyName = ` +
                                    (req.body.companyName && req.body.companyName != '' ? "'" + req.body.companyName + "'" : null) +
                                    `, weight = ` +
                                    (req.body.weight && req.body.weight != '' ? "'" + req.body.weight + "'" : null) +
                                    `, employmentTypeId = ` +
                                    req.body.employmentTypeId +
                                    `, expectation = '` +
                                    req.body.expectation +
                                    `', aboutMe = '` +
                                    req.body.aboutMe +
                                    `'  WHERE id = ` +
                                    userpersonaldetailId +
                                    ``;
                                result = yield apiHeader_1.default.query(updateSql);
                                if (result && result.affectedRows > 0) {
                                    // region update user personal custom data
                                    if (isCustomFieldEnabled && req.body.customFields != null && req.body.customFields.length > 0) {
                                        let userpersonaldetailcustomdataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + req.body.id;
                                        let userpersonaldetailcustomdataResult = yield apiHeader_1.default.query(userpersonaldetailcustomdataSql);
                                        if (userpersonaldetailcustomdataResult && userpersonaldetailcustomdataResult.length > 0) {
                                            let fields = req.body.customFields;
                                            let customUpdateSql = `UPDATE userpersonaldetailcustomdata SET `;
                                            for (let i = 0; i < fields.length; i++) {
                                                if (fields[i].value && Array.isArray(fields[i].value)) {
                                                    const semicolonSeparatedString = fields[i].value.join(';');
                                                    fields[i].value = semicolonSeparatedString;
                                                }
                                                customUpdateSql += `` + fields[i].mappedFieldName + ` = `;
                                                if (fields[i].valueTypeId == '2') {
                                                    customUpdateSql += `` + (fields[i].value ? fields[i].value : null) + ``;
                                                }
                                                else {
                                                    // customUpdateSql += `'` + fields[i].value + `'`;
                                                    customUpdateSql += `` + (fields[i].value && fields[i].value != '' ? "'" + fields[i].value + "'" : null) + ``;
                                                }
                                                customUpdateSql += `,`;
                                            }
                                            customUpdateSql += ` modifiedBy = ` + req.body.id + `, modifiedDate = CURRENT_TIMESTAMP() WHERE userId = ` + req.body.id + `  `;
                                            let customUpdateResult = yield apiHeader_1.default.query(customUpdateSql);
                                            if (customUpdateResult && customUpdateResult.affectedRows > 0) {
                                            }
                                            else {
                                                yield apiHeader_1.default.rollback();
                                                let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Updating Data'), '');
                                                next(errorResult);
                                            }
                                        }
                                        else {
                                            let fields = req.body.customFields;
                                            let customAddSql = `INSERT INTO userpersonaldetailcustomdata(userId,createdBy,modifiedBy,`;
                                            for (let i = 0; i < fields.length; i++) {
                                                customAddSql += `` + fields[i].mappedFieldName + ``;
                                                if (i != fields.length - 1) {
                                                    customAddSql += `,`;
                                                }
                                            }
                                            customAddSql += `) VALUES (` + req.body.id + `,` + req.body.id + `,` + req.body.id + `,`;
                                            for (let i = 0; i < fields.length; i++) {
                                                if (fields[i].value && Array.isArray(fields[i].value)) {
                                                    const semicolonSeparatedString = fields[i].value.join(';');
                                                    fields[i].value = semicolonSeparatedString;
                                                }
                                                if (fields[i].valueTypeId == '2') {
                                                    customAddSql += `` + fields[i].value + ``;
                                                }
                                                else {
                                                    customAddSql += `'` + fields[i].value + `'`;
                                                }
                                                if (i != fields.length - 1) {
                                                    customAddSql += `,`;
                                                }
                                            }
                                            customAddSql += ` ) `;
                                            console.log(customAddSql);
                                            let customAddResult = yield apiHeader_1.default.query(customAddSql);
                                            if (customAddResult && customAddResult.affectedRows > 0) {
                                            }
                                            else {
                                                yield apiHeader_1.default.rollback();
                                                let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                                next(errorResult);
                                            }
                                        }
                                    }
                                    // end region update user personal custom data
                                    let sql = `SELECT u.id, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser,
                                                , upd.birthDate, upd.languages, upd.eyeColor, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId, pf.name as profileForName, img.imageUrl, upd.memberid
                                                , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                                                , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
                                                , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                                , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age
                                                , addr.latitude, addr.longitude
                                                FROM users u
                                                LEFT JOIN userroles ur ON ur.userId = u.id
                                                LEFT JOIN images img ON img.id = u.imageId
                                                LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                                LEFT JOIN religion r ON r.id = upd.religionId
                                                LEFT JOIN community c ON c.id = upd.communityId
                                                LEFT JOIN occupation o ON o.id = upd.occupationId
                                                LEFT JOIN education e ON e.id = upd.educationId
                                                LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                                LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                                LEFT JOIN height h ON h.id = upd.heightId
                                                LEFT JOIN addresses addr ON addr.id = upd.addressId
                                                LEFT JOIN cities cit ON addr.cityId = cit.id
                                                LEFT JOIN districts ds ON addr.districtId = ds.id
                                                LEFT JOIN state st ON addr.stateId = st.id
                                                LEFT JOIN countries cou ON addr.countryId = cou.id
                                                LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                                LEFT JOIN profilefor pf ON pf.id = upd.profileForId
                                                WHERE ur.roleId = 2 AND u.id = ` + req.body.id;
                                    let result = yield apiHeader_1.default.query(sql);
                                    if (result && result.length > 0) {
                                        result[0].isVerified = false;
                                        let isVerified = true;
                                        let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + result[0].id;
                                        let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                        result[0].userDocuments = documentsResult;
                                        if (documentsResult && documentsResult.length > 0) {
                                            for (let j = 0; j < documentsResult.length; j++) {
                                                if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                    isVerified = false;
                                                }
                                            }
                                        }
                                        else {
                                            isVerified = false;
                                        }
                                        result[0].isVerifiedProfile = isVerified;
                                        if (result[0].isVerifyProfilePic) {
                                            result[0].isVerifyProfilePic = true;
                                        }
                                        else {
                                            result[0].isVerifyProfilePic = false;
                                        }
                                        result[0].totalView = 0;
                                        result[0].todayView = 0;
                                        let totalViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id;
                                        let totalViewResult = yield apiHeader_1.default.query(totalViewSql);
                                        if (totalViewResult && totalViewResult.length > 0) {
                                            result[0].totalView = totalViewResult[0].totalView;
                                        }
                                        let todayViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id + ` AND DATE(transactionDate) = DATE(CURRENT_TIMESTAMP())`;
                                        let todayViewResult = yield apiHeader_1.default.query(todayViewSql);
                                        if (todayViewResult && todayViewResult.length > 0) {
                                            result[0].todayView = todayViewResult[0].totalView;
                                        }
                                        let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                            LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                            WHERE ufv.userId = ` + req.body.id;
                                        result[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                        let getUserAuthSql = `SELECT * FROM userauthdata WHERE userId = ` + req.body.id;
                                        let getUserAuthResult = yield apiHeader_1.default.query(getUserAuthSql);
                                        result[0].isOAuth = getUserAuthResult && getUserAuthResult.length > 0 ? true : false;
                                        result[0].isAppleLogin = getUserAuthResult && getUserAuthResult.length > 0 && getUserAuthResult[0].authProviderId == 3 ? true : false;
                                        result[0].userWalletAmount = 0;
                                        let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + result[0].id;
                                        let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                        if (getUserWalletResult && getUserWalletResult.length > 0) {
                                            result[0].userWalletAmount = getUserWalletResult[0].amount;
                                        }
                                        if (req.body.isSignup) {
                                            let adminUserSql = `SELECT * FROM users where id IN(select userId from userroles where (roleId = 1 OR roleId = 3)) AND isActive  = true AND isDelete = false`;
                                            let adminUserResult = yield apiHeader_1.default.query(adminUserSql);
                                            if (adminUserResult && adminUserResult.length > 0) {
                                                for (let a = 0; a < adminUserResult.length; a++) {
                                                    if (adminUserResult[a].isReceiveMail) {
                                                        let resultEmail = yield sendEmail(config_1.default.emailMatrimonyNewUserRegister.fromName + ' <' + config_1.default.emailMatrimonyNewUserRegister.fromEmail + '>', [adminUserResult[a].email], config_1.default.emailMatrimonyNewUserRegister.subject, '', config_1.default.emailMatrimonyNewUserRegister.html
                                                            .replace("[User's Full Name]", result[0].firstName + ' ' + result[0].lastName)
                                                            .replace("[User's Contact No]", result[0].contactNo)
                                                            .replace("[User's Email Address]", result[0].email), null, null);
                                                        console.log(resultEmail);
                                                    }
                                                    if (adminUserResult[a].isReceiveNotification) {
                                                        let deviceDetailSql = `SELECT * FROM userdevicedetail WHERE userId = ` + adminUserResult[a].id + ` AND fcmToken IS NOT NULL`;
                                                        let deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                                        if (deviceDetailResult && deviceDetailResult.length > 0) {
                                                            let title = 'New User Register';
                                                            let description = 'New User ' + result[0].firstName + ' ' + result[0].lastName + ' registered in system. Please verify document';
                                                            let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                                                    VALUES(` +
                                                                adminUserResult[a].id +
                                                                `,'` +
                                                                title +
                                                                `', '` +
                                                                description +
                                                                `', null, null, ` +
                                                                authorizationResult.currentUser.id +
                                                                `, ` +
                                                                authorizationResult.currentUser.id +
                                                                `)`;
                                                            let notificationResult = yield apiHeader_1.default.query(notificationSql);
                                                            yield notifications_1.default.sendMultipleNotification([deviceDetailResult[0].fcmToken], null, title, description, '', null, null, 0);
                                                            console.log('Send' + deviceDetailResult[0].fcmToken);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                        LEFT JOIN package p ON p.id = up.packageId
                                        LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                        WHERE up.userId = ` +
                                            result[0].id +
                                            ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                        order by p.weightage DESC`;
                                        let userPackage = yield apiHeader_1.default.query(userPackages);
                                        if (userPackage && userPackage.length > 0) {
                                            for (let k = 0; k < userPackage.length; k++) {
                                                let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                 WHERE pf.packageId = ` + userPackage[k].packageId);
                                                userPackage[k].packageFacility = packageFacility;
                                            }
                                        }
                                        result[0].userPackage = userPackage[0];
                                        let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(req.body.id);
                                        if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                                            // console.log(_customFieldDataResult);
                                            result[0].customFields = _customFieldDataResult;
                                        }
                                        // region to get user personal custom data
                                        // if (isCustomFieldEnabled) {
                                        //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + req.body.id;
                                        //     let userCustomDataResult = await header.query(userCustomDataSql);
                                        //     let customdata: any[] = [];
                                        //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                                        //         const userCustomDataArrays = [];
                                        //         const keys = Object.keys(userCustomDataResult[0]);
                                        //         userCustomDataArrays.push(keys);
                                        //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                                        //         for (let i = 0; i < filteredColumns.length; i++) {
                                        //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[i] + `' and isActive = 1`;
                                        //             let result = await header.query(sql);
                                        //             let userDataSql = `SELECT ` + filteredColumns[i] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + req.body.id;
                                        //             let userDataResult = await header.query(userDataSql);
                                        //             let mergedResult = Object.assign({}, result[0], userDataResult[0]);
                                        //             customdata.push(mergedResult);
                                        //             console.log(userCustomDataResult);
                                        //         }
                                        //         if (customdata && customdata.length > 0) {
                                        //             for (let i = 0; i < customdata.length; i++) {
                                        //                 if (customdata[i].valueList) {
                                        //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                                        //                     customdata[i].valueList = valueListArray;
                                        //                 }
                                        //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                                        //                     if (customdata[i].valueTypeId == 10) {
                                        //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                                        //                         customdata[i].value = valueArray;
                                        //                     }
                                        //                 }
                                        //             }
                                        //         }
                                        //         result[0].customFields = customdata;
                                        //     }
                                        // }
                                        // else {
                                        //     await header.rollback();
                                        //     let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                                        //     next(errorResult);
                                        // }
                                        // end region to get user personal custom data
                                        if (result[0].isDemoUser == 1) {
                                            result[0].isDemoUser = true;
                                        }
                                        else {
                                            result[0].isDemoUser = false;
                                        }
                                        yield apiHeader_1.default.commit();
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Personal Detail', result, 1, authorizationResult.token);
                                        return res.status(200).send(successResult);
                                    }
                                    else {
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Updating Data'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Updating Data'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Updating Data'), '');
                                next(errorResult);
                            }
                        }
                        else {
                            let insertAddress = `INSERT INTO addresses(addressLine1, addressLine2, pincode, cityId, districtId, stateId, countryId, countryName, stateName, cityName, latitude, longitude
                            , createdBy, modifiedBy) VALUES('` +
                                req.body.addressLine1 +
                                `','` +
                                req.body.addressLine2 +
                                `','` +
                                req.body.pincode +
                                `', ` +
                                (req.body.cityId ? req.body.cityId : null) +
                                `
                            , ` +
                                (req.body.districtId ? req.body.districtId : null) +
                                `, ` +
                                (req.body.stateId ? req.body.stateId : null) +
                                `, ` +
                                (req.body.countryId ? req.body.countryId : null) +
                                `
                            , '` +
                                req.body.countryName +
                                `','` +
                                req.body.stateName +
                                `','` +
                                req.body.cityName +
                                `', ` +
                                req.body.latitude +
                                `, ` +
                                req.body.longitude +
                                `,` +
                                userId +
                                `,` +
                                userId +
                                `)`;
                            let addressResult = yield apiHeader_1.default.query(insertAddress);
                            if (addressResult && addressResult.insertId > 0) {
                                req.body.addressId = addressResult.insertId;
                                let insertSql = `INSERT INTO userpersonaldetail(userId, addressId, religionId, communityId, maritalStatusId, occupationId, educationId, subCommunityId, dietId, annualIncomeId, heightId, birthDate
                                , languages, eyeColor, businessName, companyName, employmentTypeId, expectation, aboutMe, createdBy, modifiedBy) VALUES(` +
                                    req.body.id +
                                    `,` +
                                    req.body.addressId +
                                    `,` +
                                    req.body.religionId +
                                    `
                                ,` +
                                    req.body.communityId +
                                    `,` +
                                    req.body.maritalStatusId +
                                    `,` +
                                    req.body.occupationId +
                                    `,` +
                                    req.body.educationId +
                                    `,` +
                                    req.body.subCommunityId +
                                    `,` +
                                    req.body.dietId +
                                    `
                                ,` +
                                    req.body.annualIncomeId +
                                    `,` +
                                    req.body.heightId +
                                    `,'` +
                                    bDate +
                                    `','` +
                                    req.body.languages +
                                    `','` +
                                    req.body.eyeColor +
                                    `', '` +
                                    req.body.businessName +
                                    `', '` +
                                    req.body.companyName +
                                    `'
                                , ` +
                                    req.body.employmentTypeId +
                                    `, '` +
                                    req.body.expectation +
                                    `', '` +
                                    req.body.aboutMe +
                                    `',` +
                                    userId +
                                    `,` +
                                    userId +
                                    `)`;
                                result = yield apiHeader_1.default.query(insertSql);
                                if (result && result.affectedRows > 0) {
                                    let sql = `SELECT u.id, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, 
                                    , upd.birthDate, upd.languages, upd.eyeColor, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId, pf.name as profileForName
                                    , img.imageUrl, r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity
                                , ai.value as annualIncome, h.name as height
                                , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
                                , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age
                                FROM users u
                                LEFT JOIN userroles ur ON ur.userId = u.id
                                LEFT JOIN images img ON img.id = u.imageId
                                LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                LEFT JOIN religion r ON r.id = upd.religionId
                                LEFT JOIN community c ON c.id = upd.communityId
                                LEFT JOIN occupation o ON o.id = upd.occupationId
                                LEFT JOIN education e ON e.id = upd.educationId
                                LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                LEFT JOIN height h ON h.id = upd.heightId
                                LEFT JOIN addresses addr ON addr.id = upd.addressId
                                LEFT JOIN cities cit ON addr.cityId = cit.id
                                LEFT JOIN districts ds ON addr.districtId = ds.id
                                LEFT JOIN state st ON addr.stateId = st.id
                                LEFT JOIN countries cou ON addr.countryId = cou.id
                                LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                LEFT JOIN profilefor pf ON pf.id = upd.profileForId
                                 WHERE ur.roleId = 2 AND u.id = ` + req.body.id;
                                    let result = yield apiHeader_1.default.query(sql);
                                    // let systemFlags = `SELECT * FROM systemflags where flagGroupId = 2`;
                                    // let _systemFlags = await header.query(systemFlags);
                                    // let _host;
                                    // let _port;
                                    // let _secure;
                                    // let _user;
                                    // let _password;
                                    // for (let i = 0; i < _systemFlags.length; i++) {
                                    //     if (_systemFlags[i].id == 4) {
                                    //         _host = _systemFlags[i].value;
                                    //     } else if (_systemFlags[i].id == 5) {
                                    //         _port = parseInt(_systemFlags[i].value);
                                    //     } else if (_systemFlags[i].id == 6) {
                                    //         if (_systemFlags[i].value == '1') {
                                    //             _secure = true;
                                    //         } else {
                                    //             _secure = false;
                                    //         }
                                    //     } else if (_systemFlags[i].id == 1) {
                                    //         _user = _systemFlags[i].value;
                                    //     } else if (_systemFlags[i].id == 2) {
                                    //         _password = _systemFlags[i].value;
                                    //     }
                                    // }
                                    let adminUserSql = `SELECT u.* FROM users u INNER JOIN userroles ur ON ur.userId = u.id WHERE (ur.roleId = 1 OR ur.roleId = 3) AND u.isActive && u.isReceiveMail && !u.isDelete`;
                                    let adminUserResult = yield apiHeader_1.default.query(adminUserSql);
                                    let emails = [];
                                    if (adminUserResult && adminUserResult.length > 0) {
                                        for (let i = 0; i < adminUserResult.length; i++) {
                                            if (adminUserResult[i].email)
                                                emails.push(adminUserResult[i].email);
                                        }
                                    }
                                    let resultEmail = yield sendEmail(config_1.default.emailMatrimonyNewUserRegister.fromName + ' <' + config_1.default.emailMatrimonyNewUserRegister.fromEmail + '>', emails, config_1.default.emailMatrimonyNewUserRegister.subject, '', config_1.default.emailMatrimonyNewUserRegister.html
                                        .replace("[User's Full Name]", result[0].firstName + ' ' + result[0].lastName)
                                        .replace("[User's Contact No]", result[0].contactNo)
                                        .replace("[User's Email Address]", result[0].email), null, null);
                                    yield apiHeader_1.default.commit();
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert User Personal Detail', result, 1, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Updating Data'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateUserProfileDetail() Exception', error, '');
        next(errorResult);
    }
});
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
function makememberid(length) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = '';
        let format = '';
        let formatSql = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'memberIdFormat'`);
        format = formatSql[0].value;
        if (format == 'Only Numeric') {
            const characters = '0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
        }
        else if (format == 'Only Alphabets') {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
        }
        else if (format == 'Prefix') {
            let lettersSql = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'prefixLetters'`);
            let letters = lettersSql[0].value;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length - letters.length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            result = letters + result;
        }
        else if (format == 'Postfix') {
            let lettersSql = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'postfixLetters'`);
            let letters = lettersSql[0].value;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length - letters.length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            result = result + letters;
        }
        else {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
        }
        result = result.trim();
        return result;
    });
}
const generateMemberIdTestingAPI = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let memberId = (yield makememberid(10)).toUpperCase();
        let result = {
            memberId: memberId
        };
        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Master Data Successfully', result, 1, '');
        return res.status(200).send(successResult);
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getUsers() Exception', error, '');
        next(errorResult);
    }
});
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Password');
        let requiredFields = ['email'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            yield apiHeader_1.default.beginTransaction();
            let result;
            let sql = `SELECT * FROM users WHERE email = '` + req.body.email + `'`;
            let userData = yield apiHeader_1.default.query(sql);
            if (userData && userData.length > 0) {
                let token = cryptr.encrypt(makeid(10)); //crypto.randomBytes(48).toString('hex');
                let expireAtDate = new Date(new Date().toUTCString());
                expireAtDate.setDate(expireAtDate.getDate() + 1);
                let data = {
                    userId: userData[0].id,
                    token: token,
                    isUsed: 0,
                    expireAt: expireAtDate,
                    isActive: true,
                    isDelete: false,
                    createdDate: new Date(new Date().toUTCString()),
                    modifiedDate: new Date(new Date().toUTCString())
                };
                let sql = 'INSERT INTO usertokens SET ?';
                result = yield apiHeader_1.default.query(sql, data);
                if (result.insertId > 0) {
                    let resultEmail = yield sendEmail(config_1.default.emailMatrimonySetPassword.fromName + ' <' + config_1.default.emailMatrimonySetPassword.fromEmail + '>', [userData[0].email], config_1.default.emailMatrimonySetPassword.subject, '', config_1.default.emailMatrimonySetPassword.html.replace('[VERIFICATION_TOKEN]', token).replace('[NAME]', userData[0].firstName + ' ' + userData[0].lastName), null, null);
                    yield apiHeader_1.default.commit();
                    console.log(userData[0].firstName);
                    console.log(userData[0].lastName);
                    result = resultEmail;
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Email sent successfully!', result, 1, '');
                    return res.status(200).send(successResult);
                }
                else {
                    yield apiHeader_1.default.rollback();
                    result.length = 0;
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(400, true, 'User not found', new Error('Data Not Available'), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.resetPassword() Exception', error, '');
        next(errorResult);
    }
});
const sendEmail = (from, to, subject, text, html, fileName, invoicePdf, ccMails) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        // create reusable transporter object using the default SMTP transport
        let systemFlags = `SELECT * FROM systemflags where flagGroupId = 2`;
        let _systemFlags = yield apiHeader_1.default.query(systemFlags);
        let _host;
        let _port;
        let _secure;
        let _user;
        let _password;
        for (let i = 0; i < _systemFlags.length; i++) {
            if (_systemFlags[i].id == 4) {
                _host = _systemFlags[i].value;
            }
            else if (_systemFlags[i].id == 5) {
                _port = parseInt(_systemFlags[i].value);
            }
            else if (_systemFlags[i].id == 6) {
                if (_systemFlags[i].value == '1') {
                    _secure = true;
                }
                else {
                    _secure = false;
                }
            }
            else if (_systemFlags[i].id == 1) {
                _user = _systemFlags[i].value;
            }
            else if (_systemFlags[i].id == 2) {
                _password = _systemFlags[i].value;
            }
        }
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: _host,
            port: _port,
            secure: _secure, // true for 465, false for other ports
            auth: {
                user: _user,
                pass: _password
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: _user,
            to: to,
            cc: ccMails,
            subject: subject,
            html: html
        };
        // send mail with defined transport object
        result = yield transporter.sendMail(mailOptions);
        // console.log("Message sent: %s", result);
    }
    catch (error) {
        result = error;
    }
    return result;
});
const verifyforgotPasswordLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Verify Forgot Password Link');
        let requiredFields = ['token'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let result;
            let sql = `SELECT * FROM usertokens WHERE isDelete = 0 AND isUsed = 0  AND token = '` + req.body.token + `'`;
            result = yield apiHeader_1.default.query(sql);
            if (result && result.length > 0) {
                let expireDate = new Date(result[0].expireAt);
                let currentDate = new Date(new Date().toUTCString());
                let exTime = expireDate.getTime();
                let curTime = currentDate.getTime();
                if (exTime > curTime) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Token is valid!', result, 1, 'null');
                    return res.status(200).send(successResult);
                }
                else {
                    let successResult = 'Token is expired!';
                    return res.status(200).send(successResult);
                }
            }
            else {
                let successResult = 'You have already used this token';
                return res.status(200).send(successResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.verifyforgotPasswordLink() Exception', error, '');
        next(errorResult);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Password');
        let requiredFields = ['id', 'password', 'token'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            bcryptjs_1.default.hash(req.body.password, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (hashError) {
                    return res.status(401).json({
                        message: hashError.message,
                        error: hashError
                    });
                }
                let sql = `UPDATE users SET password = '` + hash + `' where id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    if (req.body.token) {
                        let userTokenUpdateSql = `UPDATE usertokens SET isUsed = 1 WHERE token = '` + req.body.token + `' AND userId = ` + req.body.id + ``;
                        result = yield apiHeader_1.default.query(userTokenUpdateSql);
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Password reset successfully!', result, 1, 'null');
                    return res.status(200).send(successResult);
                }
                else {
                    yield apiHeader_1.default.rollback();
                    let errorResult = new resulterror_1.ResultError(400, true, 'users.resetPassword() Error', new Error('Error While Reset Password'), '');
                    next(errorResult);
                }
            }));
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.resetPassword() Exception', error, '');
        next(errorResult);
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Change Password');
        let requiredFields = ['oldPassword', 'newPassword'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let sql = `SELECT * FROM users WHERE id = ` + userId;
                result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    bcryptjs_1.default.compare(req.body.oldPassword, result[0].password, (error, hashresult) => __awaiter(void 0, void 0, void 0, function* () {
                        if (hashresult == false) {
                            return res.status(401).json({
                                message: 'Your old password is not match'
                            });
                        }
                        else if (hashresult) {
                            bcryptjs_1.default.hash(req.body.newPassword, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                                if (hashError) {
                                    return res.status(401).json({
                                        message: hashError.message,
                                        error: hashError
                                    });
                                }
                                let sql = `UPDATE users SET password = '` + hash + `' where id = ` + userId + ``;
                                let result = yield apiHeader_1.default.query(sql);
                                if (result && result.affectedRows > 0) {
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Password Change successfully!', result, 1, 'null');
                                    return res.status(200).send(successResult);
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.changePassword() Error', new Error('Error While Change Password'), '');
                                    next(errorResult);
                                }
                            }));
                        }
                    }));
                }
                else {
                    let errorResult = 'User Not Found';
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.changePassword() Exception', error, '');
        next(errorResult);
    }
});
const changeContact = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Change Contact');
        let requiredFields = ['oldContact', 'newContact'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let searchSql = `SELECT * FROM users WHERE contactNo = '` + req.body.oldContact + `' AND id = ` + userId;
                let searchResult = yield apiHeader_1.default.query(searchSql);
                if (searchResult && searchResult.length > 0) {
                    let checkSql = `SELECT * FROM users WHERE contactNo = '` + req.body.newContact + `' AND id != ` + userId + ``;
                    result = yield apiHeader_1.default.query(checkSql);
                    if (result && result.length > 0) {
                        let errorResult = new resulterror_1.ResultError(203, true, 'Contact no. Already Exist', new Error('ContactNo Already Exist'), '');
                        next(errorResult);
                    }
                    else {
                        let sql = `UPDATE users SET contactNo = '` + req.body.newContact + `' where id = ` + userId + ``;
                        result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Contact Change successfully!', result, 1, 'null');
                            return res.status(200).send(successResult);
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, 'users.changeContact() Error', new Error('Error While Change Contact'), '');
                            next(errorResult);
                        }
                    }
                }
                else {
                    let errorResult = 'User Not Found';
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.changeContact() Exception', error, '');
        next(errorResult);
    }
});
const changeEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Password');
        let requiredFields = ['oldEmail', 'newEmail'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let searchSql = `SELECT * FROM users WHERE email = '` + req.body.oldEmail + `' AND id = ` + userId;
                let searchResult = yield apiHeader_1.default.query(searchSql);
                if (searchResult && searchResult.length > 0) {
                    let checkSql = `SELECT * FROM users WHERE email = '` + req.body.newEmail + `' AND id != ` + userId + ``;
                    result = yield apiHeader_1.default.query(checkSql);
                    if (result && result.length > 0) {
                        let errorResult = new resulterror_1.ResultError(203, true, 'Email Already exists', new Error('users.changeEmail() Error'), '');
                        next(errorResult);
                    }
                    else {
                        let sql = `UPDATE users SET email = '` + req.body.newEmail + `' where id = ` + userId + ``;
                        result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Email Change successfully!', result, 1, 'null');
                            return res.status(200).send(successResult);
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, 'users.changeEmail() Error', new Error('Error While Change Password'), '');
                            next(errorResult);
                        }
                    }
                }
                else {
                    let errorResult = 'User Not Found';
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.changeEmail() Exception', error, '');
        next(errorResult);
    }
});
const searchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Application User');
        let userId = 0;
        let authorizationResult;
        let gender;
        const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
        console.log(isCustomFieldEnabled);
        if (req.headers['authorization']) {
            authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                userId = currentUser ? currentUser.id : 0;
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
        let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
        let screens = yield apiHeader_1.default.query(`SELECT * FROM registrationscreens `);
        let genderVisibility = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'genderVisibility'`);
        gender = genderVisibility[0].value;
        let sql = `WITH preference_weights AS (
                      SELECT
                        MAX(CASE WHEN name = 'pAge' THEN weightage END) AS pAgeWeight,
                        MAX(CASE WHEN name = 'pHeight' THEN weightage END) AS pHeightWeight,
                        MAX(CASE WHEN name = 'pMaritalStatus' THEN weightage END) AS pMaritalStatusWeight,
                        MAX(CASE WHEN name = 'pProfileWithChildren' THEN weightage END) AS pProfileWithChildrenWeight,
                        MAX(CASE WHEN name = 'pFamilyType' THEN weightage END) AS pFamilyTypeWeight,
                        MAX(CASE WHEN name = 'pReligion' THEN weightage END) AS pReligionWeight,
                        MAX(CASE WHEN name = 'pCommunity' THEN weightage END) AS pCommunityWeight,
                        MAX(CASE WHEN name = 'pMotherTongue' THEN weightage END) AS pMotherTongueWeight,
                        MAX(CASE WHEN name = 'pHoroscopeBelief' THEN weightage END) AS pHoroscopeBeliefWeight,
                        MAX(CASE WHEN name = 'pManglikMatch' THEN weightage END) AS pManglikMatchWeight,
                        MAX(CASE WHEN name = 'pCountryLivingIn' THEN weightage END) AS pCountryLivingInWeight,
                        MAX(CASE WHEN name = 'pStateLivingIn' THEN weightage END) AS pStateLivingInWeight,
                        MAX(CASE WHEN name = 'pCityLivingIn' THEN weightage END) AS pCityLivingInWeight,
                        MAX(CASE WHEN name = 'pEducationType' THEN weightage END) AS pEducationTypeWeight,
                        MAX(CASE WHEN name = 'pEducationMedium' THEN weightage END) AS pEducationMediumWeight,
                        MAX(CASE WHEN name = 'pOccupation' THEN weightage END) AS pOccupationWeight,
                        MAX(CASE WHEN name = 'pEmploymentType' THEN weightage END) AS pEmploymentTypeWeight,
                        MAX(CASE WHEN name = 'pAnnualIncome' THEN weightage END) AS pAnnualIncomeWeight,
                        MAX(CASE WHEN name = 'pDiet' THEN weightage END) AS pDietWeight,
                        MAX(CASE WHEN name = 'pSmokingAcceptance' THEN weightage END) AS pSmokingAcceptanceWeight,
                        MAX(CASE WHEN name = 'pAlcoholAcceptance' THEN weightage END) AS pAlcoholAcceptanceWeight,
                        MAX(CASE WHEN name = 'pDisabilityAcceptance' THEN weightage END) AS pDisabilityAcceptanceWeight,
                        MAX(CASE WHEN name = 'pComplexion' THEN weightage END) AS pComplexionWeight,
                        MAX(CASE WHEN name = 'pBodyType' THEN weightage END) AS pBodyTypeWeight
                      FROM preferenceweightage
                    ),
                    disableScreen AS(
                    SELECT 
                        MAX(CASE WHEN name = 'isEnableFamilyDetails' THEN value END) AS isEnableFamilyDetails, 
                        MAX(CASE WHEN name = 'isEnableAstrologicDetails' THEN value END) AS isEnableAstrologicDetails,
                        MAX(CASE WHEN name = 'isEnableLifeStyles' THEN value END) AS isEnableLifeStyles
                        FROM systemflags
                    )
                SELECT u.id, udd.fcmtoken, u.stripeCustomerId,img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, u.isVerifyProfilePic, u.isDemoUser, upa.memberid,upa.isHideContactDetail
                        , upa.religionId, upa.communityId, upa.maritalStatusId, upa.occupationId, upa.educationId, upa.subCommunityId, upa.dietId, upa.annualIncomeId, upa.heightId, upa.birthDate
                        , upa.languages, upa.eyeColor, upa.businessName, upa.companyName, upa.employmentTypeId, upa.weight as weightId, upa.profileForId, upa.expectation, upa.aboutMe
                        ,upa.memberid, upa.anyDisability, upa.haveSpecs, upa.haveChildren, upa.noOfChildren, upa.bloodGroup, upa.complexion, upa.bodyType, upa.familyType, upa.motherTongue
                        , upa.currentAddressId, upa.nativePlace, upa.citizenship, upa.visaStatus, upa.designation, upa.educationTypeId, upa.educationMediumId, upa.drinking, upa.smoking
                        , upa.willingToGoAbroad, upa.areYouWorking,upa.addressId ,edt.name as educationType, edme.name as educationMedium
                        , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                        , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                        , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y')+0 AS age,
                         JSON_OBJECT(
                                 'id',addr.id,
								'addressLine1', addr.addressLine1, 
								'addressLine2', addr.addressLine2, 
								'pincode', addr.pincode, 
								'cityId', addr.cityId, 
								'districtId', addr.districtId, 
								'stateId', addr.stateId, 
								'countryId', addr.countryId,
								'cityName', addr.cityName,
								'stateName', addr.stateName,
								'countryName', addr.countryName,
                                 'residentialStatus',addr.residentialStatus,
                                 'latitude',addr.latitude,
                                 'longitude',addr.longitude
                         ) AS permanentAddress,
                         JSON_OBJECT(
                                 'id', cuaddr.id,
								'addressLine1', cuaddr.addressLine1, 
								'addressLine2', cuaddr.addressLine2, 
								'pincode', cuaddr.pincode, 
								'cityId', cuaddr.cityId, 
								'districtId', cuaddr.districtId, 
								'stateId', cuaddr.stateId, 
								'countryId', cuaddr.countryId,
								'cityName', cuaddr.cityName,
								'stateName', cuaddr.stateName,
								'countryName', cuaddr.countryName,
                                 'residentialStatus',cuaddr.residentialStatus,
                                 'latitude',cuaddr.latitude,
                                 'longitude',cuaddr.longitude
                         ) AS currentAddress,
                         (SELECT JSON_ARRAYAGG(JSON_OBJECT(
								'id', ufdfd.id,
								'userId', ufdfd.userId,
								'name', ufdfd.name,
								'memberType', ufdfd.memberType,
								'memberSubType', ufdfd.memberSubType,
								'educationId', ufdfd.educationId,
								'occupationId', ufdfd.occupationId,
								'maritalStatusId', ufdfd.maritalStatusId,
								'isAlive', ufdfd.isAlive
						)) 
						 FROM userfamilydetail ufdfd
						 WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                         (SELECT JSON_OBJECT(
                                 'id',ufdf.id, 
                                 'userId',ufdf.userId, 
                                 'name',ufdf.name, 
                                 'memberType',ufdf.memberType, 
                                 'memberSubType',ufdf.memberSubType, 
                                 'educationId',ufdf.educationId, 
                                 'occupationId',ufdf.occupationId, 
                                 'maritalStatusId',ufdf.maritalStatusId, 
                                 'isAlive',ufdf.isAlive
						) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1)  AS fatherDetails,
                           (SELECT JSON_OBJECT(
                                 'id',ufdm.id, 
                                 'userId',ufdm.userId, 
                                 'name',ufdm.name, 
                                 'memberType',ufdm.memberType, 
                                 'memberSubType',ufdm.memberSubType, 
                                 'educationId',ufdm.educationId, 
                                 'occupationId',ufdm.occupationId, 
                                 'maritalStatusId',ufdm.maritalStatusId, 
                                 'isAlive',ufdm.isAlive
						) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1)  AS motherDetails,
                        uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                        upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                        upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                        upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight,

                      ROUND( (( 
                            -- #1 Age 
                                (case WHEN ((uppu.pFromAge  <=(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y') + 0) ) && ((DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y') + 0)<= uppu.pToAge )) THEN 1 ELSE 0 END) * COALESCE(pw.pAgeWeight, 1) +
		                    -- #2 Height
                                (case WHEN ((uppu.pFromHeight <= h.name) && ( h.name <= uppu.pToHeight)) THEN 1 ELSE 0 END) * COALESCE(pw.pHeightWeight, 1) +
                            -- #3 Marital Status
                                (CASE WHEN (FIND_IN_SET (upa.maritalStatusId, (uppu.pMaritalStatusId)) > 0)  THEN 1 
                                WHEN uppu.pMaritalStatusId = 0 THEN 0.5
                                ELSE 0 END) * COALESCE(pw.pMaritalStatusWeight, 1) +
		                    -- #4 Profile with children
                                (case 
                                WHEN (uppu.pProfileWithChildren = 1) THEN
		            			    CASE WHEN (upa.haveChildren = 1 || upa.haveChildren = 2 ) THEN 1 ElSE 0 END
		            		            WHEN (uppu.pProfileWithChildren = 2) THEN CASE WHEN (upa.haveChildren = 3) THEN 1 ElSE 0 END
                                        WHEN ((uppu.pProfileWithChildren) = 0 ) THEN 0.5
		            	            ELSE 0 END) * COALESCE(pw.pProfileWithChildrenWeight, 1)  +
		                    -- #5 Family type
                                (case WHEN(sys.isEnableFamilyDetails = true) THEN
                                    CASE
                                        WHEN (upa.familyType = uppu.pFamilyType)  THEN 1 
                                        WHEN uppu.pFamilyType = 0 THEN 0.5
                                     ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pFamilyTypeWeight, 1) +
		                    -- #6 Religion 
                                (CASE 
		            		        WHEN (FIND_IN_SET (upa.religionId, (uppu.pReligionId)) > 0)  THEN 1 
                                    WHEN uppu.pReligionId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pReligionWeight, 1) +
		                    --  #7 Community
                                (CASE 
		            		        WHEN (FIND_IN_SET (upa.communityId, (uppu.pCommunityId)) > 0)  THEN 1 
                                    WHEN uppu.pCommunityId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pCommunityWeight, 1) +
		                    --  #8 Mother tongue
                                (CASE 
		            		        WHEN (FIND_IN_SET (upa.motherTongue, (uppu.pMotherTongue)) > 0)  THEN 1 
		            	            ELSE 0 END) * COALESCE(pw.pMotherTongueWeight, 1) +
		                    --  #9 Horoscope Belief
                                (CASE WHEN(sys.isEnableAstrologicDetails = true) THEN
                                    CASE
		            		            WHEN (uatd.horoscopeBelief = uppu.pHoroscopeBelief )  THEN 1 
                                        WHEN uppu.pHoroscopeBelief = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pHoroscopeBeliefWeight, 1) +
                            --  #10  Manglik Match
                                (CASE WHEN(sys.isEnableAstrologicDetails = true) THEN
                                CASE
		            		            WHEN (uatd.manglik = uppu.pManglikMatch)  THEN 1 
                                        WHEN uppu.pManglikMatch = 0 THEN 0.5
                                ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pManglikMatchWeight, 1) +
		                    -- #11 Country
		            	        (case 
                                        WHEN (FIND_IN_SET (addr.countryId, uppu.pCountryLivingInId) > 0 )  THEN 1 
                                        WHEN uppu.pCountryLivingInId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pCountryLivingInWeight, 1) +
                            -- #12 State
		            	        (case 
                                    WHEN (FIND_IN_SET (addr.stateId, uppu.pStateLivingInId) > 0 )  THEN 1 
                                    WHEN uppu.pStateLivingInId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pStateLivingInWeight, 1) +
                            -- #13 City
		            	        (case 
                                    WHEN (FIND_IN_SET (addr.cityId, uppu.pCityLivingInId) > 0 )  THEN 1
                                    WHEN uppu.pCityLivingInId = 0 THEN 0.5 
		            	        ELSE 0 END) * COALESCE(pw.pCityLivingInWeight, 1) +
                            -- #14 Education Type
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.educationTypeId, uppu.pEducationTypeId) > 0 )  THEN 1 
                                    WHEN uppu.pEducationTypeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEducationTypeWeight, 1) +
                            -- #15 Education Medium
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.educationMediumId, uppu.pEducationMediumId) > 0 )  THEN 1 
                                    WHEN uppu.pEducationMediumId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEducationMediumWeight, 1) +
                            -- #16 Occupation
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.occupationId, uppu.pOccupationId) > 0 )  THEN 1 
                                    WHEN uppu.pOccupationId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pOccupationWeight, 1) +
                            -- #17 Employment Type
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.employmentTypeId, uppu.pEmploymentTypeId) > 0 )  THEN 1 
                                    WHEN uppu.pEmploymentTypeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEmploymentTypeWeight, 1) +
                            -- #18 Annual Income
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.annualIncomeId, uppu.pAnnualIncomeId) > 0 )  THEN 1 
                                    WHEN uppu.pAnnualIncomeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pAnnualIncomeWeight, 1) +
                            -- #19 Diet
		            	        (case WHEN(sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (FIND_IN_SET (upa.dietId, uppu.pDietId) > 0 )  THEN 1 
                                        WHEN uppu.pDietId = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pDietWeight, 1) +
                            -- #20 Smoking
		            	        (case WHEN(sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (upa.smoking = uppu.pSmokingAcceptance )  THEN 1 
                                        WHEN uppu.pSmokingAcceptance = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * (COALESCE(pw.pSmokingAcceptanceWeight, 1) +
                            -- #21 Alcohol
		            	        (case WHEN (sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (upa.drinking = uppu.pAlcoholAcceptance )  THEN 1 
                                        WHEN uppu.pAlcoholAcceptance = 0 THEN 0.5
                                    ELSE 0 END 
		            	        ELSE 1 END) * COALESCE(pw.pAlcoholAcceptanceWeight, 1) +
                            -- #22 Disability Acceptance
		            	        (case 
                                        WHEN (upa.anyDisability = uppu.pDisabilityAcceptance )  THEN 1 
                                        WHEN uppu.pDisabilityAcceptance = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pDisabilityAcceptanceWeight, 1) +
                            --  #23 Complexion
                                (CASE 
		            		            WHEN (FIND_IN_SET (upa.complexion, (uppu.pComplexion)) > 0)  THEN 1 
                                        WHEN uppu.pComplexion = 'Open For All' THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pComplexionWeight, 1) +
                            --  #24 Body Type
                                (CASE 
		            		            WHEN (FIND_IN_SET (upa.bodyType, (uppu.pBodyType)) > 0)  THEN 1 
                                        WHEN uppu.pBodyType = 'Open For All' THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pBodyTypeWeight, 1)
                            ) )/ (
                                COALESCE(pw.pAgeWeight, 1) +
                                COALESCE(pw.pHeightWeight, 1)+
                                COALESCE(pw.pMaritalStatusWeight, 1) +
                                COALESCE(pw.pProfileWithChildrenWeight, 1) +
                                COALESCE(pw.pFamilyTypeWeight, 1) +
                                COALESCE(pw.pReligionWeight, 1) +
                                COALESCE(pw.pCommunityWeight, 1) +
                                COALESCE(pw.pMotherTongueWeight, 1) +
                                COALESCE(pw.pHoroscopeBeliefWeight, 1) +
                                COALESCE(pw.pManglikMatchWeight, 1) +
                                COALESCE(pw.pCountryLivingInWeight, 1) +
                                COALESCE(pw.pStateLivingInWeight, 1) +
                                COALESCE(pw.pCityLivingInWeight, 1) +
                                COALESCE(pw.pEducationTypeWeight, 1) +
                                COALESCE(pw.pEducationMediumWeight, 1) +
                                COALESCE(pw.pOccupationWeight, 1) +
                                COALESCE(pw.pEmploymentTypeWeight, 1) +
                                COALESCE(pw.pAnnualIncomeWeight, 1) +
                                COALESCE(pw.pSmokingAcceptanceWeight, 1) +
                                COALESCE(pw.pAlcoholAcceptanceWeight, 1) +
                                COALESCE(pw.pDisabilityAcceptanceWeight, 1) +
                                COALESCE(pw.pComplexionWeight, 1) +
                                COALESCE(pw.pBodyTypeWeight, 1) 
                        ))
                        * 100 ) AS matchingPercentage 
            , u.id IN (select proposalUserId from userproposals where userId = ` +
            userId +
            `) as isProposed
            , u.id IN (select favUserId from userfavourites where userId = ` +
            userId +
            `) as isFavourite
            , addr.latitude, addr.longitude
            FROM users u
            LEFT JOIN userdevicedetail udd ON udd.userId = u.id
            LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
            LEFT JOIN userroles ur ON ur.userId = u.id
            LEFT JOIN images img ON img.id = u.imageId
            LEFT JOIN religion r ON r.id = upa.religionId
            LEFT JOIN community c ON c.id = upa.communityId
            LEFT JOIN occupation o ON o.id = upa.occupationId
            LEFT JOIN education e ON e.id = upa.educationId
            LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
            LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
            LEFT JOIN addresses addr ON addr.id = upa.addressId
            LEFT JOIN cities cit ON addr.cityId = cit.id
            LEFT JOIN districts ds ON addr.districtId = ds.id
            LEFT JOIN state st ON addr.stateId = st.id
            LEFT JOIN countries cou ON addr.countryId = cou.id
            LEFT JOIN height h ON h.id = upa.heightId            
            LEFT JOIN employmenttype em ON em.id = upa.employmenttypeId
            LEFT JOIN profilefor pf ON pf.id = upa.profileForId
            LEFT JOIN userpersonaldetailcustomdata updcd ON updcd.userId = u.id
            LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
            LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
            LEFT JOIN addresses cuaddr ON cuaddr.id = upa.currentAddressId
            LEFT JOIN weight w ON w.id = upa.weight
            LEFT JOIN educationmedium edme ON edme.id = upa.educationMediumId
            LEFT JOIN educationtype edt ON edt.id = upa.educationTypeId
            LEFT JOIN userpartnerpreferences uppu ON uppu.userId = ` +
            userId +
            `
            LEFT JOIN users loginU ON loginU.id = ` +
            userId +
            `
            CROSS JOIN preference_weights pw
            CROSS JOIN disableScreen sys

            WHERE u.isProfileCompleted = 1 AND ur.roleId = 2 AND u.id != ` +
            userId +
            ` AND (upa.userId = u.id) AND u.id  AND
            (
                u.id NOT IN (select userBlockId from userblock where userId = ` +
            userId +
            `)  
                and u.id NOT IN (select userId from userblock where userBlockId = ` +
            userId +
            `)
                and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` +
            userId +
            `)
            )`;
        if (req.body.searchString) {
            sql +=
                ` AND (u.firstName LIKE '%` +
                    req.body.searchString +
                    `%' OR u.lastName LIKE '%` +
                    req.body.searchString +
                    `%' OR u.middleName LIKE '%` +
                    req.body.searchString +
                    `%' 
                OR u.contactNo LIKE '%` +
                    req.body.searchString +
                    `%' OR u.email LIKE '%` +
                    req.body.searchString +
                    `%' OR u.gender LIKE '%` +
                    req.body.searchString +
                    `%'
                OR pf.name LIKE '%` +
                    req.body.searchString +
                    `%')`;
        }
        if (req.body.gender) {
            sql += ` AND u.gender = '` + req.body.gender + `'`;
        }
        else {
            if (userId > 0 && gender == 'Same') {
                sql += ` AND LOWER(u.gender) = LOWER(loginU.gender)`;
            }
            else if (userId > 0 && gender == 'Opposite') {
                sql += ` AND LOWER(u.gender) != LOWER(loginU.gender)`;
            }
        }
        if (req.body.occupationId && req.body.occupationId.length) {
            sql += ` AND o.id in (` + req.body.occupationId.toString() + `)`;
        }
        if (req.body.educationId && req.body.educationId.length) {
            sql += ` AND e.id in( ` + req.body.educationId.toString() + `)`;
        }
        if (req.body.maritalStatusId && req.body.maritalStatusId.length) {
            sql += ` AND upa.maritalStatusId in(` + req.body.maritalStatusId.toString() + `)`;
        }
        if (req.body.height1 && req.body.height2) {
            sql += ` AND h.name BETWEEN ` + req.body.height1 + ` AND ` + req.body.height2 + ``;
        }
        if (req.body.cityName) {
            sql += ` AND (addr.cityName LIKE '%` + req.body.cityName + `%')`;
        }
        if (req.body.stateId) {
            sql += ` AND st.id = ` + req.body.stateId;
        }
        if (req.body.countryIds) {
            sql += ` AND cou.id IN` + req.body.countryIds.tostring();
        }
        if (req.body.stateIds) {
            sql += ` AND st.id IN` + req.body.stateIds.tostring();
        }
        if (req.body.districtIds) {
            sql += ` AND ds.id IN` + req.body.districtIds.tostring();
        }
        if (req.body.cityIds && req.body.cityIds.length > 0) {
            sql += ` AND cit.id IN(` + req.body.cityIds.toString() + `)`;
        }
        if (req.body.age1 && req.body.age2) {
            sql += ` AND DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0 BETWEEN ` + req.body.age1 + ` AND ` + req.body.age2 + ``;
        }
        if (isCustomFieldEnabled && req.body.customFields != null && req.body.customFields.length > 0) {
            sql += ` AND u.id IN(Select userId from userpersonaldetailcustomdata WHERE `;
            for (let ind = 0; ind < req.body.customFields.length; ind++) {
                if (req.body.customFields[ind].value && req.body.customFields[ind].value.length > 0)
                    sql += `(`;
                for (let val = 0; val < req.body.customFields[ind].value.length; val++) {
                    sql += `` + req.body.customFields[ind].mappedFieldName + ` LIKE '` + req.body.customFields[ind].value[val] + `'`;
                    if (req.body.customFields[ind].valueTypeId == 10) {
                        sql +=
                            ` OR ` +
                                req.body.customFields[ind].mappedFieldName +
                                ` LIKE '%` +
                                req.body.customFields[ind].value[val] +
                                `;%' OR ` +
                                req.body.customFields[ind].mappedFieldName +
                                ` LIKE '%;` +
                                req.body.customFields[ind].value[val] +
                                `;%' OR ` +
                                req.body.customFields[ind].mappedFieldName +
                                ` LIKE '%;` +
                                req.body.customFields[ind].value[val] +
                                `%'`;
                    }
                    if (val < req.body.customFields[ind].value.length - 1) {
                        sql += ` OR `;
                    }
                }
                sql += `)`;
                if (ind < req.body.customFields.length - 1) {
                    sql += ` AND `;
                }
            }
            sql += `)`;
        }
        //sql +=` order by u.createdDate desc`
        if (startIndex != null && fetchRecord != null) {
            sql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
        }
        console.log(sql);
        let result = yield apiHeader_1.default.query(sql);
        if (result) {
            for (let i = 0; i < result.length; i++) {
                result[i].isVerifiedProfile = false;
                let isVerified = true;
                let docVerifiedSql = `SELECT * FROM userdocument WHERE userId =` + result[i].id;
                let docVerifiedResult = yield apiHeader_1.default.query(docVerifiedSql);
                if (docVerifiedResult && docVerifiedResult.length > 0) {
                    for (let j = 0; j < docVerifiedResult.length; j++) {
                        if (docVerifiedResult[j].isRequired && !docVerifiedResult[j].isVerified) {
                            isVerified = false;
                        }
                    }
                }
                else {
                    isVerified = false;
                }
                result[i].isVerifiedProfile = isVerified;
                if (result[i].isVerifyProfilePic) {
                    result[i].isVerifyProfilePic = true;
                }
                else {
                    result[i].isVerifyProfilePic = false;
                }
                // region to get user personal custom data
                let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(result[i].id);
                if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                    // console.log(_customFieldDataResult);
                    result[i].customFields = _customFieldDataResult;
                }
                for (let i = 0; i < result.length; i++) {
                    let userDetailResponse = yield customFields_1.default.getUserData(result[i]);
                    result[i] = Object.assign(Object.assign({}, result[i]), userDetailResponse);
                }
                // if (isCustomFieldEnabled) {
                //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + result[i].id;
                //     let userCustomDataResult = await header.query(userCustomDataSql);
                //     let customdata: any[] = [];
                //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                //         const userCustomDataArrays = [];
                //         const keys = Object.keys(userCustomDataResult[0]);
                //         userCustomDataArrays.push(keys);
                //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                //         for (let j = 0; j < filteredColumns.length; j++) {
                //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[j] + `' and isActive = 1`;
                //             let filterColumnResult = await header.query(sql);
                //             let userDataSql = `SELECT ` + filteredColumns[j] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + result[i].id;
                //             let userDataResult = await header.query(userDataSql);
                //             let mergedResult = Object.assign({}, filterColumnResult[0], userDataResult[0]);
                //             customdata.push(mergedResult);
                //             console.log(userCustomDataResult);
                //         }
                //         if (customdata && customdata.length > 0) {
                //             for (let i = 0; i < customdata.length; i++) {
                //                 if (customdata[i].valueList) {
                //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                //                     customdata[i].valueList = valueListArray;
                //                 }
                //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                //                     if (customdata[i].valueTypeId == 10) {
                //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                //                         customdata[i].value = valueArray;
                //                     }
                //                 }
                //             }
                //         }
                //         result[i].customFields = customdata;
                //     }
                // }
                // end region to get user personal custom data
            }
            if (result[0].isDemoUser == 1) {
                result[0].isDemoUser = true;
            }
            else {
                result[0].isDemoUser = false;
            }
            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Search User Successfully', result, result.length, authorizationResult ? authorizationResult.token : '');
            return res.status(200).send(successResult);
        }
        else {
            let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
            next(errorResult);
        }
        // } else {
        //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
        //     next(errorResult);
        // }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.searchUser() Exception', error, '');
        next(errorResult);
    }
});
const updateUserFlagValues = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Update User Flag Values');
        let requiredFields = ['id', 'userFlagId', 'userFlagValue'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let sql = `UPDATE userflagvalues SET userFlagId = ` + req.body.userFlagId + `, userFlagValue =  '` + req.body.userFlagValue + `' WHERE id = ` + req.body.id;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Flag Value successfully!', result, 1, 'null');
                    return res.status(200).send(successResult);
                }
                else {
                    yield apiHeader_1.default.rollback();
                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserFlagValues() Error', new Error('Error While Upadating Data'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateUserFlagValues() Exception', error, '');
        next(errorResult);
    }
});
const getNearestApplicant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Get Nearest Applicant');
        let requiredFields = [''];
        const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
        console.log(isCustomFieldEnabled);
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let userId = 0;
            let authorizationResult;
            if (req.headers['authorization']) {
                authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
                if (authorizationResult.statusCode == 200) {
                    let currentUser = authorizationResult.currentUser;
                    userId = currentUser ? currentUser.id : 0;
                }
                else {
                    let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                    next(errorResult);
                }
            }
            let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            // SELECT u.id, upa.userId, img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, upa.birthDate, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0 AS age, upa.eyeColor, upa.languages, addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityName, addr.stateName AS state,addr.stateName AS country, r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height , u.id IN (select proposalUserId from userproposals where userId = ` + userId + `) as isProposed,
            // u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
            let sql = `SELECT u.id, addr.latitude, addr.longitude, u.isVerifyProfilePic, u.isDemoUser
                FROM users u
                LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                LEFT JOIN userroles ur ON ur.userId = u.id
                LEFT JOIN images img ON img.id = u.imageId
                LEFT JOIN addresses addr ON addr.id = upa.addressId
                LEFT JOIN religion r ON r.id = upa.religionId
                LEFT JOIN community c ON c.id = upa.communityId
                LEFT JOIN occupation o ON o.id = upa.occupationId
                LEFT JOIN education e ON e.id = upa.educationId
                LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
                LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
                LEFT JOIN height h ON h.id = upa.heightId
                WHERE ur.roleId = 2 AND u.id != ` +
                userId +
                ` AND (upa.userId = u.id) AND u.id  AND
                (
                    u.id NOT IN (select userBlockId from userblock where userId = ` +
                userId +
                `)  
                    and u.id NOT IN (select userId from userblock where userBlockId = ` +
                userId +
                `)
                    and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` +
                userId +
                `)
                )`;
            let result = yield apiHeader_1.default.query(sql);
            if (result && result.length >= 0) {
                let userSql = `SELECT addr.* FROM userpersonaldetail upd INNER JOIN addresses addr ON addr.id = upd.addressId WHERE upd.userId = ` + userId;
                let userResult = yield apiHeader_1.default.query(userSql);
                let distanceArray = [];
                let latestUserIds = [];
                for (let i = 0; i < result.length; i++) {
                    let km = yield distance(userResult && userResult.length > 0 && userResult[0].latitude ? userResult[0].latitude : 21.144539, userResult && userResult.length > 0 && userResult[0].longitude ? userResult[0].longitude : 73.0942, result[i].latitude ? result[i].latitude : 21.144539, result[i].longitude ? result[i].longitude : 73.0942, 'K');
                    let distanceObj = {
                        userId: result[i].id,
                        distance: parseFloat(km + '')
                    };
                    distanceArray.push(JSON.parse(JSON.stringify(distanceObj)));
                }
                distanceArray.sort((a, b) => {
                    if (a.distance > b.distance) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                });
                if (distanceArray && distanceArray.length > 0) {
                    if (startIndex != null && fetchRecord != null) {
                        distanceArray = distanceArray.slice(startIndex, startIndex + fetchRecord);
                    }
                    latestUserIds = distanceArray.map((x) => x.userId);
                }
                if (distanceArray && distanceArray.length > 0) {
                    // let getSql = `SELECT u.id, upa.userId, img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, upa.birthDate, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0 AS age, upa.eyeColor, upa.languages
                    // , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
                    // , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                    // , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height , u.id IN (select proposalUserId from userproposals where userId = ` + userId + `) as isProposed,
                    // u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite, addr.latitude, addr.longitude
                    // FROM users u
                    // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                    // LEFT JOIN userroles ur ON ur.userId = u.id
                    // LEFT JOIN images img ON img.id = u.imageId
                    // LEFT JOIN addresses addr ON addr.id = upa.addressId
                    // LEFT JOIN cities cit ON addr.cityId = cit.id
                    // LEFT JOIN districts ds ON addr.districtId = ds.id
                    // LEFT JOIN state st ON addr.stateId = st.id
                    // LEFT JOIN countries cou ON addr.countryId = cou.id
                    // LEFT JOIN religion r ON r.id = upa.religionId
                    // LEFT JOIN community c ON c.id = upa.communityId
                    // LEFT JOIN occupation o ON o.id = upa.occupationId
                    // LEFT JOIN education e ON e.id = upa.educationId
                    // LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
                    // LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
                    // LEFT JOIN height h ON h.id = upa.heightId
                    // WHERE ur.roleId = 2 AND u.id != ` + userId + ` AND u.id IN(` + latestUserIds.toString() + `) AND (upa.userId = u.id) AND u.id  AND
                    // (
                    //     u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)
                    //     and u.id NOT IN (select userId from userblock where userBlockId = ` + userId + `)
                    //     and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `)
                    // )`;
                    let getSql = `SELECT u.id, udd.fcmtoken,u.stripeCustomerId, img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, u.isVerifyProfilePic, u.isDemoUser, 
                        , upa.birthDate, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0 AS age, upa.eyeColor, upa.languages, upa.expectation, upa.aboutMe, upa.weight, upa.profileForId
                        , pf.name as profileForName
                        , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
                        , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                        , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome
                        , h.name as height, em.name as employmentType
                        , u.id IN (select proposalUserId from userproposals where userId = ` +
                        userId +
                        `) as isProposed
                        , u.id IN (select favUserId from userfavourites where userId = ` +
                        userId +
                        `) as isFavourite
                        , addr.latitude, addr.longitude
                        FROM users u
                        LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                        LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                        LEFT JOIN userroles ur ON ur.userId = u.id
                        LEFT JOIN images img ON img.id = u.imageId
                        LEFT JOIN religion r ON r.id = upa.religionId
                        LEFT JOIN community c ON c.id = upa.communityId
                        LEFT JOIN occupation o ON o.id = upa.occupationId
                        LEFT JOIN education e ON e.id = upa.educationId
                        LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
                        LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
                        LEFT JOIN addresses addr ON addr.id = upa.addressId
                        LEFT JOIN cities cit ON addr.cityId = cit.id
                        LEFT JOIN districts ds ON addr.districtId = ds.id
                        LEFT JOIN state st ON addr.stateId = st.id
                        LEFT JOIN countries cou ON addr.countryId = cou.id
                        LEFT JOIN height h ON h.id = upa.heightId            
                        LEFT JOIN employmenttype em ON em.id = upa.employmenttypeId  
                        LEFT JOIN profilefor pf ON pf.id = upa.profileForId
                        WHERE ur.roleId = 2 AND u.id != ` +
                        userId +
                        ` AND u.id IN(` +
                        latestUserIds.toString() +
                        `) AND (upa.userId = u.id) AND u.id  AND
                        (
                            u.id NOT IN (select userBlockId from userblock where userId = ` +
                        userId +
                        `)  
                            and u.id NOT IN (select userId from userblock where userBlockId = ` +
                        userId +
                        `)
                            and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` +
                        userId +
                        `)
                        )`;
                    let getResult = yield apiHeader_1.default.query(getSql);
                    if (getResult) {
                        for (let i = 0; i < getResult.length; i++) {
                            getResult[i].isVerifiedProfile = false;
                            let isVerified = true;
                            let docVerifiedSql = `SELECT * FROM userdocument WHERE userId =` + getResult[i].id;
                            let docVerifiedResult = yield apiHeader_1.default.query(docVerifiedSql);
                            if (docVerifiedResult && docVerifiedResult.length > 0) {
                                for (let j = 0; j < docVerifiedResult.length; j++) {
                                    if (docVerifiedResult[j].isRequired && !docVerifiedResult[j].isVerified) {
                                        isVerified = false;
                                    }
                                }
                            }
                            else {
                                isVerified = false;
                            }
                            getResult[i].isVerifiedProfile = isVerified;
                            if (getResult[i].isVerifyProfilePic) {
                                getResult[i].isVerifyProfilePic = true;
                            }
                            else {
                                getResult[i].isVerifyProfilePic = false;
                            }
                            // region to get user personal custom data
                            let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(getResult[i].id);
                            if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                                // console.log(_customFieldDataResult);
                                getResult[i].customFields = _customFieldDataResult;
                            }
                            // if (isCustomFieldEnabled) {
                            //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + getResult[i].id;
                            //     let userCustomDataResult = await header.query(userCustomDataSql);
                            //     let customdata: any[] = [];
                            //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                            //         const userCustomDataArrays = [];
                            //         const keys = Object.keys(userCustomDataResult[0]);
                            //         userCustomDataArrays.push(keys);
                            //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                            //         for (let j = 0; j < filteredColumns.length; j++) {
                            //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[j] + `' and isActive = 1`;
                            //             let filterColumnResult = await header.query(sql);
                            //             let userDataSql = `SELECT ` + filteredColumns[j] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + getResult[i].id;
                            //             let userDataResult = await header.query(userDataSql);
                            //             let mergedResult = Object.assign({}, filterColumnResult[0], userDataResult[0]);
                            //             customdata.push(mergedResult);
                            //             console.log(userCustomDataResult);
                            //         }
                            //         if (customdata && customdata.length > 0) {
                            //             for (let i = 0; i < customdata.length; i++) {
                            //                 if (customdata[i].valueList) {
                            //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                            //                     customdata[i].valueList = valueListArray;
                            //                 }
                            //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                            //                     if (customdata[i].valueTypeId == 10) {
                            //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                            //                         customdata[i].value = valueArray;
                            //                     }
                            //                 }
                            //             }
                            //         }
                            //         getResult[i].customFields = customdata;
                            //     }
                            // }
                            // end region to get user personal custom data
                        }
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Nearest Users Successfully', getResult, getResult.length, authorizationResult ? authorizationResult.token : '');
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                        next(errorResult);
                    }
                }
                else {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Nearest Users Successfully', [], 0, authorizationResult ? authorizationResult.token : '');
                    return res.status(200).send(successResult);
                }
            }
            else {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Nearest Users Successfully', [], 0, authorizationResult ? authorizationResult.token : '');
                return res.status(200).send(successResult);
            }
            // } else {
            //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            //     next(errorResult);
            // }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getNearestApplicant() Exception', error, '');
        next(errorResult);
    }
});
var distance = (lat1, lon1, lat2, lon2, unit) => __awaiter(void 0, void 0, void 0, function* () {
    if (lat1 == lat2 && lon1 == lon2) {
        return 0;
    }
    else {
        var radlat1 = (Math.PI * lat1) / 180;
        var radlat2 = (Math.PI * lat2) / 180;
        var theta = lon1 - lon2;
        var radtheta = (Math.PI * theta) / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == 'K') {
            dist = dist * 1.609344;
        }
        if (unit == 'N') {
            dist = dist * 0.8684;
        }
        return dist;
    }
});
const getMostViewedApplicant = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Get Nearest Applicant');
        let requiredFields = [''];
        const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
        console.log(isCustomFieldEnabled);
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult;
            let userId = 0;
            if (req.headers['authorization']) {
                authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
                if (authorizationResult.statusCode == 200) {
                    let currentUser = authorizationResult.currentUser;
                    userId = currentUser ? currentUser.id : 0;
                }
                else {
                    let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                    next(errorResult);
                }
            }
            let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            // let sql = `SELECT u.id, upa.userId, img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, upa.birthDate, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0 AS age, upa.eyeColor, upa.languages
            // , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
            // , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
            // , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome
            // , h.name as height , u.id IN (select proposalUserId from userproposals where userId = ` + userId + `) as isProposed,
            // u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite, addr.latitude, addr.longitude
            // , (select count(id) from userviewprofilehistories where  userId = u.id ) as totalView
            // FROM users u
            // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
            // LEFT JOIN userroles ur ON ur.userId = u.id
            // LEFT JOIN images img ON img.id = u.imageId
            // LEFT JOIN addresses addr ON addr.id = upa.addressId
            // LEFT JOIN cities cit ON addr.cityId = cit.id
            // LEFT JOIN districts ds ON addr.districtId = ds.id
            // LEFT JOIN state st ON addr.stateId = st.id
            // LEFT JOIN countries cou ON addr.countryId = cou.id
            // LEFT JOIN religion r ON r.id = upa.religionId
            // LEFT JOIN community c ON c.id = upa.communityId
            // LEFT JOIN occupation o ON o.id = upa.occupationId
            // LEFT JOIN education e ON e.id = upa.educationId
            // LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
            // LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
            // LEFT JOIN height h ON h.id = upa.heightId
            // WHERE ur.roleId = 2 AND u.id != ` + userId + ` AND (upa.userId = u.id) AND u.id  AND
            // (
            //     u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)
            //     and u.id NOT IN (select userId from userblock where userBlockId = ` + userId + `)
            //     and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `)
            // ) ORDER BY totalView DESC`;
            let sql = `SELECT u.id, udd.fcmtoken, img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, u.isVerifyProfilePic, u.isDemoUser, 
                , upa.birthDate, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0 AS age, upa.eyeColor, upa.languages, upa.expectation, upa.aboutMe, upa.weight, upa.profileForId, pf.name as profileForName
                , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
                , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome
                , h.name as height, em.name as employmentType
                , u.id IN (select proposalUserId from userproposals where userId = ` +
                userId +
                `) as isProposed
                , u.id IN (select favUserId from userfavourites where userId = ` +
                userId +
                `) as isFavourite
                , addr.latitude, addr.longitude
                , (select count(id) from userviewprofilehistories where  userId = u.id ) as totalView
                FROM users u
                LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
                LEFT JOIN userroles ur ON ur.userId = u.id
                LEFT JOIN images img ON img.id = u.imageId
                LEFT JOIN religion r ON r.id = upa.religionId
                LEFT JOIN community c ON c.id = upa.communityId
                LEFT JOIN occupation o ON o.id = upa.occupationId
                LEFT JOIN education e ON e.id = upa.educationId
                LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
                LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
                LEFT JOIN addresses addr ON addr.id = upa.addressId
                LEFT JOIN cities cit ON addr.cityId = cit.id
                LEFT JOIN districts ds ON addr.districtId = ds.id
                LEFT JOIN state st ON addr.stateId = st.id
                LEFT JOIN countries cou ON addr.countryId = cou.id
                LEFT JOIN height h ON h.id = upa.heightId            
                LEFT JOIN employmenttype em ON em.id = upa.employmenttypeId  
                LEFT JOIN profilefor pf ON pf.id = upa.profileForId
                WHERE ur.roleId = 2 AND u.id != ` +
                userId +
                ` AND (upa.userId = u.id) AND u.id  AND
                (
                    u.id NOT IN (select userBlockId from userblock where userId = ` +
                userId +
                `)  
                    and u.id NOT IN (select userId from userblock where userBlockId = ` +
                userId +
                `)
                    and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` +
                userId +
                `)
                ) ORDER BY totalView DESC`;
            if (startIndex != null && fetchRecord != null) {
                sql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
            }
            console.log(sql);
            let result = yield apiHeader_1.default.query(sql);
            if (result && result.length >= 0) {
                for (let i = 0; i < result.length; i++) {
                    result[i].isVerifiedProfile = false;
                    let isVerified = true;
                    let docVerifiedSql = `SELECT * FROM userdocument WHERE userId =` + result[i].id;
                    let docVerifiedResult = yield apiHeader_1.default.query(docVerifiedSql);
                    if (docVerifiedResult && docVerifiedResult.length > 0) {
                        for (let j = 0; j < docVerifiedResult.length; j++) {
                            if (docVerifiedResult[j].isRequired && !docVerifiedResult[j].isVerified) {
                                isVerified = false;
                            }
                        }
                    }
                    else {
                        isVerified = false;
                    }
                    result[i].isVerifiedProfile = isVerified;
                    if (result[i].isVerifyProfilePic) {
                        result[i].isVerifyProfilePic = true;
                    }
                    else {
                        result[i].isVerifyProfilePic = false;
                    }
                    // region to get user personal custom data
                    let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(result[i].id);
                    if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                        // console.log(_customFieldDataResult);
                        result[i].customFields = _customFieldDataResult;
                    }
                    // if (isCustomFieldEnabled) {
                    //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + result[i].id;
                    //     let userCustomDataResult = await header.query(userCustomDataSql);
                    //     let customdata: any[] = [];
                    //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                    //         const userCustomDataArrays = [];
                    //         const keys = Object.keys(userCustomDataResult[0]);
                    //         userCustomDataArrays.push(keys);
                    //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                    //         for (let j = 0; j < filteredColumns.length; j++) {
                    //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[j] + `' and isActive = 1`;
                    //             let filterColumnResult = await header.query(sql);
                    //             let userDataSql = `SELECT ` + filteredColumns[j] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + result[i].id;
                    //             let userDataResult = await header.query(userDataSql);
                    //             let mergedResult = Object.assign({}, filterColumnResult[0], userDataResult[0]);
                    //             customdata.push(mergedResult);
                    //             console.log(userCustomDataResult);
                    //         }
                    //         if (customdata && customdata.length > 0) {
                    //             for (let i = 0; i < customdata.length; i++) {
                    //                 if (customdata[i].valueList) {
                    //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                    //                     customdata[i].valueList = valueListArray;
                    //                 }
                    //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                    //                     if (customdata[i].valueTypeId == 10) {
                    //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                    //                         customdata[i].value = valueArray;
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //         result[i].customFields = customdata;
                    //     }
                    // }
                    // end region to get user personal custom data
                }
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Most Viewed Users Successfully', result, result.length, authorizationResult ? authorizationResult.token : '');
                return res.status(200).send(successResult);
            }
            else {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Most Viewed Users Successfully', [], 0, authorizationResult ? authorizationResult.token : '');
                return res.status(200).send(successResult);
            }
            // } else {
            //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            //     next(errorResult);
            // }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getMostViewedApplicant() Exception', error, '');
        next(errorResult);
    }
});
const completeUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Updating Users');
        let requiredFields = [
            'id',
            'firstName',
            'lastName',
            'email',
            'gender',
            'birthDate',
            'addressLine1',
            'pincode',
            'religionId',
            'communityId',
            'maritalStatusId',
            'occupationId',
            'educationId',
            'annualIncomeId',
            'heightId',
            'languages',
            'employmentTypeId'
        ];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                yield apiHeader_1.default.beginTransaction();
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                req.body.contactNo = req.body.contactNo ? req.body.contactNo : '';
                req.body.middleName = req.body.middleName ? req.body.middleName : '';
                req.body.countryName = req.body.countryName ? req.body.countryName : '';
                req.body.stateName = req.body.stateName ? req.body.stateName : '';
                req.body.cityName = req.body.cityName ? req.body.cityName : '';
                req.body.aboutMe = req.body.aboutMe ? req.body.aboutMe : '';
                req.body.expectation = req.body.expectation ? req.body.expectation : '';
                req.body.eyeColor = req.body.eyeColor ? req.body.eyeColor : '';
                let birthDate = req.body.birthDate ? new Date(req.body.birthDate) : '';
                let bDate = new Date(birthDate).getFullYear().toString() +
                    '-' +
                    ('0' + (new Date(birthDate).getMonth() + 1)).slice(-2) +
                    '-' +
                    ('0' + new Date(birthDate).getDate()).slice(-2) +
                    ' ' +
                    ('0' + new Date(birthDate).getHours()).slice(-2) +
                    ':' +
                    ('0' + new Date(birthDate).getMinutes()).slice(-2) +
                    ':' +
                    ('0' + new Date(birthDate).getSeconds()).slice(-2);
                const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
                console.log(isCustomFieldEnabled);
                let checkSql = `SELECT * FROM users WHERE email = '` + req.body.email + `' AND id != ` + req.body.id;
                let checkResult = yield apiHeader_1.default.query(checkSql);
                if (checkResult && checkResult.length > 0) {
                    yield apiHeader_1.default.rollback();
                    let message = 'Email Already Inserted';
                    return res.status(200).send(message);
                    // let errorResult = new ResultError(203, true, message, new Error(message), '');
                    // next(errorResult);
                }
                else {
                    let result;
                    let sql = `UPDATE users SET firstName = '` +
                        req.body.firstName +
                        `', middleName = '` +
                        req.body.middleName +
                        `', lastName = '` +
                        req.body.lastName +
                        `'
                , contactNo = '` +
                        req.body.contactNo +
                        `',email = '` +
                        req.body.email +
                        `',gender = '` +
                        req.body.gender +
                        `' WHERE id = ` +
                        req.body.id +
                        ``;
                    result = yield apiHeader_1.default.query(sql);
                    if (result && result.affectedRows > 0) {
                        if (req.body.documents && req.body.documents.length > 0) {
                            for (let i = 0; i < req.body.documents.length; i++) {
                                if (req.body.documents[i].isRequired) {
                                    if (!req.body.documents[i].documentUrl) {
                                        let errorResult = new resulterror_1.ResultError(400, true, 'Document is Required', new Error('Document is Required'), '');
                                        next(errorResult);
                                        return errorResult;
                                    }
                                }
                                if (req.body.documents[i].documentUrl) {
                                    if (req.body.documents[i].id) {
                                        if (req.body.documents[i].documentUrl && req.body.documents[i].documentUrl.indexOf('content') == -1) {
                                            let userDocumentId = req.body.documents[i].id;
                                            let oldDocummentSql = `SELECT * FROM userdocument WHERE id = ` + userDocumentId;
                                            let oldDocummentResult = yield apiHeader_1.default.query(oldDocummentSql);
                                            let image = req.body.documents[i].documentUrl;
                                            let data = image.split(',');
                                            if (data && data.length > 1) {
                                                image = image.split(',')[1];
                                            }
                                            let dir = './content';
                                            if (!fs.existsSync(dir)) {
                                                fs.mkdirSync(dir);
                                            }
                                            let dir1 = './content/userDocument';
                                            if (!fs.existsSync(dir1)) {
                                                fs.mkdirSync(dir1);
                                            }
                                            let dir2 = './content/userDocument/' + req.body.id;
                                            if (!fs.existsSync(dir2)) {
                                                fs.mkdirSync(dir2);
                                            }
                                            const fileContentsUser = new Buffer(image, 'base64');
                                            let imgPath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '-realImg.jpeg';
                                            fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                                if (err)
                                                    return console.error(err);
                                                console.log('file saved imagePath');
                                            });
                                            let imagePath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '.jpeg';
                                            yield Jimp.read(imgPath)
                                                .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                                // return lenna
                                                //     //.resize(100, 100) // resize
                                                //     .quality(60) // set JPEG quality
                                                //     // .greyscale() // set greyscale
                                                //     // .write("lena-small-bw.jpg"); // save
                                                //     .write(imagePath);
                                                let data = lenna
                                                    //.resize(100, 100) // resize
                                                    // .quality(60) // set JPEG quality
                                                    // .greyscale() // set greyscale
                                                    // .write("lena-small-bw.jpg"); // save
                                                    .write(imagePath);
                                                const image_act = yield Jimp.read(imagePath);
                                                const watermark = yield Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                                watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                                const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                                const y = image_act.getHeight() - watermark.getHeight() * 2;
                                                image_act.composite(watermark, x, y, {
                                                    mode: Jimp.BLEND_SOURCE_OVER,
                                                    opacitySource: 0.5 // Adjust the opacity of the watermark
                                                });
                                                //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                                yield image_act.writeAsync(imagePath);
                                                return data;
                                            }))
                                                .catch((err) => {
                                                console.error(err);
                                            });
                                            let updateimagePathSql = `UPDATE userdocument SET documentUrl='` + imagePath.substring(2) + `' WHERE id=` + userDocumentId;
                                            let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                                            if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                                // if (oldDocummentResult && oldDocummentResult.length > 0) {
                                                //     for (let d = 0; d < oldDocummentResult.length; d++) {
                                                //         if (oldDocummentResult[d].documentUrl) {
                                                //             let oldUrl = oldDocummentResult[d].documentUrl;
                                                //             let imagePath = "./" + oldUrl;
                                                //             if (fs.existsSync(imagePath)) {
                                                //                 fs.unlink(imagePath, (err: any) => {
                                                //                     if (err) throw err;
                                                //                     console.log(imagePath + ' was deleted');
                                                //                 });
                                                //             }
                                                //             let realImg = "./" + oldUrl.split(".")[0] + "-realImg." + oldUrl.split(".")[1];
                                                //             if (fs.existsSync(realImg)) {
                                                //                 fs.unlink(realImg, (err: any) => {
                                                //                     if (err) throw err;
                                                //                     console.log(realImg + ' was deleted');
                                                //                 });
                                                //             }
                                                //         }
                                                //     }
                                                // }
                                            }
                                            else {
                                                let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                                next(errorResult);
                                            }
                                        }
                                    }
                                    else {
                                        if (req.body.documents[i].documentUrl && req.body.documents[i].documentUrl.indexOf('content') == -1) {
                                            //let imageSql = `INSERT INTO images(createdBy, modifiedBy) VALUES (` + req.body.id + `,` + req.body.id + `)`;
                                            let userDocumentSql = `INSERT INTO userdocument(userId, documentTypeId, isVerified, isRequired, createdBy, modifiedBy) 
                                        VALUES(` +
                                                req.body.id +
                                                `,` +
                                                req.body.documents[i].documentTypeId +
                                                `, 0, ` +
                                                req.body.documents[i].isRequired +
                                                `,` +
                                                req.body.id +
                                                `,` +
                                                req.body.id +
                                                `)`;
                                            result = yield apiHeader_1.default.query(userDocumentSql);
                                            if (result.insertId) {
                                                let userDocumentId = result.insertId;
                                                let image = req.body.documents[i].documentUrl;
                                                let data = image.split(',');
                                                if (data && data.length > 1) {
                                                    image = image.split(',')[1];
                                                }
                                                let dir = './content';
                                                if (!fs.existsSync(dir)) {
                                                    fs.mkdirSync(dir);
                                                }
                                                let dir1 = './content/userDocument';
                                                if (!fs.existsSync(dir1)) {
                                                    fs.mkdirSync(dir1);
                                                }
                                                let dir2 = './content/userDocument/' + req.body.id;
                                                if (!fs.existsSync(dir2)) {
                                                    fs.mkdirSync(dir2);
                                                }
                                                const fileContentsUser = new Buffer(image, 'base64');
                                                let imgPath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '-realImg.jpeg';
                                                fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                                    if (err)
                                                        return console.error(err);
                                                    console.log('file saved imagePath');
                                                });
                                                let imagePath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '.jpeg';
                                                yield Jimp.read(imgPath)
                                                    .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                                    // return lenna
                                                    //     //.resize(100, 100) // resize
                                                    //     .quality(60) // set JPEG quality
                                                    //     // .greyscale() // set greyscale
                                                    //     // .write("lena-small-bw.jpg"); // save
                                                    //     .write(imagePath);
                                                    let data = lenna
                                                        //.resize(100, 100) // resize
                                                        // .quality(60) // set JPEG quality
                                                        // .greyscale() // set greyscale
                                                        // .write("lena-small-bw.jpg"); // save
                                                        .write(imagePath);
                                                    const image_act = yield Jimp.read(imagePath);
                                                    const watermark = yield Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                                    watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                                    const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                                    const y = image_act.getHeight() - watermark.getHeight() * 2;
                                                    image_act.composite(watermark, x, y, {
                                                        mode: Jimp.BLEND_SOURCE_OVER,
                                                        opacitySource: 0.5 // Adjust the opacity of the watermark
                                                    });
                                                    //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                                    yield image_act.writeAsync(imagePath);
                                                    return data;
                                                }))
                                                    .catch((err) => {
                                                    console.error(err);
                                                });
                                                let updateimagePathSql = `UPDATE userdocument SET documentUrl='` + imagePath.substring(2) + `' WHERE id=` + userDocumentId;
                                                let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                                                if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                                }
                                                else {
                                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                                    next(errorResult);
                                                }
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (req.body.documents[i].id) {
                                        let oldDocummentSql = `SELECT * FROM userdocument WHERE id = ` + req.body.documents[i].id;
                                        let oldDocummentResult = yield apiHeader_1.default.query(oldDocummentSql);
                                        let updateimagePathSql = `DELETE FROM userdocument WHERE id=` + req.body.documents[i].id;
                                        let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                                        if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                            if (oldDocummentResult && oldDocummentResult.length > 0) {
                                                for (let d = 0; d < oldDocummentResult.length; d++) {
                                                    if (oldDocummentResult[d].documentUrl) {
                                                        let oldUrl = oldDocummentResult[d].documentUrl;
                                                        let imagePath = './' + oldUrl;
                                                        if (fs.existsSync(imagePath)) {
                                                            fs.unlink(imagePath, (err) => {
                                                                if (err)
                                                                    throw err;
                                                                console.log(imagePath + ' was deleted');
                                                            });
                                                        }
                                                        let realImg = './' + oldUrl.split('.')[0] + '-realImg.' + oldUrl.split('.')[1];
                                                        if (fs.existsSync(realImg)) {
                                                            fs.unlink(realImg, (err) => {
                                                                if (err)
                                                                    throw err;
                                                                console.log(realImg + ' was deleted');
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                            next(errorResult);
                                        }
                                    }
                                }
                            }
                        }
                        let userPerDetailSql = `SELECT * FROM userpersonaldetail WHERE userId = ` + req.body.id + ``;
                        result = yield apiHeader_1.default.query(userPerDetailSql);
                        if (result && result.length > 0) {
                            let userpersonaldetailId = result[0].id;
                            req.body.addressId = result[0].addressId;
                            req.body.birthDate = req.body.birthDate ? req.body.birthDate : '';
                            let updateAddSql = `UPDATE addresses SET addressLine1 = '` +
                                req.body.addressLine1 +
                                `', addressLine2 = '` +
                                req.body.addressLine2 +
                                `', pincode = '` +
                                req.body.pincode +
                                `'
                            , cityId = ` +
                                (req.body.cityId ? req.body.cityId : null) +
                                `, districtId = ` +
                                (req.body.districtId ? req.body.districtId : null) +
                                `
                            , stateId = ` +
                                (req.body.stateId ? req.body.stateId : null) +
                                `, countryId = ` +
                                (req.body.countryId ? req.body.countryId : null) +
                                `
                            , countryName = '` +
                                req.body.countryName +
                                `', stateName = '` +
                                req.body.stateName +
                                `', cityName = '` +
                                req.body.cityName +
                                `' 
                            , latitude = ` +
                                (req.body.latitude ? req.body.latitude : null) +
                                `, longitude = ` +
                                (req.body.longitude ? req.body.longitude : null) +
                                ` WHERE id = ` +
                                req.body.addressId +
                                ``;
                            let updateAddressResult = yield apiHeader_1.default.query(updateAddSql);
                            if (updateAddressResult && updateAddressResult.affectedRows > 0) {
                                // let addressId = updateAddressResult[0].id;
                                let updateSql = `UPDATE userpersonaldetail SET addressId = ` +
                                    req.body.addressId +
                                    `, religionId = ` +
                                    req.body.religionId +
                                    `,communityId = ` +
                                    req.body.communityId +
                                    `,maritalStatusId = ` +
                                    req.body.maritalStatusId +
                                    `,occupationId = ` +
                                    req.body.occupationId +
                                    `,educationId = ` +
                                    req.body.educationId +
                                    `,subCommunityId = ` +
                                    req.body.subCommunityId +
                                    `,dietId = ` +
                                    req.body.dietId +
                                    `,annualIncomeId = ` +
                                    req.body.annualIncomeId +
                                    `,heightId = ` +
                                    req.body.heightId +
                                    `,birthDate = '` +
                                    bDate +
                                    `',languages = '` +
                                    req.body.languages +
                                    `',eyeColor = '` +
                                    req.body.eyeColor +
                                    `', businessName = ` +
                                    (req.body.businessName && req.body.businessName != '' ? "'" + req.body.businessName + "'" : null) +
                                    `, companyName = ` +
                                    (req.body.companyName && req.body.companyName != '' ? "'" + req.body.companyName + "'" : null) +
                                    `, employmentTypeId = ` +
                                    req.body.employmentTypeId +
                                    `, expectation = '` +
                                    req.body.expectation +
                                    `', aboutMe = '` +
                                    req.body.aboutMe +
                                    `',weight = ` +
                                    req.body.weight +
                                    `, profileForId = ` +
                                    req.body.profileForId +
                                    `  WHERE id = ` +
                                    userpersonaldetailId +
                                    ``;
                                result = yield apiHeader_1.default.query(updateSql);
                                if (result && result.affectedRows > 0) {
                                    // region update user personal custom data
                                    if (isCustomFieldEnabled && req.body.customFields != null && req.body.customFields.length > 0) {
                                        let fields = req.body.customFields[0];
                                        let customUpdateSql = `UPDATE userpersonaldetailcustomdata SET `;
                                        for (let i = 0; i < fields.length; i++) {
                                            if (fields[i].value && Array.isArray(fields[i].value)) {
                                                const semicolonSeparatedString = fields[i].value.join(';');
                                                fields[i].value = semicolonSeparatedString;
                                            }
                                            // customUpdateSql += `` + fields[i].mappedFieldName + ` = `;
                                            // if (fields[i].valueTypeId == '2') {
                                            //     customUpdateSql += `` + fields[i].value + ``;
                                            // }
                                            // else {
                                            //     customUpdateSql += `'` + fields[i].value + `'`;
                                            // }
                                            customUpdateSql += `` + fields[i].mappedFieldName + ` = `;
                                            if (fields[i].valueTypeId == '2') {
                                                customUpdateSql += `` + (fields[i].value ? fields[i].value : null) + ``;
                                            }
                                            else {
                                                // customUpdateSql += `'` + fields[i].value + `'`;
                                                customUpdateSql += `` + (fields[i].value && fields[i].value != '' ? "'" + fields[i].value + "'" : null) + ``;
                                            }
                                            customUpdateSql += `,`;
                                        }
                                        customUpdateSql += ` modifiedBy = ` + req.body.id + `, modifiedDate = CURRENT_TIMESTAMP() WHERE userId = ` + req.body.id + `  `;
                                        let customUpdateResult = yield apiHeader_1.default.query(customUpdateSql);
                                        // if (customUpdateResult && customUpdateResult.affectedRows > 0) {
                                        // } else {
                                        //     await header.rollback();
                                        //     let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                                        //     next(errorResult);
                                        // }
                                    }
                                    // end region update user personal custom data
                                    let sql = `SELECT u.id, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, 
                                    , upd.birthDate, upd.languages, upd.eyeColor, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId, pf.name as profileForName, img.imageUrl
                                , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                                , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
                                , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age
                                , addr.latitude, addr.longitude
                                FROM users u
                                LEFT JOIN userroles ur ON ur.userId = u.id
                                LEFT JOIN images img ON img.id = u.imageId
                                LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                LEFT JOIN religion r ON r.id = upd.religionId
                                LEFT JOIN community c ON c.id = upd.communityId
                                LEFT JOIN occupation o ON o.id = upd.occupationId
                                LEFT JOIN education e ON e.id = upd.educationId
                                LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                LEFT JOIN height h ON h.id = upd.heightId
                                LEFT JOIN addresses addr ON addr.id = upd.addressId
                                LEFT JOIN cities cit ON addr.cityId = cit.id
                                LEFT JOIN districts ds ON addr.districtId = ds.id
                                LEFT JOIN state st ON addr.stateId = st.id
                                LEFT JOIN countries cou ON addr.countryId = cou.id
                                LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                LEFT JOIN profilefor pf ON pf.id = upd.profileForId
                                 WHERE ur.roleId = 2 AND u.id = ` + req.body.id;
                                    let result = yield apiHeader_1.default.query(sql);
                                    if (result && result.length > 0) {
                                        result[0].isVerified = false;
                                        let isVerified = true;
                                        let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + result[0].id;
                                        let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                        result[0].userDocuments = documentsResult;
                                        if (documentsResult && documentsResult.length > 0) {
                                            for (let j = 0; j < documentsResult.length; j++) {
                                                if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                    isVerified = false;
                                                }
                                            }
                                        }
                                        else {
                                            isVerified = false;
                                        }
                                        result[0].isVerifiedProfile = isVerified;
                                        if (result[0].isVerifyProfilePic) {
                                            result[0].isVerifyProfilePic = true;
                                        }
                                        else {
                                            result[0].isVerifyProfilePic = false;
                                        }
                                        result[0].totalView = 0;
                                        result[0].todayView = 0;
                                        let totalViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id;
                                        let totalViewResult = yield apiHeader_1.default.query(totalViewSql);
                                        if (totalViewResult && totalViewResult.length > 0) {
                                            result[0].totalView = totalViewResult[0].totalView;
                                        }
                                        let todayViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id + ` AND DATE(transactionDate) = DATE(CURRENT_TIMESTAMP())`;
                                        let todayViewResult = yield apiHeader_1.default.query(todayViewSql);
                                        if (todayViewResult && todayViewResult.length > 0) {
                                            result[0].todayView = todayViewResult[0].totalView;
                                        }
                                        let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                            LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                            WHERE ufv.userId = ` + req.body.id;
                                        result[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                        let getUserAuthSql = `SELECT * FROM userauthdata WHERE userId = ` + req.body.id;
                                        let getUserAuthResult = yield apiHeader_1.default.query(getUserAuthSql);
                                        result[0].isOAuth = getUserAuthResult && getUserAuthResult.length > 0 ? true : false;
                                        result[0].isAppleLogin = getUserAuthResult && getUserAuthResult.length > 0 && getUserAuthResult[0].authProviderId == 3 ? true : false;
                                        result[0].userWalletAmount = 0;
                                        let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + result[0].id;
                                        let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                        if (getUserWalletResult && getUserWalletResult.length > 0) {
                                            result[0].userWalletAmount = getUserWalletResult[0].amount;
                                        }
                                        //if (req.body.isSignup) {
                                        let adminUserSql = `SELECT * FROM users where id IN(select userId from userroles where (roleId = 1 OR roleId = 3)) AND isActive  = true AND isDelete = false`;
                                        let adminUserResult = yield apiHeader_1.default.query(adminUserSql);
                                        if (adminUserResult && adminUserResult.length > 0) {
                                            for (let a = 0; a < adminUserResult.length; a++) {
                                                if (adminUserResult[a].isReceiveMail) {
                                                    let resultEmail = yield sendEmail(config_1.default.emailMatrimonyNewUserRegister.fromName + ' <' + config_1.default.emailMatrimonyNewUserRegister.fromEmail + '>', [adminUserResult[a].email], config_1.default.emailMatrimonyNewUserRegister.subject, '', config_1.default.emailMatrimonyNewUserRegister.html
                                                        .replace("[User's Full Name]", result[0].firstName + ' ' + result[0].lastName)
                                                        .replace("[User's Contact No]", result[0].contactNo)
                                                        .replace("[User's Email Address]", result[0].email), null, null);
                                                    console.log(resultEmail);
                                                }
                                                if (adminUserResult[a].isReceiveNotification) {
                                                    let deviceDetailSql = `SELECT * FROM userdevicedetail WHERE userId = ` + adminUserResult[a].id + ` AND fcmToken IS NOT NULL`;
                                                    let deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                                    if (deviceDetailResult && deviceDetailResult.length > 0) {
                                                        let title = 'New User Register';
                                                        let description = 'New User ' + result[0].firstName + ' ' + result[0].lastName + ' registered in system. Please verify document';
                                                        let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                                                    VALUES(` +
                                                            adminUserResult[a].id +
                                                            `,'` +
                                                            title +
                                                            `', '` +
                                                            description +
                                                            `', null, null, ` +
                                                            authorizationResult.currentUser.id +
                                                            `, ` +
                                                            authorizationResult.currentUser.id +
                                                            `)`;
                                                        let notificationResult = yield apiHeader_1.default.query(notificationSql);
                                                        yield notifications_1.default.sendMultipleNotification([deviceDetailResult[0].fcmToken], null, title, description, '', null, null, 0);
                                                        console.log('Send' + deviceDetailResult[0].fcmToken);
                                                    }
                                                }
                                            }
                                        }
                                        //}
                                        if (result[0].isDemoUser == 1) {
                                            result[0].isDemoUser = true;
                                        }
                                        else {
                                            result[0].isDemoUser = false;
                                        }
                                        yield apiHeader_1.default.commit();
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Personal Detail', result, 1, authorizationResult.token);
                                        return res.status(200).send(successResult);
                                    }
                                    else {
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Updating Data'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Updating Data'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Updating Data'), '');
                                next(errorResult);
                            }
                        }
                        else {
                            let memberId = makeid(8).toUpperCase();
                            // let memberId = (await makememberid(10)).toUpperCase()
                            console.log(memberId);
                            let insertAddress = `INSERT INTO addresses(addressLine1, addressLine2, pincode, cityId, districtId, stateId, countryId, countryName, stateName, cityName, latitude, longitude
                            , createdBy, modifiedBy) VALUES('` +
                                req.body.addressLine1 +
                                `','` +
                                req.body.addressLine2 +
                                `','` +
                                req.body.pincode +
                                `', ` +
                                (req.body.cityId ? req.body.cityId : null) +
                                `
                            , ` +
                                (req.body.districtId ? req.body.districtId : null) +
                                `, ` +
                                (req.body.stateId ? req.body.stateId : null) +
                                `, ` +
                                (req.body.countryId ? req.body.countryId : null) +
                                `
                            , '` +
                                req.body.countryName +
                                `','` +
                                req.body.stateName +
                                `','` +
                                req.body.cityName +
                                `', ` +
                                req.body.latitude +
                                `, ` +
                                req.body.longitude +
                                `,` +
                                userId +
                                `,` +
                                userId +
                                `)`;
                            console.log(insertAddress);
                            let addressResult = yield apiHeader_1.default.query(insertAddress);
                            if (addressResult && addressResult.insertId > 0) {
                                req.body.addressId = addressResult.insertId;
                                let insertSql = `INSERT INTO userpersonaldetail(userId, addressId, religionId, communityId, maritalStatusId, occupationId, educationId, subCommunityId, dietId, annualIncomeId, heightId, birthDate
                                , languages, eyeColor, businessName, companyName, employmentTypeId, expectation, aboutMe, createdBy, modifiedBy, weight, profileForId, memberid) VALUES(` +
                                    req.body.id +
                                    `,` +
                                    req.body.addressId +
                                    `,` +
                                    req.body.religionId +
                                    `
                                ,` +
                                    req.body.communityId +
                                    `,` +
                                    req.body.maritalStatusId +
                                    `,` +
                                    req.body.occupationId +
                                    `,` +
                                    req.body.educationId +
                                    `,` +
                                    req.body.subCommunityId +
                                    `,` +
                                    req.body.dietId +
                                    `
                                ,` +
                                    req.body.annualIncomeId +
                                    `,` +
                                    req.body.heightId +
                                    `,'` +
                                    bDate +
                                    `','` +
                                    req.body.languages +
                                    `','` +
                                    req.body.eyeColor +
                                    `', ` +
                                    (req.body.businessName ? `'` + req.body.businessName + `'` : null) +
                                    `, ` +
                                    (req.body.companyName ? `'` + req.body.companyName + `'` : null) +
                                    `
                                , ` +
                                    req.body.employmentTypeId +
                                    `, '` +
                                    req.body.expectation +
                                    `', '` +
                                    req.body.aboutMe +
                                    `',` +
                                    userId +
                                    `,` +
                                    userId +
                                    `,` +
                                    req.body.weight +
                                    `,` +
                                    req.body.profileForId +
                                    `,'` +
                                    memberId +
                                    `')`;
                                console.log(insertSql);
                                result = yield apiHeader_1.default.query(insertSql);
                                if (result && result.affectedRows > 0) {
                                    if (isCustomFieldEnabled && req.body.customFields != null && req.body.customFields.length > 0) {
                                        let fields = req.body.customFields;
                                        let customAddSql = `INSERT INTO userpersonaldetailcustomdata(userId,createdBy,modifiedBy,`;
                                        for (let i = 0; i < fields.length; i++) {
                                            customAddSql += `` + fields[i].mappedFieldName + ``;
                                            if (i != fields.length - 1) {
                                                customAddSql += `,`;
                                            }
                                        }
                                        customAddSql += `) VALUES (` + req.body.id + `,` + req.body.id + `,` + req.body.id + `,`;
                                        for (let i = 0; i < fields.length; i++) {
                                            if (fields[i].value && Array.isArray(fields[i].value)) {
                                                const semicolonSeparatedString = fields[i].value.join(';');
                                                fields[i].value = semicolonSeparatedString;
                                            }
                                            // if (fields[i].valueTypeId == '2') {
                                            //     customAddSql += `` + fields[i].value + ``;
                                            // }
                                            // else {
                                            //     customAddSql += `'` + fields[i].value + `'`;
                                            // }
                                            // customUpdateSql += `` + fields[i].mappedFieldName + ` = `;
                                            if (fields[i].valueTypeId == '2') {
                                                customAddSql += `` + (fields[i].value ? fields[i].value : null) + ``;
                                            }
                                            else {
                                                // customUpdateSql += `'` + fields[i].value + `'`;
                                                customAddSql += `` + (fields[i].value && fields[i].value != '' ? "'" + fields[i].value + "'" : null) + ``;
                                            }
                                            if (i != fields.length - 1) {
                                                customAddSql += `,`;
                                            }
                                        }
                                        customAddSql += ` ) `;
                                        console.log(customAddSql);
                                        let customAddResult = yield apiHeader_1.default.query(customAddSql);
                                        if (customAddResult && customAddResult.affectedRows > 0) {
                                        }
                                        else {
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                            next(errorResult);
                                        }
                                    }
                                    let flagError = false;
                                    let checkRewardSql = `SELECT * FROM systemflags WHERE id IN(42,43)`;
                                    let checkRewardResult = yield apiHeader_1.default.query(checkRewardSql);
                                    if (checkRewardResult && checkRewardResult.length > 0) {
                                        let ind = checkRewardResult.findIndex((c) => c.value == '1' && c.id == 42);
                                        let amount = parseFloat(checkRewardResult.find((c) => c.id == 43).value);
                                        if (ind >= 0) {
                                            //Insert Wallet User History and Insert/Update User Wallet
                                            let referalUserSql = `Select referalUserId from users where id = ` + req.body.id;
                                            let referalUserResult = yield apiHeader_1.default.query(referalUserSql);
                                            if (referalUserResult && referalUserResult.length > 0 && referalUserResult[0].referalUserId != null) {
                                                let checkUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + referalUserResult[0].referalUserId;
                                                // let checkUserWalletSql = `SELECT * FROM userwallets WHERE userId = (select referalUserId from users where id=` + userId + `)`;
                                                let checkUserWalletResult = yield apiHeader_1.default.query(checkUserWalletSql);
                                                if (checkUserWalletResult && checkUserWalletResult.length > 0) {
                                                    let lAmt = checkUserWalletResult[0].amount + amount;
                                                    let userWalletSql = `UPDATE userwallets SET amount = ` +
                                                        lAmt +
                                                        `, modifiedBy = ` +
                                                        userId +
                                                        `, modifiedDate = CURRENT_TIMESTAMP() WHERE id = ` +
                                                        checkUserWalletResult[0].id;
                                                    let result = yield apiHeader_1.default.query(userWalletSql);
                                                    if (result && result.affectedRows >= 0) {
                                                        let userWalletId = checkUserWalletResult[0].id;
                                                        let userWalletHistorySql = `INSERT INTO userwallethistory(userWalletId, amount, isCredit, transactionDate, remark, createdBy, modifiedBy) 
                                                    VALUES(` +
                                                            userWalletId +
                                                            `,` +
                                                            amount +
                                                            `, 1, ?, 'Amount credited via refered user',` +
                                                            userId +
                                                            `,` +
                                                            userId +
                                                            ` )`;
                                                        result = yield apiHeader_1.default.query(userWalletHistorySql, [new Date()]);
                                                        if (result && result.insertId > 0) {
                                                        }
                                                        else {
                                                            flagError = true;
                                                            yield apiHeader_1.default.rollback();
                                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                                            next(errorResult);
                                                        }
                                                    }
                                                    else {
                                                        flagError = true;
                                                        yield apiHeader_1.default.rollback();
                                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                                        next(errorResult);
                                                    }
                                                }
                                                else {
                                                    let userWalletSql = `INSERT INTO userwallets(userId, amount, createdBy, modifiedBy) VALUES(` + req.body.id + `,` + amount + `,` + userId + `,` + userId + `)`;
                                                    let result = yield apiHeader_1.default.query(userWalletSql);
                                                    if (result && result.insertId > 0) {
                                                        let userWalletId = result.insertId;
                                                        let userWalletHistorySql = `INSERT INTO userwallethistory(userWalletId, amount, isCredit, transactionDate, remark, createdBy, modifiedBy) 
                                                    VALUES(` +
                                                            userWalletId +
                                                            `,` +
                                                            amount +
                                                            `, 1, ?, 'Amount credited via refered user',` +
                                                            userId +
                                                            `,` +
                                                            userId +
                                                            ` )`;
                                                        result = yield apiHeader_1.default.query(userWalletHistorySql, [new Date()]);
                                                        if (result && result.insertId > 0) {
                                                        }
                                                        else {
                                                            flagError = true;
                                                            yield apiHeader_1.default.rollback();
                                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                                            next(errorResult);
                                                        }
                                                    }
                                                    else {
                                                        flagError = true;
                                                        yield apiHeader_1.default.rollback();
                                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                                        next(errorResult);
                                                    }
                                                }
                                            }
                                            else {
                                            }
                                        }
                                    }
                                    if (!flagError) {
                                        let sql = `SELECT u.id, u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, 
                                                    , upd.birthDate, upd.languages, upd.eyeColor, upd.expectation, upd.aboutMe, upd.weight, upd.profileForId, pf.name as profileForName
                                                    , img.imageUrl, r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity
                                                    , ai.value as annualIncome, h.name as height
                                                    , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
                                                    , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                                    , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age
                                                    , addr.latitude, addr.longitude
                                                    FROM users u
                                                    LEFT JOIN userroles ur ON ur.userId = u.id
                                                    LEFT JOIN images img ON img.id = u.imageId
                                                    LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                                    LEFT JOIN religion r ON r.id = upd.religionId
                                                    LEFT JOIN community c ON c.id = upd.communityId
                                                    LEFT JOIN occupation o ON o.id = upd.occupationId
                                                    LEFT JOIN education e ON e.id = upd.educationId
                                                    LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                                    LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                                    LEFT JOIN height h ON h.id = upd.heightId
                                                    LEFT JOIN addresses addr ON addr.id = upd.addressId
                                                    LEFT JOIN cities cit ON addr.cityId = cit.id
                                                    LEFT JOIN districts ds ON addr.districtId = ds.id
                                                    LEFT JOIN state st ON addr.stateId = st.id
                                                    LEFT JOIN countries cou ON addr.countryId = cou.id
                                                    LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                                    LEFT JOIN profilefor pf ON pf.id = upd.profileForId
                                                    WHERE ur.roleId = 2 AND u.id = ` + req.body.id;
                                        let result = yield apiHeader_1.default.query(sql);
                                        // let adminUserSql = `SELECT u.* FROM users u INNER JOIN userroles ur ON ur.userId = u.id WHERE (ur.roleId = 1 OR ur.roleId = 3) AND u.isActive && u.isReceiveMail && !u.isDelete`
                                        // let adminUserResult = await header.query(adminUserSql);
                                        // let emails = [];
                                        // if (adminUserResult && adminUserResult.length > 0) {
                                        //     for (let i = 0; i < adminUserResult.length; i++) {
                                        //         if (adminUserResult[i].email)
                                        //             emails.push(adminUserResult[i].email)
                                        //     }
                                        // }
                                        // let resultEmail = await sendEmail(config.emailMatrimonyNewUserRegister.fromName + ' <' + config.emailMatrimonyNewUserRegister.fromEmail + '>'
                                        //     , emails
                                        //     , config.emailMatrimonyNewUserRegister.subject
                                        //     , ""
                                        //     , config.emailMatrimonyNewUserRegister.html
                                        //         .replace("[User's Full Name]", result[0].firstName + " " + result[0].lastName)
                                        //         .replace("[User's Contact No]", result[0].contactNo)
                                        //         .replace("[User's Email Address]", result[0].email)
                                        //     , null, null);
                                        if (result && result.length > 0) {
                                            result[0].isVerified = false;
                                            let isVerified = true;
                                            let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + result[0].id;
                                            let documentsResult = yield apiHeader_1.default.query(documentsSql);
                                            result[0].userDocuments = documentsResult;
                                            if (documentsResult && documentsResult.length > 0) {
                                                for (let j = 0; j < documentsResult.length; j++) {
                                                    if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                                        isVerified = false;
                                                    }
                                                }
                                            }
                                            else {
                                                isVerified = false;
                                            }
                                            result[0].isVerifiedProfile = isVerified;
                                            if (result[0].isVerifyProfilePic) {
                                                result[0].isVerifyProfilePic = true;
                                            }
                                            else {
                                                result[0].isVerifyProfilePic = false;
                                            }
                                            result[0].totalView = 0;
                                            result[0].todayView = 0;
                                            let totalViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id;
                                            let totalViewResult = yield apiHeader_1.default.query(totalViewSql);
                                            if (totalViewResult && totalViewResult.length > 0) {
                                                result[0].totalView = totalViewResult[0].totalView;
                                            }
                                            let todayViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id + ` AND DATE(transactionDate) = DATE(CURRENT_TIMESTAMP())`;
                                            let todayViewResult = yield apiHeader_1.default.query(todayViewSql);
                                            if (todayViewResult && todayViewResult.length > 0) {
                                                result[0].todayView = todayViewResult[0].totalView;
                                            }
                                            let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                            LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                            WHERE ufv.userId = ` + req.body.id;
                                            result[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                                            let getUserAuthSql = `SELECT * FROM userauthdata WHERE userId = ` + req.body.id;
                                            let getUserAuthResult = yield apiHeader_1.default.query(getUserAuthSql);
                                            result[0].isOAuth = getUserAuthResult && getUserAuthResult.length > 0 ? true : false;
                                            result[0].isAppleLogin = getUserAuthResult && getUserAuthResult.length > 0 && getUserAuthResult[0].authProviderId == 3 ? true : false;
                                            result[0].userWalletAmount = 0;
                                            let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + result[0].id;
                                            let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                                            if (getUserWalletResult && getUserWalletResult.length > 0) {
                                                result[0].userWalletAmount = getUserWalletResult[0].amount;
                                            }
                                            if (req.body.isSignup) {
                                                let adminUserSql = `SELECT * FROM users where id IN(select userId from userroles where (roleId = 1 OR roleId = 3)) AND isActive  = true AND isDelete = false`;
                                                let adminUserResult = yield apiHeader_1.default.query(adminUserSql);
                                                if (adminUserResult && adminUserResult.length > 0) {
                                                    for (let a = 0; a < adminUserResult.length; a++) {
                                                        if (adminUserResult[a].isReceiveMail) {
                                                            let resultEmail = yield sendEmail(config_1.default.emailMatrimonyNewUserRegister.fromName + ' <' + config_1.default.emailMatrimonyNewUserRegister.fromEmail + '>', [adminUserResult[a].email], config_1.default.emailMatrimonyNewUserRegister.subject, '', config_1.default.emailMatrimonyNewUserRegister.html
                                                                .replace("[User's Full Name]", result[0].firstName + ' ' + result[0].lastName)
                                                                .replace("[User's Contact No]", result[0].contactNo)
                                                                .replace("[User's Email Address]", result[0].email), null, null);
                                                            console.log(resultEmail);
                                                        }
                                                        if (adminUserResult[a].isReceiveNotification) {
                                                            let deviceDetailSql = `SELECT * FROM userdevicedetail WHERE userId = ` + adminUserResult[a].id + ` AND fcmToken IS NOT NULL`;
                                                            let deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                                            if (deviceDetailResult && deviceDetailResult.length > 0) {
                                                                let title = 'New User Register';
                                                                let description = 'New User ' + result[0].firstName + ' ' + result[0].lastName + ' registered in system. Please verify document';
                                                                let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                                                    VALUES(` +
                                                                    adminUserResult[a].id +
                                                                    `,'` +
                                                                    title +
                                                                    `', '` +
                                                                    description +
                                                                    `', null, null, ` +
                                                                    authorizationResult.currentUser.id +
                                                                    `, ` +
                                                                    authorizationResult.currentUser.id +
                                                                    `)`;
                                                                let notificationResult = yield apiHeader_1.default.query(notificationSql);
                                                                yield notifications_1.default.sendMultipleNotification([deviceDetailResult[0].fcmToken], null, title, description, '', null, null, 0);
                                                                console.log('Send' + deviceDetailResult[0].fcmToken);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(req.body.id);
                                            if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                                                // console.log(_customFieldDataResult);
                                                result[0].customFields = _customFieldDataResult;
                                            }
                                            // region to get user personal custom data
                                            // if (isCustomFieldEnabled) {
                                            //     let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + req.body.id;
                                            //     let userCustomDataResult = await header.query(userCustomDataSql);
                                            //     let customdata: any[] = [];
                                            //     if (userCustomDataResult && userCustomDataResult.length > 0) {
                                            //         const userCustomDataArrays = [];
                                            //         const keys = Object.keys(userCustomDataResult[0]);
                                            //         userCustomDataArrays.push(keys);
                                            //         const filteredColumns: string[] = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                                            //         for (let i = 0; i < filteredColumns.length; i++) {
                                            //             let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[i] + `' and isActive = 1`;
                                            //             let result = await header.query(sql);
                                            //             let userDataSql = `SELECT ` + filteredColumns[i] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + req.body.id;
                                            //             let userDataResult = await header.query(userDataSql);
                                            //             let mergedResult = Object.assign({}, result[0], userDataResult[0]);
                                            //             customdata.push(mergedResult);
                                            //             console.log(userCustomDataResult);
                                            //         }
                                            //         if (customdata && customdata.length > 0) {
                                            //             for (let i = 0; i < customdata.length; i++) {
                                            //                 if (customdata[i].valueList) {
                                            //                     const valueListArray: string[] = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                                            //                     customdata[i].valueList = valueListArray;
                                            //                 }
                                            //                 if (customdata[i].value && typeof customdata[i].value === 'string') {
                                            //                     if (customdata[i].valueTypeId == 10) {
                                            //                         const valueArray: string[] = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                                            //                         customdata[i].value = valueArray;
                                            //                     }
                                            //                 }
                                            //             }
                                            //         }
                                            //         result[0].customFields = customdata;
                                            //     }
                                            // }
                                            // else {
                                            //     await header.rollback();
                                            //     let errorResult = new ResultError(400, true, "users.updateUserProfileDetail() Error", new Error('Error While Inserting Data'), '');
                                            //     next(errorResult);
                                            // }
                                            // end region to get user personal custom data 
                                            if (result[0].isDemoUser == 1) {
                                                result[0].isDemoUser = true;
                                            }
                                            else {
                                                result[0].isDemoUser = false;
                                            }
                                            yield apiHeader_1.default.commit();
                                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert User Personal Detail', result, 1, authorizationResult.token);
                                            return res.status(200).send(successResult);
                                        }
                                        else {
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                            next(errorResult);
                                        }
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Updating Data'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateUserProfileDetail() Exception', error, '');
        next(errorResult);
    }
});
const deleteAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Delete Account');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser ? currentUser.id : 0;
                yield apiHeader_1.default.beginTransaction();
                let deleteQueries = [
                    `DELETE FROM feedback WHERE createdBy = ` + userId,
                    `DELETE FROM successstories WHERE createdBy = ` + userId,
                    `DELETE FROM successstories WHERE userId = ` + userId,
                    `DELETE FROM successstories WHERE partnerUserId = ` + userId,
                    `DELETE FROM userauthdata WHERE userId = ` + userId,
                    `DELETE FROM userblock WHERE userId = ` + userId,
                    `DELETE FROM userblock WHERE userBlockId = ` + userId,
                    `DELETE FROM userblockrequest WHERE userId = ` + userId,
                    `DELETE FROM userblockrequest WHERE blockRequestUserId = ` + userId,
                    `DELETE FROM userchat WHERE userId = ` + userId,
                    `DELETE FROM userchat WHERE partnerId = ` + userId,
                    `DELETE FROM userdevicedetail WHERE userId =` + userId,
                    `DELETE FROM userdocument WHERE userId = ` + userId,
                    `DELETE FROM userfavourites WHERE userId = ` + userId,
                    `DELETE FROM userfavourites WHERE favUserId = ` + userId,
                    `DELETE FROM userflagvalues WHERE userId = ` + userId,
                    `DELETE FROM usernotifications WHERE userId = ` + userId,
                    `DELETE FROM userpackage WHERE userId = ` + userId,
                    `DELETE FROM userpersonaldetail WHERE userId = ` + userId,
                    `DELETE FROM userproposals WHERE userId = ` + userId,
                    `DELETE FROM userproposals WHERE proposalUserId = ` + userId,
                    `DELETE FROM userrefreshtoken WHERE userId = ` + userId,
                    `DELETE FROM userroles WHERE userId =` + userId,
                    `DELETE FROM usertokens WHERE userId = ` + userId,
                    `DELETE FROM userviewprofilehistories WHERE userId =` + userId,
                    `DELETE FROM userviewprofilehistories WHERE viewProfileByUserId =` + userId,
                    `DELETE FROM userwallethistory WHERE createdBy =` + userId,
                    `DELETE FROM userwallets WHERE userId = ` + userId,
                    `DELETE FROM payment WHERE createdBy = ` + userId,
                    `DELETE FROM addresses WHERE createdBy = ` + userId,
                    `DELETE FROM userpersonaldetailcustomdata WHERE userId = ` + userId,
                    `DELETE FROM userimagegallery WHERE userId = ` + userId,
                    `DELETE FROM userfamilydetail WHERE userId = ` + userId,
                    `DELETE FROM userpartnerpreferences WHERE userId = ` + userId,
                    `DELETE FROM users WHERE id = ` + userId,
                    `DELETE FROM images WHERE createdBy = ` + userId
                ];
                let result;
                for (let index = 0; index < deleteQueries.length; index++) {
                    result = yield apiHeader_1.default.query(deleteQueries[index]);
                }
                // let sql = `CALL deleteUserAccount(` + userId + `)`;
                // let result = await header.query(sql);
                if (result) {
                    yield apiHeader_1.default.commit();
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Delete User Account Successfully', result, result.length, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                // if (result && result.length >= 0) {
                //     let successResult = new ResultSuccess(200, true, 'Delete User Account Successfully', result, result.length, authorizationResult.token);
                //     return res.status(200).send(successResult);
                // } else {
                //     let successResult = new ResultSuccess(200, true, ' Successfully', [], 0, authorizationResult.token);
                //     return res.status(200).send(successResult);
                // }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getMostViewedApplicant() Exception', error, '');
        next(errorResult);
    }
});
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = 0;
        let authorizationResult;
        let distanceArray = [];
        let latestUserIds = [];
        let gender;
        const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
        // console.log(isCustomFieldEnabled);
        // console.log('unique code : ' + makeid(8));
        if (req.headers['authorization']) {
            authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                userId = currentUser ? currentUser.id : 0;
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
        let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
        let genderVisibility = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'genderVisibility'`);
        gender = genderVisibility[0].value;
        if (req.body.sortingby == 'nearestApplicant') {
            let checkSql = `SELECT u.id, addr.latitude, addr.longitude, u.isVerifyProfilePic, u.isDemoUser
            FROM users u
            LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
            LEFT JOIN userroles ur ON ur.userId = u.id
            LEFT JOIN images img ON img.id = u.imageId
            LEFT JOIN addresses addr ON addr.id = upa.addressId
            LEFT JOIN religion r ON r.id = upa.religionId
            LEFT JOIN community c ON c.id = upa.communityId
            LEFT JOIN occupation o ON o.id = upa.occupationId
            LEFT JOIN education e ON e.id = upa.educationId
            LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
            LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
            LEFT JOIN height h ON h.id = upa.heightId
            
            WHERE ur.roleId = 2 AND u.id != ` +
                userId +
                ` AND (upa.userId = u.id) AND u.id  AND
            (
                u.id NOT IN (select userBlockId from userblock where userId = ` +
                userId +
                `)  
                and u.id NOT IN (select userId from userblock where userBlockId = ` +
                userId +
                `)
                and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` +
                userId +
                `)
            )`;
            let checkResult = yield apiHeader_1.default.query(checkSql);
            if (checkResult && checkResult.length >= 0) {
                let userSql = `SELECT addr.* FROM userpersonaldetail upd INNER JOIN addresses addr ON addr.id = upd.addressId WHERE upd.userId = ` + userId;
                let userResult = yield apiHeader_1.default.query(userSql);
                for (let i = 0; i < checkResult.length; i++) {
                    let km = yield distance(userResult && userResult.length > 0 && userResult[0].latitude ? userResult[0].latitude : 21.144539, userResult && userResult.length > 0 && userResult[0].longitude ? userResult[0].longitude : 73.0942, checkResult[i].latitude ? checkResult[i].latitude : 21.144539, checkResult[i].longitude ? checkResult[i].longitude : 73.0942, 'K');
                    let distanceObj = {
                        userId: checkResult[i].id,
                        distance: parseFloat(km + '')
                    };
                    distanceArray.push(JSON.parse(JSON.stringify(distanceObj)));
                }
                distanceArray.sort((a, b) => {
                    if (a.distance > b.distance) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                });
                if (distanceArray && distanceArray.length > 0) {
                    // if (startIndex != null && fetchRecord != null) {
                    //     distanceArray = distanceArray.slice(startIndex, (startIndex + fetchRecord))
                    // }
                    latestUserIds = distanceArray.map((x) => x.userId);
                }
                if (distanceArray && distanceArray.length == 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Nearest Users Successfully', [], 0, authorizationResult ? authorizationResult.token : '');
                    return res.status(200).send(successResult);
                }
            }
            else {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Nearest Users Successfully', [], 0, authorizationResult ? authorizationResult.token : '');
                return res.status(200).send(successResult);
            }
        }
        let sql = `WITH preference_weights AS (
                      SELECT
                        MAX(CASE WHEN name = 'pAge' THEN weightage END) AS pAgeWeight,
                        MAX(CASE WHEN name = 'pHeight' THEN weightage END) AS pHeightWeight,
                        MAX(CASE WHEN name = 'pMaritalStatus' THEN weightage END) AS pMaritalStatusWeight,
                        MAX(CASE WHEN name = 'pProfileWithChildren' THEN weightage END) AS pProfileWithChildrenWeight,
                        MAX(CASE WHEN name = 'pFamilyType' THEN weightage END) AS pFamilyTypeWeight,
                        MAX(CASE WHEN name = 'pReligion' THEN weightage END) AS pReligionWeight,
                        MAX(CASE WHEN name = 'pCommunity' THEN weightage END) AS pCommunityWeight,
                        MAX(CASE WHEN name = 'pMotherTongue' THEN weightage END) AS pMotherTongueWeight,
                        MAX(CASE WHEN name = 'pHoroscopeBelief' THEN weightage END) AS pHoroscopeBeliefWeight,
                        MAX(CASE WHEN name = 'pManglikMatch' THEN weightage END) AS pManglikMatchWeight,
                        MAX(CASE WHEN name = 'pCountryLivingIn' THEN weightage END) AS pCountryLivingInWeight,
                        MAX(CASE WHEN name = 'pStateLivingIn' THEN weightage END) AS pStateLivingInWeight,
                        MAX(CASE WHEN name = 'pCityLivingIn' THEN weightage END) AS pCityLivingInWeight,
                        MAX(CASE WHEN name = 'pEducationType' THEN weightage END) AS pEducationTypeWeight,
                        MAX(CASE WHEN name = 'pEducationMedium' THEN weightage END) AS pEducationMediumWeight,
                        MAX(CASE WHEN name = 'pOccupation' THEN weightage END) AS pOccupationWeight,
                        MAX(CASE WHEN name = 'pEmploymentType' THEN weightage END) AS pEmploymentTypeWeight,
                        MAX(CASE WHEN name = 'pAnnualIncome' THEN weightage END) AS pAnnualIncomeWeight,
                        MAX(CASE WHEN name = 'pDiet' THEN weightage END) AS pDietWeight,
                        MAX(CASE WHEN name = 'pSmokingAcceptance' THEN weightage END) AS pSmokingAcceptanceWeight,
                        MAX(CASE WHEN name = 'pAlcoholAcceptance' THEN weightage END) AS pAlcoholAcceptanceWeight,
                        MAX(CASE WHEN name = 'pDisabilityAcceptance' THEN weightage END) AS pDisabilityAcceptanceWeight,
                        MAX(CASE WHEN name = 'pComplexion' THEN weightage END) AS pComplexionWeight,
                        MAX(CASE WHEN name = 'pBodyType' THEN weightage END) AS pBodyTypeWeight
                      FROM preferenceweightage
                    ),
                    disableScreen AS(
                    SELECT 
                        MAX(CASE WHEN name = 'isEnableFamilyDetails' THEN value END) AS isEnableFamilyDetails, 
                        MAX(CASE WHEN name = 'isEnableAstrologicDetails' THEN value END) AS isEnableAstrologicDetails,
                        MAX(CASE WHEN name = 'isEnableLifeStyles' THEN value END) AS isEnableLifeStyles
                        FROM systemflags
                    )
                SELECT u.id, udd.fcmtoken,u.stripeCustomerId, img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, u.isVerifyProfilePic, u.isDemoUser, upa.memberid,upa.isHideContactDetail
                        , upa.religionId, upa.communityId, upa.maritalStatusId, upa.occupationId, upa.educationId, upa.subCommunityId, upa.dietId, upa.annualIncomeId, upa.heightId, upa.birthDate
                        , upa.languages, upa.eyeColor, upa.businessName, upa.companyName, upa.employmentTypeId, upa.weight as weightId, upa.profileForId, upa.expectation, upa.aboutMe
                        ,upa.memberid, upa.anyDisability, upa.haveSpecs, upa.haveChildren, upa.noOfChildren, upa.bloodGroup, upa.complexion, upa.bodyType, upa.familyType, upa.motherTongue
                        , upa.currentAddressId, upa.nativePlace, upa.citizenship, upa.visaStatus, upa.designation, upa.educationTypeId, upa.educationMediumId, upa.drinking, upa.smoking
                        , upa.willingToGoAbroad, upa.areYouWorking,upa.addressId ,edt.name as educationType, edme.name as educationMedium
                        , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                        , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                        , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y')+0 AS age,
                         JSON_OBJECT(
                                 'id',addr.id,
								'addressLine1', addr.addressLine1, 
								'addressLine2', addr.addressLine2, 
								'pincode', addr.pincode, 
								'cityId', addr.cityId, 
								'districtId', addr.districtId, 
								'stateId', addr.stateId, 
								'countryId', addr.countryId,
								'cityName', addr.cityName,
								'stateName', addr.stateName,
								'countryName', addr.countryName,
                                 'residentialStatus',addr.residentialStatus,
                                 'latitude',addr.latitude,
                                 'longitude',addr.longitude
                         ) AS permanentAddress,
                         JSON_OBJECT(
                                 'id', cuaddr.id,
								'addressLine1', cuaddr.addressLine1, 
								'addressLine2', cuaddr.addressLine2, 
								'pincode', cuaddr.pincode, 
								'cityId', cuaddr.cityId, 
								'districtId', cuaddr.districtId, 
								'stateId', cuaddr.stateId, 
								'countryId', cuaddr.countryId,
								'cityName', cuaddr.cityName,
								'stateName', cuaddr.stateName,
								'countryName', cuaddr.countryName,
                                 'residentialStatus',cuaddr.residentialStatus,
                                 'latitude',cuaddr.latitude,
                                 'longitude',cuaddr.longitude
                         ) AS currentAddress,
                         (SELECT JSON_ARRAYAGG(JSON_OBJECT(
								'id', ufdfd.id,
								'userId', ufdfd.userId,
								'name', ufdfd.name,
								'memberType', ufdfd.memberType,
								'memberSubType', ufdfd.memberSubType,
								'educationId', ufdfd.educationId,
								'occupationId', ufdfd.occupationId,
								'maritalStatusId', ufdfd.maritalStatusId,
								'isAlive', ufdfd.isAlive
						)) 
						 FROM userfamilydetail ufdfd
						 WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                         (SELECT JSON_OBJECT(
                                 'id',ufdf.id, 
                                 'userId',ufdf.userId, 
                                 'name',ufdf.name, 
                                 'memberType',ufdf.memberType, 
                                 'memberSubType',ufdf.memberSubType, 
                                 'educationId',ufdf.educationId, 
                                 'occupationId',ufdf.occupationId, 
                                 'maritalStatusId',ufdf.maritalStatusId, 
                                 'isAlive',ufdf.isAlive
						) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1)  AS fatherDetails,
                           (SELECT JSON_OBJECT(
                                 'id',ufdm.id, 
                                 'userId',ufdm.userId, 
                                 'name',ufdm.name, 
                                 'memberType',ufdm.memberType, 
                                 'memberSubType',ufdm.memberSubType, 
                                 'educationId',ufdm.educationId, 
                                 'occupationId',ufdm.occupationId, 
                                 'maritalStatusId',ufdm.maritalStatusId, 
                                 'isAlive',ufdm.isAlive
						) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1)  AS motherDetails,
                        uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                        upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                        upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                        upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight,

                      ROUND( (( 
                            -- #1 Age 
                                (case WHEN ((uppu.pFromAge  <=(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y') + 0) ) && ((DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y') + 0)<= uppu.pToAge )) THEN 1 ELSE 0 END) * COALESCE(pw.pAgeWeight, 1) +
		                    -- #2 Height
                                (case WHEN ((uppu.pFromHeight <= h.name) && ( h.name <= uppu.pToHeight)) THEN 1 ELSE 0 END) * COALESCE(pw.pHeightWeight, 1) +
                            -- #3 Marital Status
                                (CASE WHEN (FIND_IN_SET (upa.maritalStatusId, (uppu.pMaritalStatusId)) > 0)  THEN 1 
                                WHEN uppu.pMaritalStatusId = 0 THEN 0.5
                                ELSE 0 END) * COALESCE(pw.pMaritalStatusWeight, 1) +
		                    -- #4 Profile with children
                                (case 
                                WHEN (uppu.pProfileWithChildren = 1) THEN
		            			    CASE WHEN (upa.haveChildren = 1 || upa.haveChildren = 2 ) THEN 1 ElSE 0 END
		            		            WHEN (uppu.pProfileWithChildren = 2) THEN CASE WHEN (upa.haveChildren = 3) THEN 1 ElSE 0 END
                                        WHEN ((uppu.pProfileWithChildren) = 0 ) THEN 0.5
		            	            ELSE 0 END) * COALESCE(pw.pProfileWithChildrenWeight, 1)  +
		                    -- #5 Family type
                                (case WHEN(sys.isEnableFamilyDetails = true) THEN
                                    CASE
                                        WHEN (upa.familyType = uppu.pFamilyType)  THEN 1 
                                        WHEN uppu.pFamilyType = 0 THEN 0.5
                                     ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pFamilyTypeWeight, 1) +
		                    -- #6 Religion 
                                (CASE 
		            		        WHEN (FIND_IN_SET (upa.religionId, (uppu.pReligionId)) > 0)  THEN 1 
                                    WHEN uppu.pReligionId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pReligionWeight, 1) +
		                    --  #7 Community
                                (CASE 
		            		        WHEN (FIND_IN_SET (upa.communityId, (uppu.pCommunityId)) > 0)  THEN 1 
                                    WHEN uppu.pCommunityId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pCommunityWeight, 1) +
		                    --  #8 Mother tongue
                                (CASE 
		            		        WHEN (FIND_IN_SET (upa.motherTongue, (uppu.pMotherTongue)) > 0)  THEN 1 
		            	            ELSE 0 END) * COALESCE(pw.pMotherTongueWeight, 1) +
		                    --  #9 Horoscope Belief
                                (CASE WHEN(sys.isEnableAstrologicDetails = true) THEN
                                    CASE
		            		            WHEN (uatd.horoscopeBelief = uppu.pHoroscopeBelief )  THEN 1 
                                        WHEN uppu.pHoroscopeBelief = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pHoroscopeBeliefWeight, 1) +
                            --  #10  Manglik Match
                                (CASE WHEN(sys.isEnableAstrologicDetails = true) THEN
                                CASE
		            		            WHEN (uatd.manglik = uppu.pManglikMatch)  THEN 1 
                                        WHEN uppu.pManglikMatch = 0 THEN 0.5
                                ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pManglikMatchWeight, 1) +
		                    -- #11 Country
		            	        (case 
                                        WHEN (FIND_IN_SET (addr.countryId, uppu.pCountryLivingInId) > 0 )  THEN 1 
                                        WHEN uppu.pCountryLivingInId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pCountryLivingInWeight, 1) +
                            -- #12 State
		            	        (case 
                                    WHEN (FIND_IN_SET (addr.stateId, uppu.pStateLivingInId) > 0 )  THEN 1 
                                    WHEN uppu.pStateLivingInId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pStateLivingInWeight, 1) +
                            -- #13 City
		            	        (case 
                                    WHEN (FIND_IN_SET (addr.cityId, uppu.pCityLivingInId) > 0 )  THEN 1
                                    WHEN uppu.pCityLivingInId = 0 THEN 0.5 
		            	        ELSE 0 END) * COALESCE(pw.pCityLivingInWeight, 1) +
                            -- #14 Education Type
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.educationTypeId, uppu.pEducationTypeId) > 0 )  THEN 1 
                                    WHEN uppu.pEducationTypeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEducationTypeWeight, 1) +
                            -- #15 Education Medium
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.educationMediumId, uppu.pEducationMediumId) > 0 )  THEN 1 
                                    WHEN uppu.pEducationMediumId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEducationMediumWeight, 1) +
                            -- #16 Occupation
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.occupationId, uppu.pOccupationId) > 0 )  THEN 1 
                                    WHEN uppu.pOccupationId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pOccupationWeight, 1) +
                            -- #17 Employment Type
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.employmentTypeId, uppu.pEmploymentTypeId) > 0 )  THEN 1 
                                    WHEN uppu.pEmploymentTypeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEmploymentTypeWeight, 1) +
                            -- #18 Annual Income
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.annualIncomeId, uppu.pAnnualIncomeId) > 0 )  THEN 1 
                                    WHEN uppu.pAnnualIncomeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pAnnualIncomeWeight, 1) +
                            -- #19 Diet
		            	        (case WHEN(sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (FIND_IN_SET (upa.dietId, uppu.pDietId) > 0 )  THEN 1 
                                        WHEN uppu.pDietId = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pDietWeight, 1) +
                            -- #20 Smoking
		            	        (case WHEN(sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (upa.smoking = uppu.pSmokingAcceptance )  THEN 1 
                                        WHEN uppu.pSmokingAcceptance = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * (COALESCE(pw.pSmokingAcceptanceWeight, 1) +
                            -- #21 Alcohol
		            	        (case WHEN (sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (upa.drinking = uppu.pAlcoholAcceptance )  THEN 1 
                                        WHEN uppu.pAlcoholAcceptance = 0 THEN 0.5
                                    ELSE 0 END 
		            	        ELSE 1 END) * COALESCE(pw.pAlcoholAcceptanceWeight, 1) +
                            -- #22 Disability Acceptance
		            	        (case 
                                        WHEN (upa.anyDisability = uppu.pDisabilityAcceptance )  THEN 1 
                                        WHEN uppu.pDisabilityAcceptance = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pDisabilityAcceptanceWeight, 1) +
                            --  #23 Complexion
                                (CASE 
		            		            WHEN (FIND_IN_SET (upa.complexion, (uppu.pComplexion)) > 0)  THEN 1 
                                        WHEN uppu.pComplexion = 'Open For All' THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pComplexionWeight, 1) +
                            --  #24 Body Type
                                (CASE 
		            		            WHEN (FIND_IN_SET (upa.bodyType, (uppu.pBodyType)) > 0)  THEN 1 
                                        WHEN uppu.pBodyType = 'Open For All' THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pBodyTypeWeight, 1)
                            ) )/ (
                                COALESCE(pw.pAgeWeight, 1) +
                                COALESCE(pw.pHeightWeight, 1)+
                                COALESCE(pw.pMaritalStatusWeight, 1) +
                                COALESCE(pw.pProfileWithChildrenWeight, 1) +
                                COALESCE(pw.pFamilyTypeWeight, 1) +
                                COALESCE(pw.pReligionWeight, 1) +
                                COALESCE(pw.pCommunityWeight, 1) +
                                COALESCE(pw.pMotherTongueWeight, 1) +
                                COALESCE(pw.pHoroscopeBeliefWeight, 1) +
                                COALESCE(pw.pManglikMatchWeight, 1) +
                                COALESCE(pw.pCountryLivingInWeight, 1) +
                                COALESCE(pw.pStateLivingInWeight, 1) +
                                COALESCE(pw.pCityLivingInWeight, 1) +
                                COALESCE(pw.pEducationTypeWeight, 1) +
                                COALESCE(pw.pEducationMediumWeight, 1) +
                                COALESCE(pw.pOccupationWeight, 1) +
                                COALESCE(pw.pEmploymentTypeWeight, 1) +
                                COALESCE(pw.pAnnualIncomeWeight, 1) +
                                COALESCE(pw.pSmokingAcceptanceWeight, 1) +
                                COALESCE(pw.pAlcoholAcceptanceWeight, 1) +
                                COALESCE(pw.pDisabilityAcceptanceWeight, 1) +
                                COALESCE(pw.pComplexionWeight, 1) +
                                COALESCE(pw.pBodyTypeWeight, 1) 
                        ))
                        * 100 ) AS matchingPercentage 
                        , IF((select COUNT(id) from userproposals where (userId = ` +
            userId +
            ` AND proposalUserId = u.id) OR (proposalUserId = ` +
            userId +
            ` AND userId = u.id)) > 0,true,false) as isProposed
                        , IF((select COUNT(id) from userproposals where (userId = ` +
            userId +
            ` AND proposalUserId = u.id) ) > 0,true,false) as isProposalReceived
                        , IF((select COUNT(id) from userproposals where (proposalUserId = ` +
            userId +
            ` AND userId = u.id)) > 0,true,false) as isProposalSent
                        ,  IF((select COUNT(id) from userproposals where ((proposalUserId = u.id AND userId = ` +
            userId +
            `) OR (userId = u.id AND proposalUserId = ` +
            userId +
            `)) AND hascancelled = 1) > 0,true,false) as hascancelled
                        , (select status from userproposals where ((proposalUserId = u.id AND userId = ` +
            userId +
            `) OR (userId = u.id AND proposalUserId = ` +
            userId +
            `)) AND hascancelled = 0 ) as proposalStatus
                        , u.id IN (select favUserId from userfavourites where userId = ` +
            userId +
            `) as isFavourite `;
        if (req.body.sortingby == 'mostViewed') {
            sql += `,(select count(id) from userviewprofilehistories where  userId = u.id ) as totalView`;
        }
        sql +=
            ` FROM users u
            LEFT JOIN userdevicedetail udd ON udd.userId = u.id
            LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
            LEFT JOIN userroles ur ON ur.userId = u.id
            LEFT JOIN images img ON img.id = u.imageId
            LEFT JOIN religion r ON r.id = upa.religionId
            LEFT JOIN community c ON c.id = upa.communityId
            LEFT JOIN occupation o ON o.id = upa.occupationId
            LEFT JOIN education e ON e.id = upa.educationId
            LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
            LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
            LEFT JOIN addresses addr ON addr.id = upa.addressId
            LEFT JOIN cities cit ON addr.cityId = cit.id
            LEFT JOIN districts ds ON addr.districtId = ds.id
            LEFT JOIN state st ON addr.stateId = st.id
            LEFT JOIN countries cou ON addr.countryId = cou.id
            LEFT JOIN height h ON h.id = upa.heightId            
            LEFT JOIN employmenttype em ON em.id = upa.employmenttypeId
            LEFT JOIN userpersonaldetailcustomdata updcd ON updcd.userId = u.id
            LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
            LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
            LEFT JOIN addresses cuaddr ON cuaddr.id = upa.currentAddressId
            LEFT JOIN weight w ON w.id = upa.weight
            LEFT JOIN educationmedium edme ON edme.id = upa.educationMediumId
            LEFT JOIN educationtype edt ON edt.id = upa.educationTypeId
            LEFT JOIN userpartnerpreferences uppu ON uppu.userId = ` +
                userId +
                `
            LEFT JOIN users loginU ON loginU.id = ` +
                userId +
                `
            CROSS JOIN preference_weights pw
            CROSS JOIN disableScreen sys

            WHERE u.isProfileCompleted = 1 AND ur.roleId = 2 AND u.id != ` +
                userId +
                ` 
            AND u.id NOT IN (select userId from userproposals where status = 1 and proposalUserId = ` +
                userId +
                `) 
        AND u.id NOT IN (select proposalUserId from userproposals where status = 1 and userId = ` +
                userId +
                `)`;
        if (userId > 0 && gender == 'Same') {
            sql += ` AND LOWER(u.gender) = LOWER(loginU.gender)`;
        }
        else if (userId > 0 && gender == 'Opposite') {
            sql += ` AND LOWER(u.gender) != LOWER(loginU.gender)`;
        }
        if (req.body.sortingby == 'nearestApplicant') {
            sql += `AND u.id IN(` + latestUserIds.toString() + `)`;
        }
        sql +=
            ` AND (upa.userId = u.id) AND u.id  AND
            (
                u.id NOT IN (select userBlockId from userblock where userId = ` +
                userId +
                `)  
                and u.id NOT IN (select userId from userblock where userBlockId = ` +
                userId +
                `)
                and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` +
                userId +
                `)
            )`;
        if (req.body.searchString) {
            sql +=
                ` AND (u.firstName LIKE '%` +
                    req.body.searchString +
                    `%' OR u.lastName LIKE '%` +
                    req.body.searchString +
                    `%' OR u.middleName LIKE '%` +
                    req.body.searchString +
                    `%' 
                OR u.contactNo LIKE '%` +
                    req.body.searchString +
                    `%' OR u.email LIKE '%` +
                    req.body.searchString +
                    `%' OR u.gender LIKE '%` +
                    req.body.searchString +
                    `%'
                OR pf.name LIKE '%` +
                    req.body.searchString +
                    `%')`;
        }
        if (req.body.gender) {
            sql += ` AND u.gender = '` + req.body.gender + `'`;
        }
        if (req.body.occupationId && req.body.occupationId.length) {
            sql += ` AND o.id in (` + req.body.occupationId.toString() + `)`;
        }
        if (req.body.educationId && req.body.educationId.length) {
            sql += ` AND e.id in( ` + req.body.educationId.toString() + `)`;
        }
        if (req.body.maritalStatusId && req.body.maritalStatusId.length) {
            sql += ` AND upa.maritalStatusId in(` + req.body.maritalStatusId.toString() + `)`;
        }
        if (req.body.height1 && req.body.height2) {
            sql += ` AND h.name BETWEEN ` + req.body.height1 + ` AND ` + req.body.height2 + ``;
        }
        if (req.body.cityName) {
            sql += ` AND (addr.cityName LIKE '%` + req.body.cityName + `%')`;
        }
        if (req.body.stateId) {
            sql += ` AND st.id = ` + req.body.stateId;
        }
        if (req.body.countryIds) {
            sql += ` AND cou.id IN` + req.body.countryIds.tostring();
        }
        if (req.body.stateIds) {
            sql += ` AND st.id IN` + req.body.stateIds.tostring();
        }
        if (req.body.districtIds) {
            sql += ` AND ds.id IN` + req.body.districtIds.tostring();
        }
        if (req.body.cityIds && req.body.cityIds.length > 0) {
            sql += ` AND cit.id IN(` + req.body.cityIds.toString() + `)`;
        }
        if (req.body.age1 && req.body.age2) {
            sql += ` AND DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0 BETWEEN ` + req.body.age1 + ` AND ` + req.body.age2 + ``;
        }
        if (isCustomFieldEnabled && req.body.customFields != null && req.body.customFields.length > 0) {
            sql += ` AND u.id IN(Select userId from userpersonaldetailcustomdata WHERE `;
            for (let ind = 0; ind < req.body.customFields.length; ind++) {
                if (req.body.customFields[ind].value && req.body.customFields[ind].value.length > 0)
                    sql += `(`;
                for (let val = 0; val < req.body.customFields[ind].value.length; val++) {
                    sql += `` + req.body.customFields[ind].mappedFieldName + ` LIKE '` + req.body.customFields[ind].value[val] + `'`;
                    if (req.body.customFields[ind].valueTypeId == 10) {
                        sql +=
                            ` OR ` +
                                req.body.customFields[ind].mappedFieldName +
                                ` LIKE '%` +
                                req.body.customFields[ind].value[val] +
                                `;%' OR ` +
                                req.body.customFields[ind].mappedFieldName +
                                ` LIKE '%;` +
                                req.body.customFields[ind].value[val] +
                                `;%' OR ` +
                                req.body.customFields[ind].mappedFieldName +
                                ` LIKE '%;` +
                                req.body.customFields[ind].value[val] +
                                `%'`;
                    }
                    if (val < req.body.customFields[ind].value.length - 1) {
                        sql += ` OR `;
                    }
                }
                sql += `)`;
                if (ind < req.body.customFields.length - 1) {
                    sql += ` AND `;
                }
            }
            sql += `)`;
        }
        if (req.body.sortingby == 'mostViewed') {
            sql += `ORDER BY totalView DESC,id`;
        }
        if (req.body.sortingby == 'latestProfile') {
            sql += `ORDER BY u.createdDate desc`;
        }
        if (!sql.trim().includes(`ORDER`)) {
            sql += ` ORDER BY matchingPercentage desc`;
        }
        //sql +=` order by u.createdDate desc`
        if (startIndex != null && fetchRecord != null) {
            sql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
        }
        console.log(sql);
        let result;
        if (req.body.sortingby == 'nearestApplicant') {
            if (distanceArray && distanceArray.length > 0) {
                result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    // const mappedArray = result.map(( id : any  ) => {
                    //     const matchedItem = distanceArray.find((item: any) => item.userId === id);
                    //     return { ...result, distance };
                    // });
                    // result = mappedArray;
                    result.forEach((obj) => {
                        let matchingDistance = distanceArray.find((distanceObj) => distanceObj.userId === obj.id);
                        if (matchingDistance) {
                            obj.distance = matchingDistance.distance;
                        }
                    });
                }
            }
        }
        else {
            result = yield apiHeader_1.default.query(sql);
        }
        if (result) {
            let isVerifyProfile = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'isUserProfilePicApprove'`);
            for (let i = 0; i < result.length; i++) {
                // result[i].isVerifyProfilePic = true;
                if (isVerifyProfile && isVerifyProfile.length > 0) {
                    if (isVerifyProfile[0].value == true) {
                        if (!result[i].isVerifyProfilePic) {
                            result[i].imageUrl = null;
                            result[i].isVerifyProfilePic = false;
                        }
                        else {
                            result[i].isVerifyProfilePic = true;
                        }
                    }
                    else {
                        result[i].isVerifyProfilePic = true;
                    }
                }
                else {
                    result[i].isVerifyProfilePic = true;
                }
                // let dataSql = `IF((select COUNT(id) from userproposals where (userId = ` + userId + ` AND proposalUserId = ` + result[i].id + `) ) > 0,true,false) as isProposalSent
                // , IF((select COUNT(id) from userproposals where (proposalUserId = ` + userId + ` AND userId = ` + result[i].id + `)) > 0,true,false) as isProposalReceived
                // ,  IF((select COUNT(id) from userproposals where (proposalUserId = ` + result[i].id + `) AND hascancelled = 1) > 0,true,false) as hascancelled
                // , (select status from userproposals where (proposalUserId = ` + result[i].id + ` AND userId = ` + userId + `) AND hascancelled = 0) as proposalStatus`;
                // let dataSqlResult = await header.query(dataSql);
                result[i].isVerifiedProfile = false;
                let isVerified = true;
                let docVerifiedSql = `SELECT * FROM userdocument WHERE userId =` + result[i].id;
                let docVerifiedResult = yield apiHeader_1.default.query(docVerifiedSql);
                if (docVerifiedResult && docVerifiedResult.length > 0) {
                    for (let j = 0; j < docVerifiedResult.length; j++) {
                        if (docVerifiedResult[j].isRequired && !docVerifiedResult[j].isVerified) {
                            isVerified = false;
                        }
                    }
                }
                else {
                    isVerified = false;
                }
                result[i].isVerifiedProfile = isVerified;
                // if (result[i].isVerifyProfilePic) {
                //     result[i].isVerifyProfilePic = true;
                // } else {
                //     result[i].isVerifyProfilePic = false;
                // }
                // region to get user personal custom data
                let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(result[i].id);
                if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                    // console.log(_customFieldDataResult);
                    result[i].customFields = _customFieldDataResult;
                }
                for (let i = 0; i < result.length; i++) {
                    let userDetailResponse = yield customFields_1.default.getUserData(result[i]);
                    result[i] = Object.assign(Object.assign({}, result[i]), userDetailResponse);
                }
            }
            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Users Successfully', result, result.length, authorizationResult ? authorizationResult.token : '');
            return res.status(200).send(successResult);
        }
        else {
            let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
            next(errorResult);
        }
        // } else {
        //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
        //     next(errorResult);
        // }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getUsers() Exception', error, '');
        next(errorResult);
    }
});
const completeUserProfileV2 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Updating Users');
        // let requiredFields = ['id', 'screenNumber'];
        // let validationResult = header.validateRequiredFields(req, requiredFields);
        // if (validationResult && validationResult.statusCode == 200) {
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if ((authorizationResult === null || authorizationResult === void 0 ? void 0 : authorizationResult.statusCode) == 200) {
            yield apiHeader_1.default.beginTransaction();
            let currentUser = authorizationResult === null || authorizationResult === void 0 ? void 0 : authorizationResult.currentUser;
            let userId = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id;
            let screenNumber = req.body.screenNumber;
            let sql;
            let result;
            let updatePara;
            let completedPercentage;
            let updatedPercentage;
            let personalDetailId;
            let percentageFlag = false;
            const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
            req.body.isHideBirthTime = req.body.isHideBirthTime == 1 ? true : false;
            let user = yield apiHeader_1.default.query(`SELECT * FROM users WHERE id = ` + userId + ``);
            let checkDetailResult;
            let checkDetailSql = `SELECT * FROM userpersonaldetail WHERE userId = ` + userId;
            checkDetailResult = yield apiHeader_1.default.query(checkDetailSql);
            if (checkDetailResult && checkDetailResult.length > 0) {
                personalDetailId = checkDetailResult[0].id;
            }
            else {
                // let memberId = makeid(8).toUpperCase();
                let memberId = (yield makememberid(10)).toUpperCase();
                let insertSql = `INSERT INTO userpersonaldetail (userId, memberid) VALUES (` + userId + `,'` + memberId + `')`;
                let insertResult = yield apiHeader_1.default.query(insertSql);
                personalDetailId = insertResult.insertId;
                let checkDetailSql = `SELECT * FROM userpersonaldetail WHERE userId = ` + userId;
                checkDetailResult = yield apiHeader_1.default.query(checkDetailSql);
            }
            let screenDetailSql = yield apiHeader_1.default.query(`SELECT * FROM registrationscreens WHERE screenDisplayNo = ` + screenNumber);
            switch (screenNumber) {
                // Profile For
                case 1: {
                    let screen1RequiredFields = ['id', 'screenNumber', 'gender', 'profileForId'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen1RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        let updateUserSql = `UPDATE users SET gender = "${req.body.gender}", isDemoUser = 0 WHERE id = ${userId}`;
                        let updateUserResult = yield apiHeader_1.default.query(updateUserSql);
                        updatePara = `profileForId = ` + req.body.profileForId + ` `;
                        if (!checkDetailResult[0].profileForId)
                            percentageFlag = true;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Basic Details
                case 2: {
                    let screen2RequiredFields = ['id', 'screenNumber', 'firstName', 'lastName', 'contactNo', 'email'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen2RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        req.body.contactNo = req.body.contactNo ? req.body.contactNo : '';
                        req.body.middleName = req.body.middleName ? req.body.middleName : '';
                        req.body.countryName = req.body.countryName ? req.body.countryName : '';
                        req.body.stateName = req.body.stateName ? req.body.stateName : '';
                        req.body.cityName = req.body.cityName ? req.body.cityName : '';
                        req.body.aboutMe = req.body.aboutMe ? req.body.aboutMe : '';
                        req.body.expectation = req.body.expectation ? req.body.expectation : '';
                        req.body.eyeColor = req.body.eyeColor ? req.body.eyeColor : '';
                        let birthDate = req.body.birthDate ? new Date(req.body.birthDate) : '';
                        let bDate = new Date(birthDate).getFullYear().toString() +
                            '-' +
                            ('0' + (new Date(birthDate).getMonth() + 1)).slice(-2) +
                            '-' +
                            ('0' + new Date(birthDate).getDate()).slice(-2) +
                            ' ' +
                            ('0' + new Date(birthDate).getHours()).slice(-2) +
                            ':' +
                            ('0' + new Date(birthDate).getMinutes()).slice(-2) +
                            ':' +
                            ('0' + new Date(birthDate).getSeconds()).slice(-2);
                        req.body.isHideContactDetail = req.body.isHideContactDetail == 0 || req.body.isHideContactDetail == false ? false : true;
                        let checkMail = yield apiHeader_1.default.query(`SELECT * FROM users WHERE email = '` + req.body.email + `' AND id != ` + userId + ``);
                        if (checkMail && checkMail.length > 0) {
                            let errorResult = new resulterror_1.ResultError(203, true, 'Email Already Exist', new Error('Email Already Exist'), '');
                            next(errorResult);
                        }
                        else {
                            let updateUserSql = `UPDATE users SET firstName = '` +
                                req.body.firstName +
                                `', middleName =  ` +
                                (req.body.middleName ? `'` + req.body.middleName + `'` : null) +
                                `, lastName = '` +
                                req.body.lastName +
                                `', contactNo = '` +
                                req.body.contactNo +
                                `',email = '` +
                                req.body.email +
                                `'  WHERE id = ` +
                                userId +
                                ``;
                            let updateUserResult = yield apiHeader_1.default.query(updateUserSql);
                            updatePara = ` birthDate = '` + bDate + `',isHideContactDetail = ` + req.body.isHideContactDetail + ` `;
                            if (!checkDetailResult[0].birthDate)
                                percentageFlag = true;
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Personal Details
                case 3: {
                    let screen3RequiredFields = [
                        'id',
                        'screenNumber',
                        'maritalStatusId',
                        'heightId',
                        'weightId',
                        'haveSpecs',
                        'anyDisability',
                        'bloodGroup',
                        'complexion',
                        'bodyType',
                        'eyeColor',
                        'languages'
                    ];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen3RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        updatePara =
                            ` maritalStatusId = ` +
                                req.body.maritalStatusId +
                                `, haveChildren = ` +
                                (req.body.haveChildren ? req.body.haveChildren : null) +
                                `,noOfChildren = ` +
                                req.body.noOfChildren +
                                `,heightId = ` +
                                req.body.heightId +
                                `, weight = ` +
                                req.body.weightId +
                                `, haveSpecs= ` +
                                req.body.haveSpecs +
                                `, anyDisability = ` +
                                req.body.anyDisability +
                                `,bloodGroup = '` +
                                req.body.bloodGroup +
                                `',complexion = '` +
                                req.body.complexion +
                                `',bodyType = '` +
                                req.body.bodyType +
                                `',  eyeColor = '` +
                                req.body.eyeColor +
                                `', languages = '` +
                                req.body.languages +
                                `',aboutMe = ` +
                                (req.body.aboutMe ? `'` + req.body.aboutMe + `'` : null) +
                                ` `;
                        if (!checkDetailResult[0].maritalStatusId)
                            percentageFlag = true;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Community Details
                case 4: {
                    let screen4RequiredFields = ['id', 'screenNumber', 'religionId', 'communityId', 'motherTongue'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen4RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        updatePara =
                            ` religionId = ` +
                                req.body.religionId +
                                ` ,communityId = ` +
                                req.body.communityId +
                                `, subCommunityId = ` +
                                (req.body.subCommunityId ? req.body.subCommunityId : null) +
                                `, motherTongue = '` +
                                req.body.motherTongue +
                                `' `;
                        if (!checkDetailResult[0].religionId)
                            percentageFlag = true;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Family Details
                case 5: {
                    let screen5RequiredFields = ['id', 'screenNumber', 'familyType', 'fatherDetails', 'motherDetails'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen5RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        if (req.body.fatherDetails) {
                            let fatherDetail = req.body.fatherDetails;
                            if (fatherDetail.id) {
                                let updatetSql = `UPDATE userfamilydetail  SET userId = ` +
                                    userId +
                                    `, name= '` +
                                    fatherDetail.name +
                                    `', memberType =  '` +
                                    fatherDetail.memberType +
                                    `', memberSubType = '` +
                                    fatherDetail.memberSubType +
                                    `', educationId = ` +
                                    fatherDetail.educationId +
                                    ` , occupationId = ` +
                                    fatherDetail.occupationId +
                                    `, 
                                        maritalStatusId = ` +
                                    fatherDetail.maritalStatusId +
                                    `, isAlive = ` +
                                    fatherDetail.isAlive +
                                    `, modifiedBy = ` +
                                    userId +
                                    ` , modifiedDate = CURRENT_TIMESTAMP() WHERE id =` +
                                    fatherDetail.id +
                                    ``;
                                let updateResult = yield apiHeader_1.default.query(updatetSql);
                            }
                            else {
                                let insertsql = `INSERT INTO userfamilydetail  (userId, name, memberType, memberSubType, educationId, occupationId, maritalStatusId, isAlive, createdBy, modifiedBy ) VALUES (` +
                                    userId +
                                    `, '` +
                                    fatherDetail.name +
                                    `', '` +
                                    fatherDetail.memberType +
                                    `','` +
                                    fatherDetail.memberSubType +
                                    `',` +
                                    fatherDetail.educationId +
                                    `,` +
                                    fatherDetail.occupationId +
                                    `,` +
                                    fatherDetail.maritalStatusId +
                                    `,` +
                                    fatherDetail.isAlive +
                                    `, ` +
                                    userId +
                                    `,` +
                                    userId +
                                    `) `;
                                let isertresult = yield apiHeader_1.default.query(insertsql);
                                percentageFlag = true;
                            }
                        }
                        if (req.body.motherDetails) {
                            let motherDetail = req.body.motherDetails;
                            if (motherDetail.id) {
                                let updatetSql = `UPDATE userfamilydetail  SET userId = ` +
                                    userId +
                                    `, name= '` +
                                    motherDetail.name +
                                    `', memberType =  '` +
                                    motherDetail.memberType +
                                    `', memberSubType = '` +
                                    motherDetail.memberSubType +
                                    `', educationId = ` +
                                    motherDetail.educationId +
                                    ` , occupationId = ` +
                                    motherDetail.occupationId +
                                    `, 
                                        maritalStatusId = ` +
                                    motherDetail.maritalStatusId +
                                    `, isAlive = ` +
                                    motherDetail.isAlive +
                                    `, modifiedBy = ` +
                                    userId +
                                    ` , modifiedDate = CURRENT_TIMESTAMP() WHERE id =` +
                                    motherDetail.id +
                                    ``;
                                let updateResult = yield apiHeader_1.default.query(updatetSql);
                            }
                            else {
                                let insertsql = `INSERT INTO userfamilydetail  (userId, name, memberType, memberSubType, educationId, occupationId, maritalStatusId, isAlive, createdBy, modifiedBy ) VALUES (` +
                                    userId +
                                    `, '` +
                                    motherDetail.name +
                                    `', '` +
                                    motherDetail.memberType +
                                    `','` +
                                    motherDetail.memberSubType +
                                    `',` +
                                    motherDetail.educationId +
                                    `,` +
                                    motherDetail.occupationId +
                                    `,` +
                                    motherDetail.maritalStatusId +
                                    `,` +
                                    motherDetail.isAlive +
                                    `, ` +
                                    userId +
                                    `,` +
                                    userId +
                                    `) `;
                                let isertresult = yield apiHeader_1.default.query(insertsql);
                                percentageFlag = true;
                            }
                        }
                        if (req.body.familyDetail && req.body.familyDetail.length > 0) {
                            for (let detail of req.body.familyDetail) {
                                if (detail.id) {
                                    let updatetSql = `UPDATE userfamilydetail  SET userId = ` +
                                        userId +
                                        `, name= '` +
                                        detail.name +
                                        `', memberType =  '` +
                                        detail.memberType +
                                        `', memberSubType = '` +
                                        detail.memberSubType +
                                        `', educationId = ` +
                                        detail.educationId +
                                        ` , occupationId = ` +
                                        detail.occupationId +
                                        `, 
                                        maritalStatusId = ` +
                                        detail.maritalStatusId +
                                        `, isAlive = ` +
                                        detail.isAlive +
                                        `, modifiedBy = ` +
                                        userId +
                                        ` , modifiedDate = CURRENT_TIMESTAMP() WHERE id =` +
                                        detail.id +
                                        ``;
                                    let updateResult = yield apiHeader_1.default.query(updatetSql);
                                }
                                else {
                                    let insertsql = `INSERT INTO userfamilydetail  (userId, name, memberType, memberSubType, educationId, occupationId, maritalStatusId, isAlive, createdBy, modifiedBy ) VALUES (` +
                                        userId +
                                        `, '` +
                                        detail.name +
                                        `', '` +
                                        detail.memberType +
                                        `','` +
                                        detail.memberSubType +
                                        `',` +
                                        detail.educationId +
                                        `,` +
                                        detail.occupationId +
                                        `,` +
                                        detail.maritalStatusId +
                                        `,` +
                                        detail.isAlive +
                                        `, ` +
                                        userId +
                                        `,` +
                                        userId +
                                        `) `;
                                    let isertresult = yield apiHeader_1.default.query(insertsql);
                                }
                            }
                        }
                        updatePara = ` familyType = '` + req.body.familyType + `'`;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Living Status
                case 6: {
                    let screen6RequiredFields = ['id', 'screenNumber', 'permanentAddress', 'currentAddress', 'nativePlace', 'willingToGoAbroad', 'citizenship', 'visaStatus'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen6RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        updatePara =
                            `nativePlace = '` +
                                req.body.nativePlace +
                                `',  willingToGoAbroad = ` +
                                req.body.willingToGoAbroad +
                                `, citizenship = '` +
                                req.body.citizenship +
                                `', visaStatus = '` +
                                req.body.visaStatus +
                                `'`;
                        let p_add = req.body.permanentAddress;
                        let addressResult;
                        if (checkDetailResult[0].addressId) {
                            let updatePermanentAddress = `UPDATE addresses SET addressLine1 = '` +
                                p_add.addressLine1 +
                                `', addressLine2 = '` +
                                p_add.addressLine2 +
                                `', pincode = '` +
                                p_add.pincode +
                                `', cityId = ` +
                                (p_add.cityId ? p_add.cityId : null) +
                                `, districtId = ` +
                                (p_add.districtId ? p_add.districtId : null) +
                                `, stateId = ` +
                                (p_add.stateId ? p_add.stateId : null) +
                                `, countryId = ` +
                                (p_add.countryId ? p_add.countryId : null) +
                                `, countryName= '` +
                                p_add.countryName +
                                `', 
                                                            stateName = '` +
                                p_add.stateName +
                                `', cityName ='` +
                                p_add.cityName +
                                `' , latitude= ` +
                                p_add.latitude +
                                `, longitude =  ` +
                                p_add.longitude +
                                `
                                                            , modifiedDate = CURRENT_TIMESTAMP() , modifiedBy= ` +
                                userId +
                                `, residentialStatus='` +
                                p_add.residentialStatus +
                                `' WHERE id = ` +
                                checkDetailResult[0].addressId +
                                ``;
                            addressResult = yield apiHeader_1.default.query(updatePermanentAddress);
                        }
                        else {
                            let insertPermanentAddress = `INSERT INTO addresses(addressLine1, addressLine2, pincode, cityId, districtId, stateId, countryId, countryName, stateName, cityName, latitude, longitude
                                                        , createdBy, modifiedBy, residentialStatus) VALUES('` +
                                p_add.addressLine1 +
                                `','` +
                                p_add.addressLine2 +
                                `','` +
                                p_add.pincode +
                                `', ` +
                                (p_add.cityId ? p_add.cityId : null) +
                                `
                                                        , ` +
                                (p_add.districtId ? p_add.districtId : null) +
                                `, ` +
                                (p_add.stateId ? p_add.stateId : null) +
                                `, ` +
                                (p_add.countryId ? p_add.countryId : null) +
                                `
                                                        , '` +
                                p_add.countryName +
                                `','` +
                                p_add.stateName +
                                `','` +
                                p_add.cityName +
                                `', ` +
                                p_add.latitude +
                                `, ` +
                                p_add.longitude +
                                `,` +
                                userId +
                                `,` +
                                userId +
                                `, '` +
                                p_add.residentialStatus +
                                `')`;
                            addressResult = yield apiHeader_1.default.query(insertPermanentAddress);
                            updatePara += `, addressId = ` + addressResult.insertId + ` `;
                            percentageFlag = true;
                        }
                        let ca_add = req.body.currentAddress;
                        let currentAddressResult;
                        if (checkDetailResult[0].currentAddressId) {
                            let updateCurrentAddress = `UPDATE addresses SET addressLine1 = '` +
                                ca_add.addressLine1 +
                                `', addressLine2 = '` +
                                ca_add.addressLine2 +
                                `', pincode = '` +
                                ca_add.pincode +
                                `', cityId = ` +
                                (ca_add.cityId ? ca_add.cityId : null) +
                                `, districtId = ` +
                                (ca_add.districtId ? ca_add.districtId : null) +
                                `, stateId = ` +
                                (ca_add.stateId ? ca_add.stateId : null) +
                                `, countryId = ` +
                                (ca_add.countryId ? ca_add.countryId : null) +
                                `, countryName= '` +
                                ca_add.countryName +
                                `', 
                                                            stateName = '` +
                                ca_add.stateName +
                                `', cityName ='` +
                                ca_add.cityName +
                                `' , latitude = ` +
                                ca_add.latitude +
                                `, longitude =  ` +
                                ca_add.longitude +
                                `
                                                            , modifiedDate = CURRENT_TIMESTAMP() , modifiedBy = ` +
                                userId +
                                `, residentialStatus = '` +
                                ca_add.residentialStatus +
                                `' WHERE id = ` +
                                checkDetailResult[0].currentAddressId +
                                ``;
                            currentAddressResult = yield apiHeader_1.default.query(updateCurrentAddress);
                        }
                        else {
                            let insertCurrentAddress = `INSERT INTO addresses(addressLine1, addressLine2, pincode, cityId, districtId, stateId, countryId, countryName, stateName, cityName, latitude, longitude
                                                        , createdBy, modifiedBy, residentialStatus) VALUES('` +
                                ca_add.addressLine1 +
                                `','` +
                                ca_add.addressLine2 +
                                `','` +
                                ca_add.pincode +
                                `', ` +
                                (ca_add.cityId ? ca_add.cityId : null) +
                                `
                                                        , ` +
                                (ca_add.districtId ? ca_add.districtId : null) +
                                `, ` +
                                (ca_add.stateId ? ca_add.stateId : null) +
                                `, ` +
                                (ca_add.countryId ? ca_add.countryId : null) +
                                `
                                                        , '` +
                                ca_add.countryName +
                                `','` +
                                ca_add.stateName +
                                `','` +
                                ca_add.cityName +
                                `', ` +
                                ca_add.latitude +
                                `, ` +
                                ca_add.longitude +
                                `,` +
                                userId +
                                `,` +
                                userId +
                                `, '` +
                                ca_add.residentialStatus +
                                `')`;
                            currentAddressResult = yield apiHeader_1.default.query(insertCurrentAddress);
                            updatePara += `, currentAddressId = ` + currentAddressResult.insertId + ` `;
                            percentageFlag = true;
                        }
                        // updatePara = `addressId = ` + addressResult.insertId + `, currentAddressId = ` + currentAddressResult.insertId + `, nativePlace = '` + req.body.nativePlace + `',  willingToGoAbroad = ` + req.body.willingToGoAbroad + `, citizenship = '` + req.body.citizenship + `', visaStatus = '` + req.body.visaStatus + `'`
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Education & Career Details
                case 7: {
                    let screen7RequiredFields = ['id', 'screenNumber'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen7RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        updatePara =
                            ` educationTypeId = ` +
                                req.body.educationTypeId +
                                `, educationMediumId = ` +
                                (req.body.educationMediumId ? req.body.educationMediumId : null) +
                                `, educationId = ` +
                                (req.body.educationId ? req.body.educationId : null) +
                                `, areYouWorking = ` +
                                req.body.areYouWorking +
                                `, occupationId = ` +
                                (req.body.occupationId ? req.body.occupationId : null) +
                                `, businessName = ` +
                                (req.body.businessName ? `'` + req.body.businessName + `'` : null) +
                                `, designation = ` +
                                (req.body.designation ? `'` + req.body.designation + `'` : null) +
                                `, employmentTypeId =` +
                                (req.body.employmentTypeId ? req.body.employmentTypeId : null) +
                                `, companyName = ` +
                                (req.body.companyName ? `'` + req.body.companyName + `'` : null) +
                                `, annualIncomeId = ` +
                                (req.body.annualIncomeId ? req.body.annualIncomeId : null) +
                                ` `;
                        if (!checkDetailResult[0].educationId)
                            percentageFlag = true;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Astrologic Details
                case 8: {
                    let screen8RequiredFields = ['id', 'screenNumber', 'horoscopeBelief'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen8RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        let astrologicDetailSql = yield apiHeader_1.default.query(`SELECT * FROM userastrologicdetail WHERE userId = ` + userId + ``);
                        if (astrologicDetailSql && astrologicDetailSql.length > 0) {
                            let updateSql = `UPDATE userastrologicdetail SET userId = ` +
                                userId +
                                `, horoscopeBelief = ` +
                                req.body.horoscopeBelief +
                                `, birthCountryId=` +
                                (req.body.birthCountryId ? req.body.birthCountryId : null) +
                                `, birthCityId=` +
                                (req.body.birthCityId ? req.body.birthCityId : null) +
                                `, birthCountryName=` +
                                (req.body.birthCountryName ? `'` + req.body.birthCountryName + `'` : null) +
                                `, birthCityName = ` +
                                (req.body.birthCityName ? `'` + req.body.birthCityName + `'` : null) +
                                `, zodiacSign= ` +
                                (req.body.zodiacSign ? `'` + req.body.zodiacSign + `'` : null) +
                                `, timeOfBirth = ` +
                                (req.body.timeOfBirth ? `'` + req.body.timeOfBirth + `'` : null) +
                                `, isHideBirthTime =` +
                                (req.body.isHideBirthTime ? req.body.isHideBirthTime : null) +
                                `, manglik = ` +
                                (req.body.manglik ? req.body.manglik : null) +
                                `,  modifiedBy = ` +
                                userId +
                                `, modifiedDate = CURRENT_TIMESTAMP() WHERE id = ` +
                                astrologicDetailSql[0].id +
                                ``;
                            result = yield apiHeader_1.default.query(updateSql);
                        }
                        else {
                            let insertSql = `INSERT INTO userastrologicdetail (userId , horoscopeBelief , birthCountryId, birthCityId, birthCountryName, birthCityName, zodiacSign, timeOfBirth , isHideBirthTime , manglik, createdBy, modifiedBy) 
                                                 VALUES ( ` +
                                userId +
                                `,` +
                                req.body.horoscopeBelief +
                                `,` +
                                (req.body.birthCountryId ? req.body.birthCountryId : null) +
                                `, ` +
                                (req.body.birthCityId ? req.body.birthCityId : null) +
                                `,` +
                                (req.body.birthCountryName ? `'` + req.body.birthCountryName + `'` : null) +
                                `,` +
                                (req.body.birthCityName ? `'` + req.body.birthCityName + `'` : null) +
                                `, ` +
                                (req.body.zodiacSign ? `'` + req.body.zodiacSign + `'` : null) +
                                `,` +
                                (req.body.timeOfBirth ? `'` + req.body.timeOfBirth + `'` : null) +
                                `, ` +
                                (req.body.isHideBirthTime ? req.body.isHideBirthTime : null) +
                                `, ` +
                                (req.body.manglik ? req.body.manglik : null) +
                                `, ` +
                                userId +
                                `, ` +
                                userId +
                                `)`;
                            result = yield apiHeader_1.default.query(insertSql);
                            percentageFlag = true;
                        }
                        // updatePara = `userId = ` + userId + `, isHoroscopeBelief = ` + req.body.isHoroscopeBelief + `, birthCountryId=` + req.body.birthCountryId + `, birthCityId=` + req.body.birthCityId + `, birthCountryName='` + req.body.birthCountryName + `', birthCityName='` + req.body.birthCityName + `', zodiacSign= '` + req.body.zodiacSign + `', timeOfBirth = '` + req.body.timeOfBirth + `', isHideBirthTime =` + req.body.isHideBirthTime + `, isManglik =` + req.body.isManglik + ` `;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Life Styles
                case 9: {
                    let screen9RequiredFields = ['id', 'screenNumber', 'dietId', 'smoking', 'drinking'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen9RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        updatePara = `dietId = ` + req.body.dietId + `, smoking = '` + req.body.smoking + `', drinking = '` + req.body.drinking + `' `;
                        if (checkDetailResult[0].dietId == null && checkDetailResult[0].smoking == null && checkDetailResult[0].drinking == null) {
                            percentageFlag = true;
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Partner Preferences
                case 10: {
                    let screen11RequiredFields = ['id', 'screenNumber'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen11RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        if (req.body.pMaritalStatusId && Array.isArray(req.body.pMaritalStatusId)) {
                            req.body.pMaritalStatusId = req.body.pMaritalStatusId.join(',');
                        }
                        if (req.body.pReligionId && Array.isArray(req.body.pReligionId)) {
                            req.body.pReligionId = req.body.pReligionId.join(',');
                        }
                        if (req.body.pCommunityId && Array.isArray(req.body.pCommunityId)) {
                            req.body.pCommunityId = req.body.pCommunityId.join(',');
                        }
                        if (req.body.pCountryLivingInId && Array.isArray(req.body.pCountryLivingInId)) {
                            req.body.pCountryLivingInId = req.body.pCountryLivingInId.join(',');
                        }
                        if (req.body.pStateLivingInId && Array.isArray(req.body.pStateLivingInId)) {
                            req.body.pStateLivingInId = req.body.pStateLivingInId.join(',');
                        }
                        if (req.body.pCityLivingInId && Array.isArray(req.body.pCityLivingInId)) {
                            req.body.pCityLivingInId = req.body.pCityLivingInId.join(',');
                        }
                        if (req.body.pEducationTypeId && Array.isArray(req.body.pEducationTypeId)) {
                            req.body.pEducationTypeId = req.body.pEducationTypeId.join(',');
                        }
                        if (req.body.pEducationMediumId && Array.isArray(req.body.pEducationMediumId)) {
                            req.body.pEducationMediumId = req.body.pEducationMediumId.join(',');
                        }
                        if (req.body.pOccupationId && Array.isArray(req.body.pOccupationId)) {
                            req.body.pOccupationId = req.body.pOccupationId.join(',');
                        }
                        if (req.body.pEmploymentTypeId && Array.isArray(req.body.pEmploymentTypeId)) {
                            req.body.pEmploymentTypeId = req.body.pEmploymentTypeId.join(',');
                        }
                        if (req.body.pAnnualIncomeId && Array.isArray(req.body.pAnnualIncomeId)) {
                            req.body.pAnnualIncomeId = req.body.pAnnualIncomeId.join(',');
                        }
                        if (req.body.pDietId && Array.isArray(req.body.pDietId)) {
                            req.body.pDietId = req.body.pDietId.join(',');
                        }
                        if (req.body.pComplexion && Array.isArray(req.body.pComplexion)) {
                            req.body.pComplexion = req.body.pComplexion.join(',');
                        }
                        if (req.body.pBodyType && Array.isArray(req.body.pBodyType)) {
                            req.body.pBodyType = req.body.pBodyType.join(',');
                        }
                        let preferencesDetail = yield apiHeader_1.default.query(`SELECT * FROM userpartnerpreferences WHERE userId = ` + userId + ``);
                        if (preferencesDetail && preferencesDetail.length > 0) {
                            let sql = `UPDATE userpartnerpreferences SET userId= ` +
                                userId +
                                `,pFromAge = ` +
                                req.body.pFromAge +
                                `,pToAge = ` +
                                req.body.pToAge +
                                `, pFromHeight = ` +
                                req.body.pFromHeight +
                                `,pToHeight = ` +
                                req.body.pToHeight +
                                `,pMaritalStatusId =  '` +
                                req.body.pMaritalStatusId +
                                `',pProfileWithChildren = ` +
                                req.body.pProfileWithChildren +
                                `, pFamilyType = '` +
                                req.body.pFamilyType +
                                `',
                                            pReligionId = '` +
                                req.body.pReligionId +
                                `', pCommunityId = '` +
                                req.body.pCommunityId +
                                `',pMotherTongue = '` +
                                req.body.pMotherTongue +
                                `',pHoroscopeBelief = ` +
                                req.body.pHoroscopeBelief +
                                `,pManglikMatch = ` +
                                req.body.pManglikMatch +
                                `,pCountryLivingInId = '` +
                                req.body.pCountryLivingInId +
                                `',
                                            pStateLivingInId = '` +
                                req.body.pStateLivingInId +
                                `',pCityLivingInId = '` +
                                req.body.pCityLivingInId +
                                `',pEducationTypeId = '` +
                                req.body.pEducationTypeId +
                                `',pEducationMediumId = '` +
                                req.body.pEducationMediumId +
                                `',  pOccupationId = '` +
                                req.body.pOccupationId +
                                `',
                                            pOccupationId='` +
                                req.body.pEmploymentTypeId +
                                `',pAnnualIncomeId = '` +
                                req.body.pAnnualIncomeId +
                                `',pDietId = '` +
                                req.body.pDietId +
                                `', pSmokingAcceptance=` +
                                req.body.pSmokingAcceptance +
                                `,pAlcoholAcceptance = ` +
                                req.body.pAlcoholAcceptance +
                                `,pDisabilityAcceptance = ` +
                                req.body.pDisabilityAcceptance +
                                `,pComplexion = '` +
                                req.body.pComplexion +
                                `',
                                            pBodyType = '` +
                                req.body.pBodyType +
                                `',pOtherExpectations = '` +
                                req.body.pOtherExpectations +
                                `',modifiedBy = ` +
                                userId +
                                `,modifiedDate = CURRENT_TIMESTAMP() WHERE id = ` +
                                preferencesDetail[0].id +
                                ``;
                            result = yield apiHeader_1.default.query(sql);
                        }
                        else {
                            let sql = `INSERT INTO userpartnerpreferences (userId, pFromAge, pToAge, pFromHeight, pToHeight, pMaritalStatusId, pProfileWithChildren, pFamilyType, 
                                            pReligionId, pCommunityId, pMotherTongue, pHoroscopeBelief, pManglikMatch, pCountryLivingInId, pStateLivingInId, pCityLivingInId, pEducationTypeId,
                                            pEducationMediumId, pOccupationId, pEmploymentTypeId, pAnnualIncomeId, pDietId, pSmokingAcceptance, pAlcoholAcceptance, pDisabilityAcceptance, 
                                            pComplexion, pBodyType, pOtherExpectations, createdBy, modifiedBy, createdDate, modifiedDate) 
                                            VALUES 
                                            (` +
                                userId +
                                `,` +
                                req.body.pFromAge +
                                `,` +
                                req.body.pToAge +
                                `, ` +
                                req.body.pFromHeight +
                                `, ` +
                                req.body.pToHeight +
                                `,'` +
                                req.body.pMaritalStatusId +
                                `',` +
                                req.body.pProfileWithChildren +
                                `, '` +
                                req.body.pFamilyType +
                                `',
                                            '` +
                                req.body.pReligionId +
                                `', '` +
                                req.body.pCommunityId +
                                `','` +
                                req.body.pMotherTongue +
                                `',` +
                                req.body.pHoroscopeBelief +
                                `,` +
                                req.body.pManglikMatch +
                                `,'` +
                                req.body.pCountryLivingInId +
                                `',
                                            '` +
                                req.body.pStateLivingInId +
                                `','` +
                                req.body.pCityLivingInId +
                                `','` +
                                req.body.pEducationTypeId +
                                `','` +
                                req.body.pEducationMediumId +
                                `',  '` +
                                req.body.pOccupationId +
                                `',
                                            '` +
                                req.body.pEmploymentTypeId +
                                `','` +
                                req.body.pAnnualIncomeId +
                                `','` +
                                req.body.pDietId +
                                `', ` +
                                req.body.pSmokingAcceptance +
                                `,` +
                                req.body.pAlcoholAcceptance +
                                `,` +
                                req.body.pDisabilityAcceptance +
                                `,'` +
                                req.body.pComplexion +
                                `',
                                            '` +
                                req.body.pBodyType +
                                `','` +
                                req.body.pOtherExpectations +
                                `',` +
                                userId +
                                `,` +
                                userId +
                                `, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP() )`;
                            result = yield apiHeader_1.default.query(sql);
                            percentageFlag = true;
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // KYC
                case 11: {
                    let screen11RequiredFields = ['id', 'screenNumber', 'documents'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen11RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        let docCheck = yield apiHeader_1.default.query(`SELECT * FROM userdocument WHERE userId = ` + userId + ``);
                        if (docCheck && docCheck.length < 0)
                            percentageFlag = true;
                        if (req.body.documents && req.body.documents.length > 0) {
                            for (let i = 0; i < req.body.documents.length; i++) {
                                if (req.body.documents[i].isRequired) {
                                    if (!req.body.documents[i].documentUrl) {
                                        let errorResult = new resulterror_1.ResultError(400, true, 'Document is Required', new Error('Document is Required'), '');
                                        next(errorResult);
                                        return errorResult;
                                    }
                                }
                                if (req.body.documents[i].documentUrl) {
                                    if (req.body.documents[i].id) {
                                        if (req.body.documents[i].documentUrl && req.body.documents[i].documentUrl.indexOf('content') == -1) {
                                            let userDocumentId = req.body.documents[i].id;
                                            let oldDocummentSql = `SELECT * FROM userdocument WHERE id = ` + userDocumentId;
                                            let oldDocummentResult = yield apiHeader_1.default.query(oldDocummentSql);
                                            let image = req.body.documents[i].documentUrl;
                                            let data = image.split(',');
                                            if (data && data.length > 1) {
                                                image = image.split(',')[1];
                                            }
                                            let dir = './content';
                                            if (!fs.existsSync(dir)) {
                                                fs.mkdirSync(dir);
                                            }
                                            let dir1 = './content/userDocument';
                                            if (!fs.existsSync(dir1)) {
                                                fs.mkdirSync(dir1);
                                            }
                                            let dir2 = './content/userDocument/' + req.body.id;
                                            if (!fs.existsSync(dir2)) {
                                                fs.mkdirSync(dir2);
                                            }
                                            const fileContentsUser = new Buffer(image, 'base64');
                                            let imgPath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '-realImg.jpeg';
                                            fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                                if (err)
                                                    return console.error(err);
                                                console.log('file saved imagePath');
                                            });
                                            let imagePath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '.jpeg';
                                            yield Jimp.read(imgPath)
                                                .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                                // return lenna
                                                //     //.resize(100, 100) // resize
                                                //     .quality(60) // set JPEG quality
                                                //     // .greyscale() // set greyscale
                                                //     // .write("lena-small-bw.jpg"); // save
                                                //     .write(imagePath);
                                                let data = lenna
                                                    //.resize(100, 100) // resize
                                                    // .quality(60) // set JPEG quality
                                                    // .greyscale() // set greyscale
                                                    // .write("lena-small-bw.jpg"); // save
                                                    .write(imagePath);
                                                const image_act = yield Jimp.read(imagePath);
                                                const watermark = yield Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                                watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                                const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                                const y = image_act.getHeight() - watermark.getHeight() * 2;
                                                image_act.composite(watermark, x, y, {
                                                    mode: Jimp.BLEND_SOURCE_OVER,
                                                    opacitySource: 0.5 // Adjust the opacity of the watermark
                                                });
                                                //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                                yield image_act.writeAsync(imagePath);
                                                return data;
                                            }))
                                                .catch((err) => {
                                                console.error(err);
                                            });
                                            let updateimagePathSql = `UPDATE userdocument SET documentUrl='` + imagePath.substring(2) + `',modifiedDate = CURRENT_TIMESTAMP() WHERE id=` + userDocumentId;
                                            result = yield apiHeader_1.default.query(updateimagePathSql);
                                        }
                                        else {
                                            let userDocumentId = req.body.documents[i].id;
                                            let updateimagePathSql = `UPDATE userdocument SET documentUrl= '` + req.body.documents[i].documentUrl + `',modifiedDate = CURRENT_TIMESTAMP() WHERE id=` + userDocumentId;
                                            result = yield apiHeader_1.default.query(updateimagePathSql);
                                        }
                                    }
                                    else {
                                        if (req.body.documents[i].documentUrl && req.body.documents[i].documentUrl.indexOf('content') == -1) {
                                            //let imageSql = `INSERT INTO images(createdBy, modifiedBy) VALUES (` + req.body.id + `,` + req.body.id + `)`;
                                            let userDocumentSql = `INSERT INTO userdocument(userId, documentTypeId, isVerified, isRequired, createdBy, modifiedBy) 
                                            VALUES(` +
                                                req.body.id +
                                                `,` +
                                                req.body.documents[i].documentTypeId +
                                                `, 0, ` +
                                                req.body.documents[i].isRequired +
                                                `,` +
                                                req.body.id +
                                                `,` +
                                                req.body.id +
                                                `)`;
                                            result = yield apiHeader_1.default.query(userDocumentSql);
                                            if (result.insertId) {
                                                let userDocumentId = result.insertId;
                                                let image = req.body.documents[i].documentUrl;
                                                let data = image.split(',');
                                                if (data && data.length > 1) {
                                                    image = image.split(',')[1];
                                                }
                                                let dir = './content';
                                                if (!fs.existsSync(dir)) {
                                                    fs.mkdirSync(dir);
                                                }
                                                let dir1 = './content/userDocument';
                                                if (!fs.existsSync(dir1)) {
                                                    fs.mkdirSync(dir1);
                                                }
                                                let dir2 = './content/userDocument/' + req.body.id;
                                                if (!fs.existsSync(dir2)) {
                                                    fs.mkdirSync(dir2);
                                                }
                                                const fileContentsUser = new Buffer(image, 'base64');
                                                let imgPath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '-realImg.jpeg';
                                                fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                                    if (err)
                                                        return console.error(err);
                                                    console.log('file saved imagePath');
                                                });
                                                let imagePath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '.jpeg';
                                                yield Jimp.read(imgPath)
                                                    .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                                    // return lenna
                                                    //     //.resize(100, 100) // resize
                                                    //     .quality(60) // set JPEG quality
                                                    //     // .greyscale() // set greyscale
                                                    //     // .write("lena-small-bw.jpg"); // save
                                                    //     .write(imagePath);
                                                    let data = lenna
                                                        //.resize(100, 100) // resize
                                                        // .quality(60) // set JPEG quality
                                                        // .greyscale() // set greyscale
                                                        // .write("lena-small-bw.jpg"); // save
                                                        .write(imagePath);
                                                    const image_act = yield Jimp.read(imagePath);
                                                    const watermark = yield Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                                    watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                                    const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                                    const y = image_act.getHeight() - watermark.getHeight() * 2;
                                                    image_act.composite(watermark, x, y, {
                                                        mode: Jimp.BLEND_SOURCE_OVER,
                                                        opacitySource: 0.5 // Adjust the opacity of the watermark
                                                    });
                                                    //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                                    yield image_act.writeAsync(imagePath);
                                                    return data;
                                                }))
                                                    .catch((err) => {
                                                    console.error(err);
                                                });
                                                let updateimagePathSql = `UPDATE userdocument SET documentUrl='` + imagePath.substring(2) + `', modifiedDate = CURRENT_TIMESTAMP() WHERE id=` + userDocumentId;
                                                result = yield apiHeader_1.default.query(updateimagePathSql);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (req.body.documents[i].id) {
                                        let oldDocummentSql = `SELECT * FROM userdocument WHERE id = ` + req.body.documents[i].id;
                                        let oldDocummentResult = yield apiHeader_1.default.query(oldDocummentSql);
                                        let updateimagePathSql = `DELETE FROM userdocument WHERE id=` + req.body.documents[i].id;
                                        result = yield apiHeader_1.default.query(updateimagePathSql);
                                        if (result && result.affectedRows > 0) {
                                            if (oldDocummentResult && oldDocummentResult.length > 0) {
                                                for (let d = 0; d < oldDocummentResult.length; d++) {
                                                    if (oldDocummentResult[d].documentUrl) {
                                                        let oldUrl = oldDocummentResult[d].documentUrl;
                                                        let imagePath = './' + oldUrl;
                                                        if (fs.existsSync(imagePath)) {
                                                            fs.unlink(imagePath, (err) => {
                                                                if (err)
                                                                    throw err;
                                                                console.log(imagePath + ' was deleted');
                                                            });
                                                        }
                                                        let realImg = './' + oldUrl.split('.')[0] + '-realImg.' + oldUrl.split('.')[1];
                                                        if (fs.existsSync(realImg)) {
                                                            fs.unlink(realImg, (err) => {
                                                                if (err)
                                                                    throw err;
                                                                console.log(realImg + ' was deleted');
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
            }
            if (updatePara) {
                let sql = `UPDATE userpersonaldetail SET `;
                if (updatePara) {
                    sql += ` ` + updatePara + ` `;
                }
                sql += ` WHERE userId = ` + userId + ``;
                result = yield apiHeader_1.default.query(sql);
            }
            if (result && result.affectedRows > 0) {
                // let updateCompletedScreen = `UPDATE users SET lastCompletedScreen = ` + screenNumber + ` `;
                // if (screenDetailSql[0].weightage && !screenDetailSql[0].isSkippable) {
                //     updateCompletedScreen += ` , profileCompletedPercentage = profileCompletedPercentage + ` + screenDetailSql[0].weightage + ` `;
                // }
                // updateCompletedScreen += ` WHERE id = ` + userId;
                // let updateCompletedScreenSql = await header.query(updateCompletedScreen);
                let screenCount = yield apiHeader_1.default.query(`SELECT COUNT(id) as count FROM registrationscreens WHERE isDisable = 0`);
                let updateCompletedScreenSql = `UPDATE users SET  profileCompletedPercentage = profileCompletedPercentage + ` + screenDetailSql[0].weightage + ` WHERE id = ` + userId + ``;
                if (screenDetailSql[0].weightage && !screenDetailSql[0].isSkippable && !checkDetailResult[0].isProfileCompleted && percentageFlag) {
                    let updateCompletedScreenReslt = yield apiHeader_1.default.query(updateCompletedScreenSql);
                }
                // else if (screenDetailSql[0].weightage && screenDetailSql[0].isSkippable && percentageFlag) {
                //     let updateCompletedScreenReslt = await header.query(updateCompletedScreenSql);
                // }
                if (user[0].lastCompletedScreen < screenNumber) {
                    let updateScreenSql = `UPDATE users SET lastCompletedScreen = ` + screenNumber + ` `;
                    if (screenNumber == 11 && !user[0].isProfileCompleted) {
                        updateScreenSql += ` ,isProfileCompleted = true `;
                    }
                    updateScreenSql += ` WHERE id = ` + userId + ``;
                    let updateScreenResult = yield apiHeader_1.default.query(updateScreenSql);
                }
                // let updateCompletedScreen = await header.query(`UPDATE users SET lastCompletedScreen = ` + screenNumber + ` WHERE id = ` + userId + ``);
                if (isCustomFieldEnabled && req.body.customFields != null && req.body.customFields.length > 0) {
                    let fields = req.body.customFields;
                    let customResult;
                    let customSql;
                    let checkCustomData = yield apiHeader_1.default.query(`SELECT * FROM userpersonaldetailcustomdata WHERE userId = ` + userId + `  `);
                    if (checkCustomData && checkCustomData.length > 0) {
                        customSql = `UPDATE userpersonaldetailcustomdata SET `;
                        for (let i = 0; i < fields.length; i++) {
                            if (fields[i].value && Array.isArray(fields[i].value)) {
                                const semicolonSeparatedString = fields[i].value.join(';');
                                fields[i].value = semicolonSeparatedString;
                            }
                            customSql += `` + fields[i].mappedFieldName + ` = `;
                            if (fields[i].valueTypeId == '2') {
                                customSql += `` + (fields[i].value ? fields[i].value : null) + ``;
                            }
                            else {
                                // customUpdateSql += `'` + fields[i].value + `'`;
                                customSql += `` + (fields[i].value && fields[i].value != '' ? "'" + fields[i].value + "'" : null) + ``;
                            }
                            customSql += `,`;
                        }
                        customSql += ` modifiedBy = ` + req.body.id + `, modifiedDate = CURRENT_TIMESTAMP() WHERE userId = ` + req.body.id + `  `;
                    }
                    else {
                        customSql = `INSERT INTO userpersonaldetailcustomdata(userId,createdBy,modifiedBy,`;
                        for (let i = 0; i < fields.length; i++) {
                            customSql += `` + fields[i].mappedFieldName + ``;
                            if (i != fields.length - 1) {
                                customSql += `,`;
                            }
                        }
                        customSql += `) VALUES (` + req.body.id + `,` + req.body.id + `,` + req.body.id + `,`;
                        for (let i = 0; i < fields.length; i++) {
                            if (fields[i].value && Array.isArray(fields[i].value)) {
                                const semicolonSeparatedString = fields[i].value.join(';');
                                fields[i].value = semicolonSeparatedString;
                            }
                            if (fields[i].valueTypeId == '2') {
                                customSql += `` + (fields[i].value ? fields[i].value : null) + ``;
                            }
                            else {
                                customSql += `` + (fields[i].value && fields[i].value != '' ? "'" + fields[i].value + "'" : null) + ``;
                            }
                            if (i != fields.length - 1) {
                                customSql += `,`;
                            }
                        }
                        customSql += ` ) `;
                        // console.log(customSql);
                    }
                    customResult = yield apiHeader_1.default.query(customSql);
                    if (customResult && customResult.affectedRows > 0) {
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Custom Field Data'), '');
                        next(errorResult);
                    }
                }
                let flagError = false;
                if (checkDetailResult && checkDetailResult.length == 0) {
                    let checkRewardSql = `SELECT * FROM systemflags WHERE id IN(42,43)`;
                    let checkRewardResult = yield apiHeader_1.default.query(checkRewardSql);
                    if (checkRewardResult && checkRewardResult.length > 0) {
                        let ind = checkRewardResult.findIndex((c) => c.value == '1' && c.id == 42);
                        let amount = parseFloat(checkRewardResult.find((c) => c.id == 43).value);
                        if (ind >= 0) {
                            //Insert Wallet User History and Insert/Update User Wallet
                            let referalUserSql = `Select referalUserId from users where id = ` + req.body.id;
                            let referalUserResult = yield apiHeader_1.default.query(referalUserSql);
                            if (referalUserResult && referalUserResult.length > 0 && referalUserResult[0].referalUserId != null) {
                                let checkUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + referalUserResult[0].referalUserId;
                                // let checkUserWalletSql = `SELECT * FROM userwallets WHERE userId = (select referalUserId from users where id=` + userId + `)`;
                                let checkUserWalletResult = yield apiHeader_1.default.query(checkUserWalletSql);
                                if (checkUserWalletResult && checkUserWalletResult.length > 0) {
                                    let lAmt = checkUserWalletResult[0].amount + amount;
                                    let userWalletSql = `UPDATE userwallets SET amount = ` + lAmt + `, modifiedBy = ` + userId + `, modifiedDate = CURRENT_TIMESTAMP() WHERE id = ` + checkUserWalletResult[0].id;
                                    let result = yield apiHeader_1.default.query(userWalletSql);
                                    if (result && result.affectedRows >= 0) {
                                        let userWalletId = checkUserWalletResult[0].id;
                                        let userWalletHistorySql = `INSERT INTO userwallethistory(userWalletId, amount, isCredit, transactionDate, remark, createdBy, modifiedBy) 
                                        VALUES(` +
                                            userWalletId +
                                            `,` +
                                            amount +
                                            `, 1, ?, 'Amount credited via refered user',` +
                                            userId +
                                            `,` +
                                            userId +
                                            ` )`;
                                        result = yield apiHeader_1.default.query(userWalletHistorySql, [new Date()]);
                                        if (result && result.insertId > 0) {
                                        }
                                        else {
                                            flagError = true;
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                            next(errorResult);
                                        }
                                    }
                                    else {
                                        flagError = true;
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    let userWalletSql = `INSERT INTO userwallets(userId, amount, createdBy, modifiedBy) VALUES(` + req.body.id + `,` + amount + `,` + userId + `,` + userId + `)`;
                                    let result = yield apiHeader_1.default.query(userWalletSql);
                                    if (result && result.insertId > 0) {
                                        let userWalletId = result.insertId;
                                        let userWalletHistorySql = `INSERT INTO userwallethistory(userWalletId, amount, isCredit, transactionDate, remark, createdBy, modifiedBy) 
                                        VALUES(` +
                                            userWalletId +
                                            `,` +
                                            amount +
                                            `, 1, ?, 'Amount credited via refered user',` +
                                            userId +
                                            `,` +
                                            userId +
                                            ` )`;
                                        result = yield apiHeader_1.default.query(userWalletHistorySql, [new Date()]);
                                        if (result && result.insertId > 0) {
                                        }
                                        else {
                                            flagError = true;
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                            next(errorResult);
                                        }
                                    }
                                    else {
                                        flagError = true;
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                        next(errorResult);
                                    }
                                }
                            }
                            else {
                            }
                        }
                    }
                }
                // region resopnse
                if (!flagError) {
                    let sql = `SELECT u.id, u.firstName,udd.fcmToken,img.imageUrl,u.stripeCustomerId, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic, u.isDemoUser, u.lastCompletedScreen,u.isProfileCompleted,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium 
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = ` +
                        req.body.id +
                        ` AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = ` +
                        req.body.id +
                        ` AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = ` +
                        req.body.id +
                        ` AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                   WHERE ur.roleId = 2 AND u.id = ` +
                        req.body.id +
                        ``;
                    let responseResult = yield apiHeader_1.default.query(sql);
                    console.log(sql);
                    if (responseResult && responseResult.length > 0) {
                        responseResult[0].isVerified = false;
                        let isVerified = true;
                        let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + responseResult[0].id;
                        let documentsResult = yield apiHeader_1.default.query(documentsSql);
                        responseResult[0].userDocuments = documentsResult;
                        if (documentsResult && documentsResult.length > 0) {
                            for (let j = 0; j < documentsResult.length; j++) {
                                if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                    isVerified = false;
                                }
                            }
                        }
                        else {
                            isVerified = false;
                        }
                        responseResult[0].isVerifiedProfile = isVerified;
                        if (responseResult[0].isVerifyProfilePic) {
                            responseResult[0].isVerifyProfilePic = true;
                        }
                        else {
                            responseResult[0].isVerifyProfilePic = false;
                        }
                        responseResult[0].totalView = 0;
                        responseResult[0].todayView = 0;
                        let totalViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id;
                        let totalViewResult = yield apiHeader_1.default.query(totalViewSql);
                        if (totalViewResult && totalViewResult.length > 0) {
                            responseResult[0].totalView = totalViewResult[0].totalView;
                        }
                        let todayViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id + ` AND DATE(transactionDate) = DATE(CURRENT_TIMESTAMP())`;
                        let todayViewResult = yield apiHeader_1.default.query(todayViewSql);
                        if (todayViewResult && todayViewResult.length > 0) {
                            responseResult[0].todayView = todayViewResult[0].totalView;
                        }
                        let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                                    LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                                    WHERE ufv.userId = ` + req.body.id;
                        responseResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                        let getUserAuthSql = `SELECT * FROM userauthdata WHERE userId = ` + req.body.id;
                        let getUserAuthResult = yield apiHeader_1.default.query(getUserAuthSql);
                        responseResult[0].isOAuth = getUserAuthResult && getUserAuthResult.length > 0 ? true : false;
                        responseResult[0].isAppleLogin = getUserAuthResult && getUserAuthResult.length > 0 && getUserAuthResult[0].authProviderId == 3 ? true : false;
                        responseResult[0].userWalletAmount = 0;
                        let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + responseResult[0].id;
                        let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                        if (getUserWalletResult && getUserWalletResult.length > 0) {
                            responseResult[0].userWalletAmount = getUserWalletResult[0].amount;
                        }
                        if (req.body.isSignup && responseResult[0].lastCompletedScreen == 11 && !user[0].isProfileCompleted) {
                            let adminUserSql = `SELECT * FROM users where id IN(select userId from userroles where (roleId = 1 OR roleId = 3)) AND isActive  = true AND isDelete = false`;
                            let adminUserResult = yield apiHeader_1.default.query(adminUserSql);
                            if (adminUserResult && adminUserResult.length > 0) {
                                for (let a = 0; a < adminUserResult.length; a++) {
                                    if (adminUserResult[a].isReceiveMail) {
                                        let resultEmail = yield sendEmail(config_1.default.emailMatrimonyNewUserRegister.fromName + ' <' + config_1.default.emailMatrimonyNewUserRegister.fromEmail + '>', [adminUserResult[a].email], config_1.default.emailMatrimonyNewUserRegister.subject, '', config_1.default.emailMatrimonyNewUserRegister.html
                                            .replace("[User's Full Name]", responseResult[0].firstName + ' ' + responseResult[0].lastName)
                                            .replace("[User's Contact No]", responseResult[0].contactNo)
                                            .replace("[User's Email Address]", responseResult[0].email), null, null);
                                        console.log(resultEmail);
                                    }
                                    if (adminUserResult[a].isReceiveNotification) {
                                        let deviceDetailSql = `SELECT * FROM userdevicedetail WHERE userId = ` + adminUserResult[a].id + ` AND fcmToken IS NOT NULL`;
                                        let deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                        if (deviceDetailResult && deviceDetailResult.length > 0) {
                                            let title = 'New User Register';
                                            let description = 'New User ' + responseResult[0].firstName + ' ' + responseResult[0].lastName + ' registered in system. Please verify document';
                                            let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                                                                        VALUES(` +
                                                adminUserResult[a].id +
                                                `,'` +
                                                title +
                                                `', '` +
                                                description +
                                                `', null, null, ` +
                                                authorizationResult.currentUser.id +
                                                `, ` +
                                                authorizationResult.currentUser.id +
                                                `)`;
                                            let notificationResult = yield apiHeader_1.default.query(notificationSql);
                                            yield notifications_1.default.sendMultipleNotification([deviceDetailResult[0].fcmToken], null, title, description, '', null, null, 0);
                                            console.log('Send' + deviceDetailResult[0].fcmToken);
                                        }
                                    }
                                }
                            }
                        }
                        let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                                LEFT JOIN package p ON p.id = up.packageId
                                                LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                WHERE up.userId = ` +
                            responseResult[0].id +
                            ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                                order by p.weightage DESC`;
                        let userPackage = yield apiHeader_1.default.query(userPackages);
                        if (userPackage && userPackage.length > 0) {
                            for (let k = 0; k < userPackage.length; k++) {
                                let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                                                LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                                                WHERE pf.packageId = ` + userPackage[k].packageId);
                                userPackage[k].packageFacility = packageFacility;
                            }
                        }
                        responseResult[0].userPackage = userPackage[0];
                        let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(req.body.id);
                        if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                            // console.log(_customFieldDataResult);
                            responseResult[0].customFields = _customFieldDataResult;
                        }
                        for (let i = 0; i < responseResult.length; i++) {
                            let userDetailResponse = yield customFields_1.default.getUserData(responseResult[i]);
                            responseResult[i] = Object.assign(Object.assign({}, responseResult[i]), userDetailResponse);
                        }
                        // let userDetailResponse: any = await controller.getUserResponse(responseResult[0].permanentAddress, responseResult[0].currentAddress, responseResult[0].familyDetail, responseResult[0].fatherDetails, responseResult[0].motherDetails,
                        //     responseResult[0].pCountryLivingInId, responseResult[0].pCityLivingInId, responseResult[0].pReligionId, responseResult[0].pCommunityId, responseResult[0].pStateLivingInId, responseResult[0].pEducationMediumId, responseResult[0].pOccupationId,
                        //     responseResult[0].pEmploymentTypeId, responseResult[0].pMaritalStatusId, responseResult[0].pAnnualIncomeId, responseResult[0].pDietId, responseResult[0].pEducationTypeId, responseResult[0].pComplexion, responseResult[0].pBodyType);
                        // console.log(userDetailResponse);
                        // responseResult[0] = { ...responseResult[0], ...userDetailResponse };
                        // responseResult[0].permanentAddress = userDetailResponse.permanentAddress
                        // responseResult[0].currentAddress = userDetailResponse.currentAddress
                        // responseResult[0].familyDetail = userDetailResponse.familyDetail
                        // responseResult[0].fatherDetails = userDetailResponse.fatherDetails
                        // responseResult[0].motherDetails = userDetailResponse.motherDetails
                        // responseResult[0].pCountryLivingInId = userDetailResponse.pCountryLivingInId
                        // responseResult[0].pCityLivingInId = userDetailResponse.pCityLivingInId
                        // responseResult[0].pReligionId = userDetailResponse.pReligionId;
                        // responseResult[0].pCommunityId = userDetailResponse.pCommunityId;
                        // responseResult[0].pStateLivingInId = userDetailResponse.pStateLivingInId;
                        // responseResult[0].pEducationMediumId = userDetailResponse.pEducationMediumId;
                        // responseResult[0].pEducationTypeId = userDetailResponse.pEducationTypeId;
                        // responseResult[0].pOccupationId = userDetailResponse.pOccupationId;
                        // responseResult[0].pEmploymentTypeId = userDetailResponse.pEmploymentTypeId;
                        // responseResult[0].pAnnualIncomeId = userDetailResponse.pAnnualIncomeId;
                        // responseResult[0].pDietId = userDetailResponse.pDietId;
                        // responseResult[0].pMaritalStatusId = userDetailResponse.pMaritalStatusId;
                        // responseResult[0].pCountries = userDetailResponse.pCountries;
                        // responseResult[0].pReligions = userDetailResponse.pReligions;
                        // responseResult[0].pCommunities = userDetailResponse.pCommunities;
                        // responseResult[0].pStates = userDetailResponse.pStates;
                        // responseResult[0].pEducationMedium = userDetailResponse.pEducationMedium;
                        // responseResult[0].pOccupation = userDetailResponse.pOccupation;
                        // responseResult[0].pEmploymentType = userDetailResponse.pEmploymentType;
                        // responseResult[0].pAnnualIncome = userDetailResponse.pAnnualIncome;
                        // responseResult[0].pMaritalStatus = userDetailResponse.pMaritalStatus
                        // responseResult[0].pDiet = userDetailResponse.pDiet
                        // responseResult[0].pComplexion = userDetailResponse.pComplexion
                        // responseResult[0].pBodyType = userDetailResponse.pBodyType
                        // responseResult[0].permanentAddress = responseResult[0].permanentAddress ? JSON.parse(responseResult[0].permanentAddress) : null;
                        // responseResult[0].currentAddress = responseResult[0].currentAddress ? JSON.parse(responseResult[0].currentAddress) : null;
                        // responseResult[0].familyDetail = responseResult[0].familyDetail ? JSON.parse(responseResult[0].familyDetail) : null;
                        // responseResult[0].fatherDetails = responseResult[0].fatherDetails ? JSON.parse(responseResult[0].fatherDetails) : null;
                        // responseResult[0].motherDetails = responseResult[0].motherDetails ? JSON.parse(responseResult[0].motherDetails) : null;
                        // if (responseResult[0].pCountryLivingInId && typeof responseResult[0].pCountryLivingInId === 'string') {
                        //     responseResult[0].pCountryLivingInId = responseResult[0].pCountryLivingInId.includes(',') ? responseResult[0].pCountryLivingInId.split(",").map(Number) : [responseResult[0].pCountryLivingInId];
                        // }
                        // if (responseResult[0].pCityLivingInId && typeof responseResult[0].pCityLivingInId === 'string') {
                        //     responseResult[0].pCityLivingInId = responseResult[0].pCityLivingInId.includes(',') ? responseResult[0].pCityLivingInId.split(",").map(Number) : [responseResult[0].pCityLivingInId];
                        // }
                        // if (responseResult[0].pReligionId && typeof responseResult[0].pReligionId === 'string') {
                        //     responseResult[0].pReligionId = responseResult[0].pReligionId.includes(',') ? responseResult[0].pReligionId.split(",").map(Number) : [responseResult[0].pReligionId];
                        // }
                        // if (responseResult[0].pCommunityId && typeof responseResult[0].pCommunityId === 'string') {
                        //     responseResult[0].pCommunityId = result[0].responseResult.includes(',') ? responseResult[0].pCommunityId.split(",").map(Number) : [responseResult[0].pCommunityId];
                        // }
                        // if (responseResult[0].pStateLivingInId && typeof responseResult[0].pStateLivingInId === 'string') {
                        //     responseResult[0].pStateLivingInId = responseResult[0].pStateLivingInId.includes(',') ? responseResult[0].pStateLivingInId.split(",").map(Number) : [responseResult[0].pStateLivingInId];
                        // }
                        // if (responseResult[0].pEducationMediumId && typeof responseResult[0].pEducationMediumId === 'string') {
                        //     responseResult[0].pEducationMediumId = responseResult[0].pEducationMediumId.includes(',') ? responseResult[0].pEducationMediumId.split(",").map(Number) : [responseResult[0].pEducationMediumId];
                        // }
                        // if (responseResult[0].pEducationTypeId && typeof responseResult[0].pEducationTypeId === 'string') {
                        //     responseResult[0].pEducationTypeId = responseResult[0].pEducationTypeId.includes(',') ? responseResult[0].pEducationTypeId.split(",").map(Number) : [responseResult[0].pEducationTypeId];
                        // }
                        // if (responseResult[0].pOccupationId && typeof responseResult[0].pOccupationId === 'string') {
                        //     responseResult[0].pOccupationId = responseResult[0].pOccupationId.includes(',') ? responseResult[0].pOccupationId.split(",").map(Number) : [responseResult[0].pOccupationId];
                        // }
                        // if (responseResult[0].pEmploymentTypeId && typeof responseResult[0].pEmploymentTypeId === 'string') {
                        //     responseResult[0].pEmploymentTypeId = responseResult[0].pEmploymentTypeId.includes(',') ? responseResult[0].pEmploymentTypeId.split(",").map(Number) : [responseResult[0].pEmploymentTypeId];
                        // }
                        // if (responseResult[0].pAnnualIncomeId && typeof responseResult[0].pAnnualIncomeId === 'string') {
                        //     responseResult[0].pAnnualIncomeId = responseResult[0].pAnnualIncomeId.includes(',') ? responseResult[0].pAnnualIncomeId.split(",").map(Number) : [responseResult[0].pAnnualIncomeId];
                        // }
                        // if (responseResult[0].pDietId && typeof result[0].pDietId === 'string') {
                        //     responseResult[0].pDietId = responseResult[0].pDietId.includes(',') ? responseResult[0].pDietId.split(",").map(Number) : [responseResult[0].pDietId];
                        // }
                        // if (responseResult[0].pMaritalStatusId && typeof responseResult[0].pMaritalStatusId === 'string') {
                        //     responseResult[0].pMaritalStatusId = responseResult[0].pMaritalStatusId.includes(',') ? responseResult[0].pMaritalStatusId.split(",").map(Number) : [responseResult[0].pMaritalStatusId];
                        // }
                        // if (responseResult[0].pBodyType && typeof responseResult[0].pBodyType === 'string') {
                        //     responseResult[0].pBodyType = responseResult[0].pBodyType.includes(',') ? responseResult[0].pBodyType.split(",") : [responseResult[0].pBodyType];
                        // }
                        // if (responseResult[0].pComplexion && typeof responseResult[0].pComplexion === 'string') {
                        //     responseResult[0].pComplexion = responseResult[0].pComplexion.includes(',') ?responseResult[0].pComplexion.split(",") : [responseResult[0].pComplexion];
                        // }
                        let status = user[0].isProfileCompleted ? 'Update' : 'Insert';
                        if (responseResult[0].isDemoUser == 1) {
                            responseResult[0].isDemoUser = true;
                        }
                        else {
                            responseResult[0].isDemoUser = false;
                        }
                        yield apiHeader_1.default.commit();
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, status + 'User Personal Detail', responseResult, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.completeUserProfileV2() Error', new Error('Error While Updating Data'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(400, true, 'users.completeUserProfileV2() Error', new Error('Error While Updating Data'), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
            next(errorResult);
        }
        // } else {
        //     await header.rollback();
        //     let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
        //     next(errorResult);
        // }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateUserProfileDetail() Exception', error, '');
        next(errorResult);
    }
});
const TestingAPI = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let screens = yield apiHeader_1.default.query(`SELECT * FROM registrationscreens `);
        let userId = req.body.id;
        // let sql = `SELECT u.id, udd.fcmtoken, img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, u.isVerifyProfilePic
        //                 , upa.religionId, upa.communityId, upa.maritalStatusId, upa.occupationId, upa.educationId, upa.subCommunityId, upa.dietId, upa.annualIncomeId, upa.heightId, upa.birthDate
        //                 , upa.languages, upa.eyeColor, upa.businessName, upa.companyName, upa.employmentTypeId, upa.weight as weightId, upa.profileForId, upa.expectation, upa.aboutMe
        //                 ,upa.memberid, upa.anyDisability, upa.haveSpecs, upa.haveChildren, upa.noOfChildren, upa.bloodGroup, upa.complexion, upa.bodyType, upa.familyType, upa.motherTongue
        //                 , upa.currentAddressId, upa.nativePlace, upa.citizenship, upa.visaStatus, upa.designation, upa.educationTypeId, upa.educationMediumId, upa.drinking, upa.smoking
        //                 , upa.willingToGoAbroad, upa.areYouWorking,upa.addressId ,edt.name as educationType, edme.name as educationMedium
        //                 , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
        //                 , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
        //                 , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y')+0 AS age,
        //                  JSON_OBJECT(
        //                          'id',addr.id,
        // 						'addressLine1', addr.addressLine1,
        // 						'addressLine2', addr.addressLine2,
        // 						'pincode', addr.pincode,
        // 						'cityId', addr.cityId,
        // 						'districtId', addr.districtId,
        // 						'stateId', addr.stateId,
        // 						'countryId', addr.countryId,
        // 						'cityName', addr.cityName,
        // 						'stateName', addr.stateName,
        // 						'countryName', addr.countryName,
        //                          'residentialStatus',addr.residentialStatus,
        //                          'latitude',addr.latitude,
        //                          'longitude',addr.longitude
        //                  ) AS permanentAddress,
        //                  JSON_OBJECT(
        //                          'id', cuaddr.id,
        // 						'addressLine1', cuaddr.addressLine1,
        // 						'addressLine2', cuaddr.addressLine2,
        // 						'pincode', cuaddr.pincode,
        // 						'cityId', cuaddr.cityId,
        // 						'districtId', cuaddr.districtId,
        // 						'stateId', cuaddr.stateId,
        // 						'countryId', cuaddr.countryId,
        // 						'cityName', cuaddr.cityName,
        // 						'stateName', cuaddr.stateName,
        // 						'countryName', cuaddr.countryName,
        //                          'residentialStatus',cuaddr.residentialStatus,
        //                          'latitude',cuaddr.latitude,
        //                          'longitude',cuaddr.longitude
        //                  ) AS currentAddress,
        //                  (SELECT JSON_ARRAYAGG(JSON_OBJECT(
        // 						'id', ufdfd.id,
        // 						'userId', ufdfd.userId,
        // 						'name', ufdfd.name,
        // 						'memberType', ufdfd.memberType,
        // 						'memberSubType', ufdfd.memberSubType,
        // 						'educationId', ufdfd.educationId,
        // 						'occupationId', ufdfd.occupationId,
        // 						'maritalStatusId', ufdfd.maritalStatusId,
        // 						'isAlive', ufdfd.isAlive
        // 				))
        // 				 FROM userfamilydetail ufdfd
        // 				 WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
        //                  (SELECT JSON_OBJECT(
        //                          'id',ufdf.id,
        //                          'userId',ufdf.userId,
        //                          'name',ufdf.name,
        //                          'memberType',ufdf.memberType,
        //                          'memberSubType',ufdf.memberSubType,
        //                          'educationId',ufdf.educationId,
        //                          'occupationId',ufdf.occupationId,
        //                          'maritalStatusId',ufdf.maritalStatusId,
        //                          'isAlive',ufdf.isAlive
        // 				) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father')  AS fatherDetails,
        //                 (SELECT JSON_OBJECT(
        //                          'id',ufdm.id,
        //                          'userId',ufdm.userId,
        //                          'name',ufdm.name,
        //                          'memberType',ufdm.memberType,
        //                          'memberSubType',ufdm.memberSubType,
        //                          'educationId',ufdm.educationId,
        //                          'occupationId',ufdm.occupationId,
        //                          'maritalStatusId',ufdm.maritalStatusId,
        //                          'isAlive',ufdm.isAlive
        // 				) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' )  AS motherDetails,
        //                 uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
        //                 upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief,
        //                 upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId,
        //                 upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight,
        //     ((
        //             -- #1 Age
        //                ((case WHEN ((uppu.pFromAge  <= ( YEAR(CURDATE()) - YEAR(upa.birthDate) )) && (( YEAR(CURDATE()) - YEAR(upa.birthDate) )<= uppu.pToAge )) THEN 1 ELSE 0 END) * (CASE WHEN pw.name = 'pAge' THEN pw.weightage else 1 end)) +
        //             -- #2 Height
        //                 ((case WHEN ((uppu.pFromHeight <= h.name) && ( h.name <= uppu.pToHeight)) THEN 1 ELSE 0 END) *  (CASE WHEN pw.name = 'pHeight' THEN pw.weightage else 1 end) ) +
        //             -- #3 Marital Status
        //                 ((CASE WHEN (FIND_IN_SET (upa.maritalStatusId, (uppu.pMaritalStatusId)) > 0)  THEN 1
        //                       WHEN uppu.pMaritalStatusId = 0 THEN 0.5
        //                 ELSE 0 END) * (CASE WHEN pw.name = 'pMaritalStaus' THEN pw.weightage else 1 end) )+
        //             -- #4 Profile with children
        //                 ((case
        //                     WHEN (uppu.pProfileWithChildren = 1) THEN
        //             			CASE WHEN (upa.haveChildren = 1 || upa.haveChildren = 2 ) THEN 1 ElSE 0 END
        //             		WHEN (uppu.pProfileWithChildren = 2) THEN CASE WHEN (upa.haveChildren = 3) THEN 1 ElSE 0 END
        //                     WHEN ((uppu.pProfileWithChildren) = 0 ) THEN 0.5
        //             	ELSE 0 END) * (CASE WHEN pw.name = 'pProfileWithChildren' THEN pw.weightage else 1 end)) +
        //             -- #5 Family type
        //                 ((case WHEN(`+ screens[4].isDisable + ` = false) THEN
        //                     CASE
        //                         WHEN (upa.familyType = uppu.pFamilyType)  THEN 1
        //                         WHEN uppu.pFamilyType = 0 THEN 0.5
        //                     ELSE 0 END
        //             	ELSE 1 END) * (CASE WHEN pw.name = 'pFamilType' THEN pw.weightage else 1 end))
        //             	) / 4
        //             ) * 100 AS matchingPercentage  ,prea.weightage as we
        // 	FROM users u
        //     LEFT JOIN userdevicedetail udd ON udd.userId = u.id
        //     LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
        //     LEFT JOIN userroles ur ON ur.userId = u.id
        //     LEFT JOIN images img ON img.id = u.imageId
        //     LEFT JOIN religion r ON r.id = upa.religionId
        //     LEFT JOIN community c ON c.id = upa.communityId
        //     LEFT JOIN occupation o ON o.id = upa.occupationId
        //     LEFT JOIN education e ON e.id = upa.educationId
        //     LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
        //     LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
        //     LEFT JOIN addresses addr ON addr.id = upa.addressId
        //     LEFT JOIN cities cit ON addr.cityId = cit.id
        //     LEFT JOIN districts ds ON addr.districtId = ds.id
        //     LEFT JOIN state st ON addr.stateId = st.id
        //     LEFT JOIN countries cou ON addr.countryId = cou.id
        //     LEFT JOIN height h ON h.id = upa.heightId
        //     LEFT JOIN employmenttype em ON em.id = upa.employmenttypeId
        //     LEFT JOIN profilefor pf ON pf.id = upa.profileForId
        //     LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
        //     LEFT JOIN userpersonaldetailcustomdata updcd ON updcd.userId = u.id
        // 	LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
        //     LEFT JOIN addresses cuaddr ON cuaddr.id = upa.currentAddressId
        //     LEFT JOIN weight w ON w.id = upa.weight
        //     LEFT JOIN educationmedium edme ON edme.id = upa.educationMediumId
        //     LEFT JOIN educationtype edt ON edt.id = upa.educationTypeId
        //     LEFT JOIN userpartnerpreferences uppu ON uppu.userId = u.id AND  uppu.userId = 420
        //     CROSS JOIN preferenceweightage pw
        //     WHERE ur.roleId = 2 AND u.id != 420 AND u.id NOT IN (select userId from userproposals where status = 1 and proposalUserId = 420)
        //    AND u.id NOT IN (select proposalUserId from userproposals where status = 1 and userId = 420) AND (upa.userId = u.id) AND u.id  AND
        //     (
        //         u.id NOT IN (select userBlockId from userblock where userId = 420)
        //         and u.id NOT IN (select userId from userblock where userBlockId = 420)
        //         and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = 420)
        //     ) order by matchingPercentage desc ;
        // `
        let sql = `WITH preference_weights AS (
                      SELECT
                        MAX(CASE WHEN name = 'pAge' THEN weightage END) AS pAgeWeight,
                        MAX(CASE WHEN name = 'pHeight' THEN weightage END) AS pHeightWeight,
                        MAX(CASE WHEN name = 'pMaritalStatus' THEN weightage END) AS pMaritalStatusWeight,
                        MAX(CASE WHEN name = 'pProfileWithChildren' THEN weightage END) AS pProfileWithChildrenWeight,
                        MAX(CASE WHEN name = 'pFamilyType' THEN weightage END) AS pFamilyTypeWeight,
                        MAX(CASE WHEN name = 'pReligion' THEN weightage END) AS pReligionWeight,
                        MAX(CASE WHEN name = 'pCommunity' THEN weightage END) AS pCommunityWeight,
                        MAX(CASE WHEN name = 'pMotherTongue' THEN weightage END) AS pMotherTongueWeight,
                        MAX(CASE WHEN name = 'pHoroscopeBelief' THEN weightage END) AS pHoroscopeBeliefWeight,
                        MAX(CASE WHEN name = 'pManglikMatch' THEN weightage END) AS pManglikMatchWeight,
                        MAX(CASE WHEN name = 'pCountryLivingIn' THEN weightage END) AS pCountryLivingInWeight,
                        MAX(CASE WHEN name = 'pStateLivingIn' THEN weightage END) AS pStateLivingInWeight,
                        MAX(CASE WHEN name = 'pCityLivingIn' THEN weightage END) AS pCityLivingInWeight,
                        MAX(CASE WHEN name = 'pEducationType' THEN weightage END) AS pEducationTypeWeight,
                        MAX(CASE WHEN name = 'pEducationMedium' THEN weightage END) AS pEducationMediumWeight,
                        MAX(CASE WHEN name = 'pOccupation' THEN weightage END) AS pOccupationWeight,
                        MAX(CASE WHEN name = 'pEmploymentType' THEN weightage END) AS pEmploymentTypeWeight,
                        MAX(CASE WHEN name = 'pAnnualIncome' THEN weightage END) AS pAnnualIncomeWeight,
                        MAX(CASE WHEN name = 'pDiet' THEN weightage END) AS pDietWeight,
                        MAX(CASE WHEN name = 'pSmokingAcceptance' THEN weightage END) AS pSmokingAcceptanceWeight,
                        MAX(CASE WHEN name = 'pAlcoholAcceptance' THEN weightage END) AS pAlcoholAcceptanceWeight,
                        MAX(CASE WHEN name = 'pDisabilityAcceptance' THEN weightage END) AS pDisabilityAcceptanceWeight,
                        MAX(CASE WHEN name = 'pComplexion' THEN weightage END) AS pComplexionWeight,
                        MAX(CASE WHEN name = 'pBodyType' THEN weightage END) AS pBodyTypeWeight
                      FROM preferenceweightage
                    ),
                    disableScreen AS(
                    SELECT 
                        MAX(CASE WHEN name = 'isEnableFamilyDetails' THEN value END) AS isEnableFamilyDetails, 
                        MAX(CASE WHEN name = 'isEnableAstrologicDetails' THEN value END) AS isEnableAstrologicDetails,
                        MAX(CASE WHEN name = 'isEnableLifeStyles' THEN value END) AS isEnableLifeStyles
                        FROM systemflags
                    )
                    SELECT u.id, udd.fcmtoken, img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, u.isVerifyProfilePic, u.isDemoUser, upa.memberid,upa.isHideContactDetail
                        , upa.religionId, upa.communityId, upa.maritalStatusId, upa.occupationId, upa.educationId, upa.subCommunityId, upa.dietId, upa.annualIncomeId, upa.heightId, upa.birthDate
                        , upa.languages, upa.eyeColor, upa.businessName, upa.companyName, upa.employmentTypeId, upa.weight as weightId, upa.profileForId, upa.expectation, upa.aboutMe
                        ,upa.memberid, upa.anyDisability, upa.haveSpecs, upa.haveChildren, upa.noOfChildren, upa.bloodGroup, upa.complexion, upa.bodyType, upa.familyType, upa.motherTongue
                        , upa.currentAddressId, upa.nativePlace, upa.citizenship, upa.visaStatus, upa.designation, upa.educationTypeId, upa.educationMediumId, upa.drinking, upa.smoking
                        , upa.willingToGoAbroad, upa.areYouWorking,upa.addressId ,edt.name as educationType, edme.name as educationMedium
                        , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                        , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                        , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y') + 0 AS age,
                         JSON_OBJECT(
                                 'id',addr.id,
								'addressLine1', addr.addressLine1, 
								'addressLine2', addr.addressLine2, 
								'pincode', addr.pincode, 
								'cityId', addr.cityId, 
								'districtId', addr.districtId, 
								'stateId', addr.stateId, 
								'countryId', addr.countryId,
								'cityName', addr.cityName,
								'stateName', addr.stateName,
								'countryName', addr.countryName,
                                 'residentialStatus',addr.residentialStatus,
                                 'latitude',addr.latitude,
                                 'longitude',addr.longitude
                         ) AS permanentAddress,
                         JSON_OBJECT(
                                 'id', cuaddr.id,
								'addressLine1', cuaddr.addressLine1, 
								'addressLine2', cuaddr.addressLine2, 
								'pincode', cuaddr.pincode, 
								'cityId', cuaddr.cityId, 
								'districtId', cuaddr.districtId, 
								'stateId', cuaddr.stateId, 
								'countryId', cuaddr.countryId,
								'cityName', cuaddr.cityName,
								'stateName', cuaddr.stateName,
								'countryName', cuaddr.countryName,
                                 'residentialStatus',cuaddr.residentialStatus,
                                 'latitude',cuaddr.latitude,
                                 'longitude',cuaddr.longitude
                         ) AS currentAddress,
                         (SELECT JSON_ARRAYAGG(JSON_OBJECT(
								'id', ufdfd.id,
								'userId', ufdfd.userId,
								'name', ufdfd.name,
								'memberType', ufdfd.memberType,
								'memberSubType', ufdfd.memberSubType,
								'educationId', ufdfd.educationId,
								'occupationId', ufdfd.occupationId,
								'maritalStatusId', ufdfd.maritalStatusId,
								'isAlive', ufdfd.isAlive
						)) 
						 FROM userfamilydetail ufdfd
						 WHERE userId = u.id AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                         (SELECT JSON_OBJECT(
                                 'id',ufdf.id, 
                                 'userId',ufdf.userId, 
                                 'name',ufdf.name, 
                                 'memberType',ufdf.memberType, 
                                 'memberSubType',ufdf.memberSubType, 
                                 'educationId',ufdf.educationId, 
                                 'occupationId',ufdf.occupationId, 
                                 'maritalStatusId',ufdf.maritalStatusId, 
                                 'isAlive',ufdf.isAlive
						) FROM userfamilydetail ufdf WHERE ufdf.userId = u.id AND ufdf.memberSubType = 'Father' limit 1)  AS fatherDetails,
                           (SELECT JSON_OBJECT(
                                 'id',ufdm.id, 
                                 'userId',ufdm.userId, 
                                 'name',ufdm.name, 
                                 'memberType',ufdm.memberType, 
                                 'memberSubType',ufdm.memberSubType, 
                                 'educationId',ufdm.educationId, 
                                 'occupationId',ufdm.occupationId, 
                                 'maritalStatusId',ufdm.maritalStatusId, 
                                 'isAlive',ufdm.isAlive
						) FROM userfamilydetail ufdm WHERE ufdm.userId = u.id AND ufdm.memberSubType = 'Mother' limit 1)  AS motherDetails,
                        uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                        upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                        upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                        upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight,
                
                 ROUND( (( 
                            -- #1 Age 
                                (case WHEN ((uppu.pFromAge  <=(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y') + 0) ) && ((DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upa.birthDate)), '%Y') + 0)<= uppu.pToAge )) THEN 1 ELSE 0 END) * COALESCE(pw.pAgeWeight, 1) +
		                    -- #2 Height
                                (case WHEN ((uppu.pFromHeight <= h.name) && ( h.name <= uppu.pToHeight)) THEN 1 ELSE 0 END) * COALESCE(pw.pHeightWeight, 1) +
                            -- #3 Marital Status
                                (CASE WHEN (FIND_IN_SET (upa.maritalStatusId, (uppu.pMaritalStatusId)) > 0)  THEN 1 
                                WHEN uppu.pMaritalStatusId = 0 THEN 0.5
                                ELSE 0 END) * COALESCE(pw.pMaritalStatusWeight, 1) +
		                    -- #4 Profile with children
                                (case 
                                WHEN (uppu.pProfileWithChildren = 1) THEN
		            			    CASE WHEN (upa.haveChildren = 1 || upa.haveChildren = 2 ) THEN 1 ElSE 0 END
		            		            WHEN (uppu.pProfileWithChildren = 2) THEN CASE WHEN (upa.haveChildren = 3) THEN 1 ElSE 0 END
                                        WHEN ((uppu.pProfileWithChildren) = 0 ) THEN 0.5
		            	            ELSE 0 END) * COALESCE(pw.pProfileWithChildrenWeight, 1)  +
		                    -- #5 Family type
                                (case WHEN(sys.isEnableFamilyDetails = true) THEN
                                    CASE
                                        WHEN (upa.familyType = uppu.pFamilyType)  THEN 1 
                                        WHEN uppu.pFamilyType = 0 THEN 0.5
                                     ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pFamilyTypeWeight, 1) +
		                    -- #6 Religion 
                                (CASE 
		            		        WHEN (FIND_IN_SET (upa.religionId, (uppu.pReligionId)) > 0)  THEN 1 
                                    WHEN uppu.pReligionId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pReligionWeight, 1) +
		                    --  #7 Community
                                (CASE 
		            		        WHEN (FIND_IN_SET (upa.communityId, (uppu.pCommunityId)) > 0)  THEN 1 
                                    WHEN uppu.pCommunityId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pCommunityWeight, 1) +
		                    --  #8 Mother tongue
                                (CASE 
		            		        WHEN (FIND_IN_SET (upa.motherTongue, (uppu.pMotherTongue)) > 0)  THEN 1 
		            	            ELSE 0 END) * COALESCE(pw.pMotherTongueWeight, 1) +
		                    --  #9 Horoscope Belief
                                (CASE WHEN(sys.isEnableAstrologicDetails = true) THEN
                                    CASE
		            		            WHEN (uatd.horoscopeBelief = uppu.pHoroscopeBelief )  THEN 1 
                                        WHEN uppu.pHoroscopeBelief = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pHoroscopeBeliefWeight, 1) +
                            --  #10  Manglik Match
                                (CASE WHEN(sys.isEnableAstrologicDetails = true) THEN
                                CASE
		            		            WHEN (uatd.manglik = uppu.pManglikMatch)  THEN 1 
                                        WHEN uppu.pManglikMatch = 0 THEN 0.5
                                ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pManglikMatchWeight, 1) +
		                    -- #11 Country
		            	        (case 
                                        WHEN (FIND_IN_SET (addr.countryId, uppu.pCountryLivingInId) > 0 )  THEN 1 
                                        WHEN uppu.pCountryLivingInId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pCountryLivingInWeight, 1) +
                            -- #12 State
		            	        (case 
                                    WHEN (FIND_IN_SET (addr.stateId, uppu.pStateLivingInId) > 0 )  THEN 1 
                                    WHEN uppu.pStateLivingInId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pStateLivingInWeight, 1) +
                            -- #13 City
		            	        (case 
                                    WHEN (FIND_IN_SET (addr.cityId, uppu.pCityLivingInId) > 0 )  THEN 1
                                    WHEN uppu.pCityLivingInId = 0 THEN 0.5 
		            	        ELSE 0 END) * COALESCE(pw.pCityLivingInWeight, 1) +
                            -- #14 Education Type
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.educationTypeId, uppu.pEducationTypeId) > 0 )  THEN 1 
                                    WHEN uppu.pEducationTypeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEducationTypeWeight, 1) +
                            -- #15 Education Medium
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.educationMediumId, uppu.pEducationMediumId) > 0 )  THEN 1 
                                    WHEN uppu.pEducationMediumId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEducationMediumWeight, 1) +
                            -- #16 Occupation
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.occupationId, uppu.pOccupationId) > 0 )  THEN 1 
                                    WHEN uppu.pOccupationId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pOccupationWeight, 1) +
                            -- #17 Employment Type
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.employmentTypeId, uppu.pEmploymentTypeId) > 0 )  THEN 1 
                                    WHEN uppu.pEmploymentTypeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pEmploymentTypeWeight, 1) +
                            -- #18 Annual Income
		            	        (case 
                                    WHEN (FIND_IN_SET (upa.annualIncomeId, uppu.pAnnualIncomeId) > 0 )  THEN 1 
                                    WHEN uppu.pAnnualIncomeId = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pAnnualIncomeWeight, 1) +
                            -- #19 Diet
		            	        (case WHEN(sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (FIND_IN_SET (upa.dietId, uppu.pDietId) > 0 )  THEN 1 
                                        WHEN uppu.pDietId = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * COALESCE(pw.pDietWeight, 1) +
                            -- #20 Smoking
		            	        (case WHEN(sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (upa.smoking = uppu.pSmokingAcceptance )  THEN 1 
                                        WHEN uppu.pSmokingAcceptance = 0 THEN 0.5
                                    ELSE 0 END
		            	        ELSE 1 END) * (COALESCE(pw.pSmokingAcceptanceWeight, 1) +
                            -- #21 Alcohol
		            	        (case WHEN (sys.isEnableLifeStyles = true) THEN
                                    CASE
                                        WHEN (upa.drinking = uppu.pAlcoholAcceptance )  THEN 1 
                                        WHEN uppu.pAlcoholAcceptance = 0 THEN 0.5
                                    ELSE 0 END 
		            	        ELSE 1 END) * COALESCE(pw.pAlcoholAcceptanceWeight, 1) +
                            -- #22 Disability Acceptance
		            	        (case 
                                        WHEN (upa.anyDisability = uppu.pDisabilityAcceptance )  THEN 1 
                                        WHEN uppu.pDisabilityAcceptance = 0 THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pDisabilityAcceptanceWeight, 1) +
                            --  #23 Complexion
                                (CASE 
		            		            WHEN (FIND_IN_SET (upa.complexion, (uppu.pComplexion)) > 0)  THEN 1 
                                        WHEN uppu.pComplexion = 'Open For All' THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pComplexionWeight, 1) +
                            --  #24 Body Type
                                (CASE 
		            		            WHEN (FIND_IN_SET (upa.bodyType, (uppu.pBodyType)) > 0)  THEN 1 
                                        WHEN uppu.pBodyType = 'Open For All' THEN 0.5
		            	        ELSE 0 END) * COALESCE(pw.pBodyTypeWeight, 1)
                            ) )/ (
                                COALESCE(pw.pAgeWeight, 1) +
                                COALESCE(pw.pHeightWeight, 1)+
                                COALESCE(pw.pMaritalStatusWeight, 1) +
                                COALESCE(pw.pProfileWithChildrenWeight, 1) +
                                COALESCE(pw.pFamilyTypeWeight, 1) +
                                COALESCE(pw.pReligionWeight, 1) +
                                COALESCE(pw.pCommunityWeight, 1) +
                                COALESCE(pw.pMotherTongueWeight, 1) +
                                COALESCE(pw.pHoroscopeBeliefWeight, 1) +
                                COALESCE(pw.pManglikMatchWeight, 1) +
                                COALESCE(pw.pCountryLivingInWeight, 1) +
                                COALESCE(pw.pStateLivingInWeight, 1) +
                                COALESCE(pw.pCityLivingInWeight, 1) +
                                COALESCE(pw.pEducationTypeWeight, 1) +
                                COALESCE(pw.pEducationMediumWeight, 1) +
                                COALESCE(pw.pOccupationWeight, 1) +
                                COALESCE(pw.pEmploymentTypeWeight, 1) +
                                COALESCE(pw.pAnnualIncomeWeight, 1) +
                                COALESCE(pw.pSmokingAcceptanceWeight, 1) +
                                COALESCE(pw.pAlcoholAcceptanceWeight, 1) +
                                COALESCE(pw.pDisabilityAcceptanceWeight, 1) +
                                COALESCE(pw.pComplexionWeight, 1) +
                                COALESCE(pw.pBodyTypeWeight, 1) 
                        ))
                        * 100 ) AS matchingPercentage 
            , IF((select COUNT(id) from userproposals where (userId = ` +
            userId +
            ` AND proposalUserId = u.id) OR (proposalUserId = ` +
            userId +
            ` AND userId = u.id)) > 0,true,false) as isProposed
            , IF((select COUNT(id) from userproposals where (userId = ` +
            userId +
            ` AND proposalUserId = u.id) ) > 0,true,false) as isProposalReceived
            , IF((select COUNT(id) from userproposals where (proposalUserId = ` +
            userId +
            ` AND userId = u.id)) > 0,true,false) as isProposalSent
            ,  IF((select COUNT(id) from userproposals where ((proposalUserId = u.id AND userId = ` +
            userId +
            `) OR (userId = u.id AND proposalUserId = ` +
            userId +
            `)) AND hascancelled = 1) > 0,true,false) as hascancelled
            , (select status from userproposals where ((proposalUserId = u.id AND userId = ` +
            userId +
            `) OR (userId = u.id AND proposalUserId = ` +
            userId +
            `)) AND hascancelled = 0 ) as proposalStatus
            , u.id IN (select favUserId from userfavourites where userId = ` +
            userId +
            `) as isFavourite 

            FROM users u
            LEFT JOIN userdevicedetail udd ON udd.userId = u.id
            LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
            LEFT JOIN userroles ur ON ur.userId = u.id
            LEFT JOIN images img ON img.id = u.imageId
            LEFT JOIN religion r ON r.id = upa.religionId
            LEFT JOIN community c ON c.id = upa.communityId
            LEFT JOIN occupation o ON o.id = upa.occupationId
            LEFT JOIN education e ON e.id = upa.educationId
            LEFT JOIN subcommunity sc ON sc.id = upa.subCommunityId
            LEFT JOIN annualincome ai ON ai.id = upa.annualIncomeId
            LEFT JOIN addresses addr ON addr.id = upa.addressId
            LEFT JOIN cities cit ON addr.cityId = cit.id
            LEFT JOIN districts ds ON addr.districtId = ds.id
            LEFT JOIN state st ON addr.stateId = st.id
            LEFT JOIN countries cou ON addr.countryId = cou.id
            LEFT JOIN height h ON h.id = upa.heightId            
            LEFT JOIN employmenttype em ON em.id = upa.employmenttypeId
            LEFT JOIN userpersonaldetailcustomdata updcd ON updcd.userId = u.id
            LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
            LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
            LEFT JOIN addresses cuaddr ON cuaddr.id = upa.currentAddressId
            LEFT JOIN weight w ON w.id = upa.weight
            LEFT JOIN educationmedium edme ON edme.id = upa.educationMediumId
            LEFT JOIN educationtype edt ON edt.id = upa.educationTypeId
            LEFT JOIN userpartnerpreferences uppu ON uppu.userId = ` +
            userId +
            `
            CROSS JOIN preference_weights pw
            CROSS JOIN disableScreen sys
            
            WHERE u.isProfileCompleted = 1 AND ur.roleId = 2 AND u.id != ` +
            userId +
            ` AND u.id NOT IN (select userId from userproposals where status = 1 and proposalUserId = ` +
            userId +
            `) 
        AND u.id NOT IN (select proposalUserId from userproposals where status = 1 and userId = ` +
            userId +
            `) GROUP BY u.id`;
        console.log(sql);
        let result = yield apiHeader_1.default.query(sql);
        let data = {
            users: result,
            screens: screens
        };
        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Master Data Successfully', data, 1, '');
        return res.status(200).send(successResult);
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getUsers() Exception', error, '');
        next(errorResult);
    }
});
const getLanguages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let getSql = "SELECT * FROM languages WHERE isActive = 1 AND isDelete = 0";
        let languages = yield apiHeader_1.default.query(getSql);
        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Languages Successfully', languages, 1, '');
        return res.status(200).send(successResult);
    }
    catch (error) {
        next(error);
        res.status(500).json({ message: "Error Get Languages" });
    }
});
const addEditGalleryImageList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Add User Images');
        let requiredFields = ['userId', 'images'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = req.body.userId;
                let images = req.body.images;
                let imageId = req.body.imageId;
                let operationImageId = req.body.operationImageId;
                let result;
                if (!Array.isArray(images) || images.length === 0) {
                    return res.status(400).send({ message: "No images provided." });
                }
                let getUserImage = `SELECT * From userimagegallery WHERE userId = ${userId}`;
                let resultOfImage = yield apiHeader_1.default.query(getUserImage);
                for (let i = 0; i < resultOfImage.length; i++) {
                    if (operationImageId == resultOfImage[i].id) {
                        yield deleteImage(resultOfImage[i].imageUrl); // Delete old image if exists
                    }
                }
                let deleteAllImageOfUser = `DELETE From userimagegallery WHERE userId = ${userId}`;
                yield apiHeader_1.default.query(deleteAllImageOfUser);
                for (let i = 0; i < images.length; i++) {
                    if (images[i] && images[i].indexOf('content') == -1) {
                        let data = images[i].split(',');
                        if (data && data.length > 1) {
                            images[i] = images[i].split(',')[1];
                        }
                        let dir = './content';
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        let dir1 = './content/user';
                        if (!fs.existsSync(dir1)) {
                            fs.mkdirSync(dir1);
                        }
                        let dir2 = `./content/user/${userId}`;
                        if (!fs.existsSync(dir2)) {
                            fs.mkdirSync(dir2);
                        }
                        let dir3 = `./content/user/${userId}/gallery`;
                        if (!fs.existsSync(dir3)) {
                            fs.mkdirSync(dir3);
                        }
                        const fileContentsUser = new Buffer(images[i], 'base64');
                        // Generate a unique number using Date.now()
                        let uniqueNumber = Date.now();
                        let imgPath = `./content/user/${userId}/gallery/${uniqueNumber}-realImg.jpeg`;
                        fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                            if (err)
                                return console.error(err);
                            console.log('file saved imagePath');
                        });
                        let insertUserImagesQuery = `INSERT INTO userimagegallery(userId, imageUrl, createdBy, modifiedBy) VALUES ("${userId}", "${imgPath.substring(2)}" ,"${userId}","${userId}")`;
                        result = yield apiHeader_1.default.query(insertUserImagesQuery);
                    }
                    else {
                        let insertUserImagesQuery = `INSERT INTO userimagegallery(userId, imageUrl,createdBy, modifiedBy) VALUES ("${userId}","${images[i]}","${userId}","${userId}")`;
                        yield apiHeader_1.default.query(insertUserImagesQuery);
                    }
                }
                if (result.affectedRows > 0) {
                    logging_1.default.info(NAMESPACE, 'Image Has been Added in userimagegallery table');
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Add User Gallery Image', result, result.length, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        return res.status(500).send({ message: 'Server Error', error });
    }
});
function deleteImage(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fs.rmSync(path, {
                force: true,
            });
        }
        catch (error) {
            console.log("Error while deleting image: " + error);
            return "";
        }
    });
}
const getGalleryImageList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Get User Images');
        let requiredFields = ['userId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = req.body.userId;
                let getUserImage = `SELECT * From userimagegallery WHERE userId = ${userId}`;
                let userResult = yield apiHeader_1.default.query(getUserImage);
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Getting User Profile Pic', userResult, userResult.length, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        return res.status(500).send({ message: 'Server Error', error });
    }
});
const deleteGalleryImages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Delete User Images From gallery');
        let requiredFields = ['userId', 'imageId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = req.body.userId;
                let imageId = req.body.imageId;
                let getUserImage = `SELECT * From userimagegallery WHERE userId = ${userId} AND id = ${imageId}`;
                let resultOfImage = yield apiHeader_1.default.query(getUserImage);
                yield deleteImage(resultOfImage[0].imageUrl); // Delete old image if exists
                let deleteAllImageOfUser = `DELETE From userimagegallery WHERE userId = ${userId} AND id = ${imageId}`;
                let result = yield apiHeader_1.default.query(deleteAllImageOfUser);
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'profile Image Deleted', result, result.length, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        return res.status(500).send({ message: 'Server Error', error });
    }
});
// Generate OTP function
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
const sendOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Send OTP');
        // Define required fields
        let requiredFields = ['mobileNumber'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            // Extract mobileNumber from request body
            let mobileNumber = req.body.mobileNumber;
            // Generate OTP and set expiration time (5 minutes from now)
            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 1 * 60000); //OTP will Expire after 5 minutes
            const createdAt = new Date();
            //get values from system falg
            let getSystemFlagData = `SELECT value FROM systemflags WHERE name = "providerBaseURL" OR name = "apiKey" OR name = "senderId" OR name =  "otpMessageTemplate";`;
            var result = yield apiHeader_1.default.query(getSystemFlagData);
            if (result && result.length > 0) {
                const providerBaseURL = result[0].value;
                const apiKey = result[1].value;
                const senderId = result[2].value;
                const otpMessageTemplate = result[3].value;
                // Save OTP to the database
                const insertSql = 'INSERT INTO userOTP (mobileNumber, otp, createdAt, expiresAt) VALUES (?, ?, ?, ?)';
                var result = yield apiHeader_1.default.query(insertSql, [mobileNumber, otp, createdAt, expiresAt]);
                //encod URL
                const message = `${otp} ${otpMessageTemplate}`;
                const encodedMessage = encodeURIComponent(message);
                // Send the OTP via SMS
                yield axios_1.default.get(`${providerBaseURL}apikey=${apiKey}&sender=${senderId}&mobileno=${mobileNumber}&text=${encodedMessage}`);
                // Respond with success
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'OTP sent successfully', [], 0, '');
                return res.status(200).send(successResult);
            }
        }
        else {
            // Validation failed
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, false, validationResult.message, new Error(validationResult.message), '');
            return res.status(validationResult.statusCode).send(errorResult);
        }
    }
    catch (error) {
        logging_1.default.info(NAMESPACE, `Error in sendOTP: ${error.message}`);
        let errorResult = new resulterror_1.ResultError(500, false, 'Error sending OTP', error, '');
        return res.status(500).send(errorResult);
    }
});
exports.sendOTP = sendOTP;
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Verify OTP');
        // Define required fields
        let requiredFields = ['mobileNumber', 'otp'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            // Extract mobileNumber and otp from request body
            let mobileNumber = req.body.mobileNumber;
            let otp = req.body.otp;
            // Retrieve the latest unused OTP for the mobile number
            const selectSql = 'SELECT * FROM userOTP WHERE mobileNumber = ? AND isUsed = 0 AND otp = ? ORDER BY createdAt DESC LIMIT 1';
            const results = yield apiHeader_1.default.query(selectSql, [mobileNumber, otp]);
            if (results.length === 0) {
                // No valid OTP found
                let errorResult = new resulterror_1.ResultError(400, false, 'No valid OTP found for this mobile number', new Error('No valid OTP'), '');
                return res.status(400).send(errorResult);
            }
            const savedOtp = results[0].otp;
            const expiresAt = new Date(results[0].expiresAt);
            const currentTime = new Date();
            if (currentTime > expiresAt) {
                // OTP has expired, mark it as used
                const updateSql = 'UPDATE userOTP SET isUsed = 1 WHERE id = ?';
                yield apiHeader_1.default.query(updateSql, [results[0].id]);
                let errorResult = new resulterror_1.ResultError(400, false, 'OTP has expired', new Error('OTP has expired'), '');
                return res.status(400).send(errorResult);
            }
            if (savedOtp === otp) {
                // OTP is correct, mark it as used
                const updateSql = 'UPDATE userOTP SET isUsed = 1 WHERE id = ?';
                yield apiHeader_1.default.query(updateSql, [results[0].id]);
                //delete reocrde after otp successfully send
                const deleteSql = 'DELETE FROM userOTP WHERE mobileNumber = ?';
                yield apiHeader_1.default.query(deleteSql, [mobileNumber]);
                // Respond with success
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'OTP verified successfully', [], 0, '');
                return res.status(200).send(successResult);
            }
            else {
                // OTP is incorrect
                let errorResult = new resulterror_1.ResultError(400, false, 'Invalid OTP', new Error('Invalid OTP'), '');
                return res.status(400).send(errorResult);
            }
        }
        else {
            // Validation failed
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, false, validationResult.message, new Error(validationResult.message), '');
            return res.status(validationResult.statusCode).send(errorResult);
        }
    }
    catch (error) {
        logging_1.default.info(NAMESPACE, `Error in verifyOTP: ${error.message}`);
        let errorResult = new resulterror_1.ResultError(500, false, 'Error verifying OTP', error, '');
        return res.status(500).send(errorResult);
    }
});
// CROSS JOIN preferenceweightage pw
exports.default = {
    deleteGalleryImages, getGalleryImageList, addEditGalleryImageList, getLanguages,
    verifyEmailContact, signUp, login, checkContactNoExist, registerViaPhone, getMasterData, updateUserProfilePic, getAllUsers, viewUserDetail, updateUserProfileDetail, forgotPassword,
    verifyforgotPasswordLink, resetPassword, changePassword, changeContact, changeEmail, searchUser, updateUserFlagValues, validateAuthToken, getNearestApplicant, getMostViewedApplicant,
    completeUserProfile, deleteAccount, getUsers, completeUserProfileV2, TestingAPI, generateMemberIdTestingAPI, verifyOTP, sendOTP: exports.sendOTP
};
