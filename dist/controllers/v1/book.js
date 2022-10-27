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
const getBookSQL = `SELECT * FROM books WHERE id = ? AND is_deleted = FALSE;`;
function getBook(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bookId = req.params.bookId;
            const queryResp = yield (yield connection_1.default).query(getBookSQL, [bookId]);
            const book = queryResp[0][0];
            yield incrCounter("visits", req, res, bookId);
            res.status(200);
            res.render("v1/book/index", { book: book });
        }
        catch (err) {
            res.status(500);
            res.json({ error: `Error in database during getting single book with id ${req.params.bookId}: ${err}` });
        }
    });
}
exports.getBook = getBook;
function wantBook(req, res) {
    try {
        incrCounter("wants", req, res, req.params.bookId);
    }
    catch (err) {
        throw Error("Error during increasing 'want' counter -> " + err);
    }
}
exports.wantBook = wantBook;
function incrCounter(type, req, res, bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const incrCounterSQL = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`;
            yield (yield connection_1.default).query(incrCounterSQL, [type, type, bookId]);
        }
        catch (err) {
            throw Error(`Error during increasing '${type}' counter of book ${req.params.bookId} -> : ${err}`);
        }
    });
}
