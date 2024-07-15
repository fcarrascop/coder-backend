import { Router } from "express";
// Importamos todo lo necesario para ocupar MongoDB dentro de ProductManager
import ProductManager from "../ProductManager.js";


const router = Router()

let product = new ProductManager()


router.get("/", async (req,res)=>{
    let { limit = 10, page = 1, sort, query } = req.query
    limit = parseInt(limit)
    page = parseInt(page)
    if (!Number.isInteger(page)) {
        res.status(400).json({status: "Error", message: "Página ingresada inválida."})
    }
    else {

        page = parseInt(page)
        let search = {
            "limit": limit,
            "page": page,
            "sort": (sort) ? sort : "",
            "query": (query) ? query : "",
        }
        try {
            let products = await product.getProducts(search)
            
            if (products.totalPages < products.page) {
                res.status(400).json({status: "Error", message: "Página ingresada inválida."})
            }
            else {
                res.json({
                    status: "success",
                    payload: products.docs,
                    totalPages : products.totalPages,
                    prevPage: products.prevPage,
                    nextPage: products.nextPage,
                    page: products.page,
                    hasPrevPage: products.hasPrevPage,
                    hasNextPage: products.hasNextPage,
                    prevLink: (products.hasPrevPage) ? `/?limit=${limit}&page=${products.prevPage}&sort=${sort || ""}&query=${query || ""}` : null,
                    nextLink: (products.hasNextPage) ? `/?limit=${limit}&page=${products.nextPage}&sort=${sort || ""}&query=${query || ""}` : null
                })
            }
        }
        catch(error){
            console.log(error)
            res.status(500).json({ status: "error", message: "Internal server error"})
        }
    }
})

router.get("/products/:pid", async (req,res)=>{
    let pid = parseInt(req.params.pid);
    let list = await product.getProductsById(pid);
    if (list?.message) {
        res.status(400).json({status: "error", message: list.message})
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
        if (send?.message) {
            res.status(400).json({status: "error", message: send.message})
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
    if (prodUpdate?.message) {
        res.status(400).json({status: "error", message: prodUpdate.message})
    }
    else {
        res.json({status: "success", payload: prodUpdate})
    }
})

router.get("/products", async (req,res)=>{
    let page = parseInt(req.query.page)
    if (!page) {page = 1}
    let result = await product.getProducts({"page": page})
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
    res.render("products", result)
})





export default router