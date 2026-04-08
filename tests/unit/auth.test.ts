import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET_TEST, TestFactory } from "../utils/testHelpers";
import { prismaMock, resetPrismaMock } from "../utils/prismaMock";
import { Role } from "../utils/types";

const SALT_ROUND = 10;

async function register(payload: {
	name: string;
	email: string;
	password: string;
	phone: string;
	role?: Role;
	avatar?: string | null;
}) {
	const hashPassword = await bcrypt.hash(payload.password, SALT_ROUND);

	const user = await prismaMock.user.create({
		data: {
			...payload,
			role: payload.role ?? Role.CUSTOMER,
			avatar: payload.avatar ?? null,
			password: hashPassword,
		},
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			avatar: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return user;
}

async function login(payload: { email: string; password: string }) {
	const user = await prismaMock.user.findUniqueOrThrow({
		where: { email: payload.email },
	});
	const correctPass = await bcrypt.compare(payload.password, user.password);
	if (!correctPass) throw new Error("Invalid credentials");

	const token = jwt.sign(
		{ id: user.id, name: user.name, email: user.email, role: user.role },
		JWT_SECRET_TEST,
		{ expiresIn: "7d" }
	);

	return { authToken: token, avatar: user.avatar };
}

async function changePassword(payload: {
	oldPassword: string;
	newPassword: string;
	userId: string;
	userEmail: string;
}) {
	if (payload.oldPassword === payload.newPassword) {
		throw new Error("New password can't be current password!");
	}

	const userDetails = await prismaMock.user.findUniqueOrThrow({
		where: { email: payload.userEmail, id: payload.userId },
	});

	const matchPassword = await bcrypt.compare(
		payload.oldPassword,
		userDetails.password
	);
	if (!matchPassword) throw new Error("Your current password doesn't match");

	const hashedPass = await bcrypt.hash(payload.newPassword, SALT_ROUND);
	await prismaMock.user.update({
		where: { id: payload.userId, email: payload.userEmail },
		data: { password: hashedPass },
	});
}

async function forgotPassword(email: string) {
	const user = await prismaMock.user.findUnique({ where: { email } });
	if (!user) throw new Error("User not found!");
	const token = jwt.sign(
		{ id: user.id, email: user.email, name: user.name, role: user.role },
		JWT_SECRET_TEST,
		{ expiresIn: "10m" }
	);
	return { resetToken: token, userId: user.id };
}

async function resetPassword(payload: {
	id: string;
	token: string;
	password: string;
	confirmPassword: string;
}) {
	if (!payload.id || !payload.token) throw new Error("ID or Token is not valid");
	if (payload.password !== payload.confirmPassword)
		throw new Error("Sorry, Password doesn't match");

	const decoded = jwt.verify(payload.token, JWT_SECRET_TEST) as any;
	await prismaMock.user.findUniqueOrThrow({ where: { id: decoded.id } });

	const hashed = await bcrypt.hash(payload.password, SALT_ROUND);
	await prismaMock.user.update({
		where: { id: payload.id },
		data: { password: hashed },
	});
}

describe("AUTH - Unit Tests", () => {
	beforeEach(() => resetPrismaMock());

	describe("register()", () => {
		it("creates user and returns without password", async () => {
			const input = {
				name: "Juan Perez",
				email: "test@example.com",
				password: "Sh0pHub!2026",
				phone: "+51999888777",
				role: Role.CUSTOMER,
				avatar: null,
			};

			const expectedUser = {
				id: "user-001",
				name: input.name,
				email: input.email,
				phone: input.phone,
				role: Role.CUSTOMER,
				avatar: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			(prismaMock.user.create as jest.Mock).mockResolvedValue(expectedUser);

			const result = await register(input);

			expect(result).toEqual(expectedUser);
			expect(result).not.toHaveProperty("password");
			expect(prismaMock.user.create).toHaveBeenCalledTimes(1);

			const callArgs = (prismaMock.user.create as jest.Mock).mock.calls[0][0];
			expect(callArgs.data.password).not.toBe(input.password);
			expect(callArgs.data.password).toMatch(/^\$2[aby]\$/);
		});

		it("hashes password before save", async () => {
			const rawPassword = "Sh0pHub!2026";
			(prismaMock.user.create as jest.Mock).mockResolvedValue({
				id: "u1",
				email: "x@x.com",
				name: "X",
				phone: "",
				role: Role.CUSTOMER,
				avatar: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			await register({
				name: "X",
				email: "x@x.com",
				password: rawPassword,
				phone: "",
			});

			const savedHash = (prismaMock.user.create as jest.Mock).mock.calls[0][0]
				.data.password;
			const isValid = await bcrypt.compare(rawPassword, savedHash);
			expect(isValid).toBe(true);
		});

		it("defaults role to CUSTOMER if not provided", async () => {
			(prismaMock.user.create as jest.Mock).mockResolvedValue({
				id: "u2",
				email: "y@y.com",
				name: "Y",
				phone: "",
				role: Role.CUSTOMER,
				avatar: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			const result = await register({
				name: "Y",
				email: "y@y.com",
				password: "Pass1234!",
				phone: "",
			});

			expect(result.role).toBe(Role.CUSTOMER);
		});
	});

	describe("login()", () => {
		it("returns JWT for valid credentials", async () => {
			const rawPassword = "Sh0pHub!2026";
			const hashedPassword = await bcrypt.hash(rawPassword, SALT_ROUND);

			const mockUser = TestFactory.createUser({ password: hashedPassword });
			(prismaMock.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);

			const result = await login({
				email: mockUser.email,
				password: rawPassword,
			});

			expect(result).toHaveProperty("authToken");
			const decoded = jwt.verify(result.authToken, JWT_SECRET_TEST) as any;
			expect(decoded.email).toBe(mockUser.email);
			expect(decoded.id).toBe(mockUser.id);
			expect(decoded.role).toBe(mockUser.role);
		});

		it("throws on wrong password", async () => {
			const hashedPassword = await bcrypt.hash("CorrectPass!1", SALT_ROUND);
			const mockUser = TestFactory.createUser({ password: hashedPassword });
			(prismaMock.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);

			await expect(
				login({ email: mockUser.email, password: "WrongPass!1" })
			).rejects.toThrow("Invalid credentials");
		});
	});

	describe("changePassword()", () => {
		it("throws if new password equals old password", async () => {
			await expect(
				changePassword({
					oldPassword: "SamePass!1",
					newPassword: "SamePass!1",
					userId: "user-001",
					userEmail: "test@example.com",
				})
			).rejects.toThrow("New password can't be current password!");
		});

		it("updates password for valid data", async () => {
			const oldRaw = "OldPass!1";
			const storedHash = await bcrypt.hash(oldRaw, SALT_ROUND);
			(prismaMock.user.findUniqueOrThrow as jest.Mock).mockResolvedValue({
				password: storedHash,
			});
			(prismaMock.user.update as jest.Mock).mockResolvedValue({});

			await changePassword({
				oldPassword: oldRaw,
				newPassword: "NewPass!2",
				userId: "user-001",
				userEmail: "test@example.com",
			});

			expect(prismaMock.user.update).toHaveBeenCalledTimes(1);
			const updateCall = (prismaMock.user.update as jest.Mock).mock.calls[0][0];
			const ok = await bcrypt.compare("NewPass!2", updateCall.data.password);
			expect(ok).toBe(true);
		});
	});

	describe("forgotPassword()", () => {
		it("returns reset token when email exists", async () => {
			const mockUser = TestFactory.createUser();
			(prismaMock.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

			const result = await forgotPassword(mockUser.email);
			expect(result).toHaveProperty("resetToken");

			const decoded = jwt.verify(result.resetToken, JWT_SECRET_TEST) as any;
			expect(decoded.email).toBe(mockUser.email);
		});
	});

	describe("resetPassword()", () => {
		it("throws if missing id or token", async () => {
			await expect(
				resetPassword({
					id: "",
					token: "",
					password: "New!1234",
					confirmPassword: "New!1234",
				})
			).rejects.toThrow("ID or Token is not valid");
		});

		it("rejects invalid/expired token", async () => {
			const expiredToken = jwt.sign({ id: "u1" }, JWT_SECRET_TEST, {
				expiresIn: "-1s",
			});

			await expect(
				resetPassword({
					id: "u1",
					token: expiredToken,
					password: "Pass!1",
					confirmPassword: "Pass!1",
				})
			).rejects.toThrow();
		});
	});
});

