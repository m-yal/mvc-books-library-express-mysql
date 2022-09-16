import request from "supertest";
import {app} from "../index";
import assert from "assert";

export default describe(`Books list page tests`, function() {
    const offset: string[] = ["20", "10", "50"];
    const search: string[] = ["Clean code", "Some book", "Java for dummies"];
    const author: string[] = ["Uncle Bob", "Unknown author", "Some programmer"];
    const year: string[] = ["1995", "2000", "2012"];
    for (let i = 0; i < offset.length; i++) {
        it(`should return received from url params`, function(done: any){
            const queryStr: string = `/?offset=${offset[i]}&search=${search[i]}&author=${author[i]}&year=${year[i]}`;
            request(app)
            .get(queryStr)
            .expect(function(res) {
                assert.deepEqual(res.body, {
                    offset: offset[i],
                    search: search[i],
                    author: author[i],
                    year: year[i]
                });
            })
            .end(done);
        })
    }
});
