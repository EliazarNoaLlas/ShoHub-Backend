
import { userRoutes } from "../modules/user/user.route";
import { productRoutes } from "../modules/product/product.route";
import { orderRoutes } from "../modules/order/order.route";
import { addressRoutes } from "../modules/address/address.route";
import { authRoutes } from "../modules/auth/auth.route";
import { profileRoutes } from "../modules/profile/profile.route";

import { hotOffersRoutes } from "../modules/offeredProduct/op.route";
import { featuredProductRoutes } from "../modules/featuredProduct/fp.route";
import { checkoutRoutes } from "../modules/checkout/checkout.route";
import { adminDataRoutes } from "../modules/adminData/adminData.route";
import { reviewRoutes } from "../modules/review/review.route";

export const routeArray = [
	{
		path: "/user",
		route: userRoutes,
	},
	{
		path: "/address",
		route: addressRoutes,
	},
	{
		path: "/product",
		route: productRoutes,
	},
	{
		path: "/hot-offer",
		route: hotOffersRoutes,
	},
	{
		path: "/featured-product",
		route: featuredProductRoutes,
	},
	{
		path: "/order",
		route: orderRoutes,
	},
	{
		path: "/auth",
		route: authRoutes,
	},
	{
		path: "/profile",
		route: profileRoutes,
	},
	{
		path: "/checkout",
		route: checkoutRoutes,
	},
	{
		path: "/review",
		route: reviewRoutes
	},
	{
		path: "/meta-data",
		route: adminDataRoutes,
	},
	
];
