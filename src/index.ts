import express from "express";
import booksRouterV1 from "./routes/v1/books";
import {bookRouter as singleBookRouterV1} from "./routes/v1/book";
import authRouterV1 from "./routes/v1/auth";
import booksRouterV2 from "./routes/v2/books";
import {bookRouter as singleBookRouterV2} from "./routes/v2/book";
import authRouterV2 from "./routes/v2/auth";
import dotenv from "dotenv";
import connection from "./models/utils/connection";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import session from "express-session";

export const app = express();

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", path.join(__dirname, "../src", "views"))
app.set('view engine', 'ejs');

app.use(session({
    name: "sid",
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    genid: function(req) {
        const sid = uuidv4();
        console.log('Session id created: ' + sid);
        return sid;
    },
}))

connection;

app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: (req, image, cb) => cb(null, './public/images/'),
    filename: (req, image, cb) => cb(null, Date.now() + path.extname(image.originalname))
})
export const upload = multer({storage: storage});

// v1 routes
import adminRouterV1 from "./routes/v1/admin";
app.use("/api/v1", booksRouterV1); //get list of books
app.use("/api/v1", singleBookRouterV1); //get single book
app.use("/api/v1", authRouterV1);
app.use("/api/v1", adminRouterV1);

// v2 routes
import adminRouterV2 from "./routes/v2/admin";
app.use("", booksRouterV2); //get list of books
app.use("", singleBookRouterV2); //get single book
app.use("", authRouterV2);
app.use("", adminRouterV2);

app.use(function(req, res, next) {
    res.status(404).send({error: "Not Found Page"});
});

export const PORT: string = process.env.PORT || "3005";
app.listen(PORT);
console.log("Server started on port " + PORT);