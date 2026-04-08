import { Request, Response } from "express";
import { authServices } from "./auth.services";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import AppError from "../../../utils/appError";

const register = catchAsync(async (req: Request, res: Response) => {
	const result = await authServices.register(req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "User registered successfully",
		data: result,
	});
});

const login = catchAsync(async (req: Request, res: Response) => {
	const result = await authServices.login(req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Logged in successfully!",
		data: result,
	});
});

//forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	const result = await authServices.forgotPassword(req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Reset link email has been sent",
		data: result,
	});
});

//change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(401, "You are not authorized");
	}

	const result = await authServices.changePassword({
		payload: req.body,
		user: req.user,
	});

	sendResponse(res, {
		statusCode: 200,
		message: "Password changed successfully",
		data: result,
	});
});

//reset-password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const { token, id } = req.query;
	const result = await authServices.resetPassword({
		id: id as string,
		token: token as string,
		payload: req.body,
	});

	sendResponse(res, {
		statusCode: 200,
		message: "Password reseted successfully",
		data: result,
	});
});

export const authController = {
	register,
	login,
	forgotPassword,
	changePassword,
	resetPassword,
};
