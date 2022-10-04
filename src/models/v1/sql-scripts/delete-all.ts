import executeSQLFile from "../../utils/execute";

export default function deleteAll() {
    executeSQLFile("delete-all.sql");
};

deleteAll();