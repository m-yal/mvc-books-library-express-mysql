import {app} from "../index";
import express from "express";

export default function launchBodyParsers() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}