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
const connection_1 = __importDefault(require("../models/utils/connection"));
function getBook(req, res) {
    const bookId = req.params.bookId;
    console.log("Single book id: " + bookId);
    connection_1.default.query(`SELECT * FROM books WHERE id = ${bookId} AND is_deleted = FALSE`, (err, result) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (err) {
                console.log(`Error during getting book by id: ${bookId}`);
                res.status(500);
                return res.send({ error: "Error in database during getting sible book: " + err });
            }
            yield incrCounter("visits", req, res, bookId);
            console.log(`Query result form file getting book by id ${bookId} : ${yield result}`);
            const book = yield result[0];
            const data = {
                bookName: book.book_name,
                year: book.publish_year,
                imagePath: book.image_path,
                desciption: book.book_description,
                author: book.author,
                bookId: book.id
            };
            yield res.status(200);
            yield res.render("book/index", data);
        }
        catch (error) {
            res.status(500);
        }
    }));
}
exports.getBook = getBook;
function wantBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookId = req.params.bookId;
        console.log("Single book id: " + bookId);
        yield incrCounter("wants", req, res, bookId);
    });
}
exports.wantBook = wantBook;
function incrCounter(type, req, res, bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        let sql = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`;
        connection_1.default.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(`Error during increasing "${type}" counter book by id: ${bookId}`);
                yield res.status(500);
                return yield res.send({ error: `Error in database during increasing "${type}" counter: ` + err });
            }
            console.log(`Query result form increasing ${type} counter of book with id ${bookId} : ${result}`);
            yield res.status(200);
            yield res.end();
        }));
    });
}
