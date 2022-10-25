import express from "express";
import { getBooks } from "../../controllers/v2/books";
import csrf from 'csurf';

const booksRouter = express.Router();

booksRouter.get("", getBooks);

export default booksRouter;