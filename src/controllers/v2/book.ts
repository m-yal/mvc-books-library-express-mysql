import connection from "../../models/utils/connection";

const singleBookViewPath = "v2/book/index";
const getBookIdSQL = `SELECT * FROM books WHERE id = ? AND is_deleted = FALSE;`;
const getAuthorsIdsSQL = `SELECT author_id FROM books_authors WHERE book_id = ?;`;
const getAuthorNameSQL = `SELECT author FROM authors WHERE id = ?;`;

export async function getBook(req: any, res: any) {
    try {
        await queryBookData(req, res);
        await res.status(200);
        await res.render(singleBookViewPath, {book: res.locals.book});
    } catch (err) {
        await res.status(500);
        await res.json({error: "Error during getting single book -> " + err});
    }
}

async function queryBookData(req: any, res: any) {
    try {
        const bookId: string = req.params.bookId;
        await Promise.all([
            queryBookById(res, bookId),
            queryAuthors(req, res, bookId),
            incrCounter("visits", bookId)
        ]);
        res.locals.book.authors = await res.locals.authors;    
    } catch (err) {
        throw Error("Error in databese during getting single book -> " + err);
    }
}

async function queryBookById(res: any, bookId: string): Promise<any> {
    try {
        const bookIdResponse: any = await (await connection).query(getBookIdSQL, [bookId]); 
        res.locals.book = bookIdResponse[0][0];
    } catch (err) {
        throw Error("Error during querying book data by id: " + err);
    }
}

async function queryAuthors(req: any, res: any, bookId: string): Promise<any> {
    try {
        const authorsIdsResponse = await (await connection).query(getAuthorsIdsSQL, [bookId]); 
        res.locals.authors_ids = authorsIdsResponse[0]; 
        const authorsAmount: number = res.locals.authors_ids.length;
        const queries: any[] = [];
        res.locals.authors = [];
        for (let i = 0; i < authorsAmount; i++) {
            queries.push(await queryAuthorsNames(req, res, res.locals.authors_ids[i].author_id));
        }
        await Promise.all(queries);    
    } catch (err) {
        throw Error("Error during querying authors id: " + err);
    }
}

async function queryAuthorsNames(req:any, res:any, id: any) {
    try {
        const authorsNamesResponse: any = await (await connection).query(getAuthorNameSQL, [id]);
        const name = authorsNamesResponse[0][0].author;
        res.locals.authors.push(name);
    } catch (err) {
        throw Error("Error during querying authors: " + err);
    }
}

async function incrCounter(type: 'visits' | 'wants', bookId: string): Promise<any> {
    try {
        const incrCounterSQL = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ?;`;
        return await (await connection).query(incrCounterSQL, [bookId]); 
    } catch (err) {
        throw Error(`Error during increasing ${type} counter of book ${bookId} -> ${err}`);
    }
}

export function wantBook(req: any, res: any) {
    try {
        incrCounter("wants", req.params.bookId);
        res.status(200);
        res.json({ok: true});
    } catch (err) {
        res.status(500);
        res.json({error: err});
    }
}