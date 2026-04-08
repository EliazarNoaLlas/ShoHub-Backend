import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, link: string) => {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: config.node_env === "production" ? 465 : 587,
		secure: config.node_env === "production" ? true : false, // true for port 465, false for other ports
		auth: {
			user: config.emailUtils.email,
			pass: config.emailUtils.password,
		},
	});

	const info = await transporter.sendMail({
		from: config.emailUtils.email, // sender address
		to, // list of receivers
		subject: "Reset Gadget Galaxy Password", // Subject line
		html: `
			<div>
				<p style='margin-bottom: "20px"'>
					<b>Reset your password within 10 minutes</b>
				</p>
				<a href=${link} >Click here to reset your password</a>
			</div>
		`,
	});
	return info?.messageId;
};
