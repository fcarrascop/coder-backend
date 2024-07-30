import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middlewares/auth.js";
import passport from "passport";

import { cartUserDelete, current, failLogin, failRegister, getLogin, getProfile, githubcallback, logout, token } from "../controllers/session.controller.js";

const router = Router();

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login')
})
router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register')
})
router.get('/profile', isAuthenticated, getProfile)

router.post("/register", passport.authenticate("register", { failureRedirect: "failregister", session:false}), async (req, res) => {res.redirect("/login")})
router.get("/failregister", failRegister)
router.post("/login", passport.authenticate("login", { failureRedirect: "faillogin", session:false}), getLogin)
router.get("/faillogin", failLogin)
router.post("/logout", logout)
router.get("/github", passport.authenticate("github",{scope:["user:email"]}),async(req,res)=>{})
router.get("/api/githubcallback", passport.authenticate("github",{failureRedirect:"/", session:false}), githubcallback)

router.get("/current", passport.authenticate("jwt", {session:false}), current)

// Solo de prueba, para no perder tiempo
router.delete("/api/delete/:uid", cartUserDelete)
router.get("/token", token)

export default router