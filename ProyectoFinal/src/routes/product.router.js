import { Router } from "express";
import { deleteProduct, getProductsId, postProduct, updateProduct, showAllProducts } from "../controllers/product.controller.js";
// import { isAdmin } from "../middlewares/adminAuth.js";
import { isPremium} from "../middlewares/isPremium.js";

const router = Router()

router.get("/products", isPremium, showAllProducts)
router.post("/products", isPremium, postProduct)
router.get("/products/:pid",isPremium, getProductsId)
router.put("/products/:pid", isPremium, updateProduct)
router.delete("/products/:pid", isPremium, deleteProduct)

export default router