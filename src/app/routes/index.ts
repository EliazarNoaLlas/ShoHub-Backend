import { Router } from "express";
import { routeArray } from "./routeArray";

const router = Router();

routeArray.forEach((item) => router.use(item.path, item.route));

export const rootRouter = router;
