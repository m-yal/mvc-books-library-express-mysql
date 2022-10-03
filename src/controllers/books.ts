import connection from "../models/connection";

const LIMIT: number = 20;

export function getBooks(req: any, res: any) {
    if (typeof req.query.search === "string") {
        search(req, res);
    } else {
        getAll(req, res);
    }
}

function getAll(req: any, res: any) {
    console.log("INSIDE GET ALL METHOD");
    const offset = req.query.offset || 0;
    const sql = `SELECT * FROM books WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
    console.log("SQL query: " + sql);
    connection.query(sql, async (err, result) => {
        if (err) {
            console.log(`Error during getting all books with offset ${offset}`);
            res.status(500);
            return res.send({error: "Error in database during getting books list: " + err});
        }
        console.log(`Query result form file getting books: ${await result}`);
        await res.status(200);
        await res.render("books/index", {books: await result, searchQuery: null});
    });
};

function search(req: any, res: any) {
    console.log("INSIDE SEARCH METHOD");
    const { author, year, offset } = req.query;

    const searchQuery = req.query.search;
    const authorQuery = author ? `autor_id = ${author}` : "";
    const yearQuery = year ? `year = ${year}` : "";
    const offsetQuery = `LIMIT 20 OFFSET ${offset || 0}`;

    let sql: string;
    if (!author && !year) {
        sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' ${offsetQuery};`;
    } else {
        if (author && year) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} AND ${yearQuery} ${offsetQuery};`;                
        } else if (author) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} ${offsetQuery};`
        } else {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${yearQuery} ${offsetQuery};`;                
        }
    }
    console.log("sql " + sql);
    connection.query(sql, async (err, result) => {
        if (err) {
            console.log(`Error during getting books`);
            res.status(500);
            return res.send({error: "Error in database during searching books: " + err});
        }
        console.log(`Query result form file getting books: ${await result}`);
        console.log("search query: " + searchQuery);
        await res.status(200);
        console.log("Status is set");
        await res.render("books/index", {books: await result, searchQuery: searchQuery});
        console.log("Response rendered");
    });
};