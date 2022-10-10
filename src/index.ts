import express from "express";
import booksRouterV1 from "./routes/v1/books";
import {bookRouter as singleBookRouterV1} from "./routes/v1/book";
import authRouterV1 from "./routes/v1/auth";
import dotenv from "dotenv";
import connection from "./models/utils/connection";
import path from "path";
import multer from "multer";

export const app = express();

dotenv.config();

app.set("views", path.join(__dirname, "../src", "views"))
app.set('view engine', 'ejs');

connection;

app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: (req, image, cb) => cb(null, './public/images/'),
    filename: (req, image, cb) => cb(null, Date.now() + path.extname(image.originalname))
})
export const upload = multer({storage: storage});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import adminRouterV1 from "./routes/v1/admin";

// v1 routes
app.use("/api/v1", booksRouterV1); //get list of books
app.use("/api/v1", singleBookRouterV1); //get single book
app.use("/api/v1", authRouterV1);
app.use("/api/v1", adminRouterV1);

app.use(function(req, res, next) {
    res.status(404).send({error: "Not Found Page"});
});

const PORT: string = process.env.PORT || "3005";
app.listen(PORT);
console.log("Server started on port " + PORT);