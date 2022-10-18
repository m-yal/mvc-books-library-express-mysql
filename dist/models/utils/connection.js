"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import mysql from "mysql2";
const promise_1 = __importDefault(require("mysql2/promise"));
const connection = promise_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "library",
    multipleStatements: true
});
// connection.connect((err: Error) => {
//     if (err) {
//         console.log(err);
//         return err;
//     } else {
//         console.log("Database connection status ------------ OK");
//     }
// });  
exports.default = connection;
