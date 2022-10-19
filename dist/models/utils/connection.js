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
// async function testQuery() {
//     console.log("TestQuery 1:");
//     const [response1] = await (await connection).query(`SELECT id FROM books; SELECT book_name FROM books;`);
//     console.log("Response1: " + JSON.stringify(response1));
//     // console.log("TestQuery 2:");
//     // const [response2] = await (await connection).execute('');
//     // console.log("response2 " + JSON.stringify(response2));
// }
// testQuery();
// connection.connect((err: Error) => {
//     if (err) {
//         console.log(err);
//         return err;
//     } else {
//         console.log("Database connection status ------------ OK");
//     }
// });  
exports.default = connection;
