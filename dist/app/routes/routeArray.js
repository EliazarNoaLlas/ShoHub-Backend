"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeArray = void 0;
const user_route_1 = require("../modules/user/user.route");
const product_route_1 = require("../modules/product/product.route");
const order_route_1 = require("../modules/order/order.route");
const address_route_1 = require("../modules/address/address.route");
const auth_route_1 = require("../modules/auth/auth.route");
const profile_route_1 = require("../modules/profile/profile.route");
const op_route_1 = require("../modules/offeredProduct/op.route");
const fp_route_1 = require("../modules/featuredProduct/fp.route");
const checkout_route_1 = require("../modules/checkout/checkout.route");
const adminData_route_1 = require("../modules/adminData/adminData.route");
const review_route_1 = require("../modules/review/review.route");
exports.routeArray = [
    {
        path: "/user",
        route: user_route_1.userRoutes,
    },
    {
        path: "/address",
        route: address_route_1.addressRoutes,
    },
    {
        path: "/product",
        route: product_route_1.productRoutes,
    },
    {
        path: "/hot-offer",
        route: op_route_1.hotOffersRoutes,
    },
    {
        path: "/featured-product",
        route: fp_route_1.featuredProductRoutes,
    },
    {
        path: "/order",
        route: order_route_1.orderRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/profile",
        route: profile_route_1.profileRoutes,
    },
    {
        path: "/checkout",
        route: checkout_route_1.checkoutRoutes,
    },
    {
        path: "/review",
        route: review_route_1.reviewRoutes
    },
    {
        path: "/meta-data",
        route: adminData_route_1.adminDataRoutes,
    },
];
