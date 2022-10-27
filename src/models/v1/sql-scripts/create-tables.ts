import executeSQLFile from "../../utils/execute";

export default function createTables(): void {
    executeSQLFile("create-table.sql", "v1");
};

createTables();