CREATE TABLE IF NOT EXISTS books_v2 (
    id int PRIMARY KEY AUTO_INCREMENT,
    book_name varchar(255),
    publish_year smallint,
    image_path varchar(255),
    book_description text,
    pages INT DEFAULT 0,
    isbn varchar(255) DEFAULT "-",
    is_deleted BOOLEAN DEFAULT FALSE,
    visits INT DEFAULT 0,
    wants INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS authors_v2 (
    id int PRIMARY KEY AUTO_INCREMENT,
    author varchar(255),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS books_authors_v2 (
    book_id int PRIMARY KEY,
    author_is int
);