-- book_id is temporary column used for creation to books_authors tables
CREATE TABLE authors(
    book_id INT,
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    author varchar(255) NOT NULL
);

-- fulfiling authors from books (v1) table
INSERT INTO authors(book_id, author) SELECT id, author_1 FROM books WHERE author_1 IS NOT NULL;
INSERT INTO authors(book_id, author) SELECT id, author_2 FROM books WHERE author_2 IS NOT NULL;
INSERT INTO authors(book_id, author) SELECT id, author_3 FROM books WHERE author_3 IS NOT NULL;

-- reference table based on authors
CREATE TABLE books_authors AS (SELECT book_id, id FROM authors);

-- binding columns to books and authors table + changin naming: id TO author_id
ALTER TABLE books_authors ADD FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE;
ALTER TABLE books_authors RENAME COLUMN id TO author_id; 
ALTER TABLE books_authors ADD FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE;

-- making final version of authors table
ALTER TABLE authors DROP COLUMN book_id;

-- Transform v1 books table to v2
ALTER TABLE books DROP COLUMN author_1;
ALTER TABLE books DROP COLUMN author_2;
ALTER TABLE books DROP COLUMN author_3;