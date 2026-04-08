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
const product_validation_1 = require("../../../src/app/modules/product/product.validation");
describe("product.validation", () => {
    it("accepts a valid product payload", () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = {
            name: "Laptop Gamer Pro 15",
            description: "High performance laptop",
            price: 1200,
            regularPrice: 1500,
            inStock: 10,
            photo: "https://example.com/photo.jpg",
            isDeleted: false,
            rating: 0,
            brand: "BrandX",
            processor_type: "Intel",
            processor_model: "i7",
            generation: "13th",
            display: "FHD",
            display_size: "15.6",
            display_type: "IPS",
            ram: "16GB",
            ram_type: "DDR5",
            hdd: "1TB",
            ssd: "512GB",
            graphics: "RTX 4060",
            operating_system: "Windows 11",
            features: ["wifi", "bluetooth"],
        };
        yield expect(product_validation_1.productValidation.createProduct.parseAsync(payload)).resolves.toBeTruthy();
    }));
    it("rejects invalid product payload", () => __awaiter(void 0, void 0, void 0, function* () {
        const payload = { name: "abc" };
        yield expect(product_validation_1.productValidation.createProduct.parseAsync(payload)).rejects.toBeTruthy();
    }));
});
