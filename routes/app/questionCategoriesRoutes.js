"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const questionCategories_1 = __importDefault(require("../../controllers/app/questionCategories"));
const router = express_1.default.Router();
// #region /api/app/questioncategories/getQuestion apidoc
/**
 * @api {post} /api/app/questioncategories/getQuestion Get Question
 * @apiVersion 1.0.0
 * @apiName Get Question
 * @apiDescription Get Question
 * @apiGroup Q&A - App
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
 */
// #endregion
router.post('/getQuestion', questionCategories_1.default.getQuestion);
module.exports = router;
