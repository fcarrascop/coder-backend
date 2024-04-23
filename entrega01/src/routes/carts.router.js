const express = require("express");
const router = express.Router()

const ct = require("./../Cart")

let carts = new ct()

router.get("/carts", (req,res)=>{
    res.json({ "message": "Hola"})
})

router.post("/carts", (req,res)=>{
    let products = req.body
    let response = carts.createCart(products)
    res.json({"message": response})
})


router.get("/carts/:cid", (req,res)=>{
    let id = parseInt(req.params.cid)
    let response = carts.getCarts(id)
    res.json(response)
})

router.post("/carts/:cid/product/:pid", (req, res)=>{
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = carts.addProducts(cartId, productId)
    res.json(response)
})



module.exports = router