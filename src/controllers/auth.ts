import { safeCompare } from "express-basic-auth";

export function getAuthPage(req: any, res: any) {
    res.status(200);
    res.render("v1/auth/index");
}

export async function logout(req: any, res: any) {
    //terminate session here and only then => 200
    await res.status(200);
    await res.send({ok: true});
}

export function login(req: any, res: any) {
    const {login, password} = req.body;
    if (check(login, password)) {
        if (login === "me" && password === "111") {
            res.redirect("http://localhost:3005/api/v1/admin");
        } else {
            res.status(401);
            res.redirect("http://localhost:3005/api/v1/auth");
        }
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