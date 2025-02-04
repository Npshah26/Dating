"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const coupons_1 = __importDefault(require("../../controllers/admin/coupons"));
const router = express_1.default.Router();
// #region /api/admin/coupons/getCoupons apidoc
/**
 * @api {post} /api/admin/coupons/getCoupons Get Coupon
 * @apiVersion 1.0.0
 * @apiName Get Coupon
 * @apiDescription Get Coupon
 * @apiGroup Coupon - Admin
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
 *         "message": "Get Coupon Successfully",
 *         "recordList": [
 *             {
 *                 "id": 1,
 *                 "name": "Get 50% Descount",
 *                 "code": "GET 50",
 *                 "type": "Percentage",
 *                 "value": 50,
 *                 "maxUsage": 10,
 *                 "userUsage": 1,
 *                 "validFrom": "2023-12-1T00:00:00.000Z",
 *                 "validTo": "2023-12-15T23:59:59.000Z",
 *                 "maxDiscountAmount": 300,
 *                 "description":"",
 *                 "termsCondition": "",
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
router.post('/getCoupons', coupons_1.default.getCoupons);
// #region /api/admin/coupons/insertUpdateCoupon apidoc
/**
 * @api {post} /api/admin/coupons/insertUpdateCoupon insert update Coupon
 * @apiVersion 1.0.0
 * @apiName insert update Coupon
 * @apiDescription insert update Coupon
  * @apiGroup Coupon - Admin
 * @apiParam  {Number}          id                  Requires id of Coupon When Edit.
 * @apiParam  {String}          name                Requires name of Coupon.
 * @apiParam  {String}          code                Requires code of Coupon.
 * @apiParam  {String}          type                Requires type of Coupon.
 * @apiParam  {Number}          value               Requires value of Coupon.
 * @apiParam  {Number}          maxUsage            Requires maxUsage of Coupon.
 * @apiParam  {Number}          userUsage           Requires userUsage of Coupon.
 * @apiParam  {Date}            validFrom           Requires validFrom of Coupon.
 * @apiParam  {Date}            validTo             Requires validTo of Coupon.
 * @apiParam  {Number}          maxDiscountAmount   Requires maxDiscountAmount of Coupon.
 * @apiParam  {String}          description         Requires description of Coupon.
 * @apiParam  {String}          termsCondition      Requires termsCondition of Coupon.
 * @apiParam  {Array}           packages            Requires Array of Packages where applied on.
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
 *         "message": "Insert Coupon",
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
router.post('/insertUpdateCoupon', coupons_1.default.insertUpdateCoupon);
// #region /api/admin/coupons/activeInactiveCoupon apidoc
/**
 * @api {post} /api/admin/coupons/activeInactiveCoupon Change Status of Coupon
 * @apiVersion 1.0.0
 * @apiName Change  Status of Coupon
 * @apiDescription Change  Status of Coupon
 * @apiGroup  Coupon - Admin
 * @apiParam  {Integer}         id                  Requires Coupon Id.
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
 *         "message": "Change Coupon Status",
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
 *         "message": "Error While Change Coupon Status",
 *         "value": "",
 *         "error": {
 *             "apiName": "",
 *             "apiType": "",
 *             "fileName": "trace is not available",
 *             "functionName": "trace is not available",
 *             "functionErrorMessage": "coupons.activeInactiveCoupon() Error : Error: Error While Change Coupon Status",
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
 *     HTTP/1.1 400 Error While Change coupon Status
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Change Coupon Status",
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
router.post('/activeInactiveCoupon', coupons_1.default.activeInactiveCoupon);
module.exports = router;
