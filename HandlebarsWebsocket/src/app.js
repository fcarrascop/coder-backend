import express from "express"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import productsRouter from "./routes/views.router.js"
import ProductManager from "./ProductManager.js"

const PORT = 8080
const app = express()
const httpServer = app.listen(PORT, ()=>console.log(`Server running on ${PORT}`)) 
const socketServer = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+ "/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname + "/public"))

let pm = new ProductManager()

app.use("/", productsRouter)


socketServer.on("connection", (socket)=>{
    console.log(`New connection`)
    socket.on("product", (data)=>{
        let message = pm.addProduct(data)
        if (message.error) {
            socket.emit("error", {"error": message.error})
        }
        else {
            let productList = pm.getProducts()
            socket.emit("productList", productList)
        }
        
    })


    socket.on("delete", (data)=>{
        let id = data.id
        pm.deleteProduct(id)
        let productList = pm.getProducts()
        socket.emit("productList", productList)
        
    })

})
