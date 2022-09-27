"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBook = exports.getBook = exports.getBooks = exports.deleteBook = void 0;
const connection_1 = __importDefault(require("../models/connection"));
const LIMIT = 20;
function deleteBook(req, res) {
    const bookId = req.body.bookId;
    const sql = `UPDATE books SET is_deleted = TRUE WHERE id = ${bookId}`;
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during deleting book by id: ${bookId}`);
            res.status(500);
            return res.send({ error: "Error during deleting" });
        }
        console.log(`Query result from file getting books: ${result}`);
        res.send({ result: result }); // books page without the book
    });
}
exports.deleteBook = deleteBook;
function getBooks(req, res) {
    const offset = req.query.offset;
    const sql = `SELECT * FROM books WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during getting all books with offset ${offset}`);
            res.status(500);
            return res.send({ error: "Error in database during getting books list: " + err });
        }
        console.log(`Query result form file getting books: ${result}`);
        res.send({ result: result }); // books page
    });
    //send books page for admin
}
exports.getBooks = getBooks;
function getBook(req, res) {
    const bookId = req.body.bookId;
    connection_1.default.query(`SELECT * FROM books WHERE id = ${bookId} AND is_deleted = FALSE;`, (err, result) => {
        if (err) {
            console.log(`Error during getting book by id: ${bookId}`);
            res.status(500);
            return res.send({ error: "Error in database during getting sible book: " + err });
        }
        console.log(`Query result form file getting book by id ${bookId} : ${result}`);
        res.send({ result: result }); //book page for admin
    });
    //send page with book info for admin
}
exports.getBook = getBook;
function addBook(req, res) {
    const { bookName, publishYear, imagePath, bookDesc, author } = req.body;
    const sql = `INSERT INTO books(book_name, publish_year, image_path, book_description, author)
        VALUES (${bookName}, ${publishYear}, ${imagePath}, ${bookDesc}, ${author})`;
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during adding new book: ${req.body}`);
            res.status(500);
            return res.send({ error: "Error in database during adding new book" });
        }
        console.log(`Query executed`);
        res.send({ result: result }); // clear prompt/send new books page for admin
    });
}
exports.addBook = addBook;
