import cron from "node-cron";
import { exec, ExecException } from "child_process";
import mysqldump from "mysqldump";
import { CRON_SCHEDULE, DUMPS_PATH } from "../constants";
import dotenv from "dotenv";
import { DB_VERSIONS } from "../types";

dotenv.config();

export default function launchCron(): void {
    cron.schedule(CRON_SCHEDULE, () => {
        const fileName: string = `dump-${Date.now()}.sql`;
        const dirName: string = DUMPS_PATH; // comparing to project`s root
        exec(`cd ${dirName} && touch ${fileName}`, (error: ExecException | null, stdout: string, stderr: string) => {
            if(hasOccured(error, stderr)) return;
            dumpDBData(dirName, fileName);
            hardDelete("v2");
        })
    });
}

function hasOccured(error: ExecException | null, stderr: string): boolean {
    if (error) {
        console.error(`error: ${error.message}`);
        return true;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return true;
    }
    return false;
}

function dumpDBData(dirName: string, fileName: string): void {
    mysqldump({
        connection: {
            host: String(process.env.HOST),
            user: String(process.env.DB_LOGIN),
            password: String(process.env.DB_PASS),
            database: String(process.env.DB_NAME),
        },
        dumpToFile: `${dirName}/${fileName}`,
    });
    console.log(`Dumping to file ${fileName} completed!`);
}

function hardDelete(dbVersion: DB_VERSIONS): void {
    exec(`npm run delete-hard-${dbVersion}`, (error: ExecException | null, stdout: string, stderr: string) => {
        if(hasOccured(error, stderr)) return;
        console.log(`Hard deletion in db version ${dbVersion} executed.`);
    })
}