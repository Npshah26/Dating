"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const logging_1 = __importDefault(require("../../config/logging"));
const config_1 = __importDefault(require("../../config/config"));
const apiHeader_1 = __importDefault(require("../../middleware/apiHeader"));
const signJTW_1 = __importDefault(require("../../function/signJTW"));
const resultsuccess_1 = require("../../classes/response/resultsuccess");
const resulterror_1 = require("../../classes/response/resulterror");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken_1 = __importDefault(require("../../function/refreshToken"));
const hi_base32_1 = require("hi-base32");
const OTPAuth = __importStar(require("otpauth"));
// import notificationContainer from './../notifications';
const notifications_1 = __importDefault(require("./../notifications"));
const customFields_1 = __importDefault(require("../../controllers/app/customFields"));
// import config from '../../config/config';
const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
// const path = require('path');
// const sharp = require('sharp');
var Jimp = require('jimp');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
const nodemailer = require('nodemailer');
// delete require.cache[require.resolve('./variable.json')];
// let jsonData = require('./variable.json');
// delete require.cache[require.resolve(path.join('variable.json'))];
// let jsonData = require(path.join('variable.json'));
Object.keys(require.cache).forEach(function (key) {
    delete require.cache[key];
});
let rawData = fs.readFileSync('variable.json', 'utf8');
let jsonData = JSON.parse(rawData);
// let jsonData: any
fs.watchFile('variable.json', (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
        fs.readFile('variable.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading variable.json:', err);
                return;
            }
            jsonData = JSON.parse(data);
        });
    }
});
let connection = mysql.createConnection({
    host: jsonData.MYSQL_HOST,
    user: jsonData.MYSQL_USER,
    password: jsonData.MYSQL_PASSWORD,
    database: jsonData.MYSQL_DATABASE
});
const query = util.promisify(connection.query).bind(connection);
const beginTransaction = util.promisify(connection.beginTransaction).bind(connection);
const commit = util.promisify(connection.commit).bind(connection);
const rollback = util.promisify(connection.rollback).bind(connection);
// const databaseconfig = {
//     host: jsonData.MYSQL_HOST,
//     user: jsonData.MYSQL_USER,
//     password: jsonData.MYSQL_PASSWORD,
//     database: jsonData.MYSQL_DATABASE
// };
const NAMESPACE = 'Users';
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(jsonData);
        logging_1.default.info(NAMESPACE, 'Login');
        let requiredFields = ['email', 'password'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            yield beginTransaction();
            let userId;
            let insertRefTokenResult;
            let sql = `SELECT u.*, ur.roleId as roleId, roles.name as roleName, img.imageUrl as image FROM users u
                LEFT JOIN userroles ur ON ur.userId = u.id
                LEFT JOIN images img ON img.id =u.imageId
                LEFT jOIN roles ON roles.id = ur.roleId
                WHERE u.email = '` +
                req.body.email +
                `' AND u.isActive = true AND u.isDisable = false AND (ur.roleId = 1 OR ur.roleId = 3)`;
            let result = yield query(sql);
            let userResult = result;
            userId = result[0].id;
            if (result && result.length > 0) {
                yield bcryptjs_1.default.compare(req.body.password, result[0].password, (error, hashresult) => __awaiter(void 0, void 0, void 0, function* () {
                    if (hashresult == false) {
                        return res.status(401).json({
                            message: 'Password Mismatch'
                        });
                    }
                    else if (hashresult) {
                        let signJWTResult = yield (0, signJTW_1.default)(result[0]);
                        if (signJWTResult && signJWTResult.token) {
                            userResult[0].token = signJWTResult.token;
                            if (userResult[0].roleId == 3) {
                                let getUserPagesSql = `SELECT p.*, up.isReadPermission, up.isAddPermission, up.isDeletePermission, up.isEditPermission FROM pages p INNER JOIN userpages up ON up.pageId = p.id WHERE up.userId = ` +
                                    userResult[0].id;
                                let getUserPagesResult = yield query(getUserPagesSql);
                                userResult[0].pagePermissions = getUserPagesResult;
                            }
                            let refreshToken = yield (0, refreshToken_1.default)(userResult[0]);
                            let defaultCurrencySql = `SELECT * From currencies WHERE isDefault = 1`;
                            let defaultCurrency = yield query(defaultCurrencySql);
                            userResult[0].defaultCurrency = defaultCurrency;
                            //insert refresh token
                            let insertRefreshTokenSql = `INSERT INTO userrefreshtoken(userId, refreshToken, expireAt) VALUES(?,?,?)`;
                            insertRefTokenResult = yield query(insertRefreshTokenSql, [userResult[0].id, refreshToken.token, refreshToken.expireAt]);
                            if (insertRefTokenResult && insertRefTokenResult.affectedRows > 0) {
                                userResult[0].refreshToken = refreshToken.token;
                                yield commit();
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Login User', userResult, 1, '');
                                return res.status(200).send(successResult);
                            }
                            else {
                                yield rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.signUp() Error', new Error('Error While Login'), '');
                                next(errorResult);
                                return res.status(400).send(errorResult);
                            }
                        }
                        else {
                            return res.status(401).json({
                                message: 'Unable to Sign JWT',
                                error: signJWTResult.error
                            });
                        }
                    }
                }));
            }
            else {
                yield rollback();
                let errorResult = new resulterror_1.ResultError(400, true, 'users.login() Error', new Error('Error While Login'), '');
                next(errorResult);
            }
        }
        else {
            yield rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        // await rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'Users.login() Exception', error, '');
        next(errorResult);
    }
});
const addUserImageFiles = (req) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    let imageId;
    try {
        let sql = `INSERT INTO images(createdBy, modifiedBy) VALUES (` + req.userId + `,` + req.userId + `)`;
        result = yield apiHeader_1.default.query(sql);
        if (result.affectedRows > 0) {
            imageId = result.insertId;
            let dir = './content';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            let dir1 = './content/user';
            if (!fs.existsSync(dir1)) {
                fs.mkdirSync(dir1);
            }
            let dir2 = './content/user/' + req.userId;
            if (!fs.existsSync(dir2)) {
                fs.mkdirSync(dir2);
            }
            const fileContentsUser = new Buffer(req.imgData, 'base64');
            let imgPath = './content/user/' + req.userId + '/' + result.insertId + '-realImg.jpeg';
            fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                if (err)
                    return console.error(err);
                console.log('file saved imagePath');
            });
            let imagePath = './content/user/' + req.userId + '/' + result.insertId + '.jpeg';
            // sharp(imgPath).resize({
            //     height: 100,
            //     width: 100
            // }).toFile(imagePath)
            //     .then(function (newFileInfo: any) {
            //         console.log(newFileInfo);
            //     });
            yield Jimp.read(imgPath)
                .then((lenna) => {
                return (lenna
                    .resize(100, 100) // resize
                    // .quality(60) // set JPEG quality
                    // .greyscale() // set greyscale
                    // .write("lena-small-bw.jpg"); // save
                    .write(imagePath));
            })
                .catch((err) => {
                console.error(err);
            });
            let updateimagePathSql = `UPDATE images SET imageUrl='` + imagePath.substring(2) + `' WHERE id=` + result.insertId;
            let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
            result = JSON.parse(JSON.stringify(result));
        }
        else {
            result = JSON.parse(JSON.stringify(result));
        }
    }
    catch (err) {
        let imagePath = './content/user/' + req.userId + '/' + imageId + '.jpeg';
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err)
                    throw err;
                console.log(imagePath + ' was deleted');
            });
        }
        let dir = './content/user/' + req.userId;
        if (fs.existsSync(dir)) {
            fs.rmdir(dir, (err) => {
                if (err)
                    throw err;
                console.log(dir + ' was deleted');
            });
        }
        result = err;
    }
    return result;
});
const insertUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'SignUp');
        let requiredFields = ['firstName', 'lastName', 'email', 'password', 'contactNo', 'gender'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let result;
                req.body.middleName = req.body.middleName ? req.body.middleName : '';
                yield apiHeader_1.default.beginTransaction();
                bcryptjs_1.default.hash(req.body.password, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                    if (hashError) {
                        return res.status(401).json({
                            message: hashError.message,
                            error: hashError
                        });
                    }
                    let checkEmailSql = `SELECT * FROM users WHERE email = '` + req.body.email + `'`;
                    let checkEmailResult = yield apiHeader_1.default.query(checkEmailSql);
                    if (checkEmailResult && checkEmailResult.length > 0) {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, 'Email Already Inserted', new Error('Email Already Inserted'), '');
                        next(errorResult);
                        // let successResult = new ResultSuccess(200, true, 'Email Already Inserted', [], 1, "");
                        // return res.status(200).send(successResult);
                    }
                    else {
                        let sql = `INSERT INTO users(firstName, middlename, lastName, contactNo, email, gender, password, isDisable, isReceiveMail, isReceiveNotification) 
                        VALUES('` +
                            req.body.firstName +
                            `','` +
                            req.body.middleName +
                            `','` +
                            req.body.lastName +
                            `',` +
                            req.body.contactNo +
                            `,'` +
                            req.body.email +
                            `','` +
                            req.body.gender +
                            `'
                        ,'` +
                            hash +
                            `',0,` +
                            (req.body.isReceiveMail ? true : false) +
                            `,` +
                            (req.body.isReceiveNotification ? true : false) +
                            `)`;
                        result = yield apiHeader_1.default.query(sql);
                        if (result && result.insertId > 0) {
                            let userId = result.insertId;
                            if (req.body.image && req.body.image.indexOf('content') == -1) {
                                if (req.body.image) {
                                    let image = req.body.image;
                                    let data = image.split(',');
                                    if (data && data.length > 1) {
                                        image = image.split(',')[1];
                                    }
                                    let imageData = {
                                        imgPath: '',
                                        imgData: image,
                                        description: image,
                                        alt: image.alt,
                                        userId: userId
                                    };
                                    let imageResult = yield addUserImageFiles(imageData);
                                    req.body.imageId = imageResult.insertId;
                                    if (req.body.imageId) {
                                        let sql1 = 'UPDATE users SET imageId = ' + req.body.imageId + ' WHERE id =' + userId + '';
                                        result = yield apiHeader_1.default.query(sql1);
                                    }
                                }
                                else {
                                    req.body.imageId = null;
                                }
                            }
                            let userRoleSql = `INSERT INTO userroles(userId, roleId) VALUES (` + userId + `, 3) `;
                            result = yield apiHeader_1.default.query(userRoleSql);
                            if (result && result.affectedRows > 0) {
                                // await login(req.body, res, next);
                                yield apiHeader_1.default.commit();
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert User', result, 1, '');
                                return res.status(200).send(successResult);
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                let errorResult = new resulterror_1.ResultError(400, true, 'users.insertUser() Error', new Error('Error While Inserting Data'), '');
                                next(errorResult);
                            }
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, 'users.insertUser() Error', new Error('Error While Inserting Data'), '');
                            next(errorResult);
                        }
                    }
                }));
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.insertUser() Exception', error, '');
        next(errorResult);
    }
});
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting All Users');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let currentUser = authorizationResult.currentUser;
            let userId = currentUser.id;
            let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let countSql = `SELECT COUNT(*) as totalCount  FROM users
            LEFT JOIN userroles ur ON ur.userId = users.id
            WHERE users.isDelete = 0 AND (ur.roleId = 1 OR ur.roleId = 3) AND users.id != ` + userId;
            if (req.body.searchString) {
                if (!countSql.includes(` WHERE `)) {
                    countSql += ` WHERE `;
                }
                else {
                    countSql += ` AND `;
                }
                countSql +=
                    ` (users.firstName LIKE '%` +
                        req.body.searchString +
                        `%' OR users.lastName LIKE '%` +
                        req.body.searchString +
                        `%' OR users.email LIKE '%` +
                        req.body.searchString +
                        `%' OR users.contactNo LIKE '%` +
                        req.body.searchString +
                        `%' OR users.gender LIKE '%` +
                        req.body.searchString +
                        `%')`;
            }
            let countResult = yield apiHeader_1.default.query(countSql);
            let sql = `SELECT users.*, img.imageUrl as image, ur.roleId as roleId FROM users
            LEFT JOIN images img ON img.id = users.imageId
            LEFT JOIN userroles ur ON ur.userId = users.id
            WHERE users.isDelete = 0 AND (ur.roleId = 1 OR ur.roleId = 3)  AND users.id != ` + userId;
            if (req.body.searchString) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                sql +=
                    ` (users.firstName LIKE '%` +
                        req.body.searchString +
                        `%' OR users.lastName LIKE '%` +
                        req.body.searchString +
                        `%' OR users.email LIKE '%` +
                        req.body.searchString +
                        `%' OR users.contactNo LIKE '%` +
                        req.body.searchString +
                        `%' OR users.gender LIKE '%` +
                        req.body.searchString +
                        `%')`;
            }
            sql += ' ORDER BY users.id DESC';
            if (startIndex != null && fetchRecord != null) {
                sql += ' LIMIT ' + fetchRecord + ' OFFSET ' + startIndex + '';
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Users Successfully', result, countResult[0].totalCount, authorizationResult.token);
                console.log(successResult);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getAllUsers() Exception', error, '');
        next(errorResult);
    }
});
// const deleteUserData = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Deleting User Data');
//         // Validate authorization
//         let authorizationResult = await header.validateAuthorization(req, res, next);
//         if (authorizationResult.statusCode === 200) {
//             let currentUser = authorizationResult.currentUser;
//             let id = currentUser.id;
//             // Get targetUserId from request parameters
//             const { targetUserId } = req.params; // Expecting targetUserId to be passed in the request params
//             // Check if targetUserId is provided
//             if (!targetUserId) {
//                 let errorResult = new ResultError(400, true, 'User ID is required', new Error('User ID is required'), ''); // Pass an empty string for value
//                 return next(errorResult);
//             }
//             // Start a transaction
//             await header.beginTransaction();
//             // Define the query to set isDelete to 1 for the specified user
//             let deleteQuery = `UPDATE users SET isDelete = 1 WHERE id = ?`;
//             // Execute the delete query
//             const result = await header.query(deleteQuery, [targetUserId]); // Use parameterized query for safety
//             // Check if any row was affected
//             if (result.affectedRows === 0) {
//                 await header.rollback(); // Rollback if no rows were affected
//                 let errorResult = new ResultError(404, true, 'User not found', new Error('User not found'), ''); // Pass an empty string for value
//                 return next(errorResult);
//             }
//             // Commit the transaction
//             await header.commit();
//             let successResult = new ResultSuccess(200, true, 'User Data Deleted Successfully', [], 0, authorizationResult.token);
//             return res.status(200).send(successResult);
//         } else {
//             let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), ''); // Pass an empty string for value
//             next(errorResult);
//         }
//     } catch (error: any) {
//         await header.rollback(); // Ensure rollback in case of an error
//         let errorResult = new ResultError(500, true, 'deleteUserData() Exception', error, ''); // Pass an empty string for value
//         next(errorResult);
//     }
// };
// const deleteUserData = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Deleting User Data');
//         let authorizationResult = await header.validateAuthorization(req, res, next);
//         if (authorizationResult.statusCode == 200) {
//             const userId = req.params.id;  // Extract userId from params
//             if (!userId) {
//                 let errorResult = new ResultError(400, true, 'User ID is required', new Error('User ID is required'), '');
//                 return next(errorResult);
//             }
//             let sql = `UPDATE users SET isDelete = 1 WHERE id = ? AND isDelete = 0`;
//             let result = await header.query(sql, [userId]);
//             if (result.affectedRows > 0) {
//                 let successResult = new ResultSuccess(200, true, 'User deleted successfully', [], 0, authorizationResult.token);
//                 return res.status(200).send(successResult);
//             } else {
//                 let errorResult = new ResultError(404, true, 'User not found or already deleted', new Error('User not found or already deleted'), '');
//                 return next(errorResult);
//             }
//         } else {
//             let errorResult = new ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
//             return next(errorResult);
//         }
//     } catch (error: any) {
//         let errorResult = new ResultError(500, true, 'users.deleteUserData() Exception', error, '');
//         next(errorResult);
//     }
// };
const deleteUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Deleting User Data');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            const userId = req.body.userId; // Extract userId from req.body
            if (!userId) {
                let errorResult = new resulterror_1.ResultError(400, true, 'User ID is required', new Error('User ID is required'), '');
                return next(errorResult);
            }
            let sql = `UPDATE users SET isDelete = 1 WHERE id = ? AND isDelete = 0`;
            let result = yield apiHeader_1.default.query(sql, [userId]);
            if (result.affectedRows > 0) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'User deleted successfully', [], 0, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(404, true, 'User not found or already deleted', new Error('User not found or already deleted'), '');
                return next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
            return next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.deleteUserData() Exception', error, '');
        next(errorResult);
    }
});
const getUserDetailById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting User Detail');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let currentUser = authorizationResult.currentUser;
            let userId = currentUser.id;
            let startIndex = req.body.startIndex ? req.body.startIndex : req.body.startIndex === 0 ? 0 : null;
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let sql = `SELECT users.*, img.imageUrl as image, ur.roleId as roleId, , roles.name as roleName FROM users
            LEFT JOIN images img ON img.id = users.imageId
            LEFT JOIN userroles ur ON ur.userId = users.id
            LEFT jOIN roles ON roles.id = ur.roleId
        WHERE users.isDelete = 0 AND (ur.roleId = 1 OR ur.roleId = 3)  AND users.id = ` + userId;
            let result = yield apiHeader_1.default.query(sql);
            if (result && result.length > 0) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get User Detail Successfully', result, result.totalCount, authorizationResult.token);
                console.log(successResult);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.getUserDetailById() Exception', error, '');
        next(errorResult);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Updating Users');
        let requiredFields = ['id', 'firstName', 'lastName', 'email', 'contactNo', 'gender'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                yield apiHeader_1.default.beginTransaction();
                req.body.firstName = req.body.firstName ? req.body.firstName : '';
                req.body.middleName = req.body.middleName ? req.body.middleName : '';
                req.body.lastName = req.body.lastName ? req.body.lastName : '';
                req.body.contactNo = req.body.contactNo ? req.body.contactNo : '';
                req.body.email = req.body.email ? req.body.email : '';
                req.body.gender = req.body.gender ? req.body.gender : '';
                let oldImageId;
                let userId = req.body.id;
                let checkEmailSql = `SELECT * FROM users WHERE email = '` + req.body.email + `' AND id != ` + req.body.id + ` AND isDelete = 0`;
                let checkEmailResult = yield apiHeader_1.default.query(checkEmailSql);
                if (checkEmailResult && checkEmailResult.length > 0) {
                    yield apiHeader_1.default.rollback();
                    let errorResult = new resulterror_1.ResultError(400, true, 'users.insertUser() Error', new Error('Email Already Inserted'), '');
                    next(errorResult);
                }
                else {
                    let getImageIdSql = `select users.id, users.imageId from users where id = ` + req.body.id + ``;
                    let usersResult = yield apiHeader_1.default.query(getImageIdSql);
                    if (usersResult && usersResult.length > 0) {
                        oldImageId = usersResult[0].imageId;
                    }
                    if (req.body.image && req.body.image.indexOf('content') == -1) {
                        if (req.body.image) {
                            let image = req.body.image;
                            let data = image.split(',');
                            if (data && data.length > 1) {
                                image = image.split(',')[1];
                            }
                            let imageData = {
                                imgPath: '',
                                imgData: image,
                                description: image,
                                alt: image.alt,
                                userId: userId
                            };
                            let imageResult = yield addUserImageFiles(imageData);
                            if (imageResult && imageResult.insertId > 0) {
                                req.body.imageId = imageResult.insertId;
                            }
                            else {
                                yield apiHeader_1.default.rollback();
                                return imageResult;
                            }
                        }
                        else if (req.body.image == undefined || req.body.image == '') {
                            req.body.imageId = null;
                        }
                    }
                    else if (!req.body.image || req.body.image == undefined) {
                        req.body.imageId = null;
                        let imageSql = `SELECT * FROM images WHERE id = ` + oldImageId;
                        let imageResult = yield apiHeader_1.default.query(imageSql);
                        if (imageResult && imageResult.length > 0) {
                            if (imageResult[0].imageUrl) {
                                let imagePath = './' + imageResult[0].imageUrl;
                                if (fs.existsSync(imagePath)) {
                                    fs.unlink(imagePath, (err) => {
                                        if (err)
                                            throw err;
                                        console.log(imagePath + ' was deleted');
                                    });
                                }
                                //Delete URL
                            }
                        }
                    }
                    else if (req.body.image) {
                        req.body.imageId = oldImageId;
                    }
                    let sql = `UPDATE users SET firstName = '` +
                        req.body.firstName +
                        `', middleName = '` +
                        req.body.middleName +
                        `',lastName = '` +
                        req.body.lastName +
                        `'
                    ,contactNo = '` +
                        req.body.contactNo +
                        `',email = '` +
                        req.body.email +
                        `',gender = '` +
                        req.body.gender +
                        `',imageId = ` +
                        req.body.imageId +
                        ` 
                    ,isReceiveMail = ` +
                        (req.body.isReceiveMail ? true : false) +
                        `, isReceiveNotification =` +
                        (req.body.isReceiveNotification ? true : false) +
                        `
                    WHERE id = ` +
                        req.body.id +
                        ``;
                    // isPasswordSet = '` + req.body.isPasswordSet + `',isDisabled = '` + req.body.isDisabled + `',isVerified = '` + req.body.isVerified + `',imageId = ` + req.body.imageId + `
                    let result = yield apiHeader_1.default.query(sql);
                    if (result && result.affectedRows > 0) {
                        if (req.body.imageId && req.body.imageId != oldImageId) {
                            let delSql = `DELETE FROM images where Id = ` + oldImageId;
                            let delResult = yield apiHeader_1.default.query(delSql);
                            if (delResult && delResult.affectedRows > 0) {
                                if (fs.existsSync('./content/user/' + req.body.id + '/' + oldImageId + '.jpeg')) {
                                    fs.unlink('./content/user/' + req.body.id + '/' + oldImageId + '.jpeg', (err) => {
                                        if (err)
                                            throw err;
                                        console.log('Image was deleted');
                                    });
                                }
                                if (fs.existsSync('./content/user/' + req.body.id + '/' + oldImageId + '-realImg.jpeg')) {
                                    fs.unlink('./content/user/' + req.body.id + '/' + oldImageId + '-realImg.jpeg', (err) => {
                                        if (err)
                                            throw err;
                                        console.log('Image was deleted');
                                    });
                                }
                                let userSql = `SELECT u.*, img.imageUrl FROM users u
                            LEFT JOIN images img ON img.id = u.imageId
                            WHERE u.id = ` + req.body.id;
                                let userResult = yield apiHeader_1.default.query(userSql);
                                if (userResult && userResult.length > 0) {
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Profile Pic', userResult, userResult.length, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                                else {
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfilePic() Error', new Error('Error While Updating Profile Pic'), '');
                                    next(errorResult);
                                }
                            }
                        }
                        yield apiHeader_1.default.commit();
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Detail', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(203, true, 'users.updateUSers() Error', new Error('Error While Updating Data'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateUSers() Exception', error, '');
        next(errorResult);
    }
});
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Checking Token');
        let statusCode = 200;
        let message = '';
        if (req.body.token) {
            yield jsonwebtoken_1.default.verify(req.body.token, config_1.default.server.token.secret, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    statusCode = 400;
                    message = 'UnAuthorize';
                }
                else {
                    let decodeVal = decoded;
                    if (new Date().getTime() / 1000 <= decodeVal.exp) {
                        // console.log("Valid Live Token");
                        return true;
                    }
                    else {
                        // console.log("Valid Expire Token");
                        return false;
                    }
                }
            }));
        }
        else {
            // console.log('error');
            let err = 'error';
            return err;
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateUSers() Exception', error, '');
        next(errorResult);
    }
});
const activeInactiveUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Active Inactive Users');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE users set isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Change User Status', result, 1, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.activeInactiveUsers() Exception', error, '');
        next(errorResult);
    }
});
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Password');
        let requiredFields = ['id', 'password', 'token'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            bcryptjs_1.default.hash(req.body.password, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                if (hashError) {
                    return res.status(401).json({
                        message: hashError.message,
                        error: hashError
                    });
                }
                let sql = `UPDATE users SET password = '` + hash + `' where id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    if (req.body.token) {
                        let userTokenUpdateSql = `UPDATE usertokens SET isUsed = 1 WHERE token = '` + req.body.token + `' AND userId = ` + req.body.id + ``;
                        result = yield apiHeader_1.default.query(userTokenUpdateSql);
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Password reset successfully!', result, 1, 'null');
                    return res.status(200).send(successResult);
                }
                else {
                    yield apiHeader_1.default.rollback();
                    let errorResult = new resulterror_1.ResultError(400, true, 'users.resetPassword() Error', new Error('Error While Reset Password'), '');
                    next(errorResult);
                }
            }));
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.resetPassword() Exception', error, '');
        next(errorResult);
    }
});
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Password');
        let requiredFields = ['email'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            yield apiHeader_1.default.beginTransaction();
            let result;
            let sql = `SELECT * FROM users WHERE email = '` + req.body.email + `'`;
            let userData = yield apiHeader_1.default.query(sql);
            if (userData && userData.length > 0) {
                let token = cryptr.encrypt(makeid(10)); //crypto.randomBytes(48).toString('hex');
                let expireAtDate = new Date(new Date().toUTCString());
                expireAtDate.setDate(expireAtDate.getDate() + 1);
                let data = {
                    userId: userData[0].id,
                    token: token,
                    isUsed: 0,
                    expireAt: expireAtDate,
                    isActive: true,
                    isDelete: false,
                    createdDate: new Date(new Date().toUTCString()),
                    modifiedDate: new Date(new Date().toUTCString())
                };
                let sql = 'INSERT INTO usertokens SET ?';
                result = yield apiHeader_1.default.query(sql, data);
                if (result.insertId > 0) {
                    let resultEmail = yield sendEmail(config_1.default.emailMatrimonySetPassword.fromName + ' <' + config_1.default.emailMatrimonySetPassword.fromEmail + '>', userData[0].email, config_1.default.emailMatrimonySetPassword.subject, '', config_1.default.emailMatrimonySetPassword.html.replace('[VERIFICATION_TOKEN]', token).replace('[NAME]', userData[0].firstName + ' ' + userData[0].lastName), null, null);
                    yield apiHeader_1.default.commit();
                    result = resultEmail;
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Send mail successfully!', result, 1, '');
                    return res.status(200).send(successResult);
                }
                else {
                    yield apiHeader_1.default.rollback();
                    result.length = 0;
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(400, true, 'User not found', new Error('Data Not Available'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.resetPassword() Exception', error, '');
        next(errorResult);
    }
});
const sendEmail = (from, to, subject, text, html, fileName, invoicePdf) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        // create reusable transporter object using the default SMTP transport
        let systemFlags = `SELECT * FROM systemflags where flagGroupId = 2`;
        let _systemFlags = yield apiHeader_1.default.query(systemFlags);
        let _host;
        let _port;
        let _secure;
        let _user;
        let _password;
        for (let i = 0; i < _systemFlags.length; i++) {
            if (_systemFlags[i].id == 4) {
                _host = _systemFlags[i].value;
            }
            else if (_systemFlags[i].id == 5) {
                _port = parseInt(_systemFlags[i].value);
            }
            else if (_systemFlags[i].id == 6) {
                if (_systemFlags[i].value == '1') {
                    _secure = true;
                }
                else {
                    _secure = false;
                }
            }
            else if (_systemFlags[i].id == 1) {
                _user = _systemFlags[i].value;
            }
            else if (_systemFlags[i].id == 2) {
                _password = _systemFlags[i].value;
            }
        }
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: _host,
            port: _port,
            secure: _secure, // true for 465, false for other ports
            auth: {
                user: _user,
                pass: _password
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: _user,
            to: to,
            subject: subject,
            html: html
        };
        // send mail with defined transport object
        result = yield transporter.sendMail(mailOptions);
        // console.log("Message sent: %s", result);
    }
    catch (error) {
        result = error;
    }
    return result;
});
const verifyforgotPasswordLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Verify Forgot Password Link');
        let requiredFields = ['token'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let result;
            let sql = `SELECT * FROM usertokens WHERE isDelete = 0 AND isUsed = 0  AND token = '` + req.body.token + `'`;
            result = yield apiHeader_1.default.query(sql);
            if (result && result.length > 0) {
                let expireDate = new Date(result[0].expireAt);
                let currentDate = new Date(new Date().toUTCString());
                let exTime = expireDate.getTime();
                let curTime = currentDate.getTime();
                if (exTime > curTime) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Token is valid!', result, 1, 'null');
                    return res.status(200).send(successResult);
                }
                else {
                    let successResult = 'Token is expired!';
                    return res.status(200).send(successResult);
                }
            }
            else {
                let successResult = 'You have already used this token';
                return res.status(200).send(successResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'users.verifyforgotPasswordLink() Exception', error, '');
        next(errorResult);
    }
});
const blockUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Block User');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE users set isDisable = !isDisable WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'User Block Sucessfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'users.blockUser() Error', new Error('Error While Block User'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.blockUser() Exception', error, '');
        next(errorResult);
    }
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Delete User');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `DELETE FROM users WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Delete User Sucessfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'users.deleteUser() Error', new Error('Error While Deleting Users'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.deleteUser() Exception', error, '');
        next(errorResult);
    }
});
const updateFCMToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'updateFCMToken');
        let requiredFields = ['fcmToken'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                let userDevice = authorizationResult.currentUserDevice;
                let appId;
                if (userDevice.app == 'MatrimonyAdmin') {
                    appId = 1;
                }
                else if (userDevice.app == 'MatrimonyAndroid') {
                    appId = 2;
                }
                else {
                    appId = 3;
                }
                let getUserDeviceDetailSql = `SELECT * FROM userdevicedetail WHERE userId = ` + userId;
                let getUserDeviceDetailResult = yield apiHeader_1.default.query(getUserDeviceDetailSql);
                if (getUserDeviceDetailResult && getUserDeviceDetailResult.length > 0) {
                    let updateSql = `UPDATE userdevicedetail SET fcmToken = '` + req.body.fcmToken + `', applicationId = ` + appId + ` WHERE id = ` + getUserDeviceDetailResult[0].id;
                    let updateResult = yield apiHeader_1.default.query(updateSql);
                    if (updateResult && updateResult.affectedRows >= 0) {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Detail', updateResult, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateFCMToken() Error', new Error('Error While Updating FCM Token'), '');
                        next(errorResult);
                    }
                }
                else {
                    let insertSql = `INSERT INTO userdevicedetail(userId, applicationId, fcmToken, isActive, isDelete, createdBy, modifiedBy) 
                    VALUES(` +
                        userId +
                        `,` +
                        appId +
                        `,'` +
                        req.body.fcmToken +
                        `',1,0,` +
                        userId +
                        `,` +
                        userId +
                        `)`;
                    let insertResult = yield apiHeader_1.default.query(insertSql);
                    if (insertResult && insertResult.insertId >= 0) {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update User Detail', insertResult, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateFCMToken() Error', new Error('Error While Updating FCM Token'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateFCMToken() Exception', error, '');
        next(errorResult);
    }
});
const updateEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Update Email');
        let requiredFields = ['email'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                let sql = 'SELECT * FROM users WHERE id = ' + userId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    let updateSql = `UPDATE users SET email = '` + req.body.email + `' WHERE id = ` + userId;
                    result = yield apiHeader_1.default.query(updateSql);
                    if (result && result.affectedRows > 0) {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'User Email Update Successfully', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateEmail() Error', new Error('Error While Update Email'), '');
                        next(errorResult);
                    }
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updateEmail() Error', new Error('Error While Update Email'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateEmail() Exception', error, '');
        next(errorResult);
    }
});
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Update Password');
        let requiredFields = ['password'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                let sql = 'SELECT * FROM users WHERE id = ' + userId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    bcryptjs_1.default.hash(req.body.password, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                        if (hashError) {
                            return res.status(401).json({
                                message: hashError.message,
                                error: hashError
                            });
                        }
                        let updateSql = `UPDATE users SET password = '` + hash + `' WHERE id = ` + userId;
                        result = yield apiHeader_1.default.query(updateSql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'User Password Update Successfully', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updatePassword() Error', new Error('Error While Update Email'), '');
                            next(errorResult);
                        }
                    }));
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'users.updatePassword() Error', new Error('Error While Update Email'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updatePassword() Exception', error, '');
        next(errorResult);
    }
});
// const sendAuthenticationCodeToEmail = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Update Password');
//         let requiredFields = [''];
//         let validationResult = header.validateRequiredFields(req, requiredFields);
//         if (validationResult && validationResult.statusCode == 200) {
//             let authorizationResult = await header.validateAuthorization(req, res, next);
//             if (authorizationResult.statusCode == 200) {
//                 let userId = authorizationResult.currentUser.id;
//                 let code = Math.floor(100000 + Math.random() * 900000);
//                 req.body.isTwoFactorEnable = req.body.isTwoFactorEnable ? req.body.isTwoFactorEnable : (req.body.isTwoFactorEnable == false ? false : null);
//                 let sql = `UPDATE users SET twoFactorCode = '` + code + `', isTwoFactorEnable = ` + req.body.isTwoFactorEnable + ` WHERE id = ` + userId;
//                 let result = await header.query(sql);
//                 if (result && result.affectedRows >= 0) {
//                     let sqlData = `SELECT * FROM users WHERE id = ` + userId;
//                     let resultData = await header.query(sqlData);
//                     let resultEmail = await sendEmail(config.emailMatrimonyTwoFactorAuthentication.fromName + ' <' + config.emailMatrimonyTwoFactorAuthentication.fromEmail + '>'
//                         , resultData[0].email
//                         , config.emailMatrimonyTwoFactorAuthentication.subject
//                         , ""
//                         , config.emailMatrimonyTwoFactorAuthentication.html
//                             .replace("[FullName]", resultData[0].firstName + " " + resultData[0].lastName)
//                             .replace("[VerificationCode]", code.toString())
//                         , null, null);
//                     let successResult = new ResultSuccess(200, true, 'Send Authentication Code Successfully', result, 1, authorizationResult.token);
//                     return res.status(200).send(successResult);
//                 } else {
//                     let errorResult = new ResultError(400, true, "users.sendAuthenticationCodeToEmail() Error", new Error('Error While Sending Email'), '');
//                     next(errorResult);
//                 }
//             } else {
//                 let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
//                 next(errorResult);
//             }
//         } else {
//             await header.rollback();
//             let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
//             next(errorResult);
//         }
//     } catch (error: any) {
//         await header.rollback();
//         let errorResult = new ResultError(500, true, 'users.sendAuthenticationCodeToEmail() Exception', error, '');
//         next(errorResult);
//     }
// }
// const verifyAuthenticationCode = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Verify Authentication Code');
//         let requiredFields = ['twoFactorCode'];
//         let validationResult = header.validateRequiredFields(req, requiredFields);
//         if (validationResult && validationResult.statusCode == 200) {
//             let authorizationResult = await header.validateAuthorization(req, res, next);
//             if (authorizationResult.statusCode == 200) {
//                 let userId = authorizationResult.currentUser.id;
//                 let sql = `SELECT * FROM users WHERE twoFactorCode = '` + req.body.twoFactorCode + `'`;
//                 let result = await header.query(sql);
//                 if (result && result.length > 0) {
//                     let successResult = new ResultSuccess(200, true, 'Verify Authentication Code successfully', result, 1, authorizationResult.token);
//                     return res.status(200).send(successResult);
//                 } else {
//                     let errorResult = new ResultError(400, true, "users.verifyAuthenticationCode() Error", new Error('Error While update status'), '');
//                     next(errorResult);
//                 }
//             } else {
//                 let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
//                 next(errorResult);
//             }
//         } else {
//             await header.rollback();
//             let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
//             next(errorResult);
//         }
//     } catch (error: any) {
//         await header.rollback();
//         let errorResult = new ResultError(500, true, 'users.verifyAuthenticationCode() Exception', error, '');
//         next(errorResult);
//     }
// }
const updateAuthenticationStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Update Password');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                let checkSql = `SELECT * FROM users WHERE id = ` + userId;
                let checkResult = yield apiHeader_1.default.query(checkSql);
                let flag = true;
                if (checkResult && checkResult.length > 0) {
                    if (checkResult[0].otpAuthUrl && checkResult[0].baseSecret) {
                        flag = false;
                    }
                }
                if (flag && req.body.isTwoFactorEnable) {
                    let sysFalgSql = `SELECT * FROM systemflags WHERE flagGroupId = 10`;
                    let sysFalgResult = yield apiHeader_1.default.query(sysFalgSql);
                    let issuer = '';
                    let label = '';
                    if (sysFalgResult && sysFalgResult.length > 0) {
                        issuer = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorIssuer')].value;
                        label = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorLabel')].value;
                    }
                    const base32_secret = generateRandomBase32();
                    let totp = new OTPAuth.TOTP({
                        issuer: issuer, //"native.software",
                        label: label, //''"nativesoftware",
                        algorithm: 'SHA1',
                        digits: 6,
                        secret: base32_secret
                    });
                    let otpauth_url = totp.toString();
                    let sql = `UPDATE users SET otpAuthUrl = '` + otpauth_url + `', baseSecret='` + base32_secret + `', isTwoFactorEnable = true  WHERE id = ` + userId;
                    let result = yield apiHeader_1.default.query(sql);
                    if (result && result.affectedRows >= 0) {
                        let getSql = 'SELECT * FROM users WHERE  id =' + userId;
                        let getResult = yield apiHeader_1.default.query(getSql);
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Generate OTP Successfully', getResult, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.generateOTP() Error', new Error('Error While update status'), '');
                        next(errorResult);
                    }
                }
                else {
                    req.body.isTwoFactorEnable = req.body.isTwoFactorEnable ? req.body.isTwoFactorEnable : req.body.isTwoFactorEnable == false ? false : null;
                    let sql = `UPDATE users SET isTwoFactorEnable = ` + req.body.isTwoFactorEnable + ` WHERE id = ` + userId;
                    let result = yield apiHeader_1.default.query(sql);
                    if (result && result.affectedRows >= 0) {
                        let getUserSql = `SELECT * FROM users where id = ` + userId;
                        let getUserResult = yield apiHeader_1.default.query(getUserSql);
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Send Authentication Code Successfully', getUserResult, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateAuthenticationStatus() Error', new Error('Error While update status'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateAuthenticationStatus() Exception', error, '');
        next(errorResult);
    }
});
const changeEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Password');
        let requiredFields = ['oldEmail', 'newEmail'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let searchSql = `SELECT * FROM users WHERE email = '` + req.body.oldEmail + `' AND id = ` + userId;
                let searchResult = yield apiHeader_1.default.query(searchSql);
                if (searchResult && searchResult.length > 0) {
                    let checkSql = `SELECT * FROM users WHERE email = '` + req.body.newEmail + `' AND id != ` + userId + ``;
                    result = yield apiHeader_1.default.query(checkSql);
                    if (result && result.length > 0) {
                        let errorResult = new resulterror_1.ResultError(203, true, 'users.changeEmail() Error', new Error('Email Already exists'), '');
                        next(errorResult);
                    }
                    else {
                        let sql = `UPDATE users SET email = '` + req.body.newEmail + `' where id = ` + userId + ``;
                        result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Email Change successfully!', result, 1, 'null');
                            return res.status(200).send(successResult);
                        }
                        else {
                            yield apiHeader_1.default.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, 'users.changeEmail() Error', new Error('Error While Change Password'), '');
                            next(errorResult);
                        }
                    }
                }
                else {
                    let errorResult = 'User Not Found';
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.changeEmail() Exception', error, '');
        next(errorResult);
    }
});
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Change Password');
        let requiredFields = ['oldPassword', 'newPassword'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let sql = `SELECT * FROM users WHERE id = ` + userId;
                result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    bcryptjs_1.default.compare(req.body.oldPassword, result[0].password, (error, hashresult) => __awaiter(void 0, void 0, void 0, function* () {
                        if (hashresult == false) {
                            return res.status(203).json({
                                message: 'Your old password is not match'
                            });
                        }
                        else if (hashresult) {
                            bcryptjs_1.default.hash(req.body.newPassword, 10, (hashError, hash) => __awaiter(void 0, void 0, void 0, function* () {
                                if (hashError) {
                                    return res.status(401).json({
                                        message: hashError.message,
                                        error: hashError
                                    });
                                }
                                let sql = `UPDATE users SET password = '` + hash + `' where id = ` + userId + ``;
                                let result = yield apiHeader_1.default.query(sql);
                                if (result && result.affectedRows > 0) {
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Password Change successfully!', result, 1, 'null');
                                    return res.status(200).send(successResult);
                                }
                                else {
                                    yield apiHeader_1.default.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'users.changePassword() Error', new Error('Error While Change Password'), '');
                                    next(errorResult);
                                }
                            }));
                        }
                    }));
                }
                else {
                    let errorResult = 'User Not Found';
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.changePassword() Exception', error, '');
        next(errorResult);
    }
});
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
const generateRandomBase32 = () => {
    const buffer = cryptr.encrypt(makeid(10));
    const base32 = (0, hi_base32_1.encode)(buffer).replace(/=/g, '').substring(0, 24);
    return base32;
};
const generateOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Generate OTP');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                const base32_secret = generateRandomBase32();
                let sysFalgSql = `SELECT * FROM systemflags WHERE flagGroupId = 10`;
                let sysFalgResult = yield apiHeader_1.default.query(sysFalgSql);
                let issuer = '';
                let label = '';
                if (sysFalgResult && sysFalgResult.length > 0) {
                    issuer = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorIssuer')].value;
                    label = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorLabel')].value;
                }
                let totp = new OTPAuth.TOTP({
                    issuer: issuer, //"native.software",
                    label: label, //"nativesoftware",
                    algorithm: 'SHA1',
                    digits: 6,
                    secret: base32_secret
                });
                let otpauth_url = totp.toString();
                let sql = `UPDATE users SET otpAuthUrl = '` + otpauth_url + `', baseSecret='` + base32_secret + `',isTwoFactorEnable = true  WHERE id = ` + userId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows >= 0) {
                    let getSql = 'SELECT * FROM users WHERE  id =' + userId;
                    let getResult = yield apiHeader_1.default.query(getSql);
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Generate OTP Successfully', getResult, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'users.generateOTP() Error', new Error('Error While update status'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.generateOTP() Exception', error, '');
        next(errorResult);
    }
});
const validateOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Generate OTP');
        let requiredFields = ['token'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                let sql = `SELECT * FROM users WHERE id = ` + userId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.length > 0) {
                    let sysFalgSql = `SELECT * FROM systemflags WHERE flagGroupId = 10`;
                    let sysFalgResult = yield apiHeader_1.default.query(sysFalgSql);
                    let issuer = '';
                    let label = '';
                    if (sysFalgResult && sysFalgResult.length > 0) {
                        issuer = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorIssuer')].value;
                        label = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorLabel')].value;
                    }
                    let totp = new OTPAuth.TOTP({
                        issuer: issuer, //"native.software",
                        label: label, //"nativesoftware",
                        algorithm: 'SHA1',
                        digits: 6,
                        secret: result[0].baseSecret
                    });
                    const { token } = req.body;
                    let delta = totp.validate({ token, window: 1 });
                    if (delta === null) {
                        let errorResult = new resulterror_1.ResultError(401, true, 'Token Invalid', new Error('Token Invalid'), '');
                        next(errorResult);
                    }
                    else {
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Token is Valid', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'User not available', new Error('User not available'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.generateOTP() Exception', error, '');
        next(errorResult);
    }
});
const resetAuthenticationOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Reset Authentiacation');
        let requiredFields = [''];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let userId = authorizationResult.currentUser.id;
                const base32_secret = generateRandomBase32();
                let sysFalgSql = `SELECT * FROM systemflags WHERE flagGroupId = 10`;
                let sysFalgResult = yield apiHeader_1.default.query(sysFalgSql);
                let issuer = '';
                let label = '';
                if (sysFalgResult && sysFalgResult.length > 0) {
                    issuer = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorIssuer')].value;
                    label = sysFalgResult[sysFalgResult.findIndex((c) => c.name == 'twoFactorLabel')].value;
                }
                let totp = new OTPAuth.TOTP({
                    issuer: issuer, //"native.software",
                    label: label, //"nativesoftware",
                    algorithm: 'SHA1',
                    digits: 6,
                    secret: base32_secret
                });
                let otpauth_url = totp.toString();
                let sql = `UPDATE users SET otpAuthUrl = '` + otpauth_url + `', baseSecret='` + base32_secret + `',isTwoFactorEnable = true  WHERE id = ` + userId;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows >= 0) {
                    let getSql = 'SELECT * FROM users WHERE  id =' + userId;
                    let getResult = yield apiHeader_1.default.query(getSql);
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Reset Authentiacation OTP Successfully', getResult, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, 'users.generateOTP() Error', new Error('Error While update status'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'users.generateOTP() Exception', error, '');
        next(errorResult);
    }
});
const deleteAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield apiHeader_1.default.beginTransaction();
        logging_1.default.info(NAMESPACE, 'Reset Authentiacation');
        // let result: any;
        let adminUserIds = yield apiHeader_1.default.query(`SELECT users.id FROM users INNER JOIN userroles ur ON users.id = ur.userId WHERE ur.roleId IN (1,3)`);
        let userId = req.body.userIds;
        adminUserIds.forEach((item) => {
            userId.push(item.id);
        });
        userId.push(286);
        let userIds = userId.toString();
        let deleteQueries = [
            `DELETE FROM feedback WHERE createdBy NOT IN (` + userIds + `)`,
            `DELETE FROM successstories WHERE createdBy NOT IN (` + userIds + `)`,
            `DELETE FROM successstories WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM successstories WHERE partnerUserId NOT IN (` + userIds + `)`,
            `DELETE FROM userauthdata WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userblock WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userblock WHERE userBlockId NOT IN (` + userIds + `)`,
            `DELETE FROM userblockrequest WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userblockrequest WHERE blockRequestUserId NOT IN (` + userIds + `)`,
            `DELETE FROM userchat WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userchat WHERE partnerId NOT IN (` + userIds + `)`,
            `DELETE FROM userdevicedetail WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userdocument WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userfavourites WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userfavourites WHERE favUserId NOT IN (` + userIds + `)`,
            `DELETE FROM userflagvalues WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM usernotifications WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userpackage WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userpersonaldetail WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userproposals WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userproposals WHERE proposalUserId NOT IN (` + userIds + `)`,
            `DELETE FROM userrefreshtoken WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userroles WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM usertokens WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userviewprofilehistories WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userviewprofilehistories WHERE viewProfileByUserId NOT IN (` + userIds + `)`,
            `DELETE FROM userwallethistory WHERE createdBy NOT IN (` + userIds + `)`,
            `DELETE FROM userwallets WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM payment WHERE createdBy NOT IN (` + userIds + `)`,
            `DELETE FROM addresses WHERE createdBy NOT IN (` + userIds + `)`,
            `DELETE FROM userpersonaldetailcustomdata WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userpartnerpreferences WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userfamilydetail WHERE userId NOT IN (` + userIds + `)`,
            `DELETE FROM userastrologicdetail WHERE userId NOT IN (` + userIds + `)`,
            `CREATE TEMPORARY TABLE temp_ids (id INT)`,
            `INSERT INTO temp_ids(id) SELECT id FROM users WHERE id IN(SELECT id FROM users WHERE id NOT IN (` + userIds + `))`,
            `UPDATE users SET referalUserId = NULL WHERE referalUserId IN (SELECT id FROM temp_ids)`,
            `DROP TEMPORARY TABLE temp_ids`,
            `DELETE FROM users WHERE id NOT IN (` + userIds + `)`,
            `DELETE FROM images WHERE createdBy NOT IN (` + userIds + `)`
        ];
        let result;
        for (let index = 0; index < deleteQueries.length; index++) {
            result = yield apiHeader_1.default.query(deleteQueries[index]);
        }
        yield apiHeader_1.default.commit();
        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Delete All User Successfully', result, 1, '');
        return res.status(200).send(successResult);
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.deleteAllUser() Exception', error, '');
        next(errorResult);
    }
});
const checkconfigfileexist = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Check Config File Exist or not');
        let rawData = fs.readFileSync('matrimony-firebase-adminsdk.json', 'utf8');
        let jsonData = JSON.parse(rawData);
        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Check Config File Exist or not Successfully', jsonData, 1, '');
        return res.status(200).send(successResult);
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.checkconfigfileexist() Exception', error, '');
        next(errorResult);
    }
});
function makememberid(length) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = '';
        let format = '';
        let formatSql = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'memberIdFormat'`);
        format = formatSql[0].value;
        if (format == 'Only Numeric') {
            const characters = '0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
        }
        else if (format == 'Only Alphabets') {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
        }
        else if (format == 'Prefix') {
            let lettersSql = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'prefixLetters'`);
            let letters = lettersSql[0].value;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length - letters.length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            result = letters + result;
        }
        else if (format == 'Postfix') {
            let lettersSql = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'postfixLetters'`);
            let letters = lettersSql[0].value;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length - letters.length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
            result = result + letters;
        }
        else {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < length) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                counter += 1;
            }
        }
        result = result.trim();
        return result;
    });
}
const completeUserProfileV2 = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        logging_1.default.info(NAMESPACE, 'Updating Users');
        // let requiredFields = ['id', 'screenNumber'];
        // let validationResult = header.validateRequiredFields(req, requiredFields);
        // if (validationResult && validationResult.statusCode == 200) {
        let authorizationResult;
        if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.userId)) {
            authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        }
        if ((authorizationResult === null || authorizationResult === void 0 ? void 0 : authorizationResult.statusCode) == 200 || ((_b = req.body) === null || _b === void 0 ? void 0 : _b.userId)) {
            yield apiHeader_1.default.beginTransaction();
            let currentUser = authorizationResult === null || authorizationResult === void 0 ? void 0 : authorizationResult.currentUser;
            let userId = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) || ((_c = req.body) === null || _c === void 0 ? void 0 : _c.userId);
            let screenNumber = req.body.screenNumber;
            let sql;
            let result;
            let updatePara;
            let completedPercentage;
            let updatedPercentage;
            let personalDetailId;
            let percentageFlag = false;
            const isCustomFieldEnabled = yield customFields_1.default.isCustomFieldEnable();
            req.body.isHideBirthTime = req.body.isHideBirthTime == 1 ? true : false;
            let user = yield apiHeader_1.default.query(`SELECT * FROM users WHERE id = ` + userId + ``);
            let checkDetailResult;
            let checkDetailSql = `SELECT * FROM userpersonaldetail WHERE userId = ` + userId;
            checkDetailResult = yield apiHeader_1.default.query(checkDetailSql);
            if (checkDetailResult && checkDetailResult.length > 0) {
                personalDetailId = checkDetailResult[0].id;
            }
            else {
                // let memberId = makeid(8).toUpperCase();
                let memberId = (yield makememberid(10)).toUpperCase();
                let insertSql = `INSERT INTO userpersonaldetail (userId, memberid) VALUES (` + userId + `,'` + memberId + `')`;
                let insertResult = yield apiHeader_1.default.query(insertSql);
                personalDetailId = insertResult.insertId;
                let checkDetailSql = `SELECT * FROM userpersonaldetail WHERE userId = ` + userId;
                checkDetailResult = yield apiHeader_1.default.query(checkDetailSql);
            }
            let screenDetailSql = yield apiHeader_1.default.query(`SELECT * FROM registrationscreens WHERE screenDisplayNo = ` + screenNumber);
            switch (screenNumber) {
                // Profile For
                case 1: {
                    let screen1RequiredFields = ['id', 'screenNumber', 'gender', 'profileForId'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen1RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        let updateUserSql = `UPDATE users SET gender = '` + req.body.gender + `' WHERE id = ` + userId;
                        let updateUserResult = yield apiHeader_1.default.query(updateUserSql);
                        updatePara = `profileForId = ` + req.body.profileForId + ` `;
                        if (!checkDetailResult[0].profileForId)
                            percentageFlag = true;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Basic Details
                case 2: {
                    let screen2RequiredFields = ['id', 'screenNumber', 'firstName', 'lastName', 'contactNo', 'email'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen2RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        req.body.contactNo = req.body.contactNo ? req.body.contactNo : '';
                        req.body.middleName = req.body.middleName ? req.body.middleName : '';
                        req.body.countryName = req.body.countryName ? req.body.countryName : '';
                        req.body.stateName = req.body.stateName ? req.body.stateName : '';
                        req.body.cityName = req.body.cityName ? req.body.cityName : '';
                        req.body.aboutMe = req.body.aboutMe ? req.body.aboutMe : '';
                        req.body.expectation = req.body.expectation ? req.body.expectation : '';
                        req.body.eyeColor = req.body.eyeColor ? req.body.eyeColor : '';
                        let birthDate = req.body.birthDate ? new Date(req.body.birthDate) : '';
                        let bDate = new Date(birthDate).getFullYear().toString() +
                            '-' +
                            ('0' + (new Date(birthDate).getMonth() + 1)).slice(-2) +
                            '-' +
                            ('0' + new Date(birthDate).getDate()).slice(-2) +
                            ' ' +
                            ('0' + new Date(birthDate).getHours()).slice(-2) +
                            ':' +
                            ('0' + new Date(birthDate).getMinutes()).slice(-2) +
                            ':' +
                            ('0' + new Date(birthDate).getSeconds()).slice(-2);
                        req.body.isHideContactDetail = req.body.isHideContactDetail == 0 || req.body.isHideContactDetail == false ? false : true;
                        let checkMail = yield apiHeader_1.default.query(`SELECT * FROM users WHERE email = '` + req.body.email + `' AND id != ` + userId + ``);
                        if (checkMail && checkMail.length > 0) {
                            let errorResult = new resulterror_1.ResultError(203, true, 'Email Already Exist', new Error('Email Already Exist'), '');
                            next(errorResult);
                        }
                        else {
                            let updateUserSql = `UPDATE users SET firstName = '` +
                                req.body.firstName +
                                `', middleName =  ` +
                                (req.body.middleName ? `'` + req.body.middleName + `'` : null) +
                                `, lastName = '` +
                                req.body.lastName +
                                `', contactNo = '` +
                                req.body.contactNo +
                                `',email = '` +
                                req.body.email +
                                `'  WHERE id = ` +
                                userId +
                                ``;
                            let updateUserResult = yield apiHeader_1.default.query(updateUserSql);
                            updatePara = ` birthDate = '` + bDate + `',isHideContactDetail = ` + req.body.isHideContactDetail + ` `;
                            if (!checkDetailResult[0].birthDate)
                                percentageFlag = true;
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Personal Details
                case 3: {
                    let screen3RequiredFields = [
                        'id',
                        'screenNumber',
                        'maritalStatusId',
                        'heightId',
                        'weightId',
                        'haveSpecs',
                        'anyDisability',
                        'bloodGroup',
                        'complexion',
                        'bodyType',
                        'eyeColor',
                        'languages'
                    ];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen3RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        updatePara =
                            ` maritalStatusId = ` +
                                req.body.maritalStatusId +
                                `, haveChildren = ` +
                                (req.body.haveChildren ? req.body.haveChildren : null) +
                                `,noOfChildren = ` +
                                req.body.noOfChildren +
                                `,heightId = ` +
                                req.body.heightId +
                                `, weight = ` +
                                req.body.weightId +
                                `, haveSpecs= ` +
                                req.body.haveSpecs +
                                `, anyDisability = ` +
                                req.body.anyDisability +
                                `,bloodGroup = '` +
                                req.body.bloodGroup +
                                `',complexion = '` +
                                req.body.complexion +
                                `',bodyType = '` +
                                req.body.bodyType +
                                `',  eyeColor = '` +
                                req.body.eyeColor +
                                `', languages = '` +
                                req.body.languages +
                                `',aboutMe = ` +
                                (req.body.aboutMe ? `'` + req.body.aboutMe + `'` : null) +
                                ` `;
                        if (!checkDetailResult[0].maritalStatusId)
                            percentageFlag = true;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Community Details
                case 4: {
                    let screen4RequiredFields = ['id', 'screenNumber', 'religionId', 'communityId', 'motherTongue'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen4RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        updatePara =
                            ` religionId = ` +
                                req.body.religionId +
                                ` ,communityId = ` +
                                req.body.communityId +
                                `, subCommunityId = ` +
                                (req.body.subCommunityId ? req.body.subCommunityId : null) +
                                `, motherTongue = '` +
                                req.body.motherTongue +
                                `' `;
                        if (!checkDetailResult[0].religionId)
                            percentageFlag = true;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Family Details
                case 5: {
                    let screen5RequiredFields = ['id', 'screenNumber', 'familyType', 'fatherDetails', 'motherDetails'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen5RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        if (req.body.fatherDetails) {
                            let fatherDetail = req.body.fatherDetails;
                            if (fatherDetail.id) {
                                let updatetSql = `UPDATE userfamilydetail  SET userId = ` +
                                    userId +
                                    `, name= '` +
                                    fatherDetail.name +
                                    `', memberType =  '` +
                                    fatherDetail.memberType +
                                    `', memberSubType = '` +
                                    fatherDetail.memberSubType +
                                    `', educationId = ` +
                                    fatherDetail.educationId +
                                    ` , occupationId = ` +
                                    fatherDetail.occupationId +
                                    `, 
                                        maritalStatusId = ` +
                                    fatherDetail.maritalStatusId +
                                    `, isAlive = ` +
                                    fatherDetail.isAlive +
                                    `, modifiedBy = ` +
                                    userId +
                                    ` , modifiedDate = CURRENT_TIMESTAMP() WHERE id =` +
                                    fatherDetail.id +
                                    ``;
                                let updateResult = yield apiHeader_1.default.query(updatetSql);
                            }
                            else {
                                let insertsql = `INSERT INTO userfamilydetail  (userId, name, memberType, memberSubType, educationId, occupationId, maritalStatusId, isAlive, createdBy, modifiedBy ) VALUES (` +
                                    userId +
                                    `, '` +
                                    fatherDetail.name +
                                    `', '` +
                                    fatherDetail.memberType +
                                    `','` +
                                    fatherDetail.memberSubType +
                                    `',` +
                                    fatherDetail.educationId +
                                    `,` +
                                    fatherDetail.occupationId +
                                    `,` +
                                    fatherDetail.maritalStatusId +
                                    `,` +
                                    fatherDetail.isAlive +
                                    `, ` +
                                    userId +
                                    `,` +
                                    userId +
                                    `) `;
                                let isertresult = yield apiHeader_1.default.query(insertsql);
                                percentageFlag = true;
                            }
                        }
                        if (req.body.motherDetails) {
                            let motherDetail = req.body.motherDetails;
                            if (motherDetail.id) {
                                let updatetSql = `UPDATE userfamilydetail  SET userId = ` +
                                    userId +
                                    `, name= '` +
                                    motherDetail.name +
                                    `', memberType =  '` +
                                    motherDetail.memberType +
                                    `', memberSubType = '` +
                                    motherDetail.memberSubType +
                                    `', educationId = ` +
                                    motherDetail.educationId +
                                    ` , occupationId = ` +
                                    motherDetail.occupationId +
                                    `, 
                                        maritalStatusId = ` +
                                    motherDetail.maritalStatusId +
                                    `, isAlive = ` +
                                    motherDetail.isAlive +
                                    `, modifiedBy = ` +
                                    userId +
                                    ` , modifiedDate = CURRENT_TIMESTAMP() WHERE id =` +
                                    motherDetail.id +
                                    ``;
                                let updateResult = yield apiHeader_1.default.query(updatetSql);
                            }
                            else {
                                let insertsql = `INSERT INTO userfamilydetail  (userId, name, memberType, memberSubType, educationId, occupationId, maritalStatusId, isAlive, createdBy, modifiedBy ) VALUES (` +
                                    userId +
                                    `, '` +
                                    motherDetail.name +
                                    `', '` +
                                    motherDetail.memberType +
                                    `','` +
                                    motherDetail.memberSubType +
                                    `',` +
                                    motherDetail.educationId +
                                    `,` +
                                    motherDetail.occupationId +
                                    `,` +
                                    motherDetail.maritalStatusId +
                                    `,` +
                                    motherDetail.isAlive +
                                    `, ` +
                                    userId +
                                    `,` +
                                    userId +
                                    `) `;
                                let isertresult = yield apiHeader_1.default.query(insertsql);
                                percentageFlag = true;
                            }
                        }
                        if (req.body.familyDetail && req.body.familyDetail.length > 0) {
                            for (let detail of req.body.familyDetail) {
                                if (detail.id) {
                                    let updatetSql = `UPDATE userfamilydetail  SET userId = ` +
                                        userId +
                                        `, name= '` +
                                        detail.name +
                                        `', memberType =  '` +
                                        detail.memberType +
                                        `', memberSubType = '` +
                                        detail.memberSubType +
                                        `', educationId = ` +
                                        detail.educationId +
                                        ` , occupationId = ` +
                                        detail.occupationId +
                                        `, 
                                        maritalStatusId = ` +
                                        detail.maritalStatusId +
                                        `, isAlive = ` +
                                        detail.isAlive +
                                        `, modifiedBy = ` +
                                        userId +
                                        ` , modifiedDate = CURRENT_TIMESTAMP() WHERE id =` +
                                        detail.id +
                                        ``;
                                    let updateResult = yield apiHeader_1.default.query(updatetSql);
                                }
                                else {
                                    let insertsql = `INSERT INTO userfamilydetail  (userId, name, memberType, memberSubType, educationId, occupationId, maritalStatusId, isAlive, createdBy, modifiedBy ) VALUES (` +
                                        userId +
                                        `, '` +
                                        detail.name +
                                        `', '` +
                                        detail.memberType +
                                        `','` +
                                        detail.memberSubType +
                                        `',` +
                                        detail.educationId +
                                        `,` +
                                        detail.occupationId +
                                        `,` +
                                        detail.maritalStatusId +
                                        `,` +
                                        detail.isAlive +
                                        `, ` +
                                        userId +
                                        `,` +
                                        userId +
                                        `) `;
                                    let isertresult = yield apiHeader_1.default.query(insertsql);
                                }
                            }
                        }
                        updatePara = ` familyType = '` + req.body.familyType + `'`;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Living Status
                case 6: {
                    let screen6RequiredFields = ['id', 'screenNumber', 'permanentAddress', 'currentAddress', 'nativePlace', 'willingToGoAbroad', 'citizenship', 'visaStatus'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen6RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        updatePara =
                            `nativePlace = '` +
                                req.body.nativePlace +
                                `',  willingToGoAbroad = ` +
                                req.body.willingToGoAbroad +
                                `, citizenship = '` +
                                req.body.citizenship +
                                `', visaStatus = '` +
                                req.body.visaStatus +
                                `'`;
                        let p_add = req.body.permanentAddress;
                        let addressResult;
                        if (checkDetailResult[0].addressId) {
                            let updatePermanentAddress = `UPDATE addresses SET addressLine1 = '` +
                                p_add.addressLine1 +
                                `', addressLine2 = '` +
                                p_add.addressLine2 +
                                `', pincode = '` +
                                p_add.pincode +
                                `', cityId = ` +
                                (p_add.cityId ? p_add.cityId : null) +
                                `, districtId = ` +
                                (p_add.districtId ? p_add.districtId : null) +
                                `, stateId = ` +
                                (p_add.stateId ? p_add.stateId : null) +
                                `, countryId = ` +
                                (p_add.countryId ? p_add.countryId : null) +
                                `, countryName= '` +
                                p_add.countryName +
                                `', 
                                                            stateName = '` +
                                p_add.stateName +
                                `', cityName ='` +
                                p_add.cityName +
                                `' , latitude= ` +
                                p_add.latitude +
                                `, longitude =  ` +
                                p_add.longitude +
                                `
                                                            , modifiedDate = CURRENT_TIMESTAMP() , modifiedBy= ` +
                                userId +
                                `, residentialStatus='` +
                                p_add.residentialStatus +
                                `' WHERE id = ` +
                                checkDetailResult[0].addressId +
                                ``;
                            addressResult = yield apiHeader_1.default.query(updatePermanentAddress);
                        }
                        else {
                            let insertPermanentAddress = `INSERT INTO addresses(addressLine1, addressLine2, pincode, cityId, districtId, stateId, countryId, countryName, stateName, cityName, latitude, longitude
                                                        , createdBy, modifiedBy, residentialStatus) VALUES('` +
                                p_add.addressLine1 +
                                `','` +
                                p_add.addressLine2 +
                                `','` +
                                p_add.pincode +
                                `', ` +
                                (p_add.cityId ? p_add.cityId : null) +
                                `
                                                        , ` +
                                (p_add.districtId ? p_add.districtId : null) +
                                `, ` +
                                (p_add.stateId ? p_add.stateId : null) +
                                `, ` +
                                (p_add.countryId ? p_add.countryId : null) +
                                `
                                                        , '` +
                                p_add.countryName +
                                `','` +
                                p_add.stateName +
                                `','` +
                                p_add.cityName +
                                `', ` +
                                p_add.latitude +
                                `, ` +
                                p_add.longitude +
                                `,` +
                                userId +
                                `,` +
                                userId +
                                `, '` +
                                p_add.residentialStatus +
                                `')`;
                            addressResult = yield apiHeader_1.default.query(insertPermanentAddress);
                            updatePara += `, addressId = ` + addressResult.insertId + ` `;
                            percentageFlag = true;
                        }
                        let ca_add = req.body.currentAddress;
                        let currentAddressResult;
                        if (checkDetailResult[0].currentAddressId) {
                            let updateCurrentAddress = `UPDATE addresses SET addressLine1 = '` +
                                ca_add.addressLine1 +
                                `', addressLine2 = '` +
                                ca_add.addressLine2 +
                                `', pincode = '` +
                                ca_add.pincode +
                                `', cityId = ` +
                                (ca_add.cityId ? ca_add.cityId : null) +
                                `, districtId = ` +
                                (ca_add.districtId ? ca_add.districtId : null) +
                                `, stateId = ` +
                                (ca_add.stateId ? ca_add.stateId : null) +
                                `, countryId = ` +
                                (ca_add.countryId ? ca_add.countryId : null) +
                                `, countryName= '` +
                                ca_add.countryName +
                                `', 
                                                            stateName = '` +
                                ca_add.stateName +
                                `', cityName ='` +
                                ca_add.cityName +
                                `' , latitude = ` +
                                ca_add.latitude +
                                `, longitude =  ` +
                                ca_add.longitude +
                                `
                                                            , modifiedDate = CURRENT_TIMESTAMP() , modifiedBy = ` +
                                userId +
                                `, residentialStatus = '` +
                                ca_add.residentialStatus +
                                `' WHERE id = ` +
                                checkDetailResult[0].currentAddressId +
                                ``;
                            currentAddressResult = yield apiHeader_1.default.query(updateCurrentAddress);
                        }
                        else {
                            let insertCurrentAddress = `INSERT INTO addresses(addressLine1, addressLine2, pincode, cityId, districtId, stateId, countryId, countryName, stateName, cityName, latitude, longitude
                                                        , createdBy, modifiedBy, residentialStatus) VALUES('` +
                                ca_add.addressLine1 +
                                `','` +
                                ca_add.addressLine2 +
                                `','` +
                                ca_add.pincode +
                                `', ` +
                                (ca_add.cityId ? ca_add.cityId : null) +
                                `
                                                        , ` +
                                (ca_add.districtId ? ca_add.districtId : null) +
                                `, ` +
                                (ca_add.stateId ? ca_add.stateId : null) +
                                `, ` +
                                (ca_add.countryId ? ca_add.countryId : null) +
                                `
                                                        , '` +
                                ca_add.countryName +
                                `','` +
                                ca_add.stateName +
                                `','` +
                                ca_add.cityName +
                                `', ` +
                                ca_add.latitude +
                                `, ` +
                                ca_add.longitude +
                                `,` +
                                userId +
                                `,` +
                                userId +
                                `, '` +
                                ca_add.residentialStatus +
                                `')`;
                            currentAddressResult = yield apiHeader_1.default.query(insertCurrentAddress);
                            updatePara += `, currentAddressId = ` + currentAddressResult.insertId + ` `;
                            percentageFlag = true;
                        }
                        // updatePara = `addressId = ` + addressResult.insertId + `, currentAddressId = ` + currentAddressResult.insertId + `, nativePlace = '` + req.body.nativePlace + `',  willingToGoAbroad = ` + req.body.willingToGoAbroad + `, citizenship = '` + req.body.citizenship + `', visaStatus = '` + req.body.visaStatus + `'`
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Education & Career Details
                case 7: {
                    let screen7RequiredFields = ['id', 'screenNumber'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen7RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        updatePara =
                            ` educationTypeId = ` +
                                req.body.educationTypeId +
                                `, educationMediumId = ` +
                                (req.body.educationMediumId ? req.body.educationMediumId : null) +
                                `, educationId = ` +
                                (req.body.educationId ? req.body.educationId : null) +
                                `, areYouWorking = ` +
                                req.body.areYouWorking +
                                `, occupationId = ` +
                                (req.body.occupationId ? req.body.occupationId : null) +
                                `, businessName = ` +
                                (req.body.businessName ? `'` + req.body.businessName + `'` : null) +
                                `, designation = ` +
                                (req.body.designation ? `'` + req.body.designation + `'` : null) +
                                `, employmentTypeId =` +
                                (req.body.employmentTypeId ? req.body.employmentTypeId : null) +
                                `, companyName = ` +
                                (req.body.companyName ? `'` + req.body.companyName + `'` : null) +
                                `, annualIncomeId = ` +
                                (req.body.annualIncomeId ? req.body.annualIncomeId : null) +
                                ` `;
                        if (!checkDetailResult[0].educationId)
                            percentageFlag = true;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Astrologic Details
                case 8: {
                    let screen8RequiredFields = ['id', 'screenNumber', 'horoscopeBelief'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen8RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        let astrologicDetailSql = yield apiHeader_1.default.query(`SELECT * FROM userastrologicdetail WHERE userId = ` + userId + ``);
                        if (astrologicDetailSql && astrologicDetailSql.length > 0) {
                            let updateSql = `UPDATE userastrologicdetail SET userId = ` +
                                userId +
                                `, horoscopeBelief = ` +
                                req.body.horoscopeBelief +
                                `, birthCountryId=` +
                                (req.body.birthCountryId ? req.body.birthCountryId : null) +
                                `, birthCityId=` +
                                (req.body.birthCityId ? req.body.birthCityId : null) +
                                `, birthCountryName=` +
                                (req.body.birthCountryName ? `'` + req.body.birthCountryName + `'` : null) +
                                `, birthCityName = ` +
                                (req.body.birthCityName ? `'` + req.body.birthCityName + `'` : null) +
                                `, zodiacSign= ` +
                                (req.body.zodiacSign ? `'` + req.body.zodiacSign + `'` : null) +
                                `, timeOfBirth = ` +
                                (req.body.timeOfBirth ? `'` + req.body.timeOfBirth + `'` : null) +
                                `, isHideBirthTime =` +
                                (req.body.isHideBirthTime ? req.body.isHideBirthTime : null) +
                                `, manglik = ` +
                                (req.body.manglik ? req.body.manglik : null) +
                                `,  modifiedBy = ` +
                                userId +
                                `, modifiedDate = CURRENT_TIMESTAMP() WHERE id = ` +
                                astrologicDetailSql[0].id +
                                ``;
                            result = yield apiHeader_1.default.query(updateSql);
                        }
                        else {
                            let insertSql = `INSERT INTO userastrologicdetail (userId , horoscopeBelief , birthCountryId, birthCityId, birthCountryName, birthCityName, zodiacSign, timeOfBirth , isHideBirthTime , manglik, createdBy, modifiedBy) 
                                                 VALUES ( ` +
                                userId +
                                `,` +
                                req.body.horoscopeBelief +
                                `,` +
                                (req.body.birthCountryId ? req.body.birthCountryId : null) +
                                `, ` +
                                (req.body.birthCityId ? req.body.birthCityId : null) +
                                `,` +
                                (req.body.birthCountryName ? `'` + req.body.birthCountryName + `'` : null) +
                                `,` +
                                (req.body.birthCityName ? `'` + req.body.birthCityName + `'` : null) +
                                `, ` +
                                (req.body.zodiacSign ? `'` + req.body.zodiacSign + `'` : null) +
                                `,` +
                                (req.body.timeOfBirth ? `'` + req.body.timeOfBirth + `'` : null) +
                                `, ` +
                                (req.body.isHideBirthTime ? req.body.isHideBirthTime : null) +
                                `, ` +
                                (req.body.manglik ? req.body.manglik : null) +
                                `, ` +
                                userId +
                                `, ` +
                                userId +
                                `)`;
                            result = yield apiHeader_1.default.query(insertSql);
                            percentageFlag = true;
                        }
                        // updatePara = `userId = ` + userId + `, isHoroscopeBelief = ` + req.body.isHoroscopeBelief + `, birthCountryId=` + req.body.birthCountryId + `, birthCityId=` + req.body.birthCityId + `, birthCountryName='` + req.body.birthCountryName + `', birthCityName='` + req.body.birthCityName + `', zodiacSign= '` + req.body.zodiacSign + `', timeOfBirth = '` + req.body.timeOfBirth + `', isHideBirthTime =` + req.body.isHideBirthTime + `, isManglik =` + req.body.isManglik + ` `;
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Life Styles
                case 9: {
                    let screen9RequiredFields = ['id', 'screenNumber', 'dietId', 'smoking', 'drinking'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen9RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        updatePara = `dietId = ` + req.body.dietId + `, smoking = '` + req.body.smoking + `', drinking = '` + req.body.drinking + `' `;
                        if (checkDetailResult[0].dietId == null && checkDetailResult[0].smoking == null && checkDetailResult[0].drinking == null) {
                            percentageFlag = true;
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // Partner Preferences
                case 10: {
                    let screen11RequiredFields = ['id', 'screenNumber'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen11RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        if (req.body.pMaritalStatusId && Array.isArray(req.body.pMaritalStatusId)) {
                            req.body.pMaritalStatusId = req.body.pMaritalStatusId.join(',');
                        }
                        if (req.body.pReligionId && Array.isArray(req.body.pReligionId)) {
                            req.body.pReligionId = req.body.pReligionId.join(',');
                        }
                        if (req.body.pCommunityId && Array.isArray(req.body.pCommunityId)) {
                            req.body.pCommunityId = req.body.pCommunityId.join(',');
                        }
                        if (req.body.pCountryLivingInId && Array.isArray(req.body.pCountryLivingInId)) {
                            req.body.pCountryLivingInId = req.body.pCountryLivingInId.join(',');
                        }
                        if (req.body.pStateLivingInId && Array.isArray(req.body.pStateLivingInId)) {
                            req.body.pStateLivingInId = req.body.pStateLivingInId.join(',');
                        }
                        if (req.body.pCityLivingInId && Array.isArray(req.body.pCityLivingInId)) {
                            req.body.pCityLivingInId = req.body.pCityLivingInId.join(',');
                        }
                        if (req.body.pEducationTypeId && Array.isArray(req.body.pEducationTypeId)) {
                            req.body.pEducationTypeId = req.body.pEducationTypeId.join(',');
                        }
                        if (req.body.pEducationMediumId && Array.isArray(req.body.pEducationMediumId)) {
                            req.body.pEducationMediumId = req.body.pEducationMediumId.join(',');
                        }
                        if (req.body.pOccupationId && Array.isArray(req.body.pOccupationId)) {
                            req.body.pOccupationId = req.body.pOccupationId.join(',');
                        }
                        if (req.body.pEmploymentTypeId && Array.isArray(req.body.pEmploymentTypeId)) {
                            req.body.pEmploymentTypeId = req.body.pEmploymentTypeId.join(',');
                        }
                        if (req.body.pAnnualIncomeId && Array.isArray(req.body.pAnnualIncomeId)) {
                            req.body.pAnnualIncomeId = req.body.pAnnualIncomeId.join(',');
                        }
                        if (req.body.pDietId && Array.isArray(req.body.pDietId)) {
                            req.body.pDietId = req.body.pDietId.join(',');
                        }
                        if (req.body.pComplexion && Array.isArray(req.body.pComplexion)) {
                            req.body.pComplexion = req.body.pComplexion.join(',');
                        }
                        if (req.body.pBodyType && Array.isArray(req.body.pBodyType)) {
                            req.body.pBodyType = req.body.pBodyType.join(',');
                        }
                        let preferencesDetail = yield apiHeader_1.default.query(`SELECT * FROM userpartnerpreferences WHERE userId = ` + userId + ``);
                        if (preferencesDetail && preferencesDetail.length > 0) {
                            let sql = `UPDATE userpartnerpreferences SET userId= ` +
                                userId +
                                `,pFromAge = ` +
                                req.body.pFromAge +
                                `,pToAge = ` +
                                req.body.pToAge +
                                `, pFromHeight = ` +
                                req.body.pFromHeight +
                                `,pToHeight = ` +
                                req.body.pToHeight +
                                `,pMaritalStatusId =  '` +
                                req.body.pMaritalStatusId +
                                `',pProfileWithChildren = ` +
                                req.body.pProfileWithChildren +
                                `, pFamilyType = '` +
                                req.body.pFamilyType +
                                `',
                                            pReligionId = '` +
                                req.body.pReligionId +
                                `', pCommunityId = '` +
                                req.body.pCommunityId +
                                `',pMotherTongue = '` +
                                req.body.pMotherTongue +
                                `',pHoroscopeBelief = ` +
                                req.body.pHoroscopeBelief +
                                `,pManglikMatch = ` +
                                req.body.pManglikMatch +
                                `,pCountryLivingInId = '` +
                                req.body.pCountryLivingInId +
                                `',
                                            pStateLivingInId = '` +
                                req.body.pStateLivingInId +
                                `',pCityLivingInId = '` +
                                req.body.pCityLivingInId +
                                `',pEducationTypeId = '` +
                                req.body.pEducationTypeId +
                                `',pEducationMediumId = '` +
                                req.body.pEducationMediumId +
                                `',  pOccupationId = '` +
                                req.body.pOccupationId +
                                `',
                                            pOccupationId='` +
                                req.body.pEmploymentTypeId +
                                `',pAnnualIncomeId = '` +
                                req.body.pAnnualIncomeId +
                                `',pDietId = '` +
                                req.body.pDietId +
                                `', pSmokingAcceptance=` +
                                req.body.pSmokingAcceptance +
                                `,pAlcoholAcceptance = ` +
                                req.body.pAlcoholAcceptance +
                                `,pDisabilityAcceptance = ` +
                                req.body.pDisabilityAcceptance +
                                `,pComplexion = '` +
                                req.body.pComplexion +
                                `',
                                            pBodyType = '` +
                                req.body.pBodyType +
                                `',pOtherExpectations = '` +
                                req.body.pOtherExpectations +
                                `',modifiedBy = ` +
                                userId +
                                `,modifiedDate = CURRENT_TIMESTAMP() WHERE id = ` +
                                preferencesDetail[0].id +
                                ``;
                            result = yield apiHeader_1.default.query(sql);
                        }
                        else {
                            let sql = `INSERT INTO userpartnerpreferences (userId, pFromAge, pToAge, pFromHeight, pToHeight, pMaritalStatusId, pProfileWithChildren, pFamilyType, 
                                            pReligionId, pCommunityId, pMotherTongue, pHoroscopeBelief, pManglikMatch, pCountryLivingInId, pStateLivingInId, pCityLivingInId, pEducationTypeId,
                                            pEducationMediumId, pOccupationId, pEmploymentTypeId, pAnnualIncomeId, pDietId, pSmokingAcceptance, pAlcoholAcceptance, pDisabilityAcceptance, 
                                            pComplexion, pBodyType, pOtherExpectations, createdBy, modifiedBy, createdDate, modifiedDate) 
                                            VALUES 
                                            (` +
                                userId +
                                `,` +
                                req.body.pFromAge +
                                `,` +
                                req.body.pToAge +
                                `, ` +
                                req.body.pFromHeight +
                                `, ` +
                                req.body.pToHeight +
                                `,'` +
                                req.body.pMaritalStatusId +
                                `',` +
                                req.body.pProfileWithChildren +
                                `, '` +
                                req.body.pFamilyType +
                                `',
                                            '` +
                                req.body.pReligionId +
                                `', '` +
                                req.body.pCommunityId +
                                `','` +
                                req.body.pMotherTongue +
                                `',` +
                                req.body.pHoroscopeBelief +
                                `,` +
                                req.body.pManglikMatch +
                                `,'` +
                                req.body.pCountryLivingInId +
                                `',
                                            '` +
                                req.body.pStateLivingInId +
                                `','` +
                                req.body.pCityLivingInId +
                                `','` +
                                req.body.pEducationTypeId +
                                `','` +
                                req.body.pEducationMediumId +
                                `',  '` +
                                req.body.pOccupationId +
                                `',
                                            '` +
                                req.body.pEmploymentTypeId +
                                `','` +
                                req.body.pAnnualIncomeId +
                                `','` +
                                req.body.pDietId +
                                `', ` +
                                req.body.pSmokingAcceptance +
                                `,` +
                                req.body.pAlcoholAcceptance +
                                `,` +
                                req.body.pDisabilityAcceptance +
                                `,'` +
                                req.body.pComplexion +
                                `',
                                            '` +
                                req.body.pBodyType +
                                `','` +
                                req.body.pOtherExpectations +
                                `',` +
                                userId +
                                `,` +
                                userId +
                                `, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP() )`;
                            result = yield apiHeader_1.default.query(sql);
                            percentageFlag = true;
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
                // KYC
                case 11: {
                    let screen11RequiredFields = ['id', 'screenNumber', 'documents'];
                    let validationResult = apiHeader_1.default.validateRequiredFields(req, screen11RequiredFields);
                    if (validationResult && validationResult.statusCode == 200) {
                        let docCheck = yield apiHeader_1.default.query(`SELECT * FROM userdocument WHERE userId = ` + userId + ``);
                        if (docCheck && docCheck.length < 0)
                            percentageFlag = true;
                        if (req.body.documents && req.body.documents.length > 0) {
                            for (let i = 0; i < req.body.documents.length; i++) {
                                if (req.body.documents[i].isRequired) {
                                    if (!req.body.documents[i].documentUrl) {
                                        let errorResult = new resulterror_1.ResultError(400, true, 'Document is Required', new Error('Document is Required'), '');
                                        next(errorResult);
                                        return errorResult;
                                    }
                                }
                                if (req.body.documents[i].documentUrl) {
                                    if (req.body.documents[i].id) {
                                        if (req.body.documents[i].documentUrl && req.body.documents[i].documentUrl.indexOf('content') == -1) {
                                            let userDocumentId = req.body.documents[i].id;
                                            let oldDocummentSql = `SELECT * FROM userdocument WHERE id = ` + userDocumentId;
                                            let oldDocummentResult = yield apiHeader_1.default.query(oldDocummentSql);
                                            let image = req.body.documents[i].documentUrl;
                                            let data = image.split(',');
                                            if (data && data.length > 1) {
                                                image = image.split(',')[1];
                                            }
                                            let dir = './content';
                                            if (!fs.existsSync(dir)) {
                                                fs.mkdirSync(dir);
                                            }
                                            let dir1 = './content/userDocument';
                                            if (!fs.existsSync(dir1)) {
                                                fs.mkdirSync(dir1);
                                            }
                                            let dir2 = './content/userDocument/' + req.body.id;
                                            if (!fs.existsSync(dir2)) {
                                                fs.mkdirSync(dir2);
                                            }
                                            const fileContentsUser = new Buffer(image, 'base64');
                                            let imgPath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '-realImg.jpeg';
                                            fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                                if (err)
                                                    return console.error(err);
                                                console.log('file saved imagePath');
                                            });
                                            let imagePath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '.jpeg';
                                            yield Jimp.read(imgPath)
                                                .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                                // return lenna
                                                //     //.resize(100, 100) // resize
                                                //     .quality(60) // set JPEG quality
                                                //     // .greyscale() // set greyscale
                                                //     // .write("lena-small-bw.jpg"); // save
                                                //     .write(imagePath);
                                                let data = lenna
                                                    //.resize(100, 100) // resize
                                                    // .quality(60) // set JPEG quality
                                                    // .greyscale() // set greyscale
                                                    // .write("lena-small-bw.jpg"); // save
                                                    .write(imagePath);
                                                const image_act = yield Jimp.read(imagePath);
                                                const watermark = yield Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                                watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                                const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                                const y = image_act.getHeight() - watermark.getHeight() * 2;
                                                image_act.composite(watermark, x, y, {
                                                    mode: Jimp.BLEND_SOURCE_OVER,
                                                    opacitySource: 0.5 // Adjust the opacity of the watermark
                                                });
                                                //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                                yield image_act.writeAsync(imagePath);
                                                return data;
                                            }))
                                                .catch((err) => {
                                                console.error(err);
                                            });
                                            let updateimagePathSql = `UPDATE userdocument SET documentUrl='` + imagePath.substring(2) + `',modifiedDate = CURRENT_TIMESTAMP() WHERE id=` + userDocumentId;
                                            result = yield apiHeader_1.default.query(updateimagePathSql);
                                            console.log('resuilt----------->', result);
                                        }
                                        else {
                                            let userDocumentId = req.body.documents[i].id;
                                            let updateimagePathSql = `UPDATE userdocument SET documentUrl= '` + req.body.documents[i].documentUrl + `',modifiedDate = CURRENT_TIMESTAMP() WHERE id=` + userDocumentId;
                                            result = yield apiHeader_1.default.query(updateimagePathSql);
                                            console.log('resuilt----------->', result);
                                        }
                                    }
                                    else {
                                        if (req.body.documents[i].documentUrl && req.body.documents[i].documentUrl.indexOf('content') == -1) {
                                            //let imageSql = `INSERT INTO images(createdBy, modifiedBy) VALUES (` + req.body.id + `,` + req.body.id + `)`;
                                            let userDocumentSql = `INSERT INTO userdocument(userId, documentTypeId, isVerified, isRequired, createdBy, modifiedBy) 
                                            VALUES(` +
                                                req.body.id +
                                                `,` +
                                                req.body.documents[i].documentTypeId +
                                                `, 0, ` +
                                                req.body.documents[i].isRequired +
                                                `,` +
                                                req.body.id +
                                                `,` +
                                                req.body.id +
                                                `)`;
                                            result = yield apiHeader_1.default.query(userDocumentSql);
                                            if (result.insertId) {
                                                let userDocumentId = result.insertId;
                                                let image = req.body.documents[i].documentUrl;
                                                let data = image.split(',');
                                                if (data && data.length > 1) {
                                                    image = image.split(',')[1];
                                                }
                                                let dir = './content';
                                                if (!fs.existsSync(dir)) {
                                                    fs.mkdirSync(dir);
                                                }
                                                let dir1 = './content/userDocument';
                                                if (!fs.existsSync(dir1)) {
                                                    fs.mkdirSync(dir1);
                                                }
                                                let dir2 = './content/userDocument/' + req.body.id;
                                                if (!fs.existsSync(dir2)) {
                                                    fs.mkdirSync(dir2);
                                                }
                                                const fileContentsUser = new Buffer(image, 'base64');
                                                let imgPath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '-realImg.jpeg';
                                                fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                                    if (err)
                                                        return console.error(err);
                                                    console.log('file saved imagePath');
                                                });
                                                let imagePath = './content/userDocument/' + req.body.id + '/' + userDocumentId + '.jpeg';
                                                yield Jimp.read(imgPath)
                                                    .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                                    // return lenna
                                                    //     //.resize(100, 100) // resize
                                                    //     .quality(60) // set JPEG quality
                                                    //     // .greyscale() // set greyscale
                                                    //     // .write("lena-small-bw.jpg"); // save
                                                    //     .write(imagePath);
                                                    let data = lenna
                                                        //.resize(100, 100) // resize
                                                        // .quality(60) // set JPEG quality
                                                        // .greyscale() // set greyscale
                                                        // .write("lena-small-bw.jpg"); // save
                                                        .write(imagePath);
                                                    const image_act = yield Jimp.read(imagePath);
                                                    const watermark = yield Jimp.read('./content/systemflag/watermarkImage/watermarkImage.jpeg');
                                                    watermark.resize(image_act.getWidth() / 2, Jimp.AUTO);
                                                    const x = (image_act.getWidth() - watermark.getWidth()) / 2;
                                                    const y = image_act.getHeight() - watermark.getHeight() * 2;
                                                    image_act.composite(watermark, x, y, {
                                                        mode: Jimp.BLEND_SOURCE_OVER,
                                                        opacitySource: 0.5 // Adjust the opacity of the watermark
                                                    });
                                                    //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                                    yield image_act.writeAsync(imagePath);
                                                    return data;
                                                }))
                                                    .catch((err) => {
                                                    console.error(err);
                                                });
                                                let updateimagePathSql = `UPDATE userdocument SET documentUrl='` + imagePath.substring(2) + `', modifiedDate = CURRENT_TIMESTAMP() WHERE id=` + userDocumentId;
                                                result = yield apiHeader_1.default.query(updateimagePathSql);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (req.body.documents[i].id) {
                                        let oldDocummentSql = `SELECT * FROM userdocument WHERE id = ` + req.body.documents[i].id;
                                        let oldDocummentResult = yield apiHeader_1.default.query(oldDocummentSql);
                                        let updateimagePathSql = `DELETE FROM userdocument WHERE id=` + req.body.documents[i].id;
                                        result = yield apiHeader_1.default.query(updateimagePathSql);
                                        if (result && result.affectedRows > 0) {
                                            if (oldDocummentResult && oldDocummentResult.length > 0) {
                                                for (let d = 0; d < oldDocummentResult.length; d++) {
                                                    if (oldDocummentResult[d].documentUrl) {
                                                        let oldUrl = oldDocummentResult[d].documentUrl;
                                                        let imagePath = './' + oldUrl;
                                                        if (fs.existsSync(imagePath)) {
                                                            fs.unlink(imagePath, (err) => {
                                                                if (err)
                                                                    throw err;
                                                                console.log(imagePath + ' was deleted');
                                                            });
                                                        }
                                                        let realImg = './' + oldUrl.split('.')[0] + '-realImg.' + oldUrl.split('.')[1];
                                                        if (fs.existsSync(realImg)) {
                                                            fs.unlink(realImg, (err) => {
                                                                if (err)
                                                                    throw err;
                                                                console.log(realImg + ' was deleted');
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
                        next(errorResult);
                    }
                    break;
                }
            }
            if (updatePara) {
                let sql = `UPDATE userpersonaldetail SET `;
                if (updatePara) {
                    sql += ` ` + updatePara + ` `;
                }
                sql += ` WHERE userId = ` + userId + ``;
                result = yield apiHeader_1.default.query(sql);
            }
            if (result && result.affectedRows > 0) {
                // let updateCompletedScreen = `UPDATE users SET lastCompletedScreen = ` + screenNumber + ` `;
                // if (screenDetailSql[0].weightage && !screenDetailSql[0].isSkippable) {
                //     updateCompletedScreen += ` , profileCompletedPercentage = profileCompletedPercentage + ` + screenDetailSql[0].weightage + ` `;
                // }
                // updateCompletedScreen += ` WHERE id = ` + userId;
                // let updateCompletedScreenSql = await header.query(updateCompletedScreen);
                let screenCount = yield apiHeader_1.default.query(`SELECT COUNT(id) as count FROM registrationscreens WHERE isDisable = 0`);
                let updateCompletedScreenSql = `UPDATE users SET  profileCompletedPercentage = profileCompletedPercentage + ` + screenDetailSql[0].weightage + ` WHERE id = ` + userId + ``;
                if (screenDetailSql[0].weightage && !screenDetailSql[0].isSkippable && !checkDetailResult[0].isProfileCompleted && percentageFlag) {
                    let updateCompletedScreenReslt = yield apiHeader_1.default.query(updateCompletedScreenSql);
                }
                // else if (screenDetailSql[0].weightage && screenDetailSql[0].isSkippable && percentageFlag) {
                //     let updateCompletedScreenReslt = await header.query(updateCompletedScreenSql);
                // }
                if (user[0].lastCompletedScreen < screenNumber) {
                    let updateScreenSql = `UPDATE users SET lastCompletedScreen = ` + screenNumber + ` `;
                    if (screenNumber == 11 && !user[0].isProfileCompleted) {
                        updateScreenSql += ` ,isProfileCompleted = true `;
                    }
                    updateScreenSql += ` WHERE id = ` + userId + ``;
                    let updateScreenResult = yield apiHeader_1.default.query(updateScreenSql);
                }
                // let updateCompletedScreen = await header.query(`UPDATE users SET lastCompletedScreen = ` + screenNumber + ` WHERE id = ` + userId + ``);
                if (isCustomFieldEnabled && req.body.customFields != null && req.body.customFields.length > 0) {
                    let fields = req.body.customFields;
                    let customResult;
                    let customSql;
                    let checkCustomData = yield apiHeader_1.default.query(`SELECT * FROM userpersonaldetailcustomdata WHERE userId = ` + userId + `  `);
                    if (checkCustomData && checkCustomData.length > 0) {
                        customSql = `UPDATE userpersonaldetailcustomdata SET `;
                        for (let i = 0; i < fields.length; i++) {
                            if (fields[i].value && Array.isArray(fields[i].value)) {
                                const semicolonSeparatedString = fields[i].value.join(';');
                                fields[i].value = semicolonSeparatedString;
                            }
                            customSql += `` + fields[i].mappedFieldName + ` = `;
                            if (fields[i].valueTypeId == '2') {
                                customSql += `` + (fields[i].value ? fields[i].value : null) + ``;
                            }
                            else {
                                // customUpdateSql += `'` + fields[i].value + `'`;
                                customSql += `` + (fields[i].value && fields[i].value != '' ? "'" + fields[i].value + "'" : null) + ``;
                            }
                            customSql += `,`;
                        }
                        customSql += ` modifiedBy = ` + req.body.id + `, modifiedDate = CURRENT_TIMESTAMP() WHERE userId = ` + req.body.id + `  `;
                    }
                    else {
                        customSql = `INSERT INTO userpersonaldetailcustomdata(userId,createdBy,modifiedBy,`;
                        for (let i = 0; i < fields.length; i++) {
                            customSql += `` + fields[i].mappedFieldName + ``;
                            if (i != fields.length - 1) {
                                customSql += `,`;
                            }
                        }
                        customSql += `) VALUES (` + req.body.id + `,` + req.body.id + `,` + req.body.id + `,`;
                        for (let i = 0; i < fields.length; i++) {
                            if (fields[i].value && Array.isArray(fields[i].value)) {
                                const semicolonSeparatedString = fields[i].value.join(';');
                                fields[i].value = semicolonSeparatedString;
                            }
                            if (fields[i].valueTypeId == '2') {
                                customSql += `` + (fields[i].value ? fields[i].value : null) + ``;
                            }
                            else {
                                customSql += `` + (fields[i].value && fields[i].value != '' ? "'" + fields[i].value + "'" : null) + ``;
                            }
                            if (i != fields.length - 1) {
                                customSql += `,`;
                            }
                        }
                        customSql += ` ) `;
                        // console.log(customSql);
                    }
                    customResult = yield apiHeader_1.default.query(customSql);
                    if (customResult && customResult.affectedRows > 0) {
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Custom Field Data'), '');
                        next(errorResult);
                    }
                }
                let flagError = false;
                if (checkDetailResult && checkDetailResult.length == 0) {
                    let checkRewardSql = `SELECT * FROM systemflags WHERE id IN(42,43)`;
                    let checkRewardResult = yield apiHeader_1.default.query(checkRewardSql);
                    if (checkRewardResult && checkRewardResult.length > 0) {
                        let ind = checkRewardResult.findIndex((c) => c.value == '1' && c.id == 42);
                        let amount = parseFloat(checkRewardResult.find((c) => c.id == 43).value);
                        if (ind >= 0) {
                            //Insert Wallet User History and Insert/Update User Wallet
                            let referalUserSql = `Select referalUserId from users where id = ` + req.body.id;
                            let referalUserResult = yield apiHeader_1.default.query(referalUserSql);
                            if (referalUserResult && referalUserResult.length > 0 && referalUserResult[0].referalUserId != null) {
                                let checkUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + referalUserResult[0].referalUserId;
                                // let checkUserWalletSql = `SELECT * FROM userwallets WHERE userId = (select referalUserId from users where id=` + userId + `)`;
                                let checkUserWalletResult = yield apiHeader_1.default.query(checkUserWalletSql);
                                if (checkUserWalletResult && checkUserWalletResult.length > 0) {
                                    let lAmt = checkUserWalletResult[0].amount + amount;
                                    let userWalletSql = `UPDATE userwallets SET amount = ` + lAmt + `, modifiedBy = ` + userId + `, modifiedDate = CURRENT_TIMESTAMP() WHERE id = ` + checkUserWalletResult[0].id;
                                    let result = yield apiHeader_1.default.query(userWalletSql);
                                    if (result && result.affectedRows >= 0) {
                                        let userWalletId = checkUserWalletResult[0].id;
                                        let userWalletHistorySql = `INSERT INTO userwallethistory(userWalletId, amount, isCredit, transactionDate, remark, createdBy, modifiedBy) 
                                        VALUES(` +
                                            userWalletId +
                                            `,` +
                                            amount +
                                            `, 1, ?, 'Amount credited via refered user',` +
                                            userId +
                                            `,` +
                                            userId +
                                            ` )`;
                                        result = yield apiHeader_1.default.query(userWalletHistorySql, [new Date()]);
                                        if (result && result.insertId > 0) {
                                        }
                                        else {
                                            flagError = true;
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                            next(errorResult);
                                        }
                                    }
                                    else {
                                        flagError = true;
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                        next(errorResult);
                                    }
                                }
                                else {
                                    let userWalletSql = `INSERT INTO userwallets(userId, amount, createdBy, modifiedBy) VALUES(` + req.body.id + `,` + amount + `,` + userId + `,` + userId + `)`;
                                    let result = yield apiHeader_1.default.query(userWalletSql);
                                    if (result && result.insertId > 0) {
                                        let userWalletId = result.insertId;
                                        let userWalletHistorySql = `INSERT INTO userwallethistory(userWalletId, amount, isCredit, transactionDate, remark, createdBy, modifiedBy) 
                                        VALUES(` +
                                            userWalletId +
                                            `,` +
                                            amount +
                                            `, 1, ?, 'Amount credited via refered user',` +
                                            userId +
                                            `,` +
                                            userId +
                                            ` )`;
                                        result = yield apiHeader_1.default.query(userWalletHistorySql, [new Date()]);
                                        if (result && result.insertId > 0) {
                                        }
                                        else {
                                            flagError = true;
                                            yield apiHeader_1.default.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                            next(errorResult);
                                        }
                                    }
                                    else {
                                        flagError = true;
                                        yield apiHeader_1.default.rollback();
                                        let errorResult = new resulterror_1.ResultError(400, true, 'users.updateUserProfileDetail() Error', new Error('Error While Inserting Data'), '');
                                        next(errorResult);
                                    }
                                }
                            }
                            else {
                            }
                        }
                    }
                }
                // region resopnse
                if (!flagError) {
                    let sql = `SELECT u.id, u.firstName,udd.fcmToken,img.imageUrl,u.stripeCustomerId, u.middleName, u.lastName, u.gender, u.email, u.contactNo, u.isVerifyProfilePic,u.lastCompletedScreen,u.isProfileCompleted,upd.isHideContactDetail
                                   , upd.religionId, upd.communityId, upd.maritalStatusId, upd.occupationId, upd.educationId, upd.subCommunityId, upd.dietId, upd.annualIncomeId, upd.heightId, upd.birthDate
                                   , upd.languages, upd.eyeColor, upd.businessName, upd.companyName, upd.employmentTypeId, upd.weight as weightId, upd.profileForId, upd.expectation, upd.aboutMe
                                   ,upd.memberid, upd.anyDisability, upd.haveSpecs, upd.haveChildren, upd.noOfChildren, upd.bloodGroup, upd.complexion, upd.bodyType, upd.familyType, upd.motherTongue
                                   , upd.currentAddressId, upd.nativePlace, upd.citizenship, upd.visaStatus, upd.designation, upd.educationTypeId, upd.educationMediumId, upd.drinking, upd.smoking
                                   , upd.willingToGoAbroad, upd.areYouWorking,upd.addressId ,edt.name as educationType, edme.name as educationMedium 
                                   , r.name as religion, c.name as community, o.name as occupation, e.name as education, sc.name as subCommunity, ai.value as annualIncome, h.name as height
                                   , cit.name as cityName, ds.name as districtName, st.name as stateName, cou.name as countryName
                                   , em.name as employmentType, DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),upd.birthDate)), '%Y')+0 AS age,
                                    JSON_OBJECT(
                                            'id',addr.id,
											'addressLine1', addr.addressLine1, 
											'addressLine2', addr.addressLine2, 
											'pincode', addr.pincode, 
											'cityId', addr.cityId, 
											'districtId', addr.districtId, 
											'stateId', addr.stateId, 
											'countryId', addr.countryId,
											'cityName', addr.cityName,
											'stateName', addr.stateName,
											'countryName', addr.countryName,
                                            'residentialStatus',addr.residentialStatus,
                                            'latitude',addr.latitude,
                                            'longitude',addr.longitude
                                    ) AS permanentAddress,
                                    JSON_OBJECT(
                                            'id', cuaddr.id,
											'addressLine1', cuaddr.addressLine1, 
											'addressLine2', cuaddr.addressLine2, 
											'pincode', cuaddr.pincode, 
											'cityId', cuaddr.cityId, 
											'districtId', cuaddr.districtId, 
											'stateId', cuaddr.stateId, 
											'countryId', cuaddr.countryId,
											'cityName', cuaddr.cityName,
											'stateName', cuaddr.stateName,
											'countryName', cuaddr.countryName,
                                            'residentialStatus',cuaddr.residentialStatus,
                                            'latitude',cuaddr.latitude,
                                            'longitude',cuaddr.longitude
                                    ) AS currentAddress,
                                    (SELECT JSON_ARRAYAGG(JSON_OBJECT(
											'id', ufdfd.id,
											'userId', ufdfd.userId,
											'name', ufdfd.name,
											'memberType', ufdfd.memberType,
											'memberSubType', ufdfd.memberSubType,
											'educationId', ufdfd.educationId,
											'occupationId', ufdfd.occupationId,
											'maritalStatusId', ufdfd.maritalStatusId,
											'isAlive', ufdfd.isAlive
									)) 
								    FROM userfamilydetail ufdfd
								    WHERE userId = ` +
                        req.body.id +
                        ` AND memberSubType NOT IN('Father','Mother') ) AS familyDetail,
                                    (SELECT JSON_OBJECT(
                                            'id',ufdf.id, 
                                            'userId',ufdf.userId, 
                                            'name',ufdf.name, 
                                            'memberType',ufdf.memberType, 
                                            'memberSubType',ufdf.memberSubType, 
                                            'educationId',ufdf.educationId, 
                                            'occupationId',ufdf.occupationId, 
                                            'maritalStatusId',ufdf.maritalStatusId, 
                                            'isAlive',ufdf.isAlive
									) FROM userfamilydetail ufdf WHERE ufdf.userId = ` +
                        req.body.id +
                        ` AND ufdf.memberSubType = 'Father' limit 1 )  AS fatherDetails,
                                      (SELECT JSON_OBJECT(
                                            'id',ufdm.id, 
                                            'userId',ufdm.userId, 
                                            'name',ufdm.name, 
                                            'memberType',ufdm.memberType, 
                                            'memberSubType',ufdm.memberSubType, 
                                            'educationId',ufdm.educationId, 
                                            'occupationId',ufdm.occupationId, 
                                            'maritalStatusId',ufdm.maritalStatusId, 
                                            'isAlive',ufdm.isAlive
									) FROM userfamilydetail ufdm WHERE ufdm.userId = ` +
                        req.body.id +
                        ` AND ufdm.memberSubType = 'Mother' limit 1 )  AS motherDetails,
                                   uatd.horoscopeBelief, uatd.birthCountryId, uatd.birthCityId, uatd.birthCountryName, uatd.birthCityName, uatd.zodiacSign, uatd.timeOfBirth, uatd.isHideBirthTime, uatd.manglik,
                                   upp.pFromAge, upp.pToAge, upp.pFromHeight, upp.pToHeight, upp.pMaritalStatusId, upp.pProfileWithChildren, upp.pFamilyType, upp.pReligionId, upp.pCommunityId, upp.pMotherTongue, upp.pHoroscopeBelief, 
                                   upp.pManglikMatch, upp.pCountryLivingInId, upp.pStateLivingInId, upp.pCityLivingInId, upp.pEducationTypeId, upp.pEducationMediumId, upp.pOccupationId, upp.pEmploymentTypeId, upp.pAnnualIncomeId, upp.pDietId, 
                                   upp.pSmokingAcceptance, upp.pAlcoholAcceptance, upp.pDisabilityAcceptance, upp.pComplexion, upp.pBodyType, upp.pOtherExpectations, w.name as weight
                                   FROM users u
                                   LEFT JOIN userroles ur ON ur.userId = u.id
                                   LEFT JOIN userdevicedetail udd ON udd.userId = u.id
                                   LEFT JOIN images img ON img.id = u.imageId
                                   LEFT JOIN userpersonaldetail upd ON upd.userId = u.id
                                   LEFT JOIN religion r ON r.id = upd.religionId
                                   LEFT JOIN community c ON c.id = upd.communityId
                                   LEFT JOIN occupation o ON o.id = upd.occupationId
                                   LEFT JOIN education e ON e.id = upd.educationId
                                   LEFT JOIN subcommunity sc ON sc.id = upd.subCommunityId
                                   LEFT JOIN annualincome ai ON ai.id = upd.annualIncomeId
                                   LEFT JOIN height h ON h.id = upd.heightId
                                   LEFT JOIN addresses addr ON addr.id = upd.addressId
                                   LEFT JOIN cities cit ON addr.cityId = cit.id
                                   LEFT JOIN districts ds ON addr.districtId = ds.id
                                   LEFT JOIN state st ON addr.stateId = st.id
                                   LEFT JOIN countries cou ON addr.countryId = cou.id
                                   LEFT JOIN employmenttype em ON em.id = upd.employmenttypeId
                                   LEFT JOIN userastrologicdetail uatd ON uatd.userId = u.id
                                   LEFT JOIN userpartnerpreferences upp ON upp.userId = u.id
                                   LEFT JOIN addresses cuaddr ON cuaddr.id = upd.currentAddressId
                                   LEFT JOIN weight w ON w.id = upd.weight
                                   LEFT JOIN educationmedium edme ON edme.id = upd.educationMediumId
                                   LEFT JOIN educationtype edt ON edt.id = upd.educationTypeId
                                   WHERE ur.roleId = 2 AND u.id = ` +
                        req.body.id +
                        ``;
                    let responseResult = yield apiHeader_1.default.query(sql);
                    console.log(sql);
                    if (responseResult && responseResult.length > 0) {
                        responseResult[0].isVerified = false;
                        let isVerified = true;
                        let documentsSql = `SELECT ud.*, dt.name as documentTypeName FROM userdocument ud INNER JOIN documenttype dt ON dt.id = ud.documentTypeId WHERE userId = ` + responseResult[0].id;
                        let documentsResult = yield apiHeader_1.default.query(documentsSql);
                        responseResult[0].userDocuments = documentsResult;
                        if (documentsResult && documentsResult.length > 0) {
                            for (let j = 0; j < documentsResult.length; j++) {
                                if (documentsResult[j].isRequired && !documentsResult[j].isVerified) {
                                    isVerified = false;
                                }
                            }
                        }
                        else {
                            isVerified = false;
                        }
                        responseResult[0].isVerifiedProfile = isVerified;
                        if (responseResult[0].isVerifyProfilePic) {
                            responseResult[0].isVerifyProfilePic = true;
                        }
                        else {
                            responseResult[0].isVerifyProfilePic = false;
                        }
                        responseResult[0].totalView = 0;
                        responseResult[0].todayView = 0;
                        let totalViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id;
                        let totalViewResult = yield apiHeader_1.default.query(totalViewSql);
                        if (totalViewResult && totalViewResult.length > 0) {
                            responseResult[0].totalView = totalViewResult[0].totalView;
                        }
                        let todayViewSql = `SELECT COUNT(id) as totalView FROM userviewprofilehistories WHERE userId = ` + req.body.id + ` AND DATE(transactionDate) = DATE(CURRENT_TIMESTAMP())`;
                        let todayViewResult = yield apiHeader_1.default.query(todayViewSql);
                        if (todayViewResult && todayViewResult.length > 0) {
                            responseResult[0].todayView = todayViewResult[0].totalView;
                        }
                        let userflagvalues = `SELECT ufv.*, uf.flagName, uf.displayName FROM userflagvalues ufv
                                                    LEFT JOIN userflags uf ON uf.id = ufv.userFlagId
                                                    WHERE ufv.userId = ` + req.body.id;
                        responseResult[0].userFlags = yield apiHeader_1.default.query(userflagvalues);
                        let getUserAuthSql = `SELECT * FROM userauthdata WHERE userId = ` + req.body.id;
                        let getUserAuthResult = yield apiHeader_1.default.query(getUserAuthSql);
                        responseResult[0].isOAuth = getUserAuthResult && getUserAuthResult.length > 0 ? true : false;
                        responseResult[0].isAppleLogin = getUserAuthResult && getUserAuthResult.length > 0 && getUserAuthResult[0].authProviderId == 3 ? true : false;
                        responseResult[0].userWalletAmount = 0;
                        let getUserWalletSql = `SELECT * FROM userwallets WHERE userId = ` + responseResult[0].id;
                        let getUserWalletResult = yield apiHeader_1.default.query(getUserWalletSql);
                        if (getUserWalletResult && getUserWalletResult.length > 0) {
                            responseResult[0].userWalletAmount = getUserWalletResult[0].amount;
                        }
                        if (req.body.isSignup && responseResult[0].lastCompletedScreen == 11 && !user[0].isProfileCompleted) {
                            let adminUserSql = `SELECT * FROM users where id IN(select userId from userroles where (roleId = 1 OR roleId = 3)) AND isActive  = true AND isDelete = false`;
                            let adminUserResult = yield apiHeader_1.default.query(adminUserSql);
                            if (adminUserResult && adminUserResult.length > 0) {
                                for (let a = 0; a < adminUserResult.length; a++) {
                                    if (adminUserResult[a].isReceiveMail) {
                                        let resultEmail = yield sendEmail(config_1.default.emailMatrimonyNewUserRegister.fromName + ' <' + config_1.default.emailMatrimonyNewUserRegister.fromEmail + '>', adminUserResult[a].email, config_1.default.emailMatrimonyNewUserRegister.subject, '', config_1.default.emailMatrimonyNewUserRegister.html
                                            .replace("[User's Full Name]", responseResult[0].firstName + ' ' + responseResult[0].lastName)
                                            .replace("[User's Contact No]", responseResult[0].contactNo)
                                            .replace("[User's Email Address]", responseResult[0].email), null, null);
                                        console.log(resultEmail);
                                    }
                                    if (adminUserResult[a].isReceiveNotification) {
                                        let deviceDetailSql = `SELECT * FROM userdevicedetail WHERE userId = ` + adminUserResult[a].id + ` AND fcmToken IS NOT NULL`;
                                        let deviceDetailResult = yield apiHeader_1.default.query(deviceDetailSql);
                                        if (deviceDetailResult && deviceDetailResult.length > 0) {
                                            let title = 'New User Register';
                                            let description = 'New User ' + responseResult[0].firstName + ' ' + responseResult[0].lastName + ' registered in system. Please verify document';
                                            let notificationSql = `INSERT INTO usernotifications(userId, title, message, bodyJson, imageUrl, createdBy, modifiedBy)
                                                                        VALUES(` +
                                                adminUserResult[a].id +
                                                `,'` +
                                                title +
                                                `', '` +
                                                description +
                                                `', null, null, ` +
                                                authorizationResult.currentUser.id +
                                                `, ` +
                                                authorizationResult.currentUser.id +
                                                `)`;
                                            let notificationResult = yield apiHeader_1.default.query(notificationSql);
                                            yield notifications_1.default.sendMultipleNotification([deviceDetailResult[0].fcmToken], null, title, description, '', null, null, 0);
                                            console.log('Send' + deviceDetailResult[0].fcmToken);
                                        }
                                    }
                                }
                            }
                        }
                        let userPackages = `SELECT up.*, p.name as packageName, td.id as timeDurationId, td.value, p.weightage FROM userpackage up
                                                LEFT JOIN package p ON p.id = up.packageId
                                                LEFT JOIN packageduration pd ON pd.id = up.packageDurationId
                                                LEFT JOIN timeduration td ON td.id = pd.timeDurationId
                                                WHERE up.userId = ` +
                            responseResult[0].id +
                            ` AND DATE(up.startDate) <= DATE(CURRENT_TIMESTAMP()) AND DATE(up.endDate) >= DATE(CURRENT_TIMESTAMP())
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
                        responseResult[0].userPackage = userPackage[0];
                        let _customFieldDataResult = yield customFields_1.default.getCustomFieldData(req.body.id);
                        if (_customFieldDataResult && _customFieldDataResult.length > 0) {
                            // console.log(_customFieldDataResult);
                            responseResult[0].customFields = _customFieldDataResult;
                        }
                        for (let i = 0; i < responseResult.length; i++) {
                            let userDetailResponse = yield customFields_1.default.getUserData(responseResult[i]);
                            responseResult[i] = Object.assign(Object.assign({}, responseResult[i]), userDetailResponse);
                        }
                        // let userDetailResponse: any = await controller.getUserResponse(responseResult[0].permanentAddress, responseResult[0].currentAddress, responseResult[0].familyDetail, responseResult[0].fatherDetails, responseResult[0].motherDetails,
                        //     responseResult[0].pCountryLivingInId, responseResult[0].pCityLivingInId, responseResult[0].pReligionId, responseResult[0].pCommunityId, responseResult[0].pStateLivingInId, responseResult[0].pEducationMediumId, responseResult[0].pOccupationId,
                        //     responseResult[0].pEmploymentTypeId, responseResult[0].pMaritalStatusId, responseResult[0].pAnnualIncomeId, responseResult[0].pDietId, responseResult[0].pEducationTypeId, responseResult[0].pComplexion, responseResult[0].pBodyType);
                        // console.log(userDetailResponse);
                        // responseResult[0] = { ...responseResult[0], ...userDetailResponse };
                        // responseResult[0].permanentAddress = userDetailResponse.permanentAddress
                        // responseResult[0].currentAddress = userDetailResponse.currentAddress
                        // responseResult[0].familyDetail = userDetailResponse.familyDetail
                        // responseResult[0].fatherDetails = userDetailResponse.fatherDetails
                        // responseResult[0].motherDetails = userDetailResponse.motherDetails
                        // responseResult[0].pCountryLivingInId = userDetailResponse.pCountryLivingInId
                        // responseResult[0].pCityLivingInId = userDetailResponse.pCityLivingInId
                        // responseResult[0].pReligionId = userDetailResponse.pReligionId;
                        // responseResult[0].pCommunityId = userDetailResponse.pCommunityId;
                        // responseResult[0].pStateLivingInId = userDetailResponse.pStateLivingInId;
                        // responseResult[0].pEducationMediumId = userDetailResponse.pEducationMediumId;
                        // responseResult[0].pEducationTypeId = userDetailResponse.pEducationTypeId;
                        // responseResult[0].pOccupationId = userDetailResponse.pOccupationId;
                        // responseResult[0].pEmploymentTypeId = userDetailResponse.pEmploymentTypeId;
                        // responseResult[0].pAnnualIncomeId = userDetailResponse.pAnnualIncomeId;
                        // responseResult[0].pDietId = userDetailResponse.pDietId;
                        // responseResult[0].pMaritalStatusId = userDetailResponse.pMaritalStatusId;
                        // responseResult[0].pCountries = userDetailResponse.pCountries;
                        // responseResult[0].pReligions = userDetailResponse.pReligions;
                        // responseResult[0].pCommunities = userDetailResponse.pCommunities;
                        // responseResult[0].pStates = userDetailResponse.pStates;
                        // responseResult[0].pEducationMedium = userDetailResponse.pEducationMedium;
                        // responseResult[0].pOccupation = userDetailResponse.pOccupation;
                        // responseResult[0].pEmploymentType = userDetailResponse.pEmploymentType;
                        // responseResult[0].pAnnualIncome = userDetailResponse.pAnnualIncome;
                        // responseResult[0].pMaritalStatus = userDetailResponse.pMaritalStatus
                        // responseResult[0].pDiet = userDetailResponse.pDiet
                        // responseResult[0].pComplexion = userDetailResponse.pComplexion
                        // responseResult[0].pBodyType = userDetailResponse.pBodyType
                        // responseResult[0].permanentAddress = responseResult[0].permanentAddress ? JSON.parse(responseResult[0].permanentAddress) : null;
                        // responseResult[0].currentAddress = responseResult[0].currentAddress ? JSON.parse(responseResult[0].currentAddress) : null;
                        // responseResult[0].familyDetail = responseResult[0].familyDetail ? JSON.parse(responseResult[0].familyDetail) : null;
                        // responseResult[0].fatherDetails = responseResult[0].fatherDetails ? JSON.parse(responseResult[0].fatherDetails) : null;
                        // responseResult[0].motherDetails = responseResult[0].motherDetails ? JSON.parse(responseResult[0].motherDetails) : null;
                        // if (responseResult[0].pCountryLivingInId && typeof responseResult[0].pCountryLivingInId === 'string') {
                        //     responseResult[0].pCountryLivingInId = responseResult[0].pCountryLivingInId.includes(',') ? responseResult[0].pCountryLivingInId.split(",").map(Number) : [responseResult[0].pCountryLivingInId];
                        // }
                        // if (responseResult[0].pCityLivingInId && typeof responseResult[0].pCityLivingInId === 'string') {
                        //     responseResult[0].pCityLivingInId = responseResult[0].pCityLivingInId.includes(',') ? responseResult[0].pCityLivingInId.split(",").map(Number) : [responseResult[0].pCityLivingInId];
                        // }
                        // if (responseResult[0].pReligionId && typeof responseResult[0].pReligionId === 'string') {
                        //     responseResult[0].pReligionId = responseResult[0].pReligionId.includes(',') ? responseResult[0].pReligionId.split(",").map(Number) : [responseResult[0].pReligionId];
                        // }
                        // if (responseResult[0].pCommunityId && typeof responseResult[0].pCommunityId === 'string') {
                        //     responseResult[0].pCommunityId = result[0].responseResult.includes(',') ? responseResult[0].pCommunityId.split(",").map(Number) : [responseResult[0].pCommunityId];
                        // }
                        // if (responseResult[0].pStateLivingInId && typeof responseResult[0].pStateLivingInId === 'string') {
                        //     responseResult[0].pStateLivingInId = responseResult[0].pStateLivingInId.includes(',') ? responseResult[0].pStateLivingInId.split(",").map(Number) : [responseResult[0].pStateLivingInId];
                        // }
                        // if (responseResult[0].pEducationMediumId && typeof responseResult[0].pEducationMediumId === 'string') {
                        //     responseResult[0].pEducationMediumId = responseResult[0].pEducationMediumId.includes(',') ? responseResult[0].pEducationMediumId.split(",").map(Number) : [responseResult[0].pEducationMediumId];
                        // }
                        // if (responseResult[0].pEducationTypeId && typeof responseResult[0].pEducationTypeId === 'string') {
                        //     responseResult[0].pEducationTypeId = responseResult[0].pEducationTypeId.includes(',') ? responseResult[0].pEducationTypeId.split(",").map(Number) : [responseResult[0].pEducationTypeId];
                        // }
                        // if (responseResult[0].pOccupationId && typeof responseResult[0].pOccupationId === 'string') {
                        //     responseResult[0].pOccupationId = responseResult[0].pOccupationId.includes(',') ? responseResult[0].pOccupationId.split(",").map(Number) : [responseResult[0].pOccupationId];
                        // }
                        // if (responseResult[0].pEmploymentTypeId && typeof responseResult[0].pEmploymentTypeId === 'string') {
                        //     responseResult[0].pEmploymentTypeId = responseResult[0].pEmploymentTypeId.includes(',') ? responseResult[0].pEmploymentTypeId.split(",").map(Number) : [responseResult[0].pEmploymentTypeId];
                        // }
                        // if (responseResult[0].pAnnualIncomeId && typeof responseResult[0].pAnnualIncomeId === 'string') {
                        //     responseResult[0].pAnnualIncomeId = responseResult[0].pAnnualIncomeId.includes(',') ? responseResult[0].pAnnualIncomeId.split(",").map(Number) : [responseResult[0].pAnnualIncomeId];
                        // }
                        // if (responseResult[0].pDietId && typeof result[0].pDietId === 'string') {
                        //     responseResult[0].pDietId = responseResult[0].pDietId.includes(',') ? responseResult[0].pDietId.split(",").map(Number) : [responseResult[0].pDietId];
                        // }
                        // if (responseResult[0].pMaritalStatusId && typeof responseResult[0].pMaritalStatusId === 'string') {
                        //     responseResult[0].pMaritalStatusId = responseResult[0].pMaritalStatusId.includes(',') ? responseResult[0].pMaritalStatusId.split(",").map(Number) : [responseResult[0].pMaritalStatusId];
                        // }
                        // if (responseResult[0].pBodyType && typeof responseResult[0].pBodyType === 'string') {
                        //     responseResult[0].pBodyType = responseResult[0].pBodyType.includes(',') ? responseResult[0].pBodyType.split(",") : [responseResult[0].pBodyType];
                        // }
                        // if (responseResult[0].pComplexion && typeof responseResult[0].pComplexion === 'string') {
                        //     responseResult[0].pComplexion = responseResult[0].pComplexion.includes(',') ?responseResult[0].pComplexion.split(",") : [responseResult[0].pComplexion];
                        // }
                        let status = user[0].isProfileCompleted ? 'Update' : 'Insert';
                        yield apiHeader_1.default.commit();
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, status + 'User Personal Detail', responseResult, 1, ((_d = req.body) === null || _d === void 0 ? void 0 : _d.userId) ? '' : authorizationResult === null || authorizationResult === void 0 ? void 0 : authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, 'users.completeUserProfileV2() Error', new Error('Error While Updating Data'), '');
                        next(errorResult);
                    }
                }
            }
            else {
                yield apiHeader_1.default.rollback();
                let errorResult = new resulterror_1.ResultError(400, true, 'users.completeUserProfileV2() Error', new Error('Error While Updating Data'), '');
                next(errorResult);
            }
        }
        else {
            yield apiHeader_1.default.rollback();
            let errorResult = new resulterror_1.ResultError(401, true, 'Unauthorized request', new Error(authorizationResult.message), '');
            next(errorResult);
        }
        // } else {
        //     await header.rollback();
        //     let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
        //     next(errorResult);
        // }
    }
    catch (error) {
        yield apiHeader_1.default.rollback();
        let errorResult = new resulterror_1.ResultError(500, true, 'users.updateUserProfileDetail() Exception', error, '');
        next(errorResult);
    }
});
exports.default = {
    insertUser,
    login,
    getAllUsers,
    getUserDetailById,
    updateUser,
    validateToken,
    resetPassword,
    activeInactiveUsers,
    forgotPassword,
    verifyforgotPasswordLink,
    blockUser,
    deleteUser,
    updateFCMToken,
    updateEmail,
    updatePassword,
    // , sendAuthenticationCodeToEmail, verifyAuthenticationCode
    updateAuthenticationStatus,
    changeEmail,
    changePassword,
    generateOTP,
    validateOTP,
    resetAuthenticationOTP,
    deleteAllUser,
    checkconfigfileexist,
    deleteUserData,
    completeUserProfileV2
};
