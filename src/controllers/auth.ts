import auth from "basic-auth";
import { safeCompare } from "express-basic-auth";

export function login(req: any, res: any) {
    const credentials = auth(req);
    if (!credentials || !check(credentials.name, credentials.pass)) {
        res.status(401);
        res.send({error: "Access denied"})
    } else {
        //send admin page        
    }
}

export function logout(req: any, res: any) {
    //move to get all page
}

function check(name: string, pass: string): boolean {
    let valid = true;
    valid = safeCompare(name, process.env.LOGIN + "") && valid;
    return safeCompare(pass, process.env.PASS + "") && valid;
}