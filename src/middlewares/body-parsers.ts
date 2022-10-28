import {app} from "../index";
import express from "express";

export default function launchBodyParsers(): void {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}