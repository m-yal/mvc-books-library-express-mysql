import {app} from "../index";
import dotenv from "dotenv";

dotenv.config();

export default function launchServer(): void {
    const PORT: string = process.env.PORT || "3005";
    app.listen(PORT);
    console.log("Server started on port " + PORT);
}