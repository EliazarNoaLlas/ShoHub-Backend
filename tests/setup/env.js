"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
process.env.NODE_ENV = "test";
// Load `.env.test` if present. Fallback to `.env.example` so unit tests can run
// even when a test DB is not configured yet.
const envTestPath = path_1.default.join(process.cwd(), ".env.test");
const envExamplePath = path_1.default.join(process.cwd(), ".env.example");
if (fs_1.default.existsSync(envTestPath)) {
    dotenv_1.default.config({ path: envTestPath });
}
else if (fs_1.default.existsSync(envExamplePath)) {
    dotenv_1.default.config({ path: envExamplePath });
}
// Provide safe defaults for unit/integration tests that don't hit external services.
(_a = process.env).PORT || (_a.PORT = "5001");
(_b = process.env).JWT_SECTET || (_b.JWT_SECTET = "test-jwt-secret");
(_c = process.env).JWT_EXPIRES || (_c.JWT_EXPIRES = "1d");
(_d = process.env).SALT_ROUND || (_d.SALT_ROUND = "12");
