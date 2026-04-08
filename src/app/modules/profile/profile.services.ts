import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../../db/db";


const profile = async (payload: JwtPayload) => {
	const aboutMe = await prisma.user.findUniqueOrThrow({
		where: {
			email: payload.email,
			id: payload.id,
		},
		select: {
			id:true,
			name:true,
			email:true,
			phone:true,
			role:true,
			avatar:true,
			address: true,
			orders: true,
			createdAt:true,
			updatedAt:true,
		},
	});

	
	return aboutMe;
};

export const profileServices = { profile };
