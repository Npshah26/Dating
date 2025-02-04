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
const NAMESPACE = 'Payment Gateways';
const getPaymentGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting PaymentGateway');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(p.id) as totalCount  FROM paymentgateway p ";
            if (req.body.searchString) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                countSql += ` (LOWER(p.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%'  `;
            }
            let countResult = yield apiHeader_1.default.query(countSql);
            let sql = `SELECT p.* FROM paymentgateway p WHERE p.isDelete = 0 `;
            if (req.body.searchString) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                sql += ` (LOWER(p.name) LIKE '%` + req.body.searchString.toString().toLowerCase() + `%'  `;
            }
            sql += ` ORDER BY p.id DESC `;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Payment Gateway Successfully', result, countResult[0].totalCount, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                next(errorResult);
            }
            // if (result) {
            //     for (let i = 0; i < result.length; i++) {
            //         let paymentGateWaySql = `SELECT cpg.id,cpg.paymentGatewayId,pg.name as paymentGateway FROM currencypaymentgateway cpg INNER JOIN paymentgateway pg ON cpg.paymentGatewayId = pg.id  WHERE cpg.currencyId =` + result[i].id;
            //         let paymentGatewayResult = await header.query(paymentGateWaySql);
            //         result[i].paymentGateways = paymentGatewayResult;
            //     }
            //     let successResult = new ResultSuccess(200, true, 'Get Payment Gateway Successfully', result, countResult[0].totalCount, authorizationResult.token);
            //     return res.status(200).send(successResult);
            // } else {
            //     let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
            //     next(errorResult);
            // }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'paymentGateway.getPaymentGateway() Exception', error, '');
        next(errorResult);
    }
});
const activeInactivePaymentGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'ActiveInactive PaymentGateway');
        let requiredFields = ['flag', 'isActive'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = ` UPDATE paymentgateway SET `;
                if (req.body.flag == 'useInWallet')
                    sql += ` useInWallet =` + req.body.isActive;
                if (req.body.flag == 'useInCheckout')
                    sql += ` useInCheckout =` + req.body.isActive;
                if (req.body.flag == 'useInAndroid')
                    sql += ` useInAndroid =` + req.body.isActive;
                if (req.body.flag == 'useInApple')
                    sql += ` useInApple =` + req.body.isActive;
                if (req.body.flag == 'isActive')
                    sql += ` isActive =` + req.body.isActive;
                sql += ` WHERE id = ` + req.body.id;
                let result = yield apiHeader_1.default.query(sql);
                if (result) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'ActiveInactive Payment Gateway Successfully', result, 1, authorizationResult.token);
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
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'paymentGateway.activeInactivePaymentGateway() Exception', error, '');
        next(errorResult);
    }
});
const updatePaymentGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Save PaymentGateway');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let result;
                if (req.body.description) {
                    let sql = `UPDATE paymentgateway SET description ='` + req.body.description + `' WHERE id =` + req.body.id;
                    result = yield apiHeader_1.default.query(sql);
                }
                else {
                    let sql = `UPDATE paymentgateway SET jsonData ='` + req.body.jsonData + `' WHERE id =` + req.body.id;
                    result = yield apiHeader_1.default.query(sql);
                }
                if (result) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update Payment Gateway Successfully', result, 1, authorizationResult.token);
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
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'paymentGateway.updatePaymentGateway() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getPaymentGateway, activeInactivePaymentGateway, updatePaymentGateway };
