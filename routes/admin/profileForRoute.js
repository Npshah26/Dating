"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
// import controller from '../../controllers/admin/documentType';
const profileFor_1 = __importDefault(require("../../controllers/admin/profileFor"));
const router = express_1.default.Router();
router.post('/getProfileFor', profileFor_1.default.getProfileFor);
router.post('/insertUpdateProfileFor', profileFor_1.default.insertUpdateProfileFor);
router.post('/activeInactiveProfileFor', profileFor_1.default.activeInactiveProfileFor);
module.exports = router;
