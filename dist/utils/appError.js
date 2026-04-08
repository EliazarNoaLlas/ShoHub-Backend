"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(code, message) {
        super(message);
        this.statusCode = code;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
