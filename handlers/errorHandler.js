"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiErrorHandler = exports.unCaughtErrorHandler = void 0;
const logger_1 = require("../logger");
function unCaughtErrorHandler(err, req, res, next) {
    console.log(err);
    logger_1.default.error(JSON.stringify(err));
    res.end({ error: err });
}
exports.unCaughtErrorHandler = unCaughtErrorHandler;
function apiErrorHandler(err, req, res, message) {
    res.status(500).json({ error: message });
    console.log(err);
    const error = { Message: message, Request: req, Stack: err };
    logger_1.default.error((error));
}
exports.apiErrorHandler = apiErrorHandler;
//# sourceMappingURL=errorHandler.js.map