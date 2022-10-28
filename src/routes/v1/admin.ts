import express from "express";
import { deleteBook, getBooks, addBook } from "../../controllers/v1/admin";
import upload from "../../middlewares/multer";

const adminRouter = express.Router();

adminRouter.delete("/admin/delete/:id", deleteBook);
adminRouter.get("/admin", getBooks);
adminRouter.post("/admin/add", upload.single("image"), addBook);

export default adminRouter;