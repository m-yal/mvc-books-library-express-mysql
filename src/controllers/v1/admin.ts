import connection from "../../models/utils/connection";

const LIMIT: number = 20;

export function deleteBook(req: any, res: any) {
    const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    connection.query(sql, (err, result) => {
        try {
            if (err) throw err;
            const isSessionPermited = Boolean(result[0].dbResponse);
            if (isSessionPermited) {
                deleteBookQuery(req, res);
            } else {
                res.status(401);
                res.redirect("http://localhost:3005/api/v1/auth");
            }
        } catch (err) {
            console.error(err);
            res.status(500);
            res.redirect("http://localhost:3005/api/v1/auth");
        }
    });

    
}

function deleteBookQuery(req: any, res: any) {
    const bookId: string = req.params.id;
    const sql: string = `UPDATE books SET is_deleted = TRUE WHERE id = ${bookId}`;
    connection.query(sql, async (err, result) => {
        try {
            if (err) throw err;
            await res.status(200);
            await res.send({ok: true});
        } catch (err) {
            await res.status(500);
            return await res.send({error: "Error during deleting"});
        }
    });
}

export function getBooks(req: any, res: any) {
    const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    connection.query(sql, (err, result) => {
        try {
            if (err) throw err;
            const isSessionPermited = Boolean(result[0].dbResponse);
            if (isSessionPermited) {
                queryBooksList(req, res);
            } else {
                res.status(401);
                res.redirect("http://localhost:3005/api/v1/auth");
            }
        } catch (err) {
            console.error(err);
            res.status(500);
            res.redirect("http://localhost:3005/api/v1/auth");
        }
    });
}

function queryBooksList(req: any, res: any) {
    const offset = req.query.offset || 0;
    const sql = `SELECT * FROM books WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
    connection.query(sql, async (err, books) => {
        try {
            if (err) throw err;
            definePagesAmount(res, books, offset);
        } catch (err) {
            await res.status(500);
            return await res.send({error: `Error in database during getting books list for admin with offset ${offset}: ${err}`})
        }
    });
}

async function definePagesAmount(res: any, books: any, offset: any) {
    connection.query(`SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`, async (err, rowsCount) => {
        try {
            if (err) throw err;
            await res.render("v1/admin/index", {books: await books, pagesAmount: await rowsCount[0].count / LIMIT, currentPage: (offset / LIMIT) + 1 });
        } catch (err) {
            throw err;
        }
    });
}

export async function addBook(req: any, res: any) {
    console.log("INSIDE addBook");
    const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    connection.query(sql, (err, result) => {
        try {
            if (err) throw err;
            const isSessionPermited = Boolean(result[0].dbResponse);
            console.log("isSessionPermited " + isSessionPermited);
            if (isSessionPermited) {
                addBookQuery(req, res);
            } else {
                res.status(401);
                res.redirect("http://localhost:3005/api/v1/auth");
            }
        } catch (err) {
            console.error(err);
            res.status(500);
            res.redirect("http://localhost:3005/api/v1/auth");
        }
    });
}

function addBookQuery(req: any, res: any) {
    connection.query(assembleAddBookSqlQuery(req), async (err, result) => {
        try {
            if (err) throw err;
            await res.status(200);
            await res.redirect("http://localhost:3005/api/v1/admin"); 
        } catch (err) {
            await res.status(500);
            return await res.send({error: "Error in database during adding new book: " + err});
        }
    });
}

function assembleAddBookSqlQuery(req: any) {
    const {bookName, publishYear, author_1, author_2, author_3, description} = req.body;
    const imagePath = req.file?.filename || null;
    return `INSERT INTO books(book_name, publish_year, image_path, book_description, author_1, author_2, author_3) VALUES ('${bookName}', ${publishYear || 0}, '${imagePath}', '${description}', '${author_1}', '${author_2}', '${author_3}');`;
}