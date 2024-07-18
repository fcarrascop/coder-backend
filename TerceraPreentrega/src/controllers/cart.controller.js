import CartManager from "../dao/mongo/classes/CartManager.js";
import TicketManager from "../dao/mongo/classes/TicketsManager.js";
import { tokenExtractor, dataExtractor } from "../utils.js";
import { ticketMailGenerator } from "../utils.js";

let cart = new CartManager()
let ticket = new TicketManager()

export const addCart = async (req, res) => {
    let products = req.body
    let response
    if (products) {
        response = await cart.createCart(products)
    }
    else {
        response = await cart.createCart()
    }
    res.json({status: "success", payload: response})
}

export const getCarts = async (req, res) => {
    let response = await cart.getCart()
    res.json({status: "success", payload: response})
}

export const getCartId = async (req, res) => {
    let id = parseInt(req.params.cid)
    let response = await cart.getCart(id)
    res.json({status: "success", payload: response})
}

export const addProductCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = await cart.addProducts(cartId, productId)
    if (response?.error) return res.status(404).send({status: "error", message: response.error})
    res.json({status: "success", payload: response})
}

export const deleteCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let response = await cart.deleteCart(cartId)
    if (response?.error) return res.status(404).send({status: "error", message: response.error})
    res.json({status: "success", payload: response})
}

export const deleteProductCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = await cart.deleteProduct(cartId, productId)
    res.json({status: "success", payload: response})
}

export const modifyCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let products = req.body
    let response = await cart.updateCart(cartId, products)
    if (response?.error) return res.status(404).send({status: "error", message: response.error})
    res.json({status: "success", payload:response})
}

export const changeQuantity = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let itemId = parseInt(req.params.pid)
    let { quantity } = req.body
    let response = await cart.updateProductQuantity(cartId, itemId, quantity)
    if (response?.error) return res.status(404).send({status: "error", message: response.error})
    res.json({status: "success", payload: response})
}

export const clearCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let response = await cart.updateCart(cartId)
    res.json({status: "success", payload:response})
}

export const purchase = async (req, res) => {
    let cid = req.params.cid
    let user = tokenExtractor(req.signedCookies["user"])
    let userCart = await cart.getCart(cid)
    let total = 0
    if (userCart.products.length == 0) return res.json({"status": "no items"})
    userCart.products.forEach((prod)=>{total += prod.quantity*prod.id.price})
    let response = await ticket.create(total, user.email)
    cart.updateCart(cid)
    ticketMailGenerator(response)
    res.json({"status": "success", "payload": response})
}

export const purchased = async (req, res) => {
    let tid = req.params.tid
    let response = await ticket.findByCode(tid)
    res.render("purchased", response)
}

// user Only

export const viewCart = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let response = await cart.getCartById(user.cartId)
        if (response?.error) return ({status: "error", message: response.error})
        res.render("cart", response)    
    }
    catch (err) {
        res.json("Ha ocurrido un error.")
    }
}

export const deleteProductCartUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let cid = await cart.getCartId(user.cartId)
        let productId = parseInt(req.params.pid)
        let response = await cart.deleteProduct(cid, productId)
        res.json({status: "success", payload: response})
    }
    catch (err) {
        res.json("Ha ocurrido un error.")
    }
}

export const addProductCartUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let cartId = await cart.getCartId(user.cartId)
        if (cartId?.error) return res.status(404).send({status: "error", message: response.error})
        let productId = parseInt(req.params.pid)
        let response = await cart.addProducts(cartId, productId)
        if (response?.error) return res.status(404).send({status: "error", message: response.error})
        res.json({status: "success", payload: response})
    }
    catch (err) {
        res.json("Ha ocurrido un error.")
    }
}

export const clearCartUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let cartId = await cart.getCartId(user.cartId)
        let response = await cart.updateCart(cartId)
        res.json({status: "success", payload: response})
    }
    catch (err) {
        res.json("Ha ocurrido un error.")
    }
}

export const purchaseUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let userCart = await cart.getCartById(user.cartId)
        let total = 0
        if (userCart.products.length == 0) return res.json({"status": "no items"})
        userCart.products.forEach((prod)=>{total += prod.quantity*prod.id.price})
        let response = await ticket.create(total, user.email)
        let cid = await cart.getCartId(user.cartId)
        cart.updateCart(cid)
        ticketMailGenerator(response)
        res.json({"status": "success", "payload": response})
    }
    catch (err) {
        res.json("Ha ocurrido un error.")
    }
}
