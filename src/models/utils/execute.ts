import path from "path";
import connection from "./connection";
import fs from "fs";

// Executes only one file by session
export default async function executeSQLFile(sqlFileName: string, version: "v1" | "v2") {
    const queries: string = readSQLFile(sqlFileName, version);
    try {
        let conn = await connection;
        await conn.query(queries);
        await conn.end();
        console.log("SQL files executed, connection ended");
    } catch (err) {
        console.log(`Error during executing sql file ${sqlFileName} or ending connection`);
        throw err;
    }
};

export function readSQLFile(sqlFileName: string, version: "v1" | "v2"): string {
    const sqlPath: string = path.join(__dirname, `../../../src/models/${version}/sql-files`, sqlFileName);
    return fs.readFileSync(sqlPath).toString();
}