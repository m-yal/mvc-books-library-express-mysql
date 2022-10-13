import connection from "../../models/utils/connection";

export function getBook(req: any, res: any) {
    const bookId: string = req.params.bookId;
    connection.query(`SELECT * FROM books WHERE id = ${bookId} AND is_deleted = FALSE`, async (err, result) => {
        try {    
            if (err) throw err;
            incrCounter("visits", req, res, bookId);
            await res.status(200);
            await res.render("v1/book/index", {book: result[0]});
        } catch (err) {
            await res.status(500);
            await res.send({error: `Error in database during getting single book with id ${bookId}: ${err}`});
        }
    });    
}

export function wantBook(req: any, res: any) {
    const bookId: string = req.params.bookId;
    console.log("Single book id: " + bookId);
    incrCounter("wants", req, res, bookId);
}

function incrCounter(type: "visits" | "wants", req: any, res: any, bookId: string) {
    const sql: string = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`;
    connection.query(sql, async (err) => {
        try {
            if (err) throw err; 
            await res.status(200);
            await res.end();            
        } catch (error) {
            await res.status(500);
            return await res.send(JSON.stringify({error: `Error in database during increasing "${type}" counter of book with id ${bookId}: ` + err}));            
        }
    });
}