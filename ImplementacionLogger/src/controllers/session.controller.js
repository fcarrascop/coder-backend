import userModel from "../dao/mongo/models/user.model.js"
import { generateToken, tokenExtractor } from "../utils/utils.js"
import { currentDTO, sessionDTO } from "../dao/DTOs/users.dto.js"

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
    let user = new sessionDTO(req.user)
    let token = generateToken(user)
    res.cookie("user",  token, {httpOnly:true, secure:true, maxAge: 86400000, signed:true})
    res.redirect("/")
}

export const current = (req, res) => {
    let user = new currentDTO(req.user)
    res.send({status:"ok", data: user})
}

// Routes de prueba, para hacer testing más rápido.

export const cartUserDelete = async (req, res) => {
    let uid = req.params.uid
    let user = await userModel.findOne({ _id: uid })
    let cartId = user.cartId
    res.json({status: "success", message: "Listo"})
}

export const token = async (req, res) => {
    let email = process.env.ADMIN_EMAIL
    let user = await userModel.findOne({email: email})
    let token = generateToken(user)
    res.cookie("user",  token, {httpOnly:true, secure:true, maxAge: 86400000, signed:true})
    res.send({"message": "done"})
}
