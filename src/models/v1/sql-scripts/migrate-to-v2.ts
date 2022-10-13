import executeSQLFile from "../../utils/execute";

export default function migrateToV2() {
    executeSQLFile("migrate-to-v2.sql", "v1");
};

migrateToV2();