import { pagination } from "../../../src/helpers/pagination";

describe("helpers/pagination", () => {
	it("returns defaults when inputs are falsy", () => {
		const res = pagination(0 as unknown as number, 0 as unknown as number);
		expect(res).toEqual({ page: 1, limit: 18, skip: 0 });
	});

	it("calculates skip correctly", () => {
		const res = pagination(3, 10);
		expect(res).toEqual({ page: 3, limit: 10, skip: 20 });
	});
});

