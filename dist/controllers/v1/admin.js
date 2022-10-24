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
const adminV1Href = "http://localhost:3005/api/v1/admin";
const authV1Href = "http://localhost:3005/api/v1/auth";
const adminV1View = "v1/admin/index";
const sessionsTableName = "sessions_v1";
const booksV1TableName = "books";
const sessionChechSQL = `SELECT EXISTS(SELECT 1 FROM ${sessionsTableName} WHERE id LIKE ? LIMIT 1) as dbResponse;`;
const deleteBookSQL = `UPDATE ${booksV1TableName} SET is_deleted = TRUE WHERE id = ?`;
const booksListSQL = `SELECT * FROM ${booksV1TableName} WHERE is_deleted = FALSE LIMIT ? OFFSET ?;`;
const pagesCountSQL = `SELECT COUNT(*) AS count FROM ${booksV1TableName} WHERE is_deleted = FALSE;`;
const addBookSQL = `INSERT INTO ${booksV1TableName}(book_name, publish_year, image_path, book_description, author_1, 
    author_2, author_3) VALUES (?, ?, ?, ?, ?, ?, ?);`;
function deleteBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (yield isSessionPermited(req)) {
                deleteBookQuery(req, res);
                yield res.status(200);
                yield res.send({ ok: true });
            }
            else {
                yield res.status(401);
                yield res.redirect(authV1Href);
            }
        }
        catch (err) {
            yield res.status(500);
            res.redirect(authV1Href);
        }
    });
}
exports.deleteBook = deleteBook;
function isSessionPermited(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sessionCheckResp = yield (yield connection_1.default).query(sessionChechSQL, [req.sessionID]);
            const isSessionPermited = Boolean(sessionCheckResp[0][0].dbResponse);
            return isSessionPermited;
        }
        catch (err) {
            throw Error("Error during checking session presence in db -> ");
        }
    });
}
function deleteBookQuery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (yield connection_1.default).query(deleteBookSQL, [req.params.id]);
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
                yield res.status(200);
                yield res.render(adminV1View, { books: books, pagesAmount: count / LIMIT, currentPage: (req.query.offset / LIMIT) + 1 });
            }
            else {
                yield res.status(401);
                yield res.redirect(authV1Href);
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
            const booksResp = yield (yield connection_1.default).query(booksListSQL, [Number(LIMIT), Number(offset)]);
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
            const countResp = yield (yield connection_1.default).query(pagesCountSQL);
            const count = countResp[0][0].count;
            return count;
        }
        catch (err) {
            throw Error("Error during defining pages amount -> " + err);
        }
    });
}
function addBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (yield isSessionPermited(req)) {
                addBookQuery(req, res);
            }
            else {
                yield res.status(401);
                yield res.redirect(authV1Href);
            }
        }
        catch (err) {
            yield res.status(500);
            yield res.redirect(authV1Href);
        }
    });
}
exports.addBook = addBook;
function addBookQuery(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { bookName, publishYear, author_1, author_2, author_3, description } = req.body;
            const imagePath = ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || null;
            yield (yield connection_1.default).query(addBookSQL, [bookName, (publishYear || 0), imagePath, description, author_1, author_2, author_3]);
            yield res.status(200);
            yield res.redirect(adminV1Href);
        }
        catch (err) {
            throw Error("Error during adding book to v1 db -> " + err);
        }
    });
}
