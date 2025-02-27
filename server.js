"use strict";
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
const http_1 = __importDefault(require("http"));
//IMPORTS for HTTPS Server
// // https server
// import https from "https";
// // Requiring file system to use local files
// import fs from "fs";
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const logging_1 = __importDefault(require("./config/logging"));
const config_1 = __importDefault(require("./config/config"));
const sampleRoutes_1 = __importDefault(require("./routes/sampleRoutes"));
const apiHeader_1 = __importDefault(require("./middleware/apiHeader"));
const useragent_1 = __importDefault(require("useragent"));
const cors = require('cors');
const path = require('path');
//#region Admin
const usersRoutes_1 = __importDefault(require("./routes/admin/usersRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/admin/dashboardRoutes"));
const annualIncomeRoutes_1 = __importDefault(require("./routes/admin/annualIncomeRoutes"));
const appUsersRoutes_1 = __importDefault(require("./routes/admin/appUsersRoutes"));
const communityRoutes_1 = __importDefault(require("./routes/admin/communityRoutes"));
const dietRoutes_1 = __importDefault(require("./routes/admin/dietRoutes"));
const educationRoutes_1 = __importDefault(require("./routes/admin/educationRoutes"));
const heightRoutes_1 = __importDefault(require("./routes/admin/heightRoutes"));
const maritalStatusRoutes_1 = __importDefault(require("./routes/admin/maritalStatusRoutes"));
const occupationRoutes_1 = __importDefault(require("./routes/admin/occupationRoutes"));
const religionRoutes_1 = __importDefault(require("./routes/admin/religionRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/admin/reportRoutes"));
const subCommunityRoutes_1 = __importDefault(require("./routes/admin/subCommunityRoutes"));
const userBlockRequestRoutes_1 = __importDefault(require("./routes/admin/userBlockRequestRoutes"));
const systemFlagsRoutes_1 = __importDefault(require("./routes/admin/systemFlagsRoutes"));
const citiesRoutes_1 = __importDefault(require("./routes/admin/citiesRoutes"));
const statesRoutes_1 = __importDefault(require("./routes/admin/statesRoutes"));
const districtsRoutes_1 = __importDefault(require("./routes/admin/districtsRoutes"));
const employmentTypeRoutes_1 = __importDefault(require("./routes/admin/employmentTypeRoutes"));
const successStoriesRoutes_1 = __importDefault(require("./routes/admin/successStoriesRoutes"));
const premiumAccountTypeRoutes_1 = __importDefault(require("./routes/admin/premiumAccountTypeRoutes"));
const premiumFacilityRoutes_1 = __importDefault(require("./routes/admin/premiumFacilityRoutes"));
const timeDurationRoutes_1 = __importDefault(require("./routes/admin/timeDurationRoutes"));
const packageRoutes_1 = __importDefault(require("./routes/admin/packageRoutes"));
const feedbackRoutes_1 = __importDefault(require("./routes/admin/feedbackRoutes"));
const questionCategoriesRoutes_1 = __importDefault(require("./routes/admin/questionCategoriesRoutes"));
const documentTypeRoutes_1 = __importDefault(require("./routes/admin/documentTypeRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/admin/couponRoutes"));
const customNotificationRoutes_1 = __importDefault(require("./routes/admin/customNotificationRoutes"));
const regionRoutes_1 = __importDefault(require("./routes/admin/regionRoutes"));
const userPagesRoutes_1 = __importDefault(require("./routes/admin/userPagesRoutes"));
const currenciesRoutes_1 = __importDefault(require("./routes/admin/currenciesRoutes"));
const paymentgatewayRoutes_1 = __importDefault(require("./routes/admin/paymentgatewayRoutes"));
const profileForRoute_1 = __importDefault(require("./routes/admin/profileForRoute"));
const weightRoutes_1 = __importDefault(require("./routes/admin/weightRoutes"));
const manageCustomFieldsRoutes_1 = __importDefault(require("./routes/admin/manageCustomFieldsRoutes"));
const configurationRoutes_1 = __importDefault(require("./routes/admin/configurationRoutes"));
const blogsRoutes_1 = __importDefault(require("./routes/admin/blogsRoutes"));
const registrationScreenRoutes_1 = __importDefault(require("./routes/admin/registrationScreenRoutes"));
const addAppUserRoutes_1 = __importDefault(require("./routes/admin/addAppUserRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/admin/paymentRoutes"));
//#endregion Admin
//#region App
const usersRoutes_2 = __importDefault(require("./routes/app/usersRoutes"));
const homeRoutes_1 = __importDefault(require("./routes/app/homeRoutes"));
const agoraTokenRoutes_1 = __importDefault(require("./routes/app/agoraTokenRoutes"));
const proposalRoutes_1 = __importDefault(require("./routes/app/proposalRoutes"));
const userBlockRequestRoutes_2 = __importDefault(require("./routes/app/userBlockRequestRoutes"));
const userFavouritesRoutes_1 = __importDefault(require("./routes/app/userFavouritesRoutes"));
const userNotificationsRoutes_1 = __importDefault(require("./routes/app/userNotificationsRoutes"));
const visitorsRoutes_1 = __importDefault(require("./routes/app/visitorsRoutes"));
const userChatRoutes_1 = __importDefault(require("./routes/app/userChatRoutes"));
const feedbackRoutes_2 = __importDefault(require("./routes/app/feedbackRoutes"));
const packageRoutes_2 = __importDefault(require("./routes/app/packageRoutes"));
const paymentRoutes_2 = __importDefault(require("./routes/app/paymentRoutes"));
const questionCategoriesRoutes_2 = __importDefault(require("./routes/app/questionCategoriesRoutes"));
const successStoriesRoutes_2 = __importDefault(require("./routes/app/successStoriesRoutes"));
const userBlockRoutes_1 = __importDefault(require("./routes/app/userBlockRoutes"));
const couponRoutes_2 = __importDefault(require("./routes/app/couponRoutes"));
const regionRoutes_2 = __importDefault(require("./routes/app/regionRoutes"));
const systemFlagsRoutes_2 = __importDefault(require("./routes/app/systemFlagsRoutes"));
const userWalletRoutes_1 = __importDefault(require("./routes/app/userWalletRoutes"));
const paymentGatewayRoutes_1 = __importDefault(require("./routes/app/paymentGatewayRoutes"));
const currencyRoutes_1 = __importDefault(require("./routes/app/currencyRoutes"));
const customFieldsRoutes_1 = __importDefault(require("./routes/app/customFieldsRoutes"));
const blogsRoute_1 = __importDefault(require("./routes/app/blogsRoute"));
//#endregion
const NAMESPACE = 'Server';
const router = (0, express_1.default)();
router.use(cors());
/** Logging the request */
router.use((req, res, next) => {
    /** Log the req */
    logging_1.default.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        /** Log the res */
        logging_1.default.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
/** Parse the body of the request */
router.use(body_parser_1.default.urlencoded({ extended: true }));
router.use(body_parser_1.default.json({
    limit: "50mb"
}));
/** Rules of our API */
router.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization,refreshtoken');
    // if (req.method == 'OPTIONS') {
    //     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    //     return res.status(200).json({});
    // }
    // Website you wish to allow to connect
    res.header('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, refreshtoken');
    next();
});
/** Routes go here */
router.use('/api', express_1.default.static('apidoc'));
router.use('/content', express_1.default.static('content'));
router.use('/api/sample', sampleRoutes_1.default);
//#region Admin
router.use('/api/admin/users', usersRoutes_1.default);
router.use('/api/admin/dashboard', dashboardRoutes_1.default);
router.use('/api/admin/annualIncome', annualIncomeRoutes_1.default);
router.use('/api/admin/appUsers', appUsersRoutes_1.default);
router.use('/api/admin/community', communityRoutes_1.default);
router.use('/api/admin/diet', dietRoutes_1.default);
router.use('/api/admin/education', educationRoutes_1.default);
router.use('/api/admin/height', heightRoutes_1.default);
router.use('/api/admin/maritalStatus', maritalStatusRoutes_1.default);
router.use('/api/admin/occupation', occupationRoutes_1.default);
router.use('/api/admin/religion', religionRoutes_1.default);
router.use('/api/admin/report', reportRoutes_1.default);
router.use('/api/admin/subCommunity', subCommunityRoutes_1.default);
router.use('/api/admin/userBlockRequest', userBlockRequestRoutes_1.default);
router.use('/api/admin/systemFlags', systemFlagsRoutes_1.default);
router.use('/api/admin/cities', citiesRoutes_1.default);
router.use('/api/admin/states', statesRoutes_1.default);
router.use('/api/admin/districts', districtsRoutes_1.default);
router.use('/api/admin/employmentType', employmentTypeRoutes_1.default);
router.use('/api/admin/successStories', successStoriesRoutes_1.default);
router.use('/api/admin/premiumAccountType', premiumAccountTypeRoutes_1.default);
router.use('/api/admin/premiumFacility', premiumFacilityRoutes_1.default);
router.use('/api/admin/timeDuration', timeDurationRoutes_1.default);
router.use('/api/admin/package', packageRoutes_1.default);
router.use('/api/admin/feedback', feedbackRoutes_1.default);
router.use('/api/admin/questionCategories', questionCategoriesRoutes_1.default);
router.use('/api/admin/documentType', documentTypeRoutes_1.default);
router.use('/api/admin/coupons', couponRoutes_1.default);
router.use('/api/admin/customNotification', customNotificationRoutes_1.default);
router.use('/api/admin/region', regionRoutes_1.default);
router.use('/api/admin/userPages', userPagesRoutes_1.default);
router.use('/api/admin/currencies', currenciesRoutes_1.default);
router.use('/api/admin/paymentGateways', paymentgatewayRoutes_1.default);
router.use('/api/admin/profileFor', profileForRoute_1.default);
router.use('/api/admin/weight', weightRoutes_1.default);
router.use('/api/admin/manageCustomFields', manageCustomFieldsRoutes_1.default);
router.use('/api/admin/configuration', configurationRoutes_1.default);
router.use('/api/admin/blog', blogsRoutes_1.default);
router.use('/api/admin/registrationScreen', registrationScreenRoutes_1.default);
router.use('/api/admin/addAppUserRoutes', addAppUserRoutes_1.default);
router.use('/api/admin/payment', paymentRoutes_1.default);
//#endregion
//#region App
router.use('/api/app/users', usersRoutes_2.default);
router.use('/api/app/home', homeRoutes_1.default);
router.use('/api/app/agoraToken', agoraTokenRoutes_1.default);
router.use('/api/app/proposals', proposalRoutes_1.default);
router.use('/api/app/userBlockRequest', userBlockRequestRoutes_2.default);
router.use('/api/app/favourites', userFavouritesRoutes_1.default);
router.use('/api/app/notifications', userNotificationsRoutes_1.default);
router.use('/api/app/visitors', visitorsRoutes_1.default);
router.use('/api/app/userChat', userChatRoutes_1.default);
router.use('/api/app/feedback', feedbackRoutes_2.default);
router.use('/api/app/package', packageRoutes_2.default);
router.use('/api/app/payment', paymentRoutes_2.default);
router.use('/api/app/questioncategories', questionCategoriesRoutes_2.default);
router.use('/api/app/successStories', successStoriesRoutes_2.default);
router.use('/api/app/block', userBlockRoutes_1.default);
router.use('/api/app/coupons', couponRoutes_2.default);
router.use('/api/app/regions', regionRoutes_2.default);
router.use('/api/app/systemFlags', systemFlagsRoutes_2.default);
router.use('/api/app/userWallet', userWalletRoutes_1.default);
router.use('/api/app/paymentGateways', paymentGatewayRoutes_1.default);
router.use('/api/app/currency', currencyRoutes_1.default);
router.use('/api/app/customFields', customFieldsRoutes_1.default);
router.use('/api/app/blog', blogsRoute_1.default);
router.use('/admin', express_1.default.static('client'));
router.use('/', express_1.default.static('client/website'));
router.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});
router.get('/app', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const queryParams = req.query;
    const userAgent = req.headers['user-agent'] || '';
    const agent = useragent_1.default.parse(userAgent);
    let platform;
    let name = 'playstore';
    if (agent.os.family === 'iOS') {
        platform = 'iOS';
        name = 'appstore';
    }
    else if (agent.os.family === 'Android') {
        platform = 'Android';
        name = 'playstore';
    }
    else if (agent.os.family === 'Windows') {
        platform = 'Android';
        name = 'playstore';
    }
    else {
        platform = 'Unknown';
    }
    // if(queryParams.appName && queryParams.appName == 'customerApp'){
    // }
    let sql = `SELECT value FROM systemflags WHERE name = '` + name + `'`;
    let result = yield apiHeader_1.default.query(sql);
    res.redirect(result[0].value);
    // res.redirect('');
}));
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/website/index.html'));
});
//#endregion
/** Error handling */
router.use((req, res, next) => {
    const error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
router.use((result, req, res, next) => {
    if (result.status == 200) {
        res.json({
            status: result.status,
            isDisplayMessage: result.isDisplayMessage,
            message: result.message,
            recordList: result.recordList,
            totalRecords: result.totalRecords
        });
    }
    else {
        var error = result;
        var trace = null;
        res.status(error.status || 500);
        if (error.error != null) {
            trace = error.error;
        }
        var errorResult = {
            status: error.status,
            isDisplayMessage: error.isDisplayMessage,
            message: error.message, //error.error != undefined && error.error != null ? error.error.message : 'Error object is not available',
            value: error.value,
            error: error
            // error: {
            //     apiName: error.request != undefined && error.request != null ? error.request.url : '',
            //     apiType: error.request != undefined && error.request != null ? error.request.method : '',
            //     fileName: trace != null && trace.length > 0 ? trace[0].getFileName().split('\\').pop() : 'trace is not available',
            //     functionName: trace != null && trace.length > 0 ? trace[0].getFunctionName() : 'trace is not available',
            //     functionErrorMessage:
            //         (error.message != undefined && error.message != null ? error.message : 'Error message is not available') +
            //         ' : ' +
            //         (error.error != undefined && error.error != null ? error.error : 'Error object is not available'),
            //     lineNumber: trace != null && trace.length > 0 ? trace[0].getLineNumber() : 'trace is not available',
            //     typeName: trace != null && trace.length > 0 ? trace[0].getTypeName() : 'trace is not available',
            //     stack: error.stack != undefined && error.stack != null ? error.stack : 'Error stack is not available'
            // }
        };
        // console.log(req.body);
        console.log(errorResult);
        res.json(errorResult);
    }
});
/** Create the Server */
const httpServer = http_1.default.createServer(router);
httpServer.listen(config_1.default.server.port, () => logging_1.default.info(NAMESPACE, `Http Server is running ${config_1.default.server.hostname}:${config_1.default.server.port}`));
// process.on('restartServer', () => {
//     console.log('Restarting server...');
//     closeServer();
// });
// function closeServer() {
//     if (httpServer) {
//         httpServer.close(() => {
//             console.log('Server closed at', new Date());
//             httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Http Server is running ${config.server.hostname}:${config.server.port}`));
//         });
//     }
// }
// module.exports = { router, httpServer };
// export default router;
// Code for HTTPS Server
// // Creating object of key and certificate
// // for SSL
// const options = {
//     key: fs.readFileSync("server.key"),
//     cert: fs.readFileSync("server.cert"),
// };
// // Creating https server by passing
// // options and app object
// https.createServer(options, router)
//     .listen(config.server.port, () => logging.info(NAMESPACE, `Https Server is running ${config.server.hostname}:${config.server.port}`));
