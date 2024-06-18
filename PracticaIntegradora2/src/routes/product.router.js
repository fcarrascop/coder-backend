import { Router } from "express";
// Importamos todo lo necesario para ocupar MongoDB dentro de ProductManager
import ProductManager from "../ProductManager.js";
import CartManager from "../CartManager.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { tokenExtractor } from "../utils.js";

const router = Router()

let cart = new CartManager()
let product = new ProductManager()

router.get("/", isAuthenticated, async (req,res)=>{
    res.redirect("/products")
})

router.get("/products/:pid", async (req,res)=>{
    let pid = parseInt(req.params.pid);
    let list = await product.getProductsById(pid);
    if (list?.error) {
        res.status(404).json({status: "error", message: list.error})
    }
    res.json({status: "success", payload: list});
})

router.post("/products", async (req,res)=>{
    let {title, description, price, thumbnail, code, stock, status, category} = req.body
    if (!title || !description || !price || !code || !status || !category) {
        res.status(400).json({"status": "error", message: "Falta parámetros"})
    }
    else {
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
        if (send?.error) {
            res.status(400).json({status: "error", message: send.error})
        }
        else {
            res.json({ status: "success", payload: send})
        }
    }
})

router.delete("/products/:pid", async (req, res)=>{
    let id = parseInt(req.params.pid)
    let prodDelete = await product.deleteProduct(id)
    res.json({status: "success", payload: prodDelete})
})

router.put("/products/:pid", async (req, res)=>{
    let id = parseInt(req.params.pid)
    let prod = req.body
    let prodUpdate = await product.updateProduct(id, prod)
    if (prodUpdate?.error) {
        res.status(404).json({status: "error", message: prodUpdate.error})
    }
    else {
        res.json({status: "success", payload: prodUpdate})
    }
})

router.get("/products", isAuthenticated, async (req,res)=>{
    let page = parseInt(req.query.page)
    if (!page) {page = 1}
    let result = await product.getProducts({"page": page})
    let user = tokenExtractor(req.signedCookies["user"])
    let rol = user?.edit === true ? "admin" : "user"
    let id = await cart.getCartId(user.cartId)
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
    res.render("products", {"result": result, "user": user.firstName, "rol": rol, "cartId": id})
})

export default router