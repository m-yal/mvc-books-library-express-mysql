import executeSQLFile from "../../utils/execute";

export default function migrateBackToV1() {
    executeSQLFile("move-data-to-v1-tables.sql", "v2");
    executeSQLFile("delete-all-v2-tables.sql", "v2");
};

migrateBackToV1();