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
const client_1 = require("@prisma/client");
class EventHallController {
    constructor() { }
    CreateEventHall(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventHallName, regularSeatMap } = req.body;
                const createdEventHall = yield db_1.default.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                    const eventHall = yield prisma.eventHall.create({
                        data: {
                            name: eventHallName,
                        }
                    });
                    for (const e of regularSeatMap) {
                        yield prisma.seatColumn.create({
                            data: {
                                columnName: e.columnName,
                                columnOrder: e.columnOrder,
                                columnType: e.columnType,
                                eventHallRegularId: eventHall.id,
                                seats: {
                                    createMany: {
                                        data: [
                                            ...e.seats.map(seat => {
                                                return {
                                                    seatType: client_1.SeatType.REGULAR,
                                                    seatName: seat.seatName
                                                };
                                            })
                                        ]
                                    }
                                }
                            }
                        });
                    }
                    // for (const e of vipSeatMap) {
                    //     await prisma.seatColumn.create({
                    //         data: {
                    //             columnName: e.columnName,
                    //             columnOrder: e.columnOrder,
                    //             columnType: e.columnType,
                    //             // eventHallVipId: eventHall.id,
                    //             seats: {
                    //                 createMany: {
                    //                     data: [
                    //                         ...e.seats.map(seat => {
                    //                             return {
                    //                                 seatType: SeatType.VIP,
                    //                                 seatName: seat.seatName
                    //                             };
                    //                         })
                    //                     ]
                    //                 }
                    //             }
                    //         }
                    //     });
                    // }
                    return yield prisma.eventHall.findUnique({
                        where: {
                            id: eventHall.id,
                        },
                        include: {
                            regularSeats: {
                                include: {
                                    seats: true
                                }
                            }
                            // vipSeats: {
                            //     include: {
                            //         seats: true
                            //     }
                            // }
                        }
                    });
                }));
                return res.status(201).json(createdEventHall);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Couldn\'t create Cinema Hall.');
            }
        });
    }
    GetAllEventHalls(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return res.status(200).json(yield db_1.default.eventHall.findMany({
                    include: {
                        regularSeats: {
                            include: {
                                seats: true
                            }
                        }
                        // vipSeats: {
                        //     include: {
                        //         seats: true
                        //     }
                        // }
                    }
                }));
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Couldn\'t create movie.');
            }
        });
    }
}
exports.default = EventHallController;
//# sourceMappingURL=CinemaHallController.js.map