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
exports.getAll = exports.getBooks = void 0;
const connection_1 = __importDefault(require("../../models/utils/connection"));
const LIMIT = 20;
function getBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof req.query.search === "string") {
            res.locals.search = req.query.search;
            search(req, res);
        }
        else {
            res.locals.search = null;
            getAll(req, res, false);
        }
    });
}
exports.getBooks = getBooks;
;
function getAll(req, res, isAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.offset = req.query.offset || 0;
        const sql = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ${LIMIT} OFFSET ${res.locals.offset};`;
        const [booksData] = yield (yield connection_1.default).query(sql);
        res.locals.books = booksData;
        yield countBooksAmount(res, sql, req);
        const authorsQueries = [];
        for (const item of res.locals.books) {
            authorsQueries.push(yield queryAuthorsNames(req, res, item));
        }
        yield Promise.all([authorsQueries]);
        yield res.status(200);
        if (isAdmin) {
            yield res.render("v2/admin/index", { books: res.locals.books, pagesAmount: res.locals.pagesStatus.totalyFound / LIMIT, currentPage: (res.locals.offset / LIMIT) + 1 });
        }
        else {
            yield res.render(`v2/books/index`, { books: res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus });
        }
    });
}
exports.getAll = getAll;
;
function queryAuthorsNames(req, res, book) {
    return __awaiter(this, void 0, void 0, function* () {
        const [authorsIds] = yield (yield connection_1.default).execute(`SELECT author_id FROM books_authors WHERE book_id = ${book.id};`);
        book.authors = [];
        for (const item of authorsIds) {
            let name = yield (yield connection_1.default).execute(`SELECT author FROM authors WHERE id = ${item.author_id}`)
                .then(result => {
                const nameArr = result[0];
                const name = nameArr[0].author;
                return name;
            });
            yield book.authors.push(yield name);
        }
        return book.authors;
    });
}
function countBooksAmount(res, sql, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundBooksCountSQLQuery = (typeof res.locals.search === null) ?
            `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`
            : composeFoundBooksCountQuery(sql, `LIMIT ${LIMIT} OFFSET ${req.query.offset}`);
        yield (yield connection_1.default).query(foundBooksCountSQLQuery)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            const count = yield result[0][0].count;
            res.locals.pagesStatus = yield assemblePagesStatusData(res.locals.offset, count);
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            throw err;
        }));
    });
}
function assemblePagesStatusData(offset, count) {
    const pagesStatus = {
        offsetAhead: +offset + LIMIT,
        offsetBack: +offset - LIMIT,
        totalyFound: count,
    };
    pagesStatus.hasNextPage = pagesStatus.offsetAhead <= pagesStatus.totalyFound;
    pagesStatus.hasPrevPage = pagesStatus.offsetBack >= 0;
    return pagesStatus;
}
function search(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            assembleQueryStringsToLocals(req, res);
            const sql = composeSLQQuery(res);
            const [booksData] = yield (yield connection_1.default).query(sql);
            res.locals.books = booksData;
            yield countBooksAmount(res, sql, req);
            const authorsQueries = [];
            for (let i = 0; i < res.locals.books.length; i++) {
                authorsQueries.push(yield queryAuthorsNames(req, res, res.locals.books[i]));
            }
            yield Promise.all([authorsQueries]);
            yield res.status(200);
            yield res.render("v2/books/index", { books: res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus });
        }
        catch (err) {
            yield res.status(500);
            return res.json({ error: "Error in database during searching books: " + err });
        }
    });
}
;
function assembleQueryStringsToLocals(req, res) {
    res.locals.year = req.query.year;
    res.locals.author = req.query.author;
    res.locals.search = req.query.search;
    res.locals.offset = req.query.offset || 0;
}
function composeSLQQuery(res) {
    let sql;
    const authorQuery = res.locals.author ? `autor_id = ${res.locals.author}` : "";
    const yearQuery = res.locals.year ? `year = ${res.locals.year}` : "";
    const offsetQuery = `LIMIT ${LIMIT} OFFSET ${res.locals.offset}`;
    if (!res.locals.author && !res.locals.year) {
        sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${res.locals.search}%' ORDER BY book_name ASC ${offsetQuery};`;
    }
    else {
        if (res.locals.author && res.locals.year) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${res.locals.search}%' AND ${authorQuery} AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
        else if (res.locals.author) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${res.locals.search}%' AND ${authorQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
        else {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${res.locals.search}%' AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
    }
    return sql;
}
function composeFoundBooksCountQuery(sql, offset) {
    return sql
        .replace("*", "COUNT(*) AS count")
        .replace("ORDER BY book_name ASC", "")
        .replace(offset, "");
}
