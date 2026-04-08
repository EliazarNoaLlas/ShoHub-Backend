"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subCategoryRoutes = void 0;
const express_1 = require("express");
const pc_controller_1 = require("./pc.controller");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(pc_controller_1.pcController.insertIntoDB)
    .get(pc_controller_1.pcController.getAllFromDB);
router
    .route("/:id")
    .get(pc_controller_1.pcController.getById)
    .patch(pc_controller_1.pcController.updateIntoDB)
    .delete(pc_controller_1.pcController.deleteFromDB);
exports.subCategoryRoutes = router;
