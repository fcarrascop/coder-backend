import { Router } from "express";
// Usamos el CartManager para funcionar con MongoDB
import CartManager from "../CartManager.js";

const router = Router()

let cart = new CartManager()

router.post("/api/carts", async (req,res)=>{
    let products = req.body
    let response
    if (products) {
        response = await cart.createCart(products)
    }
    else {
        response = await cart.createCart()
    }
    res.json({status: "success", payload: response})
})

router.get("/api/carts", async (req,res)=>{
    let response = await cart.getCart()
    res.json({status: "success", payload: response})
})

// Editar para mostrar el view
/* router.get("/carts/:cid", async (req,res)=>{
    let id = parseInt(req.params.cid)
    let response = await cart.getCart(id)
    res.json(response)
}) */

// Modificar este endpoint
router.post("/api/carts/:cid/products/:pid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = await cart.addProducts(cartId, productId)
    res.json({status: "success", payload: response})
})

router.delete("/carts/:cid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let response = await cart.deleteCart(cartId)
    res.json({status: "success", payload: response})
})

router.delete("/api/carts/:cid/products/:pid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = await cart.deleteProduct(cartId, productId)
    return ({status: "success", payload: response})
})

router.put("/api/carts/:cid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let products = req.body.products
    let response = await cart.updateCart(cartId, products)
    res.json({status: "success", payload:response})
})

router.put("/api/carts/:cid/products/:pid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let itemId = parseInt(req.params.pid)
    let { quantity } = req.body
    let response = await cart.updateProductQuantity(cartId, itemId, quantity)
    res.json({status: "success", payload:response})
})

router.delete("/api/carts/:cid", async (req,res)=>{
    let itemId = parseInt(req.params.cid)
    let response = await cart.updateCart(itemId)
    res.json({status: "success", payload:response})
})


export default router