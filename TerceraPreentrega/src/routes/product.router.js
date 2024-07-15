import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { deleteProduct, getProductsId, postProduct, showProducts, toProducts, updateProduct } from "../controllers/product.controller.js";

const router = Router()

router.get("/", isAuthenticated, toProducts)
router.get("/products/:pid", getProductsId)
router.post("/products", postProduct)
router.delete("/products/:pid", deleteProduct)
router.put("/products/:pid", updateProduct)
router.get("/products", isAuthenticated, showProducts)

export default router