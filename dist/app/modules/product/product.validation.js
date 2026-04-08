"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const zod_1 = require("zod");
const createProduct = zod_1.z.object({
    name: zod_1.z.string({ message: "Name is required" }).trim().min(5, { message: "Product's Name should be more than 5 characters" }),
    description: zod_1.z.string().min(1),
    price: zod_1.z.number({ message: "Price is required" }),
    regularPrice: zod_1.z.number({ message: "Regular price is required" }),
    inStock: zod_1.z.number(),
    photo: zod_1.z.string({ message: "Photo is required" }).url(), // assuming it's a URL
    isDeleted: zod_1.z.boolean().default(false),
    rating: zod_1.z.number().default(0),
    brand: zod_1.z.string({ message: "Brand is required" }),
    processor_type: zod_1.z.string(),
    processor_model: zod_1.z.string(),
    generation: zod_1.z.string(),
    display: zod_1.z.string(),
    display_size: zod_1.z.string(),
    display_type: zod_1.z.string(),
    ram: zod_1.z.string(),
    ram_type: zod_1.z.string(),
    hdd: zod_1.z.string().optional(),
    ssd: zod_1.z.string(),
    graphics: zod_1.z.string(),
    operating_system: zod_1.z.string(),
    features: zod_1.z.array(zod_1.z.string()),
});
exports.productValidation = { createProduct };
