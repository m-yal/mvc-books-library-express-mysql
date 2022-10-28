import connection from "../../models/utils/connection";
import { getAll } from "./books";
import dotenv from "dotenv";
import validator from "validator";
import { AddingBookV2, AdminV2DBResponse, DBResponse, Request, Response } from "../../types";
import { RowDataPacket } from "mysql2";
import { addBookDataSQLV2, authHrefV2, bindBookIdWithAuthorIdSQLV2, deleteBookSQLV2, getAuthorsIdsSQLV2, insertAuthorSQLV2, sessionCheckSQLV2 } from "../../constants";

dotenv.config();


export async function deleteBook(req: Request, res: Response): Promise<Response | void> {
    try {
        if (await checkSessionIdPresence(req, res)) return deleteBookQuery(req, res);
        res.status(401);
        res.redirect(authHrefV2);
    } catch (err) {
        res.status(500);
        res.send("Error in db during deleting book -> " + err);
    }
}

async function checkSessionIdPresence(req: Request, res: Response): Promise<boolean> {
    const [ sessionResponse ]: DBResponse = await (await connection).query<RowDataPacket[]>(sessionCheckSQLV2, [req.sessionID])
        .catch(async (err: Error) => {
            throw Error("Error during checking session db query execution -> " + err);
        });
    return Boolean(await sessionResponse[0].dbResponse);
}

async function deleteBookQuery(req: Request, res: Response): Promise<void> {
    try {
        const queryResp: DBResponse = await (await connection).query<RowDataPacket[]>(deleteBookSQLV2, [req.params.id]);//continue from here
        res.status(200);
        res.json({deleted: Boolean((queryResp[0] as any).changedRows)});
    } catch (err) {
        res.status(500);
        res.json({error: "Error during deleting book query"});        
    }
}

export async function getBooks(req: Request, res: Response): Promise<void> {
    try {
        if (await checkSessionIdPresence(req, res)) return getAll(req, res, true);
        res.status(401);
        res.redirect(authHrefV2);    
    } catch (err) {
        res.status(500);
        res.json({error: "Error during getting books on admin page -> " + err});
    }
}

export async function addBook(req: Request, res: Response): Promise<void> {
    if (await checkSessionIdPresence(req, res)) return queryAddingBooks(req, res);
    res.status(401);
    res.redirect(authHrefV2);
}

async function queryAddingBooks(req: Request, res: Response): Promise<void> {
    try {
        await addAuthorsAndBookData(req, res);
        await bindBookIdWithAuthorId(res);
        await redirectToAdminPage(res);
    } catch (err) {
        res.status(500);
        res.send({error: "Error during executing query of adding book: " + err});
    }
}

async function addAuthorsAndBookData(req: Request, res: Response): Promise<void> {
    let queries: Promise<void>[] = [ addBookDataQuery(req, res),  addAuthors(req, res) ]
    await Promise.all(queries);
}

async function bindBookIdWithAuthorId(res: Response): Promise<void> {
    const queries: Promise<AdminV2DBResponse>[] = [];
    const authorsAmount: number = res.locals.authorsIds.length;
    for (let i: number = 0; i < authorsAmount; i++) {
        queries.push((await connection).query(bindBookIdWithAuthorIdSQLV2, [res.locals.bookId, res.locals.authorsIds[i]]));
    }
    await Promise.all(queries);
}

async function redirectToAdminPage(res: Response): Promise<void> {
    res.status(200);
    res.redirect(`http://localhost:${process.env.PORT}/admin`);
}

async function addBookDataQuery(req: Request, res: Response): Promise<void> {
    const { bookName, publishYear, description, imagePath }: AddingBookV2 = validateMainDataForXSS(req.body, req?.file);
    return await (await connection).query(addBookDataSQLV2, [bookName, publishYear || 0, imagePath, description, bookName])
        .then((result: any) => res.locals.bookId = result[0][1][0].id)
        .catch((err: Error) => { throw Error("Error during add book query to db -> " + err) });
}

async function addAuthors(req: Request, res: Response): Promise<void> {
    res.locals.authorsIds = [];
    const authors: string[] = [ req.body.author_1, req.body.author_2, req.body.author_3 ];
    for (const author of authors) {
        await (await connection).query(insertAuthorSQLV2, author);
        const authorIdResponse: DBResponse = await (await connection).query(getAuthorsIdsSQLV2, author);
        const authorId: string = authorIdResponse[0][0].id;
        await res.locals.authorsIds.push(authorId); 
    }
}

function validateMainDataForXSS(body: Record<string, any>, file?: Express.Multer.File | undefined): AddingBookV2 {
    return {
        bookName: validator.escape(body.bookName),
        publishYear: validator.escape(body.publishYear),
        description: validator.escape(body.description),
        imagePath: validator.escape(String(file?.filename || null))
    }
}

function validateAuthorsForXSS(body: Record<string, any>): string[] {
    return [
        validator.escape(body.author_1),
        validator.escape(body.author_2),
        validator.escape(body.author_3)
    ]
}