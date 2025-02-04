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
// const mysql = require('mysql');
// const util = require('util');
// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });
// const query = util.promisify(connection.query).bind(connection);
const NAMESPACE = 'Cities';
const getCities = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Cities');
        let requiredFields = ['stateId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `SELECT d.stateId, c.* FROM cities c
                INNER JOIN districts d ON d.id = c.districtId
                WHERE d.stateId = ` + req.body.stateId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Cities Succesfully', result, result.length, authorizationResult.token);
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
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'cities.getCities() Exception', error, '');
        next(errorResult);
    }
});
const getCitiesData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Cities');
        let requiredFields = ['cityName'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `SELECT cityName, pincode FROM addresses WHERE LOWER(cityName) LIKE '%` + req.body.cityName + `%'  group by cityName, pincode`;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Cities Succesfully', result, result.length, authorizationResult.token);
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
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'cities.getCitiesData() Exception', error, '');
        next(errorResult);
    }
});
const getCitiesV2 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        logging_1.default.info(NAMESPACE, 'Getting Cities');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if ((validationResult && validationResult.statusCode == 200) || ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.userId)) {
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
exports.default = { getCities, getCitiesData, getCitiesV2 };
