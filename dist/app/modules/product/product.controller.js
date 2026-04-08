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
exports.productController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const product_services_1 = require("./product.services");
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = yield product_services_1.productServices.insertIntoDB(body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        message: "Product created successfully",
        data: result
    });
}));
const getAllFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield product_services_1.productServices.getAllFromDB(query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "All Products retrived successfully",
        meta: result.meta,
        data: result.result,
    });
}));
const getById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.productServices.getById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Single Product retrived successfully",
        data: result,
    });
}));
const getBySlug = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_services_1.productServices.getBySlug(req.params.slug);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Single Product retrived successfully",
        data: result,
    });
}));
const updateIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const result = yield product_services_1.productServices.updateIntoDB(slug, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Product updated successfully",
        data: result,
    });
}));
const deleteFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const result = yield product_services_1.productServices.deleteFromDB(slug);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Product deleted successfully",
        data: result,
    });
}));
// admin --> soft delete
const softDeleteFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_services_1.productServices.softDeleteFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Product deleted successfully",
        data: result,
    });
}));
const relatedProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const result = yield product_services_1.productServices.relatedProduct(slug);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Related product fetched successfully",
        data: result,
    });
}));
exports.productController = {
    insertIntoDB,
    getAllFromDB,
    getById,
    getBySlug,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB,
    relatedProduct
};
