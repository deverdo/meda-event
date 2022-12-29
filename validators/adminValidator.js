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
exports.resetUser = exports.updaterUserSchema = exports.updateTicketRedeemerUserSchema = exports.registerTicketRedeemerUserSchema = exports.registerUserSchema = exports.AdminValidator = void 0;
const Joi = require("joi");
class AdminValidator {
    constructor() { }
    validateRegister(schema) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const val = yield schema.validateAsync(req.body);
                req.value = (_a = req.value) !== null && _a !== void 0 ? _a : {};
                req.value.body = (_b = req.value.body) !== null && _b !== void 0 ? _b : val;
                next();
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
    validateResetPassword() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const val = yield exports.resetUser.validateAsync(req.body);
                req.value = (_a = req.value) !== null && _a !== void 0 ? _a : {};
                req.value.body = (_b = req.value.body) !== null && _b !== void 0 ? _b : val;
                next();
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
    validateObjectUpdate(schema) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (!req.params.id) {
                    throw 'Id not sent with request';
                }
                const val = yield schema.validateAsync(req.body);
                req.value = (_a = req.value) !== null && _a !== void 0 ? _a : {};
                req.value.body = (_b = req.value.body) !== null && _b !== void 0 ? _b : val;
                next();
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
}
exports.AdminValidator = AdminValidator;
exports.registerUserSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().length(4).required(),
    // tslint:disable-next-line:no-null-keyword
    phoneNumber: Joi.string().required(),
    // tslint:disable-next-line:no-null-keyword
    address: Joi.string().allow(null),
    role: Joi.number().required(),
});
exports.registerTicketRedeemerUserSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().length(4).required(),
    phoneNumber: Joi.string().required(),
    // tslint:disable-next-line:no-null-keyword
    address: Joi.string(),
});
exports.updateTicketRedeemerUserSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    accountLockedOut: Joi.bool().required(),
    // tslint:disable-next-line:no-null-keyword
    address: Joi.string(),
});
exports.updaterUserSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    accountLockedOut: Joi.bool().required(),
    // tslint:disable-next-line:no-null-keyword
    address: Joi.string(),
});
exports.resetUser = Joi.object().keys({
    id: Joi.string().required(),
    password: Joi.string().length(4).required(),
});
//# sourceMappingURL=adminValidator.js.map