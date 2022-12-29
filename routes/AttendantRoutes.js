"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AttendantController_1 = require("../controllers/AttendantController");
const roles_1 = require("../data/roles");
const userType_1 = require("../data/userType");
const userAuth_1 = require("../middlewares/userAuth");
const userRoleAuth_1 = require("../middlewares/userRoleAuth");
const userTypeAuth_1 = require("../middlewares/userTypeAuth");
const TicketValidator_1 = require("../validators/TicketValidator");
class AttendantRoutes {
    constructor() {
        this.router = express_1.Router();
        this.attendantController = new AttendantController_1.default();
        this.ticketValidator = new TicketValidator_1.TicketValidator();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router
            .route('/register')
            .post(
        // this.adminValidator.validateRegister(registerUserSchema),
        this.attendantController.CreateUser);
        this.router
            .route('/fetch')
            .get(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Finanace]), this.attendantController.GetAllAttendance);
        this.router
            .route('/')
            .get(
        // userAuth,
        // userTypeAuth(UserType.User),
        // userRoleAuth([Roles.Finanace]),
        this.attendantController.GetAllAttendant);
        this.router
            .route('/register')
            .post(
        // this.adminValidator.validateRegister(registerUserSchema),
        this.attendantController.CreateUser);
        this.router
            .route('/:session/:id')
            .post(userAuth_1.default, userTypeAuth_1.default(userType_1.default.TicketValidatorUser), this.ticketValidator.validateCheckIn(), this.attendantController.CheckBadge);
        this.router
            .route('/register-hohe')
            .post(
        // this.adminValidator.validateRegister(registerUserSchema),
        this.attendantController.CreatehoheUser);
        this.router
            .route('/hohe/:phone')
            .get(
        // this.adminValidator.validateRegister(registerUserSchema),
        this.attendantController.gethoheUser);
        this.router
            .route('/fetch-hohe')
            .get(
        // userAuth,
        // userTypeAuth(UserType.User),
        // userRoleAuth([Roles.Finanace]),
        this.attendantController.GetAllHoheAttendant);
        this.router
            .route('/fetch-attendance')
            .get(
        // userAuth,
        // userTypeAuth(UserType.User),
        // userRoleAuth([Roles.Finanace]),
        this.attendantController.GetAllHoheAttendance);
        this.router
            .route('/:id')
            .post(
        // userAuth,
        // userTypeAuth(UserType.TicketValidatorUser),
        // this.ticketValidator.validateCheckIn(),
        this.attendantController.CheckHoheBadge);
    }
}
exports.default = new AttendantRoutes().router;
//# sourceMappingURL=AttendantRoutes.js.map