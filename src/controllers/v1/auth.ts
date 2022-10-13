import { safeCompare } from "express-basic-auth";
import connection from "../../models/utils/connection";
import { Request, Response } from "express";

export function getAuthPage(req: any, res: any) {
    res.status(200);
    res.render("v1/auth/index");
}

export function logout(req: any, res: any) {
    //destroy session: from db + from cookie
    const sql = `DELETE FROM sessions_v1 WHERE id='${req.sessionID}'`;
    connection.query(sql, (err, result) => {
        try {
            if (err) throw err;
            res.clearCookie("sid");
            res.redirect("http://localhost:3005/api/v1/");
        } catch (err) {
            res.status(500);
            res.redirect("http://localhost:3005/api/v1/admin");
        }
    })
}

export function login(req: Request, res: Response) {
    const {login, password} = req.body;
    if (check(login, password)) {
        const sql = `INSERT INTO sessions_v1(id) VALUES ('${req.session.id}');`;
        connection.query(sql, (err, result) => {
            try {
                if (err) throw err;
                res.redirect("http://localhost:3005/api/v1/admin");
            } catch (err) {
                res.status(500);
                res.redirect("http://localhost:3005/api/v1/auth");           
            }
        })
    } else {
        res.status(401);
        res.redirect("http://localhost:3005/api/v1/auth");
    }
}

function check(login: string, pass: string): boolean {
    let valid = true;
    valid = safeCompare(login, process.env.LOGIN + "") && valid;
    return safeCompare(pass, process.env.PASS + "") && valid;
}