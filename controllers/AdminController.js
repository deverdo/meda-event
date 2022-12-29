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
const errorHandler_1 = require("../handlers/errorHandler");
const AuthRepository_1 = require("../repositories/AuthRepository");
const auth_1 = require("../utils/auth");
const UsersRepository_1 = require("../repositories/UsersRepository");
const TicketRedeemerUserRepository_1 = require("../repositories/TicketRedeemerUserRepository");
const db_1 = require("../db/db");
const userType_1 = require("../data/userType");
class AdminController {
    constructor() { }
    CreateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, username, password, phoneNumber, role, address } = req.body;
                const usernameTaken = yield UsersRepository_1.default.getUserByUsername(username);
                if (usernameTaken) {
                    return res.status(409).json({
                        error: 'This username already belongs to an account.'
                    });
                }
                const phoneNumberTaken = yield UsersRepository_1.default.getUserByPhoneNumber(phoneNumber || '');
                if (phoneNumberTaken) {
                    return res.status(409).json({
                        error: 'This phone number already belongs to an account.'
                    });
                }
                const user = yield UsersRepository_1.default.createUser({ firstName, lastName, username, password: yield auth_1.hashPassword(password), phoneNumber: phoneNumber, role, registrantId: req.user.id, address });
                return res.status(201).json({
                    error: undefined,
                    message: 'User created successfully'
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'User couldn\'t be created.');
            }
        });
    }
    CreateTicketValidatorUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, username, password, phoneNumber, address } = req.body;
                const usernameTaken = yield TicketRedeemerUserRepository_1.default.getTicketRedeemerUserByUserName(username);
                if (usernameTaken) {
                    return res.status(409).json({
                        error: 'This username already belongs to an account.'
                    });
                }
                const phoneNumberTaken = yield TicketRedeemerUserRepository_1.default.getTicketRedeemerUserByPhoneNumber(phoneNumber);
                if (phoneNumberTaken) {
                    return res.status(409).json({
                        error: 'This phone number already belongs to an account.'
                    });
                }
                const user = yield TicketRedeemerUserRepository_1.default.createTicketRedeemer({ firstName, lastName, username, password: yield auth_1.hashPassword(password), phoneNumber: phoneNumber, registrantId: req.user.id, address });
                return res.status(201).json({
                    error: undefined,
                    message: 'User created successfully'
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
            }
        });
    }
    GetAllTicketRedeemerUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.json(yield TicketRedeemerUserRepository_1.default.getAllTicketRedeemerUsers());
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
            }
        });
    }
    GetTicketRedeemerUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id) {
                    return res.status(404).json({ error: `User not requested` });
                }
                const ticketRedUser = yield TicketRedeemerUserRepository_1.default.getTicketRedeemerUserById(req.params.id, {
                    id: true,
                    firstName: true,
                    lastName: true,
                    registeredBy: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    username: true,
                    accountLockedOut: true,
                    accessFailedCount: true,
                    phoneNumber: true,
                    createdAt: true,
                });
                if (!ticketRedUser) {
                    return res.status(404).json({ error: `User doesn't exist` });
                }
                return res.json({ username: ticketRedUser === null || ticketRedUser === void 0 ? void 0 : ticketRedUser.username, firstName: ticketRedUser === null || ticketRedUser === void 0 ? void 0 : ticketRedUser.firstName, lastName: ticketRedUser === null || ticketRedUser === void 0 ? void 0 : ticketRedUser.lastName, phoneNumber: ticketRedUser === null || ticketRedUser === void 0 ? void 0 : ticketRedUser.phoneNumber, accountLockedOut: ticketRedUser === null || ticketRedUser === void 0 ? void 0 : ticketRedUser.accountLockedOut, });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
            }
        });
    }
    UpdateTicketRedeemerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { firstName, lastName, username, phoneNumber, address, accountLockedOut } = req.body;
                const usernameTaken = yield TicketRedeemerUserRepository_1.default.getTicketRedeemerUserByUserName(username);
                if (usernameTaken && id != usernameTaken.id) {
                    return res.status(409).json({
                        error: 'This username already belongs to an account.'
                    });
                }
                const phoneNumberTaken = yield TicketRedeemerUserRepository_1.default.getTicketRedeemerUserByPhoneNumber(phoneNumber);
                if (phoneNumberTaken && id != (phoneNumberTaken === null || phoneNumberTaken === void 0 ? void 0 : phoneNumberTaken.id)) {
                    return res.status(409).json({
                        error: 'This phone number already belongs to an account.'
                    });
                }
                const user = yield TicketRedeemerUserRepository_1.default.updateTicketRedeemer(id, { firstName, lastName, username, address, accountLockedOut });
                return res.status(201).json({
                    error: undefined,
                    message: 'User updated successfully'
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be updated.');
            }
        });
    }
    getAllSystemRoles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allRoles = yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.userRole.findMany({}));
                return res.json(allRoles);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
            }
        });
    }
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.user.findMany({
                    where: {},
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        registeredBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        },
                        roles: true,
                        username: true,
                        accountLockedOut: true,
                        accessFailedCount: true,
                        phoneNumber: true,
                        createdAt: true,
                    }
                }));
                return res.json(users);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
            }
        });
    }
    UpdateUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { firstName, lastName, username, phoneNumber, address, accountLockedOut, role } = req.body;
                const usernameTaken = yield UsersRepository_1.default.getUserByUsername(username);
                if (usernameTaken && id != usernameTaken.id) {
                    return res.status(409).json({
                        error: 'This username already belongs to an account.'
                    });
                }
                const phoneNumberTaken = yield UsersRepository_1.default.getUserByPhoneNumber(phoneNumber);
                if (phoneNumberTaken && id != (phoneNumberTaken === null || phoneNumberTaken === void 0 ? void 0 : phoneNumberTaken.id)) {
                    return res.status(409).json({
                        error: 'This phone number already belongs to an account.'
                    });
                }
                const user = yield UsersRepository_1.default.UpdateUser(id, { firstName, lastName, username, address, accountLockedOut, role, phoneNumber });
                return res.status(201).json({
                    error: undefined,
                    message: 'User updated successfully'
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be updated.');
            }
        });
    }
    GetUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id) {
                    return res.status(404).json({ error: `User not requested` });
                }
                const ticketRedUser = yield UsersRepository_1.default.getUserById(req.params.id, {
                    id: true,
                    firstName: true,
                    lastName: true,
                    registeredBy: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    username: true,
                    accountLockedOut: true,
                    accessFailedCount: true,
                    phoneNumber: true,
                    createdAt: true,
                    roles: true
                });
                if (!ticketRedUser) {
                    return res.status(404).json({ error: `User doesn't exist` });
                }
                return res.json({ username: ticketRedUser === null || ticketRedUser === void 0 ? void 0 : ticketRedUser.username, firstName: ticketRedUser === null || ticketRedUser === void 0 ? void 0 : ticketRedUser.firstName, lastName: ticketRedUser === null || ticketRedUser === void 0 ? void 0 : ticketRedUser.lastName, phoneNumber: ticketRedUser === null || ticketRedUser === void 0 ? void 0 : ticketRedUser.phoneNumber, accountLockedOut: ticketRedUser === null || ticketRedUser === void 0 ? void 0 : ticketRedUser.accountLockedOut, });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Ticket Validator User couldn\'t be created.');
            }
        });
    }
    ResetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, password } = req.body;
                let userType;
                if (yield db_1.default.user.findUnique({ where: { id } })) {
                    userType = userType_1.default.User;
                }
                else if (yield db_1.default.ticketValidatorUser.findUnique({ where: { id } })) {
                    userType = userType_1.default.TicketValidatorUser;
                }
                else {
                    throw 'User doesn\'t exist';
                }
                yield AuthRepository_1.default.changePassword({ id, userType, password });
                return res.status(200).json({ message: 'Password reset successfully' });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Reset password failed.');
            }
        });
    }
}
exports.default = AdminController;
//# sourceMappingURL=AdminController.js.map