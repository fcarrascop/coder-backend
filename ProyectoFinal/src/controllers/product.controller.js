import ProductManager from "../dao/mongo/classes/ProductManager.js";
import CartManager from "../dao/mongo/classes/CartManager.js";
import { tokenExtractor, dataExtractor } from "../utils/utils.js";
import { productInfoError } from "../services/infoError.js";
import CustomError from "../services/CustomError.js"
import EErrors from "../services/enum.js"
import productDTO from "../dao/DTOs/products.dto.js";
import { deleteProductEmail } from "../services/mail.service.js";

let cart = new CartManager()
let product = new ProductManager()

export const toProducts = (req, res) => {
    res.redirect("/home")
}

export const getProductsId = async (req, res) => {
    let pid = parseInt(req.params.pid);
    let list = await product.getProductsById(pid);
    if (list?.error) {
        req.logger.warning(`Error al obtener el producto`)
        res.status(404).json({status: "error", "error": list?.error})
    }
    res.json({status: "success", payload: list});
}

export const postProduct = async (req, res) => {
    let { title, description, price, thumbnail = "Sin imagen", code, stock, status = true, category } = req.body
    if (!title || !description || !price || !code || !stock || !category) {
        req.logger.warning(`Error al crear el producto: ${productInfoError()}`)
        res.status(400).json({status: "error", "error": "Información incompleta"})
    }
    let user = dataExtractor(req)
    let newProduct = new productDTO(title, description, price, thumbnail, code, stock, status, category)
    let send = await product.addProduct(newProduct, user)
    if (send?.error) {
        req.logger.error("Error al crear el producto: Código de producto ya existente")
        res.status(422).json({status: "error", "error": send.error})
    }
    res.json({ status: "success", payload: send})
}

export const deleteProduct = async (req, res) => {
    let id = parseInt(req.params.pid)
    let user = dataExtractor(req)
    let validateProduct = await product.getProductsById(id)
    if (validateProduct?.error) {
        req.logger.error(`Error al obtener el producto: ${validateProduct.error}`)
        res.status(404).json({status: "error", "error": validateProduct.error})
    }
    if (!((validateProduct.owner === user.email) || (user.role === "admin"))) return res.json({status: "error", "error": "Usuario no autorizado"})
    if (validateProduct.owner !== "admin" ) {
        let deleteEmail = await deleteProductEmail(validateProduct.owner, validateProduct)
    }
    let prodDelete = await product.deleteProduct(id)
    res.json({status: "success", payload: prodDelete})
}

export const updateProduct = async (req, res) => {
    let id = parseInt(req.params.pid)
    let prod = req.body
    let user = dataExtractor(req)
    let validateProduct = await product.getProductsById(id)
    if (validateProduct?.error) {
        req.logger.error(`Error al obtener el producto: ${validateProduct.error}`)
        res.status(404).json({status: "error", "error": validateProduct.error})
    }
    if (!((validateProduct.owner === user.email) || (user.role === "admin"))) return res.json({status: "error", "error": "Usuario no autorizado"})
    let prodUpdate = await product.updateProduct(id, prod)
    if (prodUpdate?.error) {
        req.logger.error(`Error al actualizar el producto: ${prodUpdate.error}`)
        res.status(400).json({status: "error", "error": prodUpdate.error})
    }
    res.json({status: "success", payload: {message: "Producto actualizado", product: prodUpdate}})
}

export const showProducts = async (req, res) => {
    let page = parseInt(req.query.page)
    if (!page) {page = 1}
    let result = await product.getProducts({"page": page})
    let user = tokenExtractor(req.signedCookies["user"])
    if (!user) {
        req.logge.fatal("Error al extraer la cookie")
        CustomError.createError({
            name: "Mostrar productos",
            cause: "Error al extraer la cookie",
            code: EErrors.COOKIE_NOT_FOUND_ERROR
        })
    }
    let id = user ? await cart.getCartId(user.cartId) : null;
    if (id === null) {req.logger.warning("Id de carrito no encontrado")}
    result.prevLink = result.hasPrevPage ? `${process.env.BASE_URL}/home?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `${process.env.BASE_URL}/home?page=${result.nextPage}` : '';
    res.render("products", {"result": result, "user": user?.firstName, "role": user?.role, "cartId": id, "isAdmin": (user?.role === "admin") ? true :  false})
}

export const showAllProducts = async (req, res) => {
    let result = await product.getAllProducts({})
    res.json({status: "success", payload: result})
}
