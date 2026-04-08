"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const globalErrorHandler = (err, req, res, next) => {
    const errorResponse = {
        statusCode: err.statusCode || 500,
        message: err.message,
        errorDetails: err,
    };
    if (err instanceof zod_1.ZodError) {
        if (err.issues.length > 0) {
            let errors = [];
            errors = err.issues.map((issue) => ({
                path: issue.path[0],
                message: issue.message,
            }));
            errorResponse.statusCode = 400;
            errorResponse.message = "Validation error";
            errorResponse.errorDetails = errors;
        }
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            errorResponse.statusCode = 302;
            errorResponse.message = "Duplicate Key error";
            errorResponse.errorDetails = "Alreay exist!";
        }
    }
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            errorResponse.statusCode = 404;
            errorResponse.message = "ID is not found";
            errorResponse.errorDetails = "Sorry, ID is not found in Database";
        }
    }
    res.status(errorResponse.statusCode).json({
        success: false,
        message: errorResponse.message,
        errorDetails: errorResponse.errorDetails,
    });
};
exports.default = globalErrorHandler;
