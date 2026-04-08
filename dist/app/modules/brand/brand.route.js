"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandRoutes = void 0;
const express_1 = require("express");
const brand_controller_1 = require("./brand.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const brand_validation_1 = require("./brand.validation");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(
// authGaurd(Role.ADMIN, Role.SUPER_ADMIN),
(0, validateRequest_1.default)(brand_validation_1.brandValidation.createBrand), brand_controller_1.brandController.insertIntoDB)
    .get(brand_controller_1.brandController.getAllFromDB);
router
    .route("/:id")
    .get(brand_controller_1.brandController.getById)
    .patch(
// authGaurd(Role.ADMIN, Role.SUPER_ADMIN),
brand_controller_1.brandController.updateIntoDB)
    .delete(brand_controller_1.brandController.deleteFromDB);
exports.brandRoutes = router;
