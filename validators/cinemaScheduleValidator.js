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
exports.addCinemaScheduleSchema = exports.CinemaScheduleValidator = void 0;
const Joi = require("joi");
class CinemaScheduleValidator {
    constructor() { }
    validateAdd(schema) {
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
exports.CinemaScheduleValidator = CinemaScheduleValidator;
exports.addCinemaScheduleSchema = Joi.object().keys({
    regularTicketPrice: Joi.number().required(),
    // vipTicketPrice: Joi.number(),
    scheduleRange: Joi.array().items(Joi.date()).required(),
    event: Joi.string().required(),
    showTimes: Joi.array().items(Joi.object().keys({ time: Joi.date(), eventHall: Joi.string().required(), })),
    speakers: Joi.array().items(Joi.object().keys({ firstName: Joi.string().required(), lastName: Joi.string().required(), biography: Joi.string().required(), posterImg: Joi.string().required(), })),
});
//# sourceMappingURL=cinemaScheduleValidator.js.map