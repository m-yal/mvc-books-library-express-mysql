import connection from "../../models/utils/connection";

const LIMIT: number = 20;
const bookPageRenderPath = "v1/books/index";
const countAllBooksSQL = `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`;

export function getBooks(req: any, res: any) {
    if (typeof req.query.search === "string") {
        search(req, res);
    } else {
        getAll(req, res);
    }
};

async function getAll(req: any, res: any) {
    const offset = req.query.offset || 0;
    try {
        const getBooksListSQL = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ${LIMIT} OFFSET ${offset};`;
        const booksResp: any = await (await connection).query(getBooksListSQL);
        const books = booksResp[0];
        const count = await countBooksAmount(books, res, offset, null, getBooksListSQL, req);
        const pagesStatus: any = assemblePagesStatusData(offset, count);
        await res.status(200);
        await res.render(bookPageRenderPath, {books: books, searchQuery: null, pagesStatus: pagesStatus});
    } catch (err) {
        await res.status(500);
        return await res.json({error: `Error in database during getting books list with offset ${offset} -> ${err}`});
    }
};

async function countBooksAmount(result: any, res: any, offset: any, searchQuery: string | null, sql: string, req: any) {
    try {
        const foundBooksCountSQLQuery = (typeof searchQuery === null) ?
            countAllBooksSQL : composeFoundBooksCountQuery(sql, `LIMIT ${LIMIT} OFFSET ${req.query.offset}`);
        const countResp: any = await (await connection).query(foundBooksCountSQLQuery);
        return countResp[0][0].count;
    } catch (err) {
        throw Error("Error during count books query -> " + err);        
    }
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
        const { author, year, search } = req.query;
        const offset = req.query.offset || 0;
        const searchSQL: string = composeSLQQuery(author, year, offset, search);  
        const searchResp: any = await (await connection).query(searchSQL);
        const books = searchResp[0];
        const count = await countBooksAmount(books, res, offset, search, searchSQL, req);
        await res.status(200);
        await res.render(bookPageRenderPath, {books: books, searchQuery: search, pagesStatus: assemblePagesStatusData(offset, count)});
    } catch (err) {
        res.status(500);
        return res.json({error: "Error in database during searching books: " + err});
    }
};

function composeSLQQuery(author: string, year: string, offset: string, searchQuery: string): string {
    const mainPart = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%'`;
    const authorPart = author ? ` AND autor_id = ${author}` : "";
    const yearPart = year ? ` AND year = ${year}` : "";
    const orderByPart = `ORDER BY book_name ASC`;
    const offsetPart = `LIMIT ${LIMIT} OFFSET ${offset};`;
    return mainPart + " " + [authorPart, yearPart].join("") + " " + orderByPart + " " + offsetPart; 
}

function composeFoundBooksCountQuery(sql: string, offset: string) {
    return  sql
        .replace("*", "COUNT(*) AS count")
        .replace("ORDER BY book_name ASC", "")
        .replace(offset, "");
}