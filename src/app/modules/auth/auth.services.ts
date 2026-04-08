import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "@prisma/client";
import config from "../../../config";
import { prisma } from "../../../db/db";
import AppError from "../../../utils/appError";
import { sendEmail } from "../../../helpers/sendEmail";

type TLoginPayload = {
	email: string;
	password: string;
};

type TChangePasswordPayload = {
	user: JwtPayload;
	payload: {
		oldPassword: string;
		newPassword: string;
	};
};
type TResetPasswordPaylod = {
	id: string;
	token: string;
	payload: {
		password: string;
		confirmPassword: string;
	};
};
type TForgotPasswordRequest = {
	email: string;
};
const register = async (payload: User) => {
	//hash password
	const hashPassword = await bcrypt.hash(
		payload.password,
		Number(config.salt_round)
	);

	//create user
	const user = await prisma.user.create({
		data: {
			...payload,
			password: hashPassword,
		},
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			avatar: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return user;
};

const login = async (payload: TLoginPayload) => {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			email: payload.email,
		},
	});
	const correctPass = await bcrypt.compare(payload.password, user.password);

	if (!correctPass) {
		throw new AppError(400, "Invalid credentials");
	}

	const token = {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	} as JwtPayload;

	const userToken = jwt.sign(token, config.jwt_secret as string, {
		expiresIn: config.jwt_expires,
	});

	return {
		authToken: userToken,
		avatar: user.avatar,
	};
};

const changePassword = async ({ payload, user }: TChangePasswordPayload) => {
	//check new password and old password
	if (payload.oldPassword === payload.newPassword) {
		throw new AppError(400, "New password can't be current password!");
	}

	const userDetails = await prisma.user.findUniqueOrThrow({
		where: {
			email: user.email,
			id: user.id,
		},
	});

	const matchPassword = await bcrypt.compare(
		payload.oldPassword,
		userDetails.password
	);

	if (!matchPassword) {
		throw new AppError(400, "Your current password doesn't match");
	}

	const hashedPass = await bcrypt.hash(
		payload.newPassword,
		Number(config.salt_round)
	);

	await prisma.user.update({
		where: {
			id: user.id,
			email: user.email,
		},
		data: {
			password: hashedPass,
		},
	});
};

//forgot-password
const forgotPassword = async (payload: TForgotPasswordRequest) => {
	const user = await prisma.user.findUnique({
		where: {
			email: payload.email,
		},
	});

	if (!user) {
		throw new AppError(404, "User not found!");
	}
	const token = {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
	} as JwtPayload;

	const userToken = jwt.sign(token, config.jwt_secret as string, {
		expiresIn: "10m",
	});
	const resetUiLink = `${config.domain_url}/reset-password?id=${user.id}&token=${userToken}`;
	try {
		const res = await sendEmail(user.email, resetUiLink);
		return res;
	} catch (error) {
		throw new AppError(400, "Something went wrong!");
	}
};

const resetPassword = async ({ id, token, payload }: TResetPasswordPaylod) => {
	if (!id || !token) {
		throw new AppError(400, "ID or Token is not valid");
	}

	if (payload.password !== payload.confirmPassword) {
		throw new AppError(400, "Sorry, Password doesn't match");
	}

	const decodedUser = jwt.verify(
		token,
		config.jwt_secret as string
	) as JwtPayload;

	await prisma.user.findUniqueOrThrow({
		where: { id: decodedUser?.id },
	});

	//hash password
	const hashPassword = await bcrypt.hash(
		payload.password,
		Number(config.salt_round)
	);

	await prisma.user.update({
		where: {
			id,
		},
		data: {
			password: hashPassword,
		},
	});
};

export const authServices = {
	register,
	login,
	forgotPassword,
	changePassword,
	resetPassword,
};
