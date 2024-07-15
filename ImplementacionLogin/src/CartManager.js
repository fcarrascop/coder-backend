import cartModel from "./model/cart.model.js"
import productModel from "./model/product.model.js"

class CartManager {
    constructor() {
        this.id = 0
        this.Update()
    }

    // Get the last id from the database
    async Update() {
        let list = await cartModel.find()
        list.forEach((cart)=>{this.id = (cart.id > this.id) ? cart.id : this.id})
    }
    
    // Get the cart (by id) or all carts (if id is not provided
    async getCart(id) {
        let Cart
        if (id) {
            Cart = await cartModel.findOne({id: id})
        }
        else {
            Cart = await cartModel.find()
        }
        return Cart
    }
    
    // Get the ObjectId from the product id
    async getObjectId(id) {
        let result = await productModel.findOne({id: id})
        return ((result._id).toString())
    }

    async createCart(products) {
        this.id++ 
        let list = []
        if (products?.products) {
            for (const item of products.products) {
                let objectId = await this.getObjectId(item.id);
                list.push({"id": objectId, "quantity": item.quantity});
            }
        }
        let Cart = {
            "id": this.id,
            products: list
        }
        let result = await cartModel.create(Cart)
        return result
    }

    async deleteCart(id) {
        let result = await cartModel.deleteOne({id: id})
        return ({"message": `Carrito ${id} eliminado con éxito.`})
    }

    // Working fine!
    async addProducts(id, idProduct) {
        let itemId = await this.getObjectId(idProduct)
        let cart = await cartModel.findOne({id: id})
        let some = cart.products.some((prod)=> {
            return ((prod.id.id).toString() === (idProduct).toString())
        })
        if (some) {
            let productIndex = cart.products.map((e)=> (e.id._id).toString()).indexOf((itemId).toString())
            cart.products[productIndex].quantity = cart.products[productIndex].quantity + 1
            let result = await cartModel.updateOne({id: id}, cart)
            return ({"message": "Item agregado correctamente"})
        }
        else {
            cart.products.push({"id": itemId, "quantity": 1})
            let result = await cartModel.updateOne({id: id}, cart)
            return ({"message": "Item agregado al carro correctamente"})
        }
    }


    async deleteProduct(idCart, idProduct) {
        let cart = await cartModel.findOne({id: idCart})
        let cartUpdate = cart.products.filter((item) => (item.id.id !== idProduct))
        let result = cartModel.updateOne({id: idCart},{$set: {products: cartUpdate}}).exec()
        return ({"message": "Item eliminado del carro correctamente"})
    }


    async updateCart(idCart, products) {
        let list = []
        console.log(products)
        if (products){
            for (let item of products) {
                let itemId = await this.getObjectId(item.id)
                list.push({"id": itemId, "quantity": item.quantity})
            }
        }
        let response = await cartModel.updateOne({id: idCart},{$set: {products: list}}).exec()
        return response
    }

    async updateProductQuantity(idCart, idProduct, quantity) {
        let cart = await this.getCart(idCart)
        let productIndex = cart.products.map((item)=>(item.id.id).toString()).indexOf(idProduct.toString())
        if (!quantity) {
            cart.products[productIndex].quantity = cart.products[productIndex].quantity + 1 
        }
        else {
            cart.products[productIndex].quantity = quantity
        }
        let result = await cartModel.updateOne({id: idCart},cart)
        return result
    }
}

export default CartManager
