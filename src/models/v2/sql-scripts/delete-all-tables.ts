import executeSQLFile from "../../utils/execute";

export default function migrateBackToV1() {
    executeSQLFile("delete-all-tables.sql", "v2");
};

migrateBackToV1();