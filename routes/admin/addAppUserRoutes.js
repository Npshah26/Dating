"use strict";
// import express from 'express';
// import addAppUserController from '../../controllers/admin/addAppUser';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// // Route to fetch variable.json data
// router.get('/api/get-variables', addAppUserController.getVariables);
// export default router;
const express_1 = __importDefault(require("express"));
const addAppUser_1 = __importDefault(require("../../controllers/admin/addAppUser")); // Adjust the path as necessary
const router = express_1.default.Router();
// Define the route
router.get('/getVariables', addAppUser_1.default.getVariables);
exports.default = router;
