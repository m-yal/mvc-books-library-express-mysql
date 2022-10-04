import mysql from "mysql";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123321",
    database: "library",
    multipleStatements: true
});

connection.connect((err: Error) => {
    if (err) {
        console.log(err);
        return err;
    } else {
        console.log("Database connection status ------------ OK");
    }
});

export default connection;