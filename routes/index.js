"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthRoutes_1 = require("./AuthRoutes");
// import lessonRouter from './LessonRoutes';
const userAuth_1 = require("../middlewares/userAuth");
const userTypeAuth_1 = require("../middlewares/userTypeAuth");
const userRoleAuth_1 = require("../middlewares/userRoleAuth");
const userType_1 = require("../data/userType");
const roles_1 = require("../data/roles");
const AdminRoutes_1 = require("./AdminRoutes");
const MovieRoutes_1 = require("./MovieRoutes");
const AttendantRoutes_1 = require("./AttendantRoutes");
const CinemaHallRoutes_1 = require("./CinemaHallRoutes");
const CinemaScheduleRoutes_1 = require("./CinemaScheduleRoutes");
const TicketRoutes_1 = require("./TicketRoutes");
const path = require("path");
const RedemmerUserRoutes_1 = require("./RedemmerUserRoutes");
const swaggerUI = require("swagger-ui-express");
const swagerConfig_1 = require("../swagger/swagerConfig");
const ArifPay_1 = require("./ArifPay");
const multer = require('multer');
// var path = require('path')
let storeval;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(undefined, 'public/images');
    },
    filename: (req, file, cb) => {
        storeval = Date.now() + path.extname(file.originalname);
        cb(undefined, storeval);
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: '2000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if (mimeType && extname) {
            return cb(undefined, true);
        }
        cb('Give proper files format to upload');
    },
});
class Routes {
    constructor(app) {
        app.use('/api/auth', AuthRoutes_1.default);
        app.use('/api/admin', userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), AdminRoutes_1.default);
        app.use('/upload', upload.single('logo'), (req, res) => {
            // upload()
            setTimeout(() => {
                console.log('file uploaded', storeval);
                return res
                    .status(200)
                    .json({ result: true, msg: 'file uploaded', name: storeval });
            }, 3000);
        });
        app.use('/api/event', MovieRoutes_1.default);
        app.use('/api/attendant', AttendantRoutes_1.default);
        app.use('/api/venue', CinemaHallRoutes_1.default);
        app.use('/api/event-schedule', CinemaScheduleRoutes_1.default);
        app.use('/api/ticket', TicketRoutes_1.default);
        app.use('/api/arifpay', ArifPay_1.default);
        app.use('/api/redeemer-users', RedemmerUserRoutes_1.default);
        app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swagerConfig_1.swaggerDocs));
        app.get('/backend*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../../frontend/build/index.html'));
        });
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../../web-ticket/build/index.html'));
        });
    }
}
exports.default = Routes;
//# sourceMappingURL=index.js.map