import {app} from "../index";

export default function handleWrongURL() {
    app.use(function(req, res, next) {
        res.status(404).end(JSON.stringify({error: "Not Found Page"}));
    });
}