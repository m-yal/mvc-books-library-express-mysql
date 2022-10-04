import path from "path";
import connection from "./connection";
import fs from "fs";

// Executes only one file by session
export default function executeSQLFile(sqlFileName: string) {
    const queries: string = readSQLFile(sqlFileName);

    connection.query(queries, function(err, result) {
        if (err) {
            console.log(`Error during initTables.ts with file ${sqlFileName} query script work`);
            throw err;
        }
        console.log(`Query result form file ${sqlFileName} : ${result}`);
        connection.end();
    });
};

export function readSQLFile(sqlFileName: string): string {
    const sqlPath: string = path.join(__dirname, "../../../src/models/v1/sql-files", sqlFileName);
    return fs.readFileSync(sqlPath).toString();
}