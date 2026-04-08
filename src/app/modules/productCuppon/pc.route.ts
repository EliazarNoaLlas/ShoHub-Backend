import { Router } from "express";
import { pcController } from "./pc.controller";

const router = Router();
router
	.route("/")
	.post(pcController.insertIntoDB)
	.get(pcController.getAllFromDB);

router
	.route("/:id")
	.get(pcController.getById)
	.patch(pcController.updateIntoDB)
	.delete(pcController.deleteFromDB);

export const subCategoryRoutes = router;
