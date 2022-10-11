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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.logout = exports.getAuthPage = void 0;
const express_basic_auth_1 = require("express-basic-auth");
function getAuthPage(req, res) {
    res.status(200);
    res.render("v1/auth/index");
}
exports.getAuthPage = getAuthPage;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //terminate session here and only then => 200
        yield res.status(200);
        yield res.send({ ok: true });
    });
}
exports.logout = logout;
function login(req, res) {
    const { login, password } = req.body;
    if (check(login, password)) {
        if (login === "me" && password === "111") {
            res.redirect("http://localhost:3005/api/v1/admin");
        }
        else {
            res.status(401);
            res.redirect("http://localhost:3005/api/v1/auth");
        }
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
