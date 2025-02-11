"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const home_1 = __importDefault(require("../../controllers/app/home"));
const router = express_1.default.Router();
// #region /api/app/home/getOccupation apidoc
/**
 * @api {post} /api/app/home/getOccupation Get Occupation
 * @apiVersion 1.0.0
 * @apiName Get Occupation
 * @apiDescription Get Occupation
 * @apiGroup Home - App
 * @apiParam  {Number}          id                       Requires id of Occupation. (only share if get occupation by Id otherwise not send id)
 * @apiParamExample {json} Request-Example:
 * {
 *      "id": "2"
 *  }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": 200,
 *          "isDisplayMessage": true,
 *          "message": "Get Occupation Successfully",
 *          "recordList": [
 *              {
 *                  "id": 1,
 *                  "parentId": null,
 *                  "name": "Teacher",
 *                  "isActive": 0,
 *                  "isDelete": 0,
 *                  "createdDate": "2022-10-13T11:02:56.000Z",
 *                  "modifiedDate": "2022-10-13T11:02:56.000Z",
 *                  "createdBy": 6,
 *                  "modifiedBy": 6
 *              }, ...
 *                 ],
 *          "totalRecords": 12,
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
router.post('/getOccupation', home_1.default.getOccupation);
// #region /api/app/home/getLatestProfile apidoc
/**
 * @api {post} /api/app/home/getLatestProfile Get Latest Profile
 * @apiVersion 1.0.0
 * @apiName Get Latest Profile
 * @apiDescription Get Latest Profile
 * @apiGroup Home - App
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": 200,
 *          "isDisplayMessage": true,
 *          "message": "Get All Users Successfully",
 *          "recordList": [
 *              {
 *                  "id": 55,
 *                  "firstName": null,
 *                  "middleName": null,
 *                  "lastName": null,
 *                  "gender": null,
 *                  "contactNo": "9865215789",
 *                  "email": "sumitpatel@gmail.com",
 *                  "imageUrl": null,
 *                  "isProposed": 0,
 *                  "isFavourite": 0
 *              }, ...
 *          ],
 *          "totalRecords": 7,
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
 */
// #endregion
router.post('/getLatestProfile', home_1.default.getLatestProfile);
module.exports = router;
