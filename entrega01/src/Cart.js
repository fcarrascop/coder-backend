const fs = require("fs")

class Cart {
    constructor() {
        this.path = "./entrega01/src/cart.json";
        this.cartList = (fs.readFileSync(this.path)) ? JSON.parse(fs.readFileSync(this.path)) : [];
        this.currentId = 0;
        this.cartList.forEach((item) => {
            if (item.id >= this.currentId) {
                this.currentId = item.id
            }
        });
    }

    createCart(products) {
        this.currentId++;
        let id = this.currentId
        let Cart = {
            "id": id,
            "products": products.products
        }
        this.cartList.push(Cart)
        fs.writeFileSync(this.path, JSON.stringify(this.cartList));
        return {"API": `Carrito (id:${id}) creado correctamente`}
    }

    getCarts(id) {
        let Cart = this.cartList.filter((item)=> item.id == id)
        if (Cart) {
            return Cart
        }
        else {
            return {"API": "Carrito no encontrado"}
        }
    }

    deleteCart(id) {
        this.cartList = this.cartList.filter((item)=> item.id != id)
        fs.writeFileSync(this.path, JSON.stringify(this.cartList))
    }

    addProducts(id, idProduct) {
        let cartExt = this.cartList.find((item) => item.id == id)
        if (cartExt) {
            this.deleteCart(id)
            if (cartExt.products.some((it)=> it.id == idProduct)) {
                let productIndex = cartExt.products.map((e) => e.id).indexOf(idProduct)
                cartExt.products[productIndex].quantity = cartExt.products[productIndex].quantity + 1  
                this.cartList.push(cartExt)
                fs.writeFileSync(this.path, JSON.stringify(this.cartList))
                return (cartExt)
            }
            else {
                cartExt.products.push({ "id": idProduct, "quantity": 1 })
                this.cartList.push(cartExt)
                fs.writeFileSync(this.path, JSON.stringify(this.cartList))
                return (cartExt)
            }
        }
        else {
            return ({"API": `Producto con id:${id} no se encontró`})
        }
    }
}

module.exports = Cart;