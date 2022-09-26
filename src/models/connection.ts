import mysql from "mysql";
import createTables from "./sql-scripts/create-tables";
import fulfillTables from "./sql-scripts/fulfill-tables";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123321",
    database: "library"
});

connection.connect((err: Error) => {
    if (err) {
        console.log(err);
        return err;
    } else {
        console.log("Database ------------ OK");
    }
    createTables();
    fulfillTables();
});

export default connection;


// export function getQuery() {
    
//     let query = "SELECT * FROM teacher";
    
//     connection.query(query, (err: Error, result: any, field: any) => {
//         console.log(err);
//         console.log(result);
//         connection.end();
//     });
// }