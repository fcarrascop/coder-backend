import { expect } from "chai";
import supertest from "supertest";

const requester = supertest(`http://localhost:8080`);

describe("Testing login/logout lastConnection", ()=>{
    let cookie
    it("Login", async ()=>{
        const User = {
            email: "",
            password: ""
        }

        const response = await requester.post("/login").send(User)
        cookie = {
            name: response.header["set-cookie"][0].split("=")[0],
            value: response.header["set-cookie"][0].split("=")[1].split(";")[0]
        }

        

    })
})