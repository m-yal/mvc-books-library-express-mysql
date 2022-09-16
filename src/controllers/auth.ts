export function login(req: any, res: any) {
    // const allowedLogin: boolean;
    // const view: string;
    const msg = "login";
    res.send(msg);
}

export function logout(req: any, res: any) {
    //session destroying
    // const view: string;
    const msg = "logout";
    res.send(msg);
}