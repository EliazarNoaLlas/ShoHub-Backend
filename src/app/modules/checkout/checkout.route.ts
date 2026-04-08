import { Router } from "express";
import { checkoutController } from "./checkout.controller";

const router = Router();
router.post("/", checkoutController.makeCheckout)

export const checkoutRoutes =  router