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
const getPaymentgateways = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Payment Gateways');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `SELECT pg.* FROM paymentgateway pg INNER JOIN currencypaymentgateway cpg ON pg.id = cpg.paymentGatewayId  INNER JOIN currencies c ON cpg.currencyId = c.id WHERE c.isDefault = 1 AND pg.isActive = 1 AND pg.useInWallet = 1`;
                // if (req.body.isWallet != null || req.body.isWallet == true || req.body.isWallet == false) {
                //     sql += " AND pg.useInWallet = " + req.body.isWallet;
                // }
                let result = yield apiHeader_1.default.query(sql);
                console.log(result);
                if (result && result.length >= 0) {
                    let data = [];
                    for (let i = 0; i < result.length; i++) {
                        let obj = {
                            id: result[i].id,
                            name: result[i].name,
                            jsonData: JSON.parse(result[i].jsonData),
                            useInWallet: result[i].useInWallet,
                            useInCheckout: result[i].useInCheckout,
                            useInAndroid: result[i].useInAndroid,
                            useInApple: result[i].useInApple,
                            isActive: result[i].isActive,
                            isDelete: result[i].isDelete,
                            createdDate: result[i].createdDate,
                            modifiedDate: result[i].modifiedDate,
                            createdBy: result[i].createdBy,
                            modifiedBy: result[i].modifiedBy,
                        };
                        data.push(obj);
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Payment Gateways', data, data.length, '');
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "paymentGateways.getPaymentgateways() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'paymentGateways.getPaymentgateways() Exception', error, '');
        next(errorResult);
    }
});
const getPaymentgatewaysForPackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Payment Gateways');
        let requiredFields = [''];
        // let validationResult = header.validateRequiredFields(req, requiredFields);
        // if (validationResult && validationResult.statusCode == 200) {
        //     let authorizationResult = await header.validateAuthorization(req, res, next);
        //     if (authorizationResult.statusCode == 200) {
        let sql = `SELECT pg.* FROM paymentgateway pg INNER JOIN currencypaymentgateway cpg ON pg.id = cpg.paymentGatewayId  INNER JOIN currencies c ON cpg.currencyId = c.id WHERE c.isDefault = 1 AND pg.isActive = 1`;
        // if (req.body.isWallet != null || req.body.isWallet == true || req.body.isWallet == false) {
        //     sql += " AND pg.useInWallet = " + req.body.isWallet;
        // }
        if (req.body != null && req.body.appPlatform == "iosApp") {
            sql += ` AND useInApple = 1`;
        }
        else if (req.body != null && req.body.appPlatform == "androidApp") {
            sql += ` AND useInAndroid = 1`;
        }
        let result = yield apiHeader_1.default.query(sql);
        console.log(result);
        if (result && result.length >= 0) {
            let data = [];
            for (let i = 0; i < result.length; i++) {
                let obj = {
                    id: result[i].id,
                    name: result[i].name,
                    jsonData: JSON.parse(result[i].jsonData),
                    useInWallet: result[i].useInWallet,
                    useInCheckout: result[i].useInCheckout,
                    useInAndroid: result[i].useInAndroid,
                    useInApple: result[i].useInApple,
                    isActive: result[i].isActive,
                    isDelete: result[i].isDelete,
                    createdDate: result[i].createdDate,
                    modifiedDate: result[i].modifiedDate,
                    createdBy: result[i].createdBy,
                    modifiedBy: result[i].modifiedBy,
                };
                data.push(obj);
            }
            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Payment Gateways For Package', data, data.length, '');
            return res.status(200).send(successResult);
        }
        else {
            let errorResult = new resulterror_1.ResultError(400, true, "paymentGateways.getPaymentgatewaysForPackage() Error", new Error('Error While Updating Data'), '');
            next(errorResult);
        }
        // } else {
        //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
        //     next(errorResult);
        // }
        // } else {
        //     let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
        //     next(errorResult);
        // }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'paymentGateways.getPaymentgatewaysForPackage() Exception', error, '');
        next(errorResult);
    }
});
const generateRazorPayOrderId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Save PaymentGateway');
        let requiredFields = ['amount', 'currency'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let result;
                let param = {
                    "amount": req.body.amount,
                    "currency": req.body.currency,
                    "notes": req.body.notes
                };
                const Razorpay = require('razorpay');
                let keyJson = yield apiHeader_1.default.query(`SELECT jsonData FROM paymentgateway WHERE name = 'Razorpay'`);
                keyJson = JSON.parse(keyJson[0].jsonData);
                const razorpay = new Razorpay({
                    key_id: keyJson.apiKey,
                    key_secret: keyJson.secretKey,
                });
                result = yield razorpay.orders.create(param);
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
const stripePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        logging_1.default.info(NAMESPACE, 'Save PaymentGateway');
        let requiredFields = ['amount', 'currency'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let result;
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let userData = yield apiHeader_1.default.query(`SELECT u.firstName,u.stripeCustomerId,u.email, a.addressLine1,a.cityName, a.stateName,a.countryName ,a.pincode from users u 
                    LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                    LEFT JOIN addresses a ON upd.addressId = a.id WHERE u.id = ` + userId + ``);
                let stripeCustomerId;
                let keyJson = yield apiHeader_1.default.query(`SELECT jsonData FROM paymentgateway WHERE name = 'Stripe'`);
                keyJson = JSON.parse(keyJson[0].jsonData);
                let secretKey = keyJson.secretKey;
                const Stripe = require('stripe');
                const stripe = Stripe(secretKey);
                let customer;
                if (!userData[0].stripeCustomerId) {
                    customer = yield stripe.customers.create({
                        name: currentUser.name,
                        address: {
                            line1: (_a = userData[0].addressLine1) !== null && _a !== void 0 ? _a : "",
                            postal_code: (_b = userData[0].postalCode) !== null && _b !== void 0 ? _b : "",
                            city: (_c = userData[0].cityName) !== null && _c !== void 0 ? _c : "",
                            state: (_d = userData[0].stateName) !== null && _d !== void 0 ? _d : "",
                            country: (_e = userData[0].countryName) !== null && _e !== void 0 ? _e : "",
                        }
                    });
                    if (customer.id) {
                        let updateId = yield apiHeader_1.default.query(`UPDATE users set stripeCustomerId = '` + customer.id + `' WHERE id = ` + userId + ``);
                    }
                }
                stripeCustomerId = userData[0].stripeCustomerId ? userData[0].stripeCustomerId : customer.id;
                if (stripeCustomerId) {
                    const paymentIntent = yield stripe.paymentIntents.create({
                        amount: req.body.amount,
                        currency: req.body.currency,
                        receipt_email: userData[0].email,
                        customer: stripeCustomerId,
                        description: 'matrimony',
                    });
                    console.log(paymentIntent);
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update Payment Gateway Successfully', paymentIntent, 1, authorizationResult.token);
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
exports.default = { getPaymentgateways, getPaymentgatewaysForPackage, generateRazorPayOrderId, stripePayment };
