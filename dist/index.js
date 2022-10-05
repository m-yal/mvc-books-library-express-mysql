"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const books_1 = __importDefault(require("./routes/v1/books"));
const book_1 = require("./routes/v1/book");
const auth_1 = __importDefault(require("./routes/v1/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = __importDefault(require("./models/utils/connection"));
const admin_1 = __importDefault(require("./routes/v1/admin"));
const path_1 = __importDefault(require("path"));
exports.app = (0, express_1.default)();
dotenv_1.default.config();
exports.app.set("views", path_1.default.join(__dirname, "../src", "views"));
exports.app.set('view engine', 'ejs');
connection_1.default;
exports.app.use(express_1.default.static("public"));
exports.app.use("/api/v1", books_1.default); //get list of books
exports.app.use("/api/v1", book_1.bookRouter); //get single book
exports.app.use("/api/v1", auth_1.default);
exports.app.use("/api/v1", admin_1.default);
exports.app.use(function (req, res, next) {
    res.status(404).send({ error: "Not Found Page" });
});
const PORT = process.env.PORT || "3005";
exports.app.listen(PORT);
console.log("Server started on port " + PORT);
