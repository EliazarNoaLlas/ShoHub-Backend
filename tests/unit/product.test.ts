import { z } from "zod";

function slugify(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function validarCupon(
	cupon: {
		code: string;
		discount: number;
		isActive: boolean;
		expiresAt: Date;
		minAmount?: number;
	},
	subtotal: number,
	fechaActual: Date = new Date()
): { valid: boolean; discount: number; message: string } {
	if (!cupon.isActive) {
		return { valid: false, discount: 0, message: "Cupon inactivo" };
	}
	if (fechaActual > cupon.expiresAt) {
		return { valid: false, discount: 0, message: "Cupon expirado" };
	}
	if (cupon.minAmount && subtotal < cupon.minAmount) {
		return {
			valid: false,
			discount: 0,
			message: `Monto minimo requerido: S/${cupon.minAmount}`,
		};
	}

	const discountAmount = parseFloat(
		((subtotal * cupon.discount) / 100).toFixed(2)
	);
	return {
		valid: true,
		discount: discountAmount,
		message: `Cupon aplicado: -S/${discountAmount.toFixed(2)}`,
	};
}

function calcularPrecioConIGV(subtotal: number, igv = 0.18): number {
	return parseFloat((subtotal * (1 + igv)).toFixed(2));
}

function calcularEnvio(pesoKg: number, esLima: boolean): number {
	const BASE_LIMA = 5;
	const BASE_PROVINCIA = 15;
	const RATE_POR_KG = 2;
	const base = esLima ? BASE_LIMA : BASE_PROVINCIA;
	return base + pesoKg * RATE_POR_KG;
}

function rangoRelacionados(precio: number): { min: number; max: number } {
	return { min: precio * 0.8, max: precio * 1.5 };
}

function pagination(page: number, limit: number) {
	const safePage = Math.max(1, page || 1);
	const safeLimit = Math.max(1, limit || 18);
	return { page: safePage, limit: safeLimit, skip: (safePage - 1) * safeLimit };
}

const createProductSchema = z.object({
	name: z.string().trim().min(5),
	description: z.string().min(1),
	price: z.number(),
	regularPrice: z.number(),
	inStock: z.number(),
	photo: z.string().url(),
	isDeleted: z.boolean().default(false),
	rating: z.number().default(0),
	brand: z.string(),
	processor_type: z.string(),
	processor_model: z.string(),
	generation: z.string(),
	display: z.string(),
	display_size: z.string(),
	display_type: z.string(),
	ram: z.string(),
	ram_type: z.string(),
	hdd: z.string().optional(),
	ssd: z.string(),
	graphics: z.string(),
	operating_system: z.string(),
	features: z.array(z.string()),
});

describe("PRODUCT - Unit Tests", () => {
	describe("validarCupon()", () => {
		const cupons = {
			SAVE20: {
				code: "SAVE20",
				discount: 20,
				isActive: true,
				expiresAt: new Date("2027-12-31T00:00:00.000Z"),
				minAmount: 100,
			},
			WELCOME10: {
				code: "WELCOME10",
				discount: 10,
				isActive: true,
				expiresAt: new Date("2027-12-31T00:00:00.000Z"),
			},
			INACTIVO: {
				code: "OLD50",
				discount: 50,
				isActive: false,
				expiresAt: new Date("2027-12-31T00:00:00.000Z"),
			},
			EXPIRADO: {
				code: "EXPIRED10",
				discount: 10,
				isActive: true,
				expiresAt: new Date("2025-01-01T00:00:00.000Z"),
			},
		};

		it("SAVE20 over 200 => 40.00", () => {
			const result = validarCupon(cupons.SAVE20, 200.0, new Date("2026-03-24"));
			expect(result.valid).toBe(true);
			expect(result.discount).toBe(40.0);
		});

		it("inactive coupon => rejected", () => {
			const result = validarCupon(
				cupons.INACTIVO,
				200.0,
				new Date("2026-03-24")
			);
			expect(result.valid).toBe(false);
			expect(result.discount).toBe(0);
		});

		it("expired coupon => rejected", () => {
			const result = validarCupon(
				cupons.EXPIRADO,
				200.0,
				new Date("2026-03-24")
			);
			expect(result.valid).toBe(false);
		});
	});

	describe("calcularPrecioConIGV()", () => {
		it("100 + 18% => 118.00", () => {
			expect(calcularPrecioConIGV(100)).toBe(118.0);
		});
	});

	describe("calcularEnvio()", () => {
		it("Lima 2kg => 9", () => {
			expect(calcularEnvio(2, true)).toBe(9);
		});
	});

	describe("slugify()", () => {
		it("simple name => slug", () => {
			expect(slugify("Laptop HP Pavilion")).toBe("laptop-hp-pavilion");
		});
	});

	describe("rangoRelacionados()", () => {
		it("2500 => [2000, 3750]", () => {
			const { min, max } = rangoRelacionados(2500);
			expect(min).toBe(2000);
			expect(max).toBe(3750);
		});
	});

	describe("pagination()", () => {
		it("page 2 limit 18 => skip 18", () => {
			const { skip } = pagination(2, 18);
			expect(skip).toBe(18);
		});
	});

	describe("createProductSchema", () => {
		const validProduct = {
			name: "Laptop HP Pavilion",
			description: "Excelente laptop para trabajo",
			price: 2500,
			regularPrice: 2800,
			inStock: 10,
			photo: "https://example.com/photo.jpg",
			brand: "HP",
			processor_type: "Intel",
			processor_model: "Core i5",
			generation: "12th Gen",
			display: "FHD IPS",
			display_size: "15.6",
			display_type: "IPS",
			ram: "16GB",
			ram_type: "DDR4",
			ssd: "512GB",
			graphics: "Intel Iris Xe",
			operating_system: "Windows 11",
			features: ["WiFi 6", "Backlit Keyboard"],
		};

		it("valid product => parse ok", () => {
			expect(() => createProductSchema.parse(validProduct)).not.toThrow();
		});

		it("name too short => throw", () => {
			expect(() => createProductSchema.parse({ ...validProduct, name: "PC" })).toThrow();
		});
	});
});

