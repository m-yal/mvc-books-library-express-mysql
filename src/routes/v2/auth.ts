import express, { Router } from "express";
import { AUTH_ROUTE_V2, LOGIN_V2, LOGOUT_V2 } from "../../constants";
import {login, logout, getAuthPage} from "../../controllers/v2/auth";

const authRouter: Router = express.Router();

authRouter.get(AUTH_ROUTE_V2, getAuthPage);
authRouter.post(LOGIN_V2, login);
authRouter.post(LOGOUT_V2, logout);

export default authRouter;