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
exports.adminDataServices = void 0;
const db_1 = require("../../../db/db");
const metaData = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield db_1.prisma.order.count();
    const price = yield db_1.prisma.order.aggregate({
        _sum: {
            totalPrice: true,
        }
    });
    const products = yield db_1.prisma.product.count();
    const totalSales = price._sum.totalPrice;
    return {
        totalSales,
        orders,
        products
    };
});
exports.adminDataServices = { metaData };
