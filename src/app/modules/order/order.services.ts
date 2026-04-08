import { Order, OrderedProduct } from "@prisma/client";
import { prisma } from "../../../db/db";
import AppError from "../../../utils/appError";

type TPayload = {
	items: OrderedProduct[];
} & Order;

const insertIntoDB = async (payload: TPayload) => {
	
	const {items, ...rest} = payload;
	
	try {
		
		const result = await prisma.$transaction(
			async (tx) => {
				for (const item of items) {
					const product = await tx.product.findUniqueOrThrow({
						where: {
							id: item.productId,
						},
					});

					if (!product) {
						throw new AppError(404, "Product not found!");
					}

					if (product.inStock < item.quantity) {
						throw new AppError(400, "Sorry, insuficient stock!");
					}

					await tx.product.updateMany({
						where: {
							id: item.productId,
						},
						data: {
							inStock: {
								decrement: item.quantity,
							},
						},
					});
				}

				const res = await tx.order.create({
					data: {
						...rest,
						products: {
							create: items.map((item: OrderedProduct) => ({
								...item,
							})),
						},
					},
				});

				return res;
				
			},
		);
		return result;
	} catch (error) {
		throw new AppError(500, "Something went wrong!")
	}
};

const getAllFromDB = async () => {
	const res = await prisma.order.findMany({
		orderBy:{
			createdAt:"desc"
		}
	});
	return res;
};

const getById = async (id: string) => {
	const res = await prisma.user.findUniqueOrThrow({
		where: {
			id: id,
		},
		select:{
			orders:{
				select:{
					id:true,
					totalPrice:true,
					createdAt:true,
					products:true
				}
			}
		}
	});

	return res;
};

const updateIntoDB = async (id: string, payload: Order) => {
	const res = await prisma.order.update({
		where: {
			id: id,
		},
		data: payload,
	});

	return res;
};

const deleteFromDB = async (id: string) => {
	const res = await prisma.order.delete({
		where: {
			id: id,
		},
	});

	return res;
};


// admin
const getLatestOrder = async () => {
	const res = await prisma.order.findMany({include:{
		user:{
			select: {
				email:true,
				name:true
			}
		},
		
	},take:5,orderBy:{
		createdAt:"desc"
	}});

	return res;
};
export const orderServices = {
	insertIntoDB,
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,

	//admin
	getLatestOrder,
};
