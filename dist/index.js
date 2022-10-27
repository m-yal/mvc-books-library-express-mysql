"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const books_1 = __importDefault(require("./routes/v1/books"));
const book_1 = require("./routes/v1/book");
const auth_1 = __importDefault(require("./routes/v1/auth"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = __importDefault(require("./models/utils/connection"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const express_session_1 = __importDefault(require("express-session"));
const node_cron_1 = __importDefault(require("node-cron"));
const mysqldump_1 = __importDefault(require("mysqldump"));
const child_process_1 = require("child_process");
exports.app = (0, express_1.default)();
dotenv_1.default.config();
exports.app.set("views", path_1.default.join(__dirname, "../src", "views"));
exports.app.set('view engine', 'ejs');
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use(express_1.default.static("public"));
exports.app.use((0, express_session_1.default)({
    name: "sid",
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    genid: function (req) {
        const sid = (0, uuid_1.v4)();
        console.log('Session id created: ' + sid);
        return sid;
    },
}));
connection_1.default;
// v1 routes
const admin_1 = __importDefault(require("./routes/v1/admin"));
exports.app.use("/api/v1", books_1.default); //get list of books
exports.app.use("/api/v1", book_1.bookRouter); //get single book
exports.app.use("/api/v1", auth_1.default);
exports.app.use("/api/v1", admin_1.default);
// v2 routes
const books_2 = __importDefault(require("./routes/v2/books"));
const book_2 = require("./routes/v2/book");
const auth_2 = __importDefault(require("./routes/v2/auth"));
const admin_2 = __importDefault(require("./routes/v2/admin"));
exports.app.use("", books_2.default); //get list of books
exports.app.use("", book_2.bookRouter); //get single book
exports.app.use("", auth_2.default);
exports.app.use("", admin_2.default);
exports.app.use(function (req, res, next) {
    res.status(404).send({ error: "Not Found Page" });
});
exports.PORT = process.env.PORT || "3005";
exports.app.listen(exports.PORT);
console.log("Server started on port " + exports.PORT);
node_cron_1.default.schedule("* * 23 * * *", () => {
    const dumpFileName = `dump-${Date.now()}.sql`;
    const dumpDirName = `dumps`; //comparing to root
    (0, child_process_1.exec)(`cd ${dumpDirName} && touch ${dumpFileName}`, (error, stdout, stderr) => {
        if (hasOccured(error, stderr))
            return;
        dumpDBData(dumpDirName, dumpFileName);
        hardDelete("v2"); //"v2" to constants
    });
});
function hasOccured(error, stderr) {
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
function dumpDBData(dumpDirName, dumpFileName) {
    (0, mysqldump_1.default)({
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
function hardDelete(dbVersion) {
    (0, child_process_1.exec)(`npm run delete-hard-${dbVersion}`, (error, stdout, stderr) => {
        if (hasOccured(error, stderr))
            return;
        console.log(`Hard deletion in db version ${dbVersion} executed.`);
    });
}
console.log("process.cwd() " + process.cwd());
