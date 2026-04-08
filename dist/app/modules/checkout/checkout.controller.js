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
exports.checkoutController = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const checkout_services_1 = require("./checkout.services");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const makeCheckout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield checkout_services_1.checkoutServices.makeCheckout(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        message: "Payment has been received successfully",
        data: result,
    });
}));
exports.checkoutController = { makeCheckout };
