"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../../controllers/admin");
const adminRouter = express_1.default.Router();
adminRouter.delete("/admin/books/:bookId", admin_1.deleteBook);
adminRouter.get("/admin/books", admin_1.getBooks);
adminRouter.get("/admin/books/:bookId", admin_1.getBook);
adminRouter.get("/admin/books/add", admin_1.addBook);
exports.default = adminRouter;
