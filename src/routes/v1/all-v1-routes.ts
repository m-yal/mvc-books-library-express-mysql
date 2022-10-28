import adminRouterV1 from "./admin";
import booksRouterV1 from "./books";
import {bookRouter as singleBookRouterV1} from "./book";
import authRouterV1 from "./auth";
import { app } from "../../index";
import { API_V1_ROUTE } from "../../constants";

export default function activateAllV1Routers(): void {
    app.use(API_V1_ROUTE, booksRouterV1); //get list of books
    app.use(API_V1_ROUTE, singleBookRouterV1); //get single book
    app.use(API_V1_ROUTE, authRouterV1);
    app.use(API_V1_ROUTE, adminRouterV1);
}