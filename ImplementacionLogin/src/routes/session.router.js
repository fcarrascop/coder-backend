import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middlewares/auth.js";
import UserModel from "../model/user.model.js";

const router = Router();

// Get mode
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login')
})

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register')
})

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user })
})

// Post mode

router.post("/register", async (req,res)=>{
    const { firstName, lastName, email, age, password } = req.body
    try {
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            age: age,
            password: password
        }
        let response = await UserModel.create(user)
        res.redirect("/login")
    }
    catch (error) {
        console.error(error)
    }
})

router.post("/login", async (req,res)=>{
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({email: email})
        if (!user){
            return res.status(404).send("Usuario no encontrado")
        }
        else {
            req.session.user = user
            res.redirect("/products")
        }
        

    }
    catch (error) {
        console.error(error)
    }
})

router.post("/logout", (req,res)=>{
    req.session.destroy((err)=>{
        if (err) return res.status(500).send("Error al cerrar sesión")
    })
    res.redirect("/login")
})

export default router