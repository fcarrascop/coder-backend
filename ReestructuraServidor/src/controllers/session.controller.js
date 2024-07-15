import userModel from "../dao/mongo/models/user.model.js"
import cartModel from "../dao/mongo/models/cart.model.js"
import { generateToken, tokenExtractor } from "../utils.js"

export const failLogin = (req, res) => {
    res.send({ status: "error", message: "Error al iniciar sesión"})
}

export const failRegister = (req, res) => {
    res.send({ status: "error", message: "Error al registrar usuario"})
}

export const getProfile = (req, res) => {
    let user = tokenExtractor(req.signedCookies["user"])
    res.render('profile', {user})
}

export const getLogin = async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", message: "Datos incompletos"})
    try {
        res.cookie("user", req.user, {httpOnly:true, secure:true, maxAge: 86400000, signed:true})
        res.redirect("/products")
    }
    catch (error) {
        res.status(400).send({ status: "error", message: "Error al iniciar sesión"})
    }
}

export const logout = (req, res) => {
    res.clearCookie("user")
    res.redirect("/login")
}

export const githubcallback = async (req, res) => {
    let token = generateToken(req.user)
    res.cookie("user",  token, {httpOnly:true, secure:true, maxAge: 86400000, signed:true})
    res.redirect("/")
}

export const current = (req, res) => {
    res.send({status:"ok", data: req.user})
}

export const cartUserDelete = async (req, res) => {
    let token = generateToken(req.user)
    res.cookie("user",  token, {httpOnly:true, secure:true, maxAge: 86400000, signed:true})
    res.redirect("/")
}