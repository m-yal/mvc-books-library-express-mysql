import {app} from "../index";
import path from "path";
import express from "express";

export default function setViewsParams(): void {
    app.set("views", path.join(__dirname, "../..", "views"))
    app.set('view engine', 'ejs');
    app.use(express.static("public"));
}