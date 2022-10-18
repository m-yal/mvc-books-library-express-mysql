"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooks = void 0;
const LIMIT = 20;
function getBooks(req, res) {
    if (typeof req.query.search === "string") {
        search(req, res);
    }
    else {
        getAll(req, res);
    }
}
exports.getBooks = getBooks;
;
function getAll(req, res) {
    const offset = req.query.offset || 0;
    const sql = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ${LIMIT} OFFSET ${offset};`;
    // connection.query(sql, async (err, result) => {
    //     try {
    //         if (err) throw err;
    //         countBooksAmount(result, res, offset, null, sql, req);
    //     } catch (err) {
    //         await res.status(500);
    //         return await res.send({error: `Error in database during getting books list with offset ${offset} : ${err}`});            
    //     }
    // });
}
;
function countBooksAmount(result, res, offset, searchQuery, sql, req) {
    const foundBooksCountSQLQuery = (typeof searchQuery === null) ?
        `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`
        : composeFoundBooksCountQuery(sql, `LIMIT ${LIMIT} OFFSET ${req.query.offset}`);
    // connection.query(foundBooksCountSQLQuery, async (err, rowsCount) => {
    //     try {
    //         if (err) throw err;
    //         const pagesStatus: any = assemblePagesStatusData(offset, await rowsCount[0].count);
    //         await res.status(200);
    //         await res.render("v1/books/index", {books: await result, searchQuery: searchQuery, pagesStatus: pagesStatus});
    //     } catch (err) {
    //         await res.status(500);
    //         return await res.send({error: "Error during getting count of rows in talbe during getting book list: " + err});
    //     }
    // });
}
function assemblePagesStatusData(offset, count) {
    const pagesStatus = {
        offsetAhead: +offset + LIMIT,
        offsetBack: +offset - LIMIT,
        totalyFound: count,
    };
    pagesStatus.hasNextPage = pagesStatus.offsetAhead <= pagesStatus.totalyFound;
    pagesStatus.hasPrevPage = pagesStatus.offsetBack >= 0;
    return pagesStatus;
}
function search(req, res) {
    const { author, year, search } = req.query;
    const offset = req.query.offset || 0;
    const sql = composeSLQQuery(author, year, offset, search);
    // connection.query(sql, async (err, result) => {
    //     try {
    //         if (err) throw err;
    //         countBooksAmount(result, res, offset, search, sql, req);
    //     } catch (err) {
    //         res.status(500);
    //         return res.send({error: "Error in database during searching books: " + err});
    //     }
    // });
}
;
function composeSLQQuery(author, year, offset, searchQuery) {
    let sql;
    const authorQuery = author ? `autor_id = ${author}` : "";
    const yearQuery = year ? `year = ${year}` : "";
    const offsetQuery = `LIMIT ${LIMIT} OFFSET ${offset}`;
    if (!author && !year) {
        sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' ORDER BY book_name ASC ${offsetQuery};`;
    }
    else {
        if (author && year) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
        else if (author) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${authorQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
        else {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%' AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;
        }
    }
    return sql;
}
function composeFoundBooksCountQuery(sql, offset) {
    return sql
        .replace("*", "COUNT(*) AS count")
        .replace("ORDER BY book_name ASC", "")
        .replace(offset, "");
}
