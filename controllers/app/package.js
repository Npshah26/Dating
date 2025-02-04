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
const notifications_1 = __importDefault(require("./../notifications"));
const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });
// const query = util.promisify(connection.query).bind(connection);
const NAMESPACE = 'Package';
const getpackage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Package');
        // let authorizationResult = await header.validateAuthorization(req, res, next);
        // if (authorizationResult.statusCode == 200) {
        let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
        let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
        let result;
        let countSql = "SELECT COUNT(*) as totalCount  FROM timeduration";
        let countResult = yield apiHeader_1.default.query(countSql);
        let sql = `SELECT * FROM timeduration WHERE isDelete = 0 ORDER BY value ASC`;
        result = yield apiHeader_1.default.query(sql);
        if (result) {
            if (result && result.length > 0) {
                for (let y = 0; y < result.length; y++) {
                    sql = `SELECT p.* , pd.id as packageDurationId, pd.timeDurationId, td.value, pd.discount FROM package p
                        LEFT JOIN packageduration pd ON pd.packageId = p.id
                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                        WHERE p.isActive = true AND p.isDelete = false AND pd.timeDurationId = ` + result[y].id;
                    if (startIndex != null && fetchRecord != null) {
                        sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
                    }
                    result[y].package = yield apiHeader_1.default.query(sql);
                    let packageData = result[y].package;
                    if (packageData) {
                        if (packageData && packageData.length > 0) {
                            for (let index = 0; index < packageData.length; index++) {
                                sql = `SELECT packagefacility.*, pf.name FROM packagefacility
                                    LEFT JOIN premiumfacility pf ON pf.id = packagefacility.premiumFacilityId
                                     WHERE packageId = ` + packageData[index].id;
                                result[y].package[index].facility = yield apiHeader_1.default.query(sql);
                                // sql = `SELECT * FROM packageduration WHERE packageId = ` + result[index].id;
                                // result[index].duration = await query(sql);
                            }
                        }
                    }
                }
            }
            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Package Successfully', result, countResult[0].totalCount, '');
            return res.status(200).send(successResult);
        }
        else {
            let errorResult = new resulterror_1.ResultError(400, true, "package.getpackage() Error", new Error('Error While Getting Data'), '');
            next(errorResult);
        }
        // } else {
        //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
        //     next(errorResult);
        // }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'package.getpackage() Exception', error, '');
        next(errorResult);
    }
});
const getpackageV2 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Package');
        // let authorizationResult = await header.validateAuthorization(req, res, next);
        // if (authorizationResult.statusCode == 200) {
        let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
        let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
        let result;
        let countSql = "SELECT COUNT(*) as totalCount  FROM package WHERE isActive = true AND isDelete = false";
        let countResult = yield apiHeader_1.default.query(countSql);
        let sql = `SELECT * FROM package WHERE isActive = true AND isDelete = false`;
        if (startIndex != null && fetchRecord != null) {
            sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
        }
        sql += ` ORDER BY weightage DESC`;
        result = yield apiHeader_1.default.query(sql);
        // result[0].package = data;
        if (result) {
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    let durationSql = `SELECT pd.id , pd.timeDurationId, td.value, pd.discount,p.baseAmount, p.name FROM packageduration pd 
                                        LEFT JOIN package p ON p.id = pd.packageId
                                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId WHERE pd.packageId = ` + result[i].id + ``;
                    result[i].duration = yield apiHeader_1.default.query(durationSql);
                    for (let ind = 0; ind < result[i].duration.length; ind++) {
                        let duration = result[i].duration[ind];
                        duration.discountAmount = duration.baseAmount * duration.value - duration.baseAmount * duration.value * (duration.discount / 100);
                        duration.packageId = duration.name.toLowerCase() + '_' + duration.value;
                        duration.totalAmount = duration.baseAmount * duration.value;
                    }
                    sql = `SELECT packagefacility.*, pf.name FROM packagefacility
                    LEFT JOIN premiumfacility pf ON pf.id = packagefacility.premiumFacilityId
                     WHERE packageId = ` + result[i].id;
                    result[i].facility = yield apiHeader_1.default.query(sql);
                }
            }
            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Package Successfully', result, countResult[0].totalCount, '');
            return res.status(200).send(successResult);
        }
        else {
            let errorResult = new resulterror_1.ResultError(400, true, "package.getpackage() Error", new Error('Error While Getting Data'), '');
            next(errorResult);
        }
        // } else {
        //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
        //     next(errorResult);
        // }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'package.getpackage() Exception', error, '');
        next(errorResult);
    }
});
const savePremiumAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield apiHeader_1.default.beginTransaction();
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Premium Account');
        let requiredFields = ['packageId', 'packageDurationId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let checkPaymentStatusSql = `SELECT * FROM payment WHERE id = ` + (req.body.paymentId ? req.body.paymentId : 0) + ` AND LOWER(paymentStatus) = 'pending'`;
                let checkPaymentStatusResult = yield apiHeader_1.default.query(checkPaymentStatusSql);
                if (checkPaymentStatusResult && checkPaymentStatusResult.length > 0) {
                    if (checkPaymentStatusResult[0].paymentMode == 'Wallet') {
                        let walletSql = ` UPDATE userwallets SET amount = amount - ` + checkPaymentStatusResult[0].amount + ` WHERE userId = ` + userId;
                        let walletResult = yield apiHeader_1.default.query(walletSql);
                        let userWalletIdResult = yield apiHeader_1.default.query(`SELECT id FROM userwallets WHERE userId =` + userId);
                        let walletHistorySql = ` INSERT INTO userwallethistory (userWalletId,amount,isCredit,transactionDate,remark,paymentId,createdBy,modifiedBy) 
                        VALUES (` + userWalletIdResult[0].id + `,` + checkPaymentStatusResult[0].amount + `,false,CURRENT_DATE(),'Purchase Package',` + checkPaymentStatusResult[0].id + `,` + userId + `,` + userId + `)`;
                        let walletHistoryResult = yield apiHeader_1.default.query(walletHistorySql);
                    }
                    let sql = `INSERT INTO userpackage(packageId, packageDurationId, startDate, endDate, netAmount, purchaseDate, userId, paymentId, signature, originalJson, purchaseToken, createdBy, modifiedBy, couponId)
                        VALUES(` + req.body.packageId + `, ` + req.body.packageDurationId + `, ?, ?, ` + req.body.netAmount + `, ?, ` + userId + `
                            , ` + (req.body.paymentId ? req.body.paymentId : null) + `, ` + (req.body.signature ? "'" + req.body.signature + "'" : null) + `
                            , ` + (req.body.originalJson ? "'" + req.body.originalJson + "'" : null) + `, ` + (req.body.purchaseToken ? "'" + req.body.purchaseToken + "'" : null) + `, ` + userId + `, ` + userId + `, ` + (req.body.couponId ? "'" + req.body.couponId + "'" : null) + `)`;
                    let result = yield apiHeader_1.default.query(sql, [null, null, (req.body.purchaseDate ? new Date(req.body.purchaseDate) : null)]);
                    if (result && result.insertId > 0) {
                        let id = result.insertId;
                        let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                                LEFT JOIN package p ON p.id = up.packageId
                                                LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + userId + ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                                order by p.weightage DESC`;
                        let userPackage = yield apiHeader_1.default.query(userPackages);
                        if (userPackage && userPackage.length > 0) {
                            for (let k = 0; k < userPackage.length; k++) {
                                let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                        LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                         WHERE pf.packageId = ` + userPackage[k].packageId);
                                userPackage[k].packageFacility = packageFacility;
                            }
                        }
                        result[0] = userPackage[0];
                        let adminUserSql = `SELECT * FROM users where id IN(select userId from userroles where(roleId = 1 OR roleId = 3)) AND isActive = true AND isDelete = false`;
                        let adminUserResult = yield apiHeader_1.default.query(adminUserSql);
                        if (adminUserResult && adminUserResult.length > 0) {
                            for (let a = 0; a < adminUserResult.length; a++) {
                                if (adminUserResult[a].isReceiveNotification) {
                                    let deviceDetailSql = `SELECT * FROM userdevicedetail WHERE userId = ` + adminUserResult[a].id + ` AND fcmToken IS NOT NULL`;
                                    let deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                    if (deviceDetailResult && deviceDetailResult.length > 0) {
                                        let title = "Package Purchase";
                                        let userSql = `SELECT u.firstName, u.lastName, p.name from userpackage up INNER JOIN package p ON p.id = up.packageId INNER JOIN users u ON u.id = up.userId WHERE up.id = ` + id;
                                        let userResult = yield apiHeader_1.default.query(userSql);
                                        let description = "User " + ((userResult && userResult.length > 0) ? userResult[0].firstName : '') + " " + ((userResult && userResult.length > 0) ? userResult[0].lastName : '') + "  purchase new package. Please verify and approve";
                                        let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                        VALUES(` + adminUserResult[a].id + `, '` + title + `', '` + description + `', null, null, ` + authorizationResult.currentUser.id + `, ` + authorizationResult.currentUser.id + `)`;
                                        let notificationResult = yield apiHeader_1.default.query(notificationSql);
                                        yield notifications_1.default.sendMultipleNotification([deviceDetailResult[0].fcmToken], null, title, description, '', null, null, 0);
                                        console.log("Send" + deviceDetailResult[0].fcmToken);
                                    }
                                }
                            }
                        }
                        yield apiHeader_1.default.commit();
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Save Premium Account', result[0], 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, "package.savePremiumAccount() Error", new Error('Error While Updating Data'), '');
                        next(errorResult);
                    }
                }
                else {
                    let getUserPackageSql = `SELECT up.*, p.weightage FROM userpackage up INNER JOIN package p ON p.id = up.packageId WHERE up.isActive = 1 AND up.isDelete = 0 AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP()) 
                    AND up.userId = ` + userId + ` ORDER BY up.endDate`;
                    let getUserPackageResult = yield apiHeader_1.default.query(getUserPackageSql);
                    let currentPackageSql = `SELECT p.*, t.value as month FROM package p INNER JOIN packageduration pd ON pd.packageId = p.id INNER JOIN timeduration t on t.id = pd.timeDurationId WHERE pd.id = ` + req.body.packageDurationId;
                    let currentPackageResult = yield apiHeader_1.default.query(currentPackageSql);
                    if (getUserPackageResult && getUserPackageResult.length > 0 && currentPackageResult && currentPackageResult.length > 0) {
                        let filterData = getUserPackageResult.filter((c) => c.weightage >= currentPackageResult[0].weightage);
                        if (filterData && filterData.length > 0) {
                            //extend
                            let startDate = new Date(filterData[filterData.length - 1].endDate).getFullYear() + "-" + (new Date(filterData[filterData.length - 1].endDate).getMonth() + 1) + "-" + (new Date(filterData[filterData.length - 1].endDate).getDate() + 1) + " 00:00:00";
                            let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + currentPackageResult[0].month));
                            let endDate = new Date(eDt).getFullYear() + "-" + (new Date(eDt).getMonth() + 1) + "-" + (new Date(eDt).getDate()) + " 23:59:59";
                            let checkPaymentStatusSql = `SELECT * FROM payment WHERE id = ` + (req.body.paymentId ? req.body.paymentId : 0);
                            let checkPaymentStatusResult = yield apiHeader_1.default.query(checkPaymentStatusSql);
                            if (checkPaymentStatusResult && checkPaymentStatusResult.length > 0 && checkPaymentStatusResult[0].paymentMode == 'Wallet') {
                                let walletSql = ` UPDATE userwallets SET amount = amount - ` + req.body.netAmount + ` WHERE userId = ` + userId;
                                let walletResult = yield apiHeader_1.default.query(walletSql);
                                let userWalletIdResult = yield apiHeader_1.default.query(`SELECT id FROM userwallets WHERE userId =` + userId);
                                let walletHistorySql = ` INSERT INTO userwallethistory (userWalletId,amount,isCredit,transactionDate,remark,paymentId,createdBy,modifiedBy) 
                        VALUES (` + userWalletIdResult[0].id + `,` + req.body.netAmount + `,false,CURRENT_DATE(),'Purchase Package', ` + (req.body.paymentId ? req.body.paymentId : null) + `,` + userId + `,` + userId + `)`;
                                let walletHistoryResult = yield apiHeader_1.default.query(walletHistorySql);
                            }
                            let sql = `INSERT INTO userpackage(packageId, packageDurationId, startDate, endDate, netAmount, purchaseDate, userId, paymentId, signature, originalJson, purchaseToken, createdBy, modifiedBy, couponId)
                        VALUES(` + req.body.packageId + `, ` + req.body.packageDurationId + `, ?, ?, ` + req.body.netAmount + `, ?, ` + userId + `
                            , ` + (req.body.paymentId ? req.body.paymentId : null) + `, ` + (req.body.signature ? "'" + req.body.signature + "'" : null) + `
                            , ` + (req.body.originalJson ? "'" + req.body.originalJson + "'" : null) + `, ` + (req.body.purchaseToken ? "'" + req.body.purchaseToken + "'" : null) + `, ` + userId + `, ` + userId + `,` + (req.body.couponId ? "'" + req.body.couponId + "'" : null) + `)`;
                            let result = yield apiHeader_1.default.query(sql, [new Date(startDate), new Date(endDate), (req.body.purchaseDate ? new Date(req.body.purchaseDate) : null)]);
                            if (result && result.insertId > 0) {
                                let id = result.insertId;
                                let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                                    LEFT JOIN package p ON p.id = up.packageId
                                                    LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                    LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                    WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + userId + ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                                                    order by p.weightage DESC`;
                                let userPackage = yield apiHeader_1.default.query(userPackages);
                                if (userPackage && userPackage.length > 0) {
                                    for (let k = 0; k < userPackage.length; k++) {
                                        let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                                            LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                                             WHERE pf.packageId = ` + userPackage[k].packageId);
                                        userPackage[k].packageFacility = packageFacility;
                                    }
                                }
                                result[0] = userPackage[0];
                                yield apiHeader_1.default.commit();
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Save Premium Account', result[0], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, "package.savePremiumAccount() Error", new Error('Error While Updating Data'), '');
                                next(errorResult);
                            }
                        }
                        else {
                            //overright
                            let startDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " 00:00:00";
                            let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + currentPackageResult[0].month));
                            let endDate = new Date(eDt).getFullYear() + "-" + (new Date(eDt).getMonth() + 1) + "-" + (new Date(eDt).getDate()) + " 23:59:59";
                            let checkPaymentStatusSql = `SELECT * FROM payment WHERE id = ` + (req.body.paymentId ? req.body.paymentId : 0);
                            let checkPaymentStatusResult = yield apiHeader_1.default.query(checkPaymentStatusSql);
                            if (checkPaymentStatusResult && checkPaymentStatusResult.length > 0 && checkPaymentStatusResult[0].paymentMode == 'Wallet') {
                                let walletSql = ` UPDATE userwallets SET amount = amount - ` + req.body.netAmount + ` WHERE userId = ` + userId;
                                let walletResult = yield apiHeader_1.default.query(walletSql);
                                let userWalletIdResult = yield apiHeader_1.default.query(`SELECT id FROM userwallets WHERE userId =` + userId);
                                let walletHistorySql = ` INSERT INTO userwallethistory (userWalletId,amount,isCredit,transactionDate,remark,paymentId,createdBy,modifiedBy) 
                        VALUES (` + userWalletIdResult[0].id + `,` + req.body.netAmount + `,false,CURRENT_DATE(),'Purchase Package', ` + (req.body.paymentId ? req.body.paymentId : null) + `,` + userId + `,` + userId + `)`;
                                let walletHistoryResult = yield apiHeader_1.default.query(walletHistorySql);
                            }
                            let sql = `INSERT INTO userpackage(packageId, packageDurationId, startDate, endDate, netAmount, purchaseDate, userId, paymentId, signature, originalJson, purchaseToken, createdBy, modifiedBy, couponId)
                        VALUES(` + req.body.packageId + `, ` + req.body.packageDurationId + `, ?, ?, ` + req.body.netAmount + `, ?, ` + userId + `
                            , ` + (req.body.paymentId ? req.body.paymentId : null) + `, ` + (req.body.signature ? "'" + req.body.signature + "'" : null) + `
                            , ` + (req.body.originalJson ? "'" + req.body.originalJson + "'" : null) + `, ` + (req.body.purchaseToken ? "'" + req.body.purchaseToken + "'" : null) + `, ` + userId + `, ` + userId + `,` + (req.body.couponId ? "'" + req.body.couponId + "'" : null) + `)`;
                            let result = yield apiHeader_1.default.query(sql, [new Date(startDate), new Date(endDate), (req.body.purchaseDate ? new Date(req.body.purchaseDate) : null)]);
                            if (result && result.insertId > 0) {
                                let id = result.insertId;
                                let insertedPackageDurationSql = `SELECT t.* FROM timeduration t INNER JOIN packageduration pd ON pd.timeDurationId = t.id WHERE pd.id = ` + req.body.packageDurationId;
                                let insertedPackageDurationResult = yield apiHeader_1.default.query(insertedPackageDurationSql);
                                let getFuturePackageSql = `SELECT up.*, t.value as month FROM userpackage up INNER JOIN packageduration pd ON pd.id = up.packageDurationId 
                            INNER JOIN timeduration t on t.id = pd.timeDurationId WHERE up.isActive = 1 AND up.isDelete = 0 AND DATE(up.startDate) > DATE(CURRENT_TIMESTAMP()) AND up.id != ` + id;
                                let getFuturePackageResult = yield apiHeader_1.default.query(getFuturePackageSql);
                                if (getFuturePackageResult && getFuturePackageResult.length > 0 && insertedPackageDurationResult && insertedPackageDurationResult.length > 0) {
                                    for (let i = 0; i < getFuturePackageResult.length; i++) {
                                        let sDt = new Date(endDate);
                                        let startDate = new Date(sDt).getFullYear() + "-" + (new Date(sDt).getMonth() + 1) + "-" + (new Date(sDt).getDate() + 1) + " 00:00:00";
                                        let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + getFuturePackageResult[i].month));
                                        let endnDate = new Date(eDt).getFullYear() + "-" + (new Date(eDt).getMonth() + 1) + "-" + (new Date(eDt).getDate()) + " 23:59:59";
                                        let updateUserPackageSql = `UPDATE userpackage SET startDate = ?, endDate = ? WHERE id = ` + getFuturePackageResult[i].id;
                                        let updateUserPackageResult = yield apiHeader_1.default.query(updateUserPackageSql, [startDate, endnDate]);
                                        if (updateUserPackageResult && updateUserPackageResult.affectedRows >= 0) {
                                        }
                                        else {
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, "package.savePremiumAccount() Error", new Error('Error While Updating Data'), '');
                                            next(errorResult);
                                        }
                                    }
                                }
                                let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                            LEFT JOIN package p ON p.id = up.packageId
                            LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                            LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                            WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + userId + ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                            order by p.weightage DESC`;
                                let userPackage = yield apiHeader_1.default.query(userPackages);
                                if (userPackage && userPackage.length > 0) {
                                    for (let k = 0; k < userPackage.length; k++) {
                                        let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                    LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                     WHERE pf.packageId = ` + userPackage[k].packageId);
                                        userPackage[k].packageFacility = packageFacility;
                                    }
                                }
                                result[0] = userPackage[0];
                                yield apiHeader_1.default.commit();
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Save Premium Account', result[0], 1, authorizationResult.token);
                                return res.status(200).send(successResult);
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, "package.savePremiumAccount() Error", new Error('Error While Updating Data'), '');
                                next(errorResult);
                            }
                        }
                    }
                    else {
                        //insert
                        let startDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " 00:00:00";
                        let eDt = new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + currentPackageResult[0].month));
                        let endDate = new Date(eDt).getFullYear() + "-" + (new Date(eDt).getMonth() + 1) + "-" + (new Date(eDt).getDate()) + " 23:59:59";
                        let checkPaymentStatusSql = `SELECT * FROM payment WHERE id = ` + (req.body.paymentId ? req.body.paymentId : 0);
                        let checkPaymentStatusResult = yield apiHeader_1.default.query(checkPaymentStatusSql);
                        if (checkPaymentStatusResult && checkPaymentStatusResult.length > 0 && checkPaymentStatusResult[0].paymentMode == 'Wallet') {
                            let walletSql = ` UPDATE userwallets SET amount = amount - ` + req.body.netAmount + ` WHERE userId = ` + userId;
                            let walletResult = yield apiHeader_1.default.query(walletSql);
                            let userWalletIdResult = yield apiHeader_1.default.query(`SELECT id FROM userwallets WHERE userId =` + userId);
                            let walletHistorySql = ` INSERT INTO userwallethistory (userWalletId,amount,isCredit,transactionDate,remark,paymentId,createdBy,modifiedBy) 
                    VALUES (` + userWalletIdResult[0].id + `,` + req.body.netAmount + `,false,CURRENT_DATE(),'Purchase Package', ` + (req.body.paymentId ? req.body.paymentId : null) + `,` + userId + `,` + userId + `)`;
                            let walletHistoryResult = yield apiHeader_1.default.query(walletHistorySql);
                        }
                        let sql = `INSERT INTO userpackage(packageId, packageDurationId, startDate, endDate, netAmount, purchaseDate, userId, paymentId, signature, originalJson, purchaseToken, createdBy, modifiedBy, couponId)
                        VALUES(` + req.body.packageId + `, ` + req.body.packageDurationId + `, ?, ?, ` + req.body.netAmount + `,? , ` + userId + `, ` + (req.body.paymentId ? req.body.paymentId : null) + `
                            , ` + (req.body.signature ? "'" + req.body.signature + "'" : null) + `
                            , ` + (req.body.originalJson ? "'" + req.body.originalJson + "'" : null) + `, ` + (req.body.purchaseToken ? "'" + req.body.purchaseToken + "'" : null) + `, ` + userId + `, ` + userId + `,` + (req.body.couponId ? "'" + req.body.couponId + "'" : null) + `)`;
                        let result = yield apiHeader_1.default.query(sql, [new Date(startDate), new Date(endDate), (req.body.purchaseDate ? new Date(req.body.purchaseDate) : null)]);
                        if (result && result.insertId > 0) {
                            let id = result.insertId;
                            let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                        LEFT JOIN package p ON p.id = up.packageId
                        LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                        WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + userId + ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                        order by p.weightage DESC`;
                            let userPackage = yield apiHeader_1.default.query(userPackages);
                            if (userPackage && userPackage.length > 0) {
                                for (let k = 0; k < userPackage.length; k++) {
                                    let packageFacility = yield apiHeader_1.default.query(`SELECT pf.*, pff.name FROM packagefacility pf
                                LEFT JOIN premiumfacility pff ON pff.id = pf.premiumFacilityId
                                 WHERE pf.packageId = ` + userPackage[k].packageId);
                                    userPackage[k].packageFacility = packageFacility;
                                }
                            }
                            result[0] = userPackage[0];
                            yield apiHeader_1.default.commit();
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Save Premium Account', result[0], 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, "package.savePremiumAccount() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    }
                }
            }
            else {
                yield apiHeader_1.default.rollback();
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
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'package.savePremiumAccount() Exception', error, '');
        next(errorResult);
    }
});
const getPackageByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Proposals');
        let requiredFields = ['userId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let sql = `SELECT up.id, up.packageId, p.name as packageName, up.packageDurationId, up.startDate, up.endDate, up.netAmount, pay.paymentMode, pay.paymentStatus
                            , t.value   FROM  userpackage up
                LEFT JOIN package p on p.id = up.packageId
                LEFT join payment pay on pay.id = up.paymentId
                left join packageduration pd on pd.id = up.packageDurationId
                left join timeduration t on t.id = pd.timeDurationId
                WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + req.body.userId + ` order by up.createdDate desc`;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length >= 0) {
                    // let id = result.insertId;
                    //  sql = `SELECT * From userpackage WHERE id = ` + id;
                    //  result = await query(sql);
                    for (let i = 0; i < result.length; i++) {
                        result[i].status = "";
                        if (result[i].paymentStatus == "Pending") {
                            result[i].status = "Pending";
                        }
                        else {
                            let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                        LEFT JOIN package p ON p.id = up.packageId
                        LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                        LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                        WHERE up.isActive = 1 AND up.isDelete = 0 AND up.userId = ` + req.body.userId + ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
                        order by p.weightage DESC`;
                            let userPackage = yield apiHeader_1.default.query(userPackages);
                            if (userPackage && userPackage.length > 0) {
                                for (let j = 0; j < userPackage.length; j++) {
                                    if (userPackage[0].id == result[i].id) {
                                        result[i].status = "Active";
                                    }
                                    else {
                                        result[i].status = "Override";
                                    }
                                }
                            }
                            //if (result[i].endDate || result[i].startDate) {
                            if (new Date(result[i].endDate).getTime() < new Date().getTime()) {
                                result[i].status = "Expired";
                            }
                            else if (new Date(result[i].startDate).getTime() > new Date().getTime()) {
                                result[i].status = "Upcomming";
                            }
                            //} else {
                            //    result[i].status = "Pending";
                            //}
                        }
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Package of Users', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "package.getPackageByUserId() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'package.getPackageByUserId() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getpackage, savePremiumAccount, getPackageByUserId, getpackageV2 };
