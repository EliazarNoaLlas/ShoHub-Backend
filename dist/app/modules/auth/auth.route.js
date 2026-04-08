"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const client_1 = require("@prisma/client");
const authGaurd_1 = __importDefault(require("../../middleware/authGaurd"));
const router = (0, express_1.Router)();
router.post("/register", auth_controller_1.authController.register);
router.post("/login", auth_controller_1.authController.login);
router.post("/forgot-password", auth_controller_1.authController.forgotPassword);
router.post("/change-password", (0, authGaurd_1.default)(client_1.Role.ADMIN, client_1.Role.CUSTOMER, client_1.Role.SUPER_ADMIN), auth_controller_1.authController.changePassword);
router.post("/reset-password", auth_controller_1.authController.resetPassword);
exports.authRoutes = router;
