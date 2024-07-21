import { Router } from "express";
import { addCart, addProductCart, changeQuantity, clearCart, deleteCart, deleteProductCart, getCartId, getCarts, modifyCart, purchase, deleteProductCartUser, addProductCartUser, clearCartUser, purchaseUser } from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/adminAuth.js";

const router = Router()

// Se requiren permisos para acceder
router.post("/api/carts", isAdmin, addCart)
router.get("/api/carts", isAdmin, getCarts)
router.get("/api/carts/:cid", isAdmin, getCartId)
router.post("/api/carts/:cid/products/:pid", isAdmin, addProductCart) // *
router.delete("/api/carts/:cid/products/:pid", isAdmin, deleteProductCart) // *
router.put("/api/carts/:cid", isAdmin, modifyCart)
router.put("/api/carts/:cid/products/:pid", isAdmin, changeQuantity)
router.delete("/api/carts/:cid", isAdmin, clearCart) // *
router.delete("/carts/:cid", isAdmin, deleteCart)
router.post("/api/cart/:cid/purchase", isAdmin, purchase) // *

// No se requiren permisos para acceder

router.post("/api/cart/products/:pid", isAuthenticated, addProductCartUser)
router.put("/api/cart", isAuthenticated, clearCartUser)
router.delete("/api/cart/products/:pid", isAuthenticated, deleteProductCartUser)
router.post("/api/cart/purchase", isAuthenticated, purchaseUser)


export default router