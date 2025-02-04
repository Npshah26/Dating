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
const getDistricts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Districts');
        let requiredFields = ['stateId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `SELECT * FROM districts WHERE stateId = ` + req.body.stateId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Districts Succesfully', result, result.length, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'districts.getDistricts() Exception', error, '');
        next(errorResult);
    }
});
const getDistrictsV2 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        logging_1.default.info(NAMESPACE, 'Getting Districts');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if ((validationResult && validationResult.statusCode == 200) || ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.userId)) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if ((authorizationResult.statusCode == 200) || ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.userId)) {
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
exports.default = { getDistricts, getDistrictsV2 };
