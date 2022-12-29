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
class UsersRepository {
    constructor() { }
    getUserById(id, select) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.user.findUnique({
                where: {
                    id
                },
                select
            }));
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.user.findUnique({
                where: {
                    normalizedUsername: username.toUpperCase()
                },
                include: {
                    roles: true,
                    registeredBy: true
                }
            }));
        });
    }
    getUserByPhoneNumber(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.user.findUnique({
                where: {
                    phoneNumber
                },
                include: {
                    roles: true,
                    registeredBy: true
                }
            }));
        });
    }
    createUser({ firstName, lastName, username, password, registrantId, phoneNumber, role, address }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.user.create({
                data: {
                    firstName,
                    lastName,
                    username,
                    normalizedUsername: username.toUpperCase(),
                    password,
                    registrantId,
                    userRoleId: role,
                    phoneNumber,
                    address
                },
                include: {
                    roles: true
                }
            }));
        });
    }
    UpdateUser(id, { firstName, lastName, username, address, accountLockedOut, role, phoneNumber }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.user.update({
                where: {
                    id: id
                },
                data: {
                    firstName,
                    lastName,
                    username,
                    normalizedUsername: username.toUpperCase(),
                    address,
                    accountLockedOut,
                    userRoleId: role,
                    phoneNumber: phoneNumber
                },
            }));
        });
    }
}
exports.default = new UsersRepository();
//# sourceMappingURL=UsersRepository.js.map