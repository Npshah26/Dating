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
const NAMESPACE = 'Currencies';
const getCurrencies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Currencies');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(c.id) as totalCount  FROM currencies c ";
            if (req.body.isDefaultCurrencyPaymentGateway) {
                let sql = `SELECT * FROM currencies WHERE isDefault = 1 AND isDelete = 0`;
                let result = yield apiHeader_1.default.query(sql);
                if (result) {
                    let currencyId = result[0].id;
                    // let sql2 = `SELECT * from currencypaymentgateway where currencyId = ` + currencyId;
                    // let result2 = await header.query(sql);
                    for (let i = 0; i < result.length; i++) {
                        let paymentGateWaySql = `SELECT cpg.id,cpg.paymentGatewayId,pg.name as paymentGateway FROM currencypaymentgateway cpg INNER JOIN paymentgateway pg ON cpg.paymentGatewayId = pg.id  WHERE cpg.currencyId =` + result[i].id;
                        let paymentGatewayResult = yield apiHeader_1.default.query(paymentGateWaySql);
                        result[i].paymentGateways = paymentGatewayResult;
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Payment Gateway Successfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                    next(errorResult);
                }
            }
            else {
                if (req.body.searchString) {
                    if (!countSql.includes(` WHERE `)) {
                        countSql += ` WHERE `;
                    }
                    else {
                        countSql += ` AND `;
                    }
                    countSql += ` (LOWER(c.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%' OR LOWER(c.code) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%') `;
                }
                let countResult = yield apiHeader_1.default.query(countSql);
                let sql = `SELECT c.* FROM currencies c WHERE c.isDelete = 0 `;
                if (req.body.searchString) {
                    if (!sql.includes(` WHERE `)) {
                        sql += ` WHERE `;
                    }
                    else {
                        sql += ` AND `;
                    }
                    sql += ` (LOWER(c.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%' OR LOWER(c.code) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%') `;
                }
                sql += ` ORDER BY c.id DESC `;
                if (startIndex != null && fetchRecord != null) {
                    sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
                }
                let result = yield apiHeader_1.default.query(sql);
                if (result) {
                    for (let i = 0; i < result.length; i++) {
                        let paymentGateWaySql = `SELECT cpg.id,cpg.paymentGatewayId,pg.name as paymentGateway FROM currencypaymentgateway cpg INNER JOIN paymentgateway pg ON cpg.paymentGatewayId = pg.id  WHERE cpg.currencyId =` + result[i].id;
                        let paymentGatewayResult = yield apiHeader_1.default.query(paymentGateWaySql);
                        result[i].paymentGateways = paymentGatewayResult;
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Payment Gateway Successfully', result, countResult[0].totalCount, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                    next(errorResult);
                }
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'currencies.getCurrencies() Exception', error, '');
        next(errorResult);
    }
});
const activeInactiveCurrency = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Active/Inactive Currency');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let sql = ` UPDATE currencypaymentgateway SET isActive = ` + req.body.isActive + ` WHERE currencyId = ` + req.body.id;
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let currencySql = yield apiHeader_1.default.query(`UPDATE currencies SET isActive = ` + req.body.isActive + ` WHERE id = ` + req.body.id);
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Active / Inactive Currency Successfully', result, 1, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'currencies.getCurrencies() Exception', error, '');
        next(errorResult);
    }
});
const setDefaultCurrency = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Set Default Currency');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let sql = ` UPDATE currencies SET isDefault = !isDefault WHERE isDefault = 1`;
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let currencySql = yield apiHeader_1.default.query(`UPDATE currencies SET isDefault = ` + req.body.isDefault + ` WHERE id = ` + req.body.id);
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Set Default Currency Successfully', result, 1, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'currencies.setDefaultCurrency() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getCurrencies, activeInactiveCurrency, setDefaultCurrency };
