import executeSQLFile from "./execute";

export default function createTables() {
    executeSQLFile("create-books-table.sql");
};

