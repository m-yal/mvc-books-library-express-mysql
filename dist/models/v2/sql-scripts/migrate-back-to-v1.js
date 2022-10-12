"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execute_1 = __importDefault(require("../../utils/execute"));
function createTables() {
    (0, execute_1.default)("move-data-to-v1-tables.sql", "v2");
    (0, execute_1.default)("delete-all-v2-tables.sql", "v2");
}
exports.default = createTables;
;
createTables();
