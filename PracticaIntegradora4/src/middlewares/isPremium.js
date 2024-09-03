import { cookieExtractor, tokenExtractor } from "../utils/utils.js";

export const isPremium = (req, res, next) => {
    if (cookieExtractor(req) && (tokenExtractor(cookieExtractor(req))?.role === "admin" || tokenExtractor(cookieExtractor(req))?.role === "premium")) {
        next()
    }
    else {
        res.status(401).json({"status": "error", "message": "Usuario no autorizado."})
    }
}