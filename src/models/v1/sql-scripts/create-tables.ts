import executeSQLFile from "../../utils/execute";

export default function createTables() {
    executeSQLFile("create-table.sql", "v1");
};

createTables();