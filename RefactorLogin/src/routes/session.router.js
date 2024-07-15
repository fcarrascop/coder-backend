import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middlewares/auth.js";
import passport from "passport";

const router = Router();

// Views
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login')
})

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register')
})

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user })
})

// Register
router.post("/register", passport.authenticate("register", { failureRedirect: "failregister"}), async (req, res) => {res.redirect("/login")})

router.get("/failregister", (req, res) => {res.send({ status: "error", message: "Error al registrar usuario"})})

// Login
router.post("/login", passport.authenticate("login", { failureRedirect: "faillogin"}), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", message: "Datos incompletos"})
        try {
    req.session.user = {
        firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            age: req.user.age,
            edit: req.user.edit
        }
        res.redirect("/products")
    }
    catch (error) {
        res.status(400).send({ status: "error", message: "Error al iniciar sesión"})
    }
})

router.get("/faillogin", (req, res) => {res.send({ status: "error", message: "Error al iniciar sesión"})})

// Logout

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send("Error al cerrar sesión")
            res.redirect("/login")
    })
})

// GitHub
router.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{
    console.log("GitHub")
})

router.get("/api/githubcallback", passport.authenticate("github",{failureRedirect:"/login"}), async(req,res)=>{
    req.session.user = req.user
    res.redirect("/")
})

export default router