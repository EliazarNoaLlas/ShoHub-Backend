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
exports.authController = void 0;
const auth_services_1 = require("./auth.services");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const appError_1 = __importDefault(require("../../../utils/appError"));
const register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.authServices.register(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        message: "User registered successfully",
        data: result,
    });
}));
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.authServices.login(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Logged in successfully!",
        data: result,
    });
}));
//forgot password
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.authServices.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Reset link email has been sent",
        data: result,
    });
}));
//change password
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        throw new appError_1.default(401, "You are not authorized");
    }
    const result = yield auth_services_1.authServices.changePassword({
        payload: req.body,
        user: req.user,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Password changed successfully",
        data: result,
    });
}));
//reset-password
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, id } = req.query;
    const result = yield auth_services_1.authServices.resetPassword({
        id: id,
        token: token,
        payload: req.body,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: "Password reseted successfully",
        data: result,
    });
}));
exports.authController = {
    register,
    login,
    forgotPassword,
    changePassword,
    resetPassword,
};
