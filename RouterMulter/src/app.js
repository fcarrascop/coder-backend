const express = require("express")
const app = express()
const PORT = 8080

const ProductsRouter = require("./routes/products.router.js")
const CartRouter = require("./routes/carts.router.js")

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/", ProductsRouter)
app.use("/api/", CartRouter)

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})