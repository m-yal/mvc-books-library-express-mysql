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
const authViewPathV1 = "v1/auth/index";
const booksListV1Href = "http://localhost:3005/api/v1/";
const adminV1Href = "http://localhost:3005/api/v1/admin";
const authV1Href = "http://localhost:3005/api/v1/auth";
const loginSQL = `INSERT INTO sessions_v1(id) VALUES (?);`;
const logoutSQL = `DELETE FROM sessions_v1 WHERE id=?;`;
function getAuthPage(req, res) {
    try {
        res.status(200);
        res.render(authViewPathV1);
    }
    catch (err) {
        res.status(500);
        res.json({ error: "Error during sending auth page v1 -> " + err });
    }
}
exports.getAuthPage = getAuthPage;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (yield connection_1.default).query(logoutSQL, [req.sessionID]);
            yield res.clearCookie("sid");
            yield res.redirect(booksListV1Href);
        }
        catch (err) {
            res.status(500);
            res.redirect(adminV1Href);
        }
    });
}
exports.logout = logout;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { login, password } = req.body;
            if (check(login, password)) {
                yield (yield connection_1.default).query(loginSQL, [req.sessionID]);
                res.redirect(adminV1Href);
            }
            else {
                res.status(401);
                res.redirect(authV1Href);
            }
        }
        catch (err) {
            res.status(500);
            res.redirect(authV1Href);
        }
    });
}
exports.login = login;
function check(login, pass) {
    let valid = true;
    valid = (0, express_basic_auth_1.safeCompare)(login, process.env.LOGIN + "") && valid;
    return (0, express_basic_auth_1.safeCompare)(pass, process.env.PASS + "") && valid;
}
