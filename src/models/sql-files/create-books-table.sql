CREATE TABLE books (
    id int PRIMARY KEY AUTO_INCREMENT,
    book_name varchar(255),
    publish_year smallint,
    image_path varchar(255),
    book_description text,
    author varchar(255)
);