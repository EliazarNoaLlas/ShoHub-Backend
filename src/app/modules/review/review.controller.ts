
import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { reviewServices } from "./review.services";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
	const body = req.body;
	const result = await reviewServices.insertIntoDB(body);

	sendResponse(res, {
		statusCode: 201,
		message: "Review created successfully",
		data: result,
	});
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
	const result = await reviewServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "All Reviews retrived successfully",
		data: result,
	});
});

const getById = catchAsync(async (req: Request, res: Response) => {
	const result = await reviewServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Single Review retrived successfully",
		data: result,
	});
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await reviewServices.updateIntoDB(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Review updated successfully",
		data: result,
	});
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await reviewServices.deleteFromDB(id);

	sendResponse(res, {
		statusCode: 200,
		message: "Review deleted successfully",
		data: result,
	});
});
export const reviewController = {
	insertIntoDB,
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,
};
