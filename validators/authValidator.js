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
exports.phoneNumberLoginSchema = exports.loginSchema = exports.AuthValidator = void 0;
const Joi = require("joi");
class AuthValidator {
    constructor() { }
    validateLogin(schema) {
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
}
exports.AuthValidator = AuthValidator;
exports.loginSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
});
exports.phoneNumberLoginSchema = Joi.object().keys({
    phoneNumber: Joi.string().required(),
    password: Joi.string().required(),
});
//# sourceMappingURL=authValidator.js.map