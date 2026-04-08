import { Router } from "express";
import { adminDataController } from "./adminData.controller";


const router = Router()

router.get("/info", adminDataController.metaData)

export const adminDataRoutes = router;