"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const coupons_1 = __importDefault(require("../../controllers/app/coupons"));
const router = express_1.default.Router();
// #region /api/app/coupons/getCoupons apidoc
/**
 * @api {post} /api/app/coupons/getCoupons Get Coupon
 * @apiVersion 1.0.0
 * @apiName Get Coupon
 * @apiDescription Get Coupon
 * @apiGroup Coupon - App
 * @apiParam  {Number}          packageId       Requires Package Id.
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
 */
// #endregion
router.post('/getCoupons', coupons_1.default.getCoupons);
// #region /api/app/coupons/applyCouponCode apidoc
/**
 * @api {post} /api/app/coupons/applyCouponCode Get Coupon
 * @apiVersion 1.0.0
 * @apiName Get Coupon
 * @apiDescription Get Coupon
 * @apiGroup Coupon - App
 * @apiParam  {String}          code            Requires Coupon Code.
 * @apiParam  {Number}          packageId       Requires Package Id.
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
 */
// #endregion
router.post('/applyCouponCode', coupons_1.default.applyCouponCode);
module.exports = router;
