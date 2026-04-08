import { Router } from "express";
import authGaurd from "../../middleware/authGaurd";
import { Role } from "@prisma/client";
import { opController } from "./op.controller";

const router = Router();
router
	.route("/")
	.post(
		// authGaurd(Role.ADMIN, Role.SUPER_ADMIN),
		opController.insertIntoDB
	)
	.get(opController.getAllFromDB);

router
	.route("/:id")
	.get(opController.getById)
	.patch(opController.updateIntoDB)
	.delete(opController.deleteFromDB);

export const hotOffersRoutes = router;
