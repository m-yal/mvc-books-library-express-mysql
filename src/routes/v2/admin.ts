import express from "express";
import multer from "multer";
import path from "path";

const adminRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, image, cb) => cb(null, './public/images/'),
    filename: (req, image, cb) => cb(null, Date.now() + path.extname(image.originalname))
})
const upload = multer({storage: storage});


import { deleteBook, getBooks, addBook } from "../../controllers/v2/admin";
adminRouter.delete("/admin/delete/:id", deleteBook);
adminRouter.get("/admin", getBooks);
adminRouter.post("/admin/add", upload.single("image"), addBook);

export default adminRouter;