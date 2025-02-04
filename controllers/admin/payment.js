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
const NAMESPACE = 'Payment';
const insertPaymentForPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Payment');
        let requiredFields = ['paymentReference', 'paymentStatus', 'amount', 'paymentMode'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if ((validationResult && validationResult.statusCode == 200) || ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.userId)) {
            let authorizationResult;
            authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (((authorizationResult === null || authorizationResult === void 0 ? void 0 : authorizationResult.statusCode) == 200) || ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.userId)) {
                let currentUser = authorizationResult === null || authorizationResult === void 0 ? void 0 : authorizationResult.currentUser;
                let userId = req.body.userId;
                let adminId = currentUser.id;
                let sql = `INSERT INTO payment (paymentMode,paymentRefrence,amount,userId,paymentStatus,signature,orderId,createdBy, modifiedBy) 
                VALUES('` + req.body.paymentMode + `','` + req.body.paymentReference + `',` + req.body.amount + `,` + userId + `,'` + req.body.paymentStatus + `',` + (req.body.signature ? `'` + req.body.signature + `'` : null) + `,` + (req.body.orderId ? `'` + req.body.orderId + `'` : null) + `,` + adminId + `,` + adminId + `)`;
                let result = yield apiHeader_1.default.query(sql);
                console.log("sql", result);
                let token = undefined;
                if (!((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.userId) && authorizationResult && (authorizationResult === null || authorizationResult === void 0 ? void 0 : authorizationResult.token)) {
                    token = authorizationResult.token;
                }
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Inserting Payment', result, 1, token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'payment.insertPaymentRazorpay() Exception', error === null || error === void 0 ? void 0 : error.message, '');
        next(errorResult);
    }
});
exports.default = { insertPaymentForPackage };
