// Módulos
import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import passport from "passport"
import bodyParser from "body-parser"
import initializePassport from "./config/passport.config.js"
// Routers
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"
import sessionRouter from "./routes/session.router.js"

// Inicializar el servidor
let app = express()
let PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}, http://localhost:${PORT}`)
})

// Configuración express
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Configuración CookieParser
app.use(cookieParser(process.env.SECRET_COOKIE))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Configuración handlebars
const hbs = handlebars.create({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers: {
        multiply: function(a, b) { return a * b },
        sumTotals: function(products) {
            return products.reduce((total, product)=> total + (product.id.price * product.quantity),0)
        }
    }
})

// Configurar handlebars
app.engine("handlebars", hbs.engine)
app.set("views", __dirname+ "/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname + "/public"))

initializePassport()
app.use(passport.initialize())

// Router
app.use("/", productRouter)
app.use("/", cartRouter)
app.use("/", sessionRouter)

mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Conectado a la base de datos")
    })
    .catch(error=>{
        console.error("error en la conección", error)
    })
