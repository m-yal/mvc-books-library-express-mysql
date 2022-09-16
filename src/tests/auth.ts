import request from "supertest";
import {app} from "../index";

export default describe(`Auth tests`, function() {
    it(`should return "login"`, function(done: any){
        request(app)
            .post("/auth/login")
            .expect("login")
            .end(done);
    });
    it(`should return "logout"`, function(done: any){
        request(app)
            .post("/auth/logout")
            .expect("logout")
            .end(done);
    });
});
