import { ObjectId } from "mongodb"
import cartModel from "./model/cart.model.js"
import productModel from "./model/product.model.js"

class CartManager {
    constructor() {
        this.id = 0
        this.Update()
    }

    async Update() {
        let list = await cartModel.find()
        list.forEach((cart)=>{this.id = (cart.id > this.id) ? cart.id : this.id})
    }
    
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
    
    async getObjectId(id) {
        let result = await productModel.findOne({id: id})
        return (result._id)
    }

    async createCart(products) {
        this.id++
        let list = {} 
        if (products.lenth > 0) {
            products.forEach(async (item)=>{
                let objectId = await this.getObjectId(item.id)
                list.append({"id": objectId, quantity:1})
            })
        }
        let Cart = {
            "id": this.id,
            "products": list
        }
        let result = await cartModel.create(Cart)
        return result
    }


    async deleteCart(id) {
        let result = await cartModel.deleteOne({id: id})
        return ({"message": `Carrito ${id} eliminado con éxito.`})
    }

    async addProducts(id, idProduct) {
        let itemId = await this.getObjectId(idProduct)
        let cart = await cartModel.findOne({id: id})
        let some = cart.products.some((prod)=> prod.id === itemId)
        if (some) {
            let productIndex = cart.products.map((e)=> e.id).indexOf(itemId)
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
        let idItem = await this.getObjectId(idProduct)
        let cartUpdate = cart.products.map((item) => item.id !== idItem)
        let result = await cartModel.updateOne({id: idCart}, cartUpdate)
        return ({"message": "Item eliminado del carro correctamente"})
    }

    async updateCart(idCart, products) {
        let list = {}
        if (products){
            products.forEach(async (item)=>{
                let itemId = await this.getObjectId(item.id)
                list.push({"id": item.id, "quantity": item.quantity})
            })
        }
        let response = await cartModel.updateOne({"id": idCart}, list)
        return response
    }

    async updateProductQuantity(idCart, idProduct, quantity) {
        let id = await this.getObjectId(idProduct)
        let cart = this.getCart(idCart)
        let productIndex = cart.products.map((item)=>item.id).indexOf(id)
        cart.products[productIndex].quantity = quantity
        let result = await cartModel.updateOne({id: idCart}, cart)
        return result
    }

}

export default CartManager
