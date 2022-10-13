import connection from "../../models/utils/connection";

const LIMIT: number = 20;

export function getBooks(req: any, res: any) {
    if (typeof req.query.search === "string") {
        search(req, res);
    } else {
        getAll(req, res);
    }
};

function getAll(req: any, res: any) {
    const offset = req.query.offset || 0;
    const sql = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ${LIMIT} OFFSET ${offset};`;
    connection.query(sql, async (err, result) => {
        try {
            if (err) throw err;
            countBooksAmount(result, res, offset, null, sql, req);
        } catch (err) {
            await res.status(500);
            return await res.send({error: `Error in database during getting books list with offset ${offset} : ${err}`});            
        }
    });
};

function countBooksAmount(result: any, res: any, offset: any, searchQuery: string | null, sql: string, req: any) {
    const foundBooksCountSQLQuery = (typeof searchQuery === null) ?
        `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`
        : composeFoundBooksCountQuery(sql, `LIMIT ${LIMIT} OFFSET ${req.query.offset}`);
    connection.query(foundBooksCountSQLQuery, async (err, rowsCount) => {
        try {
            if (err) throw err;
            const pagesStatus: any = assemblePagesStatusData(offset, await rowsCount[0].count);
            await res.status(200);
            await res.render("v1/books/index", {books: await result, searchQuery: searchQuery, pagesStatus: pagesStatus});
        } catch (err) {
            await res.status(500);
            return await res.send({error: "Error during getting count of rows in talbe during getting book list: " + err});
        }
    });
}

function assemblePagesStatusData(offset: any, count: any) {
    const pagesStatus: any = {
        offsetAhead: +offset + LIMIT,
        offsetBack: +offset - LIMIT,
        totalyFound: count,
    }
    pagesStatus.hasNextPage = pagesStatus.offsetAhead <= pagesStatus.totalyFound
    pagesStatus.hasPrevPage = pagesStatus.offsetBack >= 0;
    return pagesStatus;
}

function search(req: any, res: any) {
    const { author, year, search } = req.query;
    const offset = req.query.offset || 0;
    const sql: string = composeSLQQuery(author, year, offset, search);
    connection.query(sql, async (err, result) => {
        try {
            if (err) throw err;
            countBooksAmount(result, res, offset, search, sql, req);
        } catch (err) {
            res.status(500);
            return res.send({error: "Error in database during searching books: " + err});
        }
    });
};

function composeSLQQuery(author: string, year: string, offset: string, searchQuery: string): string {
    let sql: string;
    const authorQuery = author ? `autor_id = ${author}` : "";
    const yearQuery = year ? `year = ${year}` : "";
    const offsetQuery = `LIMIT ${LIMIT} OFFSET ${offset}`;
    if (!author && !year) {
        sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' ORDER BY book_name ASC ${offsetQuery};`;
    } else {
        if (author && year) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;                
        } else if (author) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} ORDER BY book_name ASC ${offsetQuery};`
        } else {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;                
        }
    }
    return sql;
}

function composeFoundBooksCountQuery(sql: string, offset: string) {
    return  sql
        .replace("*", "COUNT(*) AS count")
        .replace("ORDER BY book_name ASC", "")
        .replace(offset, "");
}