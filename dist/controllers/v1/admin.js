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
const LIMIT = 20;
function deleteBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isPermited = yield isSessionPermited(req);
            if (isPermited) {
                deleteBookQuery(req, res);
                yield res.status(200);
                yield res.send({ ok: true });
            }
            else {
                yield res.status(401);
                yield res.redirect("http://localhost:3005/api/v1/auth");
            }
        }
        catch (err) {
            yield res.status(500);
            res.redirect("http://localhost:3005/api/v1/auth");
        }
    });
}
exports.deleteBook = deleteBook;
function isSessionPermited(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const checkSessionSQL = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
        const sessionCheckResp = yield (yield connection_1.default).query(checkSessionSQL);
        const isSessionPermited = Boolean(sessionCheckResp[0][0].dbResponse);
        return isSessionPermited;
    });
}
function deleteBookQuery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bookId = req.params.id;
            const deleteSQL = `UPDATE books SET is_deleted = TRUE WHERE id = ${bookId}`;
            yield (yield connection_1.default).query(deleteSQL);
        }
        catch (err) {
            throw Error("Error during deleting book from db query -> " + err);
        }
    });
}
function getBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (yield isSessionPermited(req)) {
                const books = yield queryBooksList(req, res);
                const count = yield definePagesAmount(res, books, req.query.offset);
                console.log("count " + JSON.stringify(count));
                res.status(200);
                yield res.render("v1/admin/index", { books: books, pagesAmount: count / LIMIT, currentPage: (req.query.offset / LIMIT) + 1 });
            }
            else {
                res.status(401);
                res.redirect("http://localhost:3005/api/v1/auth");
            }
        }
        catch (err) {
            yield res.status(500);
            yield res.json("Error during getting books for admin -> " + err);
        }
    });
}
exports.getBooks = getBooks;
function queryBooksList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const offset = req.query.offset || 0;
            const booksListSQL = `SELECT * FROM books WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
            const booksResp = yield (yield connection_1.default).query(booksListSQL);
            const books = booksResp[0];
            return books;
        }
        catch (err) {
            throw Error(`Error in database during getting books list for admin with offset -> ${err}`);
        }
    });
}
function definePagesAmount(res, books, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pagesCountSQL = `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`;
            const countResp = yield (yield connection_1.default).query(pagesCountSQL);
            console.log("countResp " + JSON.stringify(countResp));
            const count = countResp[0][0].count;
            console.log("count " + JSON.stringify(count));
            return count;
        }
        catch (err) {
            throw Error("Error during defining pages amount -> " + err);
        }
    });
}
function addBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INSIDE addBook");
        const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
        // connection.query(sql, (err, result) => {
        //     try {
        //         if (err) throw err;
        //         const isSessionPermited = Boolean(result[0].dbResponse);
        //         console.log("isSessionPermited " + isSessionPermited);
        //         if (isSessionPermited) {
        //             addBookQuery(req, res);
        //         } else {
        //             res.status(401);
        //             res.redirect("http://localhost:3005/api/v1/auth");
        //         }
        //     } catch (err) {
        //         console.error(err);
        //         res.status(500);
        //         res.redirect("http://localhost:3005/api/v1/auth");
        //     }
        // });
    });
}
exports.addBook = addBook;
function addBookQuery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // connection.query(assembleAddBookSqlQuery(req), async (err, result) => {
        //     try {
        //         if (err) throw err;
        //         await res.status(200);
        //         await res.redirect("http://localhost:3005/api/v1/admin"); 
        //     } catch (err) {
        //         await res.status(500);
        //         return await res.send({error: "Error in database during adding new book: " + err});
        //     }
        // });
    });
}
function assembleAddBookSqlQuery(req) {
    var _a;
    const { bookName, publishYear, author_1, author_2, author_3, description } = req.body;
    const imagePath = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || null;
    return `INSERT INTO books(book_name, publish_year, image_path, book_description, author_1, 
        author_2, author_3) VALUES ('${bookName}', ${publishYear || 0}, '${imagePath}', 
        '${description}', '${author_1}', '${author_2}', '${author_3}');`;
}
