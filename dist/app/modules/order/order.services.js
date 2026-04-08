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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderServices = void 0;
const db_1 = require("../../../db/db");
const appError_1 = __importDefault(require("../../../utils/appError"));
const insertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { items } = payload, rest = __rest(payload, ["items"]);
    try {
        const result = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            for (const item of items) {
                const product = yield tx.product.findUniqueOrThrow({
                    where: {
                        id: item.productId,
                    },
                });
                if (!product) {
                    throw new appError_1.default(404, "Product not found!");
                }
                if (product.inStock < item.quantity) {
                    throw new appError_1.default(400, "Sorry, insuficient stock!");
                }
                yield tx.product.updateMany({
                    where: {
                        id: item.productId,
                    },
                    data: {
                        inStock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            const res = yield tx.order.create({
                data: Object.assign(Object.assign({}, rest), { products: {
                        create: items.map((item) => (Object.assign({}, item))),
                    } }),
            });
            return res;
        }));
        return result;
    }
    catch (error) {
        throw new appError_1.default(500, "Something went wrong!");
    }
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.order.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
    return res;
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.user.findUniqueOrThrow({
        where: {
            id: id,
        },
        select: {
            orders: {
                select: {
                    id: true,
                    totalPrice: true,
                    createdAt: true,
                    products: true
                }
            }
        }
    });
    return res;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.order.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return res;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.order.delete({
        where: {
            id: id,
        },
    });
    return res;
});
// admin
const getLatestOrder = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.order.findMany({ include: {
            user: {
                select: {
                    email: true,
                    name: true
                }
            },
        }, take: 5, orderBy: {
            createdAt: "desc"
        } });
    return res;
});
exports.orderServices = {
    insertIntoDB,
    getAllFromDB,
    getById,
    updateIntoDB,
    deleteFromDB,
    //admin
    getLatestOrder,
};
