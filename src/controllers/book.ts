import connection from "../models/connection";

export function getBook(req: any, res: any) {
    const bookId: string = req.params.bookId;
    console.log("Single book id: " + bookId);
    incrCounter("visits", req, res, bookId);
    connection.query(`SELECT * FROM books WHERE id = ${bookId} AND is_deleted = FALSE`, (err, result) => {
        if (err) {
            console.log(`Error during getting book by id: ${bookId}`);
            res.status(500);
            return res.send({error: "Error in database during getting sible book: " + err});
        }
        console.log(`Query result form file getting book by id ${bookId} : ${result}`);
        res.send({result: result});
    });
    //send page with book
}

export function wantBook(req: any, res: any) {
    const bookId: string = req.params.bookId;
    console.log("Single book id: " + bookId);
    incrCounter("wants", req, res, bookId);
    //send booking info
}

function incrCounter(type: "visits" | "wants", req: any, res: any, bookId: string) {
    let sql: string = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during increasing ${type} counter book by id: ${bookId}`);
            res.status(500);
            return res.send({error: `Error in database during increasing ${type} counter: ` + err});
        }
        console.log(`Query result form increasing ${type} counter of book with id ${bookId} : ${result}`);
    });
}