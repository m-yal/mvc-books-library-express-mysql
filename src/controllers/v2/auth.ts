import { safeCompare } from "express-basic-auth";
import connection from "../../models/utils/connection";
import dotenv from "dotenv";
import validator from "validator";
import {Request, Response, Credentials} from "../../types";
import { adminHrefV2, authHrefV2, authViewPathV2, booksListHrefV2, deleteSessionSQLV2, insertSessionSQLV2 } from "../../constants";

dotenv.config();

export async function getAuthPage(req: Request, res: Response): Promise<void> {
    res.status(200);
    res.render(authViewPathV2);
}

export async function logout(req: Request, res: Response): Promise<void> {
    try {
        await (await connection).query(deleteSessionSQLV2, [req.sessionID]);
        res.clearCookie("sid");
        res.redirect(booksListHrefV2);
    } catch (err) {
        res.status(500);
        res.redirect(adminHrefV2);
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    const {login, password}: Credentials = validateForXSS(req.body);
    if (check(login, password)) {
        saveSessionIdAndRedirect(req, res);
    } else {
        redirectToAuth(res);
    }
}

function validateForXSS(body: any): Credentials {
    return {
        login: validator.escape(body.login),
        password: validator.escape(body.password)
    }
}

async function saveSessionIdAndRedirect(req: Request, res: Response): Promise<void> {
    try {
        await (await connection).query(insertSessionSQLV2, [req.sessionID]);
        res.status(301);
        res.redirect(adminHrefV2);
    } catch (err) {
        res.status(500);
        res.redirect(authHrefV2);
    }
}

function redirectToAuth(res: Response): void {
    res.status(401);
    res.redirect(authHrefV2);
}

function check(login: string, pass: string): boolean {
    let valid: boolean = true;
    valid = safeCompare(login, process.env.ADMIN_LOGIN + "") && valid;
    return safeCompare(pass, process.env.ADMIN_PASS + "") && valid;
}