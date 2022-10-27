import { safeCompare } from "express-basic-auth";
import connection from "../../models/utils/connection";
import dotenv from "dotenv";
import {Request, Response, Credentials} from "../../types";

dotenv.config();

const authViewPathV1: string = "v1/auth/index";
const booksListV1Href: string = "http://localhost:3005/api/v1/";
const adminV1Href: string = "http://localhost:3005/api/v1/admin";
const authV1Href: string = "http://localhost:3005/api/v1/auth";

const sessionsTableName: string = "sessions_v1";

const loginSQL: string = `INSERT INTO ${sessionsTableName}(id) VALUES (?);`;
const logoutSQL: string = `DELETE FROM ${sessionsTableName} WHERE id=?;`;

export function getAuthPage(req: Request, res: Response): void {
    try {
        res.status(200);
        res.render(authViewPathV1);        
    } catch (err) {
        res.status(500);
        res.json({error: "Error during sending auth page v1 -> " + err});
    }
}

export async function logout(req: Request, res: Response): Promise<void> {
    try {
        await (await connection).query(logoutSQL, [req.sessionID]);
        res.clearCookie("sid");
        res.redirect(booksListV1Href);
    } catch (err) {
        res.status(500);
        res.redirect(adminV1Href);
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    try {
        const {login, password}: Credentials = await req.body;
        if (check(login, password)) {
            await (await connection).query(loginSQL, [req.sessionID]);
            res.redirect(adminV1Href);
        } else {
            res.status(401);
            res.redirect(authV1Href);
        }
    } catch (err) {
        res.status(500);
        res.redirect(authV1Href); 
    }
}

function check(login: string, pass: string): boolean {
    let valid: boolean = true;
    valid = safeCompare(login, process.env.ADMIN_LOGIN + "") && valid;
    return safeCompare(pass, process.env.ADMIN_PASS + "") && valid;
}