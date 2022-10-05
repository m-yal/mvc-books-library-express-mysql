"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookRouter = void 0;
const express_1 = __importDefault(require("express"));
const book_1 = require("../../controllers/book");
exports.bookRouter = express_1.default.Router();
exports.bookRouter.get("/books/:bookId", book_1.getBook);
exports.bookRouter.post("/books/:bookId", book_1.wantBook);
