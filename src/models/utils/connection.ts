import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection: Promise<mysql.Connection> = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_LOGIN,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true
});

export default connection;