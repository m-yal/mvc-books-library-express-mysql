import express from "express";
import {login, logout} from "../../controllers/auth";

const authRouter = express.Router();

authRouter.post("/auth/login", login);
authRouter.post("/auth/logout", logout);

export default authRouter;