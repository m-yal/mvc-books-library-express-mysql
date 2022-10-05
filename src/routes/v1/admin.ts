import express from "express";
import { deleteBook, getBooks, getBook, addBook } from "../../controllers/admin";

const adminRouter = express.Router();

adminRouter.delete("/admin/books/:bookId", deleteBook);
adminRouter.get("/admin/books", getBooks);
adminRouter.get("/admin/books/:bookId", getBook);
adminRouter.get("/admin/books/add", addBook);

export default adminRouter;