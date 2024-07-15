import { Router } from "express";
import { addCart, addProductCart, changeQuantity, clearCart, deleteCart, deleteProductCart, getViewCart, getCartId, getCarts, modifyCart, getCartfromCookie } from "../controllers/cart.controller.js";

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
router.get("/carts/:cid", getViewCart)
router.get("/cart", getCartfromCookie)


export default router