"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const rateLimit_1 = require("./middlewares/rateLimit");
const errorHandler_1 = require("./handlers/errorHandler");
const routes_1 = require("./routes");
const passport = require("passport");
const passport_1 = require("./middlewares/passport");
const logger_1 = require("./logger");
const cors = require("cors");
// app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
class Server {
    constructor(app) {
        this.config(app);
        new routes_1.default(app);
    }
    config(app) {
        const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' });
        app.use(express_1.static('public'));
        app.use(morgan('combined', { stream: accessLogStream }));
        app.use(express_1.urlencoded({ extended: true }));
        app.use(express_1.json());
        app.use('/backend', express_1.static(path.join(__dirname, '../../frontend/build')));
        app.use('/', express_1.static(path.join(__dirname, '../../web-ticket/build')));
        // app.use(helmet());
        app.use(rateLimit_1.default()); //  apply to all requests
        app.use(passport.initialize());
        app.use(cors());
        passport_1.default(passport);
        app.use(errorHandler_1.unCaughtErrorHandler);
    }
}
exports.default = Server;
process.on('beforeExit', function (err) {
    logger_1.default.error(JSON.stringify(err));
    console.error(err);
});
//# sourceMappingURL=index.js.map