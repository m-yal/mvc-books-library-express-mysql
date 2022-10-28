import path from "path";
import connection from "./connection";
import fs from "fs";
import {ApiVersion} from "../../types";

// Executes only one file by session
export default async function executeSQLFile(sqlFileName: string, version: ApiVersion): Promise<void> {
    const queries: string = readSQLFile(sqlFileName, version);
    try {
        await (await connection).query(queries);
        await (await connection).end();
        console.log("SQL files executed, connection to DB ended");
    } catch (err) {
        console.log(`Error during executing sql file ${sqlFileName} or ending connection`);
        throw err;
    }
};

export function readSQLFile(sqlFileName: string, version: ApiVersion): string {
    const sqlPath: string = path.join(__dirname, `../../../src/models/${version}/sql-files`, sqlFileName);
    return fs.readFileSync(sqlPath).toString();
}