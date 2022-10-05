import express from "express";
import { getBook, wantBook } from "../../controllers/book"

export const bookRouter = express.Router();

bookRouter.get("/books/:bookId", getBook);
bookRouter.post("/books/:bookId", wantBook);