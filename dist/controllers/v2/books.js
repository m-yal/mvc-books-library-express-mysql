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
exports.getBooks = void 0;
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
            getAll(req, res);
        }
    });
}
exports.getBooks = getBooks;
;
function getAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.offset = req.query.offset || 0;
        const sql = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ${LIMIT} OFFSET ${res.locals.offset};`;
        (yield connection_1.default).query(sql)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            res.locals.books = result[0];
            console.log("GET ALL QUERY RESULT[0]: " + JSON.stringify(result[0]));
            yield countBooksAmount(res, sql, req);
            const authorsQueries = [];
            for (let i = 0; i < res.locals.books.length; i++) {
                authorsQueries.push(queryAuthorsNames(req, res, res.locals.books[i]));
            }
            yield Promise.all([authorsQueries]);
            yield res.status(200);
            yield res.send({ books: yield res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus });
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield res.status(500);
            return yield res.send({ error: `Error in database during getting books list with offset ${res.locals.offset} : ${err}` });
        }));
        // connection.query(sql, async (err, result) => {
        //     try {
        //         if (err) throw err;
        //         countBooksAmount(result, res, offset, null, sql, req);
        //     } catch (err) {
        //         await res.status(500);
        //         return await res.send({error: `Error in database during getting books list with offset ${offset} : ${err}`});            
        //     }
        // });
    });
}
;
function queryAuthorsNames(req, res, book) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("QUERY AUTHOR BOOK ID: " + book.id);
        (yield connection_1.default).query(`SELECT author_id FROM books_authors WHERE book_id = ${book.id};`)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            const authorsIds = result[0];
            console.log(`BOOK WITH ID ${book.id} have next authors ids ${authorsIds}`);
            book.authors = [];
            for (let i = 0; i < authorsIds.length; i++) {
                yield querySingleAuthorName(req, res, book, authorsIds[i]); // need to stay sync
            }
        }))
            .catch(err => {
            console.log("Error during querying authors names for book with id: " + book.id);
            throw err;
        });
    });
}
function querySingleAuthorName(req, res, book, authorId) {
    return __awaiter(this, void 0, void 0, function* () {
        (yield connection_1.default).query(`SELECT author FROM authors WHERE id = ${authorId}`)
            .then(result => {
            const name = result[0];
            console.log("AUTHOR NAME: " + name);
            book.authors.push(name);
        })
            .catch(err => {
            console.log(`Error during quering single author name wiht author id - ${authorId} and book id - ${book.id}`);
            throw err;
        });
    });
}
function countBooksAmount(res, sql, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const foundBooksCountSQLQuery = (typeof res.locals.search === null) ?
            `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`
            : composeFoundBooksCountQuery(sql, `LIMIT ${LIMIT} OFFSET ${req.query.offset}`);
        (yield connection_1.default).query(foundBooksCountSQLQuery)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            const count = yield result[0][0].count;
            console.log("COUNT BOOKS AMOUT QUERY: " + JSON.stringify(count));
            res.locals.pagesStatus = yield assemblePagesStatusData(res.locals.offset, count);
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            console.log("Error during counting books list amount: " + err);
            throw err;
        }));
        // connection.query(foundBooksCountSQLQuery, async (err, rowsCount) => {
        //     try {
        //         if (err) throw err;
        //         const pagesStatus: any = assemblePagesStatusData(offset, await rowsCount[0].count);
        //         await res.status(200);
        //         await res.render("v1/books/index", {books: await result, searchQuery: searchQuery, pagesStatus: pagesStatus});
        //     } catch (err) {
        //         await res.status(500);
        //         return await res.send({error: "Error during getting count of rows in talbe during getting book list: " + err});
        //     }
        // });
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
        const { author, year } = req.query;
        const offset = req.query.offset || 0;
        const sql = composeSLQQuery(author, year, offset, res.locals.search);
        (yield connection_1.default).query(sql)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            countBooksAmount(result, res, offset, search, sql, req);
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield res.status(500);
            return res.send({ error: "Error in database during searching books: " + err });
        }));
        // connection.query(sql, async (err, result) => {
        //     try {
        //         if (err) throw err;
        //         countBooksAmount(result, res, offset, search, sql, req);
        //     } catch (err) {
        //         res.status(500);
        //         return res.send({error: "Error in database during searching books: " + err});
        //     }
        // });
    });
}
;
function composeSLQQuery(author, year, offset, searchQuery) {
    let sql;
    const authorQuery = author ? `autor_id = ${author}` : "";
    const yearQuery = year ? `year = ${year}` : "";
    const offsetQuery = `LIMIT ${LIMIT} OFFSET ${offset}`;
    if (!author && !year) {
        sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' ORDER BY book_name ASC ${offsetQuery};`;
    }
    else {
        if (author && year) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
        else if (author) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
        else {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;
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
