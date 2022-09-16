export function getBook(req: any, res: any) {
    // const booksLinks: string[];
    // const view: string;
    const msg: string = req.params.bookId;
    res.send(msg);
}