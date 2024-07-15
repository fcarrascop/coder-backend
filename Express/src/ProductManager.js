const fs = require("fs");

class ProductManager {
    constructor() {
        this.path = "./Express/src/productos.json";
        this.products = (fs.readFileSync(this.path)) ? JSON.parse(fs.readFileSync(this.path)) : [];
        this.currentId = 11;
    }

    addProduct(product) {
        const productCheck = this.products.some((item)=> item.code == product.code);
        if (productCheck) {
            return {"error": "Error. Código ya existente."}
        }
        else {
            const id_product = this.currentId;
            this.currentId++;
            let productAdd = {
                "id" : id_product,
                "title": product.title,
                "description": product.description,
                "price": product.price,
                "thumbnail": product.thumbnail,
                "code": product.code,
                "stock": product.stock
            }
            this.products.push(productAdd);
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            return {"API": "Producto agregado correctamente."};
        }
    }

    getProducts() {
        let products = JSON.parse(fs.readFileSync(this.path));
        return products;
    }

    getProductById(id_item) {
        let products = JSON.parse(fs.readFileSync(this.path))
        let  item = (products.find((item) => item.id === id_item));
        if (item) {
            return item;
        }
        else {
            return {"error": "Error. Producto ingresado no existe."};
        }
    }

    deleteProduct(id_item) {
        let items = this.products.filter((item) => item.id != id_item);
        this.products = items;
        fs.writeFileSync(this.path, JSON.stringify(items));
        return {"API": "Producto eliminado corretamente."};
    }

    updateProduct(id_item, product) {
        let  item = (this.products.find((item) => item.id == id_item));
        if (item) {
            let productUpdate = {
                "id" : id_item,
                "title": (product.title) ? (product.title) : (item.title),
                "description": (product.description) ? (product.description) : (item.description),
                "price": (product.price) ? (product.price) : (item.price),
                "thumbnail": (product.thumbnail) ? (product.thumbnail) : (item.thumbnail),
                "code": (product.code) ? (product.code) : (item.code),
                "stock": (product.stock) ? (product.stock) : (item.stock)
            };
            this.deleteProduct(id_item);
            this.products.push(productUpdate);
            fs.writeFileSync(this.path, JSON.stringify(this.products));
        }
        else {
            return {"Error": "Producto no encontrado"};
        }
    }
}

module.exports = ProductManager;
