"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const books_1 = require("../../controllers/books");
const booksRouter = express_1.default.Router();
booksRouter.get("", books_1.getBooks);
exports.default = booksRouter;
