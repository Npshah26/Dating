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
const NAMESPACE = 'Payment';
const insertPaymentRazorpay = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Payment');
        let requiredFields = ['paymentReference', 'paymentStatus', 'amount', 'signature', 'orderId', 'paymentMode'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let sql = `INSERT INTO payment (paymentMode,paymentRefrence,amount,userId,paymentStatus,signature,orderId,createdBy, modifiedBy) 
                VALUES('` + req.body.paymentMode + `','` + req.body.paymentReference + `',` + req.body.amount + `,` + userId + `,'` + req.body.paymentStatus + `','` + req.body.signature + `','` + req.body.orderId + `',` + userId + `,` + userId + `)`;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Inserting Payment', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "payment.insertPaymentRazorpay() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'payment.insertPaymentRazorpay() Exception', error, '');
        next(errorResult);
    }
});
const insertPaymentStripe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Payment');
        let requiredFields = ['amount', 'paymentStatus', 'paymentMode', 'paymentReference'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let sql = `INSERT INTO payment (paymentMode,paymentRefrence,amount,userId,paymentStatus,createdBy, modifiedBy) 
                VALUES('` + req.body.paymentMode + `','` + req.body.paymentReference + `',` + req.body.amount + `,` + userId + `,'` + req.body.paymentStatus + `',` + userId + `,` + userId + `)`;
                let result = yield apiHeader_1.default.query(sql);
                console.log(result);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Inserting Payment', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "payment.insertPaymentStripe() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'payment.insertPaymentStripe() Exception', error, '');
        next(errorResult);
    }
});
const insertPaymentForPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Payment');
        let requiredFields = ['paymentReference', 'paymentStatus', 'amount', 'paymentMode'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (((authorizationResult === null || authorizationResult === void 0 ? void 0 : authorizationResult.statusCode) == 200)) {
                let currentUser = authorizationResult === null || authorizationResult === void 0 ? void 0 : authorizationResult.currentUser;
                let userId = currentUser.id;
                let sql = `INSERT INTO payment (paymentMode,paymentRefrence,amount,userId,paymentStatus,signature,orderId,createdBy, modifiedBy) 
                VALUES('` + req.body.paymentMode + `','` + req.body.paymentReference + `',` + req.body.amount + `,` + userId + `,'` + req.body.paymentStatus + `',` + (req.body.signature ? `'` + req.body.signature + `'` : null) + `,` + (req.body.orderId ? `'` + req.body.orderId + `'` : null) + `,` + userId + `,` + userId + `)`;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Inserting Payment', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "payment.insertPaymentRazorpay() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'payment.insertPaymentRazorpay() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { insertPaymentRazorpay, insertPaymentStripe, insertPaymentForPackage };
