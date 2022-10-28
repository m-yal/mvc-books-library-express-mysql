import express from "express";
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";

export type ApiVersion = "v1" | "v2";
export type Request = express.Request;
export type Response = express.Response;
export type Book = {id: string, book_name: string, publish_year: string, image_path: string,
    book_description: string, author_1: string, author_2: string, author_3: string,
    pages?: string, isbn?: string, is_deleted: string, visits: string, wants: string};
export type DBResponse = [RowDataPacket[], FieldPacket[]];
export type ActionCounterType = "visits" | "wants";
export type PagesStatusObj = {offsetAhead: number, offsetBack: number, totalyFound: number, hasNextPage?: boolean, hasPrevPage?: boolean};
export type SearchQueryData = {author: string, year: string, search: string, offset: number};
export type Credentials = {login: string, password: string};
export type InputImage = string | null;
export type AddingBook = {bookName: string, publishYear: string, author_1: string, author_2: string, author_3: string, description: string};
export type AddingBookV2 = {bookName: string, publishYear: string, description: string, imagePath: string};
export type AdminV2DBResponse = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader, FieldPacket[]];
export type ValidationGroup = "mainData" | "authors";
export type MulterCBFunc = (error: Error | null, destination: string) => void;
export type DB_VERSIONS = "v1" | "v2";