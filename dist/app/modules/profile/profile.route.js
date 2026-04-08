"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoutes = void 0;
const express_1 = require("express");
const profile_controller_1 = require("./profile.controller");
const client_1 = require("@prisma/client");
const authGaurd_1 = __importDefault(require("../../middleware/authGaurd"));
const router = (0, express_1.Router)();
router
    .route("/me")
    .get((0, authGaurd_1.default)(client_1.Role.ADMIN, client_1.Role.CUSTOMER), profile_controller_1.profileController.profile);
exports.profileRoutes = router;
