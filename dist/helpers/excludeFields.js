"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Exclude keys from user
function exclude(user, keys) {
    return Object.fromEntries(Object.entries(user).filter(([key]) => !keys.includes(key)));
}
exports.default = exclude;
