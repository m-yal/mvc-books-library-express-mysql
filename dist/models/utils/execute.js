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
exports.readSQLFile = void 0;
const path_1 = __importDefault(require("path"));
const connection_1 = __importDefault(require("./connection"));
const fs_1 = __importDefault(require("fs"));
// Executes only one file by session
function executeSQLFile(sqlFileName, version) {
    return __awaiter(this, void 0, void 0, function* () {
        const queries = readSQLFile(sqlFileName, version);
        try {
            let conn = yield connection_1.default;
            conn.query(queries);
            conn.end();
            console.log("SQL files executed, connection ended");
        }
        catch (err) {
            console.log(`Error during executing sql file ${sqlFileName} or ending connection`);
            throw err;
        }
    });
}
exports.default = executeSQLFile;
;
function readSQLFile(sqlFileName, version) {
    const sqlPath = path_1.default.join(__dirname, `../../../src/models/${version}/sql-files`, sqlFileName);
    return fs_1.default.readFileSync(sqlPath).toString();
}
exports.readSQLFile = readSQLFile;
