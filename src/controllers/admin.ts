import connection from "../models/utils/connection";

const LIMIT: number = 20;

export function deleteBook(req: any, res: any) {
    const bookId: string = req.params.id;
    const sql: string = `UPDATE books_v1 SET is_deleted = TRUE WHERE id = ${bookId}`;
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
    const offset = req.query.offset || 0;
    const sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
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
    connection.query(`SELECT COUNT(*) AS count FROM books_v1 WHERE is_deleted = FALSE;`, async (err, rowsCount) => {
        try {
            if (err) throw err;
            await res.render("v1/admin/index", {books: await books, pagesAmount: await rowsCount[0].count / LIMIT, currentPage: (offset / LIMIT) + 1 });
        } catch (err) {
            throw err;
        }
    });
}

export async function addBook(req: any, res: any) {
    connection.query(assembleAddBookSqlQuery(req), async (err, result) => {
        try {
            if (err) throw err;
            await res.status(200);
            await res.redirect("http://localhost:3005/api/v1/admin/"); 
        } catch (err) {
            await res.status(500);
            return await res.send({error: "Error in database during adding new book: " + err});
        }
    });
}

function assembleAddBookSqlQuery(req: any) {
    const {bookName, publishYear, author, description} = req.body;
    const imagePath = req.file?.filename || null;
    return `INSERT INTO books_v1(book_name, publish_year, image_path, book_description, author) VALUES ('${bookName}', ${publishYear}, '${imagePath}', '${description}', '${author}');`;
}