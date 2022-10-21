import connection from "../../models/utils/connection";

const LIMIT: number = 20;


export async function deleteBook(req: any, res: any) {
    try {
        const isPermited: any = await isSessionPermited(req);
        if (isPermited) {
            deleteBookQuery(req, res);
            await res.status(200);
            await res.send({ok: true});
        } else {
            await res.status(401);
            await res.redirect("http://localhost:3005/api/v1/auth");
        }
    } catch (err) {
        await res.status(500);
        res.redirect("http://localhost:3005/api/v1/auth");
    }
}

async function isSessionPermited(req: any) {
    const checkSessionSQL = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    const sessionCheckResp: any = await (await connection).query(checkSessionSQL);
    const isSessionPermited = Boolean(sessionCheckResp[0][0].dbResponse);
    return isSessionPermited;
}

async function deleteBookQuery(req: any, res: any) {
    try {
        const bookId: string = req.params.id;
        const deleteSQL: string = `UPDATE books SET is_deleted = TRUE WHERE id = ${bookId}`;
        await (await connection).query(deleteSQL);
    } catch (err) {
        throw Error("Error during deleting book from db query -> " + err);
    }
}

export async function getBooks(req: any, res: any) {
    try {
        if (await isSessionPermited(req)) {
            const books = await queryBooksList(req, res);
            const count = await definePagesAmount(res, books, req.query.offset);
            res.status(200);
            await res.render("v1/admin/index", {books: books, pagesAmount: count / LIMIT, currentPage: (req.query.offset / LIMIT) + 1 });
        } else {
            res.status(401);
            res.redirect("http://localhost:3005/api/v1/auth");
        }
    } catch (err) {
        await res.status(500);
        await res.json("Error during getting books for admin -> " + err);
    }
}

async function queryBooksList(req: any, res: any) {
    try {
        const offset = req.query.offset || 0;
        const booksListSQL = `SELECT * FROM books WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
        const booksResp = await (await connection).query(booksListSQL);
        const books = booksResp[0];
        return books;
    } catch (err) {
        throw Error(`Error in database during getting books list for admin with offset -> ${err}`);
    }
}

async function definePagesAmount(res: any, books: any, offset: any) {
    try {
        const pagesCountSQL = `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`;
        const countResp: any = await (await connection).query(pagesCountSQL);
        const count = countResp[0][0].count;
        return count;
    } catch (err) {
        throw Error("Error during defining pages amount -> " + err);
    }
}

export async function addBook(req: any, res: any) {
    const sql = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE '%${req.sessionID}%' LIMIT 1) as dbResponse;`;
    // connection.query(sql, (err, result) => {
    //     try {
    //         if (err) throw err;
    //         const isSessionPermited = Boolean(result[0].dbResponse);
    //         console.log("isSessionPermited " + isSessionPermited);
    //         if (isSessionPermited) {
    //             addBookQuery(req, res);
    //         } else {
    //             res.status(401);
    //             res.redirect("http://localhost:3005/api/v1/auth");
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500);
    //         res.redirect("http://localhost:3005/api/v1/auth");
    //     }
    // });
}

async function addBookQuery(req: any, res: any) {
    // connection.query(assembleAddBookSqlQuery(req), async (err, result) => {
    //     try {
    //         if (err) throw err;
    //         await res.status(200);
    //         await res.redirect("http://localhost:3005/api/v1/admin"); 
    //     } catch (err) {
    //         await res.status(500);
    //         return await res.send({error: "Error in database during adding new book: " + err});
    //     }
    // });
}

function assembleAddBookSqlQuery(req: any) {
    const {bookName, publishYear, author_1, author_2, author_3, description} = req.body;
    const imagePath = req.file?.filename || null;
    return `INSERT INTO books(book_name, publish_year, image_path, book_description, author_1, 
        author_2, author_3) VALUES ('${bookName}', ${publishYear || 0}, '${imagePath}', 
        '${description}', '${author_1}', '${author_2}', '${author_3}');`;
}