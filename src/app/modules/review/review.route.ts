import { Router } from "express";
import { reviewController } from "./review.controller";
import validateRequest from "../../middleware/validateRequest";
import { reviewValidation } from "./review.validation";

const router = Router();
router
	.route("/")
	.post(validateRequest(reviewValidation.createReview), reviewController.insertIntoDB)
	.get(reviewController.getAllFromDB);

router
	.route("/:id")
	.get(reviewController.getById)
	.patch(reviewController.updateIntoDB)
	.delete(reviewController.deleteFromDB);

export const reviewRoutes = router;
