import Stripe from "stripe";
import config from "../../../config";
type ProductPayload = {
    name:string;
    price:number;
    quantity:number;
}
const makeCheckout = async(payload: ProductPayload[] ) => {
    try {

        const lineItems = payload.map((pd: ProductPayload) => {
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
        const stripe = new Stripe(config.stripe_api_key as string)
        
        const session = await stripe.checkout.sessions.create({
            line_items:lineItems,
            mode: 'payment',
            success_url: `${config.domain_url}/payment/success`,
            cancel_url: `${config.domain_url}/payment/cancel`,
        });
        return {
            id: session.id
        }
    } catch (error) {
        console.log({error})
    }
};

export const checkoutServices = {makeCheckout}