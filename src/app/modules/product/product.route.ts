import { Router } from "express";
import { productController } from "./product.controller";
import { Role } from "@prisma/client";
import authGaurd from "../../middleware/authGaurd";
import validateRequest from "../../middleware/validateRequest";
import { productValidation } from "./product.validation";

const router = Router();

router
	.route("/")
	.post(
		// authGaurd(Role.ADMIN,Role.SUPER_ADMIN),
		validateRequest(productValidation.createProduct),
		productController.insertIntoDB
	)
	.get(productController.getAllFromDB);

//related product according to price
router.get("/related-product/:slug", productController.relatedProduct);

//for admin
router.get("/admin/:id", productController.getById);

//admin
router.delete(
	"/soft/:id",
	authGaurd(Role.ADMIN, Role.SUPER_ADMIN),
	productController.softDeleteFromDB
);

router
	.route("/:slug")
	.get(productController.getBySlug)
	.patch(
		authGaurd(Role.ADMIN, Role.SUPER_ADMIN),
		productController.updateIntoDB
	)
	.delete(
		authGaurd(Role.ADMIN, Role.SUPER_ADMIN),
		productController.deleteFromDB
	);


	
export const productRoutes = router;
