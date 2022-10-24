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
const validator_1 = __importDefault(require("validator"));
const LIMIT = 20;
const queryAllBooksSQL = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ? OFFSET ?;`;
const countAllBooksSQL = `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`;
const adminViewPath = "v2/admin/index";
const booksViewPath = `v2/books/index`;
function getBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof req.query.search === "string") {
            search(req, res);
        }
        else {
            getAll(req, res, false);
        }
    });
}
exports.getBooks = getBooks;
;
function getAll(req, res, isAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield queryBooks(req, res);
            yield countBooksAmount(req, res);
            yield queryAuthors(res);
            yield renderResult(res, isAdmin);
        }
        catch (err) {
            yield res.status(500);
            yield res.json("Error occured during getting books list -> " + err);
        }
    });
}
exports.getAll = getAll;
;
function queryBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            res.locals.search = null;
            res.locals.offset = req.query.offset || 0;
            const [booksData] = yield (yield connection_1.default).query(queryAllBooksSQL, [LIMIT, +res.locals.offset]);
            res.locals.books = booksData;
        }
        catch (err) {
            throw Error("Error during querying main books data from db -> " + err);
        }
    });
}
function countBooksAmount(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foundBooksCountSQLQuery = (typeof res.locals.search === null) ? countAllBooksSQL : composeSearchCountSQL(res);
            const [countResp] = yield (yield connection_1.default).query(foundBooksCountSQLQuery);
            const count = yield countResp[0].count;
            res.locals.pagesStatus = yield assemblePagesStatusData(res.locals.offset, count);
        }
        catch (err) {
            throw Error("Error during querying found books count from db -> " + err);
        }
    });
}
function queryAuthors(res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorsQueries = [];
            for (const item of res.locals.books) {
                authorsQueries.push(yield queryAuthorsNames(item));
            }
            yield Promise.all([authorsQueries]);
        }
        catch (err) {
            throw Error("Error during querying authors list from db -> " + err);
        }
    });
}
function renderResult(res, isAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield res.status(200);
            if (isAdmin) {
                return yield res.render(adminViewPath, { books: res.locals.books, pagesAmount: res.locals.pagesStatus.totalyFound / LIMIT, currentPage: (res.locals.offset / LIMIT) + 1 });
            }
            return yield res.render(booksViewPath, { books: res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus });
        }
        catch (err) {
            throw Error("Error assembling response for rendering or rendering -> " + err);
        }
    });
}
function queryAuthorsNames(book) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [authorsIds] = yield (yield connection_1.default).execute(`SELECT author_id FROM books_authors WHERE book_id = ${book.id};`);
            book.authors = [];
            for (const item of authorsIds) {
                const nameResponse = yield (yield connection_1.default).execute(`SELECT author FROM authors WHERE id = ${item.author_id}`);
                const name = nameResponse[0][0].author;
                yield book.authors.push(yield name);
            }
            return book.authors;
        }
        catch (err) {
            throw Error("Error during querying authors names from db -> " + err);
        }
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
            replaceQueryStringsToResponseLocals(req, res);
            yield queryMainBookData(res);
            yield countBooksAmount(req, res);
            yield queryAuthors(res);
            finish(res);
        }
        catch (err) {
            yield res.status(500);
            return res.json({ error: "Error in database during searching books: " + err });
        }
    });
}
;
function replaceQueryStringsToResponseLocals(req, res) {
    res.locals.search = req.query.search === undefined ? undefined : validator_1.default.escape(req.query.search);
    res.locals.year = req.query.year === undefined ? undefined : validator_1.default.escape(req.query.year);
    res.locals.author = req.query.author === undefined ? undefined : validator_1.default.escape(req.query.autho);
    res.locals.search = req.query.search === undefined ? undefined : validator_1.default.escape(req.query.search);
    res.locals.offset = req.query.offset === undefined ? "0" : validator_1.default.escape(req.query.offset);
}
function queryMainBookData(res) {
    return __awaiter(this, void 0, void 0, function* () {
        const [booksData] = yield (yield connection_1.default).query(composeSLQSearchQuery(res));
        res.locals.books = booksData;
    });
}
function composeSLQSearchQuery(res) {
    const search = res.locals.search;
    const main = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${search}%'`;
    const author = res.locals.author ? ` AND autor_id = ${res.locals.author}` : "";
    const year = res.locals.year ? ` AND year = ${res.locals.year}` : "";
    const orderBy = `ORDER BY book_name ASC`;
    const offset = `LIMIT ${LIMIT} OFFSET ${res.locals.offset};`;
    return main + " " + [author, year].join("") + " " + orderBy + " " + offset;
}
function composeSearchCountSQL(res) {
    const offset = res.locals.offset;
    const limitOffset = `LIMIT ${LIMIT} OFFSET ${offset}`;
    return `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC ${limitOffset};`
        .replace("*", "COUNT(*) AS count")
        .replace("ORDER BY book_name ASC", "")
        .replace(limitOffset, "");
}
function finish(res) {
    res.status(200);
    res.render(booksViewPath, { books: res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus });
}
