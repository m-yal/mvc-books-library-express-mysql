import executeSQLFile from "../../utils/execute";

export default function migrateBackToV1(): void {
    executeSQLFile("delete-all-tables.sql", "v2");
};

migrateBackToV1();