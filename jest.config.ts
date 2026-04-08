import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["<rootDir>/tests/**/*.test.ts"],
	setupFiles: ["<rootDir>/tests/setup/env.ts"],
	clearMocks: true,
	restoreMocks: true,
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/server.ts", // only bootstraps the HTTP server
		"!dist/**",
	],
	coverageDirectory: "coverage",
};

export default config;

