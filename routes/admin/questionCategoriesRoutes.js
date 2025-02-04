"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const questionCategories_1 = __importDefault(require("../../controllers/admin/questionCategories"));
const router = express_1.default.Router();
// #region /api/admin/questionCategories/getQuestion apidoc
/**
 * @api {post} /api/admin/questionCategories/getQuestion Get Question
 * @apiVersion 1.0.0
 * @apiName Get Question
 * @apiDescription Get Question
 * @apiGroup Q&A - Admin
 * @apiParam {Number}      fetchRecord                  Optional Fetch Record Categories
 * @apiParam {Number}      startIndex                   Optional Start Index
 * @apiParam {Number}      fetchRecordCategories        Optional Fetch Record Categories
 * @apiParam {Number}      fetchRecordCategories        Optional Fetch Record Categories
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get Custom Fields Successfully",
 *         "recordList": Question Type,
 *         "totalRecords": 6,
 *         "token": ""
 *     }
 * @apiError (500) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-500-Response:
 *     HTTP/1.1 500 ERROR
 *     {
 *          status: <error status code>,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: <error message>,
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (401) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-401-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *          status: 401,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Unauthorized request",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (400) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-400-Response:
 *     HTTP/1.1 400 Data not found
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Data Not Available",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 */
// #endregion
router.post('/getQuestion', questionCategories_1.default.getQuestion);
// #region /api/admin/questionCategories/insertUpdateQuestionCategories apidoc
/**
 * @api {post} /api/admin/questionCategories/insertUpdateQuestionCategories Insert Update QuestionCategories
 * @apiVersion 1.0.0
 * @apiName Insert Update QuestionCategories
 * @apiDescription Insert Update QuestionCategories
 * @apiGroup Q&A - Admin
 * @apiParam  {String}          name                Requires name of QuestionCategory.
 * @apiParamExample {json} Request-Example:
 *      {
 *           "id": 4  // Require When edit
 *           "name": "<question category>"
 *      }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Insert Custom Field",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 1,
 *             "insertId": 4,
 *             "serverStatus": 2,
 *             "warningCount": 0,
 *             "message": "",
 *             "protocol41": true,
 *             "changedRows": 0
 *         },
 *         "totalRecords": 1,
 *         "token": ""
 *     }
 * @apiError (500) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-500-Response:
 *     HTTP/1.1 500 ERROR
 *     {
 *          status: <error status code>,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: <error message>,
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (401) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-401-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *          status: 401,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Unauthorized request",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (400) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-400-Response:
 *     HTTP/1.1 400 Error While Inserting/Updating Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Inserting/Updating Data",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 */
// #endregion
router.post('/insertUpdateQuestionCategories', questionCategories_1.default.insertUpdateQuestionCategories);
// #region /api/admin/questionCategories/activeInactiveQuestionCategories apidoc
/**
 * @api {post} /api/admin/questionCategories/activeInactiveQuestionCategories Active Inactive QuestionCategories
 * @apiVersion 1.0.0
 * @apiName Active Inactive QuestionCategories
 * @apiDescription Active Inactive QuestionCategories
 * @apiGroup Q&A - Admin
 * @apiParam  {Integer}         id                  Requires Id.
 * @apiParamExample {json} Request-Example:
 *      {
 *           "id": 4
 *      }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Change QuestionCategories Status",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 1,
 *             "insertId": 0,
 *             "serverStatus": 2,
 *             "warningCount": 1,
 *             "message": "(Rows matched: 1  Changed: 1  Warnings: 1",
 *             "protocol41": true,
 *             "changedRows": 1
 *         },
 *         "totalRecords": 1,
 *         "token": ""
 *     }
 * @apiError (500) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-500-Response:
 *     HTTP/1.1 500 ERROR
 *     {
 *          status: <error status code>,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: <error message>,
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (401) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-401-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *          status: 401,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Unauthorized request",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (400) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-400-Response:
 *     HTTP/1.1 400 Error While Change Question Category Status
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Change Question Category Status",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 */
router.post('/activeInactiveQuestionCategories', questionCategories_1.default.activeInactiveQuestionCategories);
// #region /api/admin/questionCategories/deleteQuestionCategories apidoc
/**
 * @api {post} /api/admin/questionCategories/deleteQuestionCategories Delete Question Categories
 * @apiVersion 1.0.0
 * @apiName Delete Question Categories
 * @apiDescription Delete Question Categories
 * @apiGroup Q&A - Admin
 * @apiParam  {Number}         id          requires id.
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Delete Question Categories Successfully",
 *         "totalRecords": 1,
 *         "token": ""
 *     }
 * @apiError (500) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-500-Response:
 *     HTTP/1.1 500 ERROR
 *     {
 *          status: <error status code>,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: <error message>,
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (401) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-401-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *          status: 401,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Unauthorized request",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (400) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-400-Response:
 *     HTTP/1.1 400 Error While Deleting Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Deleting Data",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 */
// #endregion
router.post('/deleteQuestionCategories', questionCategories_1.default.deleteQuestionCategories);
// #region /api/admin/questionCategories/insertUpdateQuestion apidoc
/**
 * @api {post} /api/admin/questionCategories/insertUpdateQuestion Insert Update Question
 * @apiVersion 1.0.0
 * @apiName Insert Update Question
 * @apiDescription Insert Update Question
 * @apiGroup Q&A - Admin
 * @apiParam  {String}          question                Requires question
 * @apiParam  {String}          answer                  Requires answer.
 * @apiParamExample {json} Request-Example:
 *      {
 *           "id": 4  // Require When edit Custom Field
 *           "question": " ",
 *           "answer": " "
 *      }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Insert Custom Field",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 1,
 *             "insertId": 4,
 *             "serverStatus": 2,
 *             "warningCount": 0,
 *             "message": "",
 *             "protocol41": true,
 *             "changedRows": 0
 *         },
 *         "totalRecords": 1,
 *         "token": ""
 *     }
 * @apiError (500) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-500-Response:
 *     HTTP/1.1 500 ERROR
 *     {
 *          status: <error status code>,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: <error message>,
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (401) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-401-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *          status: 401,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Unauthorized request",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (400) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-400-Response:
 *     HTTP/1.1 400 Error While Inserting/Updating Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Inserting/Updating Data",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 */
// #endregion
router.post('/insertUpdateQuestion', questionCategories_1.default.insertUpdateQuestion);
// #region /api/admin/questionCategories/activeInactiveQuestion apidoc
/**
 * @api {post} /api/admin/questionCategories/activeInactiveQuestion Active Inactive Question
 * @apiVersion 1.0.0
 * @apiName Active Inactive Question
 * @apiDescription Active Inactive Question
 * @apiGroup Q&A - Admin
 * @apiParam {Number}               id              Required Id Of Question
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Active/Inactive Question Successfully",
 *         "totalRecords": 1,
 *         "token": ""
 *     }
 * @apiError (500) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-500-Response:
 *     HTTP/1.1 500 ERROR
 *     {
 *          status: <error status code>,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: <error message>,
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (401) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-401-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *          status: 401,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Unauthorized request",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (400) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-400-Response:
 *     HTTP/1.1 400 Error While Change Question Status
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Change Question Status",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 */
// #endregion
router.post('/activeInactiveQuestion', questionCategories_1.default.activeInactiveQuestion);
// #region /api/admin/questionCategories/deleteQuestion apidoc
/**
 * @api {post} /api/admin/questionCategories/deleteQuestion Remove Question
 * @apiVersion 1.0.0
 * @apiName Remove Custom Fields
 * @apiDescription Remove Custom Fields
 * @apiGroup Q&A - Admin
 * @apiParam {Number}      id           Required Id of Question
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Remove Question Successfully",
 *         "totalRecords": 1,
 *         "token": ""
 *     }
 * @apiError (500) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-500-Response:
 *     HTTP/1.1 500 ERROR
 *     {
 *          status: <error status code>,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: <error message>,
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (401) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-401-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *          status: 401,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Unauthorized request",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 * @apiError (400) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-400-Response:
 *     HTTP/1.1 400 Error While Deleting Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Deleting Data",
 *          error: {
 *              apiName: <api name>,
 *              apiType: <api type>,
 *              fileName: <file name>,
 *              functionName: <function name>,
 *              lineNumber: <line number>,
 *              typeName: <type name>,
 *              stack: <stack>
 *          },
 *          value: <value if any>
 *     }
 */
// #endregion
router.post('/deleteQuestion', questionCategories_1.default.deleteQuestion);
module.exports = router;
