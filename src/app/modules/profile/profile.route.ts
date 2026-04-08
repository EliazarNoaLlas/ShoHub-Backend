import { Router } from "express";
import { profileController } from "./profile.controller";
import { Role } from "@prisma/client";
import authGaurd from "../../middleware/authGaurd";

const router = Router();

router
	.route("/me")
	.get(authGaurd(Role.ADMIN, Role.CUSTOMER), profileController.profile);

export const profileRoutes = router;
