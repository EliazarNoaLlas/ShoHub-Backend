"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewValidation = void 0;
const zod_1 = require("zod");
const createReview = zod_1.z.object({
    userId: zod_1.z.string({ message: "User ID can not be undefined" }),
    productId: zod_1.z.string(),
    rating: zod_1.z.number().max(5, { message: "Maximum number is 5" }),
    message: zod_1.z.string().min(10, { message: "Minimum character should be 10" })
});
exports.reviewValidation = { createReview };
