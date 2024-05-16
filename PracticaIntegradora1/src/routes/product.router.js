import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const router = Router()

let product = new ProductManager()

router.get("/products", async (req,res)=>{
    let limit = req.query.limit
    try {
        let products = await product.getProducts(limit)
        res.json(products)
    }
    catch(error){
        console.log(error)
    }
})

router.get("/products/:pid", async (req,res)=>{
    let pid = parseInt(req.params.pid);
    let list = await product.getProductsById(pid);
    res.json(list);
})

router.post("/products", async (req,res)=>{
    let {title, description, price, thumbnail, code, stock, status, category} = req.body
    if (!title || !description || !price || !code || !status || !category) {
        res.send({"Error": "Faltan parámetros"})
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
        res.json(send)
    }
})

router.delete("/products/:pid", async (req, res)=>{
    let id = parseInt(req.params.pid)
    let prodDelete = await product.deleteProduct(id)
    res.json(prodDelete)
})

router.put("/products/:pid", async (req, res)=>{
    let id = parseInt(req.params.pid)
    let prod = req.body
    let prodUpdate = await product.updateProduct(id, prod)
    res.json(prodUpdate)
})



export default router