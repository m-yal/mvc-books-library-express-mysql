import connection from "../../models/utils/connection";
import validator from "validator";
import { DBResponse, PagesStatusObj, Request, Response } from "../../types";

const LIMIT: number = 20;
const queryAllBooksSQL: string = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ? OFFSET ?;`
const countAllBooksSQL: string = `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`;
const searchSQL: string = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE ? ORDER BY book_name ASC LIMIT ? OFFSET ?;`;
const adminViewPath: string = "v2/admin/index";
const booksViewPath: string = `v2/books/index`;

export async function getBooks(req: Request, res: Response): Promise<void> {
    if (typeof req.query.search === "string") {
        search(req, res);
    } else {
        getAll(req, res, false);
    }
};

export async function getAll(req: Request, res: Response, isAdmin: boolean): Promise<void> {
    try {
        await queryBooks(req, res); 
        await countBooksAmount(req, res);
        await queryAuthors(res);
        await renderResult(res, isAdmin, req);
    } catch (err) {
        res.status(500);
        res.json("Error occured during getting books list -> " + err)
    }
};

async function queryBooks(req: Request, res: Response): Promise<void> {
    try {
        res.locals.search = null;
        res.locals.offset = req.query.offset || 0;
        const [booksData]: DBResponse = await (await connection).query(queryAllBooksSQL, [LIMIT, +res.locals.offset]);
        res.locals.books = booksData;        
    } catch (err) {
        throw Error("Error during querying main books data from db -> " + err);
    }
}

async function countBooksAmount(req: Request, res: Response): Promise<void>  {
    try {
        const isSearchQuery: boolean = res.locals.search !== null;
        let count: number;
        if (isSearchQuery) {
            const foundBooksCountSQLQuery: string = composeSearchCountSQL(res);
            const [countResp]: DBResponse = await (await connection).query(foundBooksCountSQLQuery, ["%" + res.locals.search + "%"]);
            count = await countResp[0].count;            
        } else {
            const [countResp]: DBResponse = await (await connection).query(countAllBooksSQL);
            count = await countResp[0].count;
        }
        res.locals.pagesStatus = assemblePagesStatusData(res.locals.offset, count);
    } catch (err) {
        throw Error ("Error during querying found books count from db -> " + err);
    }
}

async function queryAuthors(res: Response): Promise<void> {
    try {
        const authorsQueries: string[][] = [];
        for (const book of res.locals.books) {
            authorsQueries.push(await queryAuthorsNames(book));
        }
        await Promise.all([authorsQueries]);
    } catch (err) {
        throw Error ("Error during querying authors list from db -> " + err);
    }
}

async function renderResult(res: Response, isAdmin: boolean, req: Request): Promise<void> {
    try {
        res.status(200);
        if (isAdmin) {
            return res.render(adminViewPath, 
                {books: res.locals.books, pagesAmount: res.locals.pagesStatus.totalyFound / LIMIT, currentPage: (res.locals.offset / LIMIT) + 1});
        }
        res.render(booksViewPath, {books: res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus});    
    } catch (err) {
        throw Error ("Error assembling response for rendering or rendering -> " + err);
    }
}

async function queryAuthorsNames(book: any): Promise<string[]> {
    try {
        const [ authorsIds ]: DBResponse = await (await connection).execute(`SELECT author_id FROM books_authors WHERE book_id = ${book.id};`);
        book.authors = [];
        for (const item of authorsIds) {
            const nameResponse: DBResponse =  await (await connection).execute(`SELECT author FROM authors WHERE id = ${item.author_id}`);
            const name: string = await nameResponse[0][0].author;
            await book.authors.push(name);
        }
        return book.authors;
    } catch (err) {
        throw Error ("Error during querying authors names from db -> " + err);
    }
}

function assemblePagesStatusData(offset: any, count: any): PagesStatusObj {
    const pagesStatus: any = {
        offsetAhead: +offset + LIMIT,
        offsetBack: +offset - LIMIT,
        totalyFound: count,
    }
    pagesStatus.hasNextPage = pagesStatus.offsetAhead <= pagesStatus.totalyFound
    pagesStatus.hasPrevPage = pagesStatus.offsetBack >= 0;
    return pagesStatus;
}

async function search(req: Request, res: Response): Promise<void> {
    try {
        replaceQueryStringsToResponseLocals(req, res);
        await queryMainBookData(res);
        await countBooksAmount(req, res);
        await queryAuthors(res);
        finish(res);
    } catch (err) {
        res.status(500);
        res.json({error: "Error in database during searching books: " + err});
    }    
};

function replaceQueryStringsToResponseLocals(req: Request, res: Response): void {
    res.locals.search = req.query.search === undefined ? undefined : validator.escape(String(req.query.search));
    res.locals.year = req.query.year === undefined ? undefined : validator.escape(String(req.query.year));
    res.locals.author = req.query.author === undefined ? undefined : validator.escape(String(req.query.autho));
    res.locals.offset = req.query.offset === undefined ? 0 : Number(validator.escape(String(req.query.offset)));
}

async function queryMainBookData(res: Response): Promise<void> {
    const [ booksData ]: DBResponse = await (await connection).query(searchSQL, ["%" + res.locals.search + "%", LIMIT, res.locals.offset]);
    res.locals.books = booksData;
}

function composeSearchCountSQL(res: Response): string {
    const offset: number = res.locals.offset;
    const limitOffset: string = `LIMIT ${LIMIT} OFFSET ${offset}`;
    return  `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE ? ORDER BY book_name ASC ${limitOffset};`
        .replace("*", "COUNT(*) AS count")
        .replace("ORDER BY book_name ASC", "")
        .replace(limitOffset, "");
}

function finish(res: Response): void {
    res.status(200);
    res.render(booksViewPath, {books: res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus});
}