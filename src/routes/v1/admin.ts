import express from "express";
import { upload } from "../../index";
import { deleteBook, getBooks, addBook } from "../../controllers/admin";

const adminRouter = express.Router();

adminRouter.delete("/admin/delete/:id", deleteBook);
adminRouter.get("/admin", getBooks);
adminRouter.post("/admin/add", upload.single("image"), addBook);

export default adminRouter;