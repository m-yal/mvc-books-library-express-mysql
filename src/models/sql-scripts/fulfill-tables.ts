import executeSQLFile from "./execute";

export default function fulfillTables() {
    executeSQLFile("insert-book.sql");
};