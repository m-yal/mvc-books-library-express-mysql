"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.logout = exports.getAuthPage = void 0;
const express_basic_auth_1 = require("express-basic-auth");
const connection_1 = __importDefault(require("../../models/utils/connection"));
function getAuthPage(req, res) {
    res.status(200);
    res.render("v2/auth/index");
}
exports.getAuthPage = getAuthPage;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `DELETE FROM sessions_v1 WHERE id='${req.sessionID}'`;
        (yield connection_1.default).query(sql)
            .then(result => {
            res.clearCookie("sid");
            res.redirect(`http://localhost:${process.env.PORT}/`);
        })
            .catch(err => {
            console.log("Error during logout: " + err);
            res.status(500);
            res.redirect(`http://localhost:${process.env.PORT}/admin`);
        });
    });
}
exports.logout = logout;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { login, password } = req.body;
        if (check(login, password)) {
            const sql = `INSERT INTO sessions_v1(id) VALUES ('${req.session.id}');`;
            (yield connection_1.default).query(sql)
                .then((result) => __awaiter(this, void 0, void 0, function* () {
                res.redirect(`http://localhost:${process.env.PORT}/admin`);
            }))
                .catch(err => {
                res.status(500);
                res.redirect(`http://localhost:${process.env.PORT}/auth`);
            });
        }
        else {
            res.status(401);
            res.redirect(`http://localhost:${process.env.PORT}/auth`);
        }
    });
}
exports.login = login;
function check(login, pass) {
    let valid = true;
    valid = (0, express_basic_auth_1.safeCompare)(login, process.env.LOGIN + "") && valid;
    return (0, express_basic_auth_1.safeCompare)(pass, process.env.PASS + "") && valid;
}
