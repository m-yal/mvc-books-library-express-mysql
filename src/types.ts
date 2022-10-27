import express from "express";
import { FieldPacket, RowDataPacket } from "mysql2";

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