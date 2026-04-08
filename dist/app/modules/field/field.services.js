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
exports.fieldSerces = void 0;
const db_1 = require("../../../db/db");
const getProductField = () => __awaiter(void 0, void 0, void 0, function* () {
    const brand = yield db_1.prisma.product.groupBy({
        by: ["brandId"],
    });
    const processor_type = yield db_1.prisma.product.groupBy({
        by: ["processor_type"],
    });
    const processor_model = yield db_1.prisma.product.groupBy({
        by: ["processor_model"],
    });
    const generation = yield db_1.prisma.product.groupBy({
        by: ["generation"],
    });
    const display_size = yield db_1.prisma.product.groupBy({
        by: ["display_size"],
    });
    const display_type = yield db_1.prisma.product.groupBy({
        by: ["display_type"],
    });
    const ram_size = yield db_1.prisma.product.groupBy({
        by: ["ram"],
    });
    const ram_type = yield db_1.prisma.product.groupBy({
        by: ["ram_type"],
    });
    const hdd = yield db_1.prisma.product.groupBy({
        by: ["hdd"],
    });
    const ssd = yield db_1.prisma.product.groupBy({
        by: ["ssd"],
    });
    const graphics = yield db_1.prisma.product.groupBy({
        by: ["graphics"],
    });
    const operating_system = yield db_1.prisma.product.groupBy({
        by: ["operating_system"],
    });
    return { Brand: brand, Processor_Type: processor_type, Processor_Model: processor_model, Generation: generation, Display_Size: display_size, Display_Type: display_type, Ram_Size: ram_size, Ram_Type: ram_type, HDD: hdd, SSD: ssd, Graphics: graphics, Operating_System: operating_system };
});
const minMaxPrice = () => __awaiter(void 0, void 0, void 0, function* () {
    const value = yield db_1.prisma.product.aggregate({
        _min: {
            price: true,
        },
        _max: {
            price: true
        }
    });
    return value;
});
exports.fieldSerces = { getProductField, minMaxPrice };
