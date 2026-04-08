import { TestFactory } from "../utils/testHelpers";
import { prismaMock, resetPrismaMock } from "../utils/prismaMock";

async function crearOrden(
	items: Array<{ productId: string; quantity: number; price: number }>
) {
	return prismaMock.$transaction(async (tx: typeof prismaMock) => {
		for (const item of items) {
			const product = await tx.product.findUniqueOrThrow({
				where: { id: item.productId },
			});

			if (product.inStock < item.quantity) {
				throw new Error("Sorry, insuficient stock!");
			}

			await tx.product.updateMany({
				where: { id: item.productId },
				data: { inStock: { decrement: item.quantity } },
			});
		}

		const order = await tx.order.create({
			data: {
				totalPrice: items.reduce((s, i) => s + i.price * i.quantity, 0),
				products: { create: items },
			},
		});

		return order;
	});
}

async function crearReview(payload: {
	productId: string;
	userId: string;
	rating: number;
	message: string;
}) {
	return prismaMock.$transaction(async (tx: typeof prismaMock) => {
		const product = await tx.product.findUniqueOrThrow({
			where: { id: payload.productId },
			include: { reviews: true },
		});

		const newReviewCount = product.reviews.length + 1;
		const totalRating = product.reviews.reduce(
			(sum: number, r: { rating: number }) => sum + r.rating,
			payload.rating
		);
		const newRating = totalRating / newReviewCount;

		const review = await tx.review.create({ data: payload });
		await tx.product.update({
			where: { id: payload.productId },
			data: { rating: newRating },
		});
		return review;
	});
}

function calcularPrecioOferta(precioOriginal: number, discountPct: number): number {
	const descuento = precioOriginal * (discountPct / 100);
	return Math.ceil(precioOriginal - descuento);
}

async function obtenerMetadata() {
	const orders = await prismaMock.order.count();
	const price = await prismaMock.order.aggregate({ _sum: { totalPrice: true } });
	const products = await prismaMock.product.count();
	return {
		totalSales: price._sum.totalPrice,
		orders,
		products,
	};
}

describe("ORDER / REVIEW / OFFERS - Unit Tests", () => {
	beforeEach(() => resetPrismaMock());

	describe("crearOrden()", () => {
		it("creates order and decrements stock", async () => {
			const mockProduct = TestFactory.createProduct({ inStock: 5 });
			const mockOrder = TestFactory.createOrder();

			(prismaMock.product.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockProduct);
			(prismaMock.product.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
			(prismaMock.order.create as jest.Mock).mockResolvedValue(mockOrder);

			const result = await crearOrden([
				{ productId: "prod-001", quantity: 2, price: 2500 },
			]);

			expect(result).toEqual(mockOrder);
			expect(prismaMock.product.updateMany).toHaveBeenCalledWith({
				where: { id: "prod-001" },
				data: { inStock: { decrement: 2 } },
			});
		});

		it("throws on insufficient stock", async () => {
			const mockProduct = TestFactory.createProduct({ inStock: 1 });
			(prismaMock.product.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockProduct);

			await expect(
				crearOrden([{ productId: "prod-001", quantity: 5, price: 2500 }])
			).rejects.toThrow("Sorry, insuficient stock!");
		});
	});

	describe("crearReview()", () => {
		it("updates product rating average", async () => {
			const mockProduct = TestFactory.createProduct({ rating: 3 });
			(mockProduct as any).reviews = [{ rating: 3 }, { rating: 5 }];

			(prismaMock.product.findUniqueOrThrow as jest.Mock).mockResolvedValue(mockProduct);
			(prismaMock.review.create as jest.Mock).mockResolvedValue(
				TestFactory.createReview({ rating: 4 })
			);
			(prismaMock.product.update as jest.Mock).mockResolvedValue({});

			await crearReview({
				productId: "prod-001",
				userId: "user-002",
				rating: 4,
				message: "Buena calidad",
			});

			const updateCall = (prismaMock.product.update as jest.Mock).mock.calls[0][0];
			expect(updateCall.data.rating).toBeCloseTo(4, 5);
		});
	});

	describe("calcularPrecioOferta()", () => {
		it("2500 with 20% => 2000", () => {
			expect(calcularPrecioOferta(2500, 20)).toBe(2000);
		});
	});

	describe("obtenerMetadata()", () => {
		it("returns totals", async () => {
			(prismaMock.order.count as jest.Mock).mockResolvedValue(150);
			(prismaMock.order.aggregate as jest.Mock).mockResolvedValue({
				_sum: { totalPrice: 375000.0 },
			});
			(prismaMock.product.count as jest.Mock).mockResolvedValue(500);

			const result = await obtenerMetadata();

			expect(result.orders).toBe(150);
			expect(result.totalSales).toBe(375000.0);
			expect(result.products).toBe(500);
		});
	});
});

