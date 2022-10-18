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
const connection_1 = __importDefault(require("../../models/utils/connection"));
function getBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookId = req.params.bookId;
        try {
            yield Promise.all([
                queryBookById(req, res, bookId),
                queryAuthors(req, res, bookId),
                incrCounter("visits", req, res, bookId)
            ]);
        }
        catch (err) {
            yield res.status(500);
            yield res.send({ error: `Error in database during getting single book with id ${bookId}: ${err}` });
        }
        yield res.status(200);
        yield res.send(JSON.stringify(res.locals));
    });
}
exports.getBook = getBook;
function queryBookById(req, res, bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield connection_1.default).query(`SELECT * FROM books WHERE id = ${bookId} AND is_deleted = FALSE;`)
            .then((result) => {
            console.log("result of querying book by id: " + JSON.stringify(result[0]));
            res.locals.book = result[0];
        }).catch((err) => {
            console.error("Error during querying book data by id: " + err);
            throw err;
        });
    });
}
function queryAuthors(req, res, bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (yield connection_1.default).query(`SELECT author_id FROM books_authors WHERE book_id = ${bookId};`)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            console.log("Author id queried from db: " + JSON.stringify(result[0]));
            res.locals.authors_ids = result[0];
            const authorsAmount = result[0].length;
            console.log(`authorsAmount ${authorsAmount}`);
            const queries = [];
            for (let i = 0; i < authorsAmount; i++) {
                queries.push(queryAuthorsNames(req, res, res.locals.authors_ids[i].author_id));
            }
            yield Promise.all(queries);
        }))
            .catch(err => {
            console.log("Error during querying authors id: " + err);
            throw err;
        });
    });
}
function queryAuthorsNames(req, res, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (yield connection_1.default).query(`SELECT author FROM authors WHERE id = ${id};`)
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Queried author: ${JSON.stringify(result[0])}`);
            res.locals.authors = result[0];
        }))
            .catch((err) => {
            console.log("Error during querying authors: " + err);
            throw err;
        });
    });
}
function incrCounter(type, req, res, bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield connection_1.default).query(`UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`)
            .catch(err => {
            console.log(`Error during increasing ${type} counter of book ${bookId}`);
            throw err;
        });
    });
}
function wantBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const bookId = req.params.bookId;
        console.log("Wants single book with id: " + bookId);
        incrCounter("wants", req, res, bookId)
            .then(result => {
            res.status(200);
            res.end();
        }).catch(err => {
            res.status(500);
            res.end({ error: err });
        });
    });
}
exports.wantBook = wantBook;
