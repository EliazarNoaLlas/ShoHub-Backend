"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFoundPage = (req, res) => {
    res.status(404).json({
        success: false,
        message: "Your requested path is not valid",
    });
};
exports.default = notFoundPage;
