import connection from "../../models/utils/connection";
import { getAll } from "./books";

const LIMIT: number = 20;

export async function deleteBook(req: any, res: any) {
    const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    (await connection).query(sql)
        .then(async (result: any) => {
            const isSessionPresent = await result[0][0].dbResponse;
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
            const isSessionPresent = Boolean(await result[0][0].dbResponse);
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
            const isSessionPresent = await result[0][0].dbResponse;
            if (!isSessionPresent) {
                await res.status(401);
                return await res.redirect(`http://localhost:3005/auth`)
            };

            console.log("BEFORE PROMISE ALL");
            let queries: any = [ addBookDataQuery(req, res),  addAuthors(req, res) ]
            await Promise.all(queries);
            console.log("AFTER PROMISE ALL");

            queries = [];
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
        SELECT id FROM books WHERE book_name = '${bookName}';`;
    return await (await connection).query(sql)
        .then(result => {
            const response: any = result[0];
            const bookId: any = response[1][0].id;
            res.locals.bookId = bookId;
            console.log("NEW BOOK ID: " + res.locals.bookId);
        })
        .catch(err => {
            console.log("Error during add book query");
            throw err;
        })
}

async function addAuthors(req: any, res: any) {
    console.log("INSIDE ADD AUTHORS, req.body: " + JSON.stringify(req.body));
    res.locals.authorsIds = [];
    const authors = [ req.body.author_1, req.body.author_2, req.body.author_3 ];
    console.log("Authors before adding to db: " + JSON.stringify(authors));
    for (const author of authors) {
        await (await connection).query(`INSERT INTO authors(author) VALUES('${author}');`);
        const authorIdResponse: any = await (await connection).query(`SELECT id FROM authors WHERE author = '${author}';`);
        const authorId: any = authorIdResponse[0][0].id;
        console.log("authorId " + JSON.stringify(authorId));
        await res.locals.authorsIds.push(authorId); 
    }
    console.log("Authors Ids after adding to db: " + JSON.stringify(res.locals.authorsIds));
}

// function assembleAddBookSqlQuery(req: any) {
//     const {bookName, publishYear, author_1, author_2, author_3, description} = req.body;
//     const imagePath = req.file?.filename || null;
//     return `INSERT INTO books(book_name, publish_year, image_path, book_description, author_1, author_2, author_3)
//      VALUES ('${bookName}', ${publishYear || 0}, '${imagePath}', '${description}', '${author_1}', '${author_2}', '${author_3}');`;
// }