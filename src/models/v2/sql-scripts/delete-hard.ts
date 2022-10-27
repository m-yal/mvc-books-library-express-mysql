import executeSQLFile from "../../utils/execute";

export default function deleteHard(): void {
    executeSQLFile("delete-hard.sql", "v2");
};

deleteHard();