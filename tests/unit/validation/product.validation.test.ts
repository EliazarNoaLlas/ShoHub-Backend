import { productValidation } from "../../../src/app/modules/product/product.validation";

describe("product.validation", () => {
	it("accepts a valid product payload", async () => {
		const payload = {
			name: "Laptop Gamer Pro 15",
			description: "High performance laptop",
			price: 1200,
			regularPrice: 1500,
			inStock: 10,
			photo: "https://example.com/photo.jpg",
			isDeleted: false,
			rating: 0,
			brand: "BrandX",
			processor_type: "Intel",
			processor_model: "i7",
			generation: "13th",
			display: "FHD",
			display_size: "15.6",
			display_type: "IPS",
			ram: "16GB",
			ram_type: "DDR5",
			hdd: "1TB",
			ssd: "512GB",
			graphics: "RTX 4060",
			operating_system: "Windows 11",
			features: ["wifi", "bluetooth"],
		};

		await expect(productValidation.createProduct.parseAsync(payload)).resolves.toBeTruthy();
	});

	it("rejects invalid product payload", async () => {
		const payload = { name: "abc" };
		await expect(productValidation.createProduct.parseAsync(payload as any)).rejects.toBeTruthy();
	});
});

