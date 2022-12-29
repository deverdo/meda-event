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
exports.sendToBot = exports.sendMessage = exports.sendSmsMessage = void 0;
process.env.AFRICAS_TALKING_API_KEY;
process.env.AFRICAS_TALKING_SMS_USERNAME;
// ! Running as a sandbox
// const credentials = {
//   apiKey: "42ddb9e4e8a87f9a4bc3e82aaf00112b0229940ddd702504c9aafe9e31d552ba", // use your sandbox app API key for development in the test environment
//   username: "sandbox", //"century-cinema-app", // use 'sandbox' for development in the test environment
// };
const credentials = {
    apiKey: process.env.AFRICAS_TALKING_API_KEY ||
        '114d3daf3d5a88d146b68c7361ecbb9a537ff28ad30cce528e8b7326d369bbfa',
    username: process.env.AFRICAS_TALKING_SMS_USERNAME || 'meda', // "century-cinema-app", // use 'sandbox' for development in the test environment
};
const { Telegraf } = require("telegraf");
// require("dotenv").config();
const QRCode = require('qrcode');
const bot = new Telegraf(process.env.BOT_TOKEN);
const Africastalking = require('africastalking')(credentials);
const sms = Africastalking.SMS;
function sendSmsMessage(recipients, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Promise.all(recipients.map((e) => sendMessage(e, message)));
            return true;
        }
        catch (ex) {
            console.error(ex);
            return false;
        }
    });
}
exports.sendSmsMessage = sendSmsMessage;
function sendMessage(recipient, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield sms.send({
                from: '8165',
                to: recipient,
                message,
            });
            console.log('Message sent successfully');
        }
        catch (ex) {
            console.error(ex);
            console.log('Error sending a message');
        }
    });
}
exports.sendMessage = sendMessage;
function sendToBot(chatid, tickets_on_seats, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        const images = [];
        //console.log("asdf",chatid,tickets_on_seats, msg);
        tickets_on_seats.map(ticketKey => {
            //  console.log("fghjk",ticketKey)
            QRCode.toDataURL(ticketKey.ticketKey, function (err, url) {
                //console.log(url)
                let image = url.split(",")[1];
                bot.telegram.sendPhoto(chatid, { source: Buffer.from(image, "base64"), });
            });
        });
        yield bot.telegram.sendMessage(chatid, msg);
    });
}
exports.sendToBot = sendToBot;
//# sourceMappingURL=index.js.map