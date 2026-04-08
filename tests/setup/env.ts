import fs from "fs";
import path from "path";
import dotenv from "dotenv";

process.env.NODE_ENV = "test";

// Load `.env.test` if present. Fallback to `.env.example` so unit tests can run
// even when a test DB is not configured yet.
const envTestPath = path.join(process.cwd(), ".env.test");
const envExamplePath = path.join(process.cwd(), ".env.example");

if (fs.existsSync(envTestPath)) {
	dotenv.config({ path: envTestPath });
} else if (fs.existsSync(envExamplePath)) {
	dotenv.config({ path: envExamplePath });
}

// Provide safe defaults for unit/integration tests that don't hit external services.
process.env.PORT ||= "5001";
process.env.JWT_SECTET ||= "test-jwt-secret";
process.env.JWT_EXPIRES ||= "1d";
process.env.SALT_ROUND ||= "12";

