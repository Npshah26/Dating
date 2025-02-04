"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const paymentGateways_1 = __importDefault(require("../../controllers/app/paymentGateways"));
const router = express_1.default.Router();
// #region /api/app/paymentGateways/getPaymentgateways apidoc
/**
 * @api {post} /api/app/paymentGateways/getPaymentgateways Get Paymentgateways
 * @apiVersion 1.0.0
 * @apiName Get Paymentgateways
 * @apiDescription Get Paymentgateways
 * @apiGroup Paymentgateways - App
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": 200,
 *          "isDisplayMessage": true,
 *          "message": "Get Paymentgateways Successfully",
 *          "recordList": [
 *              {
 *                  "id": 1
 *                  "userId": 22,
 *                  "proposalUserId": 23,
 *                  "status": null,
 *                  "firstName": "Rahul",
 *                  "lastName": "Gamit",
 *                  "gender": "Male",
 *                  "email": "rahul123@gmail.com",
 *                  "contactNo": "3265478912",
 *                  "image": "content/user/22/26.jpeg",
 *                  "isBlockByMe": 0,
 *                  "isBlockByOther": 0,
 *                  "createdDate": "2022-10-18T10:24:55.000Z",
 *                  "occupation": "Doctor"
 *                  "age": "28"
 *                  "birthDate": "28"
 *                  "cityName": "Surat"
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
router.post('/getPaymentgateways', paymentGateways_1.default.getPaymentgateways);
// #region /api/app/paymentGateways/getPaymentgatewaysForPackage apidoc
/**
 * @api {post} /api/app/paymentGateways/getPaymentgatewaysForPackage Get Paymentgateways For Package
 * @apiVersion 1.0.0
 * @apiName Get Paymentgateways For Package
 * @apiDescription Get Paymentgateways For Package
 * @apiGroup Paymentgateways - App
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": 200,
 *          "isDisplayMessage": true,
 *          "message": "Get Paymentgateways For Package Successfully",
 *          "recordList": [
 *              {
 *
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
router.post('/getPaymentgatewaysForPackage', paymentGateways_1.default.getPaymentgatewaysForPackage);
router.post('/generateRazorPayOrderId', paymentGateways_1.default.generateRazorPayOrderId);
router.post('/stripePayment', paymentGateways_1.default.stripePayment);
module.exports = router;
