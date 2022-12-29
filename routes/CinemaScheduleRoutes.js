"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CinemaScheduleController_1 = require("../controllers/CinemaScheduleController");
const roles_1 = require("../data/roles");
const userType_1 = require("../data/userType");
const userAuth_1 = require("../middlewares/userAuth");
const userRoleAuth_1 = require("../middlewares/userRoleAuth");
const userTypeAuth_1 = require("../middlewares/userTypeAuth");
const cinemaScheduleValidator_1 = require("../validators/cinemaScheduleValidator");
class CinemaScheduleRoutes {
    constructor() {
        this.router = express_1.Router();
        this.cinemaScheduleController = new CinemaScheduleController_1.default();
        this.cinemaScheduleValidator = new cinemaScheduleValidator_1.CinemaScheduleValidator();
        this.initializeRoutes();
    }
    initializeRoutes() {
        /**
         * @swagger
         * /api/cinema-schedule:
         *   post:
         *     security:
         *        - bearerAuth: []
         *     summary: Create a movie schedule
         *     tags: [Cinema Schedule]
         *     requestBody:
         *      required: true
         *      content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  required:
         *                      - regularTicketPrice
         *                      - vipTicketPrice
         *                      - scheduleRange
         *                      - movie
         *                      - showTimes
         *                  properties:
         *                      regularTicketPrice:
         *                          type: number
         *                      vipTicketPrice:
         *                          type: number
         *                      movie:
         *                          type: string
         *                          description: the referenced movie id
         *                      scheduleRange:
         *                          type: array
         *                          description: date start to date end
         *                          items:
         *                              type: string
         *                      showTimes:
         *                          type: array
         *                          description: Showtime schema
         *                          items:
         *                              type: object
         *                              properties:
         *                                  movieType:
         *                                      type: string
         *                                  time:
         *                                      type: string
         *                                  cinemaHall:
         *                                      description: the referenced cinema hall Id
         *                                      type: string
         *     responses:
         *       201:
         *         description: Created successfully
         */
        this.router
            .route('/')
            .post(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.cinemaScheduleValidator.validateAdd(cinemaScheduleValidator_1.addCinemaScheduleSchema), this.cinemaScheduleController.CreateEventSchedule);
        /**
         * @swagger
         * /api/cinema-schedule:
         *   get:
         *     security:
         *        - bearerAuth: []
         *     summary: Get all cinema schedules
         *     tags: [Cinema Schedule]
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: All Cinema schedules
         */
        this.router
            .route('/')
            .get(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin, roles_1.default.Finanace, roles_1.default.Cashier]), this.cinemaScheduleController.GetAllEventSchedules);
        /**
         * @swagger
         * /api/cinema-schedule/schedules-preview:
         *   get:
         *     summary: Get all cinema for preview (from now to 5 days in advance from now)
         *     tags: [Cinema Schedule]
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: All Cinema schedules
         */
        this.router
            .route('/schedules-preview/:eventType')
            .get(this.cinemaScheduleController.GetEventSchedulesForPreviewBasedOnTag);
        this.router
            .route('/schedules-preview')
            .get(this.cinemaScheduleController.GetEventSchedulesForPreview);
        this.router
            .route('/latest-schedule-preview')
            .get(this.cinemaScheduleController.GetLatestScheduledEventForPreview);
        /**
         * @swagger
         * /api/cinema-schedule/schedule/{id}:
         *   get:
         *     summary: Get a schedule by id
         *     tags: [Cinema Schedule]
         *     parameters:
         *         - name: id
         *           in: path
         *           required: true
         *     responses:
         *       200:
         *         description: OK
         *       404:
         *         description: It doesn't exist
         */
        this.router
            .route('/schedule/:id')
            .get(this.cinemaScheduleController.GetEventSchedule);
        /**
         * @swagger
         * /api/cinema-schedule/schedule/showtime/{id}:
         *   get:
         *     summary: Get a schedule showtime with hall
         *     tags: [Cinema Schedule]
         *     parameters:
         *         - name: id
         *           in: path
         *           required: true
         *     responses:
         *       200:
         *         description: OK
         *       404:
         *         description: It doesn't exist
         */
        this.router
            .route('/schedule/showtime/:id')
            .get(this.cinemaScheduleController.GetShowTimeWithHall);
        /**
         * @swagger
         * /api/cinema-schedule/schedule/showtime/{id}:
         *   delete:
         *     security:
         *        - bearerAuth: []
         *     summary: Delete a showtime from schedule
         *     tags: [Cinema Schedule]
         *     parameters:
         *         - name: id
         *           in: path
         *           required: true
         *     responses:
         *       200:
         *         description: OK
         *       409:
         *         description: A ticket is bought for this showtime thus it can't be deleted
         */
        this.router
            .route('/schedule/showtime/:id')
            .delete(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.cinemaScheduleController.DeleteShowtime);
        /**
         * @swagger
         * /api/cinema-schedule/schedule/showtime/{id}:
         *   put:
         *     security:
         *        - bearerAuth: []
         *     summary: Deactivate a showtime for now (Can be extended to update more)
         *     tags: [Cinema Schedule]
         *     requestBody:
         *      required: true
         *      content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  required:
         *                      - active
         *                  properties:
         *                      active:
         *                          type: boolean
         *     parameters:
         *         - name: id
         *           in: path
         *           required: true
         *     responses:
         *       200:
         *         description: OK
         */
        this.router
            .route('/schedule/showtime/:id')
            .put(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.cinemaScheduleController.UpdateShowtime);
        /**
         * @swagger
         * /api/cinema-schedule/schedule/{id}/add-showtime:
         *   put:
         *     security:
         *        - bearerAuth: []
         *     summary: Add a showtime to existing schedule
         *     tags: [Cinema Schedule]
         *     parameters:
         *         - name: id
         *           in: path
         *           required: true
         *     requestBody:
         *      required: true
         *      content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  required:
         *                      - showTimes
         *                  properties:
         *                      showTimes:
         *                          type: array
         *                          description: Showtime schema
         *                          items:
         *                              type: object
         *                              properties:
         *                                  movieType:
         *                                      type: string
         *                                  time:
         *                                      type: string
         *                                  cinemaHall:
         *                                      description: the referenced cinema hall Id
         *                                      type: string
         *     responses:
         *       201:
         *         description: Updated successfully
         */
        this.router
            .route('/schedule/:id/add-showtime')
            .put(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.cinemaScheduleController.AddShowTimesToSchedule);
        /////////////////////////////////////////////////
        // this.router
        //   .route('/schedule/showtime/:id')
        //   .get(this.cinemaScheduleController.GetShowTimeWithHall);
        // /**
        //  * @swagger
        //  * /api/cinema-schedule/schedule/showtime/{id}:
        //  *   delete:
        //  *     security:
        //  *        - bearerAuth: []
        //  *     summary: Delete a showtime from schedule
        //  *     tags: [Cinema Schedule]
        //  *     parameters:
        //  *         - name: id
        //  *           in: path
        //  *           required: true
        //  *     responses:
        //  *       200:
        //  *         description: OK
        //  *       409:
        //  *         description: A ticket is bought for this showtime thus it can't be deleted
        //  */
        this.router
            .route('/schedule/speaker/:id')
            .delete(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.cinemaScheduleController.DeleteSpeaker);
        /**
         * @swagger
         * /api/cinema-schedule/schedule/showtime/{id}:
         *   put:
         *     security:
         *        - bearerAuth: []
         *     summary: Deactivate a showtime for now (Can be extended to update more)
         *     tags: [Cinema Schedule]
         *     requestBody:
         *      required: true
         *      content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  required:
         *                      - active
         *                  properties:
         *                      active:
         *                          type: boolean
         *     parameters:
         *         - name: id
         *           in: path
         *           required: true
         *     responses:
         *       200:
         *         description: OK
         */
        this.router
            .route('/schedule/speaker/:id')
            .put(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.cinemaScheduleController.UpdateSpeaker);
        /**
         * @swagger
         * /api/cinema-schedule/schedule/{id}/add-showtime:
         *   put:
         *     security:
         *        - bearerAuth: []
         *     summary: Add a showtime to existing schedule
         *     tags: [Cinema Schedule]
         *     parameters:
         *         - name: id
         *           in: path
         *           required: true
         *     requestBody:
         *      required: true
         *      content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  required:
         *                      - showTimes
         *                  properties:
         *                      showTimes:
         *                          type: array
         *                          description: Showtime schema
         *                          items:
         *                              type: object
         *                              properties:
         *                                  movieType:
         *                                      type: string
         *                                  time:
         *                                      type: string
         *                                  cinemaHall:
         *                                      description: the referenced cinema hall Id
         *                                      type: string
         *     responses:
         *       201:
         *         description: Updated successfully
         */
        this.router
            .route('/schedule/:id/add-speaker')
            .put(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.cinemaScheduleController.AddSpeakerToSchedule);
    }
}
exports.default = new CinemaScheduleRoutes().router;
//# sourceMappingURL=CinemaScheduleRoutes.js.map