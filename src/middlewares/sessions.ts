import {app} from "../index";
import { v4 as uuidv4 } from 'uuid';
import session from "express-session";
import {Request} from "../types";
import dotenv from "dotenv";

export default function launchSessionsManagemenet(): void {
    app.use(session({
        name: process.env.SID_COOKIE_NAME,
        secret: process.env.SID_SECRET as string,
        resave: false,
        saveUninitialized: true,
        genid: (req: Request): string => uuidv4()
    }));
} 