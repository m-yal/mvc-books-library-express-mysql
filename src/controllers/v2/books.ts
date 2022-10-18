import connection from "../../models/utils/connection";

const LIMIT: number = 20;

export async function getBooks(req: any, res: any) {
    if (typeof req.query.search === "string") {
        res.locals.search = req.query.search;
        search(req, res);
    } else {
        res.locals.search = null;
        getAll(req, res);
    }
};

async function getAll(req: any, res: any) {
    res.locals.offset = req.query.offset || 0;
    const sql = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ${LIMIT} OFFSET ${res.locals.offset};`;
    (await connection).query(sql)
        .then(async result => {
            res.locals.books = result[0];
            console.log("GET ALL QUERY RESULT[0]: " + JSON.stringify(result[0]));
            await countBooksAmount(res, sql, req);
            const authorsQueries = [];
            for (let i = 0; i < res.locals.books.length; i++) {
                authorsQueries.push(queryAuthorsNames(req, res, res.locals.books[i]));
            }
            await Promise.all([authorsQueries]);
            await res.status(200);
            await res.send({books: await res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus});
        })
        .catch(async err => {
            await res.status(500);
            return await res.send({error: `Error in database during getting books list with offset ${res.locals.offset} : ${err}`})
        });
    // connection.query(sql, async (err, result) => {
    //     try {
    //         if (err) throw err;
    //         countBooksAmount(result, res, offset, null, sql, req);
    //     } catch (err) {
    //         await res.status(500);
    //         return await res.send({error: `Error in database during getting books list with offset ${offset} : ${err}`});            
    //     }
    // });
};

async function queryAuthorsNames(req: any, res: any, book: any) {
    console.log("QUERY AUTHOR BOOK ID: " + book.id);
    (await connection).query(`SELECT author_id FROM books_authors WHERE book_id = ${book.id};`)
        .then(async result => {
            const authorsIds: any = result[0];
            console.log(`BOOK WITH ID ${book.id} have next authors ids ${authorsIds}`);

            book.authors = [];

            for (let i = 0; i < authorsIds.length; i++) {
                await querySingleAuthorName(req, res, book, authorsIds[i]);// need to stay sync
            }
        })
        .catch(err => {
            console.log("Error during querying authors names for book with id: " + book.id);
            throw err;
        }) 
}

async function querySingleAuthorName(req: any, res: any, book: any, authorId: any) {
    (await connection).query(`SELECT author FROM authors WHERE id = ${authorId}`)
        .then(result => {
            const name = result[0];
            console.log("AUTHOR NAME: " + name);
            book.authors.push(name);
        })
        .catch(err => {
            console.log(`Error during quering single author name wiht author id - ${authorId} and book id - ${book.id}`);
            throw err;
        })
}

async function countBooksAmount(res: any, sql: string, req: any) {
    const foundBooksCountSQLQuery = (typeof res.locals.search === null) ?
        `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`
        :  composeFoundBooksCountQuery(sql, `LIMIT ${LIMIT} OFFSET ${req.query.offset}`);
    (await connection).query(foundBooksCountSQLQuery)
        .then(async (result: any) => {
            const count = await result[0][0].count;
            console.log("COUNT BOOKS AMOUT QUERY: " + JSON.stringify(count));
            res.locals.pagesStatus = await assemblePagesStatusData(res.locals.offset, count);
        })
        .catch(async err => {
            console.log("Error during counting books list amount: " + err);
            throw err;
        })
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

async function search(req: any, res: any) {
    const { author, year } = req.query;
    const offset = req.query.offset || 0;
    const sql: string = composeSLQQuery(author, year, offset, res.locals.search);
    (await connection).query(sql)
        .then(async result => {
            countBooksAmount(result, res, offset, search, sql, req);
        })
        .catch(async err => {
            await res.status(500);
            return res.send({error: "Error in database during searching books: " + err});
        })
    // connection.query(sql, async (err, result) => {
    //     try {
    //         if (err) throw err;
    //         countBooksAmount(result, res, offset, search, sql, req);
    //     } catch (err) {
    //         res.status(500);
    //         return res.send({error: "Error in database during searching books: " + err});
    //     }
    // });
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