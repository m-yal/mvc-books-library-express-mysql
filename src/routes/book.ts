import express from "express";
import { getBook } from "../controllers/book"

const bookRouter = express.Router();

bookRouter.get("/:bookId", getBook);

export default bookRouter;