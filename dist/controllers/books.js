"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooks = void 0;
const connection_1 = __importDefault(require("../models/connection"));
const LIMIT = 20;
function getBooks(req, res) {
    if (req.query.search) {
        search(req, res);
    }
    else {
        getAll(req, res);
    }
}
exports.getBooks = getBooks;
function getAll(req, res) {
    const offset = req.query.offset;
    const sql = `SELECT * FROM books LIMIT ${LIMIT} OFFSET ${offset};`;
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during getting all books with offset ${offset}`);
            res.send(500);
            return res.send({ error: "Error in database during getting books list: " + err });
        }
        console.log(`Query result form file getting books: ${result}`);
        res.send({ result: result });
    });
}
;
function search(req, res) {
    const { author, year, offset } = req.query;
    const searchQuery = req.query.search;
    const authorQuery = author ? `autor_id = ${author}` : "";
    const yearQuery = year ? `year = ${year}` : "";
    const offsetQuery = `LIMIT 20 OFFSET ${offset}`;
    let sql;
    if (!author && !year) {
        sql = `SELECT * FROM books WHERE book_name LIKE '%${searchQuery}%' ${offsetQuery};`;
    }
    else {
        if (author && year) {
            sql = `SELECT * FROM books WHERE book_name LIKE '%${searchQuery}%' AND ${authorQuery} AND ${yearQuery} ${offsetQuery};`;
        }
        else if (author) {
            sql = `SELECT * FROM books WHERE book_name LIKE '%${searchQuery}%' AND ${authorQuery} ${offsetQuery};`;
        }
        else {
            sql = `SELECT * FROM books WHERE book_name LIKE '%${searchQuery}%' AND ${yearQuery} ${offsetQuery};`;
        }
    }
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during getting books`);
            res.send(500);
            return res.send({ error: "Error in database during searching books: " + err });
        }
        console.log(`Query result form file getting books: ${result}`);
        res.send({ result: result });
    });
}
;
