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
const config_1 = require("../config");
// import CourseRepo from './../repositories/CoursesRepo';
const errorHandler_1 = require("../handlers/errorHandler");
const EventRepository_1 = require("../repositories/EventRepository");
const fetch = require("node-fetch");
// const multer  = require('multer')
// var path = require('path')
// export const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//                 cb(null, 'public/images')
//         },
//         filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname))
//    }
// })
// export const upload = multer({
//         storage: storage,
//         limits: { fileSize: '2000000' },
//         fileFilter: (req, file, cb) => {
//                 const fileTypes = /jpeg|jpg|png|gif/
//                 const mimeType = fileTypes.test(file.mimetype)
//                 const extname = fileTypes.test(path.extname(file.originalname))
//                 if(mimeType && extname) {
//                         return cb(null, true)
//                 }
//                 cb('Give proper files format to upload')
//         }
// }).single('posterImg')
class EventController {
    constructor() { }
    CreateEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, synopsis, tags, runtime, posterImg, eventOrganizer, trailerLink, eventType } = req.body;
                const evOld = yield prisma.event.findUnique({
                    where: {
                        title: title,
                    },
                });
                if (evOld) {
                    return res.status(409).json({
                        error: 'Event already exists.',
                    });
                }
                const event = EventRepository_1.default.createEvent({
                    tags,
                    eventAdderId: req.user.id,
                    eventOrganizer,
                    posterImg,
                    runtime,
                    synopsis,
                    title,
                    trailerLink,
                    eventType
                });
                return res.status(201).json({
                    error: undefined,
                    message: 'Event created successfully',
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't create event.");
            }
        });
    }
    SearchAnEvent(req, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const title = req.params.title;
                const res = yield fetch(`http://www.omdbapi.com/?` +
                    new URLSearchParams({
                        t: title,
                        apikey: config_1.omdbApiKey,
                    }), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                let responseJson = {};
                if (res.status == 200) {
                    const json = (yield res.json());
                    if (json.Error) {
                        responseJson = { error: json.Error };
                    }
                    else {
                        responseJson = json;
                    }
                }
                else {
                    const json = (yield res.json());
                    if (json.Error) {
                        responseJson = { error: json.Error };
                    }
                    else {
                        responseJson = { error: 'Internal server error.' };
                    }
                }
                return response.status(200).json(responseJson);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, response, "Couldn't Find event.");
            }
        });
    }
    SearchAnEvent2(req, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const res = yield prisma.event.findUnique({
                    where: {
                        id: id,
                    },
                });
                // let responseJson = {};
                // if (res.status == 200) {
                //   const json = (await res.json()) as any;
                //   if (json.Error) {
                //     responseJson = { error: json.Error };
                //   } else {
                //     responseJson = json;
                //   }
                // } else {
                //   const json = (await res.json()) as any;
                //   if (json.Error) {
                //     responseJson = { error: json.Error };
                //   } else {
                //     responseJson = { error: 'Internal server error.' };
                //   }
                // }
                return response.status(200).json(res);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, response, "Couldn't Find event.");
            }
        });
    }
    UpdateEventById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { title, synopsis, eventOrganizer, tags, runtime, posterImg, eventAdderId, trailerLink, } = req.body;
                // const usernameTaken = await UsersRepository.getUserByUsername(username);
                // if (usernameTaken && id != usernameTaken.id) {
                //     return res.status(409).json({
                //         error: 'This username already belongs to an account.'
                //     });
                // }
                // const phoneNumberTaken = await UsersRepository.getUserByPhoneNumber(phoneNumber);
                // if (phoneNumberTaken && id != phoneNumberTaken?.id) {
                //     return res.status(409).json({
                //         error: 'This phone number already belongs to an account.'
                //     });
                // }
                const user = yield EventRepository_1.default.UpdateEvent(id, { title, synopsis, eventOrganizer, tags, runtime, posterImg, eventAdderId, trailerLink });
                return res.status(201).json({
                    error: undefined,
                    message: 'Event updated successfully'
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Event couldn\'t be updated.');
            }
        });
    }
    GetEventById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.params.id) {
                    return res.status(404).json({ error: `Event not requested` });
                }
                const eventselected = yield EventRepository_1.default.getEventById(req.params.id, {
                    title: true,
                    synopsis: true,
                    eventOrganizer: true,
                    tags: true,
                    runtime: true,
                    posterImg: true,
                    eventAdderId: true,
                    trailerLink: true,
                });
                if (!eventselected) {
                    return res.status(404).json({ error: `User doesn't exist` });
                }
                return res.json({
                    title: eventselected === null || eventselected === void 0 ? void 0 : eventselected.title,
                    synopsis: eventselected === null || eventselected === void 0 ? void 0 : eventselected.synopsis,
                    eventOrganizer: eventselected === null || eventselected === void 0 ? void 0 : eventselected.eventOrganizer,
                    tags: eventselected === null || eventselected === void 0 ? void 0 : eventselected.tags,
                    runtime: eventselected === null || eventselected === void 0 ? void 0 : eventselected.runtime,
                    posterImg: eventselected === null || eventselected === void 0 ? void 0 : eventselected.posterImg,
                    eventAdderId: eventselected === null || eventselected === void 0 ? void 0 : eventselected.eventAdderId,
                    trailerLink: eventselected === null || eventselected === void 0 ? void 0 : eventselected.trailerLink,
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Event couldn\'t be Created.');
            }
        });
    }
    GetAllEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.json(yield prisma.event.findMany({
                    include: {
                        addedBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                }));
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't create event.");
            }
        });
    }
}
exports.default = EventController;
//# sourceMappingURL=MovieController.js.map