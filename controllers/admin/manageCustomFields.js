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
const NAMESPACE = 'ManageCustomFields';
const getCustomfields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Custom fields');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(*) as totalCount  FROM customfields";
            if (req.body.name) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                countSql += ` name LIKE '%` + req.body.name + `%' `;
            }
            let countResult = yield apiHeader_1.default.query(countSql);
            let sql = `SELECT * FROM customfields WHERE isDelete = 0 `;
            if (req.body.searchString) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                sql += ` name LIKE '%` + req.body.searchString + `%' `;
            }
            sql += ` ORDER BY id DESC `;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].valueTypeId == 1) {
                        result[i].valueTypeName = 'Text';
                    }
                    else if (result[i].valueTypeId == 2) {
                        result[i].valueTypeName = 'Number';
                    }
                    else if (result[i].valueTypeId == 3) {
                        result[i].valueTypeName = 'DropDownList';
                    }
                    else if (result[i].valueTypeId == 10) {
                        result[i].valueTypeName = 'MultipleDropDownList';
                    }
                    if (result[i].valueList && typeof result[i].valueList === 'string') {
                        const valueArray = result[i].valueList.includes(';') ? result[i].valueList.split(";") : [result[i].valueList];
                        result[i].valueList = valueArray;
                    }
                    if (result[i].defaultValue && typeof result[i].defaultValue === 'string' && result[i].valueTypeId === 10) {
                        const defaultValueArray = result[i].defaultValue.includes(';') ? result[i].defaultValue.split(';') : [result[i].defaultValue];
                        result[i].defaultValue = defaultValueArray;
                    }
                }
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get CustomFields Successfully', result, countResult[0].totalCount, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'customFields.getCustomFields() Exception', error, '');
        next(errorResult);
    }
});
const insertUpdateCustomField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Insert Update Custom field');
        let requiredFields = ['mappedFieldName'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                yield apiHeader_1.default.beginTransaction();
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                req.body.mappedFieldName = (req.body.mappedFieldName).trim();
                req.body.textLength = req.body.textLength ? req.body.textLength : null;
                let checkSql = `SELECT * FROM customfields WHERE mappedFieldName = '` + req.body.mappedFieldName + `'`;
                // if (req.body.id) {
                //     checkSql += ' AND id != ' + req.body.id;
                // }
                let checkResult = yield apiHeader_1.default.query(checkSql);
                if (checkResult && checkResult.length > 0 && !req.body.id) {
                    let errorResult = new resulterror_1.ResultError(203, true, "", new Error("Name Already Exist"), '');
                    next(errorResult);
                }
                else {
                    if (req.body.id) {
                        if (req.body.valueList && Array.isArray(req.body.valueList)) {
                            const semicolonSeparatedString = req.body.valueList.join(';');
                            req.body.valueList = semicolonSeparatedString;
                            console.log(req.body.valueList);
                        }
                        if (req.body.defaultValue && Array.isArray(req.body.defaultValue)) {
                            const semicolonSeparatedString = req.body.defaultValue.join(';');
                            req.body.defaultValue = semicolonSeparatedString;
                            console.log(req.body.defaultValue);
                        }
                        let sql = `UPDATE customfields SET displayName = '` + req.body.displayName + `',description = ` + (req.body.description ? `'` + req.body.description + `'` : null) + `,allowInSearch = ` + req.body.allowInSearch + `,allowInFilter = ` + req.body.allowInFilter + `, allowIncompleteProfile = ` + req.body.allowIncompleteProfile + `,allowInPreferences =` + req.body.allowInPreferences + `,defaultValue = ` + (req.body.defaultValue ? `'` + req.body.defaultValue + `'` : null) + `,valueList= ` + (req.body.valueList ? `'` + req.body.valueList + `'` : null) + `,completeprofilesectioname = ` + (req.body.completeprofilesectioname ? `'` + req.body.completeprofilesectioname + `'` : null) + ` ,modifiedBy = ` + userId + `, modifiedDate = CURRENT_TIMESTAMP  where id = ` + req.body.id + ``;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update Height', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "height.insertUpdateCustomFields() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    }
                    else {
                        if (req.body.valueList && Array.isArray(req.body.valueList)) {
                            const semicolonSeparatedString = req.body.valueList.join(';');
                            req.body.valueList = semicolonSeparatedString;
                            console.log(req.body.valueList);
                        }
                        // req.body.mappedFieldName = req.body.mappedFieldName.replace(/\s/g, "");
                        let sql = `INSERT INTO customfields(name,displayName,mappedFieldName,description,valueTypeId,textLength,isRequired,allowInSearch,allowInFilter,allowIncompleteProfile,allowInPreferences,defaultValue,valueList,completeprofilesectioname, createdBy, modifiedBy) VALUES('` + req.body.name + `','` + req.body.displayName + `','` + req.body.mappedFieldName + `',` + (req.body.description ? `'` + req.body.description + `'` : null) + `,` + req.body.valueTypeId + `,` + (req.body.textLength ? req.body.textLength : null) + `,` + req.body.isRequired + `,` + req.body.allowInSearch + `,` + req.body.allowInFilter + `,` + req.body.allowIncompleteProfile + `,` + req.body.allowInPreferences + `,` + (req.body.defaultValue ? `'` + req.body.defaultValue + `'` : null) + `,` + (req.body.valueList ? `'` + req.body.valueList + `'` : null) + `,` + (req.body.completeprofilesectioname ? `'` + req.body.completeprofilesectioname + `'` : null) + `,` + userId + `,` + userId + `)`;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            // let valueTypeSql = `SELECT * FROM valuetypes WHERE id = ` + req.body.valueTypeId;
                            // let valueTypeSqlResult = await header.query(valueTypeSql);
                            // let valueType = valueTypeSqlResult[0].valueTypeName;
                            // let valueTypeId = valueTypeSqlResult[0].valueTypeId
                            req.body.defaultValue = req.body.defaultValue != '' ? req.body.defaultValue : null;
                            let dataType;
                            if (req.body.valueTypeId == 1) {
                                dataType = 'VARCHAR(' + req.body.textLength + ')';
                            }
                            else if (req.body.valueTypeId == 2) {
                                dataType = 'INT';
                            }
                            else if (req.body.valueTypeId == 3 || req.body.valueTypeId == 10) {
                                dataType = 'LONGTEXT';
                            }
                            let addColumnSql = `ALTER TABLE userpersonaldetailcustomdata ADD COLUMN ` + req.body.mappedFieldName + ` ` + dataType + ` NULL DEFAULT null AFTER modifiedBy ;`;
                            let addColumnSqlResult = yield apiHeader_1.default.query(addColumnSql);
                            if (result && result.affectedRows > 0) {
                                // let successResult = new ResultSuccess(200, true, 'Insert Custom Field', addColumnSqlResult, 1, authorizationResult.token);
                                // return res.status(200).send(successResult);
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, "customField.insertUpdateCustomField() Error", new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                            yield apiHeader_1.default.commit();
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert Custom Field', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, "customField.insertUpdateCustomField() Error", new Error('Error While Inserting Data'), '');
                            next(errorResult);
                        }
                    }
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
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'Customfield.insertUpdateCustomField() Exception', error, '');
        next(errorResult);
    }
});
const toggleActiveCustomField = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Active Inactive Height');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE customfields set isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Change Custom Fields Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "customFields.toggleActiveCustomField() Error", new Error('Error While Change Height Status'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'customFields.toggleActiveCustomField() Exception', error, '');
        next(errorResult);
    }
});
const getCustomfieldValueType = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Custom field Value Type');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            // let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            // let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = "SELECT COUNT(*) as totalCount  FROM valuetypes";
            // if (req.body.name) {
            //     if (!countSql.includes(` WHERE `)) {
            //         countSql += ` WHERE `;
            //     } else {
            //         countSql += ` AND `;
            //     }
            //     countSql += ` name LIKE '%` + req.body.name + `%' `;
            // }
            let countResult = yield apiHeader_1.default.query(countSql);
            let sql = `SELECT * FROM valuetypes WHERE isDelete = 0 AND isShowInCustomField = 1`;
            // if (req.body.name) {
            //     if (!sql.includes(` WHERE `)) {
            //         sql += ` WHERE `;
            //     } else {
            //         sql += ` AND `;
            //     }
            //     sql += ` name LIKE '%` + req.body.name + `%' `;
            // }
            // sql += ` ORDER BY id DESC `;
            // if (startIndex != null && fetchRecord != null) {
            //     sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            // }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get CustomFields Successfully', result, countResult[0].totalCount, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'customFields.getCustomFields() Exception', error, '');
        next(errorResult);
    }
});
const removeCustomfields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Remove Custom fields');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                yield apiHeader_1.default.beginTransaction();
                let mappedFieldName = yield apiHeader_1.default.query(`SELECT mappedFieldName FROM  customfields WHERE id = ` + req.body.id);
                let sql = `ALTER TABLE userpersonaldetailcustomdata DROP COLUMN ` + mappedFieldName[0].mappedFieldName;
                let result = yield apiHeader_1.default.query(sql);
                if (result) {
                    yield apiHeader_1.default.query(`DELETE FROM customfields WHERE id =` + req.body.id);
                    yield apiHeader_1.default.commit();
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Remove CustomFields Successfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    yield apiHeader_1.default.rollback();
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
        let errorResult = new resulterror_1.ResultError(500, true, 'customFields.removeCustomfields() Exception', error, '');
        next(errorResult);
    }
});
const getCustomfieldDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Custom fields');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `SELECT * FROM customfields WHERE isDelete = 0 AND id=` + req.body.id;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].valueTypeId == 1) {
                            result[i].valueTypeName = 'Text';
                        }
                        else if (result[i].valueTypeId == 2) {
                            result[i].valueTypeName = 'Number';
                        }
                        else if (result[i].valueTypeId == 3) {
                            result[i].valueTypeName = 'DropDownList';
                        }
                        else if (result[i].valueTypeId == 10) {
                            result[i].valueTypeName = 'MultipleDropDownList';
                        }
                        if (result[i].valueList && typeof result[i].valueList === 'string') {
                            const valueArray = result[i].valueList.includes(';') ? result[i].valueList.split(";") : [result[i].valueList];
                            result[i].valueList = valueArray;
                        }
                        // if (result[i].defaultValue && typeof result[i].defaultValue === 'string' && result[i].valueTypeId == 10) {
                        //     const defaultValueArray: string[] = result[i].defaultValue.includes(';') ? result[i].defaultValue.split(";") : [result[i].valueList];
                        //     result[i].defaultValue = defaultValueArray;
                        // }
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get CustomFields Successfully', result, 1, authorizationResult.token);
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
        let errorResult = new resulterror_1.ResultError(500, true, 'customFields.getCustomFields() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getCustomfields, toggleActiveCustomField, getCustomfieldValueType, removeCustomfields, insertUpdateCustomField, getCustomfieldDetail };
