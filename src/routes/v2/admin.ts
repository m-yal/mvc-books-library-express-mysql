import express, { Router } from "express";
import upload from "../../middlewares/multer";
import { ADD_BOOK_ROUTE_V2, ADMIN_ROUTE_V2, DELETE_ROUTE_V2 } from "../../constants";

const adminRouter: Router = express.Router();

import { deleteBook, getBooks, addBook } from "../../controllers/v2/admin";
adminRouter.delete(DELETE_ROUTE_V2, deleteBook);
adminRouter.get(ADMIN_ROUTE_V2, getBooks);
adminRouter.post(ADD_BOOK_ROUTE_V2, upload.single("image"), addBook);

export default adminRouter;