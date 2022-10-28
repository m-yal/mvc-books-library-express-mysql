import {app} from "../index";
import path from "path";
import express from "express";
import { STATIC_DIR_PATH } from "../constants";

export default function setViewsParams(): void {
    app.set("views", path.join(__dirname, "../..", "views"))
    app.set('view engine', 'ejs');
    app.use(express.static(STATIC_DIR_PATH));
}