"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
function login(req, res) {
    // const allowedLogin: boolean;
    // const view: string;
    const msg = "login";
    res.send(msg);
}
exports.login = login;
function logout(req, res) {
    //session destroying
    // const view: string;
    const msg = "logout";
    res.send(msg);
}
exports.logout = logout;
