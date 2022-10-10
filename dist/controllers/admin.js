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
exports.addBook = exports.getBooks = exports.deleteBook = void 0;
const connection_1 = __importDefault(require("../models/utils/connection"));
const LIMIT = 20;
function deleteBook(req, res) {
    const bookId = req.params.id;
    const sql = `UPDATE books_v1 SET is_deleted = TRUE WHERE id = ${bookId}`;
    connection_1.default.query(sql, (err, result) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (err)
                throw err;
            yield res.status(200);
            yield res.send({ ok: true });
        }
        catch (err) {
            yield res.status(500);
            return yield res.send({ error: "Error during deleting" });
        }
    }));
}
exports.deleteBook = deleteBook;
function getBooks(req, res) {
    const offset = req.query.offset || 0;
    const sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
    connection_1.default.query(sql, (err, books) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (err)
                throw err;
            definePagesAmount(res, books, offset);
        }
        catch (err) {
            yield res.status(500);
            return yield res.send({ error: `Error in database during getting books list for admin with offset ${offset}: ${err}` });
        }
    }));
}
exports.getBooks = getBooks;
function definePagesAmount(res, books, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        connection_1.default.query(`SELECT COUNT(*) AS count FROM books_v1 WHERE is_deleted = FALSE;`, (err, rowsCount) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err)
                    throw err;
                yield res.render("v1/admin/index", { books: yield books, pagesAmount: (yield rowsCount[0].count) / LIMIT, currentPage: (offset / LIMIT) + 1 });
            }
            catch (err) {
                throw err;
            }
        }));
    });
}
function addBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("INSIDE addBook method");
        const book = yield req.body;
        console.log("req.body " + (yield book));
        const image = yield req.file;
        console.log("req.file " + (yield image));
        res.status(200);
        yield res.send();
        // const sql = `INSERT INTO books_v1(book_name, publish_year, image_path, book_description, author)
        //     VALUES (${bookName}, ${publishYear}, ${imagePath}, ${bookDesc}, ${author})`;
        // connection.query(sql, (err, result) => {
        //     if (err) {
        //         console.log(`Error during adding new book: ${req.body}`);
        //         res.status(500);
        //         return res.send({error: "Error in database during adding new book"});
        //     }
        //     console.log(`Query executed`);
        //     res.send({result: result}); // clear prompt/send new books page for admin
        // });
    });
}
exports.addBook = addBook;
