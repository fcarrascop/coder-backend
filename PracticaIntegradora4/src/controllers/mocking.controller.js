import { faker } from "@faker-js/faker";

export const mocking = async (req, res) => {
    let products = []
    for (let i = 0; i<=100; i++) {
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
        products.push(product)
    }
    res.json(products)
}