"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDataRoutes = void 0;
const express_1 = require("express");
const adminData_controller_1 = require("./adminData.controller");
const router = (0, express_1.Router)();
router.get("/info", adminData_controller_1.adminDataController.metaData);
exports.adminDataRoutes = router;
