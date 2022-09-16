import request from "supertest";
import {app} from "../index";

export default describe(`Book instanse page tests`, function() {
    it(`should return input book id received from url params`, function(done: any){
        request(app)
            .get("/books/101")
            .expect("101")
            .end(done);
    });
});
