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
class AttendantRepository {
    constructor() { }
    GetAttendantById(id, select) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.attendant.findUnique({
                where: {
                    id,
                },
                select,
            }));
        });
    }
    createUser({ category, subCategory, memberCountry, observerCountry, signatoryCountry, prospectiveCountry, title, firstName, lastName, organization, designation, email, country, phoneNumber, registrationDate, participationMode, sideEvents, role }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.attendant.create({
                data: {
                    category,
                    subCategory,
                    memberCountry,
                    observerCountry,
                    signatoryCountry,
                    prospectiveCountry,
                    title,
                    firstName,
                    lastName,
                    organization,
                    designation,
                    email,
                    country,
                    phoneNumber,
                    registrationDate,
                    participationMode,
                    sideEvents,
                    role
                }
            }));
        });
    }
    createAttendance({ category, subCategory, memberCountry, observerCountry, signatoryCountry, prospectiveCountry, title, firstName, lastName, organization, designation, email, country, phoneNumber, registrationDate, participationMode, sideEvents, role }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.attendant.create({
                data: {
                    category,
                    subCategory,
                    memberCountry,
                    observerCountry,
                    signatoryCountry,
                    prospectiveCountry,
                    title,
                    firstName,
                    lastName,
                    organization,
                    designation,
                    email,
                    country,
                    phoneNumber,
                    registrationDate,
                    participationMode,
                    sideEvents,
                    role
                }
            }));
        });
    }
    createhoheAttendant({ firstName, lastName, phoneNumber }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (db_1.default === null || db_1.default === void 0 ? void 0 : db_1.default.hoheAttendant.create({
                data: {
                    firstName,
                    lastName,
                    phoneNumber
                }
            }));
        });
    }
}
exports.default = new AttendantRepository();
//# sourceMappingURL=AttendantRepository.js.map