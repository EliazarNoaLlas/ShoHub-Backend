"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldRouter = void 0;
const express_1 = require("express");
const field_controller_1 = require("./field.controller");
const router = (0, express_1.Router)();
router.get("/", field_controller_1.fieldController.getProductField);
exports.fieldRouter = router;
