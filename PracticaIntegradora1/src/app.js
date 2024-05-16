import express from "express"
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"
import mongoose from "mongoose"

let app = express()
let PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

app.use("/", productRouter)
app.use("/", cartRouter)

mongoose.connect("mongodb+srv://usuariocoder123:HyNtbSyhgBgct2au@cluster0.pyamuzf.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>{
        console.log("Conectado a la base de datos")
    })
    .catch(error=>{
        console.error("error en la conección", error)
    })