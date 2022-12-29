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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const fetch = require("node-fetch");
/**
 * @DESC Validate user token from the auth micro service
 */
const medaTicketUserAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.headers.authorization == undefined) {
        return res.status(401).json({
            message: `No auth token.`,
            success: false,
        });
    }
    try {
        // Token for the auth service found
        // Forward this to the auth service and get the current user
        const response = yield fetch(`${config_1.authMicroserviceBaseUrl}/api/users/auth/current`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: req.headers.authorization,
            },
        });
        // Token valid
        if (response.status == 200) {
            req.user = yield response.json();
            return next();
        }
        else {
            return res.status(401).json({
                message: ((_a = (yield response.json())) === null || _a === void 0 ? void 0 : _a.error) || `Unauthorized.`,
                success: false,
            });
        }
    }
    catch (error) {
        return res.status(401).json({
            message: (error === null || error === void 0 ? void 0 : error.message) || `Unauthorized.`,
            success: false,
        });
    }
});
exports.default = medaTicketUserAuth;
//# sourceMappingURL=medaTicketUserAuth.js.map