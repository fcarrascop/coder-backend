import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt"
import UserModel from "../dao/mongo/models/user.model.js";
import { createHash, isValidPassword, cookieExtractor, generateToken, registerValidator } from "../utils.js";
import {sessionDTO, userDTO} from "../dao/DTOs/users.dto.js";


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
                const newUser = new userDTO(profile._json.name, "", profile._json.email, 0, createHash("UnDíaViUnaVacaVestidaDeUniformeParaPoderIntegrar", id.payload._id))
                let result = await UserModel.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        }
        catch (error) {
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
                    return done(null, false, {message: "Usuario ya existe"})
                }
                let response = await fetch("http://localhost:8080/api/carts", {
                    method: "POST",
                    redirect: "follow"
                })
                let id = await response.json()
                const newUser = new userDTO(firstName, lastName, email, age, createHash(password), id.payload._id)
                let result = await UserModel.create(newUser)
                return done(null, result)
            }
            catch (error) {
                console.log(error)
            }
        }
    ))

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try{
            let user = await UserModel.findOne({ email: username })
            if (!user) {
                return done(null, false, {message: "Usuario no encontrado"})
            }
            if (!isValidPassword(user, password)) return done(null, false)
            user = new sessionDTO(user)
            let token = generateToken(user)
            return done(null, token)
        }
        catch (error) {
            console.log(error)
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
            done(error)
        }
    }
    ))
}

export default initializePassport
