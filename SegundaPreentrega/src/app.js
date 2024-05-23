/* 
    Para que todo el proyecto funcione bien, tiene que descargarse todo el repositorio, iniciandolo desde la carpeta raíz, no de esta carpeta específica. O sinó genera problemas con las rutas.
*/

// Módulos
import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
// Routers
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"

// Inicializar el servidor
let app = express()
let PORT = 8080

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

// Configurar handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname+ "/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname + "/public"))

// Configuración express
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Router
app.use("/", productRouter)
app.use("/", cartRouter)


// Conección a mongoDB -> Está disponible para 1 semana para todas ips, cualquier cosa me avisas!
mongoose.connect("mongodb+srv://usuariocoder123:HyNtbSyhgBgct2au@cluster0.pyamuzf.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>{
        console.log("Conectado a la base de datos")
    })
    .catch(error=>{
        console.error("error en la conección", error)
    })
