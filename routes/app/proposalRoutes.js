"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const proposal_1 = __importDefault(require("../../controllers/app/proposal"));
const router = express_1.default.Router();
// #region /api/app/proposals/getProposalsGotByMe apidoc
/**
 * @api {post} /api/app/proposals/getProposalsGotByMe Get Proposals Got By Me
 * @apiVersion 1.0.0
 * @apiName Get Proposals Got By Me
 * @apiDescription Get Proposals Got By Me
 * @apiGroup Proposals - App
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": 200,
 *          "isDisplayMessage": true,
 *          "message": "Get Proposals Got By me Successfully",
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
router.post('/getProposalsGotByMe', proposal_1.default.getProposalsGotByMe);
// #region /api/app/proposals/getProposalsSendByMe apidoc
/**
 * @api {post} /api/app/proposals/getProposalsSendByMe Get Proposals Send By Me
 * @apiVersion 1.0.0
 * @apiName Get Proposals Send By Me
 * @apiDescription Get Proposals Send By Me
 * @apiGroup Proposals - App
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "status": 200,
 *          "isDisplayMessage": true,
 *          "message": "Get Proposals Send by me Successfully",
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
 *       ],
 *          "totalRecords": 3,
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
router.post('/getProposalsSendByMe', proposal_1.default.getProposalsSendByMe);
// #region /api/app/proposals/sendProposals apidoc
/**
 * @api {post} /api/app/proposals/sendProposals Send Proposals
 * @apiVersion 1.0.0
 * @apiName Send Proposals
 * @apiDescription Send Proposals
 * @apiGroup Proposals - App
 * @apiParam  {Number}          proposalUserId                Requires proposalUserId of Proposals.
 * @apiParamExample {json} Request-Example:
 * {
 *      "proposalUserId": "24"
 *  }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *    {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Insert User Proposals",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 1,
 *             "insertId": 14,
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
 */
// #endregion
router.post('/sendProposals', proposal_1.default.sendProposals);
// #region /api/app/proposals/acceptRejectProposals apidoc
/**
 * @api {post} /api/app/proposals/acceptRejectProposals Accept Reject Proposals
 * @apiVersion 1.0.0
 * @apiName Accept Reject Proposals
 * @apiDescription Accept Reject Proposals
 * @apiGroup Proposals - App
 * @apiParam  {Number}          id                        Requires id of Proposals.
 * @apiParamExample {json} Request-Example:
 *  {
 *    "id": 8,
 *    "status": true
 *  }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Update User Proposals",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 0,
 *             "insertId": 0,
 *             "serverStatus": 2,
 *             "warningCount": 0,
 *             "message": "(Rows matched: 0  Changed: 0  Warnings: 0",
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
 */
// #endregion
router.post('/acceptRejectProposals', proposal_1.default.acceptRejectProposals);
// #region /api/app/proposals/cancelProposalRequest apidoc
/**
 * @api {post} /api/app/proposals/cancelProposalRequest Cancel Proposal Request
 * @apiVersion 1.0.0
 * @apiName Cancel Proposal Request
 * @apiDescription Cancel Proposal Request
 * @apiGroup Proposals - App
 * @apiParam  {Number}          proposalUserId                   Requires id of Proposal.
 * @apiParamExample {json} Request-Example:
 *  {
 *    "id": 8,
 *    "status": true
 *  }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Update User Proposals",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 0,
 *             "insertId": 0,
 *             "serverStatus": 2,
 *             "warningCount": 0,
 *             "message": "(Rows matched: 0  Changed: 0  Warnings: 0",
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
router.post('/cancelProposalRequest', proposal_1.default.cancelProposalRequest);
// #region /api/app/proposals/removeSentProposalRequest apidoc
/**
 * @api {post} /api/app/proposals/removeSentProposalRequest Remove Sent Proposal Request
 * @apiVersion 1.0.0
 * @apiName Remove Sent Proposal Request
 * @apiDescription Remove Sent Proposal Request
 * @apiGroup Proposals - App
 * @apiParam  {Number}          proposalUserId                   Requires id of Proposal.
 * @apiParamExample {json} Request-Example:
 *  {
 *    "id": 8,
 *    "status": true
 *  }
 * @apiSuccess (200) {JSON} Result status, message, recordList, totalRecords.
 * @apiSuccessExample {json} Success-200-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "status": 200,
 *         "isDisplayMessage": true,
 *         "message": "Remove User Sent Proposal Successfully.",
 *         "recordList": {
 *             "fieldCount": 0,
 *             "affectedRows": 0,
 *             "insertId": 0,
 *             "serverStatus": 2,
 *             "warningCount": 0,
 *             "message": "(Rows matched: 0  Changed: 0  Warnings: 0",
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
 * @apiError (400) {JSON} Result message, apiName, apiType, fileName, functionName, lineNumber, typeName, stack.
 * @apiErrorExample {json} Error-400-Response:
 *     HTTP/1.1 400 Error While Removing Data
 *     {
 *          status: 400,
 *          isDisplayMessage: <true/false>, // if the value is true then display message on screen
 *          message: "Error While Removing Data",
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
router.post('/removeSentProposalRequest', proposal_1.default.removeSentProposalRequest);
module.exports = router;
