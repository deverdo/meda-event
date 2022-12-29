"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketServerToken = exports.webClientHostedUrl = exports.authMicroserviceBaseUrl = exports.omdbApiKey = exports.jwtSecret = void 0;
const jwtSecret = process.env.JWT_SECRET;
exports.jwtSecret = jwtSecret;
const omdbApiKey = process.env.OMDB_API_KEY;
exports.omdbApiKey = omdbApiKey;
const authMicroserviceBaseUrl = process.env.AUTH_MICROSERVICE_BASE_URL;
exports.authMicroserviceBaseUrl = authMicroserviceBaseUrl;
let webClientHostedUrl = process.env.WEB_CLIENT_URL;
exports.webClientHostedUrl = webClientHostedUrl;
const socketServerToken = process.env.SOCKET_SERVER_TOKEN;
exports.socketServerToken = socketServerToken;
if (process.env.NODE_ENV !== 'production') {
    exports.webClientHostedUrl = webClientHostedUrl = 'http://meda.et';
}
//# sourceMappingURL=index.js.map