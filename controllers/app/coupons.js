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
const NAMESPACE = 'Coupons';
const getCoupons = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Coupons');
        let requiredFields = ['packageId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let packageSql = `SELECT c.* FROM packagecoupons pc 
                INNER JOIN coupons c ON pc.couponId = c.id 
                WHERE c.isActive = true AND c.isDelete = false AND pc.packageId = ` + req.body.packageId;
                let packageResult = yield apiHeader_1.default.query(packageSql);
                if (packageResult && packageResult.length > 0) {
                    let validCoupon = true;
                    if (packageResult[0].maxUsage) {
                        //Check With userPAckages
                        let userPackageSql = `SELECT COUNT(id) as totalCount FROM userpackage WHERE couponId = ` + packageResult[0].id;
                        let userPackageResult = yield apiHeader_1.default.query(userPackageSql);
                        if (userPackageResult && userPackageResult.length > 0) {
                            if (userPackageResult[0].totalCount >= packageResult[0].maxUsage) {
                                validCoupon = false;
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Limit maximum usage', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }
                    if (packageResult[0].userUsage) {
                        //Check With userPAckages
                        let userPackageSql = `SELECT COUNT(id) as totalCount FROM userpackage WHERE userId = ` + authorizationResult.currentUser.id + ` AND couponId = ` + packageResult[0].id;
                        let userPackageResult = yield apiHeader_1.default.query(userPackageSql);
                        if (userPackageResult && userPackageResult.length > 0) {
                            if (userPackageResult[0].totalCount >= packageResult[0].maxUsage) {
                                validCoupon = false;
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'You already used this coupon', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }
                    if (packageResult[0].validFrom || packageResult[0].validTo) {
                        //Check With coupon
                        if (new Date(packageResult[0].validFrom).getTime() <= new Date().getTime()) {
                            if (new Date(packageResult[0].validTo).getTime() >= new Date().getTime()) {
                            }
                            else {
                                validCoupon = false;
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Coupon Expire', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                        else {
                            if (new Date(packageResult[0].validTo).getTime() >= new Date().getTime()) {
                            }
                            else {
                                validCoupon = false;
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Coupon Expire', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }
                    if (validCoupon) {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Coupon Successfully', [packageResult[0]], 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                }
                else {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Coupon Not Available', [], 1, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'coupon.applyCoponCode() Exception', error, '');
        next(errorResult);
    }
});
const applyCouponCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Coupons');
        let requiredFields = ['code', 'packageId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let packageSql = `SELECT c.* FROM packagecoupons pc 
                INNER JOIN coupons c ON pc.couponId = c.id 
                WHERE c.code = '` + req.body.code + `' AND c.isActive = true AND c.isDelete = false AND pc.packageId = ` + req.body.packageId;
                let packageResult = yield apiHeader_1.default.query(packageSql);
                if (packageResult && packageResult.length > 0) {
                    let validCoupon = true;
                    if (packageResult[0].maxUsage) {
                        //Check With userPAckages
                        let userPackageSql = `SELECT COUNT(id) as totalCount FROM userpackage WHERE couponId = ` + packageResult[0].id;
                        let userPackageResult = yield apiHeader_1.default.query(userPackageSql);
                        if (userPackageResult && userPackageResult.length > 0) {
                            if (userPackageResult[0].totalCount >= packageResult[0].maxUsage) {
                                validCoupon = false;
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Limit maximum usage', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }
                    if (packageResult[0].userUsage) {
                        //Check With userPAckages
                        let userPackageSql = `SELECT COUNT(id) as totalCount FROM userpackage WHERE userId = ` + authorizationResult.currentUser.id + ` AND couponId = ` + packageResult[0].id;
                        let userPackageResult = yield apiHeader_1.default.query(userPackageSql);
                        if (userPackageResult && userPackageResult.length > 0) {
                            if (userPackageResult[0].totalCount >= packageResult[0].maxUsage) {
                                validCoupon = false;
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'You already used this coupon', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }
                    if (packageResult[0].validFrom || packageResult[0].validTo) {
                        //Check With coupon
                        if (new Date(packageResult[0].validFrom).getTime() <= new Date().getTime()) {
                            if (new Date(packageResult[0].validTo).getTime() >= new Date().getTime()) {
                            }
                            else {
                                validCoupon = false;
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Coupon Expire', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                        else {
                            if (new Date(packageResult[0].validTo).getTime() >= new Date().getTime()) {
                            }
                            else {
                                validCoupon = false;
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Coupon Expire', [], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                        }
                    }
                    if (validCoupon) {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Coupon Successfully', [packageResult[0]], 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                }
                else {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Coupon Not Available', [], 1, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'coupon.applyCoponCode() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getCoupons, applyCouponCode };
