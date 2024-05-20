import productModel from "./model/product.model.js"

class ProductManager {
    constructor(){
        this.id = 0
        this.Update()
    }

    async Update() {
        let list = await productModel.find()
        list.forEach((prod)=>{ this.id = (prod.id > this.id) ? prod.id : this.id })
    }

    async addProduct(product) {
        let productCheck = await productModel.find()
        productCheck = productCheck.some((item)=> item.code === product.code)
        if (productCheck) {
            return {"API": "Error. Código ya existente."}
        }
        else {
            this.id++;
            const id_product = this.id;
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
            let result = await productModel.create(productAdd)
            return result

        }
    }

    async getProducts(limit) {
        if (limit) {
            let products = await productModel.find().limit(limit)
            return products
        }
        else {
            let products = await productModel.find()
            return products
        }
    }

    async getProductsById(id) {
        let product = await productModel.find({ id: id })
        if (product != "") {
            return product
        }
        else {
            return ({"API": "No se encontró el producto."})
        }
    }

    async deleteProduct(id_item) {
        let product = await productModel.deleteOne({ id: id_item })
        return ({"API": "Elemento eliminado."})
    }

    async updateProduct(id_item, product) {
        let item = await this.getProductsById(id_item)
        if (!item.API){
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
            }
            let result = await productModel.updateOne({ id: id_item }, productUpdate)
            return result
        }
    }

}

export default ProductManager;