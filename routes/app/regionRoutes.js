"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const region_1 = __importDefault(require("../../controllers/app/region"));
const router = express_1.default.Router();
// #region /api/app/region/getCountries apidoc
/**
 * @api {post} /api/app/region/getCountries Get Countries
 * @apiVersion 1.0.0
 * @apiName Get Countries
 * @apiDescription Get Countries
 * @apiGroup Region - App
 * @apiParam {String}      searchString            Optional searchString
 * @apiParam {Number}      fetchRecord             Optional Fetch Record
 * @apiParam {Number}      startIndex              Optional Start Index
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get Countries Successfully",
 *         "recordList": [
 *             {
 *                 createdDate: "2022-02-11T06:40:11.000Z"
 *                 dialCode: "+91"
 *                 id: 1
 *                 isActive: 1
 *                 isDefult: 1
 *                 isDelete: 0
 *                 isoCode: "IND"
 *                 isoCode3: "IN"
 *                 modifiedDate: "2022-02-11T06:40:11.000Z"
 *                 name: "India"
 *             },....
 *         ],
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
router.post('/getCountries', region_1.default.getCountries);
// #region /api/app/region/getStates apidoc
/**
 * @api {post} /api/app/region/getStates Get State
 * @apiVersion 1.0.0
 * @apiName Get State
 * @apiDescription Get State
 * @apiGroup Region - App
 * @apiParam {String}      searchString            Optional searchString
 * @apiParam {Number}      fetchRecord             Optional Fetch Record
 * @apiParam {Number}      startIndex              Optional Start Index
 * @apiParam {Number}      countryId               Optional country
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get State Successfully",
 *         "recordList": [
 *             {
 *               code: null
 *               "countryId": 1
 *               "countryName": "India"
 *               "createdDate": "2022-03-03T06:43:51.000Z"
 *               "id": 1
 *               "isActive": 1
 *               "isDelete": 0
 *               "modifiedDate": "2022-03-03T06:43:51.000Z"
 *               "name": "GUJARAT"
 *             },....
 *         ],
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
 */
// #endregion
router.post('/getStates', region_1.default.getStates);
// #region /api/app/region/getDistricts apidoc
/**
 * @api {post} /api/app/region/getDistricts Get District
 * @apiVersion 1.0.0
 * @apiName Get District
 * @apiDescription Get District
 * @apiGroup Region - App
 * @apiParam {String}      searchString            Optional searchString
 * @apiParam {Number}      fetchRecord             Optional Fetch Record
 * @apiParam {Number}      startIndex              Optional Start Index
 * @apiParam {Number}      stateId                 Optional state Id
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get District Successfully",
 *         "recordList": [
 *             {
 *               code: null
 *               "countryId": 1
 *               "countryName": "India"
 *               "createdDate": "2022-03-03T06:43:51.000Z"
 *               "id": 1
 *               "isActive": 1
 *               "isDelete": 0
 *               "modifiedDate": "2022-03-03T06:43:51.000Z"
 *               "name": "Banaskantha"
 *               "stateName" : "GUJARAT"
 *             },....
 *         ],
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
 */
// #endregion
router.post('/getDistricts', region_1.default.getDistricts);
// #region /api/app/region/getCities apidoc
/**
 * @api {post} /api/app/region/getCities Get Cities
 * @apiVersion 1.0.0
 * @apiName Get Cities
 * @apiDescription Get Cities
 * @apiGroup Region - App
 * @apiParam {String}      searchString            Optional searchString
 * @apiParam {Number}      fetchRecord             Optional Fetch Record
 * @apiParam {Number}      startIndex              Optional Start Index
 * @apiParam {Number}      countryId               Optional country Id
 * @apiParam {Number}      stateId                 Optional state Id
 * @apiParam {Number}      districtId              Optional district Id
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get Cities Successfully",
 *         "recordList": [
 *             {
 *               code: null
 *               "countryId": 1
 *               "countryName": "India"
 *               "createdDate": "2022-03-03T06:43:51.000Z"
 *               "id": 1
 *               "isActive": 1
 *               "isDelete": 0
 *               "modifiedDate": "2022-03-03T06:43:51.000Z"
 *               "name": "Banaskantha"
 *               "stateName" : "GUJARAT",
 *               "districtId": 1,
 *               "districtName": "Ahmedabad",
 *               "stateId": 1
 *               "stateName": "GUJARAT"
 *             },....
 *         ],
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
router.post('/getCities', region_1.default.getCities);
// #region /api/app/region/getRegionByPincode apidoc
/**
 * @api {post} /api/app/region/getRegionByPincode Get Region By Pincode
 * @apiVersion 1.0.0
 * @apiName Get Region By Pincode
 * @apiDescription Get Region By Pincode
 * @apiGroup Region - App
 * @apiParam {String}      searchString            Optional searchString
 * @apiParam {Number}      fetchRecord             Optional Fetch Record
 * @apiParam {Number}      startIndex              Optional Start Index
 * @apiParam {Number}      pincode                 Requires pincode
 * @apiParam {Number}      districtId              Optional district Id
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get Cities Successfully",
 *         "recordList": [
 *             {
 *               code: null
 *               "countryId": 1
 *               "countryName": "India"
 *               "createdDate": "2022-03-03T06:43:51.000Z"
 *               "id": 1
 *               "isActive": 1
 *               "isDelete": 0
 *               "modifiedDate": "2022-03-03T06:43:51.000Z"
 *               "name": "Banaskantha"
 *               "stateName" : "GUJARAT",
 *               "districtId": 1,
 *               "districtName": "Ahmedabad",
 *               "stateId": 1
 *               "stateName": "GUJARAT"
 *             },....
 *         ],
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
router.post('/getRegionByPincode', region_1.default.getRegionByPincode);
// #region /api/app/region/getRegionByPincodeAndCountryISO apidoc
/**
 * @api {post} /api/app/region/getRegionByPincodeAndCountryISO Get Region By Pincode And CountryISO
 * @apiVersion 1.0.0
 * @apiName Get Region By Pincode And CountryISO
 * @apiDescription Get Region By Pincode And CountryISO
 * @apiGroup Region - App
 * @apiParam {String}      searchString            Optional searchString
 * @apiParam {Number}      fetchRecord             Optional Fetch Record
 * @apiParam {Number}      startIndex              Optional Start Index
 * @apiParam {Number}      pincode                 Requires pincode
 * @apiParam {Number}      isoCode                 Requires isoCode
 * @apiParam {Number}      districtId              Optional district Id
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get Cities Successfully",
 *         "recordList": [
 *             {
 *               code: null
 *               "countryId": 1
 *               "countryName": "India"
 *               "createdDate": "2022-03-03T06:43:51.000Z"
 *               "id": 1
 *               "isActive": 1
 *               "isDelete": 0
 *               "modifiedDate": "2022-03-03T06:43:51.000Z"
 *               "name": "Banaskantha"
 *               "stateName" : "GUJARAT",
 *               "districtId": 1,
 *               "districtName": "Ahmedabad",
 *               "stateId": 1
 *               "stateName": "GUJARAT"
 *             },....
 *         ],
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
router.post('/getRegionByPincodeAndCountryISO', region_1.default.getRegionByPincodeAndCountryISO);
module.exports = router;
