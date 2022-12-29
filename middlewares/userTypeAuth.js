"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @DESC Check the application type user
 */
const userTypeAuth = type => (req, res, next) => {
    if (type === req.user.userType) {
        return next();
    }
    return res.status(401).json({
        message: `Unauthorized.`,
        success: false
    });
};
exports.default = userTypeAuth;
//# sourceMappingURL=userTypeAuth.js.map