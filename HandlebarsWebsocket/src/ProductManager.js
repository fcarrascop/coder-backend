import fs from "fs"

class ProductManager {
    constructor() {
        this.path = "./HandlebarsWebsocket/src/products.json";
        this.products = (fs.readFileSync(this.path)) ? JSON.parse(fs.readFileSync(this.path)) : [];
        this.currentId = 0;
        this.products.forEach((item) => {
            if (item.id >= this.currentId) {
                this.currentId = item.id
            }
        });
    }

    addProduct(product) {
        const productCheck = this.products.some((item)=> item.code === product.code);
        if (productCheck) {
            return {"error": "Error. Código ya existente."}
        }
        else {
            this.currentId++;
            const id_product = this.currentId;
            let thumbnail = product.thumbnail ? product.thumbnail : ""
            let productAdd = {
                "id" : id_product,
                "title": product.title,
                "description": product.description,
                "price": product.price,
                "thumbnail": thumbnail,
                "code": product.code,
                "stock": product.stock,
                "status": product.status,
                "category": product.category
            }
            this.products.push(productAdd);
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            return {"API": `Producto (id:${id_product}) agregado correctamente.`};
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
        this.products = this.products.filter((item) => item.id !== id_item);
        fs.writeFileSync(this.path, JSON.stringify(this.products));
        return {"API": `Producto (id:${id_item}) eliminado corretamente.`};
    }

    updateProduct(id_item, product) {
        let  item = (this.products.find((item) => item.id === id_item));
        if (item) {
            let productUpdate = {
                "id" : id_item,
                "title": (product.title) ? (product.title) : (item.title),
                "description": (product.description) ? (product.description) : (item.description),
                "price": (product.price) ? (product.price) : (item.price),
                "thumbnail": (product.thumbnail) ? (product.thumbnail) : (item.thumbnail),
                "code": (product.code) ? (product.code) : (item.code),
                "stock": (product.stock) ? (product.stock) : (item.stock),
                "status": (product.status) ? (product.status) : (item.status),
                "category": (product.category) ? (product.category) : (item.category)
            };
            this.deleteProduct(id_item);
            this.products.push(productUpdate);
            fs.writeFileSync(this.path, JSON.stringify(this.products));
            return productUpdate;
        }
        else {
            return {"error": "Producto no encontrado"};
        }
    }
}

export default ProductManager
