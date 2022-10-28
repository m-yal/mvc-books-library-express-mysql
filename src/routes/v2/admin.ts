import express, { Router } from "express";
import upload from "../../middlewares/multer";

const adminRouter: Router = express.Router();

import { deleteBook, getBooks, addBook } from "../../controllers/v2/admin";
adminRouter.delete("/admin/delete/:id", deleteBook);
adminRouter.get("/admin", getBooks);
adminRouter.post("/admin/add", upload.single("image"), addBook);

export default adminRouter;