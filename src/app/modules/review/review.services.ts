import { Review } from "@prisma/client";
import { prisma } from "../../../db/db";

const insertIntoDB = async (payload: Review) => {
	const result = await prisma.$transaction(async(tx)=>{

		const product = await tx.product.findUniqueOrThrow({
			where:{
				id: payload.productId as string
			},
			include:{
				reviews:true,
			}
		})


		const newReviewCount = product.reviews.length + 1;
		const totalRating = product.reviews.reduce((sum, review)=> sum + review.rating, payload.rating);
		const newRating = totalRating/newReviewCount;


		const review = await tx.review.create({
			data: payload,
		});

		 await tx.product.update({
			where:{
				id: payload.productId as string
			},
			data:{
				rating: newRating
			}
		})

		return review;

	})

	return result;
};

const getAllFromDB = async () => {
	const res = await prisma.review.findMany({include:{
		product:{
			select:{
				name: true,
			}
		},
		user:{
			select:{
				name:true
			}
		}
	}});
	return res;
};


const getById = async (id: string) => {
	const res = await prisma.review.findMany({
		where: {
			id: id,
		},
	});

	return res;
};

const updateIntoDB = async (id: string, payload: Review) => {
	const res = await prisma.review.update({
		where: {
			id: id,
		},
		data: payload,
	});

	return res;
};

const deleteFromDB = async (id: string) => {
	const res = await prisma.review.delete({
		where: {
			id: id,
		},
	});

	return res;
};

export const reviewServices = {
	insertIntoDB,
	getAllFromDB,
	
	getById,
	updateIntoDB,
	deleteFromDB,
};
