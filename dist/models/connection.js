"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
const connection = mysql_1.default.createConnection({
    host: "localhost",
    user: "root",
    password: "123321",
    database: "library",
    multipleStatements: true
});
connection.connect((err) => {
    if (err) {
        console.log(err);
        return err;
    }
    else {
        console.log("Database ------------ OK");
    }
    connection.query(`INSERT Products(ProductName, Manufacturer, ProductCount, Price) 
                VALUES ('iPhone B', 'Appleeee', 5222, 756000);
                INSERT Products(ProductName, Manufacturer, ProductCount, Price) 
                VALUES ('iPhone C', 'Appleeee', 5222, 756000);
                INSERT Products(ProductName, Manufacturer, ProductCount, Price) 
                VALUES ('iPhone D', 'Appleeee', 5222, 756000);
                `, (error, result) => {
        if (error) {
            return console.log("Error during operations");
        }
        console.log(JSON.stringify(result[0]));
        console.log(result[0]);
    });
});
exports.default = connection;
