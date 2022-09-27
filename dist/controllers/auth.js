"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const basic_auth_1 = __importDefault(require("basic-auth"));
const express_basic_auth_1 = require("express-basic-auth");
function login(req, res) {
    const credentials = (0, basic_auth_1.default)(req);
    if (!credentials || !check(credentials.name, credentials.pass)) {
        res.status(401);
        res.send({ error: "Access denied" });
    }
    else {
        //send admin page        
    }
}
exports.login = login;
function logout(req, res) {
    //move to get all page
}
exports.logout = logout;
function check(name, pass) {
    let valid = true;
    valid = (0, express_basic_auth_1.safeCompare)(name, process.env.LOGIN + "") && valid;
    return (0, express_basic_auth_1.safeCompare)(pass, process.env.PASS + "") && valid;
}
