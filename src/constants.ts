import dotenv from "dotenv";

dotenv.config();

// books.ts v2
export const MAX_BOOKS_PER_PAGE: number = 20;
export const queryAllBooksSQLV2: string = `SELECT * FROM books WHERE is_deleted = FALSE ORDER BY book_name ASC LIMIT ? OFFSET ?;`
export const countAllBooksSQLV2: string = `SELECT COUNT(*) AS count FROM books WHERE is_deleted = FALSE;`;
export const searchSQLV2: string = `SELECT * FROM books WHERE is_deleted = FALSE AND book_name LIKE ? ORDER BY book_name ASC LIMIT ? OFFSET ?;`;
export const adminViewPathV2: string = "v2/admin/index";
export const booksViewPathV2: string = `v2/books/index`;

// book.ts v2
export const singleBookViewPathV2: string = "v2/book/index";
export const getBookIdSQLV2: string = `SELECT * FROM books WHERE id = ? AND is_deleted = FALSE;`;
export const getSingleAuthorIdsSQLV2: string = `SELECT author_id FROM books_authors WHERE book_id = ?;`;
export const getAuthorNameSQLV2: string = `SELECT author FROM authors WHERE id = ?;`;

// auth.ts v2
export const authViewPathV2: string = "v2/auth/index";
export const booksListHrefV2: string = `http://localhost:${process.env.PORT}/`;
export const adminHrefV2: string = `http://localhost:${process.env.PORT}/admin`;
export const deleteSessionSQLV2: string = `DELETE FROM sessions_v1 WHERE id = ?;`;
export const insertSessionSQLV2: string = `INSERT INTO sessions_v1(id) VALUES (?);`

// admin.ts v2
export const authHrefV2: string = `http://localhost:${process.env.PORT}/auth`;
export const sessionCheckSQLV2: string = `SELECT EXISTS(SELECT 1 FROM sessions_v1 WHERE id LIKE ? LIMIT 1) as dbResponse;`
export const deleteBookSQLV2: string = `UPDATE books SET is_deleted = TRUE WHERE id = ?;`;
export const bindBookIdWithAuthorIdSQLV2: string = `INSERT INTO books_authors(book_id, author_id) VALUES(?, ?);`;
export const addBookDataSQLV2: string = `INSERT INTO books(book_name, publish_year, image_path, book_description) VALUES (?, ?, ?, ?); SELECT id FROM books WHERE book_name = ?;`;
export const insertAuthorSQLV2: string = `INSERT INTO authors(author) VALUES(?);`;
export const getAuthorsIdsSQLV2: string = `SELECT id FROM authors WHERE author = ?;`;

