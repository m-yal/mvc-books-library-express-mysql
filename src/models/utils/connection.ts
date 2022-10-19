// import mysql from "mysql2";
import mysql from "mysql2/promise";

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "library",
    multipleStatements: true
})

// async function testQuery() {
//     console.log("TestQuery 1:");
//     const [response1] = await (await connection).query(`SELECT id FROM books; SELECT book_name FROM books;`);
//     console.log("Response1: " + JSON.stringify(response1));
    
//     // console.log("TestQuery 2:");
//     // const [response2] = await (await connection).execute('');
//     // console.log("response2 " + JSON.stringify(response2));
// }
// testQuery();

// connection.connect((err: Error) => {
//     if (err) {
//         console.log(err);
//         return err;
//     } else {
//         console.log("Database connection status ------------ OK");
//     }
// });  

export default connection;