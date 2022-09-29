"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wantBook = exports.getBook = void 0;
const connection_1 = __importDefault(require("../models/connection"));
function getBook(req, res) {
    const bookId = req.params.bookId;
    console.log("Single book id: " + bookId);
    incrCounter("visits", req, res, bookId);
    connection_1.default.query(`SELECT * FROM books WHERE id = ${bookId} AND is_deleted = FALSE`, (err, result) => {
        if (err) {
            console.log(`Error during getting book by id: ${bookId}`);
            res.status(500);
            return res.send({ error: "Error in database during getting sible book: " + err });
        }
        console.log(`Query result form file getting book by id ${bookId} : ${result}`);
        res.render("book/index");
    });
}
exports.getBook = getBook;
function wantBook(req, res) {
    const bookId = req.params.bookId;
    console.log("Single book id: " + bookId);
    incrCounter("wants", req, res, bookId);
    //send booking info
}
exports.wantBook = wantBook;
function incrCounter(type, req, res, bookId) {
    let sql = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`;
    connection_1.default.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during increasing ${type} counter book by id: ${bookId}`);
            res.status(500);
            return res.send({ error: `Error in database during increasing ${type} counter: ` + err });
        }
        console.log(`Query result form increasing ${type} counter of book with id ${bookId} : ${result}`);
    });
}
