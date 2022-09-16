"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
exports.default = describe(`Book instanse page tests`, function () {
    it(`should return input book id received from url params`, function (done) {
        (0, supertest_1.default)(index_1.app)
            .get("/books/101")
            .expect("101")
            .end(done);
    });
});
