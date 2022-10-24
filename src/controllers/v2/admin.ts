import connection from "../../models/utils/connection";
import { getAll } from "./books";
import dotenv from "dotenv";
import validator from "validator";

dotenv.config();

const authHref: string = `http://localhost:${process.env.PORT}/auth`;
const sessionCheckSQL = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE ? LIMIT 1) as dbResponse;`
const deleteBookSQL = `UPDATE books SET is_deleted = TRUE WHERE id = ?;`;
const bindBookIdWithAuthorIdSQL = `INSERT INTO books_authors(book_id, author_id) VALUES(?, ?);`;
const addBookDataSQL = `INSERT INTO books(book_name, publish_year, image_path, book_description) VALUES (?, ?, ?, ?);
    SELECT id FROM books WHERE book_name = ?;`;
const insertAuthorSQL = `INSERT INTO authors(author) VALUES(?);`;
const getAuthorsIdsSQL = `SELECT id FROM authors WHERE author = ?;`;

export async function deleteBook(req: any, res: any) {
    try {
        if (await checkSessionIdPresence(req, res)) return deleteBookQuery(req, res);
        await res.status(401);
        return await res.redirect(authHref);
    } catch (err) {
        await res.status(500);
        return res.send("Error in db during deleting book -> " + err);
    }
}

async function checkSessionIdPresence(req: any, res: any): Promise<boolean> {
    const [ sessionResponse ]: any = await (await connection).query(sessionCheckSQL, [req.sessionID])
        .catch(async (err: Error) => {
            throw Error("Error during checking session db query execution -> " + err)
        });
    return Boolean(await sessionResponse[0].dbResponse);
}

async function deleteBookQuery(req: any, res: any) {
    try {
        const queryResp: any = await (await connection).query(deleteBookSQL, [req.params.id]);
        res.status(200);
        return res.json({deleted: Boolean(queryResp[0].changedRows)});
    } catch (err) {
        res.status(500);
        return res.json({error: "Error during deleting book query"});        
    }
}

export async function getBooks(req: any, res: any) {
    try {
        if (await checkSessionIdPresence(req, res)) return getAll(req, res, true);
        res.status(401);
        res.redirect(authHref);    
    } catch (err) {
        res.status(500);
        return res.json({error: "Error during getting books on admin page -> " + err});
    }
    
}

export async function addBook(req: any, res: any) {
    if (await checkSessionIdPresence(req, res)) return queryAddingBooks(req, res);
    await res.status(401);
    return await res.redirect(authHref);
}

async function queryAddingBooks(req: any, res: any) {
    try {
        await addAuthorsAndBookData(req, res);
        await bindBookIdWithAuthorId(res);
        return await redirectToAdminPage(res);
    } catch (err) {
        await res.status(500);
        return await res.send({error: "Error during executing query of adding book: " + err});
    }
}

async function addAuthorsAndBookData(req: any, res: any) {
    let queries: any = [ addBookDataQuery(req, res),  addAuthors(req, res) ]
    await Promise.all(queries);
}

async function bindBookIdWithAuthorId(res: any) {
    const queries = [];
    const authorsAmount = res.locals.authorsIds.length;
    for (let i = 0; i < authorsAmount; i++) {
        queries.push((await connection).query(bindBookIdWithAuthorIdSQL, [res.locals.bookId, res.locals.authorsIds[i]]));
    }
    await Promise.all(queries);
}

async function redirectToAdminPage(res: any) {
    await res.status(200);
    return await res.redirect(`http://localhost:${process.env.PORT}/admin`);
}

async function addBookDataQuery(req: any, res: any) {
    const { bookName, publishYear, description, imagePath } = validateForXSS("mainData", req.body, req?.file);
    // const {bookName, publishYear, description} = req.body;
    // const imagePath = req.file?.filename || null;
    return await (await connection).query(addBookDataSQL, [bookName, publishYear || 0, imagePath, description, bookName])
        .then((result: any) => res.locals.bookId = result[0][1][0].id)
        .catch((err: Error) => { throw Error("Error during add book query to db -> " + err) });
}

async function addAuthors(req: any, res: any) {
    res.locals.authorsIds = [];
    const authors = [ req.body.author_1, req.body.author_2, req.body.author_3 ];
    for (const author of authors) {
        await (await connection).query(insertAuthorSQL, author);
        const authorIdResponse: any = await (await connection).query(getAuthorsIdsSQL, author);
        const authorId: any = authorIdResponse[0][0].id;
        await res.locals.authorsIds.push(authorId); 
    }
}

function validateForXSS(type: "mainData" | "authors", body: any, file?: any): any {
    if (type === "mainData") {
        return {
            bookName: validator.escape(body.bookName),
            publishYear: validator.escape(body.publishYear),
            description: validator.escape(body.description),
            imagePath: validator.escape(file.filename || null)
        }
    } else {
        return [
            validator.escape(body.author_1),
            validator.escape(body.author_2),
            validator.escape(body.author_3)
        ]
    }
}