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
exports.lessonSchema = exports.LessonValidator = void 0;
const Joi = require("joi");
class LessonValidator {
    constructor() { }
    validateBody(schema) {
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
exports.LessonValidator = LessonValidator;
exports.lessonSchema = Joi.object().keys({
    courseId: Joi.number().integer().required(),
    url: Joi.string().trim().uri().required(),
    description: Joi.string().trim(),
    thumbnailUrl: Joi.string().uri(),
    title: Joi.string().trim().required(),
    duration: Joi.string(),
    seqNo: Joi.number(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
});
//# sourceMappingURL=lessonValidator.js.map