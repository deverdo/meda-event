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
const roles_1 = require("../../data/roles");
const client_1 = require("@prisma/client");
const index_1 = require("../../utils/auth/index");
const prisma = new client_1.PrismaClient();
const rolesList = [roles_1.default.Admin, roles_1.default.Cashier, roles_1.default.Finanace];
function checkRoleExists(roleName) {
    return __awaiter(this, void 0, void 0, function* () {
        const role = yield prisma.userRole.findFirst({ where: { name: roleName } });
        if (role)
            return true;
        return false;
    });
}
function checkUserExists(normalizedUsername) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma.user.findFirst({
            where: {
                normalizedUsername
            }
        });
        if (user)
            return true;
        else
            return false;
    });
}
function seedRoles() {
    return __awaiter(this, void 0, void 0, function* () {
        rolesList.forEach((role) => __awaiter(this, void 0, void 0, function* () {
            if (!(yield checkRoleExists(role))) {
                yield prisma.userRole.create({
                    data: {
                        name: role,
                    }
                });
            }
        }));
        console.log('Finished seeding roles');
    });
}
function seedSuperUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const adminRole = yield prisma.userRole.findFirst({
            where: {
                name: roles_1.default.Admin
            }
        });
        if (!adminRole) {
            console.log("The role doesn't exist.");
            return false;
        }
        if (!(yield checkUserExists('SUPERUSER'))) {
            const superUser = yield prisma.user.create({
                data: {
                    firstName: 'SuperUser',
                    lastName: 'SuperUser',
                    username: 'SuperUser',
                    normalizedUsername: 'SUPERUSER',
                    phoneNumber: '0000',
                    password: yield index_1.hashPassword('123456'),
                    address: 'Super user Address',
                    roles: {
                        connect: {
                            id: adminRole.id
                        }
                    }
                }
            });
        }
        else {
            console.log('SuperUser already exists.');
        }
        console.log('Finished seeding users.');
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield seedRoles();
        yield seedSuperUser();
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//# sourceMappingURL=seed.js.map