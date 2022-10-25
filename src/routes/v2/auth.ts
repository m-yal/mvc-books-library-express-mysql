import express from "express";
import {login, logout, getAuthPage} from "../../controllers/v2/auth";
import csrf from 'csurf';

const authRouter = express.Router();

authRouter.get("/auth", getAuthPage);
authRouter.post("/auth/login", login);
authRouter.post("/auth/logout", logout);

export default authRouter;