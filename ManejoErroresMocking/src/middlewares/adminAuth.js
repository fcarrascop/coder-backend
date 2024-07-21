import { cookieExtractor, tokenExtractor } from "../utils.js";

export const isAdmin = (req, res, next) => {
    if (cookieExtractor(req) && tokenExtractor(cookieExtractor(req))?.role === "admin") {
        next()
    }
    else {
        res.status(401).json({"status": "error", "message": "Usuario no autorizado."})
    }
}