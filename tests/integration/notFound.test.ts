import request from "supertest";
import app from "../../src/app";

describe("integration/notFound", () => {
	it("returns 404 for unknown route", async () => {
		const res = await request(app).get("/this-route-does-not-exist");
		expect(res.status).toBe(404);
		expect(res.body).toMatchObject({
			success: false,
			message: "Your requested path is not valid",
		});
	});
});

