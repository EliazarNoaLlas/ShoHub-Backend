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
exports.opServices = void 0;
const db_1 = require("../../../db/db");
const appError_1 = __importDefault(require("../../../utils/appError"));
const insertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield tx.product.findUniqueOrThrow({
            where: { id: payload.productId }
        });
        const discountPrice = product.price * (payload.discount / 100);
        const finalPrice = Math.ceil(product.price - discountPrice);
        const findProduct = yield tx.hotOffers.findFirst({
            where: {
                productId: product.id
            }
        });
        if (!findProduct) {
            const offerPorduct = yield tx.hotOffers.create({
                data: Object.assign(Object.assign({}, payload), { price: finalPrice })
            });
            return offerPorduct;
        }
        else {
            throw new appError_1.default(400, "Product already exists in offer lists!");
        }
    }));
    return res;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.hotOffers.findMany({ where: {
            product: {
                isDeleted: false
            }
        }, include: {
            product: true
        } });
    return res;
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.hotOffers.findUniqueOrThrow({
        where: {
            id
        },
        include: {
            product: {
                include: {
                    reviews: true
                }
            },
        }
    });
    return res;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.hotOffers.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return res;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.hotOffers.delete({
        where: {
            id: id,
        },
    });
    return res;
});
exports.opServices = {
    insertIntoDB,
    getAllFromDB,
    getById,
    updateIntoDB,
    deleteFromDB,
};
