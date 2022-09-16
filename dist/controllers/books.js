"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooks = void 0;
function getBooks(req, res) {
    // const booksdata: string;
    // const view: string;
    const responseObj = {
        offset: req.query.offset,
        search: req.query.search,
        author: req.query.author,
        year: req.query.year
    };
    res.send(responseObj);
}
exports.getBooks = getBooks;
