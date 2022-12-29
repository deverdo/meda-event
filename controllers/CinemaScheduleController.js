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
// import CourseRepo from './../repositories/CoursesRepo';
const errorHandler_1 = require("../handlers/errorHandler");
const db_1 = require("../db/db");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
// import { EventType } from '@prisma/client';
// const utc = require('dayjs/plugin/utc');
dayjs.extend(duration);
class EventScheduleController {
    constructor() { }
    CreateEventSchedule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { scheduleRange, event, showTimes, speakers, 
                // vipTicketPrice,
                regularTicketPrice, } = req.body;
                const scheduleStartDate = dayjs(scheduleRange[0]);
                const scheduleEndDate = dayjs(scheduleRange[1]);
                // Get the date difference
                const dateRange = scheduleEndDate.diff(scheduleStartDate, 'day');
                const dateArray = [];
                for (let _ = 0; _ < dateRange + 1; _++) {
                    dateArray.push(scheduleStartDate.add(_, 'day'));
                }
                const showTimeArray = [];
                showTimes.forEach((e) => {
                    showTimeArray.push({
                        // eventType: e.eventType,
                        time: dayjs(e.time),
                        eventHall: e.eventHall,
                    });
                });
                const speakerArray = [];
                speakers.forEach((e) => {
                    speakerArray.push({
                        firstName: e.firstName,
                        lastName: e.lastName,
                        biography: e.biography,
                        posterImg: e.posterImg,
                    });
                });
                yield db_1.default.$transaction([
                    ...dateArray.map((element) => {
                        return db_1.default.eventSchedule.create({
                            data: {
                                date: new Date(element.toDate().setHours(0, 0, 0, 0)),
                                eventId: event,
                                regularTicketPrice: regularTicketPrice,
                                // vipTicketPrice: vipTicketPrice,
                                showTimes: {
                                    createMany: {
                                        data: [
                                            ...showTimeArray.map((e) => {
                                                return {
                                                    eventHallId: e.eventHall,
                                                    // eventType:
                                                    //   e.eventType == '3D' ? EventType.THREE : EventType.TWO,
                                                    time: e.time.toDate(),
                                                };
                                            }),
                                        ],
                                    },
                                },
                                speakers: {
                                    createMany: {
                                        data: [
                                            ...speakerArray.map((e) => {
                                                return {
                                                    firstName: e.firstName,
                                                    lastName: e.lastName,
                                                    biography: e.biography,
                                                    posterImg: e.posterImg,
                                                };
                                            }),
                                        ],
                                    },
                                },
                            },
                        });
                    }),
                ]);
                return res
                    .status(201)
                    .json({ message: 'Schedule Created Successfully!' });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't create Event Hall.");
            }
        });
    }
    GetAllEventSchedules(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json(yield db_1.default.eventSchedule.findMany({
                    include: {
                        event: true,
                        showTimes: {
                            include: {
                                eventHall: true,
                            },
                        },
                        speakers: true,
                    },
                }));
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get schedules.");
            }
        });
    }
    //get event schedules for preview based on tag
    //so basically the frontend request for related events based on the tag of the current event in view
    GetEventSchedulesForPreviewBasedOnTag(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.params);
                const Events = yield db_1.default.eventSchedule.findMany({
                    include: {
                        event: true,
                        showTimes: {
                            include: {
                                eventHall: true,
                            },
                        },
                        speakers: true,
                    }
                });
                console.log(Events);
                let relatedEvents = Events.filter(elem => elem.event.eventType == req.params.eventType);
                console.log(relatedEvents);
                return res.status(200).json(relatedEvents);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get schedules.");
            }
        });
    }
    //get latest event for preview
    GetLatestScheduledEventForPreview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const latestEvents = yield db_1.default.eventSchedule.findMany({
                    orderBy: [
                        {
                            date: "desc"
                        }
                    ],
                    take: 1,
                    include: {
                        event: true,
                        showTimes: {
                            include: {
                                eventHall: true,
                            },
                        },
                        speakers: true,
                    },
                });
                console.log('---------------------- in get latest events-----------------------');
                console.log(latestEvents);
                return res.status(200).json(latestEvents);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "couldnot find event");
            }
        });
    }
    //get event schedules for preview based on time
    //read swagger docs for more info
    GetEventSchedulesForPreview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.query);
                const todayMidnight = new Date(new Date().setHours(0, 0, 0, 0));
                // Fetch Schedules Available forward 5 days;
                const allEventSchedules = yield db_1.default.eventSchedule.findMany({
                    // where: {
                    //   date: {
                    //     gte: todayMidnight,
                    //     lt: dayjs(todayMidnight).add(5, 'day').toDate(),
                    //   },
                    // },
                    include: {
                        event: true,
                        showTimes: {
                            include: {
                                eventHall: true,
                            },
                        },
                        speakers: true,
                    },
                });
                const schedulesGrouped = [];
                allEventSchedules.forEach((e) => {
                    const scheduleDateIndex = schedulesGrouped.findIndex((i) => i.date.getDate() === e.date.getDate());
                    if (scheduleDateIndex == -1) {
                        schedulesGrouped.push({ date: e.date, schedules: [e] });
                    }
                    else {
                        schedulesGrouped[scheduleDateIndex].schedules.push(e);
                    }
                });
                return res.status(200).json(schedulesGrouped);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get schedules.");
            }
        });
    }
    GetEventSchedule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scheduleId = req.params.id;
                if (!scheduleId)
                    return res.status(404).json({ error: "Couldn't find schedule!" });
                const schedule = yield db_1.default.eventSchedule.findUnique({
                    where: {
                        id: scheduleId,
                    },
                    include: {
                        event: true,
                        showTimes: {
                            include: {
                                eventHall: true,
                            },
                        },
                        speakers: true,
                    },
                });
                if (!schedule)
                    return res.status(404).json({ error: "Couldn't find schedule!" });
                return res.json(schedule);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get schedule.");
            }
        });
    }
    // Check
    GetShowTimeWithHall(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const showTimeId = req.params.id;
                if (!showTimeId)
                    return res.status(404).json({ error: "Couldn't find schedule!" });
                const showtime = yield db_1.default.showTime.findUnique({
                    where: {
                        id: showTimeId,
                    },
                    include: {
                        EventSchedule: {
                            include: {
                                event: true,
                            },
                        },
                        eventHall: {
                            select: {
                                name: true,
                                id: true,
                                regularSeats: {
                                    include: {
                                        seats: {
                                            select: {
                                                id: true,
                                                seatName: true,
                                                seatType: true,
                                                TicketsOnSeats: {
                                                    where: {
                                                        eventTicket: {
                                                            showTimeId: showTimeId,
                                                        },
                                                    },
                                                    select: {
                                                        seatId: true,
                                                        seat: {
                                                            select: {
                                                                id: true,
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                // vipSeats: {
                                //   include: {
                                //     seats: {
                                //       select: {
                                //         seatName: true,
                                //         id: true,
                                //         seatType: true,
                                //         TicketsOnSeats: {
                                //           where: {
                                //             eventTicket: {
                                //               showTimeId: showTimeId,
                                //             },
                                //           },
                                //           include: {
                                //             seat: {
                                //               select: {
                                //                 id: true,
                                //               },
                                //             },
                                //           },
                                //         },
                                //       },
                                //     },
                                //   },
                                // },
                            },
                        },
                    },
                });
                if (!showtime)
                    return res.status(404).json({ error: "Couldn't find showtime!" });
                return res.json(showtime);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get showtime.");
            }
        });
    }
    DeleteShowtime(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const showTimeId = req.params.id;
                if (!showTimeId)
                    return res.status(404).json({ error: "Couldn't find showtime!" });
                // Check wether the referenced showtime exists
                const showTime = yield db_1.default.showTime.findUnique({
                    where: {
                        id: showTimeId,
                    },
                });
                if (!showTime) {
                    return res.status(404).json({ error: "Couldn't find showtime!" });
                }
                const ticketsForThisShowTime = yield db_1.default.eventTicket.findMany({
                    where: {
                        showTimeId,
                    },
                    include: {
                        TicketsOnSeats: true,
                    },
                });
                // Had there been tickets sold for this showtime
                if (ticketsForThisShowTime.length > 0) {
                    const totalAmountTickets = ticketsForThisShowTime
                        .map((e) => e.TicketsOnSeats.length)
                        .reduce((a, b) => a + b, 0);
                    return res.status(409).json({
                        error: `${totalAmountTickets} tickets have already been bought for this showtime so unfortunately you can't remove this showtime. You can deactivate it though.`,
                    });
                }
                else {
                    // Free
                    yield db_1.default.showTime.delete({
                        where: {
                            id: showTimeId,
                        },
                    });
                    return res.status(200).json({ message: 'Deleted successfully!' });
                }
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Error deleting showtime.');
            }
        });
    }
    UpdateShowtime(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const showTimeId = req.params.id;
                let { active } = req.body;
                if (active == undefined)
                    active = true;
                if (!showTimeId)
                    return res.status(404).json({ error: "Couldn't find showtime!" });
                const showTime = yield db_1.default.showTime.findUnique({
                    where: {
                        id: showTimeId,
                    },
                });
                if (!showTime) {
                    return res.status(404).json({ error: "Couldn't find showtime!" });
                }
                yield db_1.default.showTime.update({
                    where: {
                        id: showTimeId,
                    },
                    data: {
                        active,
                    },
                });
                return res.status(201).json({ message: 'Showtime updated successfully' });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Error deleting showtime.');
            }
        });
    }
    AddShowTimesToSchedule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { showTimes, } = req.body;
                const scheduleId = req.params.id;
                const showTimeArray = [];
                showTimes.forEach((e) => {
                    showTimeArray.push({
                        // eventType: e.eventType,
                        time: dayjs(e.time),
                        eventHall: e.eventHall,
                    });
                });
                yield db_1.default.eventSchedule.update({
                    where: {
                        id: scheduleId,
                    },
                    data: {
                        showTimes: {
                            createMany: {
                                data: [
                                    ...showTimeArray.map((e) => {
                                        return {
                                            eventHallId: e.eventHall,
                                            // eventType:
                                            //   e.eventType == '3D' ? EventType.THREE : EventType.TWO,
                                            time: e.time.toDate(),
                                        };
                                    }),
                                ],
                            },
                        },
                    },
                });
                return res
                    .status(201)
                    .json({ message: 'Schedule Updated Successfully!' });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't update Schedule.");
            }
        });
    }
    //Speakers Controller
    AddSpeakerToSchedule(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { speakers, } = req.body;
                const scheduleId = req.params.id;
                const speakerArray = [];
                speakers.forEach((e) => {
                    speakerArray.push({
                        firstName: e.firstName,
                        lastName: e.lastName,
                        biography: e.biography,
                        posterImg: e.posterImg,
                    });
                });
                yield db_1.default.eventSchedule.update({
                    where: {
                        id: scheduleId,
                    },
                    data: {
                        speakers: {
                            createMany: {
                                data: [
                                    ...speakerArray.map((e) => {
                                        return {
                                            firstName: e.firstName,
                                            lastName: e.lastName,
                                            biography: e.biography,
                                            posterImg: e.posterImg,
                                        };
                                    }),
                                ],
                            },
                        },
                    },
                });
                return res
                    .status(201)
                    .json({ message: 'Schedule Updated Successfully!' });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't update Schedule.");
            }
        });
    }
    DeleteSpeaker(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const speakerId = req.params.id;
                if (!speakerId)
                    return res.status(404).json({ error: "Couldn't find speaker!" });
                // Check wether the referenced showtime exists
                const speaker = yield db_1.default.speakers.findUnique({
                    where: {
                        id: speakerId,
                    },
                });
                if (!speaker) {
                    return res.status(404).json({ error: "Couldn't find speaker!" });
                }
                yield db_1.default.speakers.delete({
                    where: {
                        id: speakerId,
                    },
                });
                return res.status(200).json({ message: 'Deleted successfully!' });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Error deleting speaker.');
            }
        });
    }
    UpdateSpeaker(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //   const speakerId = req.params.id;
            //   // let { active } = req.body;
            //   // if (active == undefined) active = true;
            //   if (!speakerId)
            //     return res.status(404).json({ error: "Couldn't find speaker!" });
            //   const speaker = await prisma.speakers.findUnique({
            //     where: {
            //       id: speakerId,
            //     },
            //   });
            //   if (!speaker) {
            //     return res.status(404).json({ error: "Couldn't find speaker!" });
            //   }
            //   await prisma.speakers.update({
            //     where: {
            //       id: speakerId,
            //     },
            //     data: {
            //       active,
            //     },
            //   });
            //   return res.status(201).json({ message: 'speaker updated successfully' });
            // } catch (error) {
            //   return apiErrorHandler(error, req, res, 'Error deleting speaker.');
            // }
            return null;
        });
    }
}
exports.default = EventScheduleController;
//# sourceMappingURL=CinemaScheduleController.js.map