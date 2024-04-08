const fs = require("fs");

class ProductManager {
    constructor() {
        this.path = "./ProductManager/productos.json"
        this.products = (fs.readFileSync(this.path)) ? JSON.parse(fs.readFileSync(this.path)) : [];
        this.currentId = 1;
    }

    addProduct(product) {
        const productCheck = this.products.some((item)=> item.code == product.code);
        if (productCheck) {
            console.log("Error. Código ya existente")
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
        }
    }

    getProducts() {
        let products = JSON.parse(fs.readFileSync(this.path))
        console.log(products)
    }

    getProductById(id_item) {
        let products = JSON.parse(fs.readFileSync(this.path))
        let  item = (products.find((item) => item.id === id_item));
        if (item) {
            console.log(item)
        }
        else {
            console.log("Error. Producto no encontrado")
        }
    }

    deleteProduct(id_item) {
        let items = this.products.filter((item) => item.id != id_item);
        this.products = items;
        fs.writeFileSync(this.path, JSON.stringify(items));
    }

    updateProduct(id_item, product) {
        let  item = (this.products.find((item) => item.id == id_item))
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
            console.log("Error: Producto no encontrado")
        }
    }
}

// Comprobar que el código está bueno
/* let inventario = new ProductManager;
inventario.getProducts();
inventario.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price:200,
    thumbnail:"Sin imagen",
    code:"abc123",
    stock:25
})
inventario.getProducts();
inventario.addProduct({
    title: "producto prueba",
    description: "Este es un producto prueba",
    price:200,
    thumbnail:"Sin imagen",
    code:"abc123",
    stock:25
})
inventario.getProductById(1);
inventario.updateProduct(1, {title: "Otro producto"});
inventario.getProducts();
inventario.deleteProduct(1); */