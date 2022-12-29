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
const express_1 = require("express");
const CinemaHallController_1 = require("../controllers/CinemaHallController");
const cinemaHallValidator_1 = require("../validators/cinemaHallValidator");
const db_1 = require("../db/db");
const IS_SANDBOX = false;
let authToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdG9tZWRhQDM2MGdyb3VuZC5jb20iLCJuYW1lIjoiTWVkYSBWb3VjaGVyIiwicGhvbmUiOiIrMjUxOTEzMDA4NTk1IiwiaXNzIjoiIiwiaWF0IjoxNTk4OTY0NTQwLCJleHAiOjIwMzA1MDA1NDB9.0xCu1GltD3fM8EoZOryDtw7zQMvyBWq1vBbIzQEH1Fk`;
const MedaPay = require('medapay').init({
    bearerToken: `${authToken}`
}, IS_SANDBOX);
class ArifPayRoutes {
    constructor() {
        this.router = express_1.Router();
        this.cinemaHallController = new CinemaHallController_1.default();
        this.cinemaHallValidator = new cinemaHallValidator_1.CinemaHallValidator();
        this.initializeRoutes();
    }
    //payment with meda
    // async payWithMeda(medaUrl,{ price, name, quantity, id: orderId },res) {
    //   const SAMPLE_BILL = {
    //     "purchaseDetails": {
    //         "orderId": orderId,
    //         "description": name,
    //         "amount": price,
    //         "customerName": name,
    //         "customerPhoneNumber" : "+251911000000"
    //     },
    //     "redirectUrls": {
    //         "returnUrl": `https://${medaUrl.dev}/return`,
    //         "cancelUrl": `https://${medaUrl.dev}/cancel`,
    //         "callbackUrl":`https://${medaUrl.dev}/callback`
    //     }
    //   };
    //   const response = await MedaPay.create(SAMPLE_BILL)
    //   return response.billReferenceNumber
    //   /*
    //   MedaPay.create(SAMPLE_BILL)
    //     .then(createBillResponse => {
    //       console.log(createBillResponse.billReferenceNumber)
    //       MedaPay.bill(createBillResponse.billReferenceNumber)
    //       .then(async bill => {
    //         return bill.referenceNumber
    //       })
    //       .catch(error => console.error(error));
    //     })
    //     .catch(error => console.error(error));
    //     */
    // }
    initializeRoutes() {
        // this.router
        //   .route('/')
        //   .get(
        //     userAuth,
        //     userTypeAuth(UserType.User),
        //     userRoleAuth([Roles.Admin, Roles.Finanace, Roles.Finanace]),
        //     this.cinemaHallController.GetAllEventHalls
        //   );
        this.router.post('/create', (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { price, name, quantity, id: orderId } = req.body;
                console.log('-------------- in arif pay----------------');
                console.log(req.body);
                //   console.log(orderId, price, name, quantity);
                const SAMPLE_BILL = {
                    "purchaseDetails": {
                        "orderId": orderId,
                        "description": name,
                        "amount": price,
                        "customerName": name,
                        "customerPhoneNumber": "+251911000000"
                    },
                    "redirectUrls": {
                        "returnUrl": `https://${process.env.MEDA_PAY_URLS_DEV}/tickets/${orderId}`,
                        "cancelUrl": `https://${process.env.MEDA_PAY_URLS_DEV}/tickets/${orderId}`,
                        "callbackUrl": `https://${process.env.MEDA_PAY_URLS_DEV}/api/ticket/arifpay-callback`
                    }
                };
                MedaPay.create(SAMPLE_BILL)
                    .then(createBillResponse => {
                    console.log('===================== in create bill ============================');
                    console.log(createBillResponse);
                    MedaPay.bill(createBillResponse.billReferenceNumber)
                        .then((bill) => __awaiter(this, void 0, void 0, function* () {
                        console.log('========================= in bill=========================');
                        console.log(bill);
                        const updateReference = yield db_1.default.eventTicket.update({
                            where: {
                                id: orderId,
                            },
                            data: {
                                referenceNumber: bill.referenceNumber
                            },
                        });
                        let resObj = {
                            data: {
                                paymentUrl: createBillResponse.link.href
                            }
                        };
                        return res.status(200).json(resObj);
                    }))
                        .catch(error => console.error(error));
                })
                    .catch(error => console.error(error));
            }
            catch (err) {
                console.log(err);
            }
        }));
        // axios({
        //   method: 'post',
        //   headers: {
        //     application: 'asldkj',
        //     'x-arifpay-key': `${process.env.ARIF_PAY_KEY}`,
        //   },
        //   url: `https://gateway.arifpay.net/v0/sandbox/checkout/session`,
        //   data: {
        //     cancelUrl: `https://${medaUrl.dev}/cancel`,
        //     nonce: orderId,
        //     errorUrl: `https://${medaUrl.dev}/tickets`,
        //     notifyUrl: `https://${medaUrl.dev}/api/ticket/arifpay-callback`,
        //     successUrl: `https://${medaUrl.dev}/tickets/${orderId}`,
        //     paymentMethods: ['CARD', 'AWASH'],
        //     expireDate: new Date(
        //       Date.now() + 1 * 24 * 60 * 60 * 1000
        //     ).toISOString(),
        //     items: [
        //       {
        //         name,
        //         quantity,
        //         price,
        //         image: 'https://meda.et/images/logo.png',
        //       },
        //     ],
        //     beneficiaries: [
        //       {
        //         accountNumber: '01320662432100',
        //         bank: 'AWINETAA',
        //         amount: price,
        //       },
        //     ],
        //   },
        // })
        //   .then(async (ArifRes) => {
        //     const updateReference = await prisma.eventTicket.update({
        //       where: {
        //         id: orderId,
        //       },
        //       data: {
        //         referenceNumber: ArifRes.data.sessionId,
        //       },
        //     });
        //     return res.status(200).json(ArifRes.data);
        //   })
        //   .catch((err) => {
        //     console.log(err.message);
        //     return res.status(200).json('Error creating arifpay payment');
        //   });
        //});
        // this.router.post('/callback', (req, res, next) => {
        //   console.log('***Arifpay called with body *** ', req.body);
        //   needle.get(
        //     `${'frappeUrl'}/api/resource/Order/${req.body.nonce}`,
        //     (orderErr, orderRes, orderBody) => {
        //       if (orderErr) {
        //         console.log(
        //           'Payment callback for order ' +
        //             req.body.nonce +
        //             ' has no order in database'
        //         );
        //         console.log('Get order error ', orderErr);
        //         return res.status(200).json({ error: orderErr });
        //       } else {
        //         needle.get(
        //           `https://gateway.arifpay.net/v0/sandbox/checkout/session/${orderBody.data.session_id}`,
        //           {
        //             headers: {
        //               'x-arifpay-key': '5tWdaIuiYnn7a3FxGJwaoRdSkvzqUGBM',
        //             },
        //           },
        //           (arifErr, arifRes, arifBody) => {
        //             if (arifErr) {
        //               console.log(
        //                 "Arif callback called but we couldn't double check the session ",
        //                 arifErr
        //               );
        //               return res.status(200).json({ error: arifErr });
        //             } else {
        //               console.log(
        //                 'Got session check result from arif pay: ',
        //                 arifBody
        //               );
        //               if (arifBody.data.totalAmount >= orderBody.data.grand) {
        //                 let status;
        //                 switch (arifBody.data.transaction.transactionStatus) {
        //                   case 'CANCELLED':
        //                     status = 'Cancelled';
        //                     break;
        //                   case 'FAILED':
        //                     status = 'Failed';
        //                     break;
        //                   case 'EXPIRED':
        //                     status = 'Expired';
        //                     break;
        //                   case 'SUCCESS':
        //                     status = 'Complete';
        //                     break;
        //                   case 'PENDING':
        //                     status = 'Pending';
        //                     break;
        //                   default:
        //                     console.log(
        //                       'Arifpay payment status not from the expected enum'
        //                     );
        //                     status = 'Initiated';
        //                 }
        //                 needle.put(
        //                   `${'frappeUrl'}/api/resource/Order/${req.body.nonce}`,
        //                   {
        //                     payment_status: status,
        //                   },
        //                   { json: true },
        //                   (err, ress, body) => {
        //                     if (err) {
        //                       console.log(
        //                         'Error while putting new payment status: ',
        //                         err
        //                       );
        //                       res.status(200).json({ error: err });
        //                     } else {
        //                       console.log('Put status ', status, ' body ', body);
        //                       res.status(200).json(body);
        //                     }
        //                   }
        //                 );
        //               } else {
        //                 console.log(
        //                   'Arifpay totalAmount and order grand total is not equal: ',
        //                   arifBody.data.totalAmount,
        //                   ', ',
        //                   orderBody.data.grand
        //                 );
        //                 res
        //                   .status(200)
        //                   .json({ error: 'User payed the wrong amount' });
        //               }
        //             }
        //           }
        //         );
        //       }
        //     }
        //   );
        // });
    }
}
exports.default = new ArifPayRoutes().router;
//# sourceMappingURL=ArifPay.js.map