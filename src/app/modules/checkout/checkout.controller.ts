import { Request, Response } from "express"
import catchAsync from "../../../utils/catchAsync"
import { checkoutServices } from "./checkout.services"
import sendResponse from "../../../utils/sendResponse";

const makeCheckout = catchAsync(async(req:Request,res:Response)=>{
    const result = await checkoutServices.makeCheckout(req.body);
    sendResponse(res, {
		statusCode: 201,
		message: "Payment has been received successfully",
		data: result,
	});
})

export const checkoutController = {makeCheckout}