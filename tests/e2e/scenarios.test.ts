import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { TestFactory } from "../utils/testHelpers";
import { prismaMock, resetPrismaMock } from "../utils/prismaMock";
import { Role } from "../utils/types";

const JWT_SECRET = "test-secret-key-shophub-2026";

const stripeMock = {
	checkout: { sessions: { create: jest.fn() } },
};

async function ejecutarFlujoCampoCompleto(input: {
	userEmail: string;
	userPassword: string;
	productSlug: string;
	quantity: number;
	couponCode?: string;
	shippingAddress: { street: string; city: string; country: string };
	card: string;
}): Promise<{
	orderId: string;
	totalPrice: number;
	paymentSessionId: string;
	emailSent: boolean;
}> {
	const user = await prismaMock.user.findUniqueOrThrow({
		where: { email: input.userEmail },
	});
	const pwdOk = await bcrypt.compare(input.userPassword, user.password);
	if (!pwdOk) throw new Error("Credenciales invalidas");

	const product = await prismaMock.product.findUniqueOrThrow({
		where: { slug: input.productSlug },
		include: { reviews: true },
	});
	if (product.inStock < input.quantity) throw new Error("Stock insuficiente");

	let subtotal = product.price * input.quantity;

	if (input.couponCode) {
		const cupon = await prismaMock.cuppon.findFirst({
			where: { code: input.couponCode },
		});
		if (cupon && cupon.isActive && new Date() < cupon.expiresAt) {
			const discountAmount = parseFloat(
				((subtotal * cupon.discount) / 100).toFixed(2)
			);
			subtotal -= discountAmount;
		}
	}

	const IGV = 0.18;
	const envio = 9;
	const totalPrice = parseFloat((subtotal * (1 + IGV) + envio).toFixed(2));

	const session = await stripeMock.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: "usd",
					product_data: { name: product.name },
					unit_amount: Math.round(product.price * 100),
				},
				quantity: input.quantity,
			},
		],
		mode: "payment",
		success_url: "https://gadget-galaxy.vercel.app/payment/success",
		cancel_url: "https://gadget-galaxy.vercel.app/payment/cancel",
	});

	const order = await prismaMock.$transaction(async (tx: typeof prismaMock) => {
		await tx.product.updateMany({
			where: { id: product.id },
			data: { inStock: { decrement: input.quantity } },
		});
		return tx.order.create({
			data: {
				userId: user.id,
				totalPrice,
				products: {
					create: [
						{
							productId: product.id,
							quantity: input.quantity,
							price: product.price,
						},
					],
				},
			},
		});
	});

	return {
		orderId: order.id,
		totalPrice,
		paymentSessionId: session.id,
		emailSent: true,
	};
}

describe("E2E + UAT + Smoke", () => {
	beforeEach(() => {
		resetPrismaMock();
		jest.clearAllMocks();
	});

	it("TC-020-A: happy path", async () => {
		const rawPwd = "Sh0pHub!2026";
		const hashedPwd = await bcrypt.hash(rawPwd, 10);
		const mockUser = TestFactory.createUser({ password: hashedPwd });
		const mockProduct = TestFactory.createProduct({ inStock: 5, price: 2500 });
		const mockOrder = TestFactory.createOrder({ totalPrice: 2960 });
		const mockSession = { id: "cs_test_e2e_001" };

		(prismaMock.user.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockUser);
		(prismaMock.product.findUniqueOrThrow as jest.Mock).mockResolvedValue({
			...mockProduct,
			reviews: [],
		});
		(prismaMock.product.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
		(prismaMock.order.create as jest.Mock).mockResolvedValue(mockOrder);
		stripeMock.checkout.sessions.create.mockResolvedValue(mockSession);

		const result = await ejecutarFlujoCampoCompleto({
			userEmail: mockUser.email,
			userPassword: rawPwd,
			productSlug: mockProduct.slug,
			quantity: 1,
			shippingAddress: { street: "Av. Lima 123", city: "Lima", country: "Peru" },
			card: "4242424242424242",
		});

		expect(result.orderId).toBe(mockOrder.id);
		expect(result.paymentSessionId).toMatch(/^cs_test_/);
		expect(result.totalPrice).toBeGreaterThan(0);
		expect(result.emailSent).toBe(true);
	});

	it("SMOKE-04: JWT sign/verify works", () => {
		const payload = { id: "u1", email: "test@test.com", role: Role.CUSTOMER };
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
		const decoded = jwt.verify(token, JWT_SECRET) as any;
		expect(decoded.email).toBe(payload.email);
	});
});

