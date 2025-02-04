"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const customeNotification_1 = __importDefault(require("../../controllers/admin/customeNotification"));
const router = express_1.default.Router();
// #region /api/admin/customNotification/getCustomNotification apidoc
/**
 * @api {post} /api/admin/customNotification/getCustomNotification Get Custom Notification
 * @apiVersion 1.0.0
 * @apiName Get Custom Notification
 * @apiDescription Get Custom Notification
 * @apiGroup Custom Notification - Admin
 * @apiParam {String}      searchString            Optional Search string
 * @apiParam {Boolean}     isActive                Optional isActive
 * @apiParam {Number}      fetchRecord             Optional Fetch Record
 * @apiParam {Number}      startIndex              Optional Start Index
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get Custom Notification Successfully",
 *         "recordList": [
 *             {
 *                 "id": 1,
 *                 "name": "Get 50% Descount",
 *                 "title": "GET 50",
 *                 "description": "Percentage",
 *                 "sendCount": 50,
 *                 "imageUrl": "",
 *                 "isActive": 1,
 *                 "isDelete": 0,
 *                 "createdDate": "2022-10-14T07:04:39.000Z",
 *                 "modifiedDate": "2022-10-14T07:04:39.000Z",
 *                 "createdBy": 6,
 *                 "modifiedBy": 6
 *             },....
 *         ],
 *         "totalRecords": 11,
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
router.post('/getCustomNotification', customeNotification_1.default.getCustomNotification);
// #region /api/admin/customNotification/insertUpdateCustomNotification apidoc
/**
 * @api {post} /api/admin/customNotification/insertUpdateCustomNotification insert Update Custom Notification
 * @apiVersion 1.0.0
 * @apiName insert Update Custom Notification
 * @apiDescription insert Update Custom Notification
  * @apiGroup Custom Notification - Admin
 * @apiParam  {Number}          id                  Requires id of Custom Notification When Edit.
 * @apiParam  {String}          name                Requires name of Custom Notification.
 * @apiParam  {String}          title               Requires title of Custom Notification.
 * @apiParam  {String}          description         Requires description of Custom Notification.
 * @apiParam  {Boolean}         isSend              Requires isSend of Custom Notification.
 * @apiParam  {String}          [imageUrl]          Optional image Url of Custom Notification.
 * @apiParamExample {json} Request-Example:
 *      {
 *           "id": 2  // Require When edit Coupon
 *           "name": "Get 50% Descount",
 *           "code": "GET 50",
 *           "type": "Percentage", OR // "Amount"
 *           "value": 50,
 *           "maxUsage": 10,
 *           "userUsage": 1,
 *           "validFrom": "2023-12-1T00:00:00.000Z",
 *           "validTo": "2023-12-15T23:59:59.000Z",
 *           "maxDiscountAmount": 300,
 *           "description":"",
 *           "termsCondition": ""
 *      }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Insert Custom Notification",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 1,
 *             "insertId": 2,
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
router.post('/insertUpdateCustomNotification', customeNotification_1.default.insertUpdateCustomNotification);
// #region /api/admin/customNotification/sendCustomNotification apidoc
/**
 * @api {post} /api/admin/customNotification/sendCustomNotification Send Custom Notification
 * @apiVersion 1.0.0
 * @apiName Send Custom Notification
 * @apiDescription Send Custom Notification
 * @apiGroup  Custom Notification - Admin
 * @apiParam  {Integer}         id                  Requires Customer Notification Id.
 * @apiParamExample {json} Request-Example:
 *    {
 *        "id": 2
 *    }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Send Custom Notification",
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
 *    {
 *         "status": 400,
 *         "isDisplayMessage": true,
 *         "message": "Error While Updating Notification",
 *         "value": "",
 *         "error": {
 *             "apiName": "",
 *             "apiType": "",
 *             "fileName": "trace is not available",
 *             "functionName": "trace is not available",
 *             "functionErrorMessage": "customNotification.sendCustomNotification() Error : Error: Error While Updating Notification",
 *             "lineNumber": "trace is not available",
 *             "typeName": "trace is not available",
 *             "stack": "Error stack is not available"
 *         }
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
 *     HTTP/1.1 400 Error while sending notification
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error while sending notification",
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
router.post('/sendCustomNotification', customeNotification_1.default.sendCustomNotification);
// #region /api/admin/customNotification/activeInactiveCustomNotification apidoc
/**
 * @api {post} /api/admin/customNotification/activeInactiveCustomNotification Change Status of Custom Notification
 * @apiVersion 1.0.0
 * @apiName Change  Status of Custom Notification
 * @apiDescription Change  Status of Custom Notification
 * @apiGroup  Custom Notification - Admin
 * @apiParam  {Integer}         id                  Requires Custom Notification Id.
 * @apiParamExample {json} Request-Example:
 *    {
 *        "id": 2
 *    }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Change Custom Notification Status",
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
 *    {
 *         "status": 400,
 *         "isDisplayMessage": true,
 *         "message": "Error While Change Custom Notification Status",
 *         "value": "",
 *         "error": {
 *             "apiName": "",
 *             "apiType": "",
 *             "fileName": "trace is not available",
 *             "functionName": "trace is not available",
 *             "functionErrorMessage": "coupons.activeInactiveCustomNotification() Error : Error: Error While Change Custom Notification Status",
 *             "lineNumber": "trace is not available",
 *             "typeName": "trace is not available",
 *             "stack": "Error stack is not available"
 *         }
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
 *     HTTP/1.1 400 Error While Change Custom Notification Status
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Change Custom Notification Status",
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
router.post('/activeInactiveCustomNotification', customeNotification_1.default.activeInactiveCustomNotification);
module.exports = router;
