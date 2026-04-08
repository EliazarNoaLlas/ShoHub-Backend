const createModelMock = () => ({
	findMany: jest.fn(),
	findUnique: jest.fn(),
	findUniqueOrThrow: jest.fn(),
	findFirst: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	updateMany: jest.fn(),
	upsert: jest.fn(),
	delete: jest.fn(),
	deleteMany: jest.fn(),
	count: jest.fn(),
	aggregate: jest.fn(),
});

export type PrismaMockClient = {
	user: ReturnType<typeof createModelMock>;
	product: ReturnType<typeof createModelMock>;
	order: ReturnType<typeof createModelMock>;
	orderedProduct: ReturnType<typeof createModelMock>;
	address: ReturnType<typeof createModelMock>;
	review: ReturnType<typeof createModelMock>;
	cuppon: ReturnType<typeof createModelMock>;
	hotOffers: ReturnType<typeof createModelMock>;
	featuredProduct: ReturnType<typeof createModelMock>;
	$transaction: jest.Mock;
	$disconnect: jest.Mock;
};

export const prismaMock: PrismaMockClient = {
	user: createModelMock(),
	product: createModelMock(),
	order: createModelMock(),
	orderedProduct: createModelMock(),
	address: createModelMock(),
	review: createModelMock(),
	cuppon: createModelMock(),
	hotOffers: createModelMock(),
	featuredProduct: createModelMock(),

	$transaction: jest.fn(),
	$disconnect: jest.fn(),
};

export function resetPrismaMock() {
	Object.values(prismaMock).forEach((model) => {
		if (typeof model !== "object" || model === null) return;
		Object.values(model).forEach((fn) => {
			if (typeof fn === "function" && (fn as jest.Mock).mockReset) {
				(fn as jest.Mock).mockReset();
			}
		});
	});

	(prismaMock.$transaction as jest.Mock).mockImplementation(
		(fn: (tx: PrismaMockClient) => unknown) => fn(prismaMock)
	);
}
