"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const appUsers_1 = __importDefault(require("../../controllers/admin/appUsers"));
const router = express_1.default.Router();
// #region /api/admin/appUsers/getAppUsers apidoc
/**
 * @api {post} /api/admin/appUsers/getAppUsers Get App Users
 * @apiVersion 1.0.0
 * @apiName Get App Users
 * @apiDescription Get App Users
 * @apiGroup App Users - Admin
 * @apiParam  {Integer}          startIndex                Optional Start Index
 * @apiParam  {Integer}          fetchRecord               Optional Fetch Index
 * @apiParam  {String}           searchString              Optional Search String
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *      {
 *          "status": 200,
 *          "isDisplayMessage": true,
 *          "message": "Get App Users Successfully",
 *          "recordList": [
 *              {
 *                  "id": 21,
 *                  "firstName": "Yogita",
 *                  "middleName": null,
 *                  "lastName": "patel",
 *                  "contactNo": "3698521473",
 *                  "email": "yogita123@gmail.com",
 *                  "gender": "Female",
 *                  "password": "$2a$10$nw1VRpDUxFCSUybngKyM9.9WlnkZqapcfa1gAJjYLq4KIB1TFral.",
 *                  "imageId": null,
 *                  "isPasswordSet": null,
 *                  "isDisable": 0,
 *                  "isVerified": null,
 *                  "isActive": 1,
 *                  "isDelete": 0,
 *                  "createdDate": "2022-10-17T09:13:57.000Z",
 *                  "modifiedDate": "2022-10-17T09:13:57.000Z",
 *                  "roleId": 2
 *              },...
 *          ],
 *          "totalRecords": 8,
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
router.post('/getAppUsers', appUsers_1.default.getAppUsers);
// #region /api/admin/appUsers/viewAppUserPerDetail apidoc
/**
 * @api {post} /api/admin/appUsers/viewAppUserPerDetail View App User Detail
 * @apiVersion 1.0.0
 * @apiName View App Users Detail
 * @apiDescription View App Users Detail
 * @apiGroup App Users - Admin
 * @apiParam  {Number}          userId                        Requires userId of App USers.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId": 22
 *     }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get App User Detail Successfully",
 *         "recordList": [
 *             {
 *                 "id": 22,
 *                 "firstName": "Rahul",
 *                 "middleName": null,
 *                 "lastName": "Gamit",
 *                 "gender": "Male",
 *                 "email": "rahul123@gmail.com",
 *                 "contactNo": "3265478912",
 *                 "birthDate": "1995-09-23T18:30:00.000Z",
 *                 "languages": "Gujarati",
 *                 "eyeColor": "Black",
 *                 "imageUrl": "content/user/22/26.jpeg",
 *                 "religion": "Sikh",
 *                 "maritalStatus": "Married",
 *                 "community": "Trivedi",
 *                 "occupation": "Designer",
 *                 "education": "B pharm",
 *                 "subCommunity": "Brahmin",
 *                 "annualIncome": "4 lakh",
 *                 "diet": "Jain",
 *                 "height": "130 cm",
 *                 "addressLine1": "Gangadhara",
 *                 "addressLine2": "Bardoli",
 *                 "pincode": "380058",
 *                 "cityName": "Bopal",
 *                 "state": "GUJARAT",
 *                 "country": "India"
 *             }
 *         ],
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
 *     HTTP/1.1 400 Error While Getting Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Getting Data",
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
router.post('/viewAppUserPerDetail', appUsers_1.default.viewAppUserPerDetail);
// #region /api/admin/appUsers/viewAppUserSendRequest apidoc
/**
 * @api {post} /api/admin/appUsers/viewAppUserSendRequest View App User Send Request
 * @apiVersion 1.0.0
 * @apiName View App Users Send Request
 * @apiDescription View App Users Send Request
 * @apiGroup App Users - Admin
 * @apiParam  {Number}          userId                        Requires userId of App USers.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId": 22,
 *       "startIndex": 0,
 *       "fetchRecord": 1
 *     }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get App User Detail Successfully",
 *         "recordList": [
 *             {
 *                 "id": 1,
 *                 "userId": 22,
 *                 "proposalUserId": 25,
 *                 "status": 1,
 *                 "isActive": 1,
 *                 "isDelete": 0,
 *                 "createdDate": "2022-10-17T10:37:07.000Z",
 *                 "modifiedDate": "2022-10-17T10:37:07.000Z",
 *                 "createdBy": 22,
 *                 "modifiedBy": 22,
 *                 "firstName": "Bhavin",
 *                 "lastName": "Panchal",
 *                 "gender": "Male",
 *                 "email": "bhavin123@gmail.com",
 *                 "contactNo": "3265478912",
 *                 "imageUrl": null
 *             }
 *         ],
 *         "totalRecords": 3,
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
 *     HTTP/1.1 400 Error While Getting Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Getting Data",
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
router.post('/viewAppUserSendRequest', appUsers_1.default.viewAppUserSendRequest);
// #region /api/admin/appUsers/viewAppUserGotRequest apidoc
/**
 * @api {post} /api/admin/appUsers/viewAppUserGotRequest View App User Got Request
 * @apiVersion 1.0.0
 * @apiName View App Users Got Request
 * @apiDescription View App Users Got Request
 * @apiGroup App Users - Admin
 * @apiParam  {Number}          userId                    Requires userId of App USers.
 * @apiParam  {Integer}         startIndex                Optional Start Index.
 * @apiParam  {Integer}         fetchRecord               Optional Fetch Index.
 * @apiParam  {String}          searchString              Optional Search String.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId": 22,
 *       "startIndex": 0,
 *       "fetchRecord": 1
 *     }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get App User Send Requests Successfully",
 *         "recordList": [
 *             {
 *                 "id": 7,
 *                 "userId": 24,
 *                 "proposalUserId": 22,
 *                 "status": 1,
 *                 "isActive": 1,
 *                 "isDelete": 0,
 *                 "createdDate": "2022-10-18T10:25:55.000Z",
 *                 "modifiedDate": "2022-10-18T10:25:55.000Z",
 *                 "createdBy": 25,
 *                 "modifiedBy": 25,
 *                 "firstName": "Kinjal",
 *                 "lastName": "Patel",
 *                 "gender": "Female",
 *                 "email": "kinjal123@gmail.com",
 *                 "contactNo": "3265478912",
 *                 "imageUrl": null
 *             }
 *         ],
 *         "totalRecords": 4,
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
 *     HTTP/1.1 400 Error While Getting Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Getting Data",
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
router.post('/viewAppUserGotRequest', appUsers_1.default.viewAppUserGotRequest);
// #region /api/admin/appUsers/viewAppUserFavourites apidoc
/**
 * @api {post} /api/admin/appUsers/viewAppUserFavourites View App User Favourites
 * @apiVersion 1.0.0
 * @apiName View App Users Favourites
 * @apiDescription View App Users Favourites
 * @apiGroup App Users - Admin
 * @apiParam  {Number}           userId                    Requires userId of App USers.
 * @apiParam  {Integer}          startIndex                Optional Start Index
 * @apiParam  {Integer}          fetchRecord               Optional Fetch Index
 * @apiParam  {String}           searchString              Optional Search String
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId": 22,
 *       "startIndex": 0,
 *       "fetchRecord": 1
 *     }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get App User Favourites Successfully",
 *         "recordList": [
 *             {
 *                 "id": 1,
 *                 "userId": 22,
 *                 "favUserId": 25,
 *                 "isActive": 1,
 *                 "isDelete": 0,
 *                 "createdDate": "2022-10-19T05:19:52.000Z",
 *                 "modifiedDate": "2022-10-19T05:19:52.000Z",
 *                 "createdBy": 25,
 *                 "modifiedBy": 25,
 *                 "firstName": "Bhavin",
 *                 "lastName": "Panchal",
 *                 "gender": "Male",
 *                 "email": "bhavin123@gmail.com",
 *                 "contactNo": "3265478912",
 *                 "imageUrl": null
 *             }
 *         ],
 *         "totalRecords": 3,
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
 *     HTTP/1.1 400 Error While Getting Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Getting Data",
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
router.post('/viewAppUserFavourites', appUsers_1.default.viewAppUserFavourites);
// #region /api/admin/appUsers/viewBlockUser apidoc
/**
 * @api {post} /api/admin/appUsers/viewBlockUser View App User Block Users
 * @apiVersion 1.0.0
 * @apiName View App User Block Users
 * @apiDescription View App Users Favourites
 * @apiGroup App Users - Admin
 * @apiParam  {Number}           userId                    Requires userId of App USers.
 * @apiParam  {Integer}          startIndex                Optional Start Index
 * @apiParam  {Integer}          fetchRecord               Optional Fetch Index
 * @apiParam  {String}           searchString              Optional Search String
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId": 22,
 *       "startIndex": 0,
 *       "fetchRecord": 1
 *     }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "View Block User Successfully",
 *         "recordList": [
 *             {
 *                 "id": 1,
 *                 "userId": 22,
 *                 "favUserId": 25,
 *                 "isActive": 1,
 *                 "isDelete": 0,
 *                 "createdDate": "2022-10-19T05:19:52.000Z",
 *                 "modifiedDate": "2022-10-19T05:19:52.000Z",
 *                 "createdBy": 25,
 *                 "modifiedBy": 25,
 *                 "firstName": "Bhavin",
 *                 "lastName": "Panchal",
 *                 "gender": "Male",
 *                 "email": "bhavin123@gmail.com",
 *                 "contactNo": "3265478912",
 *                 "imageUrl": null
 *             }
 *         ],
 *         "totalRecords": 3,
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
 *     HTTP/1.1 400 Error While Getting Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Getting Data",
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
router.post('/viewBlockUser', appUsers_1.default.viewBlockUser);
// #region /api/admin/appUsers/unblockUserRequest apidoc
/**
 * @api {post} /api/admin/appUsers/unblockUserRequest View App User Block Users
 * @apiVersion 1.0.0
 * @apiName View App User Block Users
 * @apiDescription View App User Block Users
 * @apiGroup App Users - Admin
 * @apiParam  {Number}           id                    Requires Block Request UserId.
 * @apiParam  {Boolean}          status                Requires Block status true/false.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId": 22,
 *       "startIndex": 0,
 *       "fetchRecord": 1
 *     }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Update User Block Request Sucessfully",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 1,
 *             "insertId": 13,
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
 *     HTTP/1.1 400 Error While Updating Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Updating Data",
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
router.post('/unblockUserRequest', appUsers_1.default.unblockUserRequest);
// #region /api/admin/appUsers/approveDocument apidoc
/**
 * @api {post} /api/admin/appUsers/approveDocument Approve User Document
 * @apiVersion 1.0.0
 * @apiName VApprove User Document
 * @apiDescription View App User Block Users
 * @apiGroup App Users - Admin
 * @apiParam  {Number}           id                    Requires Document id.
 * @apiParam  {Boolean}          isVerified            Requires isVerified true/false.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId": 22,
 *       "startIndex": 0,
 *       "fetchRecord": 1
 *     }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Approve/Reject User Document Sucessfully",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 1,
 *             "insertId": 13,
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
 */
// #endregion
router.post('/approveDocument', appUsers_1.default.approveDocument);
// #region /api/admin/appUsers/getUserPackages apidoc
/**
 * @api {post} /api/admin/appUsers/getUserPackages Get User Packages
 * @apiVersion 1.0.0
 * @apiName Get User Packages
 * @apiDescription Get User Packages
 * @apiGroup App Users - Admin
 *  @apiParam  {Number}          startIndex               Optional Start Index
 * @apiParam  {Number}           fetchRecord              Optional Fetch Index
 * @apiParam  {String}           searchString             Optional Search String
 * @apiParam  {String}           paymentStatus            Optional package paymentStatus
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId": 22,
 *       "startIndex": 0,
 *       "fetchRecord": 1
 *     }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get Package of Users",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 1,
 *             "insertId": 13,
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
router.post('/getUserPackages', appUsers_1.default.getUserPackages);
// #region /api/admin/appUsers/activeUserPackage apidoc
/**
 * @api {post} /api/admin/appUsers/activeUserPackage Get Active User Package
 * @apiVersion 1.0.0
 * @apiName Get Active User Package
 * @apiDescription Get Active User Package
 * @apiGroup App Users - Admin
 * @apiParam  {Number}          packageId             Requires Package Id.
 * @apiParam  {Number}          packageDurationId     Requires Package Duration Id.
 * @apiParam  {Number}          userId                Requires User Id.
 * @apiParam  {Number}          paymentId             Requires Payment Id.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId": 22,
 *       "startIndex": 0,
 *       "fetchRecord": 1
 *     }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get Package of Users",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 1,
 *             "insertId": 13,
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
 *     HTTP/1.1 400 Error While Updating Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Updating Data",
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
router.post('/activeUserPackage', appUsers_1.default.activeUserPackage);
// #region /api/admin/appUsers/verifyUserProfilePic apidoc
/**
 * @api {post} /api/admin/appUsers/verifyUserProfilePic Verify User Profile
 * @apiVersion 1.0.0
 * @apiName Verify User Profile
 * @apiDescription Verify User Profile
 * @apiGroup App Users - Admin
 * @apiParam  {Number}           id                    Requires User Id.
 * @apiParam  {Boolean}          isVerified            Requires isVerified true/false .
 * @apiParamExample {json} Request-Example:
 *     {
 *       "userId": 22,
 *       "startIndex": 0,
 *       "fetchRecord": 1
 *     }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Verify User Profile Pic",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 1,
 *             "insertId": 13,
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
 *     HTTP/1.1 400 Data Error While Updating Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Updating Data",
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
router.post('/verifyUserProfilePic', appUsers_1.default.verifyUserProfilePic);
router.post('/updateUserProfilePicV2', appUsers_1.default.updateUserProfilePicV2);
module.exports = router;
