"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readSQLFile = void 0;
const path_1 = __importDefault(require("path"));
const connection_1 = __importDefault(require("./connection"));
const fs_1 = __importDefault(require("fs"));
// Executes only one file by session
function executeSQLFile(sqlFileName, version) {
    const queries = readSQLFile(sqlFileName, version);
    connection_1.default.query(queries, function (err, result) {
        if (err) {
            console.log(`Error during initTables.ts with file ${sqlFileName} query script work`);
            throw err;
        }
        console.log(`Query result form file ${sqlFileName} : ${result}`);
        connection_1.default.end();
    });
}
exports.default = executeSQLFile;
;
function readSQLFile(sqlFileName, version) {
    const sqlPath = path_1.default.join(__dirname, `../../../src/models/${version}/sql-files`, sqlFileName);
    return fs_1.default.readFileSync(sqlPath).toString();
}
exports.readSQLFile = readSQLFile;
