import productModel from "../models/product.model.js"

class ProductManager {
    constructor(){
        this.id = 0
        this.Update()
    }

    // 1.
    async Update() {
        let list = await productModel.find()
        list.forEach((prod)=>{ this.id = (prod.id > this.id) ? prod.id : this.id })
    }

    // 2.
    async addProduct(product, user) {
        let productCheck = await productModel.find()
        productCheck = productCheck.some((item)=> item.code === product.code)
        if (productCheck) {
            return {"error": "Error. Código ya existente."}
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
                "category": product.category,
                "owner": (user.role =! "admin") ? user.email : "admin"
            }
            let result = await productModel.create(productAdd)
            return result
        }
    }

    // 3.
    async getProducts(search) {
        let { limit, page, sort, query } = search
        try {
            let filter = {}
            let sortOptions = {}
            if (query) {
                filter = {
                    $or: [
                        { category: query },
                        { status: query.toLowerCase() === "true"}
                    ]
                }
            }
            if (sort) {
                sortOptions.price = (sort === "asc") ? 1 : -1
            }

            let result = await productModel.paginate(filter, {sort: sortOptions, page: page, limit: limit})
            return result

        }
        catch (error) {
            return ({error: "Error buscando los productos"})
        }
    }

    // 3.1

    async getAllProducts(){
        let result = await productModel.find()
        return result
    }

    // 4.
    async getProductsById(id) {
        let product = await productModel.findOne({ id: id })
        if ((product.length !== 0)) {
            return product
        }
        else {
            return ({"error": "No se encontró el producto."})
        }
    } 

    // 5.
    async deleteProduct(id_item) {
        let product = await productModel.deleteOne({ id: id_item })
        return ({"message": "Producto eliminado."})
    }
    
    // 6. Esto funciona bien?
    async updateProduct(id_item, product) {
        let item = await this.getProductsById(id_item)
        if (item?.error) return item
        let productUpdate = {
            "id" : id_item,
            "title": (product.title) ? (product.title) : (item.title),
            "description": (product.description) ? (product.description) : (item.description),
            "price": (product.price) ? (product.price) : (item.price),
            "thumbnail": (product.thumbnail) ? (product.thumbnail) : (item.thumbnail),
            "code": (product.code) ? (product.code) : (item.code),
            "stock": (product.stock) ? (product.stock) : (item.stock),
            "status": (product.status) ? (product.status) : (item.status),
            "category": (product.category) ? (product.category) : (item.category),
            "owner": item.owner
        }
        let result = await productModel.updateOne({ id: id_item }, productUpdate)
        return result
    }

}

export default ProductManager;