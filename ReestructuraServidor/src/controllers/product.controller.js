import ProductManager from "../dao/mongo/classes/ProductManager.js";
import CartManager from "../dao/mongo/classes/CartManager.js";
import { tokenExtractor } from "../utils.js";

let cart = new CartManager()
let product = new ProductManager()

export const toProducts = (req, res) => {
    res.redirect("/products")
}

export const getProductsId = async (req, res) => {
    let pid = parseInt(req.params.pid);
    let list = await product.getProductsById(pid);
    if (list?.error) res.status(404).json({status: "error", message: list.error})
    res.json({status: "success", payload: list});
}

export const postProduct = async (req, res) => {
    let { title, description, price, thumbnail, code, stock, status, category } = req.body
    if (!title || !description || !price || !code || !status || !category) res.status(400).json({"status": "error", message: "Falta parámetros"})
    let send = await product.addProduct({
        "title": title,
        "description": description,
        "price": price,
        "thumbnail": thumbnail,
        "code": code,
        "stock": stock,
        "status": status,
        "category": category
    })
    if (send?.error) res.status(400).json({status: "error", message: send.error})
    res.json({ status: "success", payload: send})
}

export const deleteProduct = async (req, res) => {
    let id = parseInt(req.params.pid)
    let prodDelete = await product.deleteProduct(id)
    res.json({status: "success", payload: prodDelete})
}

export const updateProduct = async (req, res) => {
    let id = parseInt(req.params.pid)
    let prod = req.body
    let prodUpdate = await product.updateProduct(id, prod)
    if (prodUpdate?.error) res.status(404).json({status: "error", message: prodUpdate.error})
    res.json({status: "success", payload: prodUpdate})
}

export const showProducts = async (req, res) => {
    let page = parseInt(req.query.page)
    if (!page) {page = 1}
    let result = await product.getProducts({"page": page})
    let user = tokenExtractor(req.signedCookies["user"])
    let id = await cart.getCartId(user.cartId)
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
    res.render("products", {"result": result, "user": user.firstName, "role": user.role, "cartId": id})
}