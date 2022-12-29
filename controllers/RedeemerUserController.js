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
class RedeemerUserController {
    constructor() { }
    GetAllRedeemerUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.json(yield prisma.ticketValidatorUser.findMany({
                    select: {
                        firstName: true,
                        lastName: true,
                        id: true
                    }
                }));
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Couldn\'t get users.');
            }
        });
    }
}
exports.default = RedeemerUserController;
//# sourceMappingURL=RedeemerUserController.js.map