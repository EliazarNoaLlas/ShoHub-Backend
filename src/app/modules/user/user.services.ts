import { User } from "@prisma/client";
import { prisma } from "../../../db/db";


const getAllFromDB = async () => {
	const user = await prisma.user.findMany({
		select: {
			avatar: true,
			id: true,
			email: true,
			name: true,
			orders: true,
			role: true,
			updatedAt: true,
			address: true,
			createdAt: true,
		},
	});
	// const withoutPass = exclude(user, ["password",""])
	return user;
};

const getById = async (id: string) => {
	const singleUser = await prisma.user.findUniqueOrThrow({
		where: {
			id: id,
		},
		select:{
			id:true,
			name:true,
			email:true,
			phone:true,
			role:true,
			avatar:true,
			createdAt:true,
			updatedAt:true,

		}
	});

	return singleUser;
};

const updateIntoDB = async (id: string, payload: User) => {
	const user = await prisma.user.update({
		where: {
			id: id,
		},
		data: payload,
		select:{
			id:true,
			name:true,
			email:true,
			phone:true,
			role:true,
			avatar:true,
			createdAt:true,
			updatedAt:true,
		}
	});

	return user;
};

const deleteFromDB = async (id: string) => {
	const res = await prisma.user.delete({
		where: {
			id: id,
		},
	});

	return res;
};
const updateUserAvatar = async(id:string, payload:{avatar:string})=>{
	const res = await prisma.user.update({
		where:{
			id:id
		},
		data:{
			avatar: payload.avatar
		},select:{
			avatar:true,
			id:true,
			
		}
	});

	return res;
}


//admin can see top customer
const topCustomer = async()=>{
		const res = await prisma.user.findMany({
			where:{
				orders:{
					some:{}
				},
			},
			select:{
				name: true,
				email: true,
				
			},
			orderBy:{
				createdAt: "desc"
			},
			take:10			
		});
	return res;
}


export const userServices = {
	getAllFromDB,
	getById,
	updateIntoDB,
	deleteFromDB,
	updateUserAvatar,
	topCustomer
};
