import { safeCompare } from "express-basic-auth";
import connection from "../../models/utils/connection";
import { Request, Response } from "express";

export function getAuthPage(req: any, res: any) {
    res.status(200);
    res.render("v1/auth/index");
}

export async function logout(req: any, res: any) {
    const sql = `DELETE FROM sessions_v1 WHERE id='${req.sessionID}'`;
    (await connection).query(sql)
        .then(result => {
            res.clearCookie("sid");
            res.redirect(`http://localhost:${process.env.PORT}/`);
        })
        .catch(err => {
            console.log("Error during logout: " + err);
            res.status(500);
            res.redirect(`http://localhost:${process.env.PORT}/admin`);
        })
}

export async function login(req: Request, res: Response) {
    const {login, password} = req.body;
    if (check(login, password)) {
        const sql = `INSERT INTO sessions_v1(id) VALUES ('${req.session.id}');`;
        (await connection).query(sql)
            .then(async result => {
                res.redirect(`http://localhost:${process.env.PORT}/admin`);
            })
            .catch(err => {
                res.status(500);
                res.redirect(`http://localhost:${process.env.PORT}/auth`); 
            })
    } else {
        res.status(401);
        res.redirect(`http://localhost:${process.env.PORT}/auth`);
    }
}

function check(login: string, pass: string): boolean {
    let valid = true;
    valid = safeCompare(login, process.env.LOGIN + "") && valid;
    return safeCompare(pass, process.env.PASS + "") && valid;
}