import executeSQLFile from "../../utils/execute";

export default function deleteAll() {
    executeSQLFile("delete-all-v1-tables.sql", "v1");
};

deleteAll();