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
exports.userServices = void 0;
const db_1 = require("../../../db/db");
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.findMany({
        select: {
            avatar: true,
            id: true,
            email: true,
            name: true,
            orders: true,
            role: true,
            updatedAt: true,
            address: true,
            createdAt: true,
        },
    });
    // const withoutPass = exclude(user, ["password",""])
    return user;
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const singleUser = yield db_1.prisma.user.findUniqueOrThrow({
        where: {
            id: id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return singleUser;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.update({
        where: {
            id: id,
        },
        data: payload,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            avatar: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return user;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.user.delete({
        where: {
            id: id,
        },
    });
    return res;
});
const updateUserAvatar = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.user.update({
        where: {
            id: id
        },
        data: {
            avatar: payload.avatar
        }, select: {
            avatar: true,
            id: true,
        }
    });
    return res;
});
//admin can see top customer
const topCustomer = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.user.findMany({
        where: {
            orders: {
                some: {}
            },
        },
        select: {
            name: true,
            email: true,
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 10
    });
    return res;
});
exports.userServices = {
    getAllFromDB,
    getById,
    updateIntoDB,
    deleteFromDB,
    updateUserAvatar,
    topCustomer
};
