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
    if (typeof req.query.search === "string") {
        search(req, res);
    }
    else {
        getAll(req, res);
    }
}
exports.getBooks = getBooks;
;
function getAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const offset = req.query.offset || 0;
        try {
            const getBooksListSQL = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ${LIMIT} OFFSET ${offset};`;
            const booksResp = yield (yield connection_1.default).query(getBooksListSQL);
            const books = booksResp[0];
            const count = yield countBooksAmount(books, res, offset, null, getBooksListSQL, req);
            const pagesStatus = assemblePagesStatusData(offset, count);
            yield res.status(200);
            yield res.render("v1/books/index", { books: books, searchQuery: null, pagesStatus: pagesStatus });
        }
        catch (err) {
            yield res.status(500);
            return yield res.json({ error: `Error in database during getting books list with offset ${offset} -> ${err}` });
        }
    });
}
;
function countBooksAmount(result, res, offset, searchQuery, sql, req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foundBooksCountSQLQuery = (typeof searchQuery === null) ?
                `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`
                : composeFoundBooksCountQuery(sql, `LIMIT ${LIMIT} OFFSET ${req.query.offset}`);
            const countResp = yield (yield connection_1.default).query(foundBooksCountSQLQuery);
            return countResp[0][0].count;
        }
        catch (err) {
            throw Error("Error during count books query -> " + err);
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
    const { author, year, search } = req.query;
    const offset = req.query.offset || 0;
    const sql = composeSLQQuery(author, year, offset, search);
    // connection.query(sql, async (err, result) => {
    //     try {
    //         if (err) throw err;
    //         countBooksAmount(result, res, offset, search, sql, req);
    //     } catch (err) {
    //         res.status(500);
    //         return res.send({error: "Error in database during searching books: " + err});
    //     }
    // });
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
