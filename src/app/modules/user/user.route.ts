import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();
router.get("/", userController.getAllFromDB);
router.get("/top-customer", userController.topCustomer)
router
	.route("/:id")
	.get(userController.getById)
	.patch(userController.updateIntoDB)
	.delete(userController.deleteFromDB);
router.route("/:id/update-avatar").patch(userController.updateUserAvatar)
export const userRoutes = router;
