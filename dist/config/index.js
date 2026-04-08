"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env.local") });
exports.default = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    db_uri: process.env.URI,
    salt_round: process.env.SALT_ROUND,
    jwt_secret: process.env.JWT_SECTET,
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
