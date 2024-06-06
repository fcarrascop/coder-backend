import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import UserModel from "../model/user.model.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy
const initializePassport = () => {
    
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liy6fkuJqoIo47IC",
        clientSecret: "a39ff5c78d37c53d374abae9f98fb50381e77190",
        callbackURL: "http://localhost:8080/api/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({email: profile._json.email})
            if (!user) {
                const newUser = {
                    firstName: profile._json.name,
                    lastName: "",
                    email: profile._json.email,
                    age: 0,
                    password: ""
                }
                result = await UserModel.create(newUser)
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
            try {
                let user = await UserModel.findOne({email: username})
                if (user) {
                    console.log("Usuario ya existe")
                    return done(null, false, {message: "Usuario ya existe"})
                }
                const newUser = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    age: age,
                    password: createHash(password)
                }
                let result = await UserModel.create(newUser)
                return done(null, result)
            }
            catch (error) {
                console.log(error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id)
        done(null, user)
    })

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try{
            const user = await UserModel.findOne({ email: username })
            if (!user) {
                return done(null, false, {message: "Usuario no encontrado"})
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        }
        catch (error) {
            console.log(error)
        }
    }))
}

export default initializePassport