import executeSQLFile from "../../utils/execute";

export default function migrateBackToV1() {
    executeSQLFile("delete-hard.sql", "v2");
};

migrateBackToV1();