"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const customFields_1 = __importDefault(require("../../controllers/app/customFields"));
const router = express_1.default.Router();
// #region /api/app/customFields/getCustomFields apidoc
/**
 * @api {post} /api/app/customFields/getCustomFields Get CustomFields
 * @apiVersion 1.0.0
 * @apiName Get CustomFields
 * @apiDescription Get CustomFields
 * @apiGroup CustomFields - App
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": 200,
 *          "isDisplayMessage": true,
 *          "message": "Get CustomFields Successfully",
 *          "recordList": [
 *              {
 *                  allowInFilter: 0
 *                 "allowInPreferences": 0
 *                 "allowInSearch": 0
 *                 "completeprofilesectioname":"Personal Details"
 *                 "allowIncompleteProfile": 1
 *                 "createdBy": 1
 *                 "createdDate": "2024-06-28T12:31:18.000Z"
 *                 "defaultValue": ["Dance"]
 *                 "description": null
 *                 "displayName": "Hobbies"
 *                 "id": 1
 *                 "isActive": 1
 *                 "isDelete": 0
 *                 "isRequired": 0
 *                 'mappedFieldName': "hobbies"
 *                 "modifiedBy": 1
 *                 "modifiedDate": "2024-06-28T12:31:24.000Z"
 *                 "name": "Hobbies"
 *                 "textLength": null
 *                 "valueList": ["cycling", "Dancing", "Music"]
 *                 "valueTypeName": "MultipleDropDownList"
 *                 "valueTypeId": 10
 *              },....
 *        ],
 *          "totalRecords": 4,
 *          "token": ""
 *      }
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
 */
// #endregion
router.post('/getCustomFields', customFields_1.default.getCustomFields);
// #region /api/app/customFields/getCustomFieldsInResponse apidoc
/**
 * @api {post} /api/app/customFields/getCustomFieldsInResponse Get CustomFields Response
 * @apiVersion 1.0.0
 * @apiName Get CustomFields Response
 * @apiDescription Get CustomFields Response
 * @apiGroup CustomFields - App
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": 200,
 *          "isDisplayMessage": true,
 *          "message": "Get CustomFields Response Successfully",
 *          "recordList": [
 *              {
 *              },....
 *        ],
 *          "totalRecords": 4,
 *          "token": ""
 *      }
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
 */
// #endregion
router.post('/getCustomFieldsInResponse', customFields_1.default.getCustomFieldsInResponse);
module.exports = router;
