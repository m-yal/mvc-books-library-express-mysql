import mysql from "mysql";

export function getQuery() {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "123321",
        database: "test_db"
    });
    
    connection.connect((err: Error) => {
        if (err) {
            console.log(err);
            return err;
        } else {
            console.log("Database ------------ OK");
        }
    });
    
    let query = "SELECT * FROM teacher";
    
    connection.query(query, (err: Error, result: any, field: any) => {
        console.log(err);
        console.log(result);
        connection.end();
    });
}