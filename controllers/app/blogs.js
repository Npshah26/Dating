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
// import { JSDOM } from 'jsdom';
// import * as jsdom from 'jsdom';
const fs = require('fs');
// const mysql = require('mysql');
// const util = require('util');
// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });
// const query = util.promisify(connection.query).bind(connection);
const NAMESPACE = 'Blog';
const getBlogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Get Blogs');
        // let authorizationResult;
        let userId = 0;
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let sql = `SELECT * FROM blogs WHERE isDelete = 0 `;
            let countSql = "SELECT COUNT(*) as totalCount  FROM blogs WHERE isDelete = 0 AND isActive = 1";
            if (req.body.searchString) {
                sql += ` AND description LIKE '%` + req.body.searchString + `%' `;
                countSql += ` AND description LIKE '%` + req.body.searchString + `%' `;
            }
            sql += ` ORDER BY id DESC `;
            if (startIndex != null && fetchRecord != null) {
                sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + "";
            }
            let countResult = yield apiHeader_1.default.query(countSql);
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                if (result.length > 0) {
                    for (const ele of result) {
                        if (ele.tags && typeof ele.tags === 'string') {
                            const valueArray = ele.tags.includes(';') ? ele.tags.split(";") : [ele.tags];
                            ele.tags = valueArray;
                            // ele.tagNames = ele.tags.join(",");
                        }
                    }
                }
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Blogs Successfully', result, countResult[0].totalCount, authorizationResult ? authorizationResult.token : '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'blog.getBlogs() Exception', error, '');
        next(errorResult);
    }
});
const getBlogDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Get Blog Detail');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `SELECT * FROM blogs WHERE id = ` + req.body.id + ` AND isDelete = 0 AND isActive = 1`;
                let result = yield apiHeader_1.default.query(sql);
                if (result) {
                    if (result.length > 0) {
                        const valueArray = result[0].tags.includes(';') ? result[0].tags.split(";") : [result[0].tags];
                        result[0].tags = valueArray;
                        // result[0].tagNames = result[0].tags.join(",");
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Blog Detail Successfully', result, 1, authorizationResult ? authorizationResult.token : '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'blog.getBlogDetail() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getBlogs, getBlogDetail };
