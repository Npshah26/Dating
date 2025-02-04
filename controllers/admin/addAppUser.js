"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Function to read variable.json and return the data
const getVariables = (req, res, next) => {
    const filePath = path_1.default.join(__dirname, '../../variable.json');
    // Read the JSON file
    fs_1.default.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading variable.json:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to read configuration data'
            });
        }
        try {
            // Parse JSON data
            const jsonData = JSON.parse(data);
            return res.status(200).json({
                success: true,
                data: jsonData
            });
        }
        catch (parseError) {
            console.error('Error parsing variable.json:', parseError);
            return res.status(500).json({
                success: false,
                message: 'Failed to parse configuration data'
            });
        }
    });
};
exports.default = { getVariables };
