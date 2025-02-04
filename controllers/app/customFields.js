"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const fs = __importStar(require("fs"));
const NAMESPACE = 'CustomFields';
const getCustomFields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting CustomFields');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            // let authorizationResult = await header.validateAuthorization(req, res, next);
            // if (authorizationResult.statusCode == 200) {
            let countSql = `SELECT COUNT(id) as totalRecords FROM customfields`;
            let customFieldsSql = `SELECT * FROM customfields WHERE isActive = 1`;
            // if (req.body.searchString) {
            //     if (!countSql.includes(` WHERE `)) {
            //         countSql += ` WHERE `;
            //     } else {
            //         countSql += ` AND `;
            //     }
            //     countSql += ` LOWER(name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
            //     if (!countrySql.includes(` WHERE `)) {
            //         countrySql += ` WHERE `;
            //     } else {
            //         countrySql += ` AND `;
            //     }
            //     countrySql += ` LOWER(name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
            // }
            // if (req.body.fetchRecord) {
            //     countrySql += ` LIMIT ` + req.body.fetchRecord + ` OFFSET ` + req.body.startIndex;
            // }
            let customFieldsResult = yield apiHeader_1.default.query(customFieldsSql);
            let countResult = yield apiHeader_1.default.query(countSql);
            if (customFieldsResult && customFieldsResult.length > 0) {
                for (let i = 0; i < customFieldsResult.length; i++) {
                    if (customFieldsResult[i].valueList) {
                        const valueArray = customFieldsResult[i].valueList.split(";");
                        customFieldsResult[i].valueList = valueArray;
                    }
                }
                let totalCount = countResult[0].totalRecords;
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Countries Successfully', customFieldsResult, totalCount, '');
                return res.status(200).send(successResult);
            }
            else {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Countries Not Available', [], 0, '');
                return res.status(200).send(successResult);
            }
            // } else {
            //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            //     next(errorResult);
            // }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'region.getCountries() Exception', error, '');
        next(errorResult);
    }
});
const getCustomFieldsInResponse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting CustomFields');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            // let authorizationResult = await header.validateAuthorization(req, res, next);
            // if (authorizationResult.statusCode == 200) {
            let customdata = [];
            let countSql = `SELECT COUNT(id) as totalRecords FROM userpersonaldetailcustomdata`;
            let countResult = yield apiHeader_1.default.query(countSql);
            let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + req.body.id;
            // let userCustomDataSql = `SELECT COULUN_NAME from userpersonaldetailcustomdata WHERE COULUN_NAME NOT IN ('isActive', 'id', 'isDelete', 'userId','createdDate',modifiedDate, createdBy, modifiedBy) And  isActive = 1 AND userId = ` + req.body.id;
            // let userCustomDataSql = `SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_NAME = 'userpersonaldetailcustomdata' 
            //   AND COLUMN_NAME NOT IN ('isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy') 
            // AND isActive = 1 AND id = 1`
            let userCustomDataResult = yield apiHeader_1.default.query(userCustomDataSql);
            if (userCustomDataResult && userCustomDataResult.length > 0) {
                const userCustomDataArrays = [];
                const keys = Object.keys(userCustomDataResult[0]);
                userCustomDataArrays.push(keys);
                const filteredColumns = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                for (let i = 0; i < filteredColumns.length; i++) {
                    let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[i] + `' and isActive = 1`;
                    let result = yield apiHeader_1.default.query(sql);
                    let userDataSql = `SELECT ` + filteredColumns[i] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + req.body.id;
                    let userDataResult = yield apiHeader_1.default.query(userDataSql);
                    let mergedResult = Object.assign({}, result[0], userDataResult[0]);
                    customdata.push(mergedResult);
                    // console.log(userCustomDataResult);
                }
                if (customdata && customdata.length > 0) {
                    for (let i = 0; i < customdata.length; i++) {
                        if (customdata[i].valueList) {
                            const valueListArray = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : customdata[i].valueList;
                            customdata[i].valueList = valueListArray;
                        }
                        if (customdata[i].value && typeof customdata[i].value === 'string') {
                            if (customdata[i].valueTypeId == 10) {
                                const valueArray = customdata[i].value.includes(';') ? customdata[i].value.split(";") : customdata[i].value;
                                customdata[i].value = valueArray;
                            }
                        }
                        customdata[i].cTextcontroller = customdata[i].value;
                    }
                }
                if (req.body.value && Array.isArray(req.body.value)) {
                    const semicolonSeparatedString = req.body.value.join(';');
                    req.body.value = semicolonSeparatedString;
                    // console.log(req.body.value)
                }
                userCustomDataResult[0].customFields = customdata;
                let totalCount = countResult[0].totalRecords;
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Countries Successfully', userCustomDataResult, totalCount, '');
                return res.status(200).send(successResult);
            }
            else {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Countries Not Available', [], 0, '');
                return res.status(200).send(successResult);
            }
            // } else {
            //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            //     next(errorResult);
            // }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'region.getCountries() Exception', error, '');
        next(errorResult);
    }
});
const isCustomFieldEnable = () => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        let systemFlags = `SELECT * FROM systemflags where id = 45 and value = 1`;
        let systemFlagsResult = yield apiHeader_1.default.query(systemFlags);
        if (systemFlagsResult && systemFlagsResult.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        result = error;
    }
    return result;
});
const getCustomFieldData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    let result = [];
    try {
        logging_1.default.info(NAMESPACE, 'Getting CustomFields');
        const isCustomFieldEnabled = yield isCustomFieldEnable();
        // console.log(isCustomFieldEnabled);
        if (isCustomFieldEnabled) {
            let userCustomDataSql = `SELECT * from userpersonaldetailcustomdata WHERE isActive = 1 AND userId = ` + userId;
            let userCustomDataResult = yield apiHeader_1.default.query(userCustomDataSql);
            let customdata = [];
            if (userCustomDataResult && userCustomDataResult.length > 0) {
                const userCustomDataArrays = [];
                const keys = Object.keys(userCustomDataResult[0]);
                userCustomDataArrays.push(keys);
                const filteredColumns = keys.filter(col => !['isActive', 'id', 'isDelete', 'userId', 'createdDate', 'modifiedDate', 'createdBy', 'modifiedBy'].includes(col));
                for (let i = 0; i < filteredColumns.length; i++) {
                    let sql = `SELECT * from customfields WHERE mappedFieldName = '` + filteredColumns[i] + `' and isActive = 1`;
                    let result = yield apiHeader_1.default.query(sql);
                    if (result && result.length > 0) {
                        let userDataSql = `SELECT ` + filteredColumns[i] + ` as value , userId FROM userpersonaldetailcustomdata WHERE userId = ` + userId;
                        let userDataResult = yield apiHeader_1.default.query(userDataSql);
                        let mergedResult = Object.assign({}, result[0], userDataResult[0]);
                        customdata.push(mergedResult);
                    }
                    // console.log(userCustomDataResult);
                }
                if (customdata && customdata.length > 0) {
                    for (let i = 0; i < customdata.length; i++) {
                        if (customdata[i].valueList) {
                            const valueListArray = customdata[i].valueList.includes(';') ? customdata[i].valueList.split(";") : [customdata[i].valueList];
                            customdata[i].valueList = valueListArray;
                        }
                        if (customdata[i].value && typeof customdata[i].value === 'string') {
                            if (customdata[i].valueTypeId == 10) {
                                const valueArray = customdata[i].value.includes(';') ? customdata[i].value.split(";") : [customdata[i].value];
                                customdata[i].value = valueArray;
                            }
                        }
                        if (customdata[i].valueTypeId == 10 && customdata[i].defaultValue) {
                            const valueListArray = customdata[i].defaultValue.includes(';') ? customdata[i].defaultValue.split(";") : [customdata[i].defaultValue];
                            customdata[i].defaultValue = valueListArray;
                        }
                    }
                }
                result = customdata;
            }
        }
    }
    catch (error) {
        return error;
    }
    return result;
});
// const getUserResponse = async (permanentAddress: any, currentAddress: any, familyDetail: any, fatherDetails: any, motherDetails: any, pCountryLivingInId: any, pCityLivingInId: any, pReligionId: any, pCommunityId: any, pStateLivingInId: any,
//     pEducationMediumId: any, pOccupationId: any, pEmploymentTypeId: any, pMaritalStatusId: any, pAnnualIncomeId: any, pDietId: any, pEducationTypeId: any, pComplexion: any, pBodyType: any) => {
//     let result: any;
//     try {
//         logging.info(NAMESPACE, 'Getting User Detail');
//         let rawData: any = fs.readFileSync('variable.json', 'utf8');
//         rawData = JSON.parse(rawData);
//         permanentAddress = permanentAddress ? JSON.parse(permanentAddress) : null;
//         currentAddress = currentAddress ? JSON.parse(currentAddress) : null;
//         familyDetail = familyDetail ? JSON.parse(familyDetail) : null;
//         fatherDetails = fatherDetails ? JSON.parse(fatherDetails) : null;
//         motherDetails = motherDetails ? JSON.parse(motherDetails) : null;
//         let pCountries;
//         if (pCountryLivingInId == 0) {
//             pCountries = "Doesn't matter"
//         } else {
//             pCountries = await header.query(`SELECT name FROM countries WHERE  id IN (` + pCountryLivingInId + `)`);
//             pCountries = pCountries ? pCountries.map((type: any) => type.name).join(", ") : '';
//         }
//         let pReligions;
//         if (pReligionId == 0) {
//             pReligions = "Doesn't matter"
//         } else {
//             pReligions = await header.query(`SELECT name FROM religion WHERE  id IN (` + pReligionId + `)`);
//             pReligions = pReligions ? pReligions.map((type: any) => type.name).join(", ") : '';
//         }
//         let pCommunities;
//         if (pCommunityId == 0) {
//             pCommunities = "Doesn't matter"
//         } else {
//             pCommunities = await header.query(`SELECT name FROM community WHERE  id IN (` + pCommunityId + `)`);
//             pCommunities = pCommunities ? pCommunities.map((type: any) => type.name).join(", ") : '';
//         }
//         let pStates;
//         if (pStateLivingInId == 0) {
//             pStates = "Doesn't matter"
//         } else {
//             pStates = await header.query(`SELECT name FROM state WHERE  id IN (` + pStateLivingInId + `)`);
//             pStates = pStates ? pStates.map((type: any) => type.name).join(", ") : '';
//         }
//         let pCities;
//         if (pCityLivingInId == 0) {
//             pCities = "Doesn't matter"
//         } else {
//             pCities = await header.query(`SELECT name FROM state WHERE  id IN (` + pCityLivingInId + `)`);
//             pCities = pCities ? pCities.map((type: any) => type.name).join(", ") : '';
//         }
//         let pEducationMedium;
//         if (pEducationMediumId == 0) {
//             pEducationMedium = "Doesn't matter"
//         } else {
//             pEducationMedium = await header.query(`SELECT name FROM educationmedium WHERE  id IN (` + pEducationMediumId + `)`);
//             pEducationMedium = pEducationMedium ? pEducationMedium.map((type: any) => type.name).join(", ") : '';
//         }
//         let pEducationType
//         if (pEducationTypeId == 0) {
//             pEducationType = "Doesn't matter"
//         } else {
//             pEducationType = await header.query(`SELECT name FROM educationtype WHERE  id IN (` + pEducationTypeId + `)`);
//             pEducationType = pEducationType ? pEducationType.map((type: any) => type.name).join(", ") : '';
//         }
//         let pOccupation;
//         if (pOccupationId == 0) {
//             pOccupation = "Doesn't matter"
//         } else {
//             pOccupation = await header.query(`SELECT name FROM occupation WHERE  id IN (` + pOccupationId + `)`);
//             pOccupation = pOccupation ? pOccupation.map((type: any) => type.name).join(", ") : '';
//         }
//         let pEmploymentType;
//         if (pEmploymentTypeId == 0) {
//             pEmploymentType = "Doesn't matter"
//         } else {
//             pEmploymentType = await header.query(`SELECT name FROM employmenttype WHERE  id IN (` + pEmploymentTypeId + `)`);
//             pEmploymentType = pEmploymentType ? pEmploymentType.map((type: any) => type.name).join(", ") : '';
//         }
//         let pAnnualIncome;
//         if (pAnnualIncomeId == 0) {
//             pAnnualIncome = "Doesn't matter"
//         } else {
//             pAnnualIncome = await header.query(`SELECT value FROM annualincome WHERE id IN (` + pAnnualIncomeId + `)`);
//             pAnnualIncome = pAnnualIncome ? pAnnualIncome.map((type: any) => type.value).join(", ") : '';
//         }
//         if (pCountryLivingInId && typeof pCountryLivingInId === 'string') {
//             pCountryLivingInId = pCountryLivingInId.includes(',') ? pCountryLivingInId.split(",").map(Number) : [pCountryLivingInId].map(Number);
//         }
//         if (pReligionId && typeof pReligionId === 'string') {
//             pReligionId = pReligionId.includes(',') ? pReligionId.split(",").map(Number) : [pReligionId].map(Number);
//         }
//         if (pCommunityId && typeof pCommunityId === 'string') {
//             pCommunityId = pCommunityId.includes(',') ? pCommunityId.split(",").map(Number) : [pCommunityId].map(Number);
//         }
//         if (pStateLivingInId && typeof pStateLivingInId === 'string') {
//             pStateLivingInId = pStateLivingInId.includes(',') ? pStateLivingInId.split(",").map(Number) : [pStateLivingInId].map(Number);
//         }
//         if (pCityLivingInId && typeof pCityLivingInId === 'string') {
//             pCityLivingInId = pCityLivingInId.includes(',') ? pCityLivingInId.split(",").map(Number) : [pCityLivingInId].map(Number);
//         }
//         if (pEducationMediumId && typeof pEducationMediumId === 'string') {
//             pEducationMediumId = pEducationMediumId.includes(',') ? pEducationMediumId.split(",").map(Number) : [pEducationMediumId].map(Number);
//         }
//         if (pOccupationId && typeof pOccupationId === 'string') {
//             pOccupationId = pOccupationId.includes(',') ? pOccupationId.split(",").map(Number) : [pOccupationId].map(Number);
//         }
//         if (pEmploymentTypeId && typeof pEmploymentTypeId === 'string') {
//             pEmploymentTypeId = pEmploymentTypeId.includes(',') ? pEmploymentTypeId.split(",").map(Number) : [pEmploymentTypeId].map(Number);
//         }
//         if (pAnnualIncomeId && typeof pAnnualIncomeId === 'string') {
//             pAnnualIncomeId = pAnnualIncomeId.includes(',') ? pAnnualIncomeId.split(",").map(Number) : [pAnnualIncomeId].map(Number);
//         }
//         if (pDietId && typeof pDietId === 'string') {
//             pDietId = pDietId.includes(',') ? pDietId.split(",").map(Number) : [pDietId].map(Number);
//         }
//         if (pMaritalStatusId && typeof pMaritalStatusId === 'string') {
//             pMaritalStatusId = pMaritalStatusId.includes(',') ? pMaritalStatusId.split(",").map(Number) : [pMaritalStatusId].map(Number);
//         }
//         if (pBodyType && typeof pBodyType === 'string') {
//             pBodyType = pBodyType.includes(',') ? pBodyType.split(",") : [pBodyType];
//         }
//         if (pComplexion && typeof pComplexion === 'string') {
//             pComplexion = pComplexion.includes(',') ? pComplexion.split(",") : [pComplexion];
//         }
//         let pMaritalStatus;
//         if (pMaritalStatusId) {
//             const matchingMaritalStatuses = rawData.maritalStatus.filter((c: any) => pMaritalStatusId.includes(c.id));
//             pMaritalStatus = matchingMaritalStatuses.map((status: any) => status.name).join(", ");
//         }
//         let pDiet;
//         if (pDietId) {
//             const diet = rawData.dietTypeList.filter((c: any) => pDietId.includes(c.id));
//             pDiet = diet.map((status: any) => status.name).join(", ");
//         }
//         let data: any = {
//             permanentAddress: permanentAddress ? permanentAddress : null,
//             currentAddress: currentAddress ? currentAddress : null,
//             familyDetail: familyDetail ? familyDetail : null,
//             fatherDetails: fatherDetails ? fatherDetails : null,
//             motherDetails: motherDetails ? motherDetails : null,
//             pCountryLivingInId: pCountryLivingInId ? pCountryLivingInId : null,
//             pReligionId: pReligionId ? pReligionId : null,
//             pCommunityId: pCommunityId ? pCommunityId : null,
//             pStateLivingInId: pStateLivingInId ? pStateLivingInId : null,
//             pCityLivingInId: pCityLivingInId ? pCityLivingInId : null,
//             pEducationMediumId: pEducationMediumId ? pEducationMediumId : null,
//             pOccupationId: pOccupationId ? pOccupationId : null,
//             pEmploymentTypeId: pEmploymentTypeId ? pEmploymentTypeId : null,
//             pMaritalStatusId: pMaritalStatusId ? pMaritalStatusId : null,
//             pAnnualIncomeId: pAnnualIncomeId ? pAnnualIncomeId : null,
//             pDietId: pDietId ? pDietId : null,
//             pComplexion: pComplexion ? pComplexion : null,
//             pBodyType: pBodyType ? pBodyType : null,
//             pCountries: (pCountries || pCountries == " ") ? pCountries : null,
//             pReligions: (pReligions || pReligions == " ") ? pReligions : null,
//             pCommunities: (pCommunities || pCommunities == " ") ? pCommunities : null,
//             pStates: (pStates || pStates == " ") ? pStates : null,
//             pEducationMedium: (pEducationMedium || pEducationMedium == " ") ? pEducationMedium : null,
//             pOccupation: (pOccupation || pOccupation == " ") ? pOccupation : null,
//             pEmploymentType: (pEmploymentType || pEmploymentType == " ") ? pEmploymentType : null,
//             pAnnualIncome: (pAnnualIncome || pAnnualIncome == " ") ? pAnnualIncome : null,
//             pEducationType: (pEducationType || pEducationType == " ") ? pEducationType : null,
//             pCities: (pCities || pCities == " ") ? pCities : null,
//             pMaritalStatus: (pMaritalStatus || pMaritalStatus == " ") ? pMaritalStatus : null,
//             pDiet: (pDiet || pDiet == " ") ? pDiet : null
//         }
//         return data;
//     } catch (error) {
//         return error;
//     }
// }
const getUserData = (user) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        logging_1.default.info(NAMESPACE, 'Getting User Detail');
        let rawData = fs.readFileSync('variable.json', 'utf8');
        rawData = JSON.parse(rawData);
        user.permanentAddress = user.permanentAddress ? (typeof user.permanentAddress === 'string' ? JSON.parse(user.permanentAddress) : user.permanentAddress) : null;
        user.currentAddress = user.currentAddress ? (typeof user.currentAddress === 'string' ? JSON.parse(user.currentAddress) : user.currentAddress) : null;
        user.familyDetail = user.familyDetail ? (typeof user.familyDetail === 'string' ? JSON.parse(user.familyDetail) : user.familyDetail) : null;
        user.fatherDetails = user.fatherDetails ? (typeof user.fatherDetails === 'string' ? JSON.parse(user.fatherDetails) : user.fatherDetails) : null;
        user.motherDetails = user.motherDetails ? (typeof user.motherDetails === 'string' ? JSON.parse(user.motherDetails) : user.motherDetails) : null;
        let pCountries;
        if (user.pCountryLivingInId == 0) {
            pCountries = "Doesn't matter";
        }
        else {
            pCountries = yield apiHeader_1.default.query(`SELECT name FROM countries WHERE  id IN (` + user.pCountryLivingInId + `)`);
            pCountries = pCountries ? pCountries.map((type) => type.name).join(", ") : '';
        }
        let pReligions;
        if (user.pReligionId == 0) {
            pReligions = "Doesn't matter";
        }
        else {
            pReligions = yield apiHeader_1.default.query(`SELECT name FROM religion WHERE  id IN (` + user.pReligionId + `)`);
            pReligions = pReligions ? pReligions.map((type) => type.name).join(", ") : '';
        }
        let pCommunities;
        if (user.pCommunityId == 0) {
            pCommunities = "Doesn't matter";
        }
        else {
            pCommunities = yield apiHeader_1.default.query(`SELECT name FROM community WHERE  id IN (` + user.pCommunityId + `)`);
            pCommunities = pCommunities ? pCommunities.map((type) => type.name).join(", ") : '';
        }
        let pStates;
        if (user.pStateLivingInId == 0) {
            pStates = "Doesn't matter";
        }
        else {
            pStates = yield apiHeader_1.default.query(`SELECT name FROM state WHERE  id IN (` + user.pStateLivingInId + `)`);
            pStates = pStates ? pStates.map((type) => type.name).join(", ") : '';
        }
        let pCities;
        if (user.pCityLivingInId == 0) {
            pCities = "Doesn't matter";
        }
        else {
            pCities = yield apiHeader_1.default.query(`SELECT name FROM cities WHERE  id IN (` + user.pCityLivingInId + `)`);
            pCities = pCities ? pCities.map((type) => type.name).join(", ") : '';
        }
        let pEducationMedium;
        if (user.pEducationMediumId == 0) {
            pEducationMedium = "Doesn't matter";
        }
        else {
            pEducationMedium = yield apiHeader_1.default.query(`SELECT name FROM educationmedium WHERE  id IN (` + user.pEducationMediumId + `)`);
            pEducationMedium = pEducationMedium ? pEducationMedium.map((type) => type.name).join(", ") : '';
        }
        let pEducationType;
        if (user.pEducationTypeId == 0) {
            pEducationType = "Doesn't matter";
        }
        else {
            pEducationType = yield apiHeader_1.default.query(`SELECT name FROM educationtype WHERE  id IN (` + user.pEducationTypeId + `)`);
            pEducationType = pEducationType ? pEducationType.map((type) => type.name).join(", ") : '';
        }
        let pOccupation;
        if (user.pOccupationId == 0) {
            pOccupation = "Doesn't matter";
        }
        else {
            pOccupation = yield apiHeader_1.default.query(`SELECT name FROM occupation WHERE  id IN (` + user.pOccupationId + `)`);
            pOccupation = pOccupation ? pOccupation.map((type) => type.name).join(", ") : '';
        }
        let pEmploymentType;
        if (user.pEmploymentTypeId == 0) {
            pEmploymentType = "Doesn't matter";
        }
        else {
            pEmploymentType = yield apiHeader_1.default.query(`SELECT name FROM employmenttype WHERE  id IN (` + user.pEmploymentTypeId + `)`);
            pEmploymentType = pEmploymentType ? pEmploymentType.map((type) => type.name).join(", ") : '';
        }
        let pAnnualIncome;
        if (user.pAnnualIncomeId == 0) {
            pAnnualIncome = "Doesn't matter";
        }
        else {
            pAnnualIncome = yield apiHeader_1.default.query(`SELECT value FROM annualincome WHERE id IN (` + user.pAnnualIncomeId + `)`);
            pAnnualIncome = pAnnualIncome ? pAnnualIncome.map((type) => type.value).join(", ") : '';
        }
        if (user.pCountryLivingInId && typeof user.pCountryLivingInId === 'string') {
            user.pCountryLivingInId = user.pCountryLivingInId.includes(',') ? user.pCountryLivingInId.split(",").map(Number) : [user.pCountryLivingInId].map(Number);
        }
        if (user.pReligionId && typeof user.pReligionId === 'string') {
            user.pReligionId = user.pReligionId.includes(',') ? user.pReligionId.split(",").map(Number) : [user.pReligionId].map(Number);
        }
        if (user.pCommunityId && typeof user.pCommunityId === 'string') {
            user.pCommunityId = user.pCommunityId.includes(',') ? user.pCommunityId.split(",").map(Number) : [user.pCommunityId].map(Number);
        }
        if (user.pStateLivingInId && typeof user.pStateLivingInId === 'string') {
            user.pStateLivingInId = user.pStateLivingInId.includes(',') ? user.pStateLivingInId.split(",").map(Number) : [user.pStateLivingInId].map(Number);
        }
        if (user.pCityLivingInId && typeof user.pCityLivingInId === 'string') {
            user.pCityLivingInId = user.pCityLivingInId.includes(',') ? user.pCityLivingInId.split(",").map(Number) : [user.pCityLivingInId].map(Number);
        }
        if (user.pEducationTypeId && typeof user.pEducationTypeId === 'string') {
            user.pEducationTypeId = user.pEducationTypeId.includes(',') ? user.pEducationTypeId.split(",").map(Number) : [user.pEducationTypeId].map(Number);
        }
        if (user.pEducationMediumId && typeof user.pEducationMediumId === 'string') {
            user.pEducationMediumId = user.pEducationMediumId.includes(',') ? user.pEducationMediumId.split(",").map(Number) : [user.pEducationMediumId].map(Number);
        }
        if (user.pOccupationId && typeof user.pOccupationId === 'string') {
            user.pOccupationId = user.pOccupationId.includes(',') ? user.pOccupationId.split(",").map(Number) : [user.pOccupationId].map(Number);
        }
        if (user.pEmploymentTypeId && typeof user.pEmploymentTypeId === 'string') {
            user.pEmploymentTypeId = user.pEmploymentTypeId.includes(',') ? user.pEmploymentTypeId.split(",").map(Number) : [user.pEmploymentTypeId].map(Number);
        }
        if (user.pAnnualIncomeId && typeof user.pAnnualIncomeId === 'string') {
            user.pAnnualIncomeId = user.pAnnualIncomeId.includes(',') ? user.pAnnualIncomeId.split(",").map(Number) : [user.pAnnualIncomeId].map(Number);
        }
        if (user.pDietId && typeof user.pDietId === 'string') {
            user.pDietId = user.pDietId.includes(',') ? user.pDietId.split(",").map(Number) : [user.pDietId].map(Number);
        }
        if (user.pMaritalStatusId && typeof user.pMaritalStatusId === 'string') {
            user.pMaritalStatusId = user.pMaritalStatusId.includes(',') ? user.pMaritalStatusId.split(",").map(Number) : [user.pMaritalStatusId].map(Number);
        }
        if (user.pBodyType && typeof user.pBodyType === 'string') {
            user.pBodyType = user.pBodyType.includes(',') ? user.pBodyType.split(",") : [user.pBodyType];
        }
        if (user.pComplexion && typeof user.pComplexion === 'string') {
            user.pComplexion = user.pComplexion.includes(',') ? user.pComplexion.split(",") : [user.pComplexion];
        }
        let pMaritalStatus;
        if (user.pMaritalStatusId == 0) {
            pMaritalStatus = "Doesn't Matter";
        }
        else {
            const matchingMaritalStatuses = rawData.maritalStatus.filter((c) => user.pMaritalStatusId.includes(c.id));
            pMaritalStatus = matchingMaritalStatuses.map((status) => status.name).join(", ");
        }
        let maritalStatus;
        if (user.maritalStatusId) {
            const matchingMaritalStatuses = rawData.maritalStatus.filter((c) => user.maritalStatusId == c.id);
            maritalStatus = matchingMaritalStatuses.map((status) => status.name).join(", ");
        }
        let pDiet;
        if (user.pDietId == 0) {
            pDiet = "Doesn't Matter";
        }
        else {
            const diet = rawData.dietTypeList.filter((c) => user.pDietId.includes(c.id));
            pDiet = diet.map((status) => status.name).join(", ");
        }
        let diet;
        if (user.dietId) {
            const filterdiet = rawData.dietTypeList.filter((c) => user.dietId == c.id);
            diet = filterdiet.map((status) => status.name).join(", ");
        }
        let data = {
            permanentAddress: user.permanentAddress ? user.permanentAddress : null,
            currentAddress: user.currentAddress ? user.currentAddress : null,
            familyDetail: user.familyDetail ? user.familyDetail : null,
            fatherDetails: user.fatherDetails ? user.fatherDetails : null,
            motherDetails: user.motherDetails ? user.motherDetails : null,
            pCountryLivingInId: user.pCountryLivingInId ? user.pCountryLivingInId : null,
            pReligionId: user.pReligionId ? user.pReligionId : null,
            pCommunityId: user.pCommunityId ? user.pCommunityId : null,
            pStateLivingInId: user.pStateLivingInId ? user.pStateLivingInId : null,
            pCityLivingInId: user.pCityLivingInId ? user.pCityLivingInId : null,
            pEducationMediumId: user.pEducationMediumId ? user.pEducationMediumId : null,
            pEducationTypeId: user.pEducationTypeId ? user.pEducationTypeId : null,
            pOccupationId: user.pOccupationId ? user.pOccupationId : null,
            pEmploymentTypeId: user.pEmploymentTypeId ? user.pEmploymentTypeId : null,
            pMaritalStatusId: user.pMaritalStatusId ? user.pMaritalStatusId : null,
            pAnnualIncomeId: user.pAnnualIncomeId ? user.pAnnualIncomeId : null,
            pDietId: user.pDietId ? user.pDietId : null,
            pComplexion: user.pComplexion ? user.pComplexion : null,
            pBodyType: user.pBodyType ? user.pBodyType : null,
            pCountries: (pCountries || pCountries == " ") ? pCountries : null,
            pReligions: (pReligions || pReligions == " ") ? pReligions : null,
            pCommunities: (pCommunities || pCommunities == " ") ? pCommunities : null,
            pStates: (pStates || pStates == " ") ? pStates : null,
            pEducationMedium: (pEducationMedium || pEducationMedium == " ") ? pEducationMedium : null,
            pOccupation: (pOccupation || pOccupation == " ") ? pOccupation : null,
            pEmploymentType: (pEmploymentType || pEmploymentType == " ") ? pEmploymentType : null,
            pAnnualIncome: (pAnnualIncome || pAnnualIncome == " ") ? pAnnualIncome : null,
            pEducationType: (pEducationType || pEducationType == " ") ? pEducationType : null,
            pCities: (pCities || pCities == " ") ? pCities : null,
            pMaritalStatus: (pMaritalStatus || pMaritalStatus == " ") ? pMaritalStatus : null,
            pDiet: (pDiet || pDiet == " ") ? pDiet : null,
            // companyName: user.companyName && !user.isHideContactDetail ? user.companyName : null,
            // businessName: user.businessName && !user.isHideContactDetail ? user.businessName : null,
            // contactNo: user.contactNo && !user.isHideContactDetail ? user.contactNo : null,
            // email: user.email && !user.isHideContactDetail ? user.email : null,
            diet: diet ? diet : null,
            maritalStatus: maritalStatus ? maritalStatus : null
        };
        return data;
    }
    catch (error) {
        return error;
    }
});
exports.default = { getCustomFields, getCustomFieldsInResponse, isCustomFieldEnable, getCustomFieldData, getUserData };
