import express from "express";
import booksRouterV1 from "./routes/v1/books";
import {bookRouter as singleBookRouterV1} from "./routes/v1/book";
import authRouterV1 from "./routes/v1/auth";
import dotenv from "dotenv";
import connection from "./models/utils/connection";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import session, { Cookie } from "express-session";
import cron from "node-cron";
import mysqldump from "mysqldump";
import { exec } from "child_process";

export const app = express();

dotenv.config();

app.set("views", path.join(__dirname, "../src", "views"))
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(session({
    name: "sid",
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    genid: function(req) {
        const sid = uuidv4();
        console.log('Session id created: ' + sid);
        return sid;
    },
}));

connection;

// v1 routes
import adminRouterV1 from "./routes/v1/admin";
app.use("/api/v1", booksRouterV1); //get list of books
app.use("/api/v1", singleBookRouterV1); //get single book
app.use("/api/v1", authRouterV1);
app.use("/api/v1", adminRouterV1);

// v2 routes
import booksRouterV2 from "./routes/v2/books";
import {bookRouter as singleBookRouterV2} from "./routes/v2/book";
import authRouterV2 from "./routes/v2/auth";
import adminRouterV2 from "./routes/v2/admin";
app.use("", booksRouterV2); //get list of books
app.use("", singleBookRouterV2); //get single book
app.use("", authRouterV2);
app.use("", adminRouterV2);

app.use(function(req, res, next) {
    res.status(404).send({error: "Not Found Page"});
});

export const PORT: string = process.env.PORT || "3005";
app.listen(PORT);
console.log("Server started on port " + PORT);

cron.schedule("* * 23 * * *", () => {
    const dumpFileName: string = `dump-${Date.now()}.sql`;
    const dumpDirName: string = `dumps`; //comparing to root
    exec(`cd ${dumpDirName} && touch ${dumpFileName}`, (error, stdout, stderr) => {
        if(hasOccured(error, stderr)) return;
        dumpDBData(dumpDirName, dumpFileName);
        hardDelete("v2");//"v2" to constants
    })
})

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

function dumpDBData(dumpDirName: string, dumpFileName: string) {
    mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            password: '123321',
            database: 'library',
        },
        dumpToFile: `${dumpDirName}/${dumpFileName}`,
    });
    console.log(`Dumping to file ${dumpFileName} completed!`);
}

function hardDelete(dbVersion: "v1" | "v2") {
    exec(`npm run delete-hard-${dbVersion}`, (error, stdout, stderr) => {
        if(hasOccured(error, stderr)) return;
        console.log(`Hard deletion in db version ${dbVersion} executed.`);
    })
}