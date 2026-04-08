import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { adminDataServices } from "./adminData.services";

const metaData = catchAsync(async (req: Request, res: Response) => {
	
	const result = await adminDataServices.metaData();

	sendResponse(res, {
		statusCode: 200,
		message: "Meta data fetched successfully",
		data: result,
	});
});


export const adminDataController  = {metaData}