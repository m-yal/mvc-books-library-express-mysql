import cron from "node-cron";
import { exec } from "child_process";
import mysqldump from "mysqldump";

export default function launchCron() {
    cron.schedule("* * 23 * * *", () => {
        const fileName: string = `dump-${Date.now()}.sql`;
        const dirName: string = `dumps`; // comparing to project`s root
        exec(`cd ${dirName} && touch ${fileName}`, (error: any, stdout: any, stderr: any) => {
            if(hasOccured(error, stderr)) return;
            dumpDBData(dirName, fileName);
            hardDelete("v2");//"v2" to constants
        })
    });
}

function hasOccured(error: any, stderr: any): boolean {
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

function dumpDBData(dirName: string, fileName: string) {
    mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            password: '123321',
            database: 'library',
        },
        dumpToFile: `${dirName}/${fileName}`,
    });
    console.log(`Dumping to file ${fileName} completed!`);
}

function hardDelete(dbVersion: "v1" | "v2") {
    exec(`npm run delete-hard-${dbVersion}`, (error: any, stdout: any, stderr: any) => {
        if(hasOccured(error, stderr)) return;
        console.log(`Hard deletion in db version ${dbVersion} executed.`);
    })
}