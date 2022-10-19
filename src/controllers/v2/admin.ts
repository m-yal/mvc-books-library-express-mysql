import connection from "../../models/utils/connection";
import { getAll } from "./books";

const LIMIT: number = 20;

export async function deleteBook(req: any, res: any) {
    const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    (await connection).query(sql)
        .then(async (result: any) => {
            const isSessionPresent = await result[0].dbResponse;
            console.log("IS SESSION EXISTS DURING DELETING BOOK: " + isSessionPresent);
            if (!isSessionPresent) {
                await res.status(401);
                return await res.redirect(`http://localhost:3005/auth`)
            };
            deleteBookQuery(req, res);
        })
        .catch(async (err: Error) => {
            await res.status(500);
            return await res.send({error: "Error during deleting"});
        });
}

async function deleteBookQuery(req: any, res: any) {
    const bookId: string = req.params.id;
    const sql: string = `UPDATE books SET is_deleted = TRUE WHERE id = ${bookId}`;
    (await connection).query(sql)
        .then(async result => {
            await res.status(200);
            await res.send({ok: true});
        })
        .catch(err => {
            console.log("Error during deleting book");
            throw err;
        });
}

export async function getBooks(req: any, res: any) {
    const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    (await connection).query(sql)
        .then(async (result: any) => {
            const isSessionPresent = Boolean(result[0].dbResponse);
            console.log("IS SESSION PRESENT DURING GETTING BOOKS: " + isSessionPresent);
            if (isSessionPresent) {
                await getAll(req, res, true);
            } else {
                res.status(401);
                res.redirect("http://localhost:3005/auth");
            }
        })
}

// function queryBooksList(req: any, res: any) {
//     const offset = req.query.offset || 0;
//     const sql = `SELECT * FROM books WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
//     // connection.query(sql, async (err, books) => {
//     //     try {
//     //         if (err) throw err;
//     //         definePagesAmount(res, books, offset);
//     //     } catch (err) {
//     //         await res.status(500);
//     //         return await res.send({error: `Error in database during getting books list for admin with offset ${offset}: ${err}`})
//     //     }
//     // });
// }

// async function definePagesAmount(res: any, books: any, offset: any) {
//     // connection.query(`SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`, async (err, rowsCount) => {
//     //     try {
//     //         if (err) throw err;
//     //         await res.render("v1/admin/index", {books: await books, pagesAmount: await rowsCount[0].count / LIMIT, currentPage: (offset / LIMIT) + 1 });
//     //     } catch (err) {
//     //         throw err;
//     //     }
//     // });
// }

export async function addBook(req: any, res: any) {
    const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    (await connection).query(sql)
        .then(async (result: any) => {
            const isSessionPresent = await result[0].dbResponse;
            console.log("IS SESSION EXISTS DURING ADDING BOOK: " + isSessionPresent);
            if (!isSessionPresent) {
                await res.status(401);
                return await res.redirect(`http://localhost:3005/auth`)
            };

            await Promise.all([
                addBookDataQuery(req, res),
                addAuthors(req, res)
            ]);

            const queries = [];
            const authorsAmount = res.locals.authorsIds.length;
            for (let i = 0; i < authorsAmount; i++) {
                queries.push((await connection)
                    .query(`INSERT INTO books_authors(book_id, author_id) VALUES(${res.locals.bookId}, ${res.locals.authorsIds[i]});`));
            }
            await Promise.all(queries);

            await res.status(200);
            return await res.redirect("http://localhost:3005/admin");
        })
        .catch(async (err: Error) => {
            await res.status(500);
            return await res.send({error: "Error during adding book"});
        });
}

async function addBookDataQuery(req: any, res: any) {
    const {bookName, publishYear, description} = req.body;
    const imagePath = req.file?.filename || null;
    const sql = `INSERT INTO books(book_name, publish_year, image_path, book_description) VALUES ('${bookName}', ${publishYear || 0}, '${imagePath}', '${description}');
        SELECT id FROM books WHERE book_name === ${bookName};`;
    (await connection).query(sql)
        .then(result => {
            console.log("RESULT FROM ADD BOOK QUERY: " + JSON.stringify(result));
            console.log("ADDED BOOK ID " + result[1]);
            res.locals.bookId = result[1];            
        })
        .catch(err => {
            console.log("Error during add book query");
            throw err;
        })
}

async function addAuthors(req: any, res: any) {
    const [ author_1, author_2, author_3 ] = req.body;
    res.locals.authorsIds = [];
    if (author_1) {
        (await connection).query(`INSERT INTO authors(author) VALUES(${author_1});`);
        res.locals.authorsIds.push((await connection).query(`SELECT id FROM authors WHERE author = ${author_1};`));
    }
    if (author_2) {
        (await connection).query(`INSERT INTO authors(author) VALUES(${author_2});`);
        res.locals.authorsIds.push((await connection).query(`SELECT id FROM authors WHERE author = ${author_2};`));
    }
    if (author_2) {
        (await connection).query(`INSERT INTO authors(author) VALUES(${author_2});`);
        res.locals.authorsIds.push((await connection).query(`SELECT id FROM authors WHERE author = ${author_2};`));
    }
}

// function assembleAddBookSqlQuery(req: any) {
//     const {bookName, publishYear, author_1, author_2, author_3, description} = req.body;
//     const imagePath = req.file?.filename || null;
//     return `INSERT INTO books(book_name, publish_year, image_path, book_description, author_1, author_2, author_3)
//      VALUES ('${bookName}', ${publishYear || 0}, '${imagePath}', '${description}', '${author_1}', '${author_2}', '${author_3}');`;
// }