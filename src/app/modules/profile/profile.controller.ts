import { Request,Response } from "express";

import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { profileServices } from "./profile.services";
import AppError from "../../../utils/appError";

const profile = catchAsync(async (req: Request, res: Response) => {
	if (!req.user) {
		throw new AppError(401, "You are not authorized");
	}

	const result = await profileServices.profile(req.user);

	sendResponse(res, {
		statusCode: 200,
		message: "Profile retrived successfully!",
		data: result,
	});
});

export const profileController = {profile}
