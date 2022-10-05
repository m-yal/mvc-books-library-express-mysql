import connection from "../models/utils/connection";

export function getBook(req: any, res: any) {
    const bookId: string = req.params.bookId;
    console.log("Single book id: " + bookId);
    connection.query(`SELECT * FROM books_v1 WHERE id = ${bookId} AND is_deleted = FALSE`, async (err, result) => {
        try {    
            if (err) {
                console.log(`Error during getting book by id: ${bookId}`);
                res.status(500);
                return res.send({error: "Error in database during getting sible book: " + err});
            }
            await incrCounter("visits", req, res, bookId);
            console.log(`Query result form file getting book by id ${bookId} : ${await result}`);
            const book = await result[0];
            const data = {
                bookName: book.book_name,
                year: book.publish_year,
                imagePath: book.image_path,
                desciption: book.book_description,
                author: book.author,
                bookId: book.id
            }
            await res.status(200);
            await res.render("v1/book/index", data);
        } catch (error) {
            res.status(500);
        }
    });    
}

export async function wantBook(req: any, res: any) {
    const bookId: string = req.params.bookId;
    console.log("Single book id: " + bookId);
    await incrCounter("wants", req, res, bookId);
}

async function incrCounter(type: "visits" | "wants", req: any, res: any, bookId: string) {
    let sql: string = `UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`;
    connection.query(sql, async (err, result) => {
        if (err) {
            console.log(`Error during increasing "${type}" counter book by id: ${bookId}`);
            await res.status(500);
            return await res.send({error: `Error in database during increasing "${type}" counter: ` + err});
        }
        console.log(`Query result form increasing ${type} counter of book with id ${bookId} : ${result}`);
        await res.status(200);
        await res.end();
    });
}