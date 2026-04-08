"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, obj) => {
    res.status(obj.statusCode).json({
        success: true,
        message: obj.message,
        meta: obj.meta,
        result: obj.data,
    });
};
exports.default = sendResponse;
