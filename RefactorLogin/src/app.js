/* 
    Para que todo el proyecto funcione bien, tiene que descargarse todo el repositorio, iniciandolo desde la carpeta raíz, no de esta carpeta específica. O sinó genera problemas con las rutas.
*/

// Módulos
import express from "express"
import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import session from "express-session"
import MongoStore from "connect-mongo"
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
let PORT = 8080

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}, http://localhost:${PORT}`)
})

// Configuración express
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Configuración CookieParser
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Configuración handlebars
const hbs = handlebars.create({
    defaultLayout: "main",
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
})

// Configurar handlebars
app.engine("handlebars", hbs.engine)
app.set("views", __dirname+ "/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname + "/public"))

// Configuración session
app.use(session({
    store: MongoStore.create({mongoUrl: "mongodb+srv://usuariocoder123:HyNtbSyhgBgct2au@cluster0.pyamuzf.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"}),
    secret: "MakeSomethongWonderfull-Steve1994",
    resave: false,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


// Router
app.use("/", productRouter)
app.use("/", cartRouter)
app.use("/", sessionRouter)


// Conección a mongoDB -> Está disponible para 1 semana para todas ips, cualquier cosa me avisas!
mongoose.connect("mongodb+srv://usuariocoder123:HyNtbSyhgBgct2au@cluster0.pyamuzf.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>{
        console.log("Conectado a la base de datos")
    })
    .catch(error=>{
        console.error("error en la conección", error)
    })
