"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @DESC Check the application user role
 * Works only for system users not ticket validators
 */
const userRoleAuth = (roles) => (req, res, next) => {
    if (roles.includes(req.user.roles.name)) {
        return next();
    }
    return res.status(403).json({
        message: `Forbidden.`,
        success: false
    });
};
exports.default = userRoleAuth;
//# sourceMappingURL=userRoleAuth.js.map