// import { CloudinaryStorage } from "multer-storage-cloudinary";
import envConfig from "../config";
// import { v2 as cloudinary } from "cloudinary";
// import multer from "multer";
// import { Request, Response } from "express";

// const storage = multer.diskStorage({

// 	destination: function (req, file, cb) {
// 		console.log(process.cwd());
// 		cb(null, process.cwd() + "/uploads/");
// 	},
// 	filename: function (req, file, cb) {
// 		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
// 		cb(null, file.fieldname + "-" + uniqueSuffix);
// 	},
// });

const cloudinary = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const multer = require("multer");

cloudinary.config({
	cloud_name: envConfig.cloudinary.name,
	api_key: envConfig.cloudinary.api_key,
	api_secret: envConfig.cloudinary.api_secret,
	secure: true,
});

const storage = new CloudinaryStorage({

});

export const fileUploader = multer({ storage: storage });
