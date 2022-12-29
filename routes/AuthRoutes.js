"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const roles_1 = require("../data/roles");
const userType_1 = require("../data/userType");
const userAuth_1 = require("../middlewares/userAuth");
const userRoleAuth_1 = require("../middlewares/userRoleAuth");
const userTypeAuth_1 = require("../middlewares/userTypeAuth");
const authValidator_1 = require("../validators/authValidator");
class AuthRoutes {
    constructor() {
        this.router = express_1.Router();
        this.authController = new AuthController_1.default();
        this.authValidator = new authValidator_1.AuthValidator();
        this.initializeRoutes();
    }
    initializeRoutes() {
        /**
         * @swagger
         * /api/auth/login-user:
         *   post:
         *     summary: Login system user
         *     tags: [Authentication]
         *     requestBody:
         *      required: true
         *      content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  required:
         *                      - username
         *                      - password
         *                  properties:
         *                      password:
         *                          type: string
         *                      username:
         *                          type: string
         *     responses:
         *       401:
         *         description: Username or password is incorrect
         *       200:
         *         description: Login success
         */
        this.router
            .route('/login-user')
            .post(this.authValidator.validateLogin(authValidator_1.loginSchema), this.authController.LoginUser);
        /**
         * @swagger
         * /api/auth/current-user/:
         *   get:
         *     security:
         *        - bearerAuth: []
         *     summary: Gt current user if logged in
         *     tags: [Authentication]
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Current user
         */
        this.router
            .route('/current-user')
            .get(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin, roles_1.default.Finanace]), this.authController.GetCurrentUser);
        /**
         * @swagger
         * /api/auth/current-ticket-validator-user:
         *   get:
         *     security:
         *        - bearerAuth: []
         *     summary: Gt current ticket redeemer user if logged in
         *     tags: [Authentication]
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: Current user
         */
        this.router
            .route('/current-ticket-validator-user')
            .get(userAuth_1.default, userTypeAuth_1.default(userType_1.default.TicketValidatorUser), this.authController.GetCurrentTicketValidatorUser);
        /**
         * @swagger
         * /api/auth/login-ticket-validator-user:
         *   post:
         *     summary: Login ticket redeemer user
         *     tags: [Authentication]
         *     requestBody:
         *      required: true
         *      content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  required:
         *                      - phoneNumber
         *                      - password
         *                  properties:
         *                      password:
         *                          type: string
         *                      phoneNumber:
         *                          type: string
         *     responses:
         *       401:
         *         description: phoneNumber or password is incorrect
         *       200:
         *         description: Login success
         */
        this.router
            .route('/login-ticket-validator-user')
            .post(this.authValidator.validateLogin(authValidator_1.phoneNumberLoginSchema), this.authController.LoginTicketValidatorUser);
    }
}
exports.default = new AuthRoutes().router;
//# sourceMappingURL=AuthRoutes.js.map