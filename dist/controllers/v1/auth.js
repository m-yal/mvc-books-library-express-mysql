"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.logout = exports.getAuthPage = void 0;
const express_basic_auth_1 = require("express-basic-auth");
const connection_1 = __importDefault(require("../../models/utils/connection"));
function getAuthPage(req, res) {
    res.status(200);
    res.render("v1/auth/index");
}
exports.getAuthPage = getAuthPage;
function logout(req, res) {
    //destroy session: from db + from cookie
    const sql = `DELETE FROM sessions_v1 WHERE id='${req.sessionID}'`;
    connection_1.default.query(sql, (err, result) => {
        try {
            if (err)
                throw err;
            res.clearCookie("sid");
            res.redirect("http://localhost:3005/api/v1/");
        }
        catch (err) {
            res.status(500);
            res.redirect("http://localhost:3005/api/v1/admin");
        }
    });
}
exports.logout = logout;
function login(req, res) {
    const { login, password } = req.body;
    if (check(login, password)) {
        const sql = `INSERT INTO sessions_v1(id) VALUES ('${req.session.id}');`;
        connection_1.default.query(sql, (err, result) => {
            try {
                if (err)
                    throw err;
                res.redirect("http://localhost:3005/api/v1/admin");
            }
            catch (err) {
                res.status(500);
                res.redirect("http://localhost:3005/api/v1/auth");
            }
        });
    }
    else {
        res.status(401);
        res.redirect("http://localhost:3005/api/v1/auth");
    }
}
exports.login = login;
function check(login, pass) {
    let valid = true;
    valid = (0, express_basic_auth_1.safeCompare)(login, process.env.LOGIN + "") && valid;
    return (0, express_basic_auth_1.safeCompare)(pass, process.env.PASS + "") && valid;
}
