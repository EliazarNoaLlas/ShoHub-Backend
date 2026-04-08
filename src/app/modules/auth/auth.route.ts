import { Router } from "express";
import { authController } from "./auth.controller";
import { Role } from "@prisma/client";
import authGaurd from "../../middleware/authGaurd";

const router = Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/forgot-password", authController.forgotPassword);

router.post(
	"/change-password",
	authGaurd(Role.ADMIN, Role.CUSTOMER, Role.SUPER_ADMIN),
	authController.changePassword
);

router.post("/reset-password", authController.resetPassword);

export const authRoutes = router;
