ALTER TABLE books ADD author_1, author_2, author_3, VARCHAR(255) NULL;
ALTER TABLE books ADD is_deleted, BOOLEAN DEFAULT FALSE;

ALTER TABLE books_authors ADD author VARCHAR(255) NULL;

UPDATE books_authors SET author=(SELECT author FROM authors WHERE books_authors.author_id=authors.id);

UPDATE TABLE books SET author_1, author_2, author_3;