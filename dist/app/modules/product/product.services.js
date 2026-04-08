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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productServices = void 0;
const db_1 = require("../../../db/db");
const slugify_1 = __importDefault(require("slugify"));
const pagination_1 = require("../../../helpers/pagination");
const insertIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = (0, slugify_1.default)(payload.name, { lower: true });
    const res = yield db_1.prisma.product.create({
        data: Object.assign(Object.assign({}, payload), { slug }),
    });
    return res;
});
const getAllFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryCopy = Object.assign({}, query);
    const excludedField = ["sortby", "orderBy", "page", "limit"];
    excludedField.forEach((field) => delete queryCopy[field]);
    const { search, price } = queryCopy, others = __rest(queryCopy, ["search", "price"]);
    const { limit, skip, page } = (0, pagination_1.pagination)(Number(query.page), Number(query.limit));
    const andConditions = [];
    if (search) {
        andConditions.push({
            OR: ["name"].map((value) => ({
                [value]: {
                    contains: queryCopy.search,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (price) {
        const splitedValue = queryCopy.price.split(",");
        andConditions.push({
            OR: [
                {
                    price: {
                        gte: Number(splitedValue[0]),
                        lte: Number(splitedValue[1]),
                    },
                },
            ],
        });
    }
    // Handle other filters
    if (Object.keys(others).length > 0) {
        andConditions.push({
            OR: Object.keys(others).map((key) => ({
                [key]: {
                    in: decodeURIComponent(others[key]).split(","),
                },
            })),
        });
    }
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = { AND: andConditions };
    const total = yield db_1.prisma.product.count({ where: whereConditions });
    const totalPages = Math.ceil(total / limit);
    const result = yield db_1.prisma.product.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: query.orderBy
            ? {
                price: query.orderBy,
            }
            : {
                createdAt: "asc",
            },
    });
    const meta = {
        page,
        totalPages,
        total,
    };
    return {
        meta,
        result,
    };
});
// get by id
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.product.findUniqueOrThrow({
        where: {
            id,
        },
    });
    return res;
});
//get by slug
const getBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.product.findUniqueOrThrow({
        where: {
            slug: slug,
        },
        include: {
            reviews: {
                include: {
                    user: {
                        select: {
                            name: true,
                            avatar: true,
                        },
                    },
                },
            },
        },
    });
    return res;
});
const updateIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.product.update({
        where: {
            id: id,
        },
        data: payload,
    });
    return res;
});
const deleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.product.delete({
        where: {
            id: id,
        },
    });
    return res;
});
const softDeleteFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield db_1.prisma.product.update({
        where: {
            id: id,
        },
        data: {
            isDeleted: true,
        },
    });
    return res;
});
const relatedProduct = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const currentProduct = yield db_1.prisma.product.findUniqueOrThrow({
        where: { slug },
    });
    const minPrice = currentProduct.price * 0.8; // 20% below the current product's price
    const maxPrice = currentProduct.price * 1.5; // 50% above the current product's price
    const res = yield db_1.prisma.product.findMany({
        where: {
            price: { gte: minPrice, lte: maxPrice },
            slug: { not: slug },
        },
        take: 8,
    });
    return res;
});
exports.productServices = {
    insertIntoDB,
    getAllFromDB,
    getById,
    getBySlug,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB,
    relatedProduct,
};
