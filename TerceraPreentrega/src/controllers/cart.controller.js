import CartManager from "../dao/mongo/classes/CartManager.js";
import TicketManager from "../dao/mongo/classes/TicketsManager.js";
import { tokenExtractor } from "../utils.js";
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
    let itemId = parseInt(req.params.cid)
    let response = await cart.updateCart(itemId)
    res.json({status: "success", payload:response})
}

export const getViewCart = async (req, res) => {
    let id = parseInt(req.params.cid)
    let response = await cart.getCart(id)
    if (response?.error) return ({status: "error", message: response.error})
    res.render("cart", response)
}

export const getCartfromCookie = async (req, res) => {
    let user = tokenExtractor(req.signedCookies["user"])
    let id = await cart.getCartId(user.cartId)
    if (id?.error) return ({status: "error", message: response.error})
    let response = await cart.getCart(id)
    if (id?.error) return ({status: "error", message: response.error})
    res.render("cart", response)
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