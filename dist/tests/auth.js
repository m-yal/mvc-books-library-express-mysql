"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../index");
exports.default = describe(`Auth tests`, function () {
    it(`should return "login"`, function (done) {
        (0, supertest_1.default)(index_1.app)
            .post("/auth/login")
            .expect("login")
            .end(done);
    });
    it(`should return "logout"`, function (done) {
        (0, supertest_1.default)(index_1.app)
            .post("/auth/logout")
            .expect("logout")
            .end(done);
    });
});
