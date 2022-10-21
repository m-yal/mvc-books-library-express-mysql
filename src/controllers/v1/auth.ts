import { safeCompare } from "express-basic-auth";
import connection from "../../models/utils/connection";
import { Request, Response } from "express";

const authViewPathV1 = "v1/auth/index";
const booksListV1Href = "http://localhost:3005/api/v1/";
const adminV1Href = "http://localhost:3005/api/v1/admin";
const authV1Href = "http://localhost:3005/api/v1/auth";

const loginSQL = `INSERT INTO sessions_v1(id) VALUES (?);`;
const logoutSQL = `DELETE FROM sessions_v1 WHERE id=?;`;

export function getAuthPage(req: any, res: any) {
    try {
        res.status(200);
        res.render(authViewPathV1);        
    } catch (err) {
        res.status(500);
        res.json({error: "Error during sending auth page v1 -> " + err});
    }
}

export async function logout(req: any, res: any) {
    try {
        await (await connection).query(logoutSQL, [req.sessionID]);
        await res.clearCookie("sid");
        await res.redirect(booksListV1Href);
    } catch (err) {
        res.status(500);
        res.redirect(adminV1Href);
    }
}

export async function login(req: Request, res: Response) {
    try {
        const {login, password} = req.body;
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
    let valid = true;
    valid = safeCompare(login, process.env.LOGIN + "") && valid;
    return safeCompare(pass, process.env.PASS + "") && valid;
}