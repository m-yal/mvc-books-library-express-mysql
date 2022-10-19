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
exports.addBook = exports.getBooks = exports.deleteBook = void 0;
const connection_1 = __importDefault(require("../../models/utils/connection"));
const books_1 = require("./books");
const LIMIT = 20;
function deleteBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
        (yield connection_1.default).query(sql)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            const isSessionPresent = yield result[0].dbResponse;
            console.log("IS SESSION EXISTS DURING DELETING BOOK: " + isSessionPresent);
            if (!isSessionPresent) {
                yield res.status(401);
                return yield res.redirect(`http://localhost:3005/auth`);
            }
            ;
            deleteBookQuery(req, res);
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield res.status(500);
            return yield res.send({ error: "Error during deleting" });
        }));
    });
}
exports.deleteBook = deleteBook;
function deleteBookQuery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookId = req.params.id;
        const sql = `UPDATE books SET is_deleted = TRUE WHERE id = ${bookId}`;
        (yield connection_1.default).query(sql)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            yield res.status(200);
            yield res.send({ ok: true });
        }))
            .catch(err => {
            console.log("Error during deleting book");
            throw err;
        });
    });
}
function getBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
        (yield connection_1.default).query(sql)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            const isSessionPresent = Boolean(result[0].dbResponse);
            console.log("IS SESSION PRESENT DURING GETTING BOOKS: " + isSessionPresent);
            if (isSessionPresent) {
                yield (0, books_1.getAll)(req, res, true);
            }
            else {
                res.status(401);
                res.redirect("http://localhost:3005/auth");
            }
        }));
    });
}
exports.getBooks = getBooks;
// function queryBooksList(req: any, res: any) {
//     const offset = req.query.offset || 0;
//     const sql = `SELECT * FROM books WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
//     // connection.query(sql, async (err, books) => {
//     //     try {
//     //         if (err) throw err;
//     //         definePagesAmount(res, books, offset);
//     //     } catch (err) {
//     //         await res.status(500);
//     //         return await res.send({error: `Error in database during getting books list for admin with offset ${offset}: ${err}`})
//     //     }
//     // });
// }
// async function definePagesAmount(res: any, books: any, offset: any) {
//     // connection.query(`SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`, async (err, rowsCount) => {
//     //     try {
//     //         if (err) throw err;
//     //         await res.render("v1/admin/index", {books: await books, pagesAmount: await rowsCount[0].count / LIMIT, currentPage: (offset / LIMIT) + 1 });
//     //     } catch (err) {
//     //         throw err;
//     //     }
//     // });
// }
function addBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
        (yield connection_1.default).query(sql)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            const isSessionPresent = yield result[0].dbResponse;
            console.log("IS SESSION EXISTS DURING ADDING BOOK: " + isSessionPresent);
            if (!isSessionPresent) {
                yield res.status(401);
                return yield res.redirect(`http://localhost:3005/auth`);
            }
            ;
            yield Promise.all([
                addBookDataQuery(req, res),
                addAuthors(req, res)
            ]);
            const queries = [];
            const authorsAmount = res.locals.authorsIds.length;
            for (let i = 0; i < authorsAmount; i++) {
                queries.push((yield connection_1.default)
                    .query(`INSERT INTO books_authors(book_id, author_id) VALUES(${res.locals.bookId}, ${res.locals.authorsIds[i]});`));
            }
            yield Promise.all(queries);
            yield res.status(200);
            return yield res.redirect("http://localhost:3005/admin");
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield res.status(500);
            return yield res.send({ error: "Error during adding book" });
        }));
    });
}
exports.addBook = addBook;
function addBookDataQuery(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { bookName, publishYear, description } = req.body;
        const imagePath = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || null;
        const sql = `INSERT INTO books(book_name, publish_year, image_path, book_description) VALUES ('${bookName}', ${publishYear || 0}, '${imagePath}', '${description}');
        SELECT id FROM books WHERE book_name === ${bookName};`;
        (yield connection_1.default).query(sql)
            .then(result => {
            console.log("RESULT FROM ADD BOOK QUERY: " + JSON.stringify(result));
            console.log("ADDED BOOK ID " + result[1]);
            res.locals.bookId = result[1];
        })
            .catch(err => {
            console.log("Error during add book query");
            throw err;
        });
    });
}
function addAuthors(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const [author_1, author_2, author_3] = req.body;
        res.locals.authorsIds = [];
        if (author_1) {
            (yield connection_1.default).query(`INSERT INTO authors(author) VALUES(${author_1});`);
            res.locals.authorsIds.push((yield connection_1.default).query(`SELECT id FROM authors WHERE author = ${author_1};`));
        }
        if (author_2) {
            (yield connection_1.default).query(`INSERT INTO authors(author) VALUES(${author_2});`);
            res.locals.authorsIds.push((yield connection_1.default).query(`SELECT id FROM authors WHERE author = ${author_2};`));
        }
        if (author_2) {
            (yield connection_1.default).query(`INSERT INTO authors(author) VALUES(${author_2});`);
            res.locals.authorsIds.push((yield connection_1.default).query(`SELECT id FROM authors WHERE author = ${author_2};`));
        }
    });
}
// function assembleAddBookSqlQuery(req: any) {
//     const {bookName, publishYear, author_1, author_2, author_3, description} = req.body;
//     const imagePath = req.file?.filename || null;
//     return `INSERT INTO books(book_name, publish_year, image_path, book_description, author_1, author_2, author_3)
//      VALUES ('${bookName}', ${publishYear || 0}, '${imagePath}', '${description}', '${author_1}', '${author_2}', '${author_3}');`;
// }
