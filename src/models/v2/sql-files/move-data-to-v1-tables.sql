-- Temporary tables only for this file execution
ALTER TABLE books ADD author_1 VARCHAR(255) NULL;
ALTER TABLE books ADD author_2 VARCHAR(255) NULL;
ALTER TABLE books ADD author_3 VARCHAR(255) NULL;

ALTER TABLE books_authors ADD author VARCHAR(255) NULL;
UPDATE books_authors SET author=(SELECT author FROM authors WHERE books_authors.author_id = id);

CREATE TABLE author_1(book_id INT, author VARCHAR(255) NULL) AS SELECT DISTINCT book_id FROM books_authors;
UPDATE author_1 SET author = (SELECT author FROM books_authors WHERE book_id = author_1.book_id LIMIT 1); 
DELETE FROM books_authors WHERE book_id IN (SELECT book_id FROM author_1) AND author IN (SELECT author FROM author_1);
UPDATE books SET author_1 = (SELECT author FROM author_1 WHERE book_id = books.id LIMIT 1);

CREATE TABLE author_2(book_id INT, author VARCHAR(255) NULL) AS SELECT DISTINCT book_id FROM books_authors;
UPDATE author_2 SET author = (SELECT author FROM books_authors WHERE book_id = author_2.book_id LIMIT 1); 
DELETE FROM books_authors WHERE book_id IN (SELECT book_id FROM author_2) AND author IN (SELECT author FROM author_2);
UPDATE books SET author_2 = (SELECT author FROM author_2 WHERE book_id = books.id LIMIT 1);

CREATE TABLE author_3(book_id INT, author VARCHAR(255) NULL) AS SELECT DISTINCT book_id FROM books_authors;
UPDATE author_3 SET author = (SELECT author FROM books_authors WHERE book_id = author_3.book_id LIMIT 1); 
DELETE FROM books_authors WHERE book_id IN (SELECT book_id FROM author_3) AND author IN (SELECT author FROM author_3);
UPDATE books SET author_3 = (SELECT author FROM author_3 WHERE book_id = books.id LIMIT 1);

DROP TABLE IF EXISTS author_1;
DROP TABLE IF EXISTS author_2;
DROP TABLE IF EXISTS author_3;

DROP TABLE IF EXISTS books_authors;
DROP TABLE IF EXISTS authors;

-- For checking:
-- SELECT id, author_1, author_2, author_3 FROM books;