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
    connection_1.default.query(`SELECT * FROM books WHERE id = ${bookId} AND is_deleted = FALSE`, (err, result) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (err)
                throw err;
            incrCounter("visits", req, res, bookId);
            yield res.status(200);
            yield res.render("v1/book/index", { book: result[0] });
        }
        catch (err) {
            yield res.status(500);
            yield res.send({ error: `Error in database during getting single book with id ${bookId}: ${err}` });
        }
    }));
}
exports.getBook = getBook;
function wantBook(req, res) {
    const bookId = req.params.bookId;
    console.log("Single book id: " + bookId);
    incrCounter("wants", req, res, bookId);
}
exports.wantBook = wantBook;
function incrCounter(type, req, res, bookId) {
    const sql = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`;
    connection_1.default.query(sql, (err) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (err)
                throw err;
            yield res.status(200);
            yield res.end();
        }
        catch (error) {
            yield res.status(500);
            return yield res.send(JSON.stringify({ error: `Error in database during increasing "${type}" counter of book with id ${bookId}: ` + err }));
        }
    }));
}
