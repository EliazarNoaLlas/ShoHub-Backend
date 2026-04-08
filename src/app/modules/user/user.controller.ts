import { Request, Response } from "express";
import { userServices } from "./user.services";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";



const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
	const result = await userServices.getAllFromDB();

	sendResponse(res, {
		statusCode: 200,
		message: "All Users retrived successfully",
		data: result,
	});
});

const getById = catchAsync(async (req: Request, res: Response) => {
	const result = await userServices.getById(req.params.id);

	sendResponse(res, {
		statusCode: 200,
		message: "Single User retrived successfully",
		data: result,
	});
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await userServices.updateIntoDB(id, req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "User updated successfully",
		data: result,
	});
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await userServices.deleteFromDB(id);

	sendResponse(res, {
		statusCode: 200,
		message: "User deleted successfully",
		data: result,
	});
});


const updateUserAvatar = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await userServices.updateUserAvatar(id,req.body);

	sendResponse(res, {
		statusCode: 200,
		message: "Profile photo changed successfully",
		data: result,
	});
});

const topCustomer = catchAsync(async (req: Request, res: Response) => {
	
	const result = await userServices.topCustomer();

	sendResponse(res, {
		statusCode: 200,
		message: "Top Customer fetched successfully",
		data: result,
	});
});


export const userController = {
	
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,
	updateUserAvatar,


	//admin 
	topCustomer
};
