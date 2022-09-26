import connection from "../models/connection";

export function getBook(req: any, res: any) {
    //todo here increment of visit count
    const bookId: string = req.params.bookId;
    console.log("Single book id: " + bookId);
    const bookData = connection.query(`SELECT * FROM books WHERE id = ${bookId}`, (err, result) => {
        if (err) {
            console.log(`Error during getting book by id: ${bookId}`);
            res.status(500);
            return res.send({error: "Error in database during getting sible book: " + err});
        }
        console.log(`Query result form file getting book by id ${bookId} : ${result}`);
    });
    res.send(bookData);
}