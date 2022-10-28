import express, { Router } from "express";
import { SINGLE_BOOK_ROUTE_V1 } from "../../constants";
import { getBook, wantBook } from "../../controllers/v1/book"

export const bookRouter: Router = express.Router();

bookRouter.get(SINGLE_BOOK_ROUTE_V1, getBook);
bookRouter.post(SINGLE_BOOK_ROUTE_V1, wantBook);