const express = require("express");
const router = express.Router()

const pm = require("./../ProductManager");

let products = new pm();

router.get("/products", (req, res)=>{
    let limit = req.query.limit;
    const productList = products.getProducts();
    if (!limit){
        res.json(productList);
    }
    else{
        if (limit > productList.length){
            res.json(productList);
        }
        else {
            let productsModify = [];
            for (let i=0; i<limit; i++) {
                productsModify.push(productList[i]);
            }
            res.json(productsModify);
        }
    }
})

router.get("/products/:pid", (req,res)=>{
    let pid = parseInt(req.params.pid);
    let list = products.getProductById(pid);
    res.json(list);
})

router.post("/products", (req, res)=>{
    let prod = req.body
    let prodAdd = products.addProduct(prod)
    res.json({"message": prodAdd})
})

router.put("/products/:pid", (req, res)=>{
    let id = parseInt(req.params.pid)
    let prod = req.body
    let prodUpdate = products.updateProduct(id, prod)
    res.json({"message": prodUpdate})
})

router.delete("/products/:pid", (req, res)=>{
    let id = parseInt(req.params.pid)
    let prodDelete = products.deleteProduct(id)
    res.json(prodDelete)
})

module.exports = router