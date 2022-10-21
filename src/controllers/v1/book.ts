import connection from "../../models/utils/connection";

const getBookSQL = `SELECT * FROM books WHERE id = ? AND is_deleted = FALSE;`;


export async function getBook(req: any, res: any) {
    try {
        const bookId: string = req.params.bookId;
        const queryResp: any = await (await connection).query(getBookSQL, [bookId]);
        const book = queryResp[0][0];
        await incrCounter("visits", req, res, bookId);
        await res.status(200);
        await res.render("v1/book/index", {book: book});
    } catch (err) {
        await res.status(500);
        await res.json({error: `Error in database during getting single book with id ${req.params.bookId}: ${err}`});
    }
}

export function wantBook(req: any, res: any) {
    try {
        incrCounter("wants", req, res, req.params.bookId);
    } catch (err) {
        throw Error("Error during increasing 'want' counter -> " + err);
    }
}

async function incrCounter(type: "visits" | "wants", req: any, res: any, bookId: string) {
    try {
        const incrCounterSQL: string = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`;
        await (await connection).query(incrCounterSQL, [type, type, bookId]);
    } catch (err) {
        throw Error(`Error during increasing '${type}' counter of book ${req.params.bookId} -> : ${err}`);
    }
}