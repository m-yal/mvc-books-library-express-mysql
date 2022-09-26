import connection from "../models/connection";

const LIMIT: number = 20;

export function getBooks(req: any, res: any) {
    if (req.query.search) {
        search(req, res);
    } else {
        getAll(req, res);
    }
}

function getAll(req: any, res: any) {
    const offset = req.query.offset;
    const sql = `SELECT * FROM books LIMIT ${LIMIT} OFFSET ${offset};`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during getting all books with offset ${offset}`);
            res.send(500);
            return res.send({error: "Error in database during getting books list: " + err});
        }
        console.log(`Query result form file getting books: ${result}`);
        res.send({result: result});
    });
};

function search(req: any, res: any) {
    const { author, year, offset } = req.query;

    const searchQuery = req.query.search;
    const authorQuery = author ? `autor_id = ${author}` : "";
    const yearQuery = year ? `year = ${year}` : "";
    const offsetQuery = `LIMIT 20 OFFSET ${offset}`;

    let sql: string;
    if (!author && !year) {
        sql = `SELECT * FROM books WHERE book_name LIKE '%${searchQuery}%' ${offsetQuery};`;
    } else {
        if (author && year) {
            sql = `SELECT * FROM books WHERE book_name LIKE '%${searchQuery}%' AND ${authorQuery} AND ${yearQuery} ${offsetQuery};`;                
        } else if (author) {
            sql = `SELECT * FROM books WHERE book_name LIKE '%${searchQuery}%' AND ${authorQuery} ${offsetQuery};`
        } else {
            sql = `SELECT * FROM books WHERE book_name LIKE '%${searchQuery}%' AND ${yearQuery} ${offsetQuery};`;                
        }
    }

    connection.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during getting books`);
            res.send(500);
            return res.send({error: "Error in database during searching books: " + err});
        }
        console.log(`Query result form file getting books: ${result}`);
        res.send({result: result});
    });
};