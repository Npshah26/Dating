"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const blogs_1 = __importDefault(require("../../controllers/app/blogs"));
const router = express_1.default.Router();
router.post('/getBlogs', blogs_1.default.getBlogs);
router.post('/getBlogDetail', blogs_1.default.getBlogDetail);
module.exports = router;
