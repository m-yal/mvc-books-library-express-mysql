import booksRouterV2 from "./books";
import {bookRouter as singleBookRouterV2} from "./book";
import authRouterV2 from "./auth";
import adminRouterV2 from "./admin";
import {app} from "../../index";

export default function activateAllV2Routers() {
    app.use("", booksRouterV2); //get list of books
    app.use("", singleBookRouterV2); //get single book
    app.use("", authRouterV2);
    app.use("", adminRouterV2);
}