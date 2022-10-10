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

export async function logout(req: any, res: any) {
    //terminate session here and only then => 200
    await res.status(200);
    await res.send({ok: true});
}

function check(name: string, pass: string): boolean {
    let valid = true;
    valid = safeCompare(name, process.env.LOGIN + "") && valid;
    return safeCompare(pass, process.env.PASS + "") && valid;
}