"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
/**
 * @DESC General User Authentication
 */
const userAuth = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, function (err, user, info) {
        if (err) {
            console.log('==================== in passport error ==========================');
            console.log(err);
            return next(err);
        }
        if (!user) {
            console.log("=========================== user not found=====================");
            return res
                .status(401)
                .json({ error: (info === null || info === void 0 ? void 0 : info.message) || 'Unauthenticated user!' });
        }
        req.user = user;
        return next();
    })(req, res, next);
};
// const userAuth = passport.authenticate('jwt', { session: false });
exports.default = userAuth;
//# sourceMappingURL=userAuth.js.map