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
const db_1 = require("../db/db");
class TicketRedeemerUserRepository {
    constructor() { }
    getTicketRedeemerUserById(id, select) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.ticketValidatorUser.findUnique({
                where: {
                    id
                },
                select
            }));
        });
    }
    getTicketRedeemerUserByUserName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.ticketValidatorUser.findUnique({
                where: {
                    normalizedUsername: username.toUpperCase()
                },
                include: {
                    registeredBy: true
                }
            }));
        });
    }
    getTicketRedeemerUserByPhoneNumber(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.ticketValidatorUser.findUnique({
                where: {
                    phoneNumber
                },
                include: {
                    registeredBy: true
                }
            }));
        });
    }
    createTicketRedeemer({ firstName, lastName, username, password, registrantId, phoneNumber, address }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.ticketValidatorUser.create({
                data: {
                    firstName,
                    lastName,
                    username,
                    normalizedUsername: username.toUpperCase(),
                    password,
                    registrantId,
                    phoneNumber,
                    address
                },
            }));
        });
    }
    updateTicketRedeemer(id, { firstName, lastName, username, address, accountLockedOut }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.ticketValidatorUser.update({
                where: {
                    id: id
                },
                data: {
                    firstName,
                    lastName,
                    username,
                    normalizedUsername: username.toUpperCase(),
                    address,
                    accountLockedOut
                },
            }));
        });
    }
    getAllTicketRedeemerUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.ticketValidatorUser.findMany({
                where: {},
                select: {
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
                }
            }));
        });
    }
}
exports.default = new TicketRedeemerUserRepository();
//# sourceMappingURL=TicketRedeemerUserRepository.js.map