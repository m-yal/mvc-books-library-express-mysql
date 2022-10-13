"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../../index");
const admin_1 = require("../../controllers/v1/admin");
const adminRouter = express_1.default.Router();
adminRouter.delete("/admin/delete/:id", admin_1.deleteBook);
adminRouter.get("/admin", admin_1.getBooks);
adminRouter.post("/admin/add", index_1.upload.single("image"), admin_1.addBook);
exports.default = adminRouter;
