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
// import * as cheerio from 'cheerio';
const cheerio = require('cheerio');
const fs = require('fs');
var Jimp = require("jimp");
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
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let sql = `SELECT * FROM blogs WHERE isDelete = 0 `;
            let countSql = "SELECT COUNT(*) as totalCount  FROM blogs WHERE isDelete = 0";
            if (req.body.name) {
                sql += ` AND (title LIKE '%` + req.body.name + `%' OR tags LIKE '%` + req.body.name + `%')`;
                countSql += ` AND (title LIKE '%` + req.body.name + `%' OR tags LIKE '%` + req.body.name + `%') `;
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
                            ele.tagNames = ele.tags.join(",");
                        }
                    }
                }
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Blogs Successfully', result, countResult[0].totalCount, authorizationResult.token);
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
const insertBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Insert BLog');
        let requiredFields = ['description', 'title', 'tags', 'image'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                yield apiHeader_1.default.beginTransaction();
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let result;
                let apiUrl = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'apiurl'`);
                if (req.body.tags && Array.isArray(req.body.tags)) {
                    const semicolonSeparatedString = req.body.tags.join(';');
                    req.body.tags = semicolonSeparatedString;
                    console.log(req.body.tags);
                }
                req.body.title = req.body.title.replace(/'/g, "\\'");
                let insertSql = `INSERT INTO blogs (title,  authorName, tags, publishDate,createdAt, updatedAt, createdBy, updatedBy) 
                VALUES ('` + req.body.title + `', ` + (req.body.authorName ? `'` + req.body.authorName + `'` : null) + `,'` + req.body.tags + `', ? , CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), ` + userId + `, ` + userId + ` )`;
                result = yield apiHeader_1.default.query(insertSql, [(req.body.publishDate ? new Date(req.body.publishDate) : null)]);
                if (result && result.affectedRows > 0) {
                    let id = result.insertId;
                    let description = req.body.description;
                    let coverImageUrl = '';
                    if (req.body.image != '' || req.body.image != null || req.body.image != undefined) {
                        let path = yield saveBlogImage(req.body.image, id, null, true);
                        coverImageUrl = path;
                    }
                    if (description && description.includes('<img')) {
                        const $ = cheerio.load(description);
                        // $('img').each( async (index, element) => {
                        //     const img = $(element);
                        //     const src = img.attr('src');
                        //     if (src && src.startsWith('data:image/')) {
                        //         let path = await saveBlogImage(src, id, index, false);
                        //         path = path.slice(2)
                        //         let imagePath = apiUrl[0].value + "/" + path
                        //         img.attr('src', imagePath);
                        //     }
                        // });
                        const images = $('img');
                        for (const [index, image] of images.toArray().entries()) {
                            const src = $(image).attr('src');
                            if (src && src.startsWith('data:image/')) {
                                try {
                                    const savedPath = yield saveBlogImage(src, id, index, false); // Call the asynchronous function
                                    const imagePath = apiUrl[0].value + "/" + savedPath.slice(2);
                                    $(image).attr('src', imagePath);
                                }
                                catch (error) {
                                    console.error('Error saving image:', error);
                                    // Handle error gracefully (e.g., set a default image src)
                                }
                            }
                        }
                        let updatedDescription = $.html();
                        description = updatedDescription ? updatedDescription : req.body.description;
                        console.log(description);
                    }
                    description = description.replace(/'/g, "\\'");
                    let updateSql = `UPDATE blogs SET image = '` + coverImageUrl.substring(2) + `' , description = '` + description + `' WHERE id = ` + id + ``;
                    let updateResult = yield apiHeader_1.default.query(updateSql);
                    if (updateResult && updateResult.affectedRows > 0) {
                        yield apiHeader_1.default.commit();
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert Blog Successfully', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, "blog.insertBlog() Error", new Error('Error While Inserting Data'), '');
                        next(errorResult);
                    }
                }
                else {
                    yield apiHeader_1.default.rollback();
                    let errorResult = new resulterror_1.ResultError(400, true, "blog.insertBlog() Error", new Error('Error While Inserting Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'blog.insertBlog() Exception', error, '');
        next(errorResult);
    }
});
const updateBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Update Blog');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                yield apiHeader_1.default.beginTransaction();
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let apiUrl = yield apiHeader_1.default.query(`SELECT value FROM systemflags WHERE name = 'apiurl'`);
                let checkSql = `SELECT * FROM blogs WHERE id =` + req.body.id;
                let checkResult = yield apiHeader_1.default.query(checkSql);
                if (checkResult && checkResult.length > 0) {
                    let coverImageUrl = '';
                    let description = req.body.description;
                    if (req.body.tags && Array.isArray(req.body.tags)) {
                        const semicolonSeparatedString = req.body.tags.join(';');
                        req.body.tags = semicolonSeparatedString;
                        console.log(req.body.tags);
                    }
                    if (req.body.image != '' || req.body.image != null || req.body.image != undefined) {
                        if (req.body.image && req.body.image.indexOf('content') == -1) {
                            let path = yield saveBlogImage(req.body.image, req.body.id, null, true);
                            coverImageUrl = path;
                        }
                        else {
                            coverImageUrl = req.body.image;
                        }
                    }
                    if (description && description.includes('<img')) {
                        const $ = cheerio.load(description);
                        const images = $('img');
                        for (const [index, image] of images.toArray().entries()) {
                            const src = $(image).attr('src');
                            if (src && src.startsWith('data:image/')) {
                                try {
                                    const savedPath = yield saveBlogImage(src, req.body.id, index, false); // Call the asynchronous function
                                    const imagePath = apiUrl[0].value + "/" + savedPath.slice(2);
                                    $(image).attr('src', imagePath);
                                }
                                catch (error) {
                                    console.error('Error saving image:', error);
                                    // Handle error gracefully (e.g., set a default image src)
                                }
                            }
                        }
                        let updatedDescription = $.html();
                        description = updatedDescription ? updatedDescription : req.body.description;
                        console.log(description);
                    }
                    let publishDate = req.body.publishDate;
                    let newDate = new Date(publishDate);
                    console.log(newDate);
                    description = description.replace(/'/g, "\\'");
                    req.body.title = req.body.title.replace(/'/g, "\\'");
                    let sql = `UPDATE blogs SET title = '` + req.body.title + `', authorName = ` + (req.body.authorName ? `'` + req.body.authorName + `'` : null) + `, image ='` + coverImageUrl + `', publishDate = ?, tags = '` + req.body.tags + `', updatedAt = CURRENT_TIMESTAMP(), updatedBy = ` + userId + `, description = '` + description + `'  WHERE id = ` + req.body.id;
                    console.log(description);
                    let result = yield apiHeader_1.default.query(sql, [(req.body.publishDate ? new Date(req.body.publishDate) : null)]);
                    if (result && result.affectedRows > 0) {
                        yield apiHeader_1.default.commit();
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update Blog', result, 1, authorizationResult.token);
                        return res.status(200).send(successResult);
                    }
                    else {
                        yield apiHeader_1.default.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, "blog.updateBlog() Error", new Error('Error While Updating Data'), '');
                        next(errorResult);
                    }
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "blog.updateBlog() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'blog.updateBlog() Exception', error, '');
        next(errorResult);
    }
});
const saveBlogImage = (src, blogId, index, isCover) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        let dir = './content';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        let dir1 = './content/blog';
        if (!fs.existsSync(dir1)) {
            fs.mkdirSync(dir1);
        }
        let dir2 = './content/blog/' + blogId;
        if (!fs.existsSync(dir2)) {
            fs.mkdirSync(dir2);
        }
        const base64Data = src.split(',')[1];
        const mimeType = src.split(';')[0].split(':')[1];
        const extension = mimeType.split('/')[1];
        let filePath = '';
        let imagePath = '';
        if (isCover) {
            // const fileName = `${blogId}-cover.${extension}`;
            filePath = "./content/blog/" + blogId + "/" + blogId + "-coverRealImg.jpeg";
            imagePath = "./content/blog/" + blogId + "/" + blogId + "-coverImg.jpeg";
        }
        else {
            // const fileName = `${blogId}${index}-realImg.${extension}`;
            filePath = "./content/blog/" + blogId + "/" + blogId + index + "-realImage.jpeg";
            imagePath = "./content/blog/" + blogId + "/" + blogId + index + "image.jpeg";
        }
        const imageBuffer = new Buffer(base64Data, 'base64');
        // fs.writeFile(filePath, imageBuffer);
        fs.writeFileSync(filePath, imageBuffer);
        const image = yield Jimp.read(filePath);
        let maxWidth = 800;
        let maxHeight = 600;
        // Calculate dimensions to maintain aspect ratio
        const originalWidth = image.getWidth();
        const originalHeight = image.getHeight();
        let resizedWidth = originalWidth;
        let resizedHeight = originalHeight;
        if (originalWidth > maxWidth || originalHeight > maxHeight) {
            const ratioWidth = maxWidth / originalWidth;
            const ratioHeight = maxHeight / originalHeight;
            const resizeFactor = Math.min(ratioWidth, ratioHeight);
            resizedWidth = Math.floor(originalWidth * resizeFactor);
            resizedHeight = Math.floor(originalHeight * resizeFactor);
        }
        yield image.resize(resizedWidth, resizedHeight).quality(80) // Adjust quality as needed
            .writeAsync(imagePath);
        image.contain(resizedWidth, resizedHeight)
            .quality(60) // Set quality to 100%
            .writeAsync(imagePath);
        result = imagePath;
    }
    catch (err) {
        result = err;
    }
    return result;
});
const activeInactiveBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Active Inactive Blog');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE blogs set isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Change Blog Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "height.activeInactiveBlog() Error", new Error('Error While Change Height Status'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'Height.activeIanctiveHeight() Exception', error, '');
        next(errorResult);
    }
});
const deleteBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Active Inactive Blog');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE blogs set isDelete = 1 WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Delete Blog Successfully', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "height.deleteBlog() Error", new Error('Error While Delete Blog'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'Height.deleteBlog() Exception', error, '');
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
                let sql = `SELECT * FROM blogs WHERE id = ` + req.body.id + ` AND isDelete = 0 `;
                let result = yield apiHeader_1.default.query(sql);
                if (result) {
                    for (const ele of result) {
                        if (ele.tags && typeof ele.tags === 'string') {
                            const valueArray = ele.tags.includes(';') ? ele.tags.split(";") : [ele.tags];
                            ele.tags = valueArray;
                            ele.tagNames = ele.tags.join(",");
                        }
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Blog Detail Successfully', result, 1, authorizationResult.token);
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
exports.default = { getBlogs, insertBlog, activeInactiveBlog, deleteBlog, updateBlog, getBlogDetail };
