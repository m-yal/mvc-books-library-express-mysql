"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuery = void 0;
const mysql_1 = __importDefault(require("mysql"));
function getQuery() {
    const connection = mysql_1.default.createConnection({
        host: "localhost",
        user: "root",
        password: "123321",
        database: "test_db"
    });
    connection.connect((err) => {
        if (err) {
            console.log(err);
            return err;
        }
        else {
            console.log("Database ------------ OK");
        }
    });
    let query = "SELECT * FROM teacher";
    connection.query(query, (err, result, field) => {
        console.log(err);
        console.log(result);
        connection.end();
    });
}
exports.getQuery = getQuery;
