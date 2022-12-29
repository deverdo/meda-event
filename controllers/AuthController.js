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
// import CourseRepo from './../repositories/CoursesRepo';
const errorHandler_1 = require("../handlers/errorHandler");
const jsonwebtoken_1 = require("jsonwebtoken");
const moment = require("moment");
const AuthRepository_1 = require("../repositories/AuthRepository");
const config_1 = require("../config");
const UsersRepository_1 = require("../repositories/UsersRepository");
const TicketRedeemerUserRepository_1 = require("../repositories/TicketRedeemerUserRepository");
class AuthController {
    constructor() { }
    LoginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const user = yield UsersRepository_1.default.getUserByUsername(username);
                if (user && user.accountLockedOut) {
                    return res.status(401).json({
                        error: 'This account is locked out... please contact your system administrators!',
                    });
                }
                if (!user ||
                    !(yield AuthRepository_1.default.comparePassword(password, user.password))) {
                    return res.status(401).json({ error: 'Invalid Credentials!' });
                }
                else {
                    const token = jsonwebtoken_1.sign({
                        id: user.id,
                        role: user.roles,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                    }, config_1.jwtSecret, { expiresIn: '7 days' });
                    const result = {
                        token: `Bearer ${token}`,
                        expiryDate: moment().add(168, 'hours'),
                        id: user.id,
                        role: user.roles.name,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                    };
                    return res.status(200).json(Object.assign(Object.assign({}, result), { error: undefined }));
                }
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Login failed.');
            }
        });
    }
    GetCurrentUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const result = {
                    id: user.id,
                    role: user.roles.name,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                };
                return res.status(200).json({
                    result,
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Fetching current user failed.');
            }
        });
    }
    LoginTicketValidatorUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { phoneNumber, password } = req.body;
                const user = yield TicketRedeemerUserRepository_1.default.getTicketRedeemerUserByPhoneNumber(phoneNumber);
                if (user && user.accountLockedOut) {
                    return res.status(401).json({
                        error: 'This account is locked out... please contact your system administrators!',
                    });
                }
                if (!user ||
                    !(yield AuthRepository_1.default.comparePassword(password, user.password))) {
                    return res.status(401).json({ error: 'Invalid Credentials!' });
                }
                else {
                    const token = jsonwebtoken_1.sign({
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        phoneNumber: user.phoneNumber,
                    }, config_1.jwtSecret, { expiresIn: '7 days' });
                    const result = {
                        token: `Bearer ${token}`,
                        expiryDate: moment().add(168, 'hours'),
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        phoneNumber: user.phoneNumber,
                    };
                    return res.status(200).json(Object.assign(Object.assign({}, result), { error: undefined }));
                }
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Login failed.');
            }
        });
    }
    GetCurrentTicketValidatorUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const result = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    phoneNumber: user.phoneNumber,
                };
                return res.status(200).json({
                    result,
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Fetching current ticket validator user failed.');
            }
        });
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map