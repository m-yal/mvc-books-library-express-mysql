import connection from "../../models/utils/connection";

const LIMIT: number = 20;

export async function getBooks(req: any, res: any) {
    if (typeof req.query.search === "string") {
        res.locals.search = req.query.search;
        search(req, res);
    } else {
        res.locals.search = null;
        getAll(req, res, false);
    }
};

export async function getAll(req: any, res: any, isAdmin: boolean) {
    res.locals.offset = req.query.offset || 0;
    const sql = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ${LIMIT} OFFSET ${res.locals.offset};`;
    const [booksData] = await (await connection).query(sql);
    res.locals.books = booksData;
    await countBooksAmount(res, sql, req);
    const authorsQueries = [];
    for (const item of res.locals.books) {
        authorsQueries.push(await queryAuthorsNames(req, res, item));
    }
    await Promise.all([authorsQueries]);
    await res.status(200);
    if (isAdmin) { //or ternary
        //         await res.status(200);
        //         await res.render("v1/books/index", {books: await result, searchQuery: searchQuery, pagesStatus: pagesStatus});
        return await res.send({books: await res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus});
    }  
    //         await res.status(200);
    //         await res.render("v1/books/index", {books: await result, searchQuery: searchQuery, pagesStatus: pagesStatus});
    return await res.send({books: res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus});
};

async function queryAuthorsNames(req: any, res: any, book: any) {
    console.log("QUERY AUTHOR BOOK ID: " + book.id);
    const [ authorsIds ]: any = await (await connection).execute(`SELECT author_id FROM books_authors WHERE book_id = ${book.id};`);
    console.log("authorsIds " + JSON.stringify(authorsIds));
    book.authors = [];
    for (const item of authorsIds) {
        let name: any = await (await connection).execute(`SELECT author FROM authors WHERE id = ${item.author_id}`)
            .then(result => {
                const nameArr: any = result[0];
                const name: any = nameArr[0].author;
                console.log("single author name query response: " + JSON.stringify(name));
                return name
            });
        console.log("Single name promise: " + JSON.stringify(await name));
        await book.authors.push(await name);
    }
    console.log("authors array: " + JSON.stringify(book.authors));
    return book.authors;
}


async function countBooksAmount(res: any, sql: string, req: any) {
    const foundBooksCountSQLQuery = (typeof res.locals.search === null) ?
        `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`
        :  composeFoundBooksCountQuery(sql, `LIMIT ${LIMIT} OFFSET ${req.query.offset}`);
    await (await connection).query(foundBooksCountSQLQuery)
        .then(async (result: any) => {
            const count = await result[0][0].count;
            console.log("COUNT BOOKS AMOUT QUERY: " + JSON.stringify(count));
            res.locals.pagesStatus = await assemblePagesStatusData(res.locals.offset, count);
        })
        .catch(async err => {
            console.log("Error during counting books list amount: " + err);
            throw err;
        })
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
    try {
        assembleQueryStringsToLocals(req, res);
        const sql: string = composeSLQQuery(res);
        const [ booksData ] = await (await connection).query(sql); 
        res.locals.books = booksData;
        await countBooksAmount(res, sql, req);
        const authorsQueries = [];
        for (let i = 0; i < res.locals.books.length; i++) {
            authorsQueries.push(await queryAuthorsNames(req, res, res.locals.books[i]));
        }
        await Promise.all([authorsQueries]);
        await res.status(200);
        //render
        await res.send({books: res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus});
    } catch (err) {
        await res.status(500);
        return res.send({error: "Error in database during searching books: " + err});
    }    
};

function assembleQueryStringsToLocals(req: any, res: any) {
    res.locals.year = req.query.year;
    res.locals.author = req.query.author;
    res.locals.search = req.query.search;
    res.locals.offset = req.query.offset || 0;
}

function composeSLQQuery(res: any): string {
    let sql: string;
    const authorQuery = res.locals.author ? `autor_id = ${res.locals.author}` : "";
    const yearQuery = res.locals.year ? `year = ${res.locals.year}` : "";
    const offsetQuery = `LIMIT ${LIMIT} OFFSET ${res.locals.offset}`;
    if (!res.locals.author && !res.locals.year) {
        sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${res.locals.search}%' ORDER BY book_name ASC ${offsetQuery};`;
    } else {
        if (res.locals.author && res.locals.year) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${res.locals.search}%' AND ${authorQuery} AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;                
        } else if (res.locals.author) {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${res.locals.search}%' AND ${authorQuery} ORDER BY book_name ASC ${offsetQuery};`
        } else {
            sql = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${res.locals.search}%' AND ${yearQuery} ORDER BY book_name ASC ${offsetQuery};`;                
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