import { Router } from "express";
import { deleteProduct, getProductsId, postProduct, updateProduct } from "../controllers/product.controller.js";
import { isAdmin } from "../middlewares/adminAuth.js";

const router = Router()

router.get("/products/:pid", getProductsId)
router.post("/products", isAdmin, postProduct)
router.delete("/products/:pid", isAdmin, deleteProduct)
router.put("/products/:pid", isAdmin, updateProduct)

export default router