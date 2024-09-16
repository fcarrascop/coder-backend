import { Router } from "express";
import { addCart, addProductCart, changeQuantity, clearCart, deleteCart, deleteProductCart, getCartId, getCarts, modifyCart, purchase, deleteProductCartUser, addProductCartUser, clearCartUser, purchaseUser } from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/adminAuth.js";

const router = Router()

// Se requiren permisos para acceder
router.get("/api/carts", isAdmin, getCarts)
router.post("/api/carts", addCart)
router.get("/api/carts/:cid", isAdmin, getCartId)
router.put("/api/carts/:cid", isAdmin, modifyCart)
router.delete("/api/carts/:cid", isAdmin, clearCart)
router.post("/api/carts/:cid/purchase", isAdmin, purchase) 
router.post("/api/carts/:cid/products/:pid", isAdmin, addProductCart)
router.put("/api/carts/:cid/products/:pid", isAdmin, changeQuantity)
router.delete("/api/carts/:cid/products/:pid", isAdmin, deleteProductCart)
router.delete("api/carts/delete/:cid", isAdmin, deleteCart)

// No se requiren permisos para acceder

router.put("/api/cart", isAuthenticated, clearCartUser)
router.post("/api/cart/products/:pid", isAuthenticated, addProductCartUser)
router.delete("/api/cart/products/:pid", isAuthenticated, deleteProductCartUser)
router.post("/api/cart/purchase", isAuthenticated, purchaseUser)


export default router