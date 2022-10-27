import express from "express";
export const app = express();

import launchBodyParsers from "./middlewares/body-parsers";
import launchSessionsManagemenet from "./middlewares/sessions";
import dbConnection from "./models/utils/connection";
import setViewsParams from "./middlewares/viewSetting";
import activateAllV1Routers from "./routes/v1/all-v1-routes";
import activateAllV2Routers from "./routes/v2/all-v2-routes";
import handleWrongURL from "./middlewares/wrong-url-handler";
import launchServer from "./middlewares/server-launch";
import launchCron from "./middlewares/cron";

launchSessionsManagemenet();
launchBodyParsers();
dbConnection;
setViewsParams();
activateAllV1Routers();
activateAllV2Routers();
handleWrongURL();
launchServer(app);
launchCron();