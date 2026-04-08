import { Request,Response } from "express";

import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { profileServices } from "./profile.services";

const profile = catchAsync(async (req: Request, res: Response) => {
	const result = await profileServices.profile(req.user);

	sendResponse(res, {
		statusCode: 200,
		message: "Profile retrived successfully!",
		data: result,
	});
});

export const profileController = {profile}