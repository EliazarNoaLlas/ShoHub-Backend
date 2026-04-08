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
exports.reviewServices = void 0;
const db_1 = require("../../../db/db");
const insertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield tx.product.findUniqueOrThrow({
            where: {
                id: payload.productId
            },
            include: {
                reviews: true,
            }
        });
        const newReviewCount = product.reviews.length + 1;
        const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, payload.rating);
        const newRating = totalRating / newReviewCount;
        const review = yield tx.review.create({
            data: payload,
        });
        yield tx.product.update({
            where: {
                id: payload.productId
            },
            data: {
                rating: newRating
            }
        });
        return review;
    }));
    return result;
});
const getAllFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.review.findMany({ include: {
            product: {
                select: {
                    name: true,
                }
            },
            user: {
                select: {
                    name: true
                }
            }
        } });
    return res;
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.review.findMany({
        where: {
            id: id,
        },
    });
    return res;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.review.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return res;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.review.delete({
        where: {
            id: id,
        },
    });
    return res;
});
exports.reviewServices = {
    insertIntoDB,
    getAllFromDB,
    getById,
    updateIntoDB,
    deleteFromDB,
};
