"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = require("express");
const routeArray_1 = require("./routeArray");
const router = (0, express_1.Router)();
routeArray_1.routeArray.forEach((item) => router.use(item.path, item.route));
exports.rootRouter = router;
