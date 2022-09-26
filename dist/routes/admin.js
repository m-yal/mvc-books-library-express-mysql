"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const adminRouter = express_1.default.Router();
adminRouter.delete("/books/:bookId", admin_1.deleteBook);
adminRouter.get("/books", admin_1.getBooks);
adminRouter.get("/books/:bookId", admin_1.getBook);
exports.default = adminRouter;
