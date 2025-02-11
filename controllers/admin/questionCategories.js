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
const NAMESPACE = 'Question';
const getQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Question');
        let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
        if (authorizationResult.statusCode == 200) {
            let startIndex = req.body.startIndex ? req.body.startIndex : (req.body.startIndex === 0 ? 0 : null);
            let fetchRecord = req.body.fetchRecord ? req.body.fetchRecord : null;
            let startIndexCategories = req.body.startIndexCategories ? req.body.startIndexCategories : (req.body.startIndexCategories === 0 ? 0 : null);
            let fetchRecordCategories = req.body.fetchRecordCategories ? req.body.fetchRecordCategories : null;
            let countSql = `SELECT COUNT(*) as totalCount FROM questioncategories WHERE isDelete = 0`;
            let countResult = yield apiHeader_1.default.query(countSql);
            let sql = `SELECT * FROM questioncategories WHERE isDelete = 0 ORDER BY id DESC`;
            if (startIndexCategories != null && fetchRecordCategories != null) {
                sql += " LIMIT " + fetchRecordCategories + " OFFSET " + startIndexCategories + " ";
            }
            let result = yield apiHeader_1.default.query(sql);
            if (result) {
                if (result && result.length) {
                    for (let i = 0; i < result.length; i++) {
                        countSql = `SELECT COUNT(*) as Count from questions q 
                        left join questioncategories qc on qc.id = q.questionCategoriesId
                        where q.questionCategoriesId = ` + result[i].id + ` AND q.isDelete = 0 `;
                        let count = yield apiHeader_1.default.query(countSql);
                        result[i].questionCount = count[0].Count;
                        sql = `SELECT q.* from questions q 
                        left join questioncategories qc on qc.id = q.questionCategoriesId
                        where q.questionCategoriesId = ` + result[i].id + ` AND q.isDelete = 0 ORDER BY id DESC`;
                        if (startIndex != null && fetchRecord != null) {
                            sql += " LIMIT " + fetchRecord + " OFFSET " + startIndex + " ";
                        }
                        result[i].question = yield apiHeader_1.default.query(sql);
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'get question successfully', result, countResult[0].totalCount, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data not Available'), '');
                next(errorResult);
            }
        }
        else {
            let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'question.getQuestion() Exception', error, '');
        next(errorResult);
    }
});
// const getFaqs = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Getting FAQs');
//         var requiredFields = ['faqCategoryId'];
//         var validationResult = header.validateRequiredFields(req, requiredFields);
//         if (validationResult && validationResult.statusCode == 200) {
//             let authorizationResult = await header.validateAuthorization(req, res, next);
//             if (authorizationResult.statusCode == 200) {
//                 let currentUser = authorizationResult.currentUser;
//                 let startIndex = req.body.startIndex ? req.body.startIndex : 0;
//                 let fetchRecord = req.body.fetchRecords ? req.body.fetchRecords : 0;
//                 let faqCategoryId = req.body.faqCategoryId;
//                 let sql = `CALL adminGetFaqs(` + faqCategoryId + `,` + startIndex + `,` + fetchRecord + `);`;
//                 var result = await query(sql);
//                 if (result && result.length > 0) {
//                     if (result[0] && result[0][0].totalCount > 0) {
//                         let successResult = new ResultSuccess(200, true, 'Getting FAQs Successfully', result[1], result[0][0].totalCount);
//                         return res.status(200).send(successResult);
//                     } else if (result[1]) {
//                         let successResult = new ResultSuccess(200, true, 'Getting FAQs Successfully', [], result[0][0].totalCount);
//                         return res.status(200).send(successResult);
//                     }
//                     else {
//                         let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
//                         next(errorResult);
//                     }
//                 } else {
//                     let errorResult = new ResultError(400, true, "faqs.getFaqs() Error", result, '');
//                     next(errorResult);
//                 }
//             } else {
//                 let errorResult = new ResultError(401, true, "Unauthorized request", authorizationResult, '');
//                 next(errorResult);
//             }
//         } else {
//             let errorResult = new ResultError(validationResult.statusCode, true, validationResult.message, new Error(validationResult.message), '');
//             next(errorResult);
//         }
//     } catch (error) {
//         let errorResult = new ResultError(500, true, 'faqs.getFaqs() Exception', error, '');
//         next(errorResult);
//     }
// };
const insertUpdateQuestionCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Question Categories');
        let requiredFields = ['name'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let checkSql = `SELECT * FROM questioncategories WHERE name = '` + req.body.name + `'`;
                if (req.body.id) {
                    checkSql += ' AND id != ' + req.body.id;
                }
                let checkResult = yield apiHeader_1.default.query(checkSql);
                if (checkResult && checkResult.length > 0) {
                    let errorResult = new resulterror_1.ResultError(400, true, "", new Error("Question Categories Already Exist"), '');
                    next(errorResult);
                }
                else {
                    if (req.body.id) {
                        // let sql = `UPDATE questioncategories SET name = ` + req.body.name + ` WHERE id = ` + req.body.id;
                        let sql = `UPDATE questioncategories SET name = '` + req.body.name + `' where id = ` + req.body.id + ``;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update QuestionCategories', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "question.insertUpdateQuestionCategories() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    }
                    else {
                        let sql = `INSERT INTO questioncategories (name, createdBy, modifiedBy) 
                                   VALUES ('` + req.body.name + `',` + userId + `,` + userId + ` )`;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert QuestionCategories', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "question.insertUpdateQuestionCategories() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'question.insertUpdateQuestionCategories() Exception', error, '');
        next(errorResult);
    }
});
const activeInactiveQuestionCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Change Question Status');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE questioncategories SET isActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let categorySql = `SELECT * FROM questioncategories WHERE id = ` + req.body.id + ``;
                    let categoryResult = yield apiHeader_1.default.query(categorySql);
                    console.log(categoryResult[0].isActive);
                    // let isActive = categoryResult[0].isActive 
                    let checkSql = `SELECT * FROM questions WHERE questionCategoriesId = ` + req.body.id;
                    let checkResult = yield apiHeader_1.default.query(checkSql);
                    if (checkResult && checkResult.length) {
                        sql = `UPDATE questions SET isActive = ` + categoryResult[0].isActive + ` WHERE questionCategoriesId = ` + req.body.id + ``;
                        result = yield apiHeader_1.default.query(sql);
                        // let successResult = new ResultSuccess(200, true, 'Change Question Status', result, 1, authorizationResult.token);
                        // return res.status(200).send(successResult);
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Change Question Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "question.activeInactiveQuestion() Error", new Error('Error While Change question Status'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'question.activeInactiveQuestion() Exception', error, '');
        next(errorResult);
    }
});
const deleteQuestionCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Change Question Status');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE questioncategories SET isDelete = !isDelete WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let categorySql = `SELECT * FROM questioncategories WHERE id = ` + req.body.id + ``;
                    let categoryResult = yield apiHeader_1.default.query(categorySql);
                    let checkSql = `SELECT * FROM questions WHERE questionCategoriesId = ` + req.body.id;
                    let checkResult = yield apiHeader_1.default.query(checkSql);
                    if (checkResult && checkResult.length) {
                        sql = `UPDATE questions SET isDelete = ` + categoryResult[0].isDelete + ` WHERE questionCategoriesId = ` + req.body.id + ``;
                        result = yield apiHeader_1.default.query(sql);
                    }
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Change Question Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "question.activeInactiveQuestion() Error", new Error('Error While Change question Status'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'question.activeInactiveQuestion() Exception', error, '');
        next(errorResult);
    }
});
const insertUpdateQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Inserting Question');
        let requiredFields = ['question', 'answer'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let currentUser = authorizationResult.currentUser;
                let userId = currentUser.id;
                let checkSql = `SELECT * FROM questions WHERE question = '` + req.body.question + `'`;
                if (req.body.id) {
                    checkSql += ' AND id != ' + req.body.id;
                }
                let checkResult = yield apiHeader_1.default.query(checkSql);
                if (checkResult && checkResult.length > 0) {
                    let errorResult = new resulterror_1.ResultError(400, true, "", new Error("Question Already Exist"), '');
                    next(errorResult);
                }
                else {
                    if (req.body.id) {
                        let sql = `UPDATE questions SET question = '` + req.body.question + `', answer = '` + req.body.answer + `' WHERE id = ` + req.body.id + ``;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Update Question', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "question.insertUpdateQuestion() Error", new Error('Error While Updating Data'), '');
                            next(errorResult);
                        }
                    }
                    else {
                        let sql = `INSERT INTO questions (questionCategoriesId,question,answer,createdBy,modifiedBy) 
                                   VALUES (` + req.body.categoriesId + `,'` + req.body.question + `','` + req.body.answer + `',` + userId + `,` + userId + `)`;
                        let result = yield apiHeader_1.default.query(sql);
                        if (result && result.affectedRows > 0) {
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Insert Question', result, 1, authorizationResult.token);
                            return res.status(200).send(successResult);
                        }
                        else {
                            let errorResult = new resulterror_1.ResultError(400, true, "question.insertUpdateQuestion() Error", new Error('Error While Updating Data'), '');
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
        let errorResult = new resulterror_1.ResultError(500, true, 'question.insertUpdateQuestion() Exception', error, '');
        next(errorResult);
    }
});
const activeInactiveQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Change Question Status');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE questions set IsActive = !isActive WHERE id = ` + req.body.id + ``;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Change Question Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "question.activeInactiveQuestion() Error", new Error('Error While Change question Status'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'question.activeInactiveQuestion() Exception', error, '');
        next(errorResult);
    }
});
const deleteQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Change Question Status');
        let requiredFields = ['id'];
        let validationResult = apiHeader_1.default.validateRequiredFields(req, requiredFields);
        if (validationResult && validationResult.statusCode == 200) {
            let authorizationResult = yield apiHeader_1.default.validateAuthorization(req, res, next);
            if (authorizationResult.statusCode == 200) {
                let sql = `UPDATE questions SET isDelete = !isDelete WHERE id = ` + req.body.id + ``;
                ;
                let result = yield apiHeader_1.default.query(sql);
                if (result && result.affectedRows > 0) {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Change Question Status', result, 1, authorizationResult.token);
                    return res.status(200).send(successResult);
                }
                else {
                    let errorResult = new resulterror_1.ResultError(400, true, "question.activeInactiveQuestion() Error", new Error('Error While Change question Status'), '');
                    next(errorResult);
                }
            }
            else {
                let errorResult = new resulterror_1.ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
                next(errorResult);
            }
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'question.activeInactiveQuestion() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getQuestion, insertUpdateQuestionCategories, activeInactiveQuestionCategories, deleteQuestionCategories, insertUpdateQuestion, activeInactiveQuestion, deleteQuestion };
// const insertQuestion = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Inserting Question');
//         let requiredFields = ['question', 'answer'];
//         let validationResult = header.validateRequiredFields(req, requiredFields);
//         if (validationResult && validationResult.statusCode == 200) {
//             let authorizationResult = await header.validateAuthorization(req, res, next);
//             if (authorizationResult.statusCode == 200) {
//                 let currentUser = authorizationResult.currentUser;
//                 let userId = currentUser.id;
//                 let sql = `INSERT INTO questioncategories (name,parentId, createdBy, modifiedBy) 
//                 VALUES ('` + req.body.name + `','',` + userId + `,` + userId + ` )`
//                 let result = await query(sql);
//                 if (result && result.affectedRows > 0) {
//                     let qCategoriesId = result.insertedId
//                     if (req.body.question && req.body.question.length && req.body.answer && req.body.answer.length) {
//                         sql = `INSERT INTO questions (questionCategoriesId,question,answer,createdBy,modifiedBy) 
//                         VALUES (` + qCategoriesId + `'` + req.body.question + `','` + req.body.answer + `',` + userId + `,` + userId + `)
//                         WHERE questionCategoriesId = ` + qCategoriesId 
//                         result = await query(sql)
//                     }
//                     let successResult = new ResultSuccess(200, true, 'Insert Question', result, 1, authorizationResult.token);
//                     return res.status(200).send(successResult);
//                 }
//                 let errorResult = new ResultError(400, true, "question.insertQuestion() Error", new Error('Error While Inserting Data'), '');
//                 next(errorResult);
//             }
//             let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
//             next(errorResult);
//         }
//     } catch (error: any) {
//         let errorResult = new ResultError(500, true, 'question.insertQuestion() Exception', error, '');
//         next(errorResult);
//     }
// }
// const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Updating Question');
//         let requiredFields = ['id', 'question', 'answer', 'name'];
//         let validationResult = header.validateRequiredFields(req, requiredFields);
//         if (validationResult && validationResult.statusCode == 200) {
//             let authorizationResult = await header.validateAuthorization(req, res, next);
//             if (authorizationResult.statusCode == 200) {
//                 let currentUser = authorizationResult.currentUser;
//                 let userId = currentUser.id;
//                 let sql = `UPDATE questioncategories SET name = ` + req.body.name + ` WHERE id = ` + req.body.id;
//                 let result = await query(sql);
//                 if (result && result.affectedRows > 0) {
//                     let question = await query(`SELECT * FROM  questions WHERE questionCategoriesId =` + req.body.id)
//                     // if(question && question.len)
//                     if (req.body.question && req.body.question.length && req.body.answer && req.body.answer.length) {
//                         sql = `UPDATE questions SET question = '` + req.body.question + `',answer = '` + req.body.answer + `' where id = ` + userId + ``;
//                         result = await query(sql)
//                     }
//                     let successResult = new ResultSuccess(200, true, 'Update Question', result, 1, authorizationResult.token);
//                     return res.status(200).send(successResult);
//                 }
//                 let errorResult = new ResultError(400, true, "question.updateQuestion() Error", new Error('Error While Inserting Data'), '');
//                 next(errorResult);
//             }
//             let errorResult = new ResultError(401, true, "Unauthorized request", new Error(authorizationResult.message), '');
//             next(errorResult);
//         }
//     } catch (error: any) {
//         let errorResult = new ResultError(500, true, 'question.updateQuestion() Exception', error, '');
//         next(errorResult);
//     }
// }
// const insertUpdateQuestion = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Inserting Question');
//         let requiredFields = ['question', 'answer'];
//         let validationResult = header.validateRequiredFields(req, requiredFields);
//         if (validationResult && validationResult.statusCode == 200) {
//             let authorizationResult = await header.validateAuthorization(req, res, next);
//             if (authorizationResult.statusCode == 200) {
//                 let currentUser = authorizationResult.currentUser;
//                 let userId = currentUser.id;
//                 let checkSql = `SELECT * FROM questions WHERE question = '` + req.body.question + `'`;
//                 if (req.body.question) {
//                     checkSql += 'AND id !=' + req.body.id;
//                 }
//                 let checkResult = await query(checkSql);
//                 if (checkResult && checkResult.length > 0) {
//                     let errorResult = new ResultError(400, true, "", new Error("Question Already Exist"), '');
//                     next(errorResult);
//                 } else {
//                     if (req.body.id) {
//                         let sql = `UPDATE questions SET question = '` + req.body.question + `',answer = '` + req.body.answer + `' where id = ` + req.body.id + ``;
//                         let result = await query(sql)
//                         if (result && result.affectedRows > 0) {
//                             let successResult = new ResultSuccess(200, true, 'Update Question', result, 1, authorizationResult.token);
//                             return res.status(200).send(successResult);
//                         } else {
//                             let errorResult = new ResultError(400, true, "question.insertUpdateQuestion() Error", new Error('Error While Updating Data'), '');
//                             next(errorResult);
//                         }
//                     } else {
//                         let sql = `INSERT INTO questions (question,answer,createdBy,modifiedBy) VALUES ('` + req.body.question + `','` + req.body.answer + `',` + userId + `,` + userId + `);`;
//                         let result = await query(sql);
//                         if (result && result.affectedRows > 0) {
//                             let successResult = new ResultSuccess(200, true, 'Insert Question', result, 1, authorizationResult.token);
//                             return res.status(200).send(successResult);
//                         } else {
//                             let errorResult = new ResultError(400, true, "question.insertUpdateQuestion() Error", new Error('Error While Inserting Data'), '');
//                             next(errorResult);
//                         }
//                     }
//                 }
//             }
//         }
//     } catch (error: any) {
//         let errorResult = new ResultError(500, true, 'question.insertUpdateQuestion() Exception', error, '');
//         next(errorResult);
//     }
// }
