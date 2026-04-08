import jwt from "jsonwebtoken";
import { ZodError, z } from "zod";
import { JWT_SECRET_TEST, TestFactory } from "../utils/testHelpers";
import { prismaMock, resetPrismaMock } from "../utils/prismaMock";
import { Role } from "../utils/types";

function buildReq(headers: Record<string, string> = {}, body = {}): any {
	return { headers, body, user: undefined };
}

function buildRes(): any {
	const res: any = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
}

const authGaurd =
	(...roles: string[]) =>
	async (req: any, res: any, next: jest.Mock) => {
		try {
			const token = req.headers.authorization;
			if (!token) throw { statusCode: 401, message: "You are not authorized" };

			const decodedInfo = jwt.verify(token, JWT_SECRET_TEST) as any;
			const { email, id, role } = decodedInfo;

			const user = await prismaMock.user.findUniqueOrThrow({
				where: { email, id },
			});

			if (!user) throw { statusCode: 401, message: "User not found!" };
			if (roles.length && !roles.includes(role)) {
				throw { statusCode: 401, message: "You are not authorized" };
			}

			req.user = decodedInfo;
			next(undefined);
		} catch (error) {
			next(error);
		}
	};

const globalErrorHandler = (err: any, req: any, res: any, next: any) => {
	const errorResponse = {
		statusCode: err.statusCode || 500,
		message: err.message || "Internal Server Error",
		errorDetails: err,
	};

	if (err instanceof ZodError) {
		errorResponse.statusCode = 400;
		errorResponse.message = "Validation error";
		errorResponse.errorDetails = err.issues.map((i: any) => ({
			path: i.path[0],
			message: i.message,
		})) as any;
	}

	if (err?.code === "P2002") {
		errorResponse.statusCode = 302;
		errorResponse.message = "Duplicate Key error";
		errorResponse.errorDetails = "Already exist!" as any;
	}

	if (err?.code === "P2025") {
		errorResponse.statusCode = 404;
		errorResponse.message = "ID is not found";
	}

	res.status(errorResponse.statusCode).json({
		success: false,
		message: errorResponse.message,
		errorDetails: errorResponse.errorDetails,
	});
};

describe("MIDDLEWARE - Unit Tests", () => {
	beforeEach(() => {
		resetPrismaMock();
	});

	describe("authGaurd()", () => {
		it("no token => next(err)", async () => {
			const req = buildReq();
			const res = buildRes();
			const next = jest.fn();

			await authGaurd()(req, res, next);

			expect(next).toHaveBeenCalledWith(
				expect.objectContaining({ message: "You are not authorized" })
			);
		});

		it("valid token + user exists => next(undefined)", async () => {
			const mockUser = TestFactory.createUser();
			const token = jwt.sign(
				{ id: mockUser.id, email: mockUser.email, name: mockUser.name, role: mockUser.role },
				JWT_SECRET_TEST
			);
			const req = buildReq({ authorization: token });
			const res = buildRes();
			const next = jest.fn();

			(prismaMock.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);

			await authGaurd()(req, res, next);

			expect(next).toHaveBeenCalledWith(undefined);
			expect(req.user).toBeDefined();
		});

		it("valid token but role not allowed => next(err)", async () => {
			const mockUser = TestFactory.createUser({ role: Role.CUSTOMER });
			const token = jwt.sign(
				{ id: mockUser.id, email: mockUser.email, name: mockUser.name, role: Role.CUSTOMER },
				JWT_SECRET_TEST
			);
			const req = buildReq({ authorization: token });
			const res = buildRes();
			const next = jest.fn();

			(prismaMock.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);

			await authGaurd(Role.ADMIN, Role.SUPER_ADMIN)(req, res, next);

			const errorArg = next.mock.calls[0][0];
			expect(errorArg).toBeDefined();
			expect(errorArg.message).toBe("You are not authorized");
		});
	});

	describe("globalErrorHandler()", () => {
		it("ZodError => 400", () => {
			const schema = z.object({ name: z.string().min(5) });
			let zodErr: ZodError;
			try {
				schema.parse({ name: "AB" });
			} catch (e) {
				zodErr = e as ZodError;
			}

			const res = buildRes();
			globalErrorHandler(zodErr!, buildReq(), res, jest.fn());

			expect(res.status).toHaveBeenCalledWith(400);
		});

		it("P2002 => 302", () => {
			const res = buildRes();
			globalErrorHandler({ code: "P2002", message: "Unique constraint failed" }, buildReq(), res, jest.fn());
			expect(res.status).toHaveBeenCalledWith(302);
		});
	});
});

