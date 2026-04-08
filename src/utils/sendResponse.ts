import { Response } from "express";
type TMeta = {
	totalPages: number;
	page: number;
	
}
type TResponseData<T> = {
	statusCode: number;
	message: string;
	meta?: TMeta
	data: T;
};
const sendResponse = <T>(res: Response, obj: TResponseData<T>) => {
	res.status(obj.statusCode).json({
		success: true,
		message: obj.message,
		meta: obj.meta,
		result: obj.data,
	});
};
export default sendResponse;