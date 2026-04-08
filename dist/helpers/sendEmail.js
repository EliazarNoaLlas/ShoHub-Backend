"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (to, link) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: config_1.default.node_env === "production" ? 465 : 587,
        secure: config_1.default.node_env === "production" ? true : false, // true for port 465, false for other ports
        auth: {
            user: config_1.default.emailUtils.email,
            pass: config_1.default.emailUtils.password,
        },
    });
    const info = yield transporter.sendMail({
        from: config_1.default.emailUtils.email, // sender address
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
    return info === null || info === void 0 ? void 0 : info.messageId;
});
exports.sendEmail = sendEmail;
