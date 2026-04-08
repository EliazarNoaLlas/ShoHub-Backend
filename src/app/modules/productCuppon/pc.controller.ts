import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { pcServices } from "./pc.services";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
	const body = req.body;
	const result = await pcServices.insertIntoDB(body);

	sendResponse(res, {
		statusCode: 201,
		message: "Product Cuppon created successfully",
		data: result,
	});
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
	const result = await pcServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "All Product Cuppons retrived successfully",
		data: result,
	});
});

const getById = catchAsync(async (req: Request, res: Response) => {
	const result = await pcServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Single Product Cuppon retrived successfully",
		data: result,
	});
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await pcServices.updateIntoDB(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Product Cuppon updated successfully",
		data: result,
	});
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await pcServices.deleteFromDB(id);

	sendResponse(res, {
		statusCode: 200,
		message: "Product Cuppon deleted successfully",
		data: result,
	});
});
export const pcController = {
	insertIntoDB,
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,
};
