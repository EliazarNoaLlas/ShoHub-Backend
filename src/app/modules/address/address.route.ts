import { Router } from "express";
import { addressController } from "./address.controller";

const router = Router();


router
	.route("/:id")
	.get(addressController.getById)
	.patch(addressController.updateIntoDB)

export const addressRoutes = router;
