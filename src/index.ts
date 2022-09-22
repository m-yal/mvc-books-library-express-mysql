import express from "express";
import booksRouter from "./routes/books";
import bookRouter from "./routes/book";
import authRouter from "./routes/auth";
import dotenv from "dotenv";
import { getQuery } from "./models/connection";

export const app = express();
dotenv.config();

getQuery();

app.use("/", booksRouter);
app.use("/books", bookRouter);
app.use("/auth", authRouter);

app.use(function(req, res, next) {
    res.status(404).send("Not Found");
})

const PORT: string = process.env.PORT || "3005";
app.listen(PORT);
console.log("Server started on port " + PORT);