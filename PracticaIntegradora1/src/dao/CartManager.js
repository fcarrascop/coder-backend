import cartModel from "./model/cart.model.js"

class CartManager {
    constructor() {
        this.id = 0
        this.Update()
    }

    async Update() {
        let list = await cartModel.find()
        list.forEach((cart)=>{this.id = (cart.id > this.id) ? cart.id : this.id})
    }

    async createCart(products) {
        this.id++
        let Cart = {
            "id": this.id,
            "products": (products.product) && (products.product)
        }
        let result = await cartModel.create(Cart)
        return result
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

    async deleteCart(id) {
        let result = await cartModel.deleteOne({id: id})
        return ({"API": `Carrito ${id} eliminado con éxito.`})
    }

    async addProducts(id, idProduct) {
        let cart = await cartModel.findOne({id: id})
        let some = cart.products.some((prod)=> prod.id === idProduct)
        if (some) {
            let productIndex = cart.products.map((e)=> e.id).indexOf(idProduct)
            cart.products[productIndex].quantity = cart.products[productIndex].quantity + 1
            let result = await cartModel.updateOne({id: id}, cart)
            return ({"API": "Item agregado correctamente"})
        }
        else {
            cart.products.push({"id": idProduct, "quantity": 1})
            let result = await cartModel.updateOne({id: id}, cart)
            return ({"API": "Item agregado al carro correctamente"})
        }
    }
}

export default CartManager