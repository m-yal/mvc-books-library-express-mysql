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
    const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    connection_1.default.query(sql, (err, result) => {
        try {
            if (err)
                throw err;
            const isSessionPermited = Boolean(result[0].dbResponse);
            if (isSessionPermited) {
                deleteBookQuery(req, res);
            }
            else {
                res.status(401);
                res.redirect("http://localhost:3005/api/v1/auth");
            }
        }
        catch (err) {
            console.error(err);
            res.status(500);
            res.redirect("http://localhost:3005/api/v1/auth");
        }
    });
}
exports.deleteBook = deleteBook;
function deleteBookQuery(req, res) {
    const bookId = req.params.id;
    const sql = `UPDATE books SET is_deleted = TRUE WHERE id = ${bookId}`;
    connection_1.default.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (err)
                throw err;
            yield res.status(200);
            yield res.send({ ok: true });
        }
        catch (err) {
            yield res.status(500);
            return yield res.send({ error: "Error during deleting" });
        }
    }));
}
function getBooks(req, res) {
    const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    connection_1.default.query(sql, (err, result) => {
        try {
            if (err)
                throw err;
            const isSessionPermited = Boolean(result[0].dbResponse);
            if (isSessionPermited) {
                queryBooksList(req, res);
            }
            else {
                res.status(401);
                res.redirect("http://localhost:3005/api/v1/auth");
            }
        }
        catch (err) {
            console.error(err);
            res.status(500);
            res.redirect("http://localhost:3005/api/v1/auth");
        }
    });
}
exports.getBooks = getBooks;
function queryBooksList(req, res) {
    const offset = req.query.offset || 0;
    const sql = `SELECT * FROM books WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
    connection_1.default.query(sql, (err, books) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (err)
                throw err;
            definePagesAmount(res, books, offset);
        }
        catch (err) {
            yield res.status(500);
            return yield res.send({ error: `Error in database during getting books list for admin with offset ${offset}: ${err}` });
        }
    }));
}
function definePagesAmount(res, books, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        connection_1.default.query(`SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`, (err, rowsCount) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err)
                    throw err;
                yield res.render("v1/admin/index", { books: yield books, pagesAmount: (yield rowsCount[0].count) / LIMIT, currentPage: (offset / LIMIT) + 1 });
            }
            catch (err) {
                throw err;
            }
        }));
    });
}
function addBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INSIDE addBook");
        const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
        connection_1.default.query(sql, (err, result) => {
            try {
                if (err)
                    throw err;
                const isSessionPermited = Boolean(result[0].dbResponse);
                console.log("isSessionPermited " + isSessionPermited);
                if (isSessionPermited) {
                    addBookQuery(req, res);
                }
                else {
                    res.status(401);
                    res.redirect("http://localhost:3005/api/v1/auth");
                }
            }
            catch (err) {
                console.error(err);
                res.status(500);
                res.redirect("http://localhost:3005/api/v1/auth");
            }
        });
    });
}
exports.addBook = addBook;
function addBookQuery(req, res) {
    connection_1.default.query(assembleAddBookSqlQuery(req), (err, result) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (err)
                throw err;
            yield res.status(200);
            yield res.redirect("http://localhost:3005/api/v1/admin");
        }
        catch (err) {
            yield res.status(500);
            return yield res.send({ error: "Error in database during adding new book: " + err });
        }
    }));
}
function assembleAddBookSqlQuery(req) {
    var _a;
    const { bookName, publishYear, author_1, author_2, author_3, description } = req.body;
    const imagePath = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || null;
    return `INSERT INTO books(book_name, publish_year, image_path, book_description, author_1, author_2, author_3) VALUES ('${bookName}', ${publishYear || 0}, '${imagePath}', '${description}', '${author_1}', '${author_2}', '${author_3}');`;
}
