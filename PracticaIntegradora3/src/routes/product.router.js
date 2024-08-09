import { Router } from "express";
import { deleteProduct, getProductsId, postProduct, updateProduct, showAllProducts } from "../controllers/product.controller.js";
// import { isAdmin } from "../middlewares/adminAuth.js";
import { isPremium} from "../middlewares/isPremium.js";

const router = Router()

router.get("/products/:pid", getProductsId)
router.post("/products", isPremium, postProduct)
router.delete("/products/:pid", isPremium, deleteProduct)
router.put("/products/:pid", isPremium, updateProduct)
router.get("/getProducts", isPremium, showAllProducts)

export default router