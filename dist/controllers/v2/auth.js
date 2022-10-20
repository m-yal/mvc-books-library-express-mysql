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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authViewPath = "v2/auth/index";
const booksListHref = `http://localhost:${process.env.PORT}/`;
const adminHref = `http://localhost:${process.env.PORT}/admin`;
const authHref = `http://localhost:${process.env.PORT}/auth`;
const deleteSessionSQL = `DELETE FROM sessions_v1 WHERE id = ?;`;
const insertSessionSQL = `INSERT INTO sessions_v1(id) VALUES (?);`;
function getAuthPage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield res.status(200);
        yield res.render(authViewPath);
    });
}
exports.getAuthPage = getAuthPage;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (yield connection_1.default).query(deleteSessionSQL, [req.sessionID]);
            yield res.clearCookie("sid");
            yield res.redirect(booksListHref);
        }
        catch (err) {
            res.status(500);
            res.redirect(adminHref);
        }
    });
}
exports.logout = logout;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { login, password } = req.body;
        if (check(login, password)) {
            saveSessionIdAndRedirect(req, res);
        }
        else {
            redirectToAuth(res);
        }
    });
}
exports.login = login;
function saveSessionIdAndRedirect(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (yield connection_1.default).query(insertSessionSQL, [req.sessionID]);
            res.status(301);
            return res.redirect(adminHref);
        }
        catch (err) {
            res.status(500);
            res.redirect(authHref);
        }
    });
}
function redirectToAuth(res) {
    res.status(401);
    res.redirect(authHref);
}
function check(login, pass) {
    let valid = true;
    valid = (0, express_basic_auth_1.safeCompare)(login, process.env.LOGIN + "") && valid;
    return (0, express_basic_auth_1.safeCompare)(pass, process.env.PASS + "") && valid;
}
