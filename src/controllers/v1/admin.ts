import { RowDataPacket } from "mysql2";
import connection from "../../models/utils/connection";
import { AddingBook, DBResponse, InputImage, Request, Response } from "../../types";

const LIMIT: number = 20;

const adminV1Href: string = "http://localhost:3005/api/v1/admin";
const authV1Href: string = "http://localhost:3005/api/v1/auth";

const adminV1View: string = "v1/admin/index";

const sessionsTableName: string = "sessions_v1";
const booksV1TableName: string = "books";

const sessionChechSQL: string = `SELECT EXISTS(SELECT 1 FROM ${sessionsTableName} WHERE id LIKE ? LIMIT 1) as dbResponse;`
const deleteBookSQL: string = `UPDATE ${booksV1TableName} SET is_deleted = TRUE WHERE id = ?`;
const booksListSQL: string = `SELECT * FROM ${booksV1TableName} WHERE is_deleted = FALSE LIMIT ? OFFSET ?;`;
const pagesCountSQL: string = `SELECT COUNT(*) AS count FROM ${booksV1TableName} WHERE is_deleted = FALSE;`;
const addBookSQL: string = `INSERT INTO ${booksV1TableName}(book_name, publish_year, image_path, book_description, author_1, 
    author_2, author_3) VALUES (?, ?, ?, ?, ?, ?, ?);`;

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
        const sessionCheckResp: DBResponse = await (await connection).query(sessionChechSQL, [req.sessionID]);
        return Boolean(sessionCheckResp[0][0].dbResponse);
    } catch (err) {
        throw Error("Error during checking session presence in db -> ");
    }
}

async function deleteBookQuery(req: Request): Promise<void> {
    try {
        await (await connection).query(deleteBookSQL, [req.params.id]);
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
            res.render(adminV1View, {books: books, pagesAmount: count / LIMIT, currentPage: (Number(req.query.offset) / LIMIT) + 1 });
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
        const booksResp: DBResponse = await (await connection).query(booksListSQL, [Number(LIMIT), Number(offset)]);
        const books: RowDataPacket[] = booksResp[0];
        return books;
    } catch (err) {
        throw Error(`Error in database during getting books list for admin with offset -> ${err}`);
    }
}

async function definePagesAmount(): Promise<number> {
    try {
        const countResp: DBResponse = await (await connection).query(pagesCountSQL);
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
        await (await connection).query(addBookSQL, [bookName, (publishYear || 0), imagePath, description, author_1, author_2, author_3]);
        res.status(200);
        res.redirect(adminV1Href);
    } catch (err) {
        throw Error("Error during adding book to v1 db -> " + err);
    }
}