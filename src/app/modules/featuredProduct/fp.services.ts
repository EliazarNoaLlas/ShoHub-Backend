import {  FeaturedProduct } from "@prisma/client";
import { prisma } from "../../../db/db";
import AppError from "../../../utils/appError";

const insertIntoDB = async (payload: FeaturedProduct) => {

	const result = await prisma.$transaction(async(tx)=>{
		
		// @ts-ignore
		const product = await tx.featuredProduct.findFirst({
			where:{
				productId: payload.productId
			}
		})
		if(product){
			throw new AppError(302,"Product already exists in featured lists!")
		}

		// @ts-ignore
		const data = await tx.featuredProduct.create({
			data:payload
		});
		return data;
	})

	return result;
};

const getAllFromDB = async () => {
	const res = await prisma.featuredProduct.findMany({where:{
		product:{
			isDeleted:false
		}
	},include:{
		product:true
	}});
	return res;
};

const getById = async (id: string) => {
	const res = await prisma.featuredProduct.findUnique({
		where: {
			id: id,
		},
	});

	return res;
};

const updateIntoDB = async (id: string, payload: FeaturedProduct) => {
	const res = await prisma.featuredProduct.update({
		where: {
			id: id,
		},
		data: payload,
	});

	return res;
};

const deleteFromDB = async (id: string) => {
	const res = await prisma.featuredProduct.delete({
		where: {
			id: id,
		},
	});

	return res;
};

export const fpServices = {
	insertIntoDB,
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,
};
