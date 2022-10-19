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
// import mysql from "mysql2";
const promise_1 = __importDefault(require("mysql2/promise"));
const connection = promise_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "library",
    multipleStatements: true
});
function testQuery() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("TestQuery 1:");
        const [response1] = yield (yield connection).query(`SELECT id FROM books; SELECT book_name FROM books;`);
        console.log("Response1: " + JSON.stringify(response1));
        // console.log("TestQuery 2:");
        // const [response2] = await (await connection).execute('');
        // console.log("response2 " + JSON.stringify(response2));
    });
}
testQuery();
// connection.connect((err: Error) => {
//     if (err) {
//         console.log(err);
//         return err;
//     } else {
//         console.log("Database connection status ------------ OK");
//     }
// });  
exports.default = connection;
