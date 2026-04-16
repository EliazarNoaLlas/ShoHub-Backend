import path from "path";
import fs from "fs";
import dotenv from "dotenv";

const envLocalPath = path.join(process.cwd(), ".env.local");
const envDefaultPath = path.join(process.cwd(), ".env");
dotenv.config({ path: fs.existsSync(envLocalPath) ? envLocalPath : envDefaultPath });

export default {
	node_env: process.env.NODE_ENV,
	port: process.env.PORT,
	// Backward compatible: some env files use DATABASE_URL (Prisma), older ones used URI.
	db_uri: process.env.DATABASE_URL ?? process.env.URI,
	salt_round: process.env.SALT_ROUND,
	// Backward compatible typo: JWT_SECTET existed in older env examples.
	jwt_secret: process.env.JWT_SECRET ?? process.env.JWT_SECTET,
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
