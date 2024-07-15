import { Router } from "express";
import { tokenExtractor } from "../utils.js";
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
router.get("/api/carts/:cid", async (req,res)=>{
    let id = parseInt(req.params.cid)
    let response = await cart.getCart(id)
    res.json({status: "success", payload: response})
})

// Modificar este endpoint
router.post("/api/carts/:cid/products/:pid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = await cart.addProducts(cartId, productId)
    if (response?.error) return res.status(404).send({status: "error", message: response.error})
    res.json({status: "success", payload: response})
})

router.delete("/carts/:cid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let response = await cart.deleteCart(cartId)
    if (response?.error) return res.status(404).send({status: "error", message: response.error})
    res.json({status: "success", payload: response})
})

router.delete("/api/carts/:cid/products/:pid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = await cart.deleteProduct(cartId, productId)
    res.json({status: "success", payload: response})
})

router.put("/api/carts/:cid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let products = req.body
    let response = await cart.updateCart(cartId, products)
    if (response?.error) return res.status(404).send({status: "error", message: response.error})
    res.json({status: "success", payload:response})
})

router.put("/api/carts/:cid/products/:pid", async (req,res)=>{
    let cartId = parseInt(req.params.cid)
    let itemId = parseInt(req.params.pid)
    let { quantity } = req.body
    let response = await cart.updateProductQuantity(cartId, itemId, quantity)
    if (response?.error) return res.status(404).send({status: "error", message: response.error})
    res.json({status: "success", payload: response})
})

router.delete("/api/carts/:cid", async (req,res)=>{
    let itemId = parseInt(req.params.cid)
    let response = await cart.updateCart(itemId)
    res.json({status: "success", payload:response})
})

router.get("/carts/:cid", async (req,res)=>{
    let id = parseInt(req.params.cid)
    let response = await cart.getCart(id)
    if (response?.error) return ({status: "error", message: response.error})
    res.render("cart", response)
})

router.get("/cart", async (req,res)=>{
    let user = tokenExtractor(req.signedCookies["user"])
    let id = await cart.getCartId(user.cartId)
    if (id?.error) return ({status: "error", message: response.error})
    let response = await cart.getCart(id)
    if (id?.error) return ({status: "error", message: response.error})
    res.render("cart", response)
})


export default router