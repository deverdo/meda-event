"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dbUrl = process.env.DATABASE_URL || '';
if (!dbUrl) {
    console.log('Please create .env file, refer .env.sample');
    process.exit(0);
}
if (process.env.NODE_ENV === 'production') {
    prisma = new client_1.PrismaClient();
}
else {
    if (!global.prisma) {
        global.prisma = new client_1.PrismaClient();
    }
    prisma = global.prisma;
}
exports.default = prisma;
//# sourceMappingURL=db.js.map