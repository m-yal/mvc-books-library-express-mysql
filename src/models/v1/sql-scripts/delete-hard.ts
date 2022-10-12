import executeSQLFile from "../../utils/execute";

export default function deleteHard() {
    executeSQLFile("delete-hard.sql", "v1");
};

deleteHard();