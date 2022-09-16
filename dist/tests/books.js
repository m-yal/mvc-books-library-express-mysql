"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
const assert_1 = __importDefault(require("assert"));
exports.default = describe(`Books list page tests`, function () {
    const offset = ["20", "10", "50"];
    const search = ["Clean code", "Some book", "Java for dummies"];
    const author = ["Uncle Bob", "Unknown author", "Some programmer"];
    const year = ["1995", "2000", "2012"];
    for (let i = 0; i < offset.length; i++) {
        it(`should return received from url params`, function (done) {
            const queryStr = `/?offset=${offset[i]}&search=${search[i]}&author=${author[i]}&year=${year[i]}`;
            (0, supertest_1.default)(index_1.app)
                .get(queryStr)
                .expect(function (res) {
                assert_1.default.deepEqual(res.body, {
                    offset: offset[i],
                    search: search[i],
                    author: author[i],
                    year: year[i]
                });
            })
                .end(done);
        });
    }
});
