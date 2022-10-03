import express from "express";
import { getBook, wantBook } from "../controllers/book"

export const bookRouter = express.Router();

bookRouter.get("/:bookId", getBook);
bookRouter.post("/:bookId", wantBook);