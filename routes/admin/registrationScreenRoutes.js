"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const registrationscreen_1 = __importDefault(require("../../controllers/admin/registrationscreen"));
const router = express_1.default.Router();
router.post('/getRegistrationScreen', registrationscreen_1.default.getRegistrationScreen);
router.post('/toggleDisableScreen', registrationscreen_1.default.toggleDisableScreen);
router.post('/toggleSkipScreen', registrationscreen_1.default.toggleSkipScreen);
module.exports = router;
