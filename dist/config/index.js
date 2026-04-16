"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const envLocalPath = path_1.default.join(process.cwd(), ".env.local");
const envDefaultPath = path_1.default.join(process.cwd(), ".env");
dotenv_1.default.config({ path: fs_1.default.existsSync(envLocalPath) ? envLocalPath : envDefaultPath });
exports.default = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    // Backward compatible: some env files use DATABASE_URL (Prisma), older ones used URI.
    db_uri: (_a = process.env.DATABASE_URL) !== null && _a !== void 0 ? _a : process.env.URI,
    salt_round: process.env.SALT_ROUND,
    // Backward compatible typo: JWT_SECTET existed in older env examples.
    jwt_secret: (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : process.env.JWT_SECTET,
    jwt_expires: process.env.JWT_EXPIRES,
    stripe_api_key: process.env.STRIPE_API_KEY,
    cloudinary: {
        name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    },
    domain_url: process.env.DOMAIN_URL,
    emailUtils: {
        email: process.env.EMAIL,
        password: process.env.PASSWORD,
    },
};
