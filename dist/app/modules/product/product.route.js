"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const client_1 = require("@prisma/client");
const authGaurd_1 = __importDefault(require("../../middleware/authGaurd"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const product_validation_1 = require("./product.validation");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(
// authGaurd(Role.ADMIN,Role.SUPER_ADMIN),
(0, validateRequest_1.default)(product_validation_1.productValidation.createProduct), product_controller_1.productController.insertIntoDB)
    .get(product_controller_1.productController.getAllFromDB);
//related product according to price
router.get("/related-product/:slug", product_controller_1.productController.relatedProduct);
//for admin
router.get("/admin/:id", product_controller_1.productController.getById);
//admin
router.delete("/soft/:id", (0, authGaurd_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), product_controller_1.productController.softDeleteFromDB);
router
    .route("/:slug")
    .get(product_controller_1.productController.getBySlug)
    .patch((0, authGaurd_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), product_controller_1.productController.updateIntoDB)
    .delete((0, authGaurd_1.default)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN), product_controller_1.productController.deleteFromDB);
exports.productRoutes = router;
