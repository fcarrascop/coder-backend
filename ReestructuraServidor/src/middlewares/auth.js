import { cookieExtractor } from "../utils.js"

export const isAuthenticated = (req, res, next) => {
    if (cookieExtractor(req,res)) {
        return next()
    }
    else {
        res.redirect('/login')
    }
}

export const isNotAuthenticated = (req, res, next) => {
    if (!cookieExtractor(req,res)) {
        return next()
    }
    else {
        res.redirect('/profile')
    }
}
