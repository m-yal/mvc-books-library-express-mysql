"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../controllers/auth");
const authRouter = express_1.default.Router();
authRouter.get("/auth", auth_1.getAuthPage);
authRouter.post("/auth/login", auth_1.login);
authRouter.post("/auth/logout", auth_1.logout);
exports.default = authRouter;
