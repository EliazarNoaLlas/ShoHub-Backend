"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = require("express");
const order_controller_1 = require("./order.controller");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(order_controller_1.orderController.insertIntoDB)
    .get(order_controller_1.orderController.getAllFromDB);
//admin
router.get("/latest-order", order_controller_1.orderController.getLatestOrder);
router
    .route("/:id")
    .get(order_controller_1.orderController.getById)
    .patch(order_controller_1.orderController.updateIntoDB)
    .delete(order_controller_1.orderController.deleteFromDB);
exports.orderRoutes = router;
