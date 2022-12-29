"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MovieController_1 = require("../controllers/MovieController");
const roles_1 = require("../data/roles");
const userType_1 = require("../data/userType");
const userAuth_1 = require("../middlewares/userAuth");
const userRoleAuth_1 = require("../middlewares/userRoleAuth");
const userTypeAuth_1 = require("../middlewares/userTypeAuth");
const movieValidator_1 = require("../validators/movieValidator");
const multer = require('multer');
var path = require('path');
class MovieRoutes {
    constructor() {
        this.router = express_1.Router();
        this.movieController = new MovieController_1.default();
        this.movieValidator = new movieValidator_1.MovieValidator();
        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, 'public/images');
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + path.extname(file.originalname));
            }
        });
        this.upload = multer({
            storage: this.storage,
            limits: { fileSize: '2000000' },
            fileFilter: (req, file, cb) => {
                const fileTypes = /jpeg|jpg|png|gif/;
                const mimeType = fileTypes.test(file.mimetype);
                const extname = fileTypes.test(path.extname(file.originalname));
                if (mimeType && extname) {
                    return cb(null, true);
                }
                cb('Give proper files format to upload');
            }
        }).single('posterImg');
        this.initializeRoutes();
    }
    initializeRoutes() {
        /**
         * @swagger
         * /api/movie/:
         *   post:
         *     security:
         *        - bearerAuth: []
         *     summary: Create a movie schedule
         *     tags: [Movie]
         *     requestBody:
         *      required: true
         *      content:
         *          application/json:
         *              schema:
         *                  type: object
         *                  required:
         *                      - title
         *                      - synopsis
         *                      - genre
         *                      - rating
         *                      - runtime
         *                      - posterImg
         *                      - coverImg
         *                      - contentRating
         *                  properties:
         *                      rating:
         *                          type: number
         *                      runtime:
         *                          type: number
         *                      title:
         *                          type: string
         *                      synopsis:
         *                          type: string
         *                      posterImg:
         *                          type: string
         *                      coverImg:
         *                          type: string
         *                      contentRating:
         *                          type: string
         *     responses:
         *       201:
         *         description: Created successfully
         */
        this.router
            .route('/')
            .post(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.movieValidator.validateAdd(movieValidator_1.addMovieSchema), this.upload, this.movieController.CreateEvent);
        // this.router
        // .route('/upload')
        // .post(
        //   // userAuth,
        //   // userTypeAuth(UserType.User),
        //   // userRoleAuth([Roles.Admin]),
        //   this.upload
        // );
        /**
         * @swagger
         * /api/movie/search/{title}:
         *   get:
         *     security:
         *        - bearerAuth: []
         *     summary: Search a movie from external api by its title
         *     tags: [Movie]
         *     parameters:
         *         - name: title
         *           in: path
         *           required: true
         *     responses:
         *       200:
         *         description: OK
         *       404:
         *         description: Movie couldn't be found
         */
        this.router
            .route('/search/:title')
            .get(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.movieController.SearchAnEvent);
        this.router
            .route('/search2/:id')
            .get(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.movieController.SearchAnEvent2);
        this.router.route('/:id').get(this.movieController.GetEventById);
        this.router
            .route('/:id')
            .put(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin]), this.movieValidator.validateAdd(movieValidator_1.addMovieSchema), this.movieController.UpdateEventById);
        /**
         * @swagger
         * /api/movie/:
         *   get:
         *     security:
         *        - bearerAuth: []
         *     summary: Get all movies that are in the system
         *     tags: [Movie]
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         description: All Movies
         */
        this.router
            .route('/')
            .get(userAuth_1.default, userTypeAuth_1.default(userType_1.default.User), userRoleAuth_1.default([roles_1.default.Admin, roles_1.default.Finanace, roles_1.default.Cashier]), this.movieController.GetAllEvents);
        //TODO create swagger doc for this endpoint
        //Returns the latest event by the current user
        // this.router
        //     .route('/latest')
        //     .get(
        //       userAuth,
        //       userTypeAuth(UserType.User),
        //       userRoleAuth([Roles.Admin, Roles.Finanace, Roles.Cashier]),
        //       this.movieController.GetLatestEvent
        //     )
    }
}
exports.default = new MovieRoutes().router;
//# sourceMappingURL=MovieRoutes.js.map