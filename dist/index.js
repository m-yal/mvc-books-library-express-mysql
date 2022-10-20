"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.upload = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const books_1 = __importDefault(require("./routes/v1/books"));
const book_1 = require("./routes/v1/book");
const auth_1 = __importDefault(require("./routes/v1/auth"));
const books_2 = __importDefault(require("./routes/v2/books"));
const book_2 = require("./routes/v2/book");
const auth_2 = __importDefault(require("./routes/v2/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = __importDefault(require("./models/utils/connection"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const express_session_1 = __importDefault(require("express-session"));
exports.app = (0, express_1.default)();
dotenv_1.default.config();
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(express_1.default.json());
exports.app.set("views", path_1.default.join(__dirname, "../src", "views"));
exports.app.set('view engine', 'ejs');
exports.app.use((0, express_session_1.default)({
    name: "sid",
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    genid: function (req) {
        const sid = (0, uuid_1.v4)();
        console.log('Session id created: ' + sid);
        return sid;
    },
}));
connection_1.default;
exports.app.use(express_1.default.static("public"));
const storage = multer_1.default.diskStorage({
    destination: (req, image, cb) => cb(null, './public/images/'),
    filename: (req, image, cb) => cb(null, Date.now() + path_1.default.extname(image.originalname))
});
exports.upload = (0, multer_1.default)({ storage: storage });
// v1 routes
const admin_1 = __importDefault(require("./routes/v1/admin"));
exports.app.use("/api/v1", books_1.default); //get list of books
exports.app.use("/api/v1", book_1.bookRouter); //get single book
exports.app.use("/api/v1", auth_1.default);
exports.app.use("/api/v1", admin_1.default);
// v2 routes
const admin_2 = __importDefault(require("./routes/v2/admin"));
exports.app.use("", books_2.default); //get list of books
exports.app.use("", book_2.bookRouter); //get single book
exports.app.use("", auth_2.default);
exports.app.use("", admin_2.default);
exports.app.use(function (req, res, next) {
    res.status(404).send({ error: "Not Found Page" });
});
exports.PORT = process.env.PORT || "3005";
exports.app.listen(exports.PORT);
console.log("Server started on port " + exports.PORT);
