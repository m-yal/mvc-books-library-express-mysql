import connection from "../models/connection";

const LIMIT: number = 20;

export function deleteBook(req: any, res: any) {
    const bookId: string = req.body.bookId;
    const sql: string = `UPDATE books SET is_deleted = TRUE WHERE id = ${bookId}`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during deleting book by id: ${bookId}`);
            res.status(500);
            return res.send({error: "Error during deleting"});
        }
        console.log(`Query result from file getting books: ${result}`);
        res.send({result: result}); // books page without the book
    });
}

export function getBooks(req: any, res: any) {
    const offset = req.query.offset;
    const sql = `SELECT * FROM books WHERE is_deleted = FALSE LIMIT ${LIMIT} OFFSET ${offset};`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during getting all books with offset ${offset}`);
            res.status(500);
            return res.send({error: "Error in database during getting books list: " + err});
        }
        console.log(`Query result form file getting books: ${result}`);
        res.send({result: result}); // books page
    });
    //send books page for admin
}

export function getBook(req: any, res: any) { //{bookId: ...} on input
    const bookId: string = req.body.bookId;
    connection.query(`SELECT * FROM books WHERE id = ${bookId} AND is_deleted = FALSE;`, (err, result) => {
        if (err) {
            console.log(`Error during getting book by id: ${bookId}`);
            res.status(500);
            return res.send({error: "Error in database during getting sible book: " + err});
        }
        console.log(`Query result form file getting book by id ${bookId} : ${result}`);
        res.send({result: result}); //book page for admin
    });
    //send page with book info for admin
}

export function addBook(req: any, res: any) {
    const {bookName, publishYear, imagePath, bookDesc, author} = req.body;
    const sql = `INSERT INTO books(book_name, publish_year, image_path, book_description, author)
        VALUES (${bookName}, ${publishYear}, ${imagePath}, ${bookDesc}, ${author})`;
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(`Error during adding new book: ${req.body}`);
            res.status(500);
            return res.send({error: "Error in database during adding new book"});
        }
        console.log(`Query executed`);
        res.send({result: result}); // clear prompt/send new books page for admin
    });
}