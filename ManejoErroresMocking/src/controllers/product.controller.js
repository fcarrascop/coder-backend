import ProductManager from "../dao/mongo/classes/ProductManager.js";
import CartManager from "../dao/mongo/classes/CartManager.js";
import { tokenExtractor } from "../utils.js";
import { productCodeError, productInfoError, productsCartError } from "../services/infoError.js";
import CustomError from "../services/CustomError.js"
import EErrors from "../services/enum.js"
import productDTO from "../dao/DTOs/products.dto.js";

let cart = new CartManager()
let product = new ProductManager()

export const toProducts = (req, res) => {
    res.redirect("/products")
}

export const getProductsId = async (req, res) => {
    let pid = parseInt(req.params.pid);
    let list = await product.getProductsById(pid);
    if (list?.error) {
        CustomError.createError({
            name: "Obtener id del producto",
            cause: productsCartError(pid),
            code: EErrors.INVALID_ID_PRODUCT_ERROR
        })
    }
    res.json({status: "success", payload: list});
}

export const postProduct = async (req, res) => {
    let { title, description, price, thumbnail = "Sin imagen", code, stock, status = true, category } = req.body
    if (!title || !description || !price || !code || !stock || !category) {
        CustomError.createError({
            name: "Crear producto",
            cause: productInfoError(title, description, price, code, stock, category),
            code: EErrors.INVALID_TYPES_ERROR
        })
    }
    let newProduct = new productDTO(title, description, price, thumbnail, code, stock, status, category)
    let send = await product.addProduct(newProduct)
    if (send?.error) {
        CustomError.createError({
            name: "Crear producto",
            cause: productCodeError(code),
            code: EErrors.EXISTING_CODE_ERROR
        })
    }
    res.json({ status: "success", payload: send})
}

export const deleteProduct = async (req, res) => {
    let id = parseInt(req.params.pid)
    let prodDelete = await product.deleteProduct(id)
    res.json({status: "success", payload: prodDelete})
}

export const updateProduct = async (req, res) => {
    let id = parseInt(req.params.pid)
    let prod = req.body
    let prodUpdate = await product.updateProduct(id, prod)
    if (prodUpdate?.error) {
        CustomError.createError({
            name: "Actualizar producto",
            cause: productsCartError(id),
            code: EErrors.INVALID_ID_PRODUCT_ERROR
        })
    }
    res.json({status: "success", payload: prodUpdate})
}

export const showProducts = async (req, res) => {
    let page = parseInt(req.query.page)
    if (!page) {page = 1}
    let result = await product.getProducts({"page": page})
    let user = tokenExtractor(req.signedCookies["user"])
    if (user) {
        CustomError.createError({
            name: "Mostrar productos",
            cause: "Error al extraer la cookie",
            code: EErrors.COOKIE_NOT_FOUND_ERROR
        })
    }
    let id = user ? await cart.getCartId(user.cartId) : null;
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
    res.render("products", {"result": result, "user": user?.firstName, "role": user?.role, "cartId": id})
}