"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RedeemerUserController_1 = require("../controllers/RedeemerUserController");
const roles_1 = require("../data/roles");
const userType_1 = require("../data/userType");
const userAuth_1 = require("../middlewares/userAuth");
const userRoleAuth_1 = require("../middlewares/userRoleAuth");
const userTypeAuth_1 = require("../middlewares/userTypeAuth");
class RedeemerUserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.ticketRedeemerUserController = new RedeemerUserController_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // Get key val pair for ticket red users for filtering
        /**
         * @swagger
         * /api/api/redeemer-users:
         *   get:
         *     security:
         *        - bearerAuth: []
         *     summary: Get all ticket redeemer users in the system (For role Finance and Cashier)
         *     tags: [Ticket redeemer]
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: All ticket redeemer users
         */
        this.router
            .route('/')
            .get(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin, roles_1.default.Finanace, roles_1.default.Cashier]), this.ticketRedeemerUserController.GetAllRedeemerUsers);
    }
}
exports.default = new RedeemerUserRoutes().router;
//# sourceMappingURL=RedemmerUserRoutes.js.map