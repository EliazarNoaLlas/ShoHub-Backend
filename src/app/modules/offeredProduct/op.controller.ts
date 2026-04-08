import { Request, Response } from "express";

import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { opServices } from "./op.services";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
	
	const body = req.body;
	const result = await opServices.insertIntoDB(body);

	sendResponse(res, {
		statusCode: 201,
		message: "Offered product created successfully",
		data: result,
	});
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
	const result = await opServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "All offered product retrived successfully",
		data: result,
	});
});

const getById = catchAsync(async (req: Request, res: Response) => {
	const result = await opServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Single Offered product retrived successfully",
		data: result,
	});
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await opServices.updateIntoDB(id, req.body);

	sendResponse(res, {
		statusCode: 201,
		message: "Offered product updated successfully",
		data: result,
	});
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await opServices.deleteFromDB(id);

	sendResponse(res, {
		statusCode: 201,
		message: "Offered product deleted successfully",
		data: result,
	});
});
export const opController = {
	insertIntoDB,
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,
};
