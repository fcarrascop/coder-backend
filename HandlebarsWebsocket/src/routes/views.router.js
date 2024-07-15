import express from "express"
import ProductManager from "../ProductManager.js";
const router = express.Router()



router.get("/", (req,res)=>{
    res.render("home", {list})
})

router.get("/realtimeproducts", (req,res)=>{
    let products = new ProductManager();
    let list = products.getProducts()
    res.render("realTimeProducts", {list})
})

export default router