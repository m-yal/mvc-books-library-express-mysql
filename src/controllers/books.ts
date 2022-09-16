export function getBooks(req: any, res: any) {
    // const booksdata: string;
    // const view: string;
    const responseObj = {
        offset: req.query.offset,
        search: req.query.search,
        author: req.query.author,
        year: req.query.year
    }
    res.send(responseObj);
}