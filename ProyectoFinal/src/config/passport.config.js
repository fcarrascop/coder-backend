import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt"
import UserModel from "../dao/mongo/models/user.model.js";
import { createHash, isValidPassword, cookieExtractor, generateToken, registerValidator } from "../utils/utils.js";
import {sessionDTO, userDTO} from "../dao/DTOs/users.dto.js";
import Logger from "../utils/logger.js";
import { lastConnectionUser } from "../services/lastConnectionUsers.js";


const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt


const LocalStrategy = local.Strategy
const initializePassport = () => {
    
    passport.use("github", new GitHubStrategy({
        clientID: process.env.CLIENT_ID_GITHUB,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({email: profile._json.email})
            if (!user) {
                let response = await fetch("http://localhost:8080/api/carts", {
                    method: "POST",
                    redirect: "follow"
                })
                let id = await response.json()
                const newUser = new userDTO(profile._json.name, "", profile._json.email, 0, createHash("UnDíaViUnaVacaVestidaDeUniformeParaPoderIntegrar"), id.payload._id)
                let result = await UserModel.create(newUser)
                Logger.info("Registro exitoso")
                done(null, result)
            }
            else {
                Logger.info("Usuario no encontrado al logear con github")
                done(null, user)
            }
        }
        catch (error) {
            Logger.error("Error al iniciar con github")
            return done(error)
        }
    })
    )
    
    passport.use("register", new LocalStrategy(
        {passReqToCallback: true, usernameField: "email"}, async (req, username, password, done) => {
            const { firstName, lastName, age, email } = req.body
            if (!firstName || !lastName || !age || !email) return done(null, false, {message: "Datos insuficientes."})
            if (!registerValidator(firstName, lastName, age, email, password) ) return done(null, false, {message: "Campos inválidos."})
            try {
                let user = await UserModel.findOne({email: username})
                if (user) {
                    Logger.warning("Usuario ya existente")
                    return done(null, false, {message: "Usuario ya existe"})
                }
                let response = await fetch("http://localhost:8080/api/carts", {
                    method: "POST",
                    redirect: "follow"
                })
                let id = await response.json()
                const newUser = new userDTO(firstName, lastName, email, age, createHash(password), id.payload._id)
                let result = await UserModel.create(newUser)
                Logger.info("Registro exitoso")
                return done(null, result)
            }
            catch (error) {
                Logger.error(`Error al registrar usuario: ${error}`)
            }
        }
    ))

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try{
            let user = await UserModel.findOne({ email: username })
            if (!user) {
                Logger.warning("Usuario no encontrado al logearse")
                return done(null, false, {message: "Usuario no encontrado"})
            }
            if (!isValidPassword(user, password)) {
                Logger.warning("Contraseña inválida al logearse")
                return done(null, false)
            }
            user = new sessionDTO(user)
            let token = generateToken(user)
            lastConnectionUser(user.email)
            return done(null, token)
        }
        catch (error) {
            Logger.error(`Error al logearse: ${error}`)
        }
    }))

    passport.use("jwt",  new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_JWT
    }, async (jwt_payload, done)=> {
        try {
            return done(null, jwt_payload)
        }
        catch (error) {
            Logger.error(`Error al usar el passport jwt: ${error}`)
            done(error)
        }
    }
    ))
}

export default initializePassport
