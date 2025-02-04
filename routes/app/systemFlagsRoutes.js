"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const systemFlags_1 = __importDefault(require("../../controllers/app/systemFlags"));
const router = express_1.default.Router();
// #region /api/app/systemflags/getSystemFlagForApp apidoc
/**
 * @api {post} /api/app/systemflags/getSystemFlagForApp Get System Flag
 * @apiVersion 1.0.0
 * @apiName Get  System Flag
 * @apiDescription Get  System Flag
 * @apiGroup  System Flag - App
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Get System flag successfully",
 *         "recordList": [
 *             {
 *                 "noReplyEmail":"admin@native.software",
 *                 "noReplyName":"Matrimony Team",
 *                 ....
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
 */
// #endregion
router.post('/getSystemFlagForApp', systemFlags_1.default.getSystemFlagForApp);
// #region /api/app/systemflags/getSystemFlagForApp apidoc
/* *
*
*/
// #endregion
router.post('/getCombinedMasterData', systemFlags_1.default.getCombinedMasterData);
module.exports = router;
