"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBook = void 0;
function getBook(req, res) {
    // const booksLinks: string[];
    // const view: string;
    const msg = req.params.bookId;
    res.send(msg);
}
exports.getBook = getBook;
