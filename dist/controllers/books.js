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
const connection_1 = __importDefault(require("../models/utils/connection"));
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
function getAll(req, res) {
    console.log("INSIDE GET ALL METHOD");
    const offset = req.query.offset || 0;
    const sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ${LIMIT} OFFSET ${offset};`;
    console.log("SQL query: " + sql);
    connection_1.default.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            console.log(`Error during getting all books with offset ${offset}`);
            res.status(500);
            return res.send({ error: "Error in database during getting books list: " + err });
        }
        console.log(`Query result form getting books: ${yield result}`);
        connection_1.default.query(`SELECT COUNT(*) AS count FROM books_v1 WHERE is_deleted = FALSE;`, (err, rowsCount) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log("Error during getting count of rows in talbe during getting all: " + err);
                res.status(500);
                return res.send({ error: "Error during getting count of rows in talbe during getting all: " + err });
            }
            let hasPrevPage = false, hasNextPage = false;
            const totalyFound = rowsCount[0].count;
            console.log("totalyFound " + totalyFound);
            const offsetAhead = +offset + LIMIT;
            console.log(`offsetAhead ${offsetAhead}`);
            const offsetBack = +offset - LIMIT;
            console.log(`offsetBack ${offsetBack}`);
            if (offsetAhead <= totalyFound)
                hasNextPage = true;
            if (offsetBack >= 0)
                hasPrevPage = true;
            yield res.status(200);
            const pagesStatus = { hasPrevPage: hasPrevPage, hasNextPage: hasNextPage, totalyFound: totalyFound, offsetAhead: offsetAhead, offsetBack: offsetBack };
            console.log(`hasPrevPage ${hasPrevPage}`);
            console.log(`hasNextPage ${hasNextPage}`);
            yield res.render("v1/books/index", { books: yield result, searchQuery: null, pagesStatus: pagesStatus });
        }));
    }));
}
;
function search(req, res) {
    console.log("INSIDE SEARCH METHOD");
    const { author, year } = req.query;
    const offset = req.query.offset || 0;
    const searchQuery = req.query.search;
    const authorQuery = author ? `autor_id = ${author}` : "";
    const yearQuery = year ? `year = ${year}` : "";
    const offsetQuery = `LIMIT ${LIMIT} OFFSET ${offset}`;
    let sql;
    if (!author && !year) {
        sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' ORDER BY book_name ASC ${offsetQuery};`;
    }
    else {
        if (author && year) {
            sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
        else if (author) {
            sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
        else {
            sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
    }
    console.log("sql " + sql);
    connection_1.default.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            console.log(`Error during getting books`);
            res.status(500);
            return res.send({ error: "Error in database during searching books: " + err });
        }
        console.log(`Query result form file getting books: ${yield result}`);
        console.log("search query: " + searchQuery);
        const countSQL = sql.replace("*", "COUNT(*) AS count").replace("ORDER BY book_name ASC", "").replace(offsetQuery, "");
        console.log("countSQL " + countSQL);
        connection_1.default.query(countSQL, (err, rowsCount) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log("Error during getting count of rows in talbe during getting all: " + err);
                res.status(500);
                return res.send({ error: "Error during getting count of rows in talbe during getting all: " + err });
            }
            let hasPrevPage = false, hasNextPage = false;
            console.log("rowsCount " + rowsCount);
            console.log("rowsCount[0] " + rowsCount[0]);
            const totalyFound = rowsCount[0].count;
            console.log("totalyFound " + totalyFound);
            const offsetAhead = +offset + LIMIT;
            console.log(`offsetAhead ${offsetAhead}`);
            const offsetBack = +offset - LIMIT;
            console.log(`offsetBack ${offsetBack}`);
            if (offsetAhead <= totalyFound)
                hasNextPage = true;
            if (offsetBack >= 0)
                hasPrevPage = true;
            const pagesStatus = { hasPrevPage: hasPrevPage, hasNextPage: hasNextPage, totalyFound: totalyFound, offsetAhead: offsetAhead, offsetBack: offsetBack };
            console.log(`hasPrevPage ${hasPrevPage}`);
            console.log(`hasNextPage ${hasNextPage}`);
            yield res.status(200);
            yield res.render("v1/books/index", { books: yield result, searchQuery: searchQuery, pagesStatus: pagesStatus });
        }));
    }));
}
;
