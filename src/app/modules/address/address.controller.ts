import { Request, Response } from "express";

import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { addressServices } from "./address.services";



const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
	const result = await addressServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "All Address retrived successfully",
		data: result,
	});
});

const getById = catchAsync(async (req: Request, res: Response) => {
	const result = await addressServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Single Address retrived successfully",
		data: result,
	});
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
	const  {id} = req.params;
	const result = await addressServices.updateIntoDB(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Address updated successfully",
		data: result,
	});
});

export const addressController = {
	getAllFromDB,
	getById,
	updateIntoDB,
	
};
