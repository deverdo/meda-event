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
const client_1 = require("@prisma/client");
const db_1 = require("../db/db");
const dayjs = require("dayjs");
const duration = require("dayjs/plugin/duration");
const index_1 = require("../utils/uid/index");
const messaging_1 = require("../utils/messaging");
const roles_1 = require("../data/roles");
const scheduler_1 = require("../scheduler");
const toad_scheduler_1 = require("toad-scheduler");
const config_1 = require("../config");
const fetch = require("node-fetch");
const uuid_1 = require("uuid");
dayjs.extend(duration);
class TicketController {
    constructor() { }
    createTicket2(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { showTimeId, numberOfTickets } = req.body;
                console.log('------------------- in create ticket 2 --------------------');
                console.log(req.user);
                const currentUser = req.user;
                const ticketId = uuid_1.v4();
                const createdEventTicket = yield db_1.default.eventTicket.create({
                    data: {
                        id: ticketId,
                        userId: req.user.phoneNumber,
                        referenceNumber: '',
                        showTimeId,
                        amount: numberOfTickets,
                        paymentStatus: client_1.PaymentStatus.PENDING,
                        chatid: '',
                    },
                });
                createdEventTicket["user"] = currentUser;
                console.log(createdEventTicket);
                console.log('----------------------leaving create ticket----------------');
                return res.status(200).json(createdEventTicket);
            }
            catch (err) {
                console.log('------------------ in create generic ticket --------------');
                console.log(err);
                return errorHandler_1.apiErrorHandler(err, req, res, "Couldn't create ticket.");
            }
        });
    }
    CreateTicket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the userId from the authenticated user @red.user.id (//!the phone num is the ID)
            try {
                const { seats, amount, showTimeId, chatid, } = // referenceNumber,
                 req.body;
                const ticketId = uuid_1.v4();
                const curuser = req.user;
                // Ignore for arif pay
                // const { href, billReferenceNumber } =
                //   await TicketController.GenerateReference({
                //     name: curuser.firstName + curuser.lastName,
                //     phoneNumber: curuser.phoneNumber,
                //     amount: amount,
                //     ticketId: ticketId,
                //   });
                // ! Check if this is an active showtime
                const stb = yield db_1.default.showTime.findUnique({
                    where: {
                        id: showTimeId,
                    },
                });
                if (stb.active == false) {
                    return res.json({
                        error: "You can't buy a ticket to a deactivated showtime",
                    });
                }
                const seatTicketsAlreadyBought = [];
                for (const seat of seats) {
                    const ticketForThisSeatExists = yield db_1.default.ticketsOnSeats.findFirst({
                        where: {
                            seatId: seat,
                            eventTicket: {
                                showTimeId,
                            },
                        },
                        include: {
                            eventTicket: {
                                include: {
                                    showTime: true,
                                },
                            },
                            seat: true,
                        },
                    });
                    if (ticketForThisSeatExists != undefined) {
                        seatTicketsAlreadyBought.push(ticketForThisSeatExists.seat.seatName);
                    }
                }
                if (seatTicketsAlreadyBought.length != 0)
                    return res.status(409).json({
                        error: `Seats ${seatTicketsAlreadyBought.join(',')} have already been reserved`,
                    });
                const seatTicketArray = [];
                for (const seat of seats) {
                    let ticketKey = undefined;
                    // Loop until a unique key is generated
                    do {
                        const generatedTicket = index_1.generateUID();
                        if (!(yield db_1.default.ticketsOnSeats.findUnique({
                            where: { ticketKey: generatedTicket },
                        }))) {
                            ticketKey = generatedTicket;
                        }
                    } while (ticketKey == undefined);
                    seatTicketArray.push({
                        seatId: seat,
                        ticketKey,
                    });
                }
                const createdEventTicket = yield db_1.default.eventTicket.create({
                    data: {
                        id: ticketId,
                        userId: req.user.phoneNumber,
                        referenceNumber: '',
                        showTimeId,
                        amount: amount,
                        paymentStatus: client_1.PaymentStatus.PENDING,
                        chatid: chatid,
                        TicketsOnSeats: {
                            createMany: {
                                data: seatTicketArray,
                            },
                        },
                    },
                    include: {
                        TicketsOnSeats: {
                            include: {
                                seat: true,
                            },
                        },
                        showTime: {
                            include: {
                                EventSchedule: {
                                    include: {
                                        event: true,
                                    },
                                },
                                eventHall: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                });
                // Send the req back
                res
                    .status(201)
                    .json(Object.assign(Object.assign({}, createdEventTicket), { user: req.user, href: 'asdjl' }));
                // ! END
                // ? The seats are "reserved" now and the code below will remove the reservation after x amount of time after the ticket was bought
                const task = new toad_scheduler_1.AsyncTask('task to release seats reserved', () => __awaiter(this, void 0, void 0, function* () {
                    console.log('Cleanse the seats...');
                    yield db_1.default.eventTicket.update({
                        where: {
                            id: createdEventTicket.id,
                        },
                        data: {
                            // tslint:disable-next-line:no-null-keyword
                            showTimeId: null,
                            paymentStatus: client_1.PaymentStatus.CANCELLED,
                        },
                    });
                    scheduler_1.scheduler.removeById(createdEventTicket.id);
                }), (err) => {
                    /* handle error here */
                    // Don't deadlock please
                    scheduler_1.scheduler.removeById(createdEventTicket.id);
                });
                const job = new toad_scheduler_1.SimpleIntervalJob({ seconds: 600 }, task
                // billReferenceNumber
                );
                scheduler_1.scheduler.addSimpleIntervalJob(job);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't create ticket.");
            }
        });
    }
    GetTicket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketKey = req.params.ticketKey;
                const ticket = yield db_1.default.ticketsOnSeats.findUnique({
                    where: {
                        ticketKey,
                    },
                    include: {
                        redeemdBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        eventTicket: {
                            include: {
                                showTime: {
                                    include: {
                                        eventHall: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                        EventSchedule: {
                                            select: {
                                                date: true,
                                                event: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        seat: true,
                    },
                });
                if (!ticket)
                    return res.status(404).json({ error: "Ticket doesn't exist" });
                return res.status(200).json(ticket);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't redeem ticket.");
            }
        });
    }
    GetTicketIssueInfoByKey(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticketKey = req.params.ticketKey;
                const ticket = yield db_1.default.ticketsOnSeats.findUnique({
                    where: {
                        ticketKey,
                    },
                    select: {
                        ticketKey: true,
                        receiptStatus: true,
                        fsNumber: true,
                        seat: {
                            select: {
                                seatType: true,
                                seatName: true,
                            },
                        },
                        eventTicket: {
                            include: {
                                showTime: {
                                    include: {
                                        EventSchedule: {
                                            include: {
                                                event: {
                                                    select: {
                                                        title: true,
                                                    },
                                                },
                                            },
                                        },
                                        eventHall: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (!ticket)
                    return res.status(404).json({ error: "Ticket doesn't exist" });
                return res.status(200).json(ticket);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't redeem ticket.");
            }
        });
    }
    RedeemTicket(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ticketKey } = req.body;
                const isAlreadyReddemed = yield db_1.default.ticketsOnSeats.findUnique({
                    where: {
                        ticketKey,
                    },
                    include: {
                        redeemdBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        eventTicket: {
                            include: {
                                showTime: {
                                    include: {
                                        eventHall: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                        EventSchedule: {
                                            select: {
                                                date: true,
                                                event: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        seat: true,
                    },
                });
                if (isAlreadyReddemed == undefined)
                    return res
                        .status(404)
                        .json({ error: "Invalid ticket, ticket doesn't exist" });
                if (isAlreadyReddemed.ticketStatus == client_1.TicketStatus.REDEEMED)
                    return res
                        .status(409)
                        .json({ error: 'This ticket has already been redeemed!' });
                if (isAlreadyReddemed.eventTicket.paymentStatus != client_1.PaymentStatus.SUCCESS)
                    return res.status(409).json({ error: 'Payment not confirmed!' });
                const redeemedTicket = yield db_1.default.ticketsOnSeats.update({
                    where: {
                        ticketKey: ticketKey,
                    },
                    data: {
                        ticketStatus: client_1.TicketStatus.REDEEMED,
                        ticketValidatorUserId: req.user.id,
                        redeemdAt: new Date(),
                    },
                    include: {
                        redeemdBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        eventTicket: {
                            include: {
                                showTime: {
                                    include: {
                                        eventHall: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                        EventSchedule: {
                                            select: {
                                                date: true,
                                                event: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        seat: true,
                    },
                });
                // tslint:disable-next-line:no-null-keyword
                return (res
                    .status(200)
                    // tslint:disable-next-line:no-null-keyword
                    .json({ error: null, message: 'Ticket redeemed successfully!' }));
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't redeem ticket.");
            }
        });
    }
    GetRedeemHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const redeemerId = req.user.id;
                const size = req.query.size == undefined ? 10 : parseInt(req.query.size, 10);
                const page = req.query.page == undefined ? 1 : parseInt(req.query.page, 10);
                const skip = (page - 1) * size;
                const redeemedTickets = yield db_1.default.ticketsOnSeats.findMany({
                    take: size,
                    skip,
                    where: {
                        ticketValidatorUserId: redeemerId,
                        ticketStatus: client_1.TicketStatus.REDEEMED,
                        // TODO Remove this on production
                        NOT: {
                            // tslint:disable-next-line:no-null-keyword
                            redeemdAt: null,
                        },
                    },
                    orderBy: {
                        redeemdAt: 'desc',
                    },
                    include: {
                        redeemdBy: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                        eventTicket: {
                            include: {
                                showTime: {
                                    include: {
                                        eventHall: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                        EventSchedule: {
                                            select: {
                                                date: true,
                                                event: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        seat: true,
                    },
                });
                return res.status(200).json(redeemedTickets);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Error fetching redeemed tickets.');
            }
        });
    }
    GetTicketById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const ticket = yield db_1.default.eventTicket.findFirst({
                    where: {
                        id,
                        userId: req.user.phoneNumber,
                    },
                    include: {
                        showTime: {
                            include: {
                                eventHall: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                EventSchedule: {
                                    select: {
                                        date: true,
                                        event: true,
                                    },
                                },
                            },
                        },
                        TicketsOnSeats: {
                            include: {
                                seat: true,
                            },
                        },
                    },
                });
                if (!ticket)
                    return res.status(404).json({ error: "Ticket doesn't exist" });
                return res.status(200).json(ticket);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get ticket.");
            }
        });
    }
    GetTicketBuyHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO Add authentication once there is a way to auth a meda user
            try {
                const ticket = yield db_1.default.eventTicket.findMany({
                    where: {
                        userId: req.user.phoneNumber,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        showTime: {
                            include: {
                                eventHall: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                EventSchedule: {
                                    select: {
                                        date: true,
                                        event: true,
                                    },
                                },
                            },
                        },
                        TicketsOnSeats: {
                            include: {
                                seat: true,
                            },
                        },
                    },
                });
                // if (!ticket) return res.status(404).json({ error: "Ticket don't exist" });
                return res.status(200).json(ticket);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get ticket.");
            }
        });
    }
    GetSalesReport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventHall, event, redeemer, scheduleRange, } = req.body;
                let scheduleStartDate = undefined;
                let scheduleEndDate = undefined;
                if (scheduleRange) {
                    scheduleStartDate = dayjs(scheduleRange[0]).toDate();
                    scheduleEndDate = dayjs(scheduleRange[1]).toDate();
                }
                const allTickets = yield db_1.default.eventTicket.findMany({
                    where: {
                        createdAt: scheduleRange == undefined
                            ? scheduleRange
                            : {
                                gte: scheduleStartDate,
                                lte: scheduleEndDate,
                            },
                        showTime: {
                            AND: [
                                {
                                    OR: [
                                        ...(eventHall == undefined ? [] : eventHall).map((e) => {
                                            return {
                                                eventHallId: e,
                                            };
                                        }),
                                    ],
                                },
                                {
                                    OR: [
                                        ...(event == undefined ? [] : event).map((e) => {
                                            return {
                                                EventSchedule: {
                                                    eventId: e,
                                                },
                                            };
                                        }),
                                    ],
                                },
                            ],
                        },
                        TicketsOnSeats: redeemer == undefined
                            ? undefined
                            : {
                                some: {
                                    OR: [
                                        ...(redeemer == undefined ? [] : redeemer).map((e) => {
                                            return {
                                                ticketValidatorUserId: e,
                                            };
                                        }),
                                    ],
                                },
                            },
                    },
                    include: {
                        showTime: {
                            include: {
                                EventSchedule: {
                                    include: {
                                        event: true,
                                    },
                                },
                            },
                        },
                        TicketsOnSeats: {
                            select: {
                                ticketValidatorUserId: true,
                            },
                        },
                    },
                });
                return res.status(200).json({
                    tickets: {
                        ticketsSold: allTickets.length,
                        totalAmount: allTickets.reduce((a, b) => a + b.amount || 0, 0),
                    },
                });
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get sales report.");
            }
        });
    }
    GetAllTickets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield db_1.default.ticketsOnSeats.findMany({
                    include: {
                        redeemdBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                        seat: true,
                        eventTicket: {
                            include: {
                                showTime: {
                                    include: {
                                        eventHall: true,
                                        EventSchedule: {
                                            include: {
                                                event: {
                                                    select: {
                                                        title: true,
                                                        id: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                if (!tickets)
                    return res.status(404).json({ error: 'Error.' });
                return res.status(200).json(tickets);
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't get tickets.");
            }
        });
    }
    IssueReceipt(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ticketKey, fsNumber } = req.body;
                const isAlreadyIssued = yield db_1.default.ticketsOnSeats.findUnique({
                    where: {
                        ticketKey,
                    },
                    include: {
                        eventTicket: true,
                    },
                });
                if (isAlreadyIssued == undefined)
                    return res
                        .status(404)
                        .json({ error: "Invalid ticket, ticket doesn't exist" });
                if (isAlreadyIssued.receiptStatus == client_1.ReceiptStatus.ISSUED)
                    return res
                        .status(409)
                        .json({ error: 'A receipt has already been issued!' });
                if (isAlreadyIssued.eventTicket.paymentStatus != client_1.PaymentStatus.SUCCESS)
                    return res.status(409).json({
                        error: "Can't issue receipt for this ticket because payment isn't complete yet",
                    });
                const issuedTicket = yield db_1.default.ticketsOnSeats.update({
                    where: {
                        ticketKey: ticketKey,
                    },
                    data: {
                        receiptStatus: client_1.ReceiptStatus.ISSUED,
                        fsNumber,
                    },
                });
                return (res
                    .status(200)
                    // tslint:disable-next-line:no-null-keyword
                    .json({ error: null, message: 'Receipt issued successfully!' }));
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, "Couldn't issue receipt.");
            }
        });
    }
    TicketBoughtMedaPayCallback(req, res, next) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('================= in callback url====================');
            console.log(req.body);
            const { orderId, status, referenceNumber, paymentMethod, amount } = req.body;
            // const orderId = req.body.nonce;
            // const status = req.body.transaction.transactionStatus;
            // const referenceNumber = req.body.nonce;
            // const paymentMethod = req.body.transaction.paymentType;
            const isSimulation = true;
            // const amount = req.body.totalAmount;
            console.log(orderId, status, referenceNumber, paymentMethod, isSimulation, amount);
            console.log('CANCELED');
            try {
                // Check env and if someone is using a simulation on production just end it
                if (process.env.NODE_ENV === 'production' &&
                    isSimulation == true &&
                    false)
                    throw new Error("Can't use sandbox on prod");
                if (status == 'SUCCESS') {
                    // STOP THE SCHEDULE TO REMOVE THE SEAT FROM RESERVATION IF IT IS RUNNING
                    scheduler_1.scheduler.removeById(referenceNumber);
                    const eventTicket = yield db_1.default.eventTicket.findUnique({
                        where: {
                            id: orderId,
                        },
                        include: {
                            TicketsOnSeats: {
                                include: {
                                    seat: true,
                                },
                            },
                            showTime: {
                                include: {
                                    EventSchedule: {
                                        include: {
                                            event: true,
                                        },
                                    },
                                    eventHall: {
                                        select: {
                                            id: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    });
                    console.log('====Printing event Ticket ===');
                    console.log(event);
                    // tslint:disable-next-line:no-null-keyword
                    if ((eventTicket === null || eventTicket === void 0 ? void 0 : eventTicket.showTimeId) == null) {
                        // This means the reservation has already been removed and the user paid for a reservation that doesn't exist
                        // Payment shouldn't be this annoying ffs
                        // So now they need to be refunded so we'll mark it as need to be refunded
                        scheduler_1.scheduler.removeById(orderId);
                        yield db_1.default.eventTicket.update({
                            where: {
                                id: orderId,
                            },
                            data: {
                                // tslint:disable-next-line:no-null-keyword
                                showTimeId: null,
                                paymentStatus: client_1.PaymentStatus.PENDING,
                                referenceNumber: referenceNumber,
                                paymentMethod,
                                amount,
                            },
                        });
                    }
                    else {
                        // ! PAYMENT SUCCESSFUL
                        // TODO Check if anyone wants to be a smart ass and sends a fake amount
                        const updatedTicket = yield db_1.default.eventTicket.update({
                            where: {
                                id: orderId,
                            },
                            data: {
                                paymentStatus: client_1.PaymentStatus.SUCCESS,
                                referenceNumber: referenceNumber,
                                paymentMethod,
                                amount,
                            },
                            include: {
                                TicketsOnSeats: {
                                    include: {
                                        seat: true,
                                    },
                                },
                                showTime: {
                                    include: {
                                        EventSchedule: {
                                            include: {
                                                event: true,
                                            },
                                        },
                                        eventHall: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        });
                        // ! NOTIFY ALL USERS WITH ROLE FINANCE
                        const allFinance = yield db_1.default.user.findMany({
                            where: {
                                accountLockedOut: false,
                                roles: {
                                    // Finance or cashier
                                    name: roles_1.default.Finanace,
                                },
                            },
                        });
                        yield messaging_1.sendSmsMessage(allFinance.map((e) => e.phoneNumber), `Meda|Ticket: ${eventTicket.TicketsOnSeats.length} tickets for the event ${(_a = eventTicket.showTime.EventSchedule) === null || _a === void 0 ? void 0 : _a.event.title} have been bought`);
                        let seatNames = '';
                        eventTicket.TicketsOnSeats.forEach((e) => {
                            seatNames += `${e.ticketKey}, `;
                        });
                        // Send the user a notification and a url to checkout his link
                        const msg = `Meda|Ticket \nDear user, \nYou have bought ${eventTicket.TicketsOnSeats.length} tickets for the event ${(_b = eventTicket.showTime.EventSchedule) === null || _b === void 0 ? void 0 : _b.event.title}\nhall name: ${eventTicket.showTime.eventHall.name}\nseats: ${seatNames}\nreference number: ${eventTicket.referenceNumber}\ntime: ${dayjs((_c = eventTicket.showTime) === null || _c === void 0 ? void 0 : _c.time).format('h:mm A')} ${dayjs((_e = (_d = eventTicket.showTime) === null || _d === void 0 ? void 0 : _d.EventSchedule) === null || _e === void 0 ? void 0 : _e.date).format('MMM DD, YYYY')}\n\nyou can get your ticket on Meda mobile app or at ${config_1.webClientHostedUrl}/tickets/${eventTicket.id}`;
                        yield messaging_1.sendMessage(eventTicket.userId, msg);
                        // Send message to telegram bot
                        // if(eventTicket.chatid)
                        if (eventTicket.chatid) {
                            const tickets_on_seats = eventTicket.TicketsOnSeats;
                            messaging_1.sendToBot(eventTicket.chatid, tickets_on_seats, msg);
                        }
                        // Notify the telegram bot server
                        // const io: Server = req.app.get('io');
                        // const ticketNotificationNamespace = io.of('/ticket-notification');
                        // ticketNotificationNamespace.emit(
                        //   'onTicketPaymentComplete',
                        //   updatedTicket
                        // );
                    }
                }
                else if (status == 'CANCELED') {
                    // STOP THE SCHEDULE TO REMOVE THE SEAT FROM RESERVATION IF IT IS RUNNING
                    //scheduler.removeById(referenceNumber);
                    let updatedEvent = yield db_1.default.eventTicket.update({
                        where: {
                            id: orderId,
                        },
                        data: {
                            // tslint:disable-next-line:no-null-keyword
                            showTimeId: null,
                            paymentStatus: client_1.PaymentStatus.CANCELLED,
                            referenceNumber: referenceNumber,
                            paymentMethod,
                        },
                    });
                    console.log("==================== canceled baby=====================================");
                    console.log(updatedEvent);
                }
                else if (status == 'FAILED') {
                    // STOP THE SCHEDULE TO REMOVE THE SEAT FROM RESERVATION IF IT IS RUNNING
                    scheduler_1.scheduler.removeById(referenceNumber);
                    yield db_1.default.eventTicket.update({
                        where: {
                            id: orderId,
                        },
                        data: {
                            // tslint:disable-next-line:no-null-keyword
                            showTimeId: null,
                            paymentStatus: client_1.PaymentStatus.FAILED,
                            referenceNumber: referenceNumber,
                            paymentMethod,
                        },
                    });
                }
                else if (status == 'PENDING') {
                    // STOP THE SCHEDULE TO REMOVE THE SEAT FROM RESERVATION IF IT IS RUNNING
                    scheduler_1.scheduler.removeById(referenceNumber);
                    yield db_1.default.eventTicket.update({
                        where: {
                            id: orderId,
                        },
                        data: {
                            // tslint:disable-next-line:no-null-keyword
                            showTimeId: null,
                            paymentStatus: client_1.PaymentStatus.PENDING,
                            referenceNumber: referenceNumber,
                            paymentMethod,
                        },
                    });
                }
                else if (status == 'EXPIRED') {
                    // STOP THE SCHEDULE TO REMOVE THE SEAT FROM RESERVATION IF IT IS RUNNING
                    scheduler_1.scheduler.removeById(referenceNumber);
                    yield db_1.default.eventTicket.update({
                        where: {
                            id: orderId,
                        },
                        data: {
                            // tslint:disable-next-line:no-null-keyword
                            showTimeId: null,
                            paymentStatus: client_1.PaymentStatus.EXPIRED,
                            referenceNumber: referenceNumber,
                            paymentMethod,
                        },
                    });
                }
                return res.end();
            }
            catch (error) {
                return errorHandler_1.apiErrorHandler(error, req, res, 'Error confirming payment');
            }
        });
    }
    static GenerateReference({ name, phoneNumber, amount, ticketId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const mpay = yield fetch(`https://api.pay.meda.chat/v1/bills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdG9tZWRhQDM2MGdyb3VuZC5jb20iLCJuYW1lIjoiTWVkYSBWb3VjaGVyIiwicGhvbmUiOiIrMjUxOTEzMDA4NTk1IiwiaXNzIjoiIiwiaWF0IjoxNTk4OTY0NTQwLCJleHAiOjIwMzA1MDA1NDB9.0xCu1GltD3fM8EoZOryDtw7zQMvyBWq1vBbIzQEH1Fk`,
                },
                body: JSON.stringify({
                    purchaseDetails: {
                        orderId: 'Not Required',
                        description: 'Meda|Tickets',
                        amount: amount,
                        customerName: name,
                        customerPhoneNumber: phoneNumber.substring(1),
                    },
                    redirectUrls: {
                        returnUrl: `https://meda.et/tickets/${ticketId}`,
                        cancelUrl: 'https://meda.et',
                        callbackUrl: 'https://meda.et/api/ticket/meda-pay-callback',
                    },
                    metaData: {},
                }),
            });
            const mpayRes = yield mpay.json();
            console.log(mpayRes);
            if (mpayRes.error) {
                throw new Error(mpayRes.error);
            }
            const { billReferenceNumber, link } = mpayRes;
            const { href } = link;
            return { billReferenceNumber, href };
        });
    }
}
exports.default = TicketController;
//# sourceMappingURL=TicketController.js.map