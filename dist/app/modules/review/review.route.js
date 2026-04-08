"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const review_validation_1 = require("./review.validation");
const router = (0, express_1.Router)();
router
    .route("/")
    .post((0, validateRequest_1.default)(review_validation_1.reviewValidation.createReview), review_controller_1.reviewController.insertIntoDB)
    .get(review_controller_1.reviewController.getAllFromDB);
router
    .route("/:id")
    .get(review_controller_1.reviewController.getById)
    .patch(review_controller_1.reviewController.updateIntoDB)
    .delete(review_controller_1.reviewController.deleteFromDB);
exports.reviewRoutes = router;
