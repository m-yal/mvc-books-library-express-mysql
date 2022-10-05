import express from "express";
import booksRouterV1 from "./routes/v1/books";
import {bookRouter as singleBookRouterV1} from "./routes/v1/book";
import authRouterV1 from "./routes/v1/auth";
import dotenv from "dotenv";
import connection from "./models/utils/connection";
import adminRouterV1 from "./routes/v1/admin";
import path from "path";


export const app = express();
dotenv.config();

app.set("views", path.join(__dirname, "../src", "views"))
app.set('view engine', 'ejs');

connection;
app.use(express.static("public"));

app.use("/api/v1", booksRouterV1); //get list of books
app.use("/api/v1", singleBookRouterV1); //get single book
app.use("/api/v1", authRouterV1);
app.use("/api/v1", adminRouterV1);

app.use(function(req, res, next) {
    res.status(404).send({error: "Not Found"});
});

const PORT: string = process.env.PORT || "3005";
app.listen(PORT);
console.log("Server started on port " + PORT);