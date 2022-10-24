import connection from "../../models/utils/connection";

const LIMIT: number = 20;

const adminV1Href = "http://localhost:3005/api/v1/admin";
const authV1Href = "http://localhost:3005/api/v1/auth";

const adminV1View = "v1/admin/index";

const sessionsTableName = "sessions_v1";
const booksV1TableName = "books";

const sessionChechSQL = `SELECT EXISTS(SELECT 1 FROM ${sessionsTableName} WHERE id LIKE ? LIMIT 1) as dbResponse;`
const deleteBookSQL = `UPDATE ${booksV1TableName} SET is_deleted = TRUE WHERE id = ?`;
const booksListSQL = `SELECT * FROM ${booksV1TableName} WHERE is_deleted = FALSE LIMIT ? OFFSET ?;`;
const pagesCountSQL = `SELECT COUNT(*) AS count FROM ${booksV1TableName} WHERE is_deleted = FALSE;`;
const addBookSQL = `INSERT INTO ${booksV1TableName}(book_name, publish_year, image_path, book_description, author_1, 
    author_2, author_3) VALUES (?, ?, ?, ?, ?, ?, ?);`;

export async function deleteBook(req: any, res: any) {
    try {
        if (await isSessionPermited(req)) {
            deleteBookQuery(req, res);
            await res.status(200);
            await res.send({ok: true});
        } else {
            await res.status(401);
            await res.redirect(authV1Href);
        }
    } catch (err) {
        await res.status(500);
        res.redirect(authV1Href);
    }
}

async function isSessionPermited(req: any) {
    try {
        const sessionCheckResp: any = await (await connection).query(sessionChechSQL, [req.sessionID]);
        const isSessionPermited = Boolean(sessionCheckResp[0][0].dbResponse);
        return isSessionPermited;
    } catch (err) {
        throw Error("Error during checking session presence in db -> ");
    }
}

async function deleteBookQuery(req: any, res: any) {
    try {
        await (await connection).query(deleteBookSQL, [req.params.id]);
    } catch (err) {
        throw Error("Error during deleting book from db query -> " + err);
    }
}

export async function getBooks(req: any, res: any) {
    try {
        if (await isSessionPermited(req)) {
            const books = await queryBooksList(req, res);
            const count = await definePagesAmount(res, books, req.query.offset);
            await res.status(200);
            await res.render(adminV1View, {books: books, pagesAmount: count / LIMIT, currentPage: (req.query.offset / LIMIT) + 1 });
        } else {
            await res.status(401);
            await res.redirect(authV1Href);
        }
    } catch (err) {
        await res.status(500);
        await res.json("Error during getting books for admin -> " + err);
    }
}

async function queryBooksList(req: any, res: any) {
    try {
        const offset: number = req.query.offset || 0;
        const booksResp = await (await connection).query(booksListSQL, [Number(LIMIT), Number(offset)]);
        const books = booksResp[0];
        return books;
    } catch (err) {
        throw Error(`Error in database during getting books list for admin with offset -> ${err}`);
    }
}

async function definePagesAmount(res: any, books: any, offset: any) {
    try {
        const countResp: any = await (await connection).query(pagesCountSQL);
        const count = countResp[0][0].count;
        return count;
    } catch (err) {
        throw Error("Error during defining pages amount -> " + err);
    }
}

export async function addBook(req: any, res: any) {
    try {
        if (await isSessionPermited(req)) {
            addBookQuery(req, res);
        } else {
            await res.status(401);
            await res.redirect(authV1Href);
        }
    } catch (err) {
        await res.status(500);
        await res.redirect(authV1Href);
    }
}

async function addBookQuery(req: any, res: any) {
    try {
        const {bookName, publishYear, author_1, author_2, author_3, description} = req.body;
        const imagePath = req.file?.filename || null;
        await (await connection).query(addBookSQL, [bookName, (publishYear || 0), imagePath, description, author_1, author_2, author_3]);
        await res.status(200);
        await res.redirect(adminV1Href);
    } catch (err) {
        throw Error("Error during adding book to v1 db -> " + err);
    }
}