import { Address } from "@prisma/client";
import { prisma } from "../../../db/db";
import { JwtPayload } from "jsonwebtoken";




const getAllFromDB = async () => {
	const res = await prisma.address.findMany();
	return res;
};

const getById = async (id: string) => {
	const res = await prisma.address.findUniqueOrThrow({
		where: {
			userId: id,
		},
	});

	return res;
};

const updateIntoDB = async (id: string, payload: Address) => {

	const res = await prisma.address.upsert({
		where:{
			userId: id,
		},
		update: payload,
		create:{
			...payload,
			userId: id
		}
	});

	return res;
};



export const addressServices = {
	getAllFromDB,
	getById,
	updateIntoDB,
};
