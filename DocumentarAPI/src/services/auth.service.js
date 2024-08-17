import tokenModel from "../dao/mongo/models/token.model.js"
import User from "../dao/mongo/models/user.model.js"
import { createHash } from "../utils/utils.js"
import Logger from "../utils/logger.js"

export const createTokenRecovery = async (email) => {
    let token = createHash(email + `${new Date()}${Math.random()}`).replace("/", "").replace("$", "").replace(".", "")
    let ticket = await tokenModel.create({
        token: token,
        email: email
    })
    return { status: "success", payload: ticket.token }
}

export const validateTokenRecovery = async (token) => {
    let ticket = await tokenModel.findOne({token: token})
    if (!ticket) {
        Logger.warning("Token expirado o no encontrado")
        return {error: "Token expirado o no encontrado"}
    }
    let user = await User.findOne({email: ticket.email})
    if (user.length == 0) {
        Logger.warning("Usuario no encontrado")
        return ({error: "Usuario no encontrado"})
    }
    return {status: "success", payload: user}
}
