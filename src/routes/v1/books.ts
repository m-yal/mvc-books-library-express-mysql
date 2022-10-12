import express from "express";
import { getBooks } from "../../controllers/v1/books";

const booksRouter = express.Router();

booksRouter.get("", getBooks);

export default booksRouter;