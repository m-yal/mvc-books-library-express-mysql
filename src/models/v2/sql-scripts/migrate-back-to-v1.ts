import executeSQLFile from "../../utils/execute";

export default function migrateBackToV1(): void {
    executeSQLFile("move-data-to-v1-tables.sql", "v2");
};

migrateBackToV1();