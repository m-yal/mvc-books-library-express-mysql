import express from "express";
import { upload } from "../../index";
import { deleteBook, getBooks, addBook } from "../../controllers/v2/admin";
import csrf from 'csurf';

const adminRouter = express.Router();
const csrfProtect = csrf({ cookie: true });

adminRouter.delete("/admin/delete/:id", csrfProtect, deleteBook);
adminRouter.get("/admin", getBooks);
adminRouter.post("/admin/add", csrfProtect, upload.single("image"), addBook);

export default adminRouter;