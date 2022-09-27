CREATE  TABLE books (
    id int PRIMARY KEY AUTO_INCREMENT,
    book_name varchar(255) UNIQUE,
    publish_year smallint,
    image_path varchar(255) UNIQUE,
    book_description text,
    author varchar(255),
    is_deleted BOOLEAN DEFAULT FALSE,
    visits int DEFAULT 0,
    wants int DEFAULT 0
);