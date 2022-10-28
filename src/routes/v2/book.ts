import express, { Router } from "express";
import { getBook, wantBook } from "../../controllers/v2/book"
import { BOOK_ROUTE_V2 } from "../../constants";

export const bookRouter: Router = express.Router();

bookRouter.get(BOOK_ROUTE_V2, getBook);
bookRouter.post(BOOK_ROUTE_V2, wantBook);