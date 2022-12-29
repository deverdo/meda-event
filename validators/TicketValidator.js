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
exports.TicketValidator = void 0;
class TicketValidator {
    constructor() { }
    validateGetSingle() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.ticketKey) {
                    throw 'Id not sent with request';
                }
                next();
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
    validateCheckIn() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id) {
                    throw 'Id not sent with request';
                }
                next();
            }
            catch (error) {
                res.status(400).json(error);
            }
        });
    }
}
exports.TicketValidator = TicketValidator;
//# sourceMappingURL=TicketValidator.js.map