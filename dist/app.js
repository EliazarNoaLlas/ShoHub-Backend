"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middleware/notFound"));
const routes_1 = require("./app/routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "https://gadget-galaxy-smoky.vercel.app",
        "http://localhost:3000",
    ],
    credentials: true,
}));
//root router
app.use("/api/v1", routes_1.rootRouter);
//not found
// Express 5 + path-to-regexp v6: "*" is not a valid path pattern.
// Registering the middleware without a path makes it a catch-all.
app.use(notFound_1.default);
//global error handler
app.use(globalErrorHandler_1.default);
exports.default = app;
