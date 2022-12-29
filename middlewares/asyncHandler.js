"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = require("../handlers/errorHandler");
const asyncMiddleware = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch((error) => errorHandler_1.apiErrorHandler(error, req, res, 'an error occurred.'));
module.exports = asyncMiddleware;
//# sourceMappingURL=asyncHandler.js.map