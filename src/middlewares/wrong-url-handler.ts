import { NextFunction } from "express";
import {app} from "../index";
import { Request, Response } from "../types";

export default function handleWrongURL(): void {
    app.use(function(req: Request, res: Response, next: NextFunction): void {
        res.status(404).end(JSON.stringify({error: "Not Found Page"}));
    });
}