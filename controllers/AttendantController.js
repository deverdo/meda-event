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
const errorHandler_1 = require("../handlers/errorHandler");
const AttendantRepository_1 = require("../repositories/AttendantRepository");
const db_1 = require("../db/db");
class AdminController {
    constructor() { }
    CreateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category, subCategory, memberCountry, observerCountry, signatoryCountry, prospectiveCountry, title, firstName, lastName, organization, designation, email, country, phoneNumber, registrationDate, participationMode, sideEvents, role } = req.body;
                const user = yield AttendantRepository_1.default.createUser({ category, subCategory, memberCountry, observerCountry, signatoryCountry, prospectiveCountry, title, firstName, lastName, organization, designation, email, country, phoneNumber, registrationDate, participationMode, sideEvents, role });
                return res.status(201).json({
                    error: undefined,
                    message: 'Attendant created successfully'
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Attendant couldn\'t be created.');
            }
        });
    }
    CreatehoheUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, phoneNumber } = req.body;
                // const phoneNumber = req.params.phone;
                // console.log("hi",phoneNumber)
                const attendance = yield db_1.default.hoheAttendant.findMany({
                    where: {
                        phoneNumber,
                    },
                });
                if (attendance[0])
                    return res.status(404).json({ error: 'user already exists', attendance });
                const user = yield AttendantRepository_1.default.createhoheAttendant({ firstName, lastName, phoneNumber });
                return res.status(201).json({
                    error: undefined,
                    message: 'Hohe Attendant created successfully'
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't create Hohe Attendant ");
            }
        });
    }
    gethoheUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const phoneNumber = req.params.phone;
                // console.log("hi",phoneNumber)
                const attendance = yield db_1.default.hoheAttendant.findMany({
                    where: {
                        phoneNumber,
                    },
                });
                console.log("what", attendance);
                if (!attendance)
                    return res.status(404).json({ error: 'Error.' });
                return res.status(200).json(attendance);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get Hohe attendant.");
            }
        });
    }
    GetAllHoheAttendant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("hi")
                const attendance = yield db_1.default.hoheAttendant.findMany({});
                console.log("what", attendance);
                if (!attendance)
                    return res.status(404).json({ error: 'Error.' });
                return res.status(200).json(attendance);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get Hohe attendant.");
            }
        });
    }
    GetAllHoheAttendance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("hi")
                const attendance = yield db_1.default.hoheAttendance.findMany({
                    include: {
                        redeemdBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        hoheattendant: {
                            select: {
                                firstName: true,
                                lastName: true,
                                phoneNumber: true,
                            },
                        },
                    },
                });
                if (!attendance)
                    return res.status(404).json({ error: 'Error.' });
                return res.status(200).json(attendance);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get Hohe attendance.");
            }
        });
    }
    GetAllAttendance(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("hi")
                const attendance = yield db_1.default.attendance.findMany({
                    include: {
                        redeemdBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        attendant: {
                            select: {
                                category: true,
                                subCategory: true,
                                memberCountry: true,
                                observerCountry: true,
                                signatoryCountry: true,
                                prospectiveCountry: true,
                                title: true,
                                firstName: true,
                                lastName: true,
                                organization: true,
                                designation: true,
                                email: true,
                                country: true,
                                phoneNumber: true,
                                registrationDate: true,
                                participationMode: true,
                                sideEvents: true,
                                role: true,
                            },
                        },
                    },
                });
                if (!attendance)
                    return res.status(404).json({ error: 'Error.' });
                return res.status(200).json(attendance);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get attendance.");
            }
        });
    }
    GetAllAttendant(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("hi");
                const attendance = yield db_1.default.attendant.findMany({});
                if (!attendance)
                    return res.status(404).json({ error: 'Error.' });
                return res.status(200).json(attendance);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get attendant.");
            }
        });
    }
    GetAttendantById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = req.params.session;
                if (!req.params.id) {
                    return res.status(404).json({ error: `Attendant not requested` });
                }
                const attendantselected = yield AttendantRepository_1.default.GetAttendantById(req.params.id, {
                    category: true,
                    subCategory: true,
                    memberCountry: true,
                    observerCountry: true,
                    signatoryCountry: true,
                    prospectiveCountry: true,
                    title: true,
                    firstName: true,
                    lastName: true,
                    organization: true,
                    designation: true,
                    email: true,
                    country: true,
                    phoneNumber: true,
                    registrationDate: true,
                    participationMode: true,
                    sideEvents: true,
                    role: true,
                });
                //   if(attendantselected)
                //   return res
                //      .status(200)
                //      .json({msg: attendantselected?.email,  session});
                /*
                            return res.json({
                
                                category: attendantselected?.category,
                                subCategory: attendantselected?.subCategory,
                                memberCountry: attendantselected?.memberCountry,
                                observerCountry: attendantselected?.observerCountry,
                                signatoryCountry: attendantselected?.signatoryCountry,
                                prospectiveCountry: attendantselected?.prospectiveCountry,
                                title: attendantselected?.title,
                                firstName: attendantselected?.firstName,
                                lastName: attendantselected?.lastName,
                                organization: attendantselected?.organization,
                                designation: attendantselected?.designation,
                                email: attendantselected?.email,
                                country: attendantselected?.country,
                                phoneNumber: attendantselected?.phoneNumber,
                                registrationDate: attendantselected?.registrationDate,
                                participationMode: attendantselected?.participationMode,
                                sideEvents: attendantselected?.sideEvents,
                                redeemdBy: attendantselected?.redeemdBy,
                                redeemdAt: attendantselected?.redeemdAt,
                                session1: attendantselected?.session1,
                                session2: attendantselected?.session2,
                                session3: attendantselected?.session3,
                                session4: attendantselected?.session4,
                                role: attendantselected?.role, });
                
                */
                return res.json({ message: "successfully checked In" });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Attendant couldn\'t be found.');
            }
        });
    }
    CheckBadge(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("hello badge");
                const session = req.params.session;
                const id = req.params.id;
                const attendantselected = yield db_1.default.attendant.findUnique({
                    where: {
                        id,
                    },
                });
                // if(attendantselected)
                //   return res
                //      .status(200)
                //      .json({msg: attendantselected});
                if (attendantselected == undefined)
                    return res
                        .status(404)
                        .json({ error: "Invalid badge, Attendee doesn't exist", Status: 0 });
                // const checkTicket = await prisma.attendance.findMany({
                //   where: {
                //     attendantId: id,
                //     session: session,
                //   },
                // });
                // if (!checkTicket) {
                //   return res.json({error: "Attendant has already checked in"})
                // }
                const redeemedTicket = yield db_1.default.attendance.create({
                    data: {
                        attendantId: id,
                        ticketValidatorUserId: req.user.id,
                        redeemdAt: new Date(),
                        sessionEvent: session,
                    },
                });
                // tslint:disable-next-line:no-null-keyword
                return (res
                    .status(200)
                    // tslint:disable-next-line:no-null-keyword
                    .json({ error: null, attendant: { title: attendantselected.title, firstName: attendantselected.firstName, lastName: attendantselected.lastName, organization: attendantselected.organization, designation: attendantselected.designation }, message: 'Checked in successfully!', Status: 1 }));
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't check in ticket.");
            }
        });
    }
    CheckHoheBadge(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("hello hohe badge");
                // const session = req.params.session;
                const id = req.params.id;
                console.log("hohebadge", id);
                const attendantselected = yield db_1.default.hoheAttendant.findUnique({
                    where: {
                        id,
                    },
                    select: {
                        firstName: true,
                        lastName: true,
                        phoneNumber: true,
                    },
                });
                console.log("qaaqqqqqqqqqqq", attendantselected);
                // if(attendantselected)
                //   return res
                //      .status(200)
                //      .json({msg: attendantselected});
                if (attendantselected == undefined)
                    return res
                        .status(404)
                        .json({ error: "Invalid badge, Attendee doesn't exist", Status: 0 });
                const redeemedTicket = yield db_1.default.hoheAttendance.create({
                    data: {
                        hoheattendantId: id,
                        ticketValidatorUserId: req.user.id,
                        redeemdAt: new Date(),
                    },
                });
                // tslint:disable-next-line:no-null-keyword
                return (res
                    .status(200)
                    .json({ error: null, attendant: { firstName: attendantselected.firstName, lastName: attendantselected.lastName }, message: 'Checked in successfully!', Status: 1 }));
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't check in ticket.");
            }
        });
    }
}
exports.default = AdminController;
//# sourceMappingURL=AttendantController.js.map