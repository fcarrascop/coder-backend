import userModel from "../dao/mongo/models/user.model.js"
import { generateToken, tokenExtractor, createHash, dataExtractor, isValidPassword } from "../utils/utils.js"
import { currentDTO, sessionDTO } from "../dao/DTOs/users.dto.js"
import { createTokenRecovery, validateTokenRecovery } from "../services/auth.service.js"
import { recoveryEmail } from "../services/mail.service.js"
import {lastConnectionUser} from "../services/lastConnectionUsers.js"

export const failLogin = (req, res) => {
    res.status(400).send({ status: "error", message: "Error al iniciar sesión"})
}

export const failRegister = (req, res) => {
    res.status(400).send({ status: "error", message: "Error al registrar usuario"})
}

export const getProfile = (req, res) => {
    let user = tokenExtractor(req.signedCookies["user"])
    res.render('profile', {user})
}

export const getLogin = async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", message: "Datos incompletos"})
    try {
        res.cookie("user", req.user, {httpOnly:true, secure:true, maxAge: 86400000, signed:true})
        
        res.redirect("/home")
    }
    catch (error) {
        res.status(400).send({ status: "error", message: "Error al iniciar sesión"})
    }
}

export const logout = async (req, res) => {
    let user = dataExtractor(req)
    lastConnectionUser(user.email)
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
    res.status(200).send({status:"ok", data: user})
}

// Routes de prueba, para hacer testing más rápido.

/* export const cartUserDelete = async (req, res) => {
    let uid = req.params.uid
    let user = await userModel.findOne({ _id: uid })
    let cartId = user.cartId
    res.json({status: "success", message: "Listo"})
    // ????????????????????????????
}

export const token = async (req, res) => {
    // Prueba, para hacer testing más rápido.
    let { email } = req.body
    let user = await userModel.findOne({email: email})
    let token = generateToken(user)
    res.cookie("user",  token, {httpOnly:true, secure:true, maxAge: 86400000, signed:true})
    res.send({"message": "done"})
} */


/* --------------------------------------------------------------------- */
// Rutas de recuperación de contraseña
export const passwordRecoveryView = (req, res) => {
    res.render('passwordRecovery')
}

// Ruta donde se envía el email de recuperación con el link
export const passwordRecoveryLink = async (req, res) => {
    let { email } = req.body
    let user = await userModel.findOne({email: email})
    if (!user) return res.json({status: "error", message: "Usuario no encotrado"})
    let token = await createTokenRecovery(user.email)
    let link = `http://localhost:${process.env.PORT}/passwordRecoveryChange/${token.payload}`
    await recoveryEmail(user, link)
    res.render('passwordRecoverySend', {user})
}

// Ruta donde se llega con el token y procede a cambiar de contraseña
export const passwordRecoveryChangeView = async (req, res) => {
    let token = req.params.passToken
    res.cookie("token", token, {httpOnly:true, secure:true, maxAge: 600000, signed:true})
    res.render('passwordRecoveryChange')
}

export const passwordRecoveryChange = async (req, res) => {
    let token = req.signedCookies["token"]
    let response = await validateTokenRecovery(token)
    if (response?.error) return res.json({status: "error", error: response.error})
    let user = response.payload
    let { newPassword } = req.body
    let password = createHash(newPassword)
    user.password = password
    await userModel.updateOne({email: user.email}, user)
    res.redirect("/login")
}

export const passwordChange = async (req, res) => {
    let userData = dataExtractor(req)
    let { newPassword } = req.body
    let user = await userModel.findOne({email: userData.email})
    if (user?.length === 0) return res.json({status: "error", error: "Usuario no encontrado"})
    if (isValidPassword(user, newPassword)) return res.json({status: "error", error: "Contraseñas iguales"})
    user.password = createHash(newPassword)
    await userModel.updateOne({email: userData.email}, user)
    res.status(200).json({status: "success", message: "Contraseña cambiada"})
}