"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wantBook = exports.getBook = void 0;
const connection_1 = __importDefault(require("../models/connection"));
function getBook(req, res) {
    //todo here increment of visitcounter
    const bookId = req.params.bookId;
    console.log("Single book id: " + bookId);
    connection_1.default.query(`SELECT * FROM books WHERE id = ${bookId} AND is_deleted = FALSE`, (err, result) => {
        if (err) {
            console.log(`Error during getting book by id: ${bookId}`);
            res.status(500);
            return res.send({ error: "Error in database during getting sible book: " + err });
        }
        console.log(`Query result form file getting book by id ${bookId} : ${result}`);
        res.send({ result: result });
    });
    //send page with book
}
exports.getBook = getBook;
function wantBook(req, res) {
    //send booking info
    //increase click counter
}
exports.wantBook = wantBook;
