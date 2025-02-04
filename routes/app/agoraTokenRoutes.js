"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const agoraToken_1 = __importDefault(require("../../controllers/app/agoraToken"));
const router = express_1.default.Router();
// #region /api/app/agoraToken/getAgoraToken apidoc
/**
 * @api {post} /api/app/agoraToken/getAgoraToken Get agoraToken
 * @apiVersion 1.0.0
 * @apiName Get AgoraToken
 * @apiDescription Get AgoraToken
 * @apiGroup Home - App
 * @apiParam  {Number}          uid                       Requires uid basically 0
 * @apiParam  {string}          channelName               Requires channelName basically any string
 * @apiParamExample {json} Request-Example:
 * {
 *      "uid": 0,
 *      "channelName": "xyz"
 *  }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": 200,
 *          "isDisplayMessage": true,
 *          "message": "Access Token",
 *          "recordList": "007eJxTYHh4buVFFd6JLj9UN25RX3R4uk3WzQnvMhoXH74dy8hV1LtLgcHYKDnZxNzYzCDV0Ngk2Swt0STZKNHMwjjNIC3Z1MTItFaUN5UBCMRO72NhZIBAEGBmqKisYmAAAGyyHfw=",
 *          "totalRecords": 1,
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
router.post('/getAgoraToken', agoraToken_1.default.getAgoraToken);
module.exports = router;
