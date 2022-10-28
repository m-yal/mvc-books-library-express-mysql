import { RowDataPacket } from "mysql2";
import { addBookSQLV1, adminV1Href, adminV1View, authV1Href, booksListSQLV1, deleteBookSQLV1, MAX_BOOKS_PER_PAGE, pagesCountSQLV1, sessionChechSQLV1 } from "../../constants";
import connection from "../../models/utils/connection";
import { AddingBook, DBResponse, InputImage, Request, Response } from "../../types";

export async function deleteBook(req: Request, res: Response): Promise<void> {
    try {
        if (await isSessionPermited(req)) {
            await deleteBookQuery(req);
            res.status(200);
            res.send({ok: true});
        } else {
            res.status(401);
            res.redirect(authV1Href);
        }
    } catch (err) {
        res.status(500);
        res.redirect(authV1Href);
    }
}

async function isSessionPermited(req: Request): Promise<boolean> {
    try {
        const sessionCheckResp: DBResponse = await (await connection).query(sessionChechSQLV1, [req.sessionID]);
        return Boolean(sessionCheckResp[0][0].dbResponse);
    } catch (err) {
        throw Error("Error during checking session presence in db -> ");
    }
}

async function deleteBookQuery(req: Request): Promise<void> {
    try {
        await (await connection).query(deleteBookSQLV1, [req.params.id]);
    } catch (err) {
        throw Error("Error during deleting book from db query -> " + err);
    }
}

export async function getBooks(req: Request, res: Response): Promise<void> {
    try {
        if (await isSessionPermited(req)) {
            const books: RowDataPacket[] = await queryBooksList(req);
            const count: number = await definePagesAmount();
            res.status(200);
            res.render(adminV1View, {books: books, pagesAmount: count / MAX_BOOKS_PER_PAGE, currentPage: (Number(req.query.offset) / MAX_BOOKS_PER_PAGE) + 1 });
        } else {
            res.status(401);
            res.redirect(authV1Href);
        }
    } catch (err) {
        res.status(500);
        res.json("Error during getting books for admin -> " + err);
    }
}

async function queryBooksList(req: Request): Promise<RowDataPacket[]> {
    try {
        const offset: number = Number(req.query.offset) || 0;
        const booksResp: DBResponse = await (await connection).query(booksListSQLV1, [Number(MAX_BOOKS_PER_PAGE), Number(offset)]);
        const books: RowDataPacket[] = booksResp[0];
        return books;
    } catch (err) {
        throw Error(`Error in database during getting books list for admin with offset -> ${err}`);
    }
}

async function definePagesAmount(): Promise<number> {
    try {
        const countResp: DBResponse = await (await connection).query(pagesCountSQLV1);
        return countResp[0][0].count;
    } catch (err) {
        throw Error("Error during defining pages amount -> " + err);
    }
}

export async function addBook(req: Request, res: Response): Promise<void> {
    try {
        if (await isSessionPermited(req)) {
            addBookQuery(req, res);
        } else {
            res.status(401);
            res.redirect(authV1Href);
        }
    } catch (err) {
        res.status(500);
        res.redirect(authV1Href);
    }
}

async function addBookQuery(req: Request, res: Response): Promise<void> {
    try {
        const {bookName, publishYear, author_1, author_2, author_3, description}: AddingBook = req.body;
        const imagePath: InputImage = req.file?.filename || null;
        await (await connection).query(addBookSQLV1, [bookName, (publishYear || 0), imagePath, description, author_1, author_2, author_3]);
        res.status(200);
        res.redirect(adminV1Href);
    } catch (err) {
        throw Error("Error during adding book to v1 db -> " + err);
    }
}