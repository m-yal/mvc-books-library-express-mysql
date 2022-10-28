import dotenv from "dotenv";

dotenv.config();

// middlewares
export const CRON_SCHEDULE = "* * 23 * * *";
export const DUMPS_PATH = "dumps"; // comparing to project`s root
export const IMAGES_PATH = './public/images/';
export const STATIC_DIR_PATH = "public"; // comparing to project`s root

// books.ts v2
export const MAX_BOOKS_PER_PAGE: number = 20;
export const booksTableName: string = "books";
export const queryAllBooksSQLV2: string = `SELECT * FROM ${booksTableName} WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ? OFFSET ?;`
export const countAllBooksSQLV2: string = `SELECT COUNT(*) AS count FROM ${booksTableName} WHERE is_deleted = FALSE;`;
export const searchSQLV2: string = `SELECT * FROM ${booksTableName} WHERE is_deleted = FALSE AND book_name LIKE ? ORDER BY book_name ASC LIMIT ? OFFSET ?;`;
export const adminViewPathV2: string = "v2/admin/index";
export const booksViewPathV2: string = `v2/books/index`;

// book.ts v2
export const singleBookViewPathV2: string = "v2/book/index";
export const getBookIdSQLV2: string = `SELECT * FROM ${booksTableName} WHERE id = ? AND is_deleted = FALSE;`;
export const getSingleAuthorIdsSQLV2: string = `SELECT author_id FROM books_authors WHERE book_id = ?;`;
export const getAuthorNameSQLV2: string = `SELECT author FROM authors WHERE id = ?;`;

// auth.ts v2
export const authViewPathV2: string = "v2/auth/index";
export const booksListHrefV2: string = `http://${process.env.HOST}:${process.env.PORT}/`;
export const adminHrefV2: string = `http://${process.env.HOST}:${process.env.PORT}/admin`;
export const deleteSessionSQLV2: string = `DELETE FROM sessions_v1 WHERE id = ?;`;
export const insertSessionSQLV2: string = `INSERT INTO sessions_v1(id) VALUES (?);`

// admin.ts v2
export const authHrefV2: string = `http://${process.env.HOST}:${process.env.PORT}/auth`;
export const sessionCheckSQLV2: string = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE ? LIMIT 1) as dbResponse;`
export const deleteBookSQLV2: string = `UPDATE ${booksTableName} SET is_deleted = TRUE WHERE id = ?;`;
export const bindBookIdWithAuthorIdSQLV2: string = `INSERT INTO books_authors(book_id, author_id) VALUES(?, ?);`;
export const addBookDataSQLV2: string = `INSERT INTO ${booksTableName}(book_name, publish_year, image_path, book_description) VALUES (?, ?, ?, ?); SELECT id FROM ${booksTableName} WHERE book_name = ?;`;
export const insertAuthorSQLV2: string = `INSERT INTO authors(author) VALUES(?);`;
export const getAuthorsIdsSQLV2: string = `SELECT id FROM authors WHERE author = ?;`;

// routes v2
export const BOOK_ROUTE_V2 = "/books/:bookId";
export const AUTH_ROUTE_V2 = "/auth";
export const LOGIN_V2 = "/auth/login";
export const LOGOUT_V2 = "/auth/logout";
export const DELETE_ROUTE_V2 = "/admin/delete/:id";
export const ADMIN_ROUTE_V2 = "/admin";
export const ADD_BOOK_ROUTE_V2 = "/admin/add";

// books.ts v1
export const bookPageRenderPathV1: string = "v1/books/index";
export const countAllBooksSQLV1: string = `SELECT COUNT(*) AS count FROM ${booksTableName} WHERE is_deleted = FALSE;`;
export const getBooksListSQLV1: string = `SELECT * FROM ${booksTableName} WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ? OFFSET ?;`;

// book.ts v1
export const getBookSQLV1: string = `SELECT * FROM ${booksTableName} WHERE id = ? AND is_deleted = FALSE;`;
export const singleBookViewPathV1 = "v1/book/index";

// auth.ts v1
export const authViewPathV1: string = "v1/auth/index";
export const booksListV1Href: string = "http://localhost:3005/api/v1/";
export const adminV1Href: string = "http://localhost:3005/api/v1/admin";
export const authV1Href: string = "http://localhost:3005/api/v1/auth";
export const sessionsTableName: string = "sessions_v1";
export const loginSQLV1: string = `INSERT INTO ${sessionsTableName}(id) VALUES (?);`;
export const logoutSQLV1: string = `DELETE FROM ${sessionsTableName} WHERE id=?;`;

// admin.ts v1
export const adminV1View: string = "v1/admin/index";
export const sessionChechSQLV1: string = `SELECT EXISTS(SELECT 1 FROM ${sessionsTableName} WHERE id LIKE ? LIMIT 1) as dbResponse;`;
export const deleteBookSQLV1: string = `UPDATE ${booksTableName} SET is_deleted = TRUE WHERE id = ?`;
export const booksListSQLV1: string = `SELECT * FROM ${booksTableName} WHERE is_deleted = FALSE LIMIT ? OFFSET ?;`;
export const pagesCountSQLV1: string = `SELECT COUNT(*) AS count FROM ${booksTableName} WHERE is_deleted = FALSE;`;
export const addBookSQLV1: string = `INSERT INTO ${booksTableName}(book_name, publish_year, image_path, book_description, author_1, author_2, author_3) VALUES (?, ?, ?, ?, ?, ?, ?);`;

// routes v1
export const SINGLE_BOOK_ROUTE_V1 = "/books/:bookId";
export const API_V1_ROUTE = "/api/v1";
export const AUTH_V1 = "/auth";
export const LOGIN_V1 = "/auth/login";
export const LOGOUT_V1 = "/auth/logout";
export const DELELTE_BOOK_V1 = "/admin/delete/:id";
export const ADMIN_V1 = "/admin";
export const ADD_BOOK_V1 = "/admin/add";