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
const NAMESPACE = 'User Pages';
const getUserPages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting User Pages');
        let requiredFields = ['userId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `SELECT * FROM pages WHERE isActive = 1 AND isDelete = 0`;
                let result = yield apiHeader_1.default.query(sql);
                if (result) {
                    if (result.length > 0) {
                        let innerSql = `SELECT * FROM userpages WHERE userId = ` + req.body.userId;
                        let innerResult = yield apiHeader_1.default.query(innerSql);
                        for (let i = 0; i < result.length; i++) {
                            result[i].userId = req.body.userId;
                            result[i].userPageId = null;
                            result[i].isReadPermission = false;
                            result[i].isSelected = false;
                            result[i].isAddPermission = false;
                            result[i].isDeletePermission = false;
                            result[i].isEditPermission = false;
                            if (innerResult && innerResult.length > 0) {
                                let ind = innerResult.findIndex((c) => c.pageId == result[i].id);
                                if (ind >= 0) {
                                    result[i].userPageId = innerResult[ind].id;
                                    result[i].isSelected = true;
                                    result[i].isReadPermission = innerResult[ind].isReadPermission == 1 ? true : false;
                                    result[i].isAddPermission = innerResult[ind].isAddPermission == 1 ? true : false;
                                    result[i].isDeletePermission = innerResult[ind].isDeletePermission == 1 ? true : false;
                                    result[i].isEditPermission = innerResult[ind].isEditPermission == 1 ? true : false;
                                }
                            }
                        }
                    }
                    let groups = result.filter((c) => c.parentId == null);
                    for (let group of groups) {
                        let pages = result.filter((c) => c.parentId == group.id);
                        group.pages = pages;
                    }
                    result = groups;
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get User Pages Successfully', result, result.length, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "userPages.getUserPages() Error", new Error('Error While Getting Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'userPages.getUserPages() Exception', error, '');
        next(errorResult);
    }
});
const insertUpdateUserPages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield apiHeader_1.default.beginTransaction();
    try {
        let result;
        logging_1.default.info(NAMESPACE, 'Inserting User Pages');
        let requiredFields = ['userId', 'userPages'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let getUserPagePermissionSql = `SELECT * FROM userpages WHERE userId = ` + req.body.userId;
                let getUserPagePermissionResult = yield apiHeader_1.default.query(getUserPagePermissionSql);
                if (req.body.userPages && req.body.userPages.length > 0) {
                    for (let i = 0; i < req.body.userPages.length; i++) {
                        if (req.body.userPages[i].userPageId) {
                            //update
                            let sql = `UPDATE userpages SET isReadPermission = ?, isAddPermission = ?, isEditPermission = ?, isDeletePermission = ?, modifiedDate = CURRENT_TIMESTAMP()
                            , modifiedBy = ` + currentUser.id + ` WHERE id = ` + req.body.userPages[i].userPageId;
                            result = yield apiHeader_1.default.query(sql, [req.body.userPages[i].isReadPermission, req.body.userPages[i].isAddPermission,
                                req.body.userPages[i].isEditPermission, req.body.userPages[i].isDeletePermission]);
                            if (result && result.affectedRows >= 0) {
                                getUserPagePermissionResult.splice(getUserPagePermissionResult.findIndex((c) => c.id == req.body.userPages[i].userPageId), 1);
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, "userPages.insertUpdateUserPages() Error", new Error('Error While Updating Permission'), '');
                                next(errorResult);
                            }
                        }
                        else {
                            //insert
                            let sql = `INSERT INTO userpages(userId, pageId, isReadPermission, isAddPermission, isEditPermission, isDeletePermission, createdBy) VALUES(` + req.body.userId + `, ` + req.body.userPages[i].id + `
                            , ?, ?, ?, ?, ` + currentUser.id + `)`;
                            result = yield apiHeader_1.default.query(sql, [req.body.userPages[i].isReadPermission, req.body.userPages[i].isAddPermission,
                                req.body.userPages[i].isEditPermission, req.body.userPages[i].isDeletePermission]);
                            if (result && result.insertId) {
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, "userPages.insertUpdateUserPages() Error", new Error('Error While Inserting Permission'), '');
                                next(errorResult);
                            }
                        }
                    }
                    if (getUserPagePermissionResult && getUserPagePermissionResult.length > 0) {
                        let removeIds = [];
                        removeIds = getUserPagePermissionResult.map((c) => c.id);
                        let deleteSql = `DELETE FROM userpages WHERE id IN(` + removeIds.toString() + `)`;
                        result = yield apiHeader_1.default.query(deleteSql);
                        if (result && result.affectedRows >= 0) {
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, "userPages.insertUpdateUserPages() Error", new Error('Error While Delete Permission'), '');
                            next(errorResult);
                        }
                    }
                    yield apiHeader_1.default.commit();
                    let getsql = `SELECT * FROM pages WHERE isActive = 1 AND isDelete = 0`;
                    let getresult = yield apiHeader_1.default.query(getsql);
                    if (getresult) {
                        if (getresult.length > 0) {
                            let innerSql = `SELECT * FROM userpages WHERE userId = ` + req.body.userId;
                            let innerResult = yield apiHeader_1.default.query(innerSql);
                            for (let i = 0; i < getresult.length; i++) {
                                getresult[i].userId = req.body.userId;
                                getresult[i].userPageId = null;
                                getresult[i].isReadPermission = false;
                                getresult[i].isSelected = false;
                                getresult[i].isAddPermission = false;
                                getresult[i].isDeletePermission = false;
                                getresult[i].isEditPermission = false;
                                if (innerResult && innerResult.length > 0) {
                                    let ind = innerResult.findIndex((c) => c.pageId == getresult[i].id);
                                    if (ind >= 0) {
                                        getresult[i].userPageId = innerResult[ind].id;
                                        getresult[i].isSelected = true;
                                        getresult[i].isReadPermission = innerResult[ind].isReadPermission = 1 ? true : false;
                                        getresult[i].isAddPermission = innerResult[ind].isAddPermission = 1 ? true : false;
                                        getresult[i].isDeletePermission = innerResult[ind].isDeletePermission = 1 ? true : false;
                                        getresult[i].isEditPermission = innerResult[ind].isEditPermission = 1 ? true : false;
                                    }
                                }
                            }
                        }
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get User Pages Successfully', getresult, getresult.length, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, "userPages.insertUpdateUserPages() Error", new Error('Error While Getting Data'), '');
                        next(errorResult);
                    }
                }
                else {
                    let sql = `DELETE FROM userpages WHERE userId = ` + req.body.userId;
                    result = yield apiHeader_1.default.query(sql);
                    if (result && result.affectedRows >= 0) {
                        yield apiHeader_1.default.commit();
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get User Pages Successfully', [], 0, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, "userPages.insertUpdateUserPages() Error", new Error('Error While Delete Permission'), '');
                        next(errorResult);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'userPages.insertUpdateUserPages() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getUserPages, insertUpdateUserPages };
