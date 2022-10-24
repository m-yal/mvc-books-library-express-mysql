import { safeCompare } from "express-basic-auth";
import connection from "../../models/utils/connection";
import { Request, Response } from "express";
import dotenv from "dotenv";
import validator from "validator";

dotenv.config();

const authViewPath: string = "v2/auth/index";

const booksListHref = `http://localhost:${process.env.PORT}/`;
const adminHref = `http://localhost:${process.env.PORT}/admin`;
const authHref = `http://localhost:${process.env.PORT}/auth`;

const deleteSessionSQL = `DELETE FROM sessions_v1 WHERE id = ?;`;
const insertSessionSQL = `INSERT INTO sessions_v1(id) VALUES (?);`

export async function getAuthPage(req: any, res: any) {
    await res.status(200);
    await res.render(authViewPath);
}

export async function logout(req: any, res: any) {
    try {
        await (await connection).query(deleteSessionSQL, [req.sessionID]);
        await res.clearCookie("sid");
        await res.redirect(booksListHref);
    } catch (err) {
        res.status(500);
        res.redirect(adminHref);
    }
}

export async function login(req: Request, res: Response) {
    const {login, password} = validateForXSS(req.body);
    if (check(login, password)) {
        saveSessionIdAndRedirect(req, res);
    } else {
        redirectToAuth(res);
    }
}

function validateForXSS(body: any) {
    return {
        login: validator.escape(body.login),
        password: validator.escape(body.password)
    }
}

async function saveSessionIdAndRedirect(req: any, res: any) {
    try {
        await (await connection).query(insertSessionSQL, [req.sessionID]);
        res.status(301);
        return res.redirect(adminHref);
    } catch (err) {
        res.status(500);
        res.redirect(authHref);
    }
}

function redirectToAuth(res: any) {
    res.status(401);
    res.redirect(authHref);
}

function check(login: string, pass: string): boolean {
    let valid: boolean = true;
    valid = safeCompare(login, process.env.LOGIN + "") && valid;
    return safeCompare(pass, process.env.PASS + "") && valid;
}