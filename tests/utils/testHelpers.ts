import { Role } from "./types";

export interface MockUser {
	id: string;
	name: string;
	email: string;
	password: string;
	phone: string;
	role: Role;
	avatar: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface MockProduct {
	id: string;
	name: string;
	slug: string;
	description: string;
	price: number;
	regularPrice: number;
	inStock: number;
	photo: string;
	isDeleted: boolean;
	rating: number;
	brand: string;
	processor_type: string;
	processor_model: string;
	generation: string;
	display: string;
	display_size: string;
	display_type: string;
	ram: string;
	ram_type: string;
	hdd?: string;
	ssd: string;
	graphics: string;
	operating_system: string;
	features: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface MockOrderedProduct {
	id: string;
	orderId: string;
	productId: string;
	quantity: number;
	price: number;
}

export interface MockOrder {
	id: string;
	userId: string;
	totalPrice: number;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	products: MockOrderedProduct[];
}

export interface MockCuppon {
	id: string;
	code: string;
	discount: number;
	isActive: boolean;
	expiresAt: Date;
	minAmount?: number;
}

export interface MockReview {
	id: string;
	userId: string;
	productId: string;
	rating: number;
	message: string;
	createdAt: Date;
	updatedAt: Date;
}

export const TestFactory = {
	createUser(overrides: Partial<MockUser> = {}): MockUser {
		return {
			id: "user-001",
			name: "Juan Perez",
			email: "test@example.com",
			password: "$2b$10$hashedpassword",
			phone: "+51999888777",
			role: Role.CUSTOMER,
			avatar: null,
			createdAt: new Date("2026-01-01T00:00:00.000Z"),
			updatedAt: new Date("2026-01-01T00:00:00.000Z"),
			...overrides,
		};
	},

	createAdminUser(overrides: Partial<MockUser> = {}): MockUser {
		return TestFactory.createUser({
			id: "admin-001",
			name: "Admin ShopHub",
			email: "admin@shophub.com",
			role: Role.ADMIN,
			...overrides,
		});
	},

	createProduct(overrides: Partial<MockProduct> = {}): MockProduct {
		return {
			id: "prod-001",
			name: "Laptop HP Pavilion",
			slug: "laptop-hp-pavilion",
			description: "Laptop HP Pavilion con procesador Intel Core i5",
			price: 2500.0,
			regularPrice: 2800.0,
			inStock: 10,
			photo: "https://example.com/laptop-hp.jpg",
			isDeleted: false,
			rating: 4.5,
			brand: "HP",
			processor_type: "Intel",
			processor_model: "Core i5-1235U",
			generation: "12th Gen",
			display: "FHD IPS",
			display_size: "15.6",
			display_type: "IPS",
			ram: "16GB",
			ram_type: "DDR4",
			hdd: undefined,
			ssd: "512GB NVMe",
			graphics: "Intel Iris Xe",
			operating_system: "Windows 11 Home",
			features: ["Backlit Keyboard", "Fingerprint Reader", "Wi-Fi 6"],
			createdAt: new Date("2026-01-01T00:00:00.000Z"),
			updatedAt: new Date("2026-01-01T00:00:00.000Z"),
			...overrides,
		};
	},

	createOutOfStockProduct(): MockProduct {
		return TestFactory.createProduct({
			id: "prod-out",
			name: "Laptop Sin Stock",
			slug: "laptop-sin-stock",
			inStock: 0,
		});
	},

	createDeletedProduct(): MockProduct {
		return TestFactory.createProduct({
			id: "prod-del",
			isDeleted: true,
		});
	},

	createOrder(overrides: Partial<MockOrder> = {}): MockOrder {
		return {
			id: "order-001",
			userId: "user-001",
			totalPrice: 2500.0,
			status: "PENDING",
			createdAt: new Date("2026-03-01T00:00:00.000Z"),
			updatedAt: new Date("2026-03-01T00:00:00.000Z"),
			products: [
				{
					id: "op-001",
					orderId: "order-001",
					productId: "prod-001",
					quantity: 1,
					price: 2500.0,
				},
			],
			...overrides,
		};
	},

	createCuppon(overrides: Partial<MockCuppon> = {}): MockCuppon {
		return {
			id: "cup-001",
			code: "SAVE20",
			discount: 20,
			isActive: true,
			expiresAt: new Date("2027-12-31T00:00:00.000Z"),
			...overrides,
		};
	},

	createExpiredCuppon(): MockCuppon {
		return TestFactory.createCuppon({
			id: "cup-exp",
			code: "EXPIRED10",
			expiresAt: new Date("2025-01-01T00:00:00.000Z"),
		});
	},

	createReview(overrides: Partial<MockReview> = {}): MockReview {
		return {
			id: "rev-001",
			userId: "user-001",
			productId: "prod-001",
			rating: 4,
			message: "Excelente producto, muy recomendado para el trabajo",
			createdAt: new Date("2026-02-01T00:00:00.000Z"),
			updatedAt: new Date("2026-02-01T00:00:00.000Z"),
			...overrides,
		};
	},
};

export const JWT_SECRET_TEST = "test-secret-key-shophub-2026";

export function buildJwtPayload(user: MockUser) {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};
}

export const STRIPE_TEST_CARDS = {
	success: "4242424242424242",
	insufficientFunds: "4000000000009995",
	declined: "4000000000000002",
	expired: "4000000000000069",
};

export const HTTP = {
	OK: 200,
	CREATED: 201,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	CONFLICT: 302,
	INTERNAL: 500,
} as const;

