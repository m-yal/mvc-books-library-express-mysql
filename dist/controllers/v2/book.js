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
exports.wantBook = exports.getBook = void 0;
const connection_1 = __importDefault(require("../../models/utils/connection"));
const singleBookViewPath = "v2/book/index";
const getBookIdSQL = `SELECT * FROM books WHERE id = ? AND is_deleted = FALSE;`;
const getAuthorsIdsSQL = `SELECT author_id FROM books_authors WHERE book_id = ?;`;
const getAuthorNameSQL = `SELECT author FROM authors WHERE id = ?;`;
function getBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield queryBookData(req, res);
            yield res.status(200);
            yield res.render(singleBookViewPath, { book: res.locals.book });
        }
        catch (err) {
            yield res.status(500);
            yield res.json({ error: "Error during getting single book -> " + err });
        }
    });
}
exports.getBook = getBook;
function queryBookData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bookId = req.params.bookId;
            yield Promise.all([
                queryBookById(res, bookId),
                queryAuthors(req, res, bookId),
                incrCounter("visits", bookId)
            ]);
            res.locals.book.authors = yield res.locals.authors;
        }
        catch (err) {
            throw Error("Error in databese during getting single book -> " + err);
        }
    });
}
function queryBookById(res, bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bookIdResponse = yield (yield connection_1.default).query(getBookIdSQL, [bookId]);
            res.locals.book = bookIdResponse[0][0];
        }
        catch (err) {
            throw Error("Error during querying book data by id: " + err);
        }
    });
}
function queryAuthors(req, res, bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorsIdsResponse = yield (yield connection_1.default).query(getAuthorsIdsSQL, [bookId]);
            res.locals.authors_ids = authorsIdsResponse[0];
            const authorsAmount = res.locals.authors_ids.length;
            const queries = [];
            res.locals.authors = [];
            for (let i = 0; i < authorsAmount; i++) {
                queries.push(yield queryAuthorsNames(req, res, res.locals.authors_ids[i].author_id));
            }
            yield Promise.all(queries);
        }
        catch (err) {
            throw Error("Error during querying authors id: " + err);
        }
    });
}
function queryAuthorsNames(req, res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorsNamesResponse = yield (yield connection_1.default).query(getAuthorNameSQL, [id]);
            const name = authorsNamesResponse[0][0].author;
            res.locals.authors.push(name);
        }
        catch (err) {
            throw Error("Error during querying authors: " + err);
        }
    });
}
function incrCounter(type, bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const incrCounterSQL = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ?;`;
            return yield (yield connection_1.default).query(incrCounterSQL, [bookId]);
        }
        catch (err) {
            throw Error(`Error during increasing ${type} counter of book ${bookId} -> ${err}`);
        }
    });
}
function wantBook(req, res) {
    try {
        incrCounter("wants", req.params.bookId);
        res.status(200);
        res.json({ ok: true });
    }
    catch (err) {
        res.status(500);
        res.json({ error: err });
    }
}
exports.wantBook = wantBook;
