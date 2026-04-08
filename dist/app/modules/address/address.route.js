"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRoutes = void 0;
const express_1 = require("express");
const address_controller_1 = require("./address.controller");
const router = (0, express_1.Router)();
router
    .route("/:id")
    .get(address_controller_1.addressController.getById)
    .patch(address_controller_1.addressController.updateIntoDB);
exports.addressRoutes = router;
