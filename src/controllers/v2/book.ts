import connection from "../../models/utils/connection";

export async function getBook(req: any, res: any) {
    const bookId: string = req.params.bookId;
    try {
        await Promise.all([
            queryBookById(req, res, bookId),
            queryAuthors(req, res, bookId),
            incrCounter("visits", req, res, bookId)
        ]);    
    } catch (err) {
        await res.status(500);
        await res.json({error: `Error in database during getting single book with id ${bookId}: ${err}`})
    }
    res.locals.book.authors = res.locals.authors;
    await res.status(200);
    console.log("RES LOCAL BOOK BEFORE RENDER " + JSON.stringify(res.locals.book));
    await res.render("v2/book/index", {book: res.locals.book});
}

async function queryBookById(req: any, res: any, bookId: string): Promise<any> {
    return (await connection).query(`SELECT * FROM books WHERE id = ${bookId} AND is_deleted = FALSE;`)
        .then((result: any)  => {
            console.log("result of querying book by id: " + JSON.stringify(result[0]));
            res.locals.book = result[0][0];
        }).catch((err: Error) => {
            console.error("Error during querying book data by id: " + err);
            throw err;
        });
}

async function queryAuthors(req: any, res: any, bookId: string): Promise<any> {
    return await (await connection).query(`SELECT author_id FROM books_authors WHERE book_id = ${bookId};`)
        .then(async (result: any) => {
            console.log("Author id queried from db: " + JSON.stringify(result[0]));
            res.locals.authors_ids = result[0];
            const authorsAmount: number = result[0].length;
            console.log(`authorsAmount ${authorsAmount}`);
            const queries: any[] = [];
            res.locals.authors = [];
            for (let i = 0; i < authorsAmount; i++) {
                queries.push(await queryAuthorsNames(req, res, res.locals.authors_ids[i].author_id));
            }
            await Promise.all(queries);
        })
        .catch(err => {
            console.log("Error during querying authors id: " + err);
            throw err;
        });
}

async function queryAuthorsNames(req:any, res:any, id: any) {
    return await (await connection).query(`SELECT author FROM authors WHERE id = ${id};`)
        .then(async (result) => {
            const response: any = result[0];
            const name: any = response[0].author;
            console.log(`Queried author: ${JSON.stringify(name)}`);
            res.locals.authors.push(name);
        })
        .catch((err: Error) => {
            console.log("Error during querying authors: " + err);
            throw err;
        });
}

async function incrCounter(type: "visits" | "wants", req: any, res: any, bookId: string): Promise<any> {
    return (await connection).query(`UPDATE books SET ${type} = ${type} + 1 WHERE id = ${bookId}`)
        .catch(err => {
            console.log(`Error during increasing ${type} counter of book ${bookId}`);
            throw err;
        });
}

export async function wantBook(req: any, res: any) {
    const bookId: string = req.params.bookId;
    console.log("Wants single book with id: " + bookId);
    incrCounter("wants", req, res, bookId)
        .then(result => {
            res.status(200);
            res.end();
        }).catch(err => {
            res.status(500);
            res.end({error: err});
        });    
}