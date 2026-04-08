import { Router } from "express";
import authGaurd from "../../middleware/authGaurd";
import { Role } from "@prisma/client";
import { fpController } from "./fp.controller";

const router = Router();
router
	.route("/")
	.post(
		// authGaurd(Role.ADMIN, Role.SUPER_ADMIN),
		fpController.insertIntoDB
	)
	.get(fpController.getAllFromDB);

router
	.route("/:id")
	.get(fpController.getById)
	.patch(fpController.updateIntoDB)
	.delete(fpController.deleteFromDB);

export const featuredProductRoutes = router;
