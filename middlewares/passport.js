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
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("../config");
const UsersRepository_1 = require("../repositories/UsersRepository");
const TicketRedeemerUserRepository_1 = require("../repositories/TicketRedeemerUserRepository");
const userType_1 = require("../data/userType");
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config_1.jwtSecret
};
function checkUserExists(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        user = yield UsersRepository_1.default.getUserById(id, {
            firstName: true,
            lastName: true,
            id: true,
            registeredBy: true,
            roles: true,
            username: true,
            accountLockedOut: true,
            accessFailedCount: true,
            phoneNumber: true,
            createdAt: true,
        });
        if (user) {
            user.userType = userType_1.default.User;
            return user;
        }
        user = yield TicketRedeemerUserRepository_1.default.getTicketRedeemerUserById(id, {
            id: true,
            firstName: true,
            lastName: true,
            registeredBy: true,
            username: true,
            accountLockedOut: true,
            accessFailedCount: true,
            phoneNumber: true,
            createdAt: true,
        });
        if (user) {
            user.userType = userType_1.default.TicketValidatorUser;
            return user;
        }
        return user;
    });
}
exports.default = passport => {
    passport.use(new passport_jwt_1.Strategy(options, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        yield checkUserExists(payload.id).then((user) => __awaiter(void 0, void 0, void 0, function* () {
            // treat a locked out account as Unauthenticated
            if (user && !user.accountLockedOut) {
                return done(undefined, user);
            }
            return done(undefined, false);
        })).catch(err => {
            console.log(err);
            done(undefined, false);
        });
    })));
};
//# sourceMappingURL=passport.js.map