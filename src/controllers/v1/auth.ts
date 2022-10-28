import { safeCompare } from "express-basic-auth";
import connection from "../../models/utils/connection";
import dotenv from "dotenv";
import {Request, Response, Credentials} from "../../types";
import { adminV1Href, authV1Href, authViewPathV1, booksListV1Href, loginSQLV1, logoutSQLV1 } from "../../constants";

dotenv.config();

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
        await (await connection).query(logoutSQLV1, [req.sessionID]);
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
            await (await connection).query(loginSQLV1, [req.sessionID]);
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