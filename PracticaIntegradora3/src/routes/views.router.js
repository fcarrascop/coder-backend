import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
// Products 
import { showProducts, toProducts } from "../controllers/product.controller.js";
// Carts
import { purchased, viewCart } from "../controllers/cart.controller.js";
// Chats
import { chat } from "../controllers/chat.controller.js";

const router = Router();

// Products
router.get("/", isAuthenticated, toProducts)
router.get("/products", isAuthenticated, showProducts)

// Carts
router.get("/cart", isAuthenticated, viewCart)
router.get("/cart/purchased/:tid", isAuthenticated, purchased)

// Chats
router.get("/chat", isAuthenticated, chat)

export default router