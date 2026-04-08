"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const category_validation_1 = require("./category.validation");
const router = (0, express_1.Router)();
router.get("/group-by", category_controller_1.categoryController.catSubCatName);
router
    .route("/")
    .post(
// authGaurd(Role.ADMIN, Role.SUPER_ADMIN),
(0, validateRequest_1.default)(category_validation_1.categoryValidation.createCategory), category_controller_1.categoryController.insertIntoDB)
    .get(category_controller_1.categoryController.getAllFromDB);
router
    .route("/:id")
    .get(category_controller_1.categoryController.getById)
    .patch(category_controller_1.categoryController.updateIntoDB)
    .delete(category_controller_1.categoryController.deleteFromDB);
exports.categoryRoutes = router;
