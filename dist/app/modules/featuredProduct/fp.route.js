"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.featuredProductRoutes = void 0;
const express_1 = require("express");
const fp_controller_1 = require("./fp.controller");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(
// authGaurd(Role.ADMIN, Role.SUPER_ADMIN),
fp_controller_1.fpController.insertIntoDB)
    .get(fp_controller_1.fpController.getAllFromDB);
router
    .route("/:id")
    .get(fp_controller_1.fpController.getById)
    .patch(fp_controller_1.fpController.updateIntoDB)
    .delete(fp_controller_1.fpController.deleteFromDB);
exports.featuredProductRoutes = router;
