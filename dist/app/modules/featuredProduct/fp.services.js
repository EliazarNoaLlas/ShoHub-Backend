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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fpServices = void 0;
const db_1 = require("../../../db/db");
const appError_1 = __importDefault(require("../../../utils/appError"));
const insertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // @ts-ignore
        const product = yield tx.featuredProduct.findFirst({
            where: {
                productId: payload.productId
            }
        });
        if (product) {
            throw new appError_1.default(302, "Product already exists in featured lists!");
        }
        // @ts-ignore
        const data = yield tx.featuredProduct.create({
            data: payload
        });
        return data;
    }));
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.featuredProduct.findMany({ where: {
            product: {
                isDeleted: false
            }
        }, include: {
            product: true
        } });
    return res;
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.featuredProduct.findUnique({
        where: {
            id: id,
        },
    });
    return res;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.featuredProduct.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return res;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.featuredProduct.delete({
        where: {
            id: id,
        },
    });
    return res;
});
exports.fpServices = {
    insertIntoDB,
    getAllFromDB,
    getById,
    updateIntoDB,
    deleteFromDB,
};
