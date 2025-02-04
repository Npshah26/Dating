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
const logging_1 = __importDefault(require("../../config/logging"));
const apiHeader_1 = __importDefault(require("../../middleware/apiHeader"));
const resultsuccess_1 = require("../../classes/response/resultsuccess");
const resulterror_1 = require("../../classes/response/resulterror");
const notifications_1 = __importDefault(require("./../notifications"));
const customFields_1 = __importDefault(require("../../controllers/app/customFields"));
const fs = require('fs');
var Jimp = require('jimp');
const Cryptr = require('cryptr');
// const mysql = require('mysql');
// const util = require('util');
// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });
// const query = util.promisify(connection.query).bind(connection);
const NAMESPACE = 'App Users';
const getAppUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting App Users');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            // this help to go to first page while searching
            // if (req.body.searchString) {
            //     startIndex = 0;
            // }
            let countSql = `SELECT COUNT(*) as totalCount FROM users
                            LEFT JOIN userroles ur ON ur.userId = users.id
                            WHERE users.isDelete = 0 AND ur.roleId = 2 AND users.firstName IS NOT NULL`;
            if (req.body.searchString) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                // countSql +=
                //     ` (users.firstName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.middleName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.lastName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.email LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.contactNo LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.gender LIKE '%` +
                //     req.body.searchString +
                //     `%')`;
                // countSql +=
                //     ` (users.firstName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.middleName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.lastName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.email LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.contactNo LIKE '%` +
                //     req.body.searchString +
                //     `%' OR (users.gender = '` +
                //     req.body.searchString +
                //     `' OR (users.gender LIKE '%` +
                //     req.body.searchString +
                //     `%') AND '` +
                //     req.body.searchString +
                //     `' <> 'male'))`;
                countSql +=
                    ` (users.firstName LIKE '%` +
                        req.body.searchString +
                        `%' 
                        OR users.middleName LIKE '%` +
                        req.body.searchString +
                        `%' 
                        OR users.lastName LIKE '%` +
                        req.body.searchString +
                        `%'
                        OR CONCAT(users.firstName, ' ', IFNULL(users.middleName, ''), ' ', users.lastName) LIKE '%` +
                        req.body.searchString +
                        `%'
                        OR users.email LIKE '%` +
                        req.body.searchString +
                        `%'
                        OR users.contactNo LIKE '%` +
                        req.body.searchString +
                        `%'
                        OR (users.gender = '` +
                        req.body.searchString +
                        `' 
                        OR (users.gender LIKE '%` +
                        req.body.searchString +
                        `%') 
                        AND '` +
                        req.body.searchString +
                        `' <> 'male'))`;
            }
            let countResult = yield apiHeader_1.default.query(countSql);
            // Reset to first page if necessary when searching in pagination page 2
            // if (countResult[0].totalCount <= startIndex) {
            //     startIndex = 0; 
            // }
            let sql = ` SELECT users.*,i.imageUrl as imageUrl, ur.roleId as roleId FROM users
                        LEFT JOIN userroles ur ON ur.userId = users.id
                        LEFT JOIN images i ON  i.id = users.imageId
                        WHERE users.isDelete = 0 AND ur.roleId = 2 AND users.firstName IS NOT NULL`;
            if (req.body.searchString) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                // sql +=
                //     ` (users.firstName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.middleName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.lastName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.email LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.contactNo LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.gender LIKE '%` +
                //     req.body.searchString +
                //     `%') `;
                // sql +=
                //     ` (users.firstName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.middleName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.lastName LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.email LIKE '%` +
                //     req.body.searchString +
                //     `%' OR users.contactNo LIKE '%` +
                //     req.body.searchString +
                //     `%' OR (users.gender = '` +
                //     req.body.searchString +
                //     `' OR (users.gender LIKE '%` +
                //     req.body.searchString +
                //     `%') AND '` +
                //     req.body.searchString +
                //     `' <> 'male')) `;
                sql +=
                    ` (users.firstName LIKE '%` +
                        req.body.searchString +
                        `%' 
                        OR users.middleName LIKE '%` +
                        req.body.searchString +
                        `%' 
                        OR users.lastName LIKE '%` +
                        req.body.searchString +
                        `%'
                        OR CONCAT(users.firstName, ' ', IFNULL(users.middleName, ''), ' ', users.lastName) LIKE '%` +
                        req.body.searchString +
                        `%'
                        OR users.email LIKE '%` +
                        req.body.searchString +
                        `%'
                        OR users.contactNo LIKE '%` +
                        req.body.searchString +
                        `%'
                        OR (users.gender = '` +
                        req.body.searchString +
                        `' 
                        OR (users.gender LIKE '%` +
                        req.body.searchString +
                        `%') 
                        AND '` +
                        req.body.searchString +
                        `' <> 'male')) `;
            }
            sql += ` ORDER BY users.id DESC`;
            if (startIndex != null && fetchRecord != null) {
                sql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + result[i].id;
                    let documentsResult = yield apiHeader_1.default.query(documentsSql);
                    result[i].userDocuments = documentsResult;
                }
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get App Users Successfully', result, countResult[0].totalCount, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'appUsers.getAppUsers() Exception', error, '');
        next(errorResult);
    }
});
const viewAppUserPerDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Aoo User Detail');
        let requiredFields = ['userId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userPerDetailSql = `SELECT u.id, img.imageUrl,u.firstName, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic,u.lastCompletedScreen,u.isProfileCompleted
                                        , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                        , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                        ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                        , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                        , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium 
                                        , r.name as religion, ms.name as maritalStatus, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, d.name as diet, h.name as height
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
                    req.body.userId +
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
                                                 'isAlive',ufdf.isAlive,
                                                 'occupation', o.name,
                                                 'education', e.name
									        ) FROM userfamilydetail ufdf 
                                            LEFT JOIN occupation o ON o.id = ufdf.occupationId 
                                            LEFT JOIN education e ON e.id = ufdf.educationId
                                            WHERE ufdf.userId = ` +
                    req.body.userId +
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
                                                 'isAlive',ufdm.isAlive,
                                                 'occupation', o.name,
                                                 'education',e.name
                                                 ) FROM userfamilydetail ufdm 
                                            LEFT JOIN occupation o ON o.id = ufdm.occupationId 
                                            LEFT JOIN education e ON e.id = ufdm.educationId
                                            WHERE ufdm.userId = ` +
                    req.body.userId +
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
                                            LEFT JOIN maritalstatus ms ON ms.id = upd.maritalStatusId
                                            LEFT JOIN community c ON c.id = upd.communityId
                                            LEFT JOIN occupation o ON o.id = upd.occupationId
                                            LEFT JOIN education e ON e.id = upd.educationId
                                            LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                            LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                            LEFT JOIN diet d ON d.id = upd.dietId
                                            LEFT JOIN height h ON h.id = upd.heightId
                                            LEFT JOIN addresses addr ON addr.id = upd.addressId
                                            LEFT JOIN cities cit ON addr.cityId = cit.id
                                            LEFT JOIN districts ds ON addr.districtId = ds.id
                                            LEFT JOIN state st ON addr.stateId = st.id
                                            LEFT JOIN countries cou ON addr.countryId = cou.id
                                            LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                            LEFT JOIN profilefor pf ON pf.id = upd.profileForId
                                            LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                            LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                            LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                            LEFT JOIN weight w ON w.id = upd.weight
                                            LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                            LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                            WHERE ur.roleId = 2 AND u.id = ` +
                    req.body.userId;
                console.log(userPerDetailSql);
                let result = yield apiHeader_1.default.query(userPerDetailSql);
                let screen;
                if (result) {
                    if (result.length > 0) {
                        const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
                        for (let i = 0; i < result.length; i++) {
                            let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + req.body.userId;
                            let documentsResult = yield apiHeader_1.default.query(documentsSql);
                            result[i].userDocuments = documentsResult;
                            result[i].userWalletAmount = 0;
                            let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + result[i].id;
                            let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                            if (getUserWalletResult && getUserWalletResult.length > 0) {
                                result[i].userWalletAmount = getUserWalletResult[i].amount;
                            }
                            if (isCustomFieldEnabled) {
                                let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + req.body.userId;
                                let userCustomDataResult = yield apiHeader_1.default.query(userCustomDataSql);
                                let customdata = [];
                                if (userCustomDataResult && userCustomDataResult.length > 0) {
                                    const userCustomDataArrays = [];
                                    const keys = Object.keys(userCustomDataResult[0]);
                                    userCustomDataArrays.push(keys);
                                    const filteredColumns = keys.filter((col) => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                                    for (let i = 0; i < filteredColumns.length; i++) {
                                        let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[i] + `' and isActive = 1`;
                                        let result = yield apiHeader_1.default.query(sql);
                                        let userDataSql = `SELECT ` + filteredColumns[i] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + req.body.userId;
                                        let userDataResult = yield apiHeader_1.default.query(userDataSql);
                                        let mergedResult = Object.assign({}, result[0], userDataResult[0]);
                                        customdata.push(mergedResult);
                                        console.log(userCustomDataResult);
                                    }
                                    if (customdata && customdata.length > 0) {
                                        for (let i = 0; i < customdata.length; i++) {
                                            if (customdata[i].valueList) {
                                                const valueListArray = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(';') : customdata[i].valueList;
                                                customdata[i].valueList = valueListArray;
                                            }
                                            if (customdata[i].value && typeof customdata[i].value === 'string') {
                                                if (customdata[i].valueTypeId == 10) {
                                                    const valueArray = customdata[i].value.includes(';') ? customdata[i].value.split(';') : [customdata[i].value];
                                                    customdata[i].value = valueArray;
                                                }
                                            }
                                        }
                                    }
                                    result[i].customFields = customdata;
                                }
                            }
                            let userDetailResponse = yield customFields_1.default.getUserData(result[i]);
                            result[i] = Object.assign(Object.assign({}, result[i]), userDetailResponse);
                        }
                    }
                    let data = {
                        userDetail: result
                    };
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get App User Detail Successfully', data, result.length, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'appUsers.viewAppUserDetail() Error', new Error('Error While Getting Data'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'appUsers.viewAppUserDetail() Exception', error, '');
        next(errorResult);
    }
});
const viewAppUserSendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting App User Send Requests');
        let requiredFields = ['userId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
                let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
                let countSql = `SELECT count(id) as totalRecords FROM userproposals
                WHERE userId = ` + req.body.userId;
                let countResult = yield apiHeader_1.default.query(countSql);
                let proSendReqSql = `SELECT up.*, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl FROM userproposals up
                LEFT JOIN users u ON u.id = up.proposalUserId
                LEFT JOIN images img ON img.id = u.imageId
                WHERE up.isDelete = 0 And up.userId = ` + req.body.userId;
                if (startIndex != null && fetchRecord != null) {
                    proSendReqSql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
                }
                let result = yield apiHeader_1.default.query(proSendReqSql);
                if (result) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get App User Send Requests Successfully', result, countResult[0].totalRecords, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'appUsers.viewAppUserSendRequest() Error', new Error('Error While Getting Data'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'appUsers.viewAppUserDetail() Exception', error, '');
        next(errorResult);
    }
});
const viewAppUserGotRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting App User Got Requests');
        let requiredFields = ['userId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
                let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
                let countSql = `SELECT count(id) as totalRecords FROM userproposals
                WHERE proposalUserId = ` + req.body.userId;
                let countResult = yield apiHeader_1.default.query(countSql);
                let propGotReqSql = `SELECT up.*, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl FROM userproposals up
                LEFT JOIN users u ON u.id = up.userId
                LEFT JOIN images img ON img.id = u.imageId
                WHERE up.isDelete = 0 And up.proposalUserId = ` + req.body.userId;
                if (startIndex != null && fetchRecord != null) {
                    propGotReqSql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
                }
                let result = yield apiHeader_1.default.query(propGotReqSql);
                if (result) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get App User Got Requests Successfully', result, countResult[0].totalRecords, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'appUsers.viewAppUserGotRequest() Error', new Error('Error While Getting Data'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'appUsers.viewAppUserGotRequest() Exception', error, '');
        next(errorResult);
    }
});
const viewAppUserFavourites = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting App Users Favourites');
        let requiredFields = ['userId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
                let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
                let countSql = `SELECT count(id) as totalRecords FROM userfavourites
                WHERE userId = ` + req.body.userId;
                let countResult = yield apiHeader_1.default.query(countSql);
                let favSql = `SELECT uf.*, u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl FROM userfavourites uf
                LEFT JOIN users u ON u.id = uf.favUserId
                LEFT JOIN images img ON img.id = u.imageId
                WHERE uf.isDelete = 0 And uf.userId = ` + req.body.userId;
                if (startIndex != null && fetchRecord != null) {
                    favSql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
                }
                let result = yield apiHeader_1.default.query(favSql);
                if (result) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get App User Favourites Successfully', result, countResult[0].totalRecords, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'appUsers.viewAppUserFavourites() Error', new Error('Error While Getting Data'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'appUsers.viewAppUserFavourites() Exception', error, '');
        next(errorResult);
    }
});
const viewBlockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'View Block User');
        let requiredFields = ['userId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
                let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
                let countSql = `SELECT count(id) as totalRecords FROM userblock
                WHERE userId = ` + req.body.userId;
                let countResult = yield apiHeader_1.default.query(countSql);
                let blockReqSql = `select ub.*,u.firstName, u.lastName, u.gender, u.email, u.contactNo, img.imageUrl from userblock ub 
                left join users u on u.id = ub.userblockId
                left join images img on u.imageId = img.id
                where userId = ` + req.body.userId;
                if (startIndex != null && fetchRecord != null) {
                    blockReqSql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
                }
                let result = yield apiHeader_1.default.query(blockReqSql);
                if (result) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'View Block User Successfully', result, countResult[0].totalRecords, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'appUsers.viewBlockUser() Error', new Error('Error While Getting Data'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'appUsers.viewBlockUser() Exception', error, '');
        next(errorResult);
    }
});
const unblockUserRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Updating User Block Request');
        let requiredFields = ['id', 'status'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let sql = `UPDATE userblockrequest SET status = ` + req.body.status + ` WHERE blockRequestUserId = ` + req.body.id;
                result = yield apiHeader_1.default.query(sql);
                let updateSql = `UPDATE users SET isDisable = ` + req.body.status + `, modifiedDate = CURRENT_TIMESTAMP WHERE id =` + req.body.id;
                result = yield apiHeader_1.default.query(updateSql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Block Request Sucessfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'userBlockRequest.updateUserBlockRequest() Error', new Error('Error While Updating Data'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'userBlockRequest.updateUserBlockRequest() Exception', error, '');
        next(errorResult);
    }
});
const approveDocument = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Approve Document');
        let requiredFields = ['id', 'isVerified'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let updateSql = `UPDATE userdocument SET isVerified = ` + req.body.isVerified + `, modifiedDate = CURRENT_TIMESTAMP(), modifiedBy = ` + userId + ` WHERE id = ` + req.body.id;
                result = yield apiHeader_1.default.query(updateSql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Approve/Reject User Document', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'appUsers.approveDocument() Error', new Error('Error While Updating Data'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'appUsers.approveDocument() Exception', error, '');
        next(errorResult);
    }
});
const getUserPackages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting User Packages');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
                let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
                let countSql = `SELECT COUNT(up.id) as totalCount FROM  userpackage up
                LEFT JOIN package p on p.id= up.packageId
                LEFT join payment pay on pay.id= up.paymentId
                left join packageduration pd on pd.id = up.packageDurationId
                left join timeduration t on t.id = pd.timeDurationId
                INNER JOIN users u ON u.id = up.userId`;
                if (req.body.userId) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    }
                    else {
                        countSql += ` AND `;
                    }
                    countSql += ` up.userId = ` + req.body.userId;
                }
                if (req.body.paymentStatus && req.body.paymentStatus != 'All') {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    }
                    else {
                        countSql += ` AND `;
                    }
                    countSql += ` pay.paymentStatus = '` + req.body.paymentStatus + `'`;
                }
                if (req.body.searchString) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    }
                    else {
                        countSql += ` AND `;
                    }
                    countSql +=
                        ` (p.name LIKE '%` +
                            req.body.searchString +
                            `%' OR  u.firstName LIKE '%` +
                            req.body.searchString +
                            `%' OR u.lastName LIKE '%` +
                            req.body.searchString +
                            `%' OR u.email LIKE '%` +
                            req.body.searchString +
                            `%' OR u.contactNo LIKE '%` +
                            req.body.searchString +
                            `%' OR u.gender LIKE '%` +
                            req.body.searchString +
                            `%') `;
                }
                let countResult = yield apiHeader_1.default.query(countSql);
                let sql = `SELECT up.id, up.packageId,p.name as packageName,p.weightage ,up.packageDurationId,up.startDate,up.endDate,up.netAmount,pay.paymentMode,pay.paymentStatus
                ,t.value, u.id as userId, u.firstName, u.lastName, u.contactNo, pay.id as paymentId FROM  userpackage up
                LEFT JOIN package p on p.id= up.packageId
                LEFT join payment pay on pay.id= up.paymentId
                left join packageduration pd on pd.id = up.packageDurationId
                left join timeduration t on t.id = pd.timeDurationId
                INNER JOIN users u ON u.id = up.userId`;
                if (req.body.userId) {
                    if (!sql.includes(` WHERE `)) {
                        sql += ` WHERE `;
                    }
                    else {
                        sql += ` AND `;
                    }
                    sql += ` up.userId = ` + req.body.userId;
                }
                if (req.body.paymentStatus && req.body.paymentStatus != 'All') {
                    if (!sql.includes(` WHERE `)) {
                        sql += ` WHERE `;
                    }
                    else {
                        sql += ` AND `;
                    }
                    sql += ` pay.paymentStatus = '` + req.body.paymentStatus + `'`;
                }
                if (req.body.searchString) {
                    if (!sql.includes(` WHERE `)) {
                        sql += ` WHERE `;
                    }
                    else {
                        sql += ` AND `;
                    }
                    sql +=
                        ` (p.name LIKE '%` +
                            req.body.searchString +
                            `%' OR  u.firstName LIKE '%` +
                            req.body.searchString +
                            `%' OR u.lastName LIKE '%` +
                            req.body.searchString +
                            `%' OR u.email LIKE '%` +
                            req.body.searchString +
                            `%' OR u.contactNo LIKE '%` +
                            req.body.searchString +
                            `%' OR u.gender LIKE '%` +
                            req.body.searchString +
                            `%') `;
                }
                sql += ` order by up.id desc `;
                if (!(req.body.packageStatus && req.body.packageStatus != 'All')) {
                    if (startIndex != null && fetchRecord != null) {
                        sql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
                    }
                }
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length >= 0) {
                    for (let i = 0; i < result.length; i++) {
                        result[i].status = '';
                        if (result[i].paymentStatus == 'Pending') {
                            result[i].status = 'Pending';
                        }
                        else {
                            let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                            LEFT JOIN package p ON p.id = up.packageId
                            LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                            LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                            WHERE DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())`;
                            // if (req.body.userId) {
                            //     if (!userPackages.includes(` WHERE `)) {
                            //         userPackages += ` WHERE `;
                            //     } else {
                            //         userPackages += ` AND `;
                            //     }
                            //     userPackages += ` up.userId = ` + req.body.userId;
                            // }
                            if (result[i].userId) {
                                if (!userPackages.includes(` WHERE `)) {
                                    userPackages += ` WHERE `;
                                }
                                else {
                                    userPackages += ` AND `;
                                }
                                userPackages += ` up.userId = ` + result[i].userId;
                            }
                            userPackages += ` order by p.weightage DESC `;
                            let userPackage = yield apiHeader_1.default.query(userPackages);
                            if (userPackage && userPackage.length > 0) {
                                for (let j = 0; j < userPackage.length; j++) {
                                    if (userPackage[0].id == result[i].id) {
                                        result[i].status = 'Active';
                                    }
                                    else {
                                        result[i].status = 'Override';
                                    }
                                }
                            }
                            if (new Date(result[i].endDate).getTime() < new Date().getTime()) {
                                result[i].status = 'Expired';
                            }
                            else if (new Date(result[i].startDate).getTime() > new Date().getTime()) {
                                result[i].status = 'Upcomming';
                            }
                        }
                    }
                    let totalCount = 0;
                    if (req.body.packageStatus && req.body.packageStatus != 'All') {
                        result = result.filter((c) => c.status == req.body.packageStatus);
                        totalCount = result.length;
                        result = result.slice(startIndex, startIndex + fetchRecord);
                    }
                    else {
                        totalCount = countResult[0].totalCount;
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Package of Users', result, totalCount, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'appUsers.getUserPackages() Error', new Error('Error While Updating Data'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'appUsers.getUserPackages() Exception', error, '');
        next(errorResult);
    }
});
const activeUserPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield apiHeader_1.default.beginTransaction();
    try {
        logging_1.default.info(NAMESPACE, 'Active Premium Account');
        let requiredFields = ['packageId', 'packageDurationId', 'userId', 'paymentId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let checkPaymentStatusSql = `UPDATE payment SET paymentRefrence = ` + (req.body.paymentRefrence ? `'` + req.body.paymentRefrence + `'` : null) + `, paymentStatus='Success' WHERE id = ` + req.body.paymentId;
                let result = yield apiHeader_1.default.query(checkPaymentStatusSql);
                if (result && result.affectedRows >= 0) {
                    let getUserPackageSql = `SELECT up.*, p.weightage FROM userpackage up INNER JOIN package p ON p.id = up.packageId WHERE DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP()) 
                    AND up.userId = ` +
                        req.body.userId +
                        ` ORDER BY up.endDate`;
                    let getUserPackageResult = yield apiHeader_1.default.query(getUserPackageSql);
                    let currentPackageSql = `SELECT p.*, t.value as month FROM package p INNER JOIN packageduration pd ON pd.packageId = p.id INNER JOIN timeduration t on t.id = pd.timeDurationId WHERE pd.id=` +
                        req.body.packageDurationId;
                    let currentPackageResult = yield apiHeader_1.default.query(currentPackageSql);
                    if (getUserPackageResult && getUserPackageResult.length > 0 && currentPackageResult && currentPackageResult.length > 0) {
                        let filterData = getUserPackageResult.filter((c) => c.weightage >= currentPackageResult[0].weightage);
                        if (filterData && filterData.length > 0) {
                            //extend
                            let startDate = new Date(filterData[filterData.length - 1].endDate).getFullYear() +
                                '-' +
                                (new Date(filterData[filterData.length - 1].endDate).getMonth() + 1) +
                                '-' +
                                (new Date(filterData[filterData.length - 1].endDate).getDate() + 1) +
                                ' 00:00:00';
                            let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + currentPackageResult[0].month));
                            let endDate = new Date(eDt).getFullYear() + '-' + (new Date(eDt).getMonth() + 1) + '-' + (new Date(eDt).getDate() - 1) + ' 23:59:59';
                            let sql = `UPDATE userpackage SET startDate = ?, endDate = ?, modifiedBy = ` + userId + `, modifiedData = CURRENT_TIMESTAMP() WHERE id = ` + req.body.packageId;
                            result = yield apiHeader_1.default.query(sql, [new Date(startDate), new Date(endDate)]);
                            if (result && result.affectedRows > 0) {
                                let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                                    LEFT JOIN package p ON p.id = up.packageId
                                                    LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                    LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                    WHERE up.userId = ` +
                                    req.body.userId +
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
                                //result[0] = userPackage[0]
                                let fcmToken;
                                let customerFcmSql = 'SELECT fcmToken FROM userdevicedetail WHERE userId = ' + req.body.userId + ' ORDER BY id DESC LIMIT 1';
                                let customerFcmResult = yield apiHeader_1.default.query(customerFcmSql);
                                if (customerFcmResult && customerFcmResult.length > 0) {
                                    fcmToken = customerFcmResult[0].fcmToken;
                                }
                                if (fcmToken) {
                                    let title = 'Purchased Package Activated';
                                    let description = 'Your purchased package ' + userPackage[0].packageName + ' for ' + userPackage[0].value + ' month was approved by admin';
                                    let dataBody = {
                                        type: 5,
                                        id: req.body.userId,
                                        title: title,
                                        message: description,
                                        json: null,
                                        dateTime: null
                                    };
                                    let notificationRes = yield notifications_1.default.sendMultipleNotification([fcmToken], req.body.id, title, description, '', null, null, 1);
                                    let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                                     VALUES(` +
                                        req.body.userId +
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
                                        yield apiHeader_1.default.commit();
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Save Premium Account', userPackage[0], 1, authorizationResult.token);
                                        return res.status(200).send(successResult);
                                    }
                                    else {
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'package.activeUserPackage() Error', new Error('Error While Updating Data'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    yield apiHeader_1.default.commit();
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Save Premium Account', userPackage[0], 1, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'package.activeUserPackage() Error', new Error('Error While Updating Data'), '');
                                next(errorResult);
                            }
                        }
                        else {
                            //overright
                            let startDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' 00:00:00';
                            let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + currentPackageResult[0].month));
                            let endDate = new Date(eDt).getFullYear() + '-' + (new Date(eDt).getMonth() + 1) + '-' + (new Date(eDt).getDate() - 1) + ' 23:59:59';
                            let sql = `UPDATE userpackage SET startDate = ?, endDate = ?, modifiedBy = ` + userId + `, modifiedData = CURRENT_TIMESTAMP() WHERE id = ` + req.body.packageId;
                            result = yield apiHeader_1.default.query(sql, [new Date(startDate), new Date(endDate)]);
                            if (result && result.affectedRows > 0) {
                                let id = req.body.packageId;
                                let insertedPackageDurationSql = `SELECT t.* FROM timeduration t INNER JOIN packageduration pd ON pd.timeDurationId = t.id WHERE pd.id = ` + req.body.packageDurationId;
                                let insertedPackageDurationResult = yield apiHeader_1.default.query(insertedPackageDurationSql);
                                let getFuturePackageSql = `SELECT up.*, t.value as month FROM userpackage up INNER JOIN packageduration pd ON pd.id = up.packageDurationId 
                            INNER JOIN timeduration t on t.id = pd.timeDurationId WHERE DATE(up.startDate)>DATE(CURRENT_TIMESTAMP()) AND up.id != ` + id;
                                let getFuturePackageResult = yield apiHeader_1.default.query(getFuturePackageSql);
                                if (getFuturePackageResult && getFuturePackageResult.length > 0 && insertedPackageDurationResult && insertedPackageDurationResult.length > 0) {
                                    for (let i = 0; i < getFuturePackageResult.length; i++) {
                                        let sDt = new Date(endDate);
                                        let startDate = new Date(sDt).getFullYear() + '-' + (new Date(sDt).getMonth() + 1) + '-' + (new Date(sDt).getDate() + 1) + ' 00:00:00';
                                        let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + getFuturePackageResult[i].month));
                                        let endnDate = new Date(eDt).getFullYear() + '-' + (new Date(eDt).getMonth() + 1) + '-' + (new Date(eDt).getDate() - 1) + ' 23:59:59';
                                        let updateUserPackageSql = `UPDATE userpackage SET startDate = ?, endDate = ?, modifiedBy = ` +
                                            userId +
                                            `, modifiedData = CURRENT_TIMESTAMP() WHERE id = ` +
                                            getFuturePackageResult[i].id;
                                        let updateUserPackageResult = yield apiHeader_1.default.query(updateUserPackageSql, [startDate, endnDate]);
                                        if (updateUserPackageResult && updateUserPackageResult.affectedRows >= 0) {
                                        }
                                        else {
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, 'package.activeUserPackage() Error', new Error('Error While Updating Data'), '');
                                            next(errorResult);
                                        }
                                    }
                                }
                                let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                            LEFT JOIN package p ON p.id = up.packageId
                            LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                            LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                            WHERE up.userId = ` +
                                    req.body.userId +
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
                                //result[0] = userPackage[0]
                                let fcmToken;
                                let customerFcmSql = 'SELECT fcmToken FROM userdevicedetail WHERE userId = ' + req.body.userId + ' ORDER BY id DESC LIMIT 1';
                                let customerFcmResult = yield apiHeader_1.default.query(customerFcmSql);
                                if (customerFcmResult && customerFcmResult.length > 0) {
                                    fcmToken = customerFcmResult[0].fcmToken;
                                }
                                if (fcmToken) {
                                    let title = 'Purchased Package Activated';
                                    let description = 'Your purchased package ' + userPackage[0].packageName + ' for ' + userPackage[0].value + ' month was approved by admin';
                                    let notificationRes = yield notifications_1.default.sendMultipleNotification([fcmToken], req.body.id, title, description, '', null, null, 1);
                                    let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                                     VALUES(` +
                                        req.body.userId +
                                        `,'` +
                                        title +
                                        `', '` +
                                        description +
                                        `', null, null, ` +
                                        authorizationResult.currentUser.id +
                                        `, ` +
                                        authorizationResult.currentUser.id +
                                        `)`;
                                    let notificationresult = yield apiHeader_1.default.query(notificationSql);
                                    if (notificationresult && notificationresult.insertId > 0) {
                                        yield apiHeader_1.default.commit();
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Save Premium Account', userPackage[0], 1, authorizationResult.token);
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
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Save Premium Account', userPackage[0], 1, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                                // await header.commit();
                                // let successResult = new ResultSuccess(200, true, 'Save Premium Account', userPackage[0], 1, authorizationResult.token);
                                // return res.status(200).send(successResult);
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'package.activeUserPackage() Error', new Error('Error While Updating Data'), '');
                                next(errorResult);
                            }
                        }
                    }
                    else {
                        //insert
                        let startDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' 00:00:00';
                        let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + currentPackageResult[0].month));
                        let endDate = new Date(eDt).getFullYear() + '-' + (new Date(eDt).getMonth() + 1) + '-' + (new Date(eDt).getDate() - 1) + ' 23:59:59';
                        let sql = `UPDATE userpackage SET startDate = ?, endDate = ?, modifiedBy = ` + userId + `, modifiedData = CURRENT_TIMESTAMP() WHERE id = ` + req.body.packageId;
                        result = yield apiHeader_1.default.query(sql, [new Date(startDate), new Date(endDate)]);
                        if (result && result.affectedRows > 0) {
                            let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                        LEFT JOIN package p ON p.id = up.packageId
                        LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                        WHERE up.userId = ` +
                                req.body.userId +
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
                            //result[0] = userPackage[0];
                            let fcmToken;
                            let customerFcmSql = 'SELECT fcmToken FROM userdevicedetail WHERE userId = ' + req.body.userId + ' ORDER BY id DESC LIMIT 1';
                            let customerFcmResult = yield apiHeader_1.default.query(customerFcmSql);
                            if (customerFcmResult && customerFcmResult.length > 0) {
                                fcmToken = customerFcmResult[0].fcmToken;
                            }
                            if (fcmToken) {
                                let title = 'Purchased Package Activated';
                                let description = 'Your purchased package ' + userPackage[0].packageName + ' for ' + userPackage[0].value + ' month was approved by admin';
                                let notificationRes = yield notifications_1.default.sendMultipleNotification([fcmToken], req.body.id, title, description, '', null, null, 1);
                                let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                                     VALUES(` +
                                    req.body.userId +
                                    `,'` +
                                    title +
                                    `', '` +
                                    description +
                                    `', null, null, ` +
                                    authorizationResult.currentUser.id +
                                    `, ` +
                                    authorizationResult.currentUser.id +
                                    `)`;
                                let notificationresult = yield apiHeader_1.default.query(notificationSql);
                                if (notificationresult && notificationresult.insertId > 0) {
                                    yield apiHeader_1.default.commit();
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Save Premium Account', userPackage[0], 1, authorizationResult.token);
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
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Save Premium Account', userPackage[0], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                            // await header.commit();
                            // let successResult = new ResultSuccess(200, true, 'Save Premium Account', userPackage[0], 1, authorizationResult.token);
                            // return res.status(200).send(successResult);
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, 'package.activeUserPackage() Error', new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    }
                }
                else {
                    yield apiHeader_1.default.rollback();
                    let errorResult = new resulterror_1.ResultError(400, true, 'package.activeUserPackage() Error', new Error('Error While Updating Data'), '');
                    next(errorResult);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'package.activeUserPackage() Exception', error, '');
        next(errorResult);
    }
});
const verifyUserProfilePic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Verify User Profile Pic');
        let requiredFields = ['id', 'isVerified'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let updateSql = `UPDATE users SET isVerifyProfilePic = ` + req.body.isVerified + `,modifiedDate = CURRENT_TIMESTAMP() WHERE id = ` + req.body.id;
                result = yield apiHeader_1.default.query(updateSql);
                if (result && result.affectedRows > 0) {
                    if (!req.body.isVerified) {
                        let image = yield apiHeader_1.default.query(`SELECT images.* FROM images INNER JOIN users ON users.imageId = images.id WHERE users.id = ` + req.body.id);
                        let imagePath = './' + image[0].imageUrl;
                        if (fs.existsSync(imagePath)) {
                            fs.unlink(imagePath, (err) => {
                                if (err)
                                    throw err;
                                console.log(imagePath + ' was deleted');
                            });
                        }
                        yield apiHeader_1.default.query(`UPDATE users SET imageId = NULL WHERE id = ` + req.body.id);
                        yield apiHeader_1.default.query(`DELETE FROM images WHERE id = ` + image[0].id);
                    }
                    let fcmToken;
                    let customerFcmSql = 'SELECT fcmToken FROM userdevicedetail WHERE userId = ' + req.body.id + ' ORDER BY id DESC LIMIT 1';
                    let customerFcmResult = yield apiHeader_1.default.query(customerFcmSql);
                    if (customerFcmResult && customerFcmResult.length > 0) {
                        fcmToken = customerFcmResult[0].fcmToken;
                    }
                    if (fcmToken) {
                        let title = 'Verify ProfilePic';
                        let description = 'Your ProfilePic Verified by admin';
                        let dataBody = {
                            type: 7,
                            id: req.body.userId,
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
                            yield apiHeader_1.default.commit();
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Verify User Profile Pic', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, 'appUsers.verifyUserProfilePic() Error', new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    }
                    else {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Verify User ProfilePic', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'appUsers.verifyUserProfilePic() Error', new Error('Error While Updating Data'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'appUsers.verifyUserProfilePic() Exception', error, '');
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
const updateUserProfilePicV2 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = {
    getAppUsers,
    viewAppUserPerDetail,
    viewAppUserSendRequest,
    viewAppUserGotRequest,
    viewAppUserFavourites,
    unblockUserRequest,
    viewBlockUser,
    approveDocument,
    getUserPackages,
    activeUserPackage,
    verifyUserProfilePic,
    updateUserProfilePicV2
};
