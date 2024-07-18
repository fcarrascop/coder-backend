import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { deleteProduct, getProductsId, postProduct, showProducts, toProducts, updateProduct } from "../controllers/product.controller.js";
import { isAdmin } from "../middlewares/adminAuth.js";

const router = Router()

router.get("/products/:pid", getProductsId)
router.post("/products", isAdmin, postProduct)
router.delete("/products/:pid", isAdmin, deleteProduct)
router.put("/products/:pid", isAdmin, updateProduct)
// router.get("/", isAuthenticated, toProducts)
// router.get("/products", isAuthenticated, showProducts)

export default router