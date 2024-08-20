import { expect } from "chai";
import supertest from "supertest";
import { faker } from "@faker-js/faker"


const requester = supertest(`http://localhost:8080`);

describe("Testing API tienda genérica", ()=>{
    // Variable para guardar la cookie de sesión
    let cookie
    
    describe("Testing session", ()=>{
        it("Logeando con un usuario admin", async ()=>{
            // Sacar los datos de usuario desde el .env
            const User = {
                email: "adminCoder@coder.com",
                password: "adminCod3r123"
            }

            const response = await requester.post("/login").send(User)
            cookie = {
                name: response.header["set-cookie"][0].split("=")[0],
                value: response.header["set-cookie"][0].split("=")[1].split(";")[0]
            }

            const session = await requester.get("/current").set("Cookie", `${cookie.name}=${cookie.value}`)
            expect(session._body.data).to.have.property("role").to.be.equal("admin")
        })
    })

    describe("Testing products", async ()=>{
        let body
        it("Creando un producto", async ()=>{
            let product = {
                title: faker.commerce.productName(), 
                description: faker.commerce.productDescription(), 
                price: parseInt(faker.commerce.price({ min: 50, max: 500})),
                thumbnail: "Sin imagen", 
                code: faker.string.alphanumeric(10),
                stock: faker.number.int(100),
                status: true, 
                category: faker.commerce.department()
            }

            const response = await requester.post("/products").send(product).set("Cookie", `${cookie.name}=${cookie.value}`)
            expect(response._body.payload).to.have.property("_id").to.be.a("string")
            if (response?._body.payload._id) body = response._body
        })

        it("Buscar el producto creado", async ()=>{
            let response = await requester.get(`/products/${body.payload.id}`).set("Cookie", `${cookie.name}=${cookie.value}`)
            expect(response._body._id).to.be.equal(body._id)
            expect(response._body.code).to.be.equal(body.code)
            expect(response._body._title).to.be.equal(body.title)
        })

        it("Actualizar el producto creado", async ()=>{
            let productName = faker.commerce.productName()
            let productCode = faker.string.alphanumeric(10)
            
            let product = {
                title: productName, 
                description: body.payload.description, 
                price: body.payload.price,
                thumbnail: body.payload.thumbnail, 
                code: productCode,
                stock: body.payload.stock,
                status: body.payload.status, 
                category: body.payload.category
            }

            let response = await requester.put(`/products/${body.payload.id}`).send(product).set("Cookie", `${cookie.name}=${cookie.value}`)
            let response2 = await requester.get(`/products/${body.payload.id}`).set("Cookie", `${cookie.name}=${cookie.value}`)
            expect(response2._body.payload.title).to.be.equal(productName)
            expect(response2._body.payload.code).to.be.equal(productCode)
        })

        it("Eliminar el producto creado", async ()=>{
            let response = await requester.delete(`/products/${body.payload.id}`).set("Cookie", `${cookie.name}=${cookie.value}`)
            expect(response._body.payload.message).to.be.equal("Producto eliminado.")
        })
    })

    describe("Testing carrito user", async ()=>{
        let idDelete
        it("Agregar 2 productos al carrito", async ()=>{
            let response = await requester.get("/products").set("Cookie", `${cookie.name}=${cookie.value}`)
            let products = response._body.payload
            let number = products.length
            let product1 = products[Math.floor(Math.random() * number)].id
            let product2 = products[Math.floor(Math.random() * number)].id
            let product3 = products[Math.floor(Math.random() * number)].id

            let clear = await requester.put("/api/cart").set("Cookie", `${cookie.name}=${cookie.value}`)
            expect(clear._body.payload).to.be.equal("Carrito vaciado")
            let add1 = await requester.post(`/api/cart/products/${product1}`).set("Cookie", `${cookie.name}=${cookie.value}`)
            let add2 = await requester.post(`/api/cart/products/${product2}`).set("Cookie", `${cookie.name}=${cookie.value}`)

            idDelete = product2
            expect(add1._body.payload).to.have.property("message");
            expect(add1._body.payload.message).to.be.equal("Item agregado al carro correctamente");

            expect(add2._body.payload).to.have.property("message");
            expect(add2._body.payload.message).to.be.equal("Item agregado al carro correctamente");
        }).timeout(10000)

        it("Eliminar un producto del carrito", async ()=>{
            let response = await requester.delete(`/api/cart/products/${idDelete}`).set("Cookie", `${cookie.name}=${cookie.value}`)
            expect(response._body.payload.message).to.be.equal("Item eliminado del carro correctamente")
        })

        it("Terminar de comprar los products", async ()=>{
            let response = await requester.post("/api/cart/purchase").set("Cookie", `${cookie.name}=${cookie.value}`)
            expect(response._body.payload).to.have.property("code")
            let response2 = await requester.get("/current").set("Cookie", `${cookie.name}=${cookie.value}`)
            expect(response._body.payload.purchaser).to.be.equal(response2._body.data.email)
        })
    })
})