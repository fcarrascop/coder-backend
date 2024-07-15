import { Router } from "express";
import { addCart, addProductCart, changeQuantity, clearCart, deleteCart, deleteProductCart, getViewCart, getCartId, getCarts, modifyCart, getCartfromCookie, purchase, purchased } from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router()

router.post("/api/carts", addCart)
router.get("/api/carts", getCarts)
router.get("/api/carts/:cid", getCartId)
router.post("/api/carts/:cid/products/:pid", addProductCart)
router.delete("/carts/:cid", deleteCart)
router.delete("/api/carts/:cid/products/:pid", deleteProductCart)
router.put("/api/carts/:cid", modifyCart)
router.put("/api/carts/:cid/products/:pid", changeQuantity)
router.delete("/api/carts/:cid", clearCart)
router.get("/carts/:cid", isAuthenticated, getViewCart)
router.get("/cart", isAuthenticated, getCartfromCookie)
router.post("/cart/:cid/purchase",  purchase)
router.get("/cart/purchased/:tid", isAuthenticated, purchased)


export default router