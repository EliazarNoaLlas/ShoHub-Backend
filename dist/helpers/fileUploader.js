"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
// import { CloudinaryStorage } from "multer-storage-cloudinary";
const config_1 = __importDefault(require("../config"));
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
    cloud_name: config_1.default.cloudinary.name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret,
    secure: true,
});
const storage = new CloudinaryStorage({});
exports.fileUploader = multer({ storage: storage });
