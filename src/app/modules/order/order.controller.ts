import { Request, Response } from "express";

import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { orderServices } from "./order.services";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
	const body = req.body;
	const result = await orderServices.insertIntoDB(body);

	sendResponse(res, {
		statusCode: 201,
		message: "Order created successfully",
		data: result,
	});
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
	const result = await orderServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "All Orderes retrived successfully",
		data: result,
	});
});

const getById = catchAsync(async (req: Request, res: Response) => {
	const result = await orderServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Single Order retrived successfully",
		data: result,
	});
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await orderServices.updateIntoDB(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Order updated successfully",
		data: result,
	});
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await orderServices.deleteFromDB(id);

	sendResponse(res, {
		statusCode: 200,
		message: "Order deleted successfully",
		data: result,
	});
});


//admin
const getLatestOrder = catchAsync(async (req: Request, res: Response) => {
	
	const result = await orderServices.getLatestOrder();

	sendResponse(res, {
		statusCode: 200,
		message: "Latest fetched successfully",
		data: result,
	});
});
export const orderController = {
	insertIntoDB,
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,

	getLatestOrder
};
