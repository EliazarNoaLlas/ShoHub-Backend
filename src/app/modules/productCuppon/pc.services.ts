import {  Cuppon } from "@prisma/client";
import { prisma } from "../../../db/db";

const insertIntoDB = async (payload: Cuppon) => {
	const res = await prisma.cuppon.create({
		data: payload,
	});

	return res;
};

const getAllFromDB = async () => {
	const res = await prisma.cuppon.findMany();
	return res;
};

const getById = async (id: string) => {
	const res = await prisma.cuppon.findUnique({
		where: {
			id: id,
		},
	});

	return res;
};

const updateIntoDB = async (id: string, payload: Cuppon) => {
	const res = await prisma.cuppon.update({
		where: {
			id: id,
		},
		data: payload,
	});

	return res;
};

const deleteFromDB = async (id: string) => {
	const res = await prisma.cuppon.delete({
		where: {
			id: id,
		},
	});

	return res;
};

export const pcServices = {
	insertIntoDB,
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,
};
