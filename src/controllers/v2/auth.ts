import { safeCompare } from "express-basic-auth";
import connection from "../../models/utils/connection";
import dotenv from "dotenv";
import validator from "validator";
import {Request, Response, Credentials} from "../../types";

dotenv.config();

const authViewPath: string = "v2/auth/index";

const booksListHref: string = `http://localhost:${process.env.PORT}/`;
const adminHref: string = `http://localhost:${process.env.PORT}/admin`;
const authHref: string = `http://localhost:${process.env.PORT}/auth`;

const deleteSessionSQL: string = `DELETE FROM sessions_v1 WHERE id = ?;`;
const insertSessionSQL: string = `INSERT INTO sessions_v1(id) VALUES (?);`

export async function getAuthPage(req: Request, res: Response): Promise<void> {
    res.status(200);
    res.render(authViewPath);
}

export async function logout(req: Request, res: Response): Promise<void> {
    try {
        await (await connection).query(deleteSessionSQL, [req.sessionID]);
        res.clearCookie("sid");
        res.redirect(booksListHref);
    } catch (err) {
        res.status(500);
        res.redirect(adminHref);
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
        await (await connection).query(insertSessionSQL, [req.sessionID]);
        res.status(301);
        res.redirect(adminHref);
    } catch (err) {
        res.status(500);
        res.redirect(authHref);
    }
}

function redirectToAuth(res: Response): void {
    res.status(401);
    res.redirect(authHref);
}

function check(login: string, pass: string): boolean {
    let valid: boolean = true;
    valid = safeCompare(login, process.env.ADMIN_LOGIN + "") && valid;
    return safeCompare(pass, process.env.ADMIN_PASS + "") && valid;
}