import { RowDataPacket } from "mysql2";
import connection from "../../models/utils/connection";
import { Request, Response, DBResponse, ActionCounterType } from "../../types";
const getBookSQL: string = `SELECT * FROM books WHERE id = ? AND is_deleted = FALSE;`;


export async function getBook(req: Request, res: Response) {
    try {
        const bookId: string = req.params.bookId;
        const queryResp: DBResponse = await (await connection).query(getBookSQL, [bookId]);
        const book: RowDataPacket = queryResp[0][0];
        await incrCounter("visits", req, res, bookId);
        res.status(200);
        res.render("v1/book/index", {book: book});
    } catch (err) {
        res.status(500);
        res.json({error: `Error in database during getting single book with id ${req.params.bookId}: ${err}`});
    }
}

export function wantBook(req: Request, res: Response) {
    try {
        incrCounter("wants", req, res, req.params.bookId);
    } catch (err) {
        throw Error("Error during increasing 'want' counter -> " + err);
    }
}

async function incrCounter(type: ActionCounterType, req: Request, res: Response, bookId: string) {
    try {
        const incrCounterSQL: string = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`;
        await (await connection).query(incrCounterSQL, [type, type, bookId]);
    } catch (err) {
        throw Error(`Error during increasing '${type}' counter of book ${req.params.bookId} -> : ${err}`);
    }
}