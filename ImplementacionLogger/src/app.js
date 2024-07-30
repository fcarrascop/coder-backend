// Módulos
import express from "express"
import { __dirname } from "./utils/utils.js"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import { configWebSocket } from "./config/websocket.config.js"

// Routers
import errorHandler from "./middlewares/error.js"
import addLogger from "./middlewares/logger.js"
import productRouter from "./routes/product.router.js"
import cartRouter from "./routes/cart.router.js"
import sessionRouter from "./routes/session.router.js"
import chatRouter from "./routes/chat.router.js"
import viewRouter from "./routes/views.router.js"
import mockRouter from "./routes/mocking.router.js"
import loggerRouter from "./routes/logger.router.js"

// Inicializar el servidor
let app = express()
let PORT = process.env.PORT

let httpServer = app.listen(PORT, () => {
    console.log(`Server running on ${PORT}, http://localhost:${PORT}`)
})

const socketServer = configWebSocket(httpServer)

// Configuración express
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Configuración CookieParser
app.use(cookieParser(process.env.SECRET_COOKIE))

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
        },
        isTotalZero: function(total) {
            return total === 0
        }
    }
})

// Configurar handlebars
app.engine("handlebars", hbs.engine)
app.set("views", __dirname+ "/../views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname + "/../public"))

initializePassport()
app.use(passport.initialize())

// Router
app.use(errorHandler)
app.use(addLogger)
app.use("/", productRouter)
app.use("/", cartRouter)
app.use("/", sessionRouter)
app.use("/", chatRouter)
app.use("/", viewRouter)
app.use("/", mockRouter)
app.use("/", loggerRouter)

mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Conectado a la base de datos")
    })
    .catch(error=>{
        console.error("error en la conección", error)
    })