"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderBy = void 0;
const orderBy = (sortBy) => {
    if (sortBy) {
        return {
            price: sortBy
        };
    }
};
exports.orderBy = orderBy;
