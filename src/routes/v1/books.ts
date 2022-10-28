import express, { Router } from "express";
import { getBooks } from "../../controllers/v1/books";

const booksRouter: Router = express.Router();

booksRouter.get("", getBooks);

export default booksRouter;