"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execute_1 = __importDefault(require("../../utils/execute"));
function migrateToV2() {
    (0, execute_1.default)("migrate-to-v2.sql", "v1");
}
exports.default = migrateToV2;
;
migrateToV2();
