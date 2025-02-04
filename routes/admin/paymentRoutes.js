"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_1 = __importDefault(require("../../controllers/admin/payment"));
const router = express_1.default.Router();
router.post('/insertPaymentForPackage', payment_1.default.insertPaymentForPackage);
exports.default = router;
