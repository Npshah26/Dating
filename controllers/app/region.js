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
const NAMESPACE = 'Region';
const getCountries = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Countries');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            // let authorizationResult = await header.validateAuthorization(req, res, next);
            // if (authorizationResult.statusCode == 200) {
            let countSql = `SELECT COUNT(id) as totalRecords FROM countries`;
            let countrySql = `SELECT * FROM countries`;
            if (req.body.searchString) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                countSql += ` LOWER(name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
                if (!countrySql.includes(` WHERE `)) {
                    countrySql += ` WHERE `;
                }
                else {
                    countrySql += ` AND `;
                }
                countrySql += ` LOWER(name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
            }
            if (req.body.fetchRecord) {
                countrySql += ` LIMIT ` + req.body.fetchRecord + ` OFFSET ` + req.body.startIndex;
            }
            let countryResult = yield apiHeader_1.default.query(countrySql);
            let countResult = yield apiHeader_1.default.query(countSql);
            if (countryResult && countryResult.length > 0) {
                let totalCount = countResult[0].totalRecords;
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Countries Successfully', countryResult, totalCount, '');
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
const getStates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting States');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let countSql = `SELECT COUNT(id) as totalRecords FROM state`;
                let stateSql = `SELECT * FROM state`;
                if (req.body.countryId) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    }
                    else {
                        countSql += ` AND `;
                    }
                    // countSql += ` countryId =` + req.body.countryId;
                    countSql += ` countryId in(` + req.body.countryId + `)`;
                    if (!stateSql.includes(` WHERE `)) {
                        stateSql += ` WHERE `;
                    }
                    else {
                        stateSql += ` AND `;
                    }
                    // stateSql += ` countryId =` + req.body.countryId;
                    stateSql += ` countryId in(` + req.body.countryId + `)`;
                }
                if (req.body.searchString) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    }
                    else {
                        countSql += ` AND `;
                    }
                    countSql += ` LOWER(name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
                    if (!stateSql.includes(` WHERE `)) {
                        stateSql += ` WHERE `;
                    }
                    else {
                        stateSql += ` AND `;
                    }
                    stateSql += ` LOWER(name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
                }
                if (req.body.fetchRecord) {
                    stateSql += ` LIMIT ` + req.body.fetchRecord + ` OFFSET ` + req.body.startIndex;
                }
                let stateResult = yield apiHeader_1.default.query(stateSql);
                let countResult = yield apiHeader_1.default.query(countSql);
                if (stateResult && stateResult.length > 0) {
                    let totalCount = countResult[0].totalRecords;
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get States Successfully', stateResult, totalCount, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'States Not Available', [], 0, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'region.getStates() Exception', error, '');
        next(errorResult);
    }
});
const getDistricts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Districts');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                // let countSql = `SELECT COUNT(id) as totalRecords FROM districts`;
                // let districtSql = `SELECT * FROM districts`;
                // if (req.body.stateId) {
                //     if (!countSql.includes(` WHERE `)) {
                //         countSql += ` WHERE `;
                //     } else {
                //         countSql += ` AND `;
                //     }
                //     countSql += ` stateId =` + req.body.stateId;
                //     if (!districtSql.includes(` WHERE `)) {
                //         districtSql += ` WHERE `;
                //     } else {
                //         districtSql += ` AND `;
                //     }
                //     districtSql += ` stateId =` + req.body.stateId;
                // }
                // if (req.body.searchString) {
                //     if (!countSql.includes(` WHERE `)) {
                //         countSql += ` WHERE `;
                //     } else {
                //         countSql += ` AND `;
                //     }
                //     countSql += ` LOWER(name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
                //     if (!districtSql.includes(` WHERE `)) {
                //         districtSql += ` WHERE `;
                //     } else {
                //         districtSql += ` AND `;
                //     }
                //     districtSql += ` LOWER(name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
                // }
                // if (req.body.fetchRecord) {
                //     districtSql += ` LIMIT ` + req.body.fetchRecord + ` OFFSET ` + req.body.startIndex;
                // }
                let countSql = `SELECT COUNT(d.id) as totalRecords FROM districts d INNER JOIN state s ON s.id = d.stateId INNER JOIN countries ct ON ct.id = s.countryId`;
                let districtSql = `SELECT d.*, ct.id as countryId, s.name as stateName, ct.name as countryName  FROM districts d INNER JOIN state s ON s.id = d.stateId INNER JOIN countries ct ON ct.id = s.countryId`;
                if (req.body.stateId) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    }
                    else {
                        countSql += ` AND `;
                    }
                    // countSql += ` d.stateId =` + req.body.stateId;
                    countSql += ` d.stateId in(` + req.body.stateId + `)`;
                    if (!districtSql.includes(` WHERE `)) {
                        districtSql += ` WHERE `;
                    }
                    else {
                        districtSql += ` AND `;
                    }
                    // districtSql += ` d.stateId =` + req.body.stateId;
                    districtSql += ` d.stateId in(` + req.body.stateId + `)`;
                }
                if (req.body.countryId) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    }
                    else {
                        countSql += ` AND `;
                    }
                    countSql += ` ct.id=` + req.body.countryId;
                    if (!districtSql.includes(` WHERE `)) {
                        districtSql += ` WHERE `;
                    }
                    else {
                        districtSql += ` AND `;
                    }
                    districtSql += ` ct.id =` + req.body.countryId;
                }
                if (req.body.searchString) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    }
                    else {
                        countSql += ` AND `;
                    }
                    countSql += ` LOWER(d.name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
                    if (!districtSql.includes(` WHERE `)) {
                        districtSql += ` WHERE `;
                    }
                    else {
                        districtSql += ` AND `;
                    }
                    districtSql += ` LOWER(d.name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
                }
                if (req.body.fetchRecord) {
                    districtSql += ` LIMIT ` + req.body.fetchRecord + ` OFFSET ` + req.body.startIndex;
                }
                let districtResult = yield apiHeader_1.default.query(districtSql);
                let countResult = yield apiHeader_1.default.query(countSql);
                if (districtResult && districtResult.length > 0) {
                    let totalCount = countResult[0].totalRecords;
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get District Successfully', districtResult, totalCount, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'District Not Available', [], 0, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'region.getDistricts() Exception', error, '');
        next(errorResult);
    }
});
const getCities = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Cities');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            // let authorizationResult = await header.validateAuthorization(req, res, next);
            // if (authorizationResult.statusCode == 200) {
            // let countSql = `SELECT COUNT(id) as totalRecords FROM cities`;
            // let citySql = `SELECT * FROM cities`;
            // if (req.body.districtId) {
            //     if (!countSql.includes(` WHERE `)) {
            //         countSql += ` WHERE `;
            //     } else {
            //         countSql += ` AND `;
            //     }
            //     countSql += ` districtId =` + req.body.districtId;
            //     if (!citySql.includes(` WHERE `)) {
            //         citySql += ` WHERE `;
            //     } else {
            //         citySql += ` AND `;
            //     }
            //     citySql += ` districtId =` + req.body.districtId;
            // }
            // if (req.body.searchString) {
            //     if (!countSql.includes(` WHERE `)) {
            //         countSql += ` WHERE `;
            //     } else {
            //         countSql += ` AND `;
            //     }
            //     countSql += ` LOWER(name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
            //     if (!citySql.includes(` WHERE `)) {
            //         citySql += ` WHERE `;
            //     } else {
            //         citySql += ` AND `;
            //     }
            //     citySql += ` LOWER(name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
            // }
            // if (req.body.fetchRecord) {
            //     citySql += ` LIMIT ` + req.body.fetchRecord + ` OFFSET ` + req.body.startIndex;
            // }
            let countSql = `SELECT COUNT(c.id) as totalRecords FROM cities c
                INNER JOIN districts d ON d.id = c.districtId 
                INNER JOIN state s ON s.id = d.stateId 
                INNER JOIN countries ct ON ct.id = s.countryId`;
            let citySql = `SELECT c.*, ct.id as countryId, s.id as stateId, d.name as districtName, s.name as stateName, ct.name as countryName 
                FROM cities c 
                INNER JOIN districts d ON d.id = c.districtId 
                INNER JOIN state s ON s.id = d.stateId 
                INNER JOIN countries ct ON ct.id = s.countryId`;
            if (req.body.districtId) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                countSql += ` c.districtId =` + req.body.districtId;
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += ` c.districtId =` + req.body.districtId;
            }
            if (req.body.stateId) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                // countSql += ` s.id=` + req.body.stateId;
                countSql += ` s.id in(` + req.body.stateId + `)`;
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                // citySql += ` s.id =` + req.body.stateId;
                citySql += ` s.id in(` + req.body.stateId + `)`;
            }
            if (req.body.countryId) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                // countSql += ` ct.id=` + req.body.countryId;
                countSql += ` ct.id in(` + req.body.countryId + `)`;
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                // citySql += ` ct.id =` + req.body.countryId;
                citySql += ` ct.id in (` + req.body.countryId + `)`;
            }
            if (req.body.searchString) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                countSql += ` LOWER(c.name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += ` LOWER(c.name) LIKE '%` + req.body.searchString.toLowerCase() + `%' `;
            }
            if (req.body.fetchRecord) {
                citySql += ` LIMIT ` + req.body.fetchRecord + ` OFFSET ` + req.body.startIndex;
            }
            let cityResult = yield apiHeader_1.default.query(citySql);
            let countResult = yield apiHeader_1.default.query(countSql);
            if (cityResult && cityResult.length > 0) {
                let totalCount = countResult[0].totalRecords;
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get City Successfully', cityResult, totalCount, '');
                return res.status(200).send(successResult);
            }
            else {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'City Not Available', [], 0, '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'region.getCities() Exception', error, '');
        next(errorResult);
    }
});
const getRegionByPincode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Region By Pincode');
        let requiredFields = ['pincode'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            // let authorizationResult = await header.validateAuthorization(req, res, next);
            // if (authorizationResult.statusCode == 200) {
            let citySql = `SELECT c.*, d.name as districtName, s.id as stateId, s.name as stateName, co.id as countryId, co.name as countryName  FROM cities c 
                INNER JOIN districts d ON d.id = c.districtId
                INNER JOIN state s ON s.id = d.stateId
                INNER JOIN countries co ON co.id = s.countryId`;
            if (req.body.pincode) {
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += ` c.pincode =` + req.body.pincode;
            }
            if (req.body.id) {
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += ` c.id =` + req.body.id;
            }
            if (req.body.districtId) {
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += ` c.districtId =` + req.body.districtId;
            }
            if (req.body.searchString) {
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += ` (LOWER(c.name) LIKE '%` + req.body.searchString.toLowerCase() + `%' 
                                    OR LOWER(d.name) LIKE '%` + req.body.searchString.toLowerCase() + `%' 
                                    OR LOWER(s.name) LIKE '%` + req.body.searchString.toLowerCase() + `%') `;
            }
            if (req.body.fetchRecord) {
                citySql += ` LIMIT ` + req.body.fetchRecord + ` OFFSET ` + req.body.startIndex;
            }
            let cityResult = yield apiHeader_1.default.query(citySql);
            if (cityResult && cityResult.length > 0) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get City Successfully', cityResult, cityResult.length, '');
                return res.status(200).send(successResult);
            }
            else {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'City Not Available', [], 0, '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'region.getRegionByPincode() Exception', error, '');
        next(errorResult);
    }
});
const getRegionByPincodeAndCountryISO = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Region By Pincode');
        let requiredFields = ['pincode', 'isoCode'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            // let authorizationResult = await header.validateAuthorization(req, res, next);
            // if (authorizationResult.statusCode == 200) {
            let citySql = `SELECT c.*, d.name as districtName, s.id as stateId, s.name as stateName, co.id as countryId, co.name as countryName  FROM cities c 
                INNER JOIN districts d ON d.id = c.districtId
                INNER JOIN state s ON s.id = d.stateId
                INNER JOIN countries co ON co.id = s.countryId`;
            if (req.body.pincode) {
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += ` c.pincode =` + req.body.pincode;
            }
            if (req.body.isoCode) {
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += `(LOWER(co.isoCode) = '` + req.body.isoCode.toLowerCase() + `' OR LOWER(co.isoCode3) = '` + req.body.isoCode.toLowerCase() + `')`;
            }
            if (req.body.id) {
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += ` c.id =` + req.body.id;
            }
            if (req.body.districtId) {
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += ` c.districtId =` + req.body.districtId;
            }
            if (req.body.searchString) {
                if (!citySql.includes(` WHERE `)) {
                    citySql += ` WHERE `;
                }
                else {
                    citySql += ` AND `;
                }
                citySql += ` (LOWER(c.name) LIKE '%` + req.body.searchString.toLowerCase() + `%' 
                                    OR LOWER(d.name) LIKE '%` + req.body.searchString.toLowerCase() + `%' 
                                    OR LOWER(s.name) LIKE '%` + req.body.searchString.toLowerCase() + `%') `;
            }
            if (req.body.fetchRecord) {
                citySql += ` LIMIT ` + req.body.fetchRecord + ` OFFSET ` + req.body.startIndex;
            }
            let cityResult = yield apiHeader_1.default.query(citySql);
            if (cityResult && cityResult.length > 0) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get City Successfully', cityResult, cityResult.length, '');
                return res.status(200).send(successResult);
            }
            else {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'City Not Available', [], 0, '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'region.getRegionByPincode() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getCountries, getStates, getDistricts, getCities, getRegionByPincode, getRegionByPincodeAndCountryISO };
