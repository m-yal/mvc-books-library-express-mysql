import connection from "../models/utils/connection";

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
    const sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ${LIMIT} OFFSET ${offset};`;
    console.log("SQL query: " + sql);
    connection.query(sql, async (err, result) => {
        if (err) {
            console.log(`Error during getting all books with offset ${offset}`);
            res.status(500);
            return res.send({error: "Error in database during getting books list: " + err});
        }
        console.log(`Query result form getting books: ${await result}`);
        connection.query(`SELECT COUNT(*) AS count FROM books_v1 WHERE is_deleted = FALSE;`, async (err, rowsCount) => {
            if (err) {
                console.log("Error during getting count of rows in talbe during getting all: " + err);
                res.status(500);
                return res.send({error: "Error during getting count of rows in talbe during getting all: " + err});
            }
            let hasPrevPage: boolean = false, hasNextPage: boolean = false;
            const totalyFound: number = rowsCount[0].count;
            console.log("totalyFound " + totalyFound);
            const offsetAhead = +offset + LIMIT;
            console.log(`offsetAhead ${offsetAhead}`);
            const offsetBack = +offset - LIMIT;
            console.log(`offsetBack ${offsetBack}`);
            if (offsetAhead <= totalyFound) hasNextPage = true;
            if (offsetBack >= 0) hasPrevPage = true;
            await res.status(200);
            const pagesStatus = {hasPrevPage: hasPrevPage, hasNextPage: hasNextPage, totalyFound: totalyFound, offsetAhead: offsetAhead, offsetBack: offsetBack};
            console.log(`hasPrevPage ${hasPrevPage}`);
            console.log(`hasNextPage ${hasNextPage}`);
            await res.render("v1/books/index", {books: await result, searchQuery: null, pagesStatus: pagesStatus});
        });
    });
};

function search(req: any, res: any) {
    console.log("INSIDE SEARCH METHOD");
    const { author, year } = req.query;
    const offset = req.query.offset || 0;

    const searchQuery = req.query.search;
    const authorQuery = author ? `autor_id = ${author}` : "";
    const yearQuery = year ? `year = ${year}` : "";
    const offsetQuery = `LIMIT ${LIMIT} OFFSET ${offset}`;

    let sql: string;
    if (!author && !year) {
        sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' ORDER BY book_name ASC ${offsetQuery};`;
    } else {
        if (author && year) {
            sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;                
        } else if (author) {
            sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} ORDER BY book_name ASC ${offsetQuery};`
        } else {
            sql = `SELECT * FROM books_v1 WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;                
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
        const countSQL = sql.replace("*", "COUNT(*) AS count").replace("ORDER BY book_name ASC", "").replace(offsetQuery, "");
        console.log("countSQL " + countSQL);
        connection.query(countSQL, async (err, rowsCount) => {
            if (err) {
                console.log("Error during getting count of rows in talbe during getting all: " + err);
                res.status(500);
                return res.send({error: "Error during getting count of rows in talbe during getting all: " + err});
            }
            let hasPrevPage: boolean = false, hasNextPage: boolean = false;
            console.log("rowsCount " + rowsCount);
            console.log("rowsCount[0] " + rowsCount[0]);
            const totalyFound: number = rowsCount[0].count;
            console.log("totalyFound " + totalyFound);
            const offsetAhead = +offset + LIMIT;
            console.log(`offsetAhead ${offsetAhead}`);
            const offsetBack = +offset - LIMIT;
            console.log(`offsetBack ${offsetBack}`);
            if (offsetAhead <= totalyFound) hasNextPage = true;
            if (offsetBack >= 0) hasPrevPage = true;
            const pagesStatus = {hasPrevPage: hasPrevPage, hasNextPage: hasNextPage, totalyFound: totalyFound, offsetAhead: offsetAhead, offsetBack: offsetBack};
            console.log(`hasPrevPage ${hasPrevPage}`);
            console.log(`hasNextPage ${hasNextPage}`);
            await res.status(200);
            await res.render("v1/books/index", {books: await result, searchQuery: searchQuery, pagesStatus: pagesStatus});
        });
    });
};