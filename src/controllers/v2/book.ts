import connection from "../../models/utils/connection";
import { DBResponse, Request, Response, ActionCounterType } from "../../types";
import { getAuthorNameSQLV2, getSingleAuthorIdsSQLV2, getBookIdSQLV2, singleBookViewPathV2 } from "../../constants";

export async function getBook(req: Request, res: Response): Promise<void> {
    try {
        await queryBookData(req, res);
        res.status(200);
        res.render(singleBookViewPathV2, {book: res.locals.book});
    } catch (err) {
        res.status(500);
        res.json({error: "Error during getting single book -> " + err});
    }
}

async function queryBookData(req: Request, res: Response): Promise<void> {
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

async function queryBookById(res: Response, bookId: string): Promise<void> {
    try {
        const bookIdResponse: DBResponse = await (await connection).query(getBookIdSQLV2, [bookId]); 
        res.locals.book = bookIdResponse[0][0];
    } catch (err) {
        throw Error("Error during querying book data by id: " + err);
    }
}

async function queryAuthors(req: Request, res: Response, bookId: string): Promise<void> {
    try {
        const authorsIdsResponse: DBResponse = await (await connection).query(getSingleAuthorIdsSQLV2, [bookId]); 
        res.locals.authors_ids = authorsIdsResponse[0]; 
        const authorsAmount: number = res.locals.authors_ids.length;
        const queries: void[] = [];
        res.locals.authors = [];
        for (let i: number = 0; i < authorsAmount; i++) {
            queries.push(await queryAuthorsNames(req, res, res.locals.authors_ids[i].author_id));
        }
        await Promise.all(queries);    
    } catch (err) {
        throw Error("Error during querying authors id: " + err);
    }
}

async function queryAuthorsNames(req: Request, res: Response, id: string): Promise<void> {
    try {
        const authorsNamesResponse: DBResponse = await (await connection).query(getAuthorNameSQLV2, [id]);
        const name: string = authorsNamesResponse[0][0].author;
        res.locals.authors.push(name);
    } catch (err) {
        throw Error("Error during querying authors: " + err);
    }
}

async function incrCounter(type: ActionCounterType, bookId: string): Promise<DBResponse> {
    try {
        const incrCounterSQL = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ?;`;
        return await (await connection).query(incrCounterSQL, [bookId]); 
    } catch (err) {
        throw Error(`Error during increasing ${type} counter of book ${bookId} -> ${err}`);
    }
}

export function wantBook(req: Request, res: Response): void {
    try {
        incrCounter("wants", req.params.bookId);
        res.status(200);
        res.json({ok: true});
    } catch (err) {
        res.status(500);
        res.json({error: err});
    }
}