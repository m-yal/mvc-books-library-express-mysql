"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const adminRouter = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: (req, image, cb) => cb(null, './public/images/'),
    filename: (req, image, cb) => cb(null, Date.now() + path_1.default.extname(image.originalname))
});
const upload = (0, multer_1.default)({ storage: storage });
const admin_1 = require("../../controllers/v2/admin");
adminRouter.delete("/admin/delete/:id", admin_1.deleteBook);
adminRouter.get("/admin", admin_1.getBooks);
adminRouter.post("/admin/add", upload.single("image"), admin_1.addBook);
exports.default = adminRouter;
