import {app} from "../index";

export default function launchServer(app: any) {
    const PORT: string = process.env.PORT || "3005";
    app.listen(PORT);
    console.log("Server started on port " + PORT);
}