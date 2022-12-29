"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const file = new winston.transports.File({
    filename: './logs/error.log',
    level: 'error',
    // handleExceptions: true,
});
const logger = winston.createLogger({
    level: 'error',
    transports: [
        new (winston.transports.Console)(),
        file
    ]
});
exports.default = logger;
//# sourceMappingURL=index.js.map