import {app} from "../index";
import { v4 as uuidv4 } from 'uuid';
import session, { Cookie } from "express-session";

export default function launchSessionsManagemenet() {
    app.use(session({
        name: "sid",
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        genid: function(req) {
            const sid = uuidv4();
            console.log('Session id created: ' + sid);
            return sid;
        },
    }));
} 

