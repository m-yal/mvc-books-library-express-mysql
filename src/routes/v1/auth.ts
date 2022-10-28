import express, { Router } from "express";
import { AUTH_V1, LOGIN_V1, LOGOUT_V1 } from "../../constants";
import {login, logout, getAuthPage} from "../../controllers/v1/auth";

const authRouter: Router = express.Router();

authRouter.get(AUTH_V1, getAuthPage);
authRouter.post(LOGIN_V1, login);
authRouter.post(LOGOUT_V1, logout);

export default authRouter;