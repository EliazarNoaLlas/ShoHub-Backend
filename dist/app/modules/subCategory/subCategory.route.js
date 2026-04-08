"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subCategoryRoutes = void 0;
const express_1 = require("express");
const subCategory_controller_1 = require("./subCategory.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const subCategory_validation_1 = require("./subCategory.validation");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(
// authGaurd(Role.SUPER_ADMIN, Role.ADMIN),
(0, validateRequest_1.default)(subCategory_validation_1.subCategoryValidation.createSubCategory), subCategory_controller_1.subCategoryController.insertIntoDB)
    .get(subCategory_controller_1.subCategoryController.getAllFromDB);
router
    .route("/:id")
    .get(subCategory_controller_1.subCategoryController.getById)
    .patch(subCategory_controller_1.subCategoryController.updateIntoDB)
    .delete(subCategory_controller_1.subCategoryController.deleteFromDB);
exports.subCategoryRoutes = router;
