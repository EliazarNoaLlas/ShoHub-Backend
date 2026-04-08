"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
const pagination = (p, l) => {
    const page = p || 1;
    const limit = l || 18;
    const skip = (page - 1) * limit;
    return { limit, skip, page };
};
exports.pagination = pagination;
