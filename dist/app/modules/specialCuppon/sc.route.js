"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subCategoryRoutes = void 0;
const express_1 = require("express");
const sc_controller_1 = require("./sc.controller");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(sc_controller_1.scController.insertIntoDB)
    .get(sc_controller_1.scController.getAllFromDB);
router
    .route("/:id")
    .get(sc_controller_1.scController.getById)
    .patch(sc_controller_1.scController.updateIntoDB)
    .delete(sc_controller_1.scController.deleteFromDB);
exports.subCategoryRoutes = router;
