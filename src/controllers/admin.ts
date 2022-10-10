import connection from "../models/utils/connection";
import { upload } from "../index";

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
    console.log("INSIDE addBook method");
    const book = await req.body;
    console.log("req.body " + await book);
    const image = await req.file;
    console.log("req.file " + await image);
    res.status(200);
    await res.send();



    // const sql = `INSERT INTO books_v1(book_name, publish_year, image_path, book_description, author)
    //     VALUES (${bookName}, ${publishYear}, ${imagePath}, ${bookDesc}, ${author})`;
    // connection.query(sql, (err, result) => {
    //     if (err) {
    //         console.log(`Error during adding new book: ${req.body}`);
    //         res.status(500);
    //         return res.send({error: "Error in database during adding new book"});
    //     }
    //     console.log(`Query executed`);
    //     res.send({result: result}); // clear prompt/send new books page for admin
    // });
}