"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotOffersRoutes = void 0;
const express_1 = require("express");
const op_controller_1 = require("./op.controller");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(
// authGaurd(Role.ADMIN, Role.SUPER_ADMIN),
op_controller_1.opController.insertIntoDB)
    .get(op_controller_1.opController.getAllFromDB);
router
    .route("/:id")
    .get(op_controller_1.opController.getById)
    .patch(op_controller_1.opController.updateIntoDB)
    .delete(op_controller_1.opController.deleteFromDB);
exports.hotOffersRoutes = router;
