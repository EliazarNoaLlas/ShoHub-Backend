"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = require("../../../src/helpers/pagination");
describe("helpers/pagination", () => {
    it("returns defaults when inputs are falsy", () => {
        const res = (0, pagination_1.pagination)(0, 0);
        expect(res).toEqual({ page: 1, limit: 18, skip: 0 });
    });
    it("calculates skip correctly", () => {
        const res = (0, pagination_1.pagination)(3, 10);
        expect(res).toEqual({ page: 3, limit: 10, skip: 20 });
    });
});
