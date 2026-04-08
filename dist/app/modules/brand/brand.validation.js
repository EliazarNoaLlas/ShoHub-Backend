"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandValidation = void 0;
const zod_1 = require("zod");
const createBrand = zod_1.z.object({
    name: zod_1.z.string({ required_error: "Brand name is required" }).trim()
});
exports.brandValidation = { createBrand };
