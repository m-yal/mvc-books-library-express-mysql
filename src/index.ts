import express from "express";
import booksRouter from "./routes/books";
import {bookRouter as singleBookRouter} from "./routes/book";
import authRouter from "./routes/auth";
import dotenv from "dotenv";
import connection from "./models/connection";
import adminRouter from "./routes/admin";
import path from "path";


export const app = express();
dotenv.config();

app.set("views", path.join(__dirname, "../src", "views"))
app.set('view engine', 'ejs');

connection;
app.use(express.static("public"));

app.use("/", booksRouter); //get list of books
app.use("/books", singleBookRouter); //get single book
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

app.use(function(req, res, next) {
    res.status(404).send({error: "Not Found"});
});

const PORT: string = process.env.PORT || "3005";
app.listen(PORT);
console.log("Server started on port " + PORT);