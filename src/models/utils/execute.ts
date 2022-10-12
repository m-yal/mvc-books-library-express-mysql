import path from "path";
import connection from "./connection";
import fs from "fs";

// Executes only one file by session
export default function executeSQLFile(sqlFileName: string, version: "v1" | "v2") {
    const queries: string = readSQLFile(sqlFileName, version);

    connection.query(queries, function(err, result) {
        if (err) {
            console.log(`Error during initTables.ts with file ${sqlFileName} query script work`);
            throw err;
        }
        console.log(`Query result form file ${sqlFileName} : ${result}`);
        connection.end();
    });
};

export function readSQLFile(sqlFileName: string, version: "v1" | "v2"): string {
    const sqlPath: string = path.join(__dirname, `../../../src/models/${version}/sql-files`, sqlFileName);
    return fs.readFileSync(sqlPath).toString();
}