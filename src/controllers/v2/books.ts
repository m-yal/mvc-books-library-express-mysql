import connection from "../../models/utils/connection";
import validator from "validator";

const LIMIT: number = 20;
const queryAllBooksSQL = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ? OFFSET ?;`
const countAllBooksSQL = `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`;
const searchSQL = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE ? ORDER BY book_name ASC LIMIT ? OFFSET ?;`;
const adminViewPath = "v2/admin/index";
const booksViewPath = `v2/books/index`;

export async function getBooks(req: any, res: any) {
    if (typeof req.query.search === "string") {
        search(req, res);
    } else {
        getAll(req, res, false);
    }
};

export async function getAll(req: any, res: any, isAdmin: boolean) {
    try {
        await queryBooks(req, res); 
        await countBooksAmount(req, res);
        await queryAuthors(res);
        await renderResult(res, isAdmin);
    } catch (err) {
        await res.status(500);
        await res.json("Error occured during getting books list -> " + err)
    }
};

async function queryBooks(req: any, res: any) {
    try {
        res.locals.search = null;
        res.locals.offset = req.query.offset || 0;
        const [booksData] = await (await connection).query(queryAllBooksSQL, [LIMIT, +res.locals.offset]);
        res.locals.books = booksData;        
    } catch (err) {
        throw Error("Error during querying main books data from db -> " + err);
    }
}

async function countBooksAmount(req: any, res: any) {
    try {
        const foundBooksCountSQLQuery = (typeof res.locals.search === null) ? countAllBooksSQL : composeSearchCountSQL(res);
        const [countResp]: any = await (await connection).query(foundBooksCountSQLQuery);
        const count = await countResp[0].count;
        res.locals.pagesStatus = await assemblePagesStatusData(res.locals.offset, count);
    } catch (err) {
        throw Error ("Error during querying found books count from db -> " + err);
    }
}

async function queryAuthors(res: any) {
    try {
        const authorsQueries = [];
        for (const item of res.locals.books) {
            authorsQueries.push(await queryAuthorsNames(item));
        }
        await Promise.all([authorsQueries]);
    } catch (err) {
        throw Error ("Error during querying authors list from db -> " + err);
    }
}

async function renderResult(res: any, isAdmin: boolean) {
    try {
        await res.status(200);
        if (isAdmin) {
            return await res.render(adminViewPath, 
                {books: res.locals.books, pagesAmount: res.locals.pagesStatus.totalyFound / LIMIT, currentPage: (res.locals.offset / LIMIT) + 1});
        }
        return await res.render(booksViewPath, {books: res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus});    
    } catch (err) {
        throw Error ("Error assembling response for rendering or rendering -> " + err);
    }
}

async function queryAuthorsNames(book: any) {
    try {
        const [ authorsIds ]: any = await (await connection).execute(`SELECT author_id FROM books_authors WHERE book_id = ${book.id};`);
        book.authors = [];
        for (const item of authorsIds) {
            const nameResponse: any =  await (await connection).execute(`SELECT author FROM authors WHERE id = ${item.author_id}`);
            const name = nameResponse[0][0].author;
            await book.authors.push(await name);
        }
        return book.authors;
    } catch (err) {
        throw Error ("Error during querying authors names from db -> " + err);
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
        replaceQueryStringsToResponseLocals(req, res);
        await queryMainBookData(res);
        await countBooksAmount(req, res);
        await queryAuthors(res);
        finish(res);
    } catch (err) {
        await res.status(500);
        return res.json({error: "Error in database during searching books: " + err});
    }    
};

function replaceQueryStringsToResponseLocals(req: any, res: any) {
    res.locals.search = req.query.search === undefined ? undefined : validator.escape(req.query.search);
    res.locals.year = req.query.year === undefined ? undefined : validator.escape(req.query.year);
    res.locals.author = req.query.author === undefined ? undefined : validator.escape(req.query.autho);
    res.locals.search = req.query.search === undefined ? undefined : validator.escape(req.query.search);
    res.locals.offset = req.query.offset === undefined ? 0 : Number(validator.escape(req.query.offset));
}

async function queryMainBookData(res: any) {
    const [ booksData ] = await (await connection).query(searchSQL, ["%" + res.locals.search + "%", LIMIT, res.locals.offset]); 
    res.locals.books = booksData;
}

function composeSearchCountSQL(res: any) {
    const offset = res.locals.offset;
    const limitOffset = `LIMIT ${LIMIT} OFFSET ${offset}`;
    return  `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC ${limitOffset};`
        .replace("*", "COUNT(*) AS count")
        .replace("ORDER BY book_name ASC", "")
        .replace(limitOffset, "");
}

function finish(res: any) {
    res.status(200);
    res.render(booksViewPath, {books: res.locals.books, searchQuery: res.locals.search, pagesStatus: res.locals.pagesStatus});
}