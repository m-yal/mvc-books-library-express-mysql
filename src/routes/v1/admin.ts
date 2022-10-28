import express, { Router } from "express";
import { ADD_BOOK_V1, ADMIN_V1, DELELTE_BOOK_V1 } from "../../constants";
import { deleteBook, getBooks, addBook } from "../../controllers/v1/admin";
import upload from "../../middlewares/multer";

const adminRouter: Router = express.Router();

adminRouter.delete(DELELTE_BOOK_V1, deleteBook);
adminRouter.get(ADMIN_V1, getBooks);
adminRouter.post(ADD_BOOK_V1, upload.single("image"), addBook);

export default adminRouter;