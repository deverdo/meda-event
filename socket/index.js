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
class SocketServer {
    constructor(io) {
        this.config(io);
    }
    config(io) {
        const ticketNotificationNamespace = io.of('/ticket-notification');
        // Authentication middleware
        ticketNotificationNamespace.use(function (socket, next) {
            if (socket.handshake.auth.token == config_1.socketServerToken) {
                console.log(socket.handshake.auth.token == config_1.socketServerToken);
                next();
            }
            else {
                console.log('Unauthorized user @' + socket.id);
                socket.emit('connection rejected', 'Unauthorized');
                socket.disconnect(true);
                next(new Error('Authentication error'));
            }
        });
        ticketNotificationNamespace.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Got a new client [@${socket.id}]`);
            socket.on('disconnect', function (reason) {
                console.log('Got a disconnect @', socket.id);
                console.log(`reason => ${reason}`);
            });
        }));
    }
}
exports.default = SocketServer;
//# sourceMappingURL=index.js.map