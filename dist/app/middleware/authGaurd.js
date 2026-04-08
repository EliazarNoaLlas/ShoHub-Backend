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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../db/db");
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../utils/appError"));
const authGaurd = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new appError_1.default(401, "You are not authorized");
            }
            const decodedInfo = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
            const { email, id, role } = decodedInfo;
            const user = yield db_1.prisma.user.findUniqueOrThrow({
                where: {
                    email: email,
                    id: id,
                },
            });
            if (!user) {
                throw new appError_1.default(401, "User not found!");
            }
            if (roles.length && !roles.includes(role)) {
                throw new appError_1.default(401, "You are not authorized");
            }
            req.user = decodedInfo;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = authGaurd;
