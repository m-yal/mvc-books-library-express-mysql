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
    return __awaiter(this, void 0, void 0, function* () {
        //terminate session here and only then => 200
        yield res.status(200);
        yield res.send({ ok: true });
    });
}
exports.logout = logout;
function check(name, pass) {
    let valid = true;
    valid = (0, express_basic_auth_1.safeCompare)(name, process.env.LOGIN + "") && valid;
    return (0, express_basic_auth_1.safeCompare)(pass, process.env.PASS + "") && valid;
}
