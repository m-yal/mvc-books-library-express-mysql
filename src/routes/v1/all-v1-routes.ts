import adminRouterV1 from "./admin";
import booksRouterV1 from "./books";
import {bookRouter as singleBookRouterV1} from "./book";
import authRouterV1 from "./auth";
import { app } from "../../index";

export default function activateAllV1Routers() {
    app.use("/api/v1", booksRouterV1); //get list of books
    app.use("/api/v1", singleBookRouterV1); //get single book
    app.use("/api/v1", authRouterV1);
    app.use("/api/v1", adminRouterV1);
}