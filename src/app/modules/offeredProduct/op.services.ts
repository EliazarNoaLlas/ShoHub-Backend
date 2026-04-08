import { HotOffers } from "@prisma/client";
import { prisma } from "../../../db/db";
import AppError from "../../../utils/appError";

const insertIntoDB = async (payload: HotOffers) => {
	

	const res = await prisma.$transaction(async(tx)=>{


		const product = await tx.product.findUniqueOrThrow({
			where:{id:payload.productId}
		});

		const discountPrice = product.price * (payload.discount / 100);
		const finalPrice = Math.ceil(product.price - discountPrice);

		const findProduct = await tx.hotOffers.findFirst({
			where:{
				productId: product.id
			}
		});

		if(!findProduct){

			const offerPorduct = await tx.hotOffers.create({
				data:{
					...payload,
					price: finalPrice
				}
			})
			return offerPorduct;
		}else{
			throw new AppError(400,"Product already exists in offer lists!")
		}
	});

	return res;
};

const getAllFromDB = async () => {
	const res = await prisma.hotOffers.findMany({where:{
		product:{
			isDeleted:false
		}
	},include:{
		product:true
	}});
	return res;
};

const getById = async (id: string) => {
	const res = await prisma.hotOffers.findUniqueOrThrow({
		where: {
			id
		},
		include:{
			product:{
				include:{
					reviews:true
				}
			},
			
		}
	});

	return res;
};

const updateIntoDB = async (id: string, payload: HotOffers) => {
	const res = await prisma.hotOffers.update({
		where: {
			id: id,
		},
		data: payload,
	});

	return res;
};

const deleteFromDB = async (id: string) => {
	const res = await prisma.hotOffers.delete({
		where: {
			id: id,
		},
	});

	return res;
};

export const opServices = {
	insertIntoDB,
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,
};
