import mysql from "mysql2/promise";
import dotenv from "dotenv";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123321",
    database: "library",
    multipleStatements: true
});

export default connection;