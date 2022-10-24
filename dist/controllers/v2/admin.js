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
const connection_1 = __importDefault(require("../../models/utils/connection"));
const books_1 = require("./books");
const dotenv_1 = __importDefault(require("dotenv"));
const validator_1 = __importDefault(require("validator"));
dotenv_1.default.config();
const authHref = `http://localhost:${process.env.PORT}/auth`;
const sessionCheckSQL = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE ? LIMIT 1) as dbResponse;`;
const deleteBookSQL = `UPDATE books SET is_deleted = TRUE WHERE id = ?;`;
const bindBookIdWithAuthorIdSQL = `INSERT INTO books_authors(book_id, author_id) VALUES(?, ?);`;
const addBookDataSQL = `INSERT INTO books(book_name, publish_year, image_path, book_description) VALUES (?, ?, ?, ?);
    SELECT id FROM books WHERE book_name = ?;`;
const insertAuthorSQL = `INSERT INTO authors(author) VALUES(?);`;
const getAuthorsIdsSQL = `SELECT id FROM authors WHERE author = ?;`;
function deleteBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (yield checkSessionIdPresence(req, res))
                return deleteBookQuery(req, res);
            yield res.status(401);
            return yield res.redirect(authHref);
        }
        catch (err) {
            yield res.status(500);
            return res.send("Error in db during deleting book -> " + err);
        }
    });
}
exports.deleteBook = deleteBook;
function checkSessionIdPresence(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const [sessionResponse] = yield (yield connection_1.default).query(sessionCheckSQL, [req.sessionID])
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            throw Error("Error during checking session db query execution -> " + err);
        }));
        return Boolean(yield sessionResponse[0].dbResponse);
    });
}
function deleteBookQuery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const queryResp = yield (yield connection_1.default).query(deleteBookSQL, [req.params.id]);
            res.status(200);
            return res.json({ deleted: Boolean(queryResp[0].changedRows) });
        }
        catch (err) {
            res.status(500);
            return res.json({ error: "Error during deleting book query" });
        }
    });
}
function getBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (yield checkSessionIdPresence(req, res))
                return (0, books_1.getAll)(req, res, true);
            res.status(401);
            res.redirect(authHref);
        }
        catch (err) {
            res.status(500);
            return res.json({ error: "Error during getting books on admin page -> " + err });
        }
    });
}
exports.getBooks = getBooks;
function addBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield checkSessionIdPresence(req, res))
            return queryAddingBooks(req, res);
        yield res.status(401);
        return yield res.redirect(authHref);
    });
}
exports.addBook = addBook;
function queryAddingBooks(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield addAuthorsAndBookData(req, res);
            yield bindBookIdWithAuthorId(res);
            return yield redirectToAdminPage(res);
        }
        catch (err) {
            yield res.status(500);
            return yield res.send({ error: "Error during executing query of adding book: " + err });
        }
    });
}
function addAuthorsAndBookData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let queries = [addBookDataQuery(req, res), addAuthors(req, res)];
        yield Promise.all(queries);
    });
}
function bindBookIdWithAuthorId(res) {
    return __awaiter(this, void 0, void 0, function* () {
        const queries = [];
        const authorsAmount = res.locals.authorsIds.length;
        for (let i = 0; i < authorsAmount; i++) {
            queries.push((yield connection_1.default).query(bindBookIdWithAuthorIdSQL, [res.locals.bookId, res.locals.authorsIds[i]]));
        }
        yield Promise.all(queries);
    });
}
function redirectToAdminPage(res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield res.status(200);
        return yield res.redirect(`http://localhost:${process.env.PORT}/admin`);
    });
}
function addBookDataQuery(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { bookName, publishYear, description, imagePath } = validateForXSS("mainData", req.body, req === null || req === void 0 ? void 0 : req.file);
        // const {bookName, publishYear, description} = req.body;
        // const imagePath = req.file?.filename || null;
        return yield (yield connection_1.default).query(addBookDataSQL, [bookName, publishYear || 0, imagePath, description, bookName])
            .then((result) => res.locals.bookId = result[0][1][0].id)
            .catch((err) => { throw Error("Error during add book query to db -> " + err); });
    });
}
function addAuthors(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.locals.authorsIds = [];
        const authors = [req.body.author_1, req.body.author_2, req.body.author_3];
        for (const author of authors) {
            yield (yield connection_1.default).query(insertAuthorSQL, author);
            const authorIdResponse = yield (yield connection_1.default).query(getAuthorsIdsSQL, author);
            const authorId = authorIdResponse[0][0].id;
            yield res.locals.authorsIds.push(authorId);
        }
    });
}
function validateForXSS(type, body, file) {
    if (type === "mainData") {
        return {
            bookName: validator_1.default.escape(body.bookName),
            publishYear: validator_1.default.escape(body.publishYear),
            description: validator_1.default.escape(body.description),
            imagePath: validator_1.default.escape(file.filename || null)
        };
    }
    else {
        return [
            validator_1.default.escape(body.author_1),
            validator_1.default.escape(body.author_2),
            validator_1.default.escape(body.author_3)
        ];
    }
}
