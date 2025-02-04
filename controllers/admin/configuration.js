"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("../../config/logging"));
const config_1 = __importDefault(require("../../config/config"));
const resultsuccess_1 = require("../../classes/response/resultsuccess");
const resulterror_1 = require("../../classes/response/resulterror");
const fs = __importStar(require("fs"));
const mysql = require('mysql');
const NAMESPACE = 'Configuration';
const getConfiguration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Getting Configuration');
        let rawData;
        try {
            rawData = fs.readFileSync('variable.json', 'utf8');
        }
        catch (err) {
            let errorResult = new resulterror_1.ResultError(400, true, "File doesn't exist", err, '');
            return next(errorResult);
        }
        let jsonData = JSON.parse(rawData);
        let result = [];
        let isTakeHostDetail;
        if (jsonData.MYSQL_DATABASE == '<MYSQL_DATABASE>') {
            isTakeHostDetail = true;
        }
        else {
            isTakeHostDetail = false;
        }
        let data = {
            isTakeHostDetail: isTakeHostDetail
        };
        result.push(data);
        if (result) {
            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Get Configuration Successfully', result, 1, '');
            return res.status(200).send(successResult);
        }
        else {
            let errorResult = new resulterror_1.ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
            next(errorResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'configuration.getConfiguration() Exception', error, '');
        next(errorResult);
    }
});
const testConnection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info('NAMESPACE', 'Getting Configuration');
        // Load configuration from file
        let rawData;
        try {
            rawData = fs.readFileSync('variable.json', 'utf8');
        }
        catch (err) {
            let errorResult = new resulterror_1.ResultError(400, true, "File doesn't exist", err, '');
            return next(errorResult);
        }
        let jsonData = JSON.parse(rawData);
        jsonData.MYSQL_HOST = req.body.MYSQL_HOST;
        jsonData.MYSQL_USER = req.body.MYSQL_USER;
        jsonData.MYSQL_PASSWORD = req.body.MYSQL_PASSWORD;
        jsonData.MYSQL_PORT = req.body.MYSQL_PORT;
        jsonData.MYSQL_DATABASE = req.body.MYSQL_DATABASE;
        // Create MySQL connection
        let connection = mysql.createConnection({
            host: jsonData.MYSQL_HOST,
            user: jsonData.MYSQL_USER,
            password: jsonData.MYSQL_PASSWORD,
            port: jsonData.MYSQL_PORT,
            database: jsonData.MYSQL_DATABASE // Select the database
        });
        let connectionClosed = false;
        const closeConnection = () => {
            if (!connectionClosed) {
                connection.end();
                connectionClosed = true;
            }
        };
        // First, test the connection
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                let errorResult = new resulterror_1.ResultError(400, true, 'Connection not established', err, '');
                return next(errorResult);
            }
            // Check if the database exists
            const databaseQuery = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?;`;
            connection.query(databaseQuery, [jsonData.MYSQL_DATABASE], (dbError, dbResults) => {
                if (dbError || dbResults.length === 0) {
                    closeConnection();
                    let errorResult = new resulterror_1.ResultError(400, true, 'Database not found', dbError, '');
                    return next(errorResult);
                }
                // Check if there are any tables in the database
                const tableQuery = `SHOW TABLES;`;
                connection.query(tableQuery, (tableError, tableResults) => {
                    if (tableError || tableResults.length === 0) {
                        closeConnection();
                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'The database exists, but it contains no data.', [], 0, '');
                        return res.status(200).send(successResult);
                    }
                    // Check if the 'application' table exists
                    const tableQuery = `SHOW TABLES LIKE 'application';`;
                    connection.query(tableQuery, (tableError, tableResults) => {
                        if (tableError || tableResults.length === 0) {
                            closeConnection();
                            let errorResult = new resulterror_1.ResultError(400, true, 'The database exists, but it contains no relevant data for this project.', tableError, '');
                            return next(errorResult);
                            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'The database exists, but it contains no data.', [], 0, '');
                            return res.status(200).send(successResult);
                        }
                        // Check if the row with id = 1 exists in the 'application' table
                        const checkRowQuery = `SELECT * FROM application WHERE id = 1 and name ="MatrimonyAdmin";`;
                        connection.query(checkRowQuery, (rowError, rowResults) => {
                            if (rowError || rowResults.length === 0) {
                                closeConnection();
                                let errorResult = new resulterror_1.ResultError(400, true, 'application table exists, but row with name = MatrimonyAdmin not found', rowError, '');
                                return next(errorResult);
                            }
                            // If row with id = 1 is found, start the version-checking flow
                            logging_1.default.info('NAMESPACE', 'Row with name =MatrimonyAdmin found. Starting version check flow.');
                            const maxIdQuery = `SELECT MAX(id) AS maxId FROM systemflags;`;
                            connection.query(maxIdQuery, (maxIdError, maxIdResults) => {
                                var _a;
                                if (maxIdError) {
                                    console.warn('Error executing max id query:', maxIdError.message);
                                    closeConnection();
                                    let errorResult = new resulterror_1.ResultError(500, true, 'Error retrieving max id from systemflags', maxIdError, '');
                                    return next(errorResult);
                                }
                                const maxId = (_a = maxIdResults[0]) === null || _a === void 0 ? void 0 : _a.maxId;
                                if (maxId === null || maxId === undefined) {
                                    closeConnection();
                                    let errorResult = new resulterror_1.ResultError(400, true, 'No entries found in systemflags', err, '');
                                    return next(errorResult);
                                }
                                // Determine version based on maxId
                                let detectedVersion = null;
                                if (maxId >= 92) {
                                    detectedVersion = '1.7';
                                }
                                else if (maxId >= 73) {
                                    detectedVersion = '1.6';
                                }
                                else if (maxId >= 60) {
                                    detectedVersion = '1.5';
                                }
                                else if (maxId >= 46) {
                                    detectedVersion = '1.4';
                                }
                                else if (maxId >= 44) {
                                    detectedVersion = '1.3';
                                }
                                else if (maxId >= 35) {
                                    detectedVersion = '1.2';
                                }
                                else if (maxId >= 19) {
                                    detectedVersion = '1.1';
                                }
                                else if (maxId >= 18) {
                                    detectedVersion = '1.0';
                                }
                                // Handle the detected version result
                                closeConnection();
                                if (detectedVersion) {
                                    logging_1.default.info('NAMESPACE', `Detected version: ${detectedVersion}`); // Log detected version
                                    let successResult = new resultsuccess_1.ResultSuccess(200, true, `Detected version: ${detectedVersion}`, [`${detectedVersion}`], 0, '');
                                    return res.status(200).send(successResult);
                                }
                                else {
                                    let errorResult = new resulterror_1.ResultError(400, true, 'No compatible version found based on max id', err, '');
                                    return next(errorResult);
                                }
                            });
                        });
                    });
                });
            });
        });
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'configuration.testConnection() Exception', error, '');
        return next(errorResult);
    }
});
const databaseConfiguration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Database Configuration');
        let rawData;
        try {
            rawData = fs.readFileSync('variable.json', 'utf8');
        }
        catch (err) {
            let errorResult = new resulterror_1.ResultError(400, true, "File doesn't exist", err, '');
            return next(errorResult);
        }
        let jsonData = JSON.parse(rawData);
        jsonData.MYSQL_HOST = req.body.hostName;
        jsonData.MYSQL_USER = req.body.username;
        jsonData.MYSQL_PASSWORD = req.body.password;
        jsonData.MYSQL_PORT = req.body.port;
        jsonData.MYSQL_DATABASE = req.body.MYSQL_DATABASE;
        let versions = ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7'];
        let connection = mysql.createConnection({
            host: jsonData.MYSQL_HOST,
            user: jsonData.MYSQL_USER,
            password: jsonData.MYSQL_PASSWORD,
            port: jsonData.MYSQL_PORT
        });
        connection.connect((err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Error connecting to MySQL:', err);
                let errorResult = new resulterror_1.ResultError(400, true, 'Connection not established', new Error('Connection not established'), '');
                next(errorResult);
            }
            else {
                if (jsonData.MYSQL_DATABASE != '<MYSQL_DATABASE>') {
                    if (req.body.MYSQL_DATABASE != jsonData.MYSQL_DATABASE) {
                        jsonData.MYSQL_DATABASE = req.body.MYSQL_DATABASE;
                        connection.query(`RENAME DATABASE '` + jsonData.MYSQL_DATABASE + `' TO '` + req.body.MYSQL_DATABASE + `'`);
                    }
                }
                else {
                }
                jsonData.MYSQL_DATABASE = req.body.MYSQL_DATABASE;
                try {
                    if (!req.body.version) {
                        connection.beginTransaction();
                        fs.access('config/databasescripts/fullsetup.sql', fs.constants.F_OK, (err) => __awaiter(void 0, void 0, void 0, function* () {
                            if (err) {
                                let errorResult = new resulterror_1.ResultError(400, true, "File doesn't exist", new Error("File doesn't exist"), '');
                                next(errorResult);
                            }
                            else {
                                let rawData = fs.readFileSync('config/databasescripts/fullsetup.sql', 'utf8');
                                // let query = `CREATE DATABASE ` + req.body.MYSQL_DATABASE;
                                let currentStatement = '';
                                let withinQuotes = false;
                                const queries = [];
                                let previousChar = '';
                                for (const char of rawData) {
                                    currentStatement += char;
                                    if (char === "'" && previousChar !== "\\") {
                                        withinQuotes = !withinQuotes;
                                    }
                                    if (char === ';' && !withinQuotes) {
                                        queries.push(currentStatement.trim());
                                        currentStatement = '';
                                    }
                                    previousChar = char;
                                }
                                if (currentStatement.trim().length > 0) {
                                    queries.push(currentStatement.trim());
                                }
                                if (req.body.isCreateDatabaseUser) {
                                    let query = `CREATE USER '` + req.body.username + `'@'%'  IDENTIFIED WITH mysql_native_password BY '` + req.body.password + `';`;
                                    connection.query(query, function (error, results, fields) {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            if (err) {
                                                jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                // let dropres = await connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
                                                // connection1.rollback();
                                                let errorResult = new resulterror_1.ResultError(400, true, err, new Error(err), '');
                                                next(errorResult);
                                            }
                                            else {
                                                let query = "CREATE DATABASE `" + req.body.MYSQL_DATABASE + "`";
                                                connection.query(query, function (error, results, fields) {
                                                    return __awaiter(this, void 0, void 0, function* () {
                                                        if (err) {
                                                            jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                            jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                            jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                            jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                            jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                            yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                            // let dropres = await connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
                                                            // connection1.rollback();
                                                            let errorResult = new resulterror_1.ResultError(400, true, err, new Error(err), '');
                                                            next(errorResult);
                                                        }
                                                        else {
                                                            let permissionQuery = `GRANT ALL PRIVILEGES ON ` + req.body.MYSQL_DATABASE + `.* TO ` + req.body.username + `@'%' WITH GRANT OPTION;`;
                                                            yield connection.query(`FLUSH PRIVILEGES;`);
                                                            connection.query(permissionQuery, function (error, results, fields) {
                                                                return __awaiter(this, void 0, void 0, function* () {
                                                                    if (error) {
                                                                        jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                                        jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                                        jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                                        jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                                        jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                                        yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                                        let dropuser = yield connection.query(`DROP USER '` + req.body.username + `'@'%'`);
                                                                        let dropres = yield connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
                                                                        console.log(error);
                                                                        let errorResult = new resulterror_1.ResultError(400, true, error, new Error(error), '');
                                                                        next(errorResult);
                                                                        return;
                                                                    }
                                                                    else {
                                                                        let connection1 = mysql.createConnection({
                                                                            host: jsonData.MYSQL_HOST,
                                                                            user: req.body.username,
                                                                            password: req.body.password,
                                                                            database: req.body.MYSQL_DATABASE,
                                                                            port: req.body.MYSQL_PORT
                                                                        });
                                                                        jsonData.MYSQL_USER = req.body.username;
                                                                        jsonData.MYSQL_PASSWORD = req.body.password;
                                                                        connection1.connect((err) => __awaiter(this, void 0, void 0, function* () {
                                                                            if (err) {
                                                                                jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                                                jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                                                jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                                                jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                                                jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                                                yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                                                let dropres = yield connection1.query(`DROP database ` + req.body.MYSQL_DATABASE);
                                                                                let dropuser = yield connection1.query(`DROP USER '` + req.body.username + `'@'%'`);
                                                                                connection1.rollback();
                                                                                let errorResult = new resulterror_1.ResultError(400, true, err, new Error(err), '');
                                                                                next(errorResult);
                                                                            }
                                                                            else {
                                                                                let errorOccurred = false;
                                                                                for (let i = 0; i < queries.length; i++) {
                                                                                    if (errorOccurred) {
                                                                                        break;
                                                                                    }
                                                                                    connection1.query(queries[i], function (error, results, fields) {
                                                                                        return __awaiter(this, void 0, void 0, function* () {
                                                                                            if (error) {
                                                                                                jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                                                                jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                                                                jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                                                                jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                                                                jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                                                                yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                                                                errorOccurred = true;
                                                                                                let dropres = yield connection1.query(`DROP database ` + req.body.MYSQL_DATABASE);
                                                                                                let dropuser = yield connection1.query(`DROP USER '` + req.body.username + `'@'%'`);
                                                                                                connection1.rollback();
                                                                                                let errorResult = new resulterror_1.ResultError(400, true, error, new Error(error), '');
                                                                                                next(errorResult);
                                                                                                return;
                                                                                            }
                                                                                            else {
                                                                                                if (results && i == (queries.length - 1)) {
                                                                                                    let adminUserQuery = `SELECT users.* FROM users INNER JOIN userroles ON users.id = userroles.userId WHERE userroles.roleId = 1`;
                                                                                                    connection1.query(adminUserQuery, function (error, results, fields) {
                                                                                                        return __awaiter(this, void 0, void 0, function* () {
                                                                                                            if (error) {
                                                                                                                jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                                                                                jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                                                                                jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                                                                                jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                                                                                jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                                                                                yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                                                                                let dropres = yield connection1.query(`DROP database ` + req.body.MYSQL_DATABASE);
                                                                                                                let dropuser = yield connection1.query(`DROP USER '` + req.body.username + `'@'%'`);
                                                                                                            }
                                                                                                            else {
                                                                                                                yield fs.promises.writeFile('variable.json', JSON.stringify(jsonData));
                                                                                                                config_1.default.mysql.database = req.body.database;
                                                                                                                config_1.default.mysql.host = req.body.MYSQL_HOST;
                                                                                                                config_1.default.mysql.password = req.body.password;
                                                                                                                config_1.default.mysql.user = req.body.username;
                                                                                                                config_1.default.mysql.port = req.body.MYSQL_PORT;
                                                                                                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Database Configuration Successfully', results, 1, '');
                                                                                                                return res.status(200).send(successResult);
                                                                                                            }
                                                                                                        });
                                                                                                    });
                                                                                                }
                                                                                            }
                                                                                        });
                                                                                    });
                                                                                }
                                                                            }
                                                                        }));
                                                                        // }
                                                                        // });
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }
                                else {
                                    let query = "CREATE DATABASE `" + req.body.MYSQL_DATABASE + "`";
                                    connection.query(query, function (error, results, fields) {
                                        return __awaiter(this, void 0, void 0, function* () {
                                            if (err) {
                                                jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                let errorResult = new resulterror_1.ResultError(400, true, err, new Error(err), '');
                                                next(errorResult);
                                            }
                                            else {
                                                let connection1 = mysql.createConnection({
                                                    host: jsonData.MYSQL_HOST,
                                                    user: jsonData.MYSQL_USER,
                                                    password: jsonData.MYSQL_PASSWORD,
                                                    database: req.body.MYSQL_DATABASE,
                                                    port: req.body.MYSQL_PORT
                                                });
                                                connection1.connect((err) => __awaiter(this, void 0, void 0, function* () {
                                                    if (err) {
                                                        let dropres = yield connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
                                                        jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                        jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                        jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                        jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                        jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                        yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                        connection1.rollback();
                                                        let errorResult = new resulterror_1.ResultError(400, true, err, new Error(err), '');
                                                        next(errorResult);
                                                        return;
                                                    }
                                                    else {
                                                        let errorOccurred = false;
                                                        for (let i = 0; i < queries.length; i++) {
                                                            if (errorOccurred) {
                                                                break;
                                                            }
                                                            connection1.query(queries[i], function (error, results, fields) {
                                                                return __awaiter(this, void 0, void 0, function* () {
                                                                    if (error) {
                                                                        let dropres = yield connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
                                                                        jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                                        jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                                        jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                                        jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                                        jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                                        yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                                        errorOccurred = true;
                                                                        connection1.rollback();
                                                                        let errorResult = new resulterror_1.ResultError(400, true, error, new Error(error), '');
                                                                        next(errorResult);
                                                                        return;
                                                                    }
                                                                    else {
                                                                        if (results && i == (queries.length - 1)) {
                                                                            let adminUserQuery = `SELECT users.* FROM users INNER JOIN userroles ON users.id = userroles.userId WHERE userroles.roleId = 1`;
                                                                            connection1.query(adminUserQuery, function (error, results, fields) {
                                                                                return __awaiter(this, void 0, void 0, function* () {
                                                                                    if (error) {
                                                                                        let dropres = yield connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
                                                                                        jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                                                        jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                                                        jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                                                        jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                                                        jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                                                        yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                                                    }
                                                                                    else {
                                                                                        yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Database Configuration Successfully', results, 1, '');
                                                                                        return res.status(200).send(successResult);
                                                                                    }
                                                                                });
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    }
                                                }));
                                            }
                                        });
                                    });
                                }
                            }
                        }));
                    }
                    else {
                        let connection1 = mysql.createConnection({
                            host: jsonData.MYSQL_HOST,
                            user: jsonData.MYSQL_USER,
                            password: jsonData.MYSQL_PASSWORD,
                            database: req.body.MYSQL_DATABASE,
                            port: req.body.MYSQL_PORT
                        });
                        connection1.connect((err) => __awaiter(void 0, void 0, void 0, function* () {
                            if (err) {
                                jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                jsonData.MYSQL_USER = '<MYSQL_USER>';
                                jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                let errorResult = new resulterror_1.ResultError(400, true, err, new Error(err), '');
                                next(errorResult);
                                return;
                            }
                            else {
                                let errorOccurred = false;
                                let versionIndex = versions.findIndex(c => c == req.body.version);
                                for (let index = versionIndex + 1; index < versions.length; index++) {
                                    if (errorOccurred) {
                                        break;
                                    }
                                    let fileIndex = versions[index].replace('.', '_');
                                    fs.access('config/databasescripts/version' + fileIndex + '.sql', fs.constants.F_OK, (err) => __awaiter(void 0, void 0, void 0, function* () {
                                        if (err) {
                                            connection1.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, "File doesn't exist", new Error("File doesn't exist"), '');
                                            next(errorResult);
                                            return;
                                        }
                                        else {
                                            let rawData = fs.readFileSync('config/databasescripts/version' + fileIndex + '.sql', 'utf8');
                                            const queries = [];
                                            let previousChar = '';
                                            let currentStatement = '';
                                            let withinQuotes = false;
                                            for (const char of rawData) {
                                                currentStatement += char;
                                                if (char === "'" && previousChar !== "\\") {
                                                    withinQuotes = !withinQuotes;
                                                }
                                                if (char === ';' && !withinQuotes) {
                                                    queries.push(currentStatement.trim());
                                                    currentStatement = '';
                                                }
                                                previousChar = char;
                                            }
                                            if (currentStatement.trim().length > 0) {
                                                queries.push(currentStatement.trim());
                                            }
                                            if (queries && queries.length > 0) {
                                                for (let i = 0; i < queries.length; i++) {
                                                    if (errorOccurred) {
                                                        break;
                                                    }
                                                    yield connection1.query(queries[i], function (error, results, fields) {
                                                        return __awaiter(this, void 0, void 0, function* () {
                                                            if (error) {
                                                                errorOccurred = true;
                                                                connection1.rollback();
                                                                let errorResult = new resulterror_1.ResultError(400, true, error, new Error(error), '');
                                                                next(errorResult);
                                                                return;
                                                            }
                                                            else {
                                                                if (results && i == (queries.length - 1) && index == versions.length - 1) {
                                                                    let adminUserQuery = `SELECT users.* FROM users INNER JOIN userroles ON users.id = userroles.userId WHERE userroles.roleId = 1`;
                                                                    connection1.query(adminUserQuery, function (error, results, fields) {
                                                                        return __awaiter(this, void 0, void 0, function* () {
                                                                            if (error) {
                                                                                // let dropres = await connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
                                                                                jsonData.MYSQL_HOST = '<MYSQL_HOST>';
                                                                                jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
                                                                                jsonData.MYSQL_USER = '<MYSQL_USER>';
                                                                                jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
                                                                                jsonData.MYSQL_PORT = '<MYSQL_PORT>';
                                                                                yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                                            }
                                                                            else {
                                                                                yield fs.writeFileSync('variable.json', JSON.stringify(jsonData));
                                                                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Database Configuration Successfully', results, 1, '');
                                                                                return res.status(200).send(successResult);
                                                                            }
                                                                        });
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    });
                                                }
                                            }
                                        }
                                    }));
                                }
                            }
                        }));
                    }
                }
                catch (error) {
                    let errorResult = new resulterror_1.ResultError(400, true, error, new Error(error), '');
                    next(errorResult);
                }
            }
        }));
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'configuration.databaseConfiguration() Exception', error, '');
        next(errorResult);
    }
});
const installMasterData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Install MasterData');
        let rawData = fs.readFileSync('variable.json', 'utf8');
        let jsonData = JSON.parse(rawData);
        let versions = ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7'];
        if (!req.body.version) {
            let rawData = fs.readFileSync('config/databasescripts/fullmasterdata.sql', 'utf8');
            let currentStatement = '';
            let withinQuotes = false;
            const queries = [];
            let previousChar = '';
            for (const char of rawData) {
                currentStatement += char;
                if (char === "'" && previousChar !== "\\") {
                    withinQuotes = !withinQuotes;
                }
                if (char === ';' && !withinQuotes) {
                    queries.push(currentStatement.trim());
                    currentStatement = '';
                }
                previousChar = char;
            }
            if (currentStatement.trim().length > 0) {
                queries.push(currentStatement.trim());
            }
            if (queries && queries.length > 0) {
                let connection = mysql.createConnection({
                    host: jsonData.MYSQL_HOST,
                    user: jsonData.MYSQL_USER,
                    password: jsonData.MYSQL_PASSWORD,
                    database: jsonData.MYSQL_DATABASE,
                    port: jsonData.MYSQL_PORT
                });
                let errorOccurred = false;
                for (let i = 0; i < queries.length; i++) {
                    if (errorOccurred) {
                        break;
                    }
                    try {
                        connection.query(queries[i], function (error, results, fields) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (error) {
                                    errorOccurred = true;
                                    yield connection.rollback();
                                    let errorResult = new resulterror_1.ResultError(400, true, error, new Error(error), '');
                                    next(errorResult);
                                }
                                else {
                                    if (results && i == (queries.length - 1)) {
                                        let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Install MasterData Successfully', results, 1, '');
                                        return res.status(200).send(successResult);
                                    }
                                }
                            });
                        });
                    }
                    catch (error) {
                        yield connection.rollback();
                        let errorResult = new resulterror_1.ResultError(400, true, error, new Error(error), '');
                        next(errorResult);
                        break;
                    }
                }
            }
            else {
                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Install MasterData Successfully', [], 1, '');
                return res.status(200).send(successResult);
            }
        }
        else {
            let connection = mysql.createConnection({
                host: jsonData.MYSQL_HOST,
                user: jsonData.MYSQL_USER,
                password: jsonData.MYSQL_PASSWORD,
                database: jsonData.MYSQL_DATABASE,
                port: jsonData.MYSQL_PORT
            });
            // connection.query(`SELECT value FROM systemflags WHERE name = 'latestVersion'`, async function (error: any, results: any, fields: any) {
            //     if (error) {
            //         await connection.rollback();
            //         let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
            //         next(errorResult);
            //     }
            //     else {
            let versionIndex = versions.findIndex(c => c == req.body.version);
            for (let index = versionIndex + 1; index < versions.length; index++) {
                let fileIndex = versions[index].replace('.', '_');
                fs.access('config/databasescripts/masterData' + fileIndex + '.sql', fs.constants.F_OK, (err) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        // let errorResult = new ResultError(400, true, "File doesn't exist", new Error("File doesn't exist"), '');
                        // next(errorResult);
                        // return;
                    }
                    else {
                        let rawData = fs.readFileSync('config/databasescripts/masterData' + fileIndex + '.sql', 'utf8');
                        const queries = [];
                        let previousChar = '';
                        let currentStatement = '';
                        let withinQuotes = false;
                        for (const char of rawData) {
                            currentStatement += char;
                            if (char === "'" && previousChar !== "\\") {
                                withinQuotes = !withinQuotes;
                            }
                            if (char === ';' && !withinQuotes) {
                                queries.push(currentStatement.trim());
                                currentStatement = '';
                            }
                            previousChar = char;
                        }
                        if (currentStatement.trim().length > 0) {
                            queries.push(currentStatement.trim());
                        }
                        let errorOccurred = false;
                        if (queries && queries.length > 0) {
                            for (let i = 0; i < queries.length; i++) {
                                connection.query(queries[i], function (error, result, fields) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        if (error) {
                                            errorOccurred = true;
                                            connection.rollback();
                                            let errorResult = new resulterror_1.ResultError(400, true, error, new Error(error), '');
                                            next(errorResult);
                                        }
                                        else {
                                            if (result && i == (queries.length - 1) && index == versions.length - 1) {
                                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Install MasterData Successfully', result, 1, '');
                                                return res.status(200).send(successResult);
                                            }
                                        }
                                    });
                                });
                            }
                        }
                        else {
                            if (index == versions.length - 1) {
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Install MasterData Successfully', [], 1, '');
                                return res.status(200).send(successResult);
                            }
                        }
                    }
                }));
            }
            // }
            // });
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'configuration.installMasterData() Exception', error, '');
        next(errorResult);
    }
});
const installSampleData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logging_1.default.info(NAMESPACE, 'Install SampleData');
        let json = fs.readFileSync('variable.json', 'utf8');
        let jsonData = JSON.parse(json);
        // if (!req.body.version) {
        let rawData = fs.readFileSync('config/databasescripts/fullsampledata.sql', 'utf8');
        const queries = [];
        let previousChar = '';
        let currentStatement = '';
        let withinQuotes = false;
        for (const char of rawData) {
            currentStatement += char;
            if (char === "'" && previousChar !== "\\") {
                withinQuotes = !withinQuotes;
            }
            if (char === ';' && !withinQuotes) {
                queries.push(currentStatement.trim());
                currentStatement = '';
            }
            previousChar = char;
        }
        if (currentStatement.trim().length > 0) {
            queries.push(currentStatement.trim());
        }
        let connection = mysql.createConnection({
            host: jsonData.MYSQL_HOST,
            user: jsonData.MYSQL_USER,
            password: jsonData.MYSQL_PASSWORD,
            database: jsonData.MYSQL_DATABASE,
            port: jsonData.MYSQL_PORT
        });
        if (queries && queries.length > 0) {
            let errorOccurred = false;
            for (let i = 0; i < queries.length; i++) {
                if (errorOccurred) {
                    break;
                }
                connection.query(queries[i], function (error, results, fields) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (error) {
                            errorOccurred = true;
                            connection.rollback();
                            let errorResult = new resulterror_1.ResultError(400, true, error, new Error(error), '');
                            next(errorResult);
                        }
                        else {
                            if (results && i == (queries.length - 1)) {
                                let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Install SampleData Successfully', results, 1, '');
                                return res.status(200).send(successResult);
                            }
                        }
                    });
                });
            }
        }
        else {
            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Install SampleData Successfully', [], 1, '');
            return res.status(200).send(successResult);
        }
        // }
        // else {
        //     let connection = mysql.createConnection({
        //         host: jsonData.MYSQL_HOST,
        //         user: jsonData.MYSQL_USER,
        //         password: jsonData.MYSQL_PASSWORD,
        //         database: jsonData.MYSQL_DATABASE
        //     });
        //     connection.query(`SELECT value FROM systemflags WHERE name = 'latestVersion'`, async function (error: any, results: any, fields: any) {
        //         if (error) {
        //             connection.rollback();
        //             let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
        //             next(errorResult);
        //         }
        //         else {
        //             for (let index = parseInt(req.body.version) + 1; index <= results[0].value; index++) {
        //                 fs.access('sampledata_' + index + '.sql', fs.constants.F_OK, async (err) => {
        //                     if (err) {
        //                         let errorResult = new ResultError(400, true, "File doesn't exist", new Error("File doesn't exist"), '');
        //                         next(errorResult);
        //                         return;
        //                     } else {
        //                         let rawData = fs.readFileSync('sampledata_' + index + '.sql', 'utf8');
        //                         const queries = [];
        //                         let previousChar = '';
        //                         let currentStatement = '';
        //                         let withinQuotes = false;
        //                         for (const char of rawData) {
        //                             currentStatement += char;
        //                             if (char === "'" && previousChar !== "\\") {
        //                                 withinQuotes = !withinQuotes;
        //                             }
        //                             if (char === ';' && !withinQuotes) {
        //                                 queries.push(currentStatement.trim());
        //                                 currentStatement = '';
        //                             }
        //                             previousChar = char;
        //                         }
        //                         if (currentStatement.trim().length > 0) {
        //                             queries.push(currentStatement.trim());
        //                         }
        //                         if (queries && queries.length > 0) {
        //                             for (let i = 0; i < queries.length; i++) {
        //                                 connection.query(queries[i], async function (error: any, result: any, fields: any) {
        //                                     if (error) {
        //                                         connection.rollback();
        //                                         let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
        //                                         next(errorResult);
        //                                     }
        //                                     else {
        //                                         if (result && i == (queries.length - 1) && index == results[0].value) {
        //                                             let successResult = new ResultSuccess(200, true, 'Install SampleData Successfully', results, 1, '');
        //                                             return res.status(200).send(successResult);
        //                                         }
        //                                     }
        //                                 });
        //                             }
        //                         }
        //                         else {
        //                             if (index == results[0].value) {
        //                                 let successResult = new ResultSuccess(200, true, 'Install SampleData Successfully', results, 1, '');
        //                                 return res.status(200).send(successResult);
        //                             }
        //                         }
        //                     }
        //                 });
        //             }
        //         }
        //     });
        // }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'configuration.installSampleData() Exception', error, '');
        next(errorResult);
    }
});
const restartConnection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = true;
        Object.keys(require.cache).forEach(function (key) {
            delete require.cache[key];
        });
        let rawData = fs.readFileSync('variable.json', 'utf8');
        let jsonData = JSON.parse(rawData);
        console.log(jsonData);
        if (jsonData.MYSQL_DATABASE == req.body.MYSQL_DATABASE) {
            let connection = mysql.createConnection({
                host: jsonData.MYSQL_HOST,
                user: jsonData.MYSQL_USER,
                password: jsonData.MYSQL_PASSWORD,
                database: jsonData.MYSQL_DATABASE,
                port: jsonData.MYSQL_PORT
            });
            connection.end((err) => {
                if (err) {
                    let errorResult = new resulterror_1.ResultError(400, true, err, new Error(err), '');
                    next(errorResult);
                }
                else {
                    let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Restart Connection Successfully', result, 1, '');
                    return res.status(200).send(successResult);
                }
            });
        }
        else {
            result = false;
            let successResult = new resultsuccess_1.ResultSuccess(200, true, 'Restart Connection Successfully', result, 1, '');
            return res.status(200).send(successResult);
        }
    }
    catch (error) {
        let errorResult = new resulterror_1.ResultError(500, true, 'configuration.restartConnection() Exception', error, '');
        next(errorResult);
    }
});
exports.default = { getConfiguration, testConnection, databaseConfiguration, installMasterData, installSampleData, restartConnection };
// const databaseConfiguration = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Database Configuration');
//         let rawData = fs.readFileSync('variable.json', 'utf8');
//         let jsonData = JSON.parse(rawData);
//         let versions = ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6','1.7'];
//         let connection = mysql.createConnection({
//             host: jsonData.MYSQL_HOST,
//             user: jsonData.MYSQL_USER,
//             password: jsonData.MYSQL_PASSWORD,
//             port: jsonData.MYSQL_PORT
//         });
//         connection.connect(async (err: any) => {
//             if (err) {
//                 console.error('Error connecting to MySQL:', err);
//                 let errorResult = new ResultError(400, true, 'Connection not established', new Error('Connection not established'), '');
//                 next(errorResult);
//             } else {
//                 if (jsonData.MYSQL_DATABASE != '<MYSQL_DATABASE>') {
//                     if (req.body.MYSQL_DATABASE != jsonData.MYSQL_DATABASE) {
//                         jsonData.MYSQL_DATABASE = req.body.MYSQL_DATABASE;
//                         connection.query(`RENAME DATABASE '` + jsonData.MYSQL_DATABASE + `' TO '` + req.body.MYSQL_DATABASE + `'`);
//                     }
//                 } else {
//                 }
//                 jsonData.MYSQL_DATABASE = req.body.MYSQL_DATABASE;
//                 try {
//                     if (!req.body.version) {
//                         connection.beginTransaction();
//                         fs.access('config/databasescripts/fullsetup.sql', fs.constants.F_OK, async (err) => {
//                             if (err) {
//                                 let errorResult = new ResultError(400, true, "File doesn't exist", new Error("File doesn't exist"), '');
//                                 next(errorResult);
//                             } else {
//                                 let rawData = fs.readFileSync('config/databasescripts/fullsetup.sql', 'utf8');
//                                 // let query = `CREATE DATABASE ` + req.body.MYSQL_DATABASE;
//                                 let currentStatement = '';
//                                 let withinQuotes = false;
//                                 const queries: string[] = [];
//                                 let previousChar = '';
//                                 for (const char of rawData) {
//                                     currentStatement += char;
//                                     if (char === "'" && previousChar !== '\\') {
//                                         withinQuotes = !withinQuotes;
//                                     }
//                                     if (char === ';' && !withinQuotes) {
//                                         queries.push(currentStatement.trim());
//                                         currentStatement = '';
//                                     }
//                                     previousChar = char;
//                                 }
//                                 if (currentStatement.trim().length > 0) {
//                                     queries.push(currentStatement.trim());
//                                 }
//                                 if (req.body.isCreateDatabaseUser) {
//                                     let query = `CREATE USER '` + req.body.username + `'@'%'  IDENTIFIED WITH mysql_native_password BY '` + req.body.password + `';`;
//                                     // let userconnection = mysql.createConnection({
//                                     //     host: jsonData.MYSQL_HOST,
//                                     //     user: req.body.username,
//                                     //     password: req.body.password,
//                                     // })
//                                     connection.query(query, async function (error: any, results: any, fields: any) {
//                                         if (err) {
//                                             jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                             jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                             jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                             jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                             jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                             await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                             // let dropres = await connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
//                                             // connection1.rollback();
//                                             let errorResult = new ResultError(400, true, err, new Error(err), '');
//                                             next(errorResult);
//                                         } else {
//                                             let query = 'CREATE DATABASE `' + req.body.MYSQL_DATABASE + '`';
//                                             connection.query(query, async function (error: any, results: any, fields: any) {
//                                                 if (err) {
//                                                     jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                                     jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                                     jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                                     jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                                     jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                                     await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                     // let dropres = await connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
//                                                     // connection1.rollback();
//                                                     let errorResult = new ResultError(400, true, err, new Error(err), '');
//                                                     next(errorResult);
//                                                 } else {
//                                                     let permissionQuery = `GRANT ALL PRIVILEGES ON ` + req.body.MYSQL_DATABASE + `.* TO ` + req.body.username + `@'%' WITH GRANT OPTION;`;
//                                                     await connection.query(`FLUSH PRIVILEGES;`);
//                                                     connection.query(permissionQuery, async function (error: any, results: any, fields: any) {
//                                                         if (error) {
//                                                             jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                                             jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                                             jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                                             jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                                             jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                                             await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                             let dropuser = await connection.query(`DROP USER '` + req.body.username + `'@'%'`);
//                                                             let dropres = await connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
//                                                             console.log(error);
//                                                             let errorResult = new ResultError(400, true, error, new Error(error), '');
//                                                             next(errorResult);
//                                                             return;
//                                                         } else {
//                                                             let connection1 = mysql.createConnection({
//                                                                 host: jsonData.MYSQL_HOST,
//                                                                 user: req.body.username,
//                                                                 password: req.body.password,
//                                                                 database: req.body.MYSQL_DATABASE,
//                                                                 port: req.body.MYSQL_PORT
//                                                             });
//                                                             jsonData.MYSQL_USER = req.body.username;
//                                                             jsonData.MYSQL_PASSWORD = req.body.password;
//                                                             connection1.connect(async (err: any) => {
//                                                                 if (err) {
//                                                                     jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                                                     jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                                                     jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                                                     jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                                                     jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                                                     await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                                     let dropres = await connection1.query(`DROP database ` + req.body.MYSQL_DATABASE);
//                                                                     let dropuser = await connection1.query(`DROP USER '` + req.body.username + `'@'%'`);
//                                                                     connection1.rollback();
//                                                                     let errorResult = new ResultError(400, true, err, new Error(err), '');
//                                                                     next(errorResult);
//                                                                 } else {
//                                                                     let errorOccurred = false;
//                                                                     for (let i = 0; i < queries.length; i++) {
//                                                                         if (errorOccurred) {
//                                                                             break;
//                                                                         }
//                                                                         connection1.query(queries[i], async function (error: any, results: any, fields: any) {
//                                                                             if (error) {
//                                                                                 jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                                                                 jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                                                                 jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                                                                 jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                                                                 jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                                                                 await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                                                 errorOccurred = true;
//                                                                                 let dropres = await connection1.query(`DROP database ` + req.body.MYSQL_DATABASE);
//                                                                                 let dropuser = await connection1.query(`DROP USER '` + req.body.username + `'@'%'`);
//                                                                                 connection1.rollback();
//                                                                                 let errorResult = new ResultError(400, true, error, new Error(error), '');
//                                                                                 next(errorResult);
//                                                                                 return;
//                                                                             } else {
//                                                                                 if (results && i == queries.length - 1) {
//                                                                                     let adminUserQuery = `SELECT users.* FROM users INNER JOIN userroles ON users.id = userroles.userId WHERE userroles.roleId = 1`;
//                                                                                     connection1.query(adminUserQuery, async function (error: any, results: any, fields: any) {
//                                                                                         if (error) {
//                                                                                             jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                                                                             jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                                                                             jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                                                                             jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                                                                             jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                                                                             await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                                                             let dropres = await connection1.query(`DROP database ` + req.body.MYSQL_DATABASE);
//                                                                                             let dropuser = await connection1.query(`DROP USER '` + req.body.username + `'@'%'`);
//                                                                                         } else {
//                                                                                             await fs.promises.writeFile('variable.json', JSON.stringify(jsonData));
//                                                                                             config.mysql.database = req.body.database;
//                                                                                             config.mysql.host = req.body.MYSQL_HOST;
//                                                                                             config.mysql.password = req.body.password;
//                                                                                             config.mysql.user = req.body.username;
//                                                                                             config.mysql.port = req.body.MYSQL_PORT;
//                                                                                             let successResult = new ResultSuccess(200, true, 'Database Configuration Successfully', results, 1, '');
//                                                                                             return res.status(200).send(successResult);
//                                                                                         }
//                                                                                     });
//                                                                                 }
//                                                                             }
//                                                                         });
//                                                                     }
//                                                                 }
//                                                             });
//                                                             // }
//                                                             // });
//                                                         }
//                                                     });
//                                                 }
//                                             });
//                                         }
//                                     });
//                                     // connection = mysql.createConnection({
//                                     //     host: jsonData.MYSQL_HOST,
//                                     //     user: req.body.username,
//                                     //     password: req.body.password,
//                                     // });
//                                 } else {
//                                     let query = 'CREATE DATABASE `' + req.body.MYSQL_DATABASE + '`';
//                                     connection.query(query, async function (error: any, results: any, fields: any) {
//                                         if (err) {
//                                             jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                             jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                             jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                             jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                             jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                             await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                             let errorResult = new ResultError(400, true, err, new Error(err), '');
//                                             next(errorResult);
//                                         } else {
//                                             let connection1 = mysql.createConnection({
//                                                 host: jsonData.MYSQL_HOST,
//                                                 user: jsonData.MYSQL_USER,
//                                                 password: jsonData.MYSQL_PASSWORD,
//                                                 database: req.body.MYSQL_DATABASE,
//                                                 port: req.body.MYSQL_PORT
//                                             });
//                                             connection1.connect(async (err: any) => {
//                                                 if (err) {
//                                                     let dropres = await connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
//                                                     jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                                     jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                                     jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                                     jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                                     jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                                     await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                     connection1.rollback();
//                                                     let errorResult = new ResultError(400, true, err, new Error(err), '');
//                                                     next(errorResult);
//                                                     return;
//                                                 } else {
//                                                     let errorOccurred = false;
//                                                     for (let i = 0; i < queries.length; i++) {
//                                                         if (errorOccurred) {
//                                                             break;
//                                                         }
//                                                         connection1.query(queries[i], async function (error: any, results: any, fields: any) {
//                                                             if (error) {
//                                                                 let dropres = await connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
//                                                                 jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                                                 jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                                                 jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                                                 jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                                                 jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                                                 await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                                 errorOccurred = true;
//                                                                 connection1.rollback();
//                                                                 let errorResult = new ResultError(400, true, error, new Error(error), '');
//                                                                 next(errorResult);
//                                                                 return;
//                                                             } else {
//                                                                 if (results && i == queries.length - 1) {
//                                                                     let adminUserQuery = `SELECT users.* FROM users INNER JOIN userroles ON users.id = userroles.userId WHERE userroles.roleId = 1`;
//                                                                     connection1.query(adminUserQuery, async function (error: any, results: any, fields: any) {
//                                                                         if (error) {
//                                                                             let dropres = await connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
//                                                                             jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                                                             jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                                                             jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                                                             jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                                                             jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                                                             await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                                         } else {
//                                                                             await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                                             let successResult = new ResultSuccess(200, true, 'Database Configuration Successfully', results, 1, '');
//                                                                             return res.status(200).send(successResult);
//                                                                         }
//                                                                     });
//                                                                 }
//                                                             }
//                                                         });
//                                                     }
//                                                 }
//                                             });
//                                         }
//                                     });
//                                 }
//                             }
//                         });
//                     } else {
//                         let connection1 = mysql.createConnection({
//                             host: jsonData.MYSQL_HOST,
//                             user: jsonData.MYSQL_USER,
//                             password: jsonData.MYSQL_PASSWORD,
//                             database: req.body.MYSQL_DATABASE,
//                             port: req.body.MYSQL_PORT
//                         });
//                         connection1.connect(async (err: any) => {
//                             if (err) {
//                                 jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                 jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                 jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                 jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                 jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                 await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                 let errorResult = new ResultError(400, true, err, new Error(err), '');
//                                 next(errorResult);
//                                 return;
//                             } else {
//                                 // await connection1.query(`SELECT value FROM systemflags WHERE name = 'latestVersion' AND id = 47`, async function (error: any, results: any, fields: any) {
//                                 //     if (error) {
//                                 //         // await connection1.query(`INSERT INTO systemflags VALUES (47,1,2,'latestVersion','Latest Version','3','0',NULL,NULL,NULL,NULL,1,0,'2024-03-02 11:21:37','2024-03-02 11:21:37',NULL,NULL)`);
//                                 //         connection1.rollback();
//                                 //         let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
//                                 //         next(errorResult);
//                                 //         return
//                                 //     }
//                                 //     else {
//                                 // if (results && results.length > 0) {
//                                 //     await connection1.query(`UPDATE systemflags SET value = '1.3' WHERE name = 'latestVersion' AND id = 47`);
//                                 // }
//                                 // else {
//                                 //     await connection1.query(`INSERT INTO systemflags VALUES (47,1,2,'latestVersion','Latest Version','1.3','1.0',NULL,NULL,NULL,NULL,1,0,'2024-03-02 11:21:37','2024-03-02 11:21:37',NULL,NULL)`);
//                                 // }
//                                 // let latestVersion = "1.3";
//                                 // const splitSentences = latestVersion.split('.');
//                                 // let selectedVersion = req.body.version.split('.');
//                                 let errorOccurred = false;
//                                 let versionIndex = versions.findIndex((c) => c == req.body.version);
//                                 // for (let k = parseInt(selectedVersion[0]) + 1; k <= parseInt(splitSentences[0]); k++) {
//                                 for (let index = versionIndex + 1; index < versions.length; index++) {
//                                     if (errorOccurred) {
//                                         break;
//                                     }
//                                     let fileIndex = versions[index].replace('.', '_');
//                                     fs.access('config/databasescripts/version' + fileIndex + '.sql', fs.constants.F_OK, async (err) => {
//                                         if (err) {
//                                             connection1.rollback();
//                                             let errorResult = new ResultError(400, true, "File doesn't exist", new Error("File doesn't exist"), '');
//                                             next(errorResult);
//                                             return;
//                                         } else {
//                                             let rawData = fs.readFileSync('config/databasescripts/version' + fileIndex + '.sql', 'utf8');
//                                             const queries = [];
//                                             let previousChar = '';
//                                             let currentStatement = '';
//                                             let withinQuotes = false;
//                                             for (const char of rawData) {
//                                                 currentStatement += char;
//                                                 if (char === "'" && previousChar !== '\\') {
//                                                     withinQuotes = !withinQuotes;
//                                                 }
//                                                 if (char === ';' && !withinQuotes) {
//                                                     queries.push(currentStatement.trim());
//                                                     currentStatement = '';
//                                                 }
//                                                 previousChar = char;
//                                             }
//                                             if (currentStatement.trim().length > 0) {
//                                                 queries.push(currentStatement.trim());
//                                             }
//                                             if (queries && queries.length > 0) {
//                                                 for (let i = 0; i < queries.length; i++) {
//                                                     if (errorOccurred) {
//                                                         // let errorResult = new ResultError(400, true, 'Data Not Available', new Error('Data Not Available'), '');
//                                                         // next(errorResult);
//                                                         break;
//                                                     }
//                                                     await connection1.query(queries[i], async function (error: any, results: any, fields: any) {
//                                                         if (error) {
//                                                             errorOccurred = true;
//                                                             connection1.rollback();
//                                                             let errorResult = new ResultError(400, true, error, new Error(error), '');
//                                                             next(errorResult);
//                                                             return;
//                                                         } else {
//                                                             if (results && i == queries.length - 1 && index == versions.length - 1) {
//                                                                 let adminUserQuery = `SELECT users.* FROM users INNER JOIN userroles ON users.id = userroles.userId WHERE userroles.roleId = 1`;
//                                                                 connection1.query(adminUserQuery, async function (error: any, results: any, fields: any) {
//                                                                     if (error) {
//                                                                         // let dropres = await connection.query(`DROP database ` + req.body.MYSQL_DATABASE);
//                                                                         jsonData.MYSQL_HOST = '<MYSQL_HOST>';
//                                                                         jsonData.MYSQL_DATABASE = '<MYSQL_DATABASE>';
//                                                                         jsonData.MYSQL_USER = '<MYSQL_USER>';
//                                                                         jsonData.MYSQL_PASSWORD = '<MYSQL_PASSWORD>';
//                                                                         jsonData.MYSQL_PORT = '<MYSQL_PORT>';
//                                                                         await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                                     } else {
//                                                                         await fs.writeFileSync('variable.json', JSON.stringify(jsonData));
//                                                                         let successResult = new ResultSuccess(200, true, 'Database Configuration Successfully', results, 1, '');
//                                                                         return res.status(200).send(successResult);
//                                                                     }
//                                                                 });
//                                                             }
//                                                         }
//                                                     });
//                                                 }
//                                             }
//                                         }
//                                     });
//                                 }
//                                 // }
//                                 // }
//                                 // });
//                             }
//                         });
//                     }
//                 } catch (error: any) {
//                     let errorResult = new ResultError(400, true, error, new Error(error), '');
//                     next(errorResult);
//                 }
//             }
//         });
//     } catch (error: any) {
//         let errorResult = new ResultError(500, true, 'configuration.databaseConfiguration() Exception', error, '');
//         next(errorResult);
//     }
// };
// const installMasterData = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Install MasterData');
//         let rawData = fs.readFileSync('variable.json', 'utf8');
//         let jsonData = JSON.parse(rawData);
//         let versions = ['1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6'];
//         if (!req.body.version) {
//             let rawData = fs.readFileSync('config/databasescripts/fullmasterdata.sql', 'utf8');
//             let currentStatement = '';
//             let withinQuotes = false;
//             const queries: string[] = [];
//             let previousChar = '';
//             for (const char of rawData) {
//                 currentStatement += char;
//                 if (char === "'" && previousChar !== '\\') {
//                     withinQuotes = !withinQuotes;
//                 }
//                 if (char === ';' && !withinQuotes) {
//                     queries.push(currentStatement.trim());
//                     currentStatement = '';
//                 }
//                 previousChar = char;
//             }
//             if (currentStatement.trim().length > 0) {
//                 queries.push(currentStatement.trim());
//             }
//             if (queries && queries.length > 0) {
//                 let connection = mysql.createConnection({
//                     host: jsonData.MYSQL_HOST,
//                     user: jsonData.MYSQL_USER,
//                     password: jsonData.MYSQL_PASSWORD,
//                     database: jsonData.MYSQL_DATABASE,
//                     port: jsonData.MYSQL_PORT
//                 });
//                 let errorOccurred = false;
//                 for (let i = 0; i < queries.length; i++) {
//                     if (errorOccurred) {
//                         break;
//                     }
//                     try {
//                         connection.query(queries[i], async function (error: any, results: any, fields: any) {
//                             if (error) {
//                                 errorOccurred = true;
//                                 await connection.rollback();
//                                 let errorResult = new ResultError(400, true, error, new Error(error), '');
//                                 next(errorResult);
//                             } else {
//                                 if (results && i == queries.length - 1) {
//                                     let successResult = new ResultSuccess(200, true, 'Install MasterData Successfully', results, 1, '');
//                                     return res.status(200).send(successResult);
//                                 }
//                             }
//                         });
//                     } catch (error: any) {
//                         await connection.rollback();
//                         let errorResult = new ResultError(400, true, error, new Error(error), '');
//                         next(errorResult);
//                         break;
//                     }
//                 }
//             } else {
//                 let successResult = new ResultSuccess(200, true, 'Install MasterData Successfully', [], 1, '');
//                 return res.status(200).send(successResult);
//             }
//         } else {
//             let connection = mysql.createConnection({
//                 host: jsonData.MYSQL_HOST,
//                 user: jsonData.MYSQL_USER,
//                 password: jsonData.MYSQL_PASSWORD,
//                 database: jsonData.MYSQL_DATABASE,
//                 port: jsonData.MYSQL_PORT
//             });
//             let versionIndex = versions.findIndex((c) => c == req.body.version);
//             for (let index = versionIndex + 1; index < versions.length; index++) {
//                 let fileIndex = versions[index].replace('.', '_');
//                 fs.access('config/databasescripts/masterData' + fileIndex + '.sql', fs.constants.F_OK, async (err) => {
//                     if (err) {
//                         // let errorResult = new ResultError(400, true, "File doesn't exist", new Error("File doesn't exist"), '');
//                         // next(errorResult);
//                         // return;
//                     } else {
//                         let rawData = fs.readFileSync('config/databasescripts/masterData' + fileIndex + '.sql', 'utf8');
//                         const queries = [];
//                         let previousChar = '';
//                         let currentStatement = '';
//                         let withinQuotes = false;
//                         for (const char of rawData) {
//                             currentStatement += char;
//                             if (char === "'" && previousChar !== '\\') {
//                                 withinQuotes = !withinQuotes;
//                             }
//                             if (char === ';' && !withinQuotes) {
//                                 queries.push(currentStatement.trim());
//                                 currentStatement = '';
//                             }
//                             previousChar = char;
//                         }
//                         if (currentStatement.trim().length > 0) {
//                             queries.push(currentStatement.trim());
//                         }
//                         let errorOccurred = false;
//                         if (queries && queries.length > 0) {
//                             for (let i = 0; i < queries.length; i++) {
//                                 connection.query(queries[i], async function (error: any, result: any, fields: any) {
//                                     if (error) {
//                                         errorOccurred = true;
//                                         connection.rollback();
//                                         let errorResult = new ResultError(400, true, error, new Error(error), '');
//                                         next(errorResult);
//                                     } else {
//                                         if (result && i == queries.length - 1 && index == versions.length - 1) {
//                                             let successResult = new ResultSuccess(200, true, 'Install MasterData Successfully', result, 1, '');
//                                             return res.status(200).send(successResult);
//                                         }
//                                     }
//                                 });
//                             }
//                         } else {
//                             if (index == versions.length - 1) {
//                                 let successResult = new ResultSuccess(200, true, 'Install MasterData Successfully', [], 1, '');
//                                 return res.status(200).send(successResult);
//                             }
//                         }
//                     }
//                 });
//             }
//             // }
//             // });
//         }
//     } catch (error: any) {
//         let errorResult = new ResultError(500, true, 'configuration.installMasterData() Exception', error, '');
//         next(errorResult);
//     }
// };
// const installSampleData = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         logging.info(NAMESPACE, 'Install SampleData');
//         let json = fs.readFileSync('variable.json', 'utf8');
//         let jsonData = JSON.parse(json);
//         // if (!req.body.version) {
//         let rawData = fs.readFileSync('config/databasescripts/fullsampledata.sql', 'utf8');
//         const queries = [];
//         let previousChar = '';
//         let currentStatement = '';
//         let withinQuotes = false;
//         for (const char of rawData) {
//             currentStatement += char;
//             if (char === "'" && previousChar !== '\\') {
//                 withinQuotes = !withinQuotes;
//             }
//             if (char === ';' && !withinQuotes) {
//                 queries.push(currentStatement.trim());
//                 currentStatement = '';
//             }
//             previousChar = char;
//         }
//         if (currentStatement.trim().length > 0) {
//             queries.push(currentStatement.trim());
//         }
//         let connection = mysql.createConnection({
//             host: jsonData.MYSQL_HOST,
//             user: jsonData.MYSQL_USER,
//             password: jsonData.MYSQL_PASSWORD,
//             database: jsonData.MYSQL_DATABASE,
//             port: jsonData.MYSQL_PORT
//         });
//         if (queries && queries.length > 0) {
//             let errorOccurred = false;
//             for (let i = 0; i < queries.length; i++) {
//                 if (errorOccurred) {
//                     break;
//                 }
//                 connection.query(queries[i], async function (error: any, results: any, fields: any) {
//                     if (error) {
//                         errorOccurred = true;
//                         connection.rollback();
//                         let errorResult = new ResultError(400, true, error, new Error(error), '');
//                         next(errorResult);
//                     } else {
//                         if (results && i == queries.length - 1) {
//                             let successResult = new ResultSuccess(200, true, 'Install SampleData Successfully', results, 1, '');
//                             return res.status(200).send(successResult);
//                         }
//                     }
//                 });
//             }
//         } else {
//             let successResult = new ResultSuccess(200, true, 'Install SampleData Successfully', [], 1, '');
//             return res.status(200).send(successResult);
//         }
//     } catch (error: any) {
//         let errorResult = new ResultError(500, true, 'configuration.installSampleData() Exception', error, '');
//         next(errorResult);
//     }
// };
// const restartConnection = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         let result: any = true;
//         Object.keys(require.cache).forEach(function (key) {
//             delete require.cache[key];
//         });
//         let rawData = fs.readFileSync('variable.json', 'utf8');
//         let jsonData = JSON.parse(rawData);
//         console.log(jsonData);
//         if (jsonData.MYSQL_DATABASE == req.body.MYSQL_DATABASE) {
//             let connection = mysql.createConnection({
//                 host: jsonData.MYSQL_HOST,
//                 user: jsonData.MYSQL_USER,
//                 password: jsonData.MYSQL_PASSWORD,
//                 database: jsonData.MYSQL_DATABASE,
//                 port: jsonData.MYSQL_PORT
//             });
//             connection.end((err: any) => {
//                 if (err) {
//                     let errorResult = new ResultError(400, true, err, new Error(err), '');
//                     next(errorResult);
//                 } else {
//                     let successResult = new ResultSuccess(200, true, 'Restart Connection Successfully', result, 1, '');
//                     return res.status(200).send(successResult);
//                 }
//             });
//         } else {
//             result = false;
//             let successResult = new ResultSuccess(200, true, 'Restart Connection Successfully', result, 1, '');
//             return res.status(200).send(successResult);
//         }
//     } catch (error: any) {
//         let errorResult = new ResultError(500, true, 'configuration.restartConnection() Exception', error, '');
//         next(errorResult);
//     }
// };
// export default { getConfiguration, testConnection, databaseConfiguration, installMasterData, installSampleData, restartConnection };
