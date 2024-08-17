import { cookieExtractor } from "../utils/utils.js"

export const isAuthenticated = (req, res, next) => {
    if (cookieExtractor(req)) {
        return next()
    }
    else {
        res.redirect('/login')
    }
}

export const isNotAuthenticated = (req, res, next) => {
    if (!cookieExtractor(req)) {
        return next()
    }
    else {
        res.redirect('/profile')
    }
}
