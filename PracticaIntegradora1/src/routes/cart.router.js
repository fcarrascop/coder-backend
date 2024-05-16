import { Router } from "express";
import CartManager from "../dao/model/CartManager.js";
import cartModel from "../dao/model/cart.model.js";

const router = Router()

let cart = new CartManager()

router.post("/carts", async (req,res)=>{
    let products = req.body
    let response
    if (products) {
        response = await cart.createCart(products)
    }
    else {
        response = await cart.createCart()
    }
    res.json(response)
})

router.get("/carts", async (req,res)=>{
    let response = await cart.getCart()
    res.json(response)
})

router.get("/carts/:cid", async (req,res)=>{
    let id = parseInt(req.params.cid)
    let response = await cart.getCart(id)
    res.json(response)
})

router.post("/carts/:cid/products/:pid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = await cart.addProducts(cartId, productId)
    res.json(response)
})

router.delete("/carts/:cid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let response = await cart.deleteCart(cartId)
    res.json(response)
})

export default router