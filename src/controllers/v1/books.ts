import { RowDataPacket } from "mysql2";
import connection from "../../models/utils/connection";
import { DBResponse, PagesStatusObj, Request, Response } from "../../types";

const LIMIT: number = 20;
const bookPageRenderPath: string = "v1/books/index";
const countAllBooksSQL: string = `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`;
const getBooksListSQL: string = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ? OFFSET ?;`;

export function getBooks(req: Request, res: Response): void {
    if (typeof req.query.search === "string") {
        search(req, res);
    } else {
        getAll(req, res);
    }
};

async function getAll(req: Request, res: Response): Promise<Response | void> {
    const offset: number = Number(req.query.offset) || 0;
    try {
        const booksResp: DBResponse = await (await connection).query(getBooksListSQL, [LIMIT, offset]);
        const books: RowDataPacket[] = booksResp[0];
        const count: number = await countBooksAmount(offset, null, getBooksListSQL);
        const pagesStatus: PagesStatusObj = assemblePagesStatusData(offset, count);
        res.status(200);
        res.render(bookPageRenderPath, {books: books, searchQuery: null, pagesStatus: pagesStatus});
    } catch (err) {
        res.status(500);
        return res.json({error: `Error in database during getting books list with offset ${offset} -> ${err}`});
    }
};

async function countBooksAmount(offset: number, searchQuery: string | null, sql: string): Promise<number> {
    try {
        const foundBooksCountSQLQuery: string = typeof searchQuery === null ?
            countAllBooksSQL : composeFoundBooksCountQuery(sql, `LIMIT ${LIMIT} OFFSET ${offset}`);
        const countResp: DBResponse = await (await connection).query(foundBooksCountSQLQuery);
        return countResp[0][0].count;
    } catch (err) {
        throw Error("Error during count books query -> " + err);        
    }
}

function assemblePagesStatusData(offset: number, count: number): PagesStatusObj {
    const pagesStatus: PagesStatusObj = {
        offsetAhead: offset + LIMIT,
        offsetBack: offset - LIMIT,
        totalyFound: count,
    }
    pagesStatus.hasNextPage = pagesStatus.offsetAhead <= pagesStatus.totalyFound
    pagesStatus.hasPrevPage = pagesStatus.offsetBack >= 0;
    return pagesStatus;
}

async function search(req: Request, res: Response): Promise<Response | void> {
    try {
        const author: string = String(req.query.author);
        const year: string = String(req.query.year);
        const search: string = String(req.query.search);
        const offset: number = Number(req.query.offset) || 0;
        
        const searchSQL: string = composeSLQQuery(author, year, offset, search);  
        const searchResp: DBResponse = await (await connection).query(searchSQL);
        const books: RowDataPacket[] = searchResp[0];
        const count: number = await countBooksAmount(offset, search, searchSQL);
        res.status(200);
        res.render(bookPageRenderPath, {books: books, searchQuery: search, pagesStatus: assemblePagesStatusData(offset, count)});
    } catch (err) {
        res.status(500);
        return res.json({error: "Error in database during searching books: " + err});
    }
};

function composeSLQQuery(author: string, year: string, offset: number, searchQuery: string): string {
    const mainPart: string = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE '%${searchQuery}%'`;
    const authorPart: string = author ? ` AND autor_id = ${author}` : "";
    const yearPart: string = year ? ` AND year = ${year}` : "";
    const orderByPart: string = `ORDER BY book_name ASC`;
    const offsetPart: string = `LIMIT ${LIMIT} OFFSET ${offset};`;
    return mainPart + " " + [authorPart, yearPart].join("") + " " + orderByPart + " " + offsetPart; 
}

function composeFoundBooksCountQuery(sql: string, offset: string): string {
    return sql
        .replace("*", "COUNT(*) AS count")
        .replace("ORDER BY book_name ASC", "")
        .replace(String(offset), "");
}