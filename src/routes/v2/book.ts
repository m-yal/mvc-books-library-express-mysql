import express, { Router } from "express";
import { getBook, wantBook } from "../../controllers/v2/book"

export const bookRouter: Router = express.Router();

bookRouter.get("/books/:bookId", getBook);
bookRouter.post("/books/:bookId", wantBook);