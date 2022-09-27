import express from "express";
import { deleteBook, getBooks, getBook, addBook } from "../controllers/admin";

const adminRouter = express.Router();

adminRouter.delete("/books/:bookId", deleteBook);
adminRouter.get("/books", getBooks);
adminRouter.get("/books/:bookId", getBook);
adminRouter.get("/books/add", addBook);

export default adminRouter;