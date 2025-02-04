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
// const sharp = require('sharp');
var Jimp = require("jimp");
// let connection = mysql.createConnection({
//     host: config.mysql.host,
//     user: config.mysql.user,
//     password: config.mysql.password,
//     database: config.mysql.database
// });
// const query = util.promisify(connection.query).bind(connection);
const NAMESPACE = 'Success Stories';
const getPartnerList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Partner List');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let sql = `SELECT sstory.*, CONCAT(u.firstName,' ',u.lastName) as userName, CONCAT(partner.firstName,' ',partner.lastName) as partnerName , img.imageUrl FROM successstories sstory
            LEFT JOIN users u ON u.id = sstory.userId
            LEFT JOIN users partner ON partner.id = sstory.partnerUserId
            LEFT JOIN images img ON img.id = sstory.imageId
            WHERE sstory.isDelete = 0 AND sstory.isActive = 1`;
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Partner List', result, result.length, authorizationResult.token);
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(400, true, "successStories.getPartnerList() Error", new Error('Error While Getting Data'), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'successStories.getPartnerList() Exception', error, '');
        next(errorResult);
    }
});
const getSuccessStories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Success Stories');
        // let authorizationResult = await header.validateAuthorization(req, res, next);
        // if (authorizationResult.statusCode == 200) {
        let sql = `SELECT s.*, img.imageUrl, u.firstName as userFName, u.lastName as userLName, u.gender as userGender, u.email as userEmail, img1.imageUrl as userImage
            , addr.cityName as userCity, u1.firstName as partnerFName, u1.lastName as partnerLName, u1.gender as partnerGender, u1.email as partnerEmail, img2.imageUrl as partnerImage
            , addr1.cityName as partnerCity FROM successstories s
                        LEFT JOIN images img ON img.id = s.imageId
                        LEFT JOIN users u ON u.id = s.userId
                        LEFT JOIN users u1 ON u1.id = s.partnerUserId 
                        LEFT JOIN images img1 ON img1.id = u.imageId
                        LEFT JOIN images img2 ON img2.id = u1.imageId
                        LEFT JOIN userpersonaldetail upd ON upd.userId = s.userId
                        LEFT JOIN addresses addr ON addr.id = upd.addressId
                        LEFT JOIN userpersonaldetail upd1 ON upd1.userId = s.partnerUserId
                        LEFT JOIN addresses addr1 ON addr1.id = upd1.addressId WHERE s.isActive = 1 AND s.requestStatus = 'accepted' ORDER BY s.createdDate DESC`;
        if (req.body.searchId) {
            if (!sql.includes(` WHERE `)) {
                sql += ` WHERE `;
            }
            else {
                sql += ` AND `;
            }
            sql += ` s.userId = ` + req.body.searchId + ` OR s.parentId = ` + req.body.searchId + ` `;
        }
        if (req.body.dateTo && req.body.dateFrom) {
            let toDate = new Date(req.body.dateTo).getFullYear() + "-" + ("0" + (new Date(req.body.dateTo).getMonth() + 1)).slice(-2) + "-" + ("0" + new Date(req.body.dateTo).getDate()).slice(-2);
            let fromDate = new Date(req.body.dateFrom).getFullYear() + "-" + ("0" + (new Date(req.body.dateFrom).getMonth() + 1)).slice(-2) + "-" + ("0" + new Date(req.body.dateFrom).getDate()).slice(-2);
            if (!sql.includes("WHERE")) {
                sql += ` WHERE `;
            }
            else {
                sql += ` AND `;
            }
            sql += ` DATE(s.createdDate) >= DATE('` + fromDate + `') AND DATE(s.createdDate) <= DATE('` + toDate + `') `;
        }
        let result = yield apiHeader_1.default.query(sql);
        if (result) {
            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Success Stories Successfully', result, result.length, '');
            return res.status(200).send(successResult);
        }
        else {
            let errorResult = new resulterror_1.ResultError(400, true, "successStories.getSuccessStories() Error", new Error('Error While Getting Data'), '');
            next(errorResult);
        }
        // } else {
        //     let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
        //     next(errorResult);
        // }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'successStories.getSuccessStories() Exception', error, '');
        next(errorResult);
    }
});
const insertSuccessStories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Proposals');
        let requiredFields = ['partnerUserId', 'maritalStatus', 'maritalStatusId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let imageId;
                let date = req.body.transactionDate ? new Date(req.body.transactionDate) : '';
                req.body.transactionDate = new Date(date).getFullYear().toString() + '-' + ("0" + (new Date(date).getMonth() + 1)).slice(-2) + '-' + ("0" + new Date(date).getDate()).slice(-2) + ' ' + ("0" + (new Date(date).getHours())).slice(-2) + ':' + ("0" + (new Date(date).getMinutes())).slice(-2) + ':' + ("0" + (new Date(date).getSeconds())).slice(-2);
                let sql = `INSERT INTO successstories (userId, partnerUserId, maritalStatus, transactionDate, createdby, modifiedBy, requestStatus) vALUES (` + req.body.userId + `,` + req.body.partnerUserId + `,'` + req.body.maritalStatus + `', '` + req.body.transactionDate + `' ,` + userId + `, ` + userId + `, ` + `"pending"` + `)`;
                result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successstoriesId = result.insertId;
                    if (req.body.image && req.body.image.indexOf('content') == -1) {
                        let sql = `INSERT INTO images(createdBy, modifiedBy) VALUES (` + req.body.userId + `,` + req.body.userId + `)`;
                        result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            imageId = result.insertId;
                            let image = req.body.image;
                            let data = image.split(',');
                            if (data && data.length > 1) {
                                image = image.split(',')[1];
                            }
                            let dir = './content';
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
                            let dir1 = './content/user';
                            if (!fs.existsSync(dir1)) {
                                fs.mkdirSync(dir1);
                            }
                            let dir2 = './content/user/' + req.body.userId;
                            if (!fs.existsSync(dir2)) {
                                fs.mkdirSync(dir2);
                            }
                            const fileContentsUser = new Buffer(image, 'base64');
                            let imgPath = "./content/user/" + req.body.userId + "/" + imageId + "-realImg.jpeg";
                            fs.writeFileSync(imgPath, fileContentsUser, (err) => {
                                if (err)
                                    return console.error(err);
                                console.log('file saved imagePath');
                            });
                            let imagePath = "./content/user/" + req.body.userId + "/" + imageId + ".jpeg";
                            // sharp(imgPath).resize({
                            //     height: 100,
                            //     width: 100
                            // }).toFile(imagePath)
                            //     .then(function (newFileInfo: any) {
                            //         console.log(newFileInfo);
                            //     });
                            yield Jimp.read(imgPath)
                                .then((lenna) => __awaiter(void 0, void 0, void 0, function* () {
                                // return lenna
                                //     .resize(100, 100) // resize
                                //     // .quality(60) // set JPEG quality
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
                                const y = (image_act.getHeight() - (watermark.getHeight() * 2));
                                image_act.composite(watermark, x, y, {
                                    mode: Jimp.BLEND_SOURCE_OVER,
                                    opacitySource: 0.5, // Adjust the opacity of the watermark
                                });
                                //imagePath = "./content/notification/" + notificationId + ".jpeg";
                                yield image_act.writeAsync(imagePath);
                                return data;
                            }))
                                .catch((err) => {
                                console.error(err);
                            });
                            let updateimagePathSql = `UPDATE images SET imageUrl='` + imagePath.substring(2) + `' WHERE id=` + imageId;
                            let updateimagePathResult = yield apiHeader_1.default.query(updateimagePathSql);
                            if (updateimagePathResult && updateimagePathResult.affectedRows > 0) {
                                let addUserImageId = `UPDATE successstories SET imageId = ` + imageId + ` WHERE id = ` + successstoriesId;
                                result = yield apiHeader_1.default.query(addUserImageId);
                                if (result && result.affectedRows > 0) {
                                    let updatePersonalDetailResult = `UPDATE userpersonaldetail SET maritalStatusId = ${req.body.maritalStatusId} WHERE userId = ${req.body.userId}`;
                                    yield apiHeader_1.default.query(updatePersonalDetailResult);
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert Success Stories Successfully', result, result.length, authorizationResult.token);
                                    return res.status(200).send(successResult);
                                }
                                else {
                                    let errorResult = new resulterror_1.ResultError(400, true, "successStories.insertSuccessStories() Error", new Error('Error While Updating Profile Pic'), '');
                                    next(errorResult);
                                }
                            }
                            else {
                                let errorResult = new resulterror_1.ResultError(400, true, "successStories.insertSuccessStories() Error", new Error('Error While Updating Profile Pic'), '');
                                next(errorResult);
                            }
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "successStories.insertSuccessStories() Error", new Error('Error While Updating Profile Pic'), '');
                            next(errorResult);
                        }
                    }
                    else {
                        let updatePersonalDetailResult = `UPDATE userpersonaldetail SET maritalStatusId = ${req.body.maritalStatusId} WHERE userId = ${req.body.userId}`;
                        yield apiHeader_1.default.query(updatePersonalDetailResult);
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert Success Stories Successfully', result, result.length, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "successStories.insertSuccessStories() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'successStories.insertSuccessStories() Exception', error, '');
        next(errorResult);
    }
});
const updateSuccessStory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Update Success Story');
        let requiredFields = ['successStoryId', 'requestStatus', 'loginUserId', 'partnerUserId'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let requestStatus = req.body.requestStatus;
                let loginUserId = req.body.loginUserId;
                let partnerUserId = req.body.partnerUserId;
                let sql = `UPDATE successstories SET requestStatus = "${requestStatus}" WHERE id = ${req.body.successStoryId} AND requestStatus = "pending"`;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    //update both user gender in user table  if status is accepted
                    if (requestStatus == 'accepted') {
                        let getmaritalStatusIdResult = `SELECT maritalStatusId FROM userpersonaldetail WHERE userId = ${partnerUserId}`;
                        let tempResult = yield apiHeader_1.default.query(getmaritalStatusIdResult);
                        if (tempResult) {
                            const tempMaritalStatusId = tempResult[0].maritalStatusId;
                            let updatePersonalDetailResult = `UPDATE userpersonaldetail SET maritalStatusId = ${tempMaritalStatusId} WHERE userId In (${loginUserId}, ${partnerUserId})`;
                            yield apiHeader_1.default.query(updatePersonalDetailResult);
                        }
                    }
                    // Send notification to both users using the notification service
                    let getUserDeviceDetails = `SELECT fcmToken FROM userdevicedetail WHERE userId In (${loginUserId}, ${partnerUserId});`;
                    let tokenResult = yield apiHeader_1.default.query(getUserDeviceDetails);
                    let fcmTokens = tokenResult.map((row) => row.fcmToken);
                    yield notifications_1.default.sendMultipleNotification(fcmTokens, // List of FCM tokens
                    loginUserId, // Sender's ID (or the ID triggering the notification)
                    `Success Story Request has been ${requestStatus}`, // Notification title
                    `Partner has ${requestStatus} Your Requst`, // Notification message
                    '', // Image URL (optional)
                    null, // Additional data (optional)
                    null, // Priority (optional)
                    "share success story" // Notification type (e.g., proposal update)
                    );
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update Success Story', result, result.length, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "successStories.updateSuccessStory() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'successStories.updateSuccessStory() Exception', error, '');
        next(errorResult);
    }
});
const getPendingSuccessStories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Pending Success Stories');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let currentUser = authorizationResult.currentUser;
            let userId = currentUser.id;
            let sql = `SELECT s.*, img.imageUrl, u.firstName as userFName, u.lastName as userLName, u.gender as userGender, u.email as userEmail, img1.imageUrl as userImage
                , addr.cityName as userCity, u1.firstName as partnerFName, u1.lastName as partnerLName, u1.gender as partnerGender, u1.email as partnerEmail, img2.imageUrl as partnerImage
                , addr1.cityName as partnerCity FROM successstories s
                            LEFT JOIN images img ON img.id = s.imageId
                            LEFT JOIN users u ON u.id = s.userId
                            LEFT JOIN users u1 ON u1.id = s.partnerUserId 
                            LEFT JOIN images img1 ON img1.id = u.imageId
                            LEFT JOIN images img2 ON img2.id = u1.imageId
                            LEFT JOIN userpersonaldetail upd ON upd.userId = s.userId
                            LEFT JOIN addresses addr ON addr.id = upd.addressId
                            LEFT JOIN userpersonaldetail upd1 ON upd1.userId = s.partnerUserId
                            LEFT JOIN addresses addr1 ON addr1.id = upd1.addressId WHERE s.isActive = 1 AND s.requestStatus = 'pending' AND (s.userId = ${userId} OR s.partnerUserId = ${userId}) ORDER BY s.createdDate DESC limit 1`;
            if (req.body.searchId) {
                if (!sql.includes(` WHERE `)) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                sql += ` s.userId = ` + req.body.searchId + ` OR s.parentId = ` + req.body.searchId + ` `;
            }
            if (req.body.dateTo && req.body.dateFrom) {
                let toDate = new Date(req.body.dateTo).getFullYear() + "-" + ("0" + (new Date(req.body.dateTo).getMonth() + 1)).slice(-2) + "-" + ("0" + new Date(req.body.dateTo).getDate()).slice(-2);
                let fromDate = new Date(req.body.dateFrom).getFullYear() + "-" + ("0" + (new Date(req.body.dateFrom).getMonth() + 1)).slice(-2) + "-" + ("0" + new Date(req.body.dateFrom).getDate()).slice(-2);
                if (!sql.includes("WHERE")) {
                    sql += ` WHERE `;
                }
                else {
                    sql += ` AND `;
                }
                sql += ` DATE(s.createdDate) >= DATE('` + fromDate + `') AND DATE(s.createdDate) <= DATE('` + toDate + `') `;
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Success Stories Successfully', result, result.length, '');
                return res.status(200).send(successResult);
            }
            else {
                let errorResult = new resulterror_1.ResultError(400, true, "successStories.getSuccessStories() Error", new Error('Error While Getting Data'), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'successStories.getPendingSuccessStories() Exception', error, '');
        next(errorResult);
    }
});
const checkUserCanUploadSuccessStory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Checking if user can upload success story');
        // Validate authorization
        const authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode === 200) {
            const currentUser = authorizationResult.currentUser;
            const userId = currentUser.id;
            // Query to check if the user has any success story record
            const sql = `SELECT s.requestStatus FROM successstories s 
                        WHERE s.userId = "${userId}" OR s.partnerUserId = "${userId}" ORDER BY createdDate DESC LIMIT 1`;
            let result = yield apiHeader_1.default.query(sql);
            if (result.length > 0) {
                const status = result[0].requestStatus;
                // If status is 'pending' or 'accepted', user cannot add a new success story
                if (status === 'pending' || status === 'accepted') {
                    let errorResult = new resulterror_1.ResultError(400, true, "successStories.checkUserCanUploadSuccessStory() Error", new Error('User already has a success story that is pending or accepted. Cannot upload another'), '');
                    next(errorResult);
                    return res.status(400).send(errorResult);
                }
                // If status is 'rejected', user can add a new success story
                if (status === 'rejected') {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'User can upload a new success story', result, result.length, '');
                    return res.status(200).send(successResult);
                }
            }
            else {
                // If no record found, user can add a new success story
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'User can upload a new success story', result, result.length, '');
                return res.status(200).send(successResult);
            }
        }
        else {
            // Unauthorized request
            let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        logging_1.default.error(NAMESPACE, error.message, error);
        let errorResult = new resulterror_1.ResultError(500, true, 'successStories.updateSuccessStory() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getPartnerList, getSuccessStories, insertSuccessStories, updateSuccessStory, getPendingSuccessStories, checkUserCanUploadSuccessStory };
