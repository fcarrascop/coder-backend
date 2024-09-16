import CartManager from "../dao/mongo/classes/CartManager.js";
import productModel from "../dao/mongo/models/product.model.js";
import TicketManager from "../dao/mongo/classes/TicketsManager.js";
import { tokenExtractor, dataExtractor} from "../utils/utils.js";
import { ticketGenerator } from "../services/mail.service.js";
import CustomError from "../services/CustomError.js"
import EErrors from "../services/enum.js"
import { getCartIdError } from "../services/infoError.js";

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
        req.logger.error(`Error al crear un nuevo carrito: Producto con id ${response.error} no se pudo encontrar`)
        res.status(404).json({status: "error", "error": response?.error})
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
        req.logger.warning(`Error al obtener el carrito: Carrito con id ${id} no encontrado.`)
        res.status(404).json({status: "error", "error": response?.error})
    }
    res.json({status: "success", payload: response})
}

export const addProductCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    let response = await cart.addProducts(cartId, productId)
    if (response?.error) {
        req.logger.warning(`Error al agregar el producto al carrito: ${response.error}`)
        res.status(404).json({status: "error", "error": response?.error})
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
    if (response?.error) {
        req.logger.warning(`Error al eliminar el producto del carrito: ${response.error}`)
        res.status(404).json({status: "error", "error": response?.error})
    }
    res.json({status: "success", payload: response})
}

export const modifyCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let products = req.body
    let response = await cart.updateCart(cartId, products)
    if (response?.error) {
        req.logger.warning(`Error al modificar el carrito: ${response.error}`)
        res.status(404).json({status: "error", "error": response?.error})
    }
    res.json({status: "success", payload:response})
}

export const changeQuantity = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let itemId = parseInt(req.params.pid)
    let { quantity } = req.body
    let response = await cart.updateProductQuantity(cartId, itemId, quantity)
    if (response?.error) {
        req.logger.warning(`Error al modificar el producto del carrito: ${response.error}`)
        res.status(404).json({status: "error", "error": response?.error})
    }
    else {
        res.json({status: "success", payload: response})
    }
}

export const clearCart = async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let response = await cart.updateCart(cartId)
    res.json({status: "success", payload:"Carrito vaciado"})
}

export const purchase = async (req, res) => {
    let cid = req.params.cid
    let user = tokenExtractor(req.signedCookies["user"])
    let userCart = await cart.getCart(cid)
    if (userCart?.error) {
        req.logger.error(`Error al realizar la compra: ${userCart.error}`)
        res.status(404).json({status: "error", "error": userCart.error})
    }
    let total = 0
    if (userCart.products.length == 0) return res.json({"status": "error", "message": "No items"})
    userCart.products.forEach((prod)=>{total += prod.quantity*prod.id.price})
    let response = await ticket.create(total, user.email)
    cart.updateCart(cid)
    let email = ticketGenerator(response)
    if (email?.error) {
        req.logger.error(`Error al enviar el email de compra a ${user.email}: ${email.error}`)
        res.status(404).json({status: "error", "error": email.error})
    }
    res.json({"status": "success", "payload": response})
}

export const purchased = async (req, res) => {
    let tid = req.params.tid
    let response = await ticket.findByCode(tid)
    if (response?.error) {
        req.logger.error(`Error al buscar ticket: ${response.error}`)
        res.status(404).json({status: "error", "error": response.error})
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
        req.logger.error("Error al mostrar el carrito.")
        res.render("error")
    }
}

export const deleteProductCartUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let cid = await cart.getCartId(user.cartId)
        let productId = parseInt(req.params.pid)
        let response = await cart.deleteProduct(cid, productId)
        if (response?.error) {
            req.logger.error(`Error al eliminar el producto del carrito: ${response.error}`)
            res.json({"status": "error", "error":response.error})
        }
        res.json({status: "success", payload: response})
    }
    catch (err) {
        req.logger.error(`Error al eliminar el producto del carrito: ${err}`)
        res.status(500).json({"status": "error", "error":"Ha ocurrido un error."})
    }
}

export const addProductCartUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let cartId = await cart.getCartId(user.cartId)
        if (cartId?.error) {
            req.logger.error("Error al agregar el producto al carrito del usuario")
            res.status(404).json({"status": "error", "error":cartId.error})

        }
        let productId = parseInt(req.params.pid)
        let product = await productModel.findOne({id: productId})
        if (!product) return res.json({"status": "error", "error": "Producto no encontrado"})
        if (product.owner === user.email) return res.status(401).json({"status": "error", "error": "No puedes comprar tus propios productos"})
        let response = await cart.addProducts(cartId, productId)
        if (response?.error) {
            req.logger.error("Error al agregar el producto al carrito del usuario")
            res.json({"status": "error", "error": response.error})
        }
        req.logger.info("Producto agregado")
        res.json({status: "success", payload: response})
    }
    catch (err) {
        req.logger.error("Error al agregar el producto al carrito del usuario")
        res.status(500).json({"status": "error", "error":"Ha ocurrido un error."})
    }
}

export const clearCartUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let cartId = await cart.getCartId(user.cartId)
        if (cartId?.error) {
            req.logger.error("Error al vaciar el carrito del usuario")
            res.status(404).json({"status": "error", "error": cartId.error})
        }
        let response = await cart.updateCart(cartId)
        res.json({status: "success", payload: "Carrito vaciado"})
    }
    catch (err) {
        req.logger.error("Error al vaciar el carrito del usuario")
        res.status(500).json({"status": "error", "error":`Ha ocurrido un error: ${err}`})
    }
}

export const purchaseUser = async (req, res) => {
    try {
        let user = dataExtractor(req)
        let userCart = await cart.getCartById(user.cartId)
        if (userCart?.error) {
            req.logger.error("Error al agregar obtener el carrito del usuario")
            res.status(404).json({"status": "error", "error": userCart.error})
        }
        let total = 0
        if (!userCart.products || userCart.products.length === 0) return res.status(400).json({"status": "no items"})
        userCart.products.forEach((prod)=>{total += prod.quantity*prod.id.price})
        let response = await ticket.create(total, user.email)
        let cid = await cart.getCartId(user.cartId)
        cart.updateCart(cid)
        let email = ticketGenerator(response)
        if (email?.error) {
            req.logger.error(`Error al enviar el email de compra a ${user.email}: ${email.error}`)
            res.status(500).json({status: "error", "error": email.error})
        }
        res.json({"status": "success", "payload": response})
    }
    catch (err) {
        res.status(500).json({"status": "error", "error":"Ha ocurrido un error."})
    }
}
