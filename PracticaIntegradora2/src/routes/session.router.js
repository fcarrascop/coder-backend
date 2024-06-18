import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middlewares/auth.js";
import passport from "passport";
import { generateToken, tokenExtractor } from "../utils.js";

const router = Router();

// Views
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login')
})

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register')
})

router.get('/profile', isAuthenticated, (req, res) => {
    let user = tokenExtractor(req.signedCookies["user"])
    res.render('profile', {user})
})

// Api 

// Register
router.post("/register", passport.authenticate("register", { failureRedirect: "failregister", session:false}), async (req, res) => {res.redirect("/login")})

router.get("/failregister", (req, res) => {res.send({ status: "error", message: "Error al registrar usuario"})})

// Login
router.post("/login", passport.authenticate("login", { failureRedirect: "faillogin", session:false}), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", message: "Datos incompletos"})
    try {
        res.cookie("user", req.user, {httpOnly:true, secure:true, maxAge: 86400000, signed:true})
        res.redirect("/products")
    }
    catch (error) {
        res.status(400).send({ status: "error", message: "Error al iniciar sesión"})
    }
})

router.get("/faillogin", (req, res) => {res.send({ status: "error", message: "Error al iniciar sesión"})})

// Logout

router.post("/logout", (req, res) => {
    res.clearCookie("user")
    res.redirect("/login")
})

// GitHub
router.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{
})

router.get("/api/githubcallback", passport.authenticate("github",{failureRedirect:"/", session:false}), async(req,res)=>{
    let token = generateToken(req.user)
    res.cookie("user",  token, {httpOnly:true, secure:true, maxAge: 86400000, signed:true})
    res.redirect("/")
})

// Current
router.get("/current", passport.authenticate("jwt", {session:false}), async (req,res)=>{
    res.send({status:"ok", data: req.user})
})

/* router.get("*", (req,res)=>{
    res.status(404).send({message: "Página no encontrada."})
}) */

export default router