import CartManager from "../dao/mongo/classes/CartManager.js";
import TicketManager from "../dao/mongo/classes/TicketsManager.js";
import { tokenExtractor, dataExtractor } from "../utils.js";
import { ticketMailGenerator } from "../utils.js";
import CustomError from "../services/CustomError.js"
import EErrors from "../services/enum.js"
import { productsCartError, getCartError, getTicketError, getCartIdError } from "../services/infoError.js";

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
    if (response?.error) {
        CustomError.createError({
            name: "Crear carrito",
            cause: productsCartError(response.id),
            code: EErrors.INVALID_ID_PRODUCT_ERROR
        })
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
    if (response?.error) {
        CustomError.createError({
            name: "Obtener carrito específico.",
            cause: getCartError(id),
            code: EErrors.INVALID_ID_CART_ERROR
        })
    }
    res.json({status: "success", payload: response})
}

export const addProductCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = await cart.addProducts(cartId, productId)
    if (response?.error) {
        CustomError.createError({
            name: "Agregar productos al carrito",
            cause: getCartError(cartId),
            code: EErrors.INVALID_ID_CART_ERROR
        })
    }
    res.json({status: "success", payload: response})
}

export const deleteCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let response = await cart.deleteCart(cartId)
    res.json({status: "success", payload: response})
}

export const deleteProductCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = await cart.deleteProduct(cartId, productId)
    if (response.error) {
        CustomError.createError({
            name: "Eliminar producto de carrito",
            cause: getCartError(cartId),
            code: EErrors.INVALID_ID_CART_ERROR
        })
    }
    res.json({status: "success", payload: response})
}

export const modifyCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let products = req.body
    let response = await cart.updateCart(cartId, products)
    if (response?.error) {
        CustomError.createError({
            name: "Modificar carrito",
            cause: productsCartError(response.id),
            code: EErrors.INVALID_ID_PRODUCT_ERROR
        })
    }
    res.json({status: "success", payload:response})
}

export const changeQuantity = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let itemId = parseInt(req.params.pid)
    let { quantity } = req.body
    let response = await cart.updateProductQuantity(cartId, itemId, quantity)
    if (response?.error) {
        CustomError.createError({
            name: "Modificar cantidad carrito",
            cause: getCartError(cartId),
            code: EErrors.INVALID_ID_CART_ERROR
        })
    }
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
    if (userCart.error) {
        CustomError.createError({
            name: "Finalizar compra",
            cause: getCartError(cid),
            code: EErrors.INVALID_ID_CART_ERROR
        })
    }
    let total = 0
    if (userCart.products.length == 0) return res.json({"status": "no items"})
    userCart.products.forEach((prod)=>{total += prod.quantity*prod.id.price})
    let response = await ticket.create(total, user.email)
    cart.updateCart(cid)
    let email = ticketMailGenerator(response)
    if (email?.error) {
        CustomError.createError({
            name: "Envio email",
            cause: "Error al enviar el email del ticket al usuario.",
            code: EErrors.EMAIL_ERROR
        })
    }
    res.json({"status": "success", "payload": response})
}

export const purchased = async (req, res) => {
    let tid = req.params.tid
    let response = await ticket.findByCode(tid)
    if (response?.error) {
        CustomError.createError({
            name: "Mostrar ticket",
            cause: getTicketError("code", tid),
            code: EErrors.INVALID_ID_TICKET_ERROR
        })
    }
    res.render("purchased", response)
}

// user Only

export const viewCart = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let response = await cart.getCartById(user.cartId)
        if (response?.error) {
            CustomError.createError({
                name: "Mostrar carrito",
                cause: getCartIdError(user.cartId),
                code: EErrors.INVALID_ID_CART_ERROR
            })
        }
        res.render("cart", response)    
    }
    catch (err) {
        res.render("error")
    }
}

export const deleteProductCartUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let cid = await cart.getCartId(user.cartId)
        let productId = parseInt(req.params.pid)
        let response = await cart.deleteProduct(cid, productId)
        if (response.error) {
            CustomError.createError({
                name: "Eliminar producto de carrito",
                cause: getCartError(cid),
                code: EErrors.INVALID_ID_CART_ERROR
            })
        }
        res.json({status: "success", payload: response})
    }
    catch (err) {
        res.json({"status": "error", "message":"Ha ocurrido un error."})
    }
}

export const addProductCartUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let cartId = await cart.getCartId(user.cartId)
        if (cartId?.error) {
            CustomError.createError({
                name: "Agregar producto a carrito",
                cause: getCartError(cartId),
                code: EErrors.INVALID_ID_CART_ERROR
            })
        }
        let productId = parseInt(req.params.pid)
        let response = await cart.addProducts(cartId, productId)
        if (response?.error) {
            CustomError.createError({
                name: "Agregar productos al carrito",
                cause: getCartError(cartId),
                code: EErrors.INVALID_ID_CART_ERROR
            })
        }
    }
    catch (err) {
        res.json({"status": "error", "message":"Ha ocurrido un error."})
    }
}

export const clearCartUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let cartId = await cart.getCartId(user.cartId)
        if (cartId?.error) {
            CustomError.createError({
                name: "Limpiar carrito",
                cause: getCartError(cartId),
                code: EErrors.INVALID_ID_CART_ERROR
            })
        }
        let response = await cart.updateCart(cartId)
        res.json({status: "success", payload: response})
    }
    catch (err) {
        res.json({"status": "error", "message":"Ha ocurrido un error."})
    }
}

export const purchaseUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let userCart = await cart.getCartById(user.cartId)
        if (userCart?.error) {
            CustomError.createError({
                name: "Procesar ticket usuario",
                cause: getCartError(user.cartId),
                code: EErrors.INVALID_ID_CART_ERROR
            })
        }
        let total = 0
        if (userCart.products.length == 0) return res.json({"status": "no items"})
        userCart.products.forEach((prod)=>{total += prod.quantity*prod.id.price})
        let response = await ticket.create(total, user.email)
        let cid = await cart.getCartId(user.cartId)
        cart.updateCart(cid)
        let email = ticketMailGenerator(response)
        if (email?.error) {
            CustomError.createError({
                name: "Envio email",
                cause: "Error al enviar el email del ticket al usuario.",
                code: EErrors.EMAIL_ERROR
            })
        }
        res.json({"status": "success", "payload": response})
    }
    catch (err) {
        res.json({"status": "error", "message":"Ha ocurrido un error."})
    }
}
