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
exports.checkoutServices = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../config"));
const makeCheckout = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lineItems = payload.map((pd) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: pd.name,
                    },
                    unit_amount: pd.price * 100,
                },
                quantity: pd.quantity,
            };
        });
        const stripe = new stripe_1.default(config_1.default.stripe_api_key);
        const session = yield stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `${config_1.default.domain_url}/payment/success`,
            cancel_url: `${config_1.default.domain_url}/payment/cancel`,
        });
        return {
            id: session.id
        };
    }
    catch (error) {
        console.log({ error });
    }
});
exports.checkoutServices = { makeCheckout };
