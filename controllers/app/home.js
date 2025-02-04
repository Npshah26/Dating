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
const customFields_1 = __importDefault(require("../../controllers/app/customFields"));
// const mysql = require('mysql');
// const util = require('util');
// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });
// const query = util.promisify(connection.query).bind(connection);
const NAMESPACE = 'Home';
const getOccupation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Occupation');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let sql = `SELECT * FROM occupation WHERE isDelete = 0`;
            if (req.body.id) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                sql += ` id  = ` + req.body.id + ` `;
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Occupation Successfully', result, result.length, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'home.getOccupation() Exception', error, '');
        next(errorResult);
    }
});
const getLatestProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting All Users');
        let userId = 0;
        let authorizationResult;
        if (req.headers['authorization']) {
            authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                userId = currentUser ? currentUser.id : 0;
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
        console.log(isCustomFieldEnabled);
        let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
        let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
        // let sql = `SELECT u.id, upa.userId, img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, upa.birthDate, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0 AS age, upa.eyeColor, upa.languages
        // , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
        // , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
        // , ms.name as maritalStatus, r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, d.name as diet, h.name as height , u.id IN (select proposalUserId from userproposals where userId = ` + userId + `) as isProposed,
        // u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite, addr.latitude, addr.longitude
        // , (select count(id) from userviewprofilehistories where  userId = u.id ) as totalView
        // FROM users u
        // LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
        // LEFT JOIN userroles ur ON ur.userId = u.id
        // LEFT JOIN images img ON img.id = u.imageId
        // LEFT JOIN maritalstatus ms ON ms.id = upa.maritalStatusId
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
        // LEFT JOIN diet d ON d.id = upa.dietId
        // LEFT JOIN height h ON h.id = upa.heightId
        // WHERE ur.roleId = 2 AND u.id != ` + userId + ` AND (upa.userId = u.id) AND u.id  AND
        // (
        //     u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)  
        //     and u.id NOT IN (select userId from userblock where userBlockId = ` + userId + `)
        //     and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `)
        // )
        //  order by u.createdDate desc`;
        let sql = `SELECT u.id, udd.fcmtoken, img.imageUrl, u.firstName, u.middleName, u.lastName, u.contactNo, u.email, u.gender, u.isVerifyProfilePic
            , upa.birthDate, DATE_FORMAT(FROM_DAYS(DATEDIFF(NOW(), upa.birthDate)), '%Y') + 0 AS age, upa.eyeColor, upa.languages, upa.expectation, upa.aboutMe, upa.weight, upa.profileForId, pf.name as profileForName
            , addr.addressLine1, addr.addressLine2, addr.pincode, addr.cityId, addr.districtId, addr.stateId, addr.countryId
            , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
            , ms.name as maritalStatus, r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome
            , d.name as diet, h.name as height, em.name as employmentType
            , u.id IN (select proposalUserId from userproposals where userId = ` + userId + `) as isProposed
            , u.id IN (select favUserId from userfavourites where userId = ` + userId + `) as isFavourite
            , addr.latitude, addr.longitude
            FROM users u
            LEFT JOIN userdevicedetail udd ON udd.userId = u.id
            LEFT JOIN userpersonaldetail upa ON upa.userId = u.id
            LEFT JOIN userroles ur ON ur.userId = u.id
            LEFT JOIN images img ON img.id = u.imageId
            LEFT JOIN maritalstatus ms ON ms.id = upa.maritalStatusId
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
            LEFT JOIN diet d ON d.id = upa.dietId
            LEFT JOIN height h ON h.id = upa.heightId            
            LEFT JOIN employmenttype em ON em.id = upa.employmenttypeId
            LEFT JOIN profilefor pf ON pf.id = upa.profileForId
            WHERE ur.roleId = 2 AND u.id != ` + userId + ` AND (upa.userId = u.id) AND u.id  AND
            (
                u.id NOT IN (select userBlockId from userblock where userId = ` + userId + `)  
                and u.id NOT IN (select userId from userblock where userBlockId = ` + userId + `)
                and u.id NOT IN (select blockRequestUserId from userblockrequest where status = true AND userId = ` + userId + `)
            )
            order by u.createdDate desc`;
        if (startIndex != null && fetchRecord != null) {
            sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
        }
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
                    console.log(_customFieldDataResult);
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
            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Latest Profile Users Successfully', result, result.length, authorizationResult ? authorizationResult.token : '');
            return res.status(200).send(successResult);
        }
        else {
            let errorResult = new resulterror_1.ResultError(400, true, "home.getAllUsers() Error", new Error('Error While Getting Data'), '');
            next(errorResult);
        }
        // } else {
        //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
        //     next(errorResult);
        // }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'home.getAllUsers() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getLatestProfile, getOccupation };
