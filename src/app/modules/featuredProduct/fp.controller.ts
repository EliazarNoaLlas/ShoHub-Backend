import { Request, Response } from "express";

import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { fpServices } from "./fp.services";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
	const body = req.body;
	
	const result = await fpServices.insertIntoDB(body);

	sendResponse(res, {
		statusCode: 201,
		message: "Feature product created successfully",
		data: result,
	});
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
	const result = await fpServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "All featured product retrived successfully",
		data: result,
	});
});

const getById = catchAsync(async (req: Request, res: Response) => {
	const result = await fpServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Single Feature product retrived successfully",
		data: result,
	});
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await fpServices.updateIntoDB(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Feature product updated successfully",
		data: result,
	});
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await fpServices.deleteFromDB(id);

	sendResponse(res, {
		statusCode: 200,
		message: "Feature product deleted successfully",
		data: result,
	});
});
export const fpController = {
	insertIntoDB,
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,
};
