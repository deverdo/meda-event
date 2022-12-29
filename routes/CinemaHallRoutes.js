"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CinemaHallController_1 = require("../controllers/CinemaHallController");
const roles_1 = require("../data/roles");
const userType_1 = require("../data/userType");
const userAuth_1 = require("../middlewares/userAuth");
const userRoleAuth_1 = require("../middlewares/userRoleAuth");
const userTypeAuth_1 = require("../middlewares/userTypeAuth");
const cinemaHallValidator_1 = require("../validators/cinemaHallValidator");
class CinemaHallRoutes {
    constructor() {
        this.router = express_1.Router();
        this.cinemaHallController = new CinemaHallController_1.default();
        this.cinemaHallValidator = new cinemaHallValidator_1.CinemaHallValidator();
        this.initializeRoutes();
    }
    initializeRoutes() {
        /**
         * @swagger
         * /api/cinema-hall/:
         *   post:
         *     security:
         *        - bearerAuth: []
         *     summary: Create a cinema hall
         *     tags: [Cinema Hall]
         *     requestBody:
         *      required: true
         *      content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  required:
         *                      - regularSeatMap
         *                      - vipSeatMap
         *                      - cinemaHallName
         *                  properties:
         *                      cinemaHallName:
         *                          type: string
         *                      vipSeatMap:
         *                          type: array
         *                          items:
         *                              type: object
         *                              properties:
         *                                  columnName:
         *                                      type: string
         *                                  seats:
         *                                      type: array
         *                                      items:
         *                                          type: string
         *                                  columnOrder:
         *                                       type: string
         *                                  columnType:
         *                                       type: string
         *                                       enum: [PADDING, SEATMAP]
         *                      regularSeatMap:
         *                          type: array
         *                          items:
         *                              type: object
         *                              properties:
         *                                  columnName:
         *                                      type: string
         *                                  seats:
         *                                      type: array
         *                                      items:
         *                                          type: string
         *                                  columnOrder:
         *                                       type: string
         *                                  columnType:
         *                                       type: string
         *                                       enum: [PADDING, SEATMAP]
         *     responses:
         *       201:
         *         description: Created successfully
         */
        this.router
            .route('/')
            .post(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.cinemaHallValidator.validateAdd(cinemaHallValidator_1.addCinemaHallSchema), this.cinemaHallController.CreateEventHall);
        /**
         * @swagger
         * /api/cinema-hall/:
         *   get:
         *     security:
         *        - bearerAuth: []
         *     summary: Get all the cinema halls on the system
         *     tags: [Cinema Hall]
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: All Cinema halls
         */
        this.router
            .route('/')
            .get(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin, roles_1.default.Finanace, roles_1.default.Finanace]), this.cinemaHallController.GetAllEventHalls);
    }
}
exports.default = new CinemaHallRoutes().router;
//# sourceMappingURL=CinemaHallRoutes.js.map