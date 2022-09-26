"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const create_tables_1 = __importDefault(require("./sql-scripts/create-tables"));
const fulfill_tables_1 = __importDefault(require("./sql-scripts/fulfill-tables"));
const connection = mysql_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "123321",
    database: "library"
});
connection.connect((err) => {
    if (err) {
        console.log(err);
        return err;
    }
    else {
        console.log("Database ------------ OK");
    }
    (0, create_tables_1.default)();
    (0, fulfill_tables_1.default)();
});
exports.default = connection;
// export function getQuery() {
//     let query = "SELECT * FROM teacher";
//     connection.query(query, (err: Error, result: any, field: any) => {
//         console.log(err);
//         console.log(result);
//         connection.end();
//     });
// }
