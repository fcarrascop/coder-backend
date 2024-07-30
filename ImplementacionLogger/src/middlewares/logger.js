import Logger from "../utils/logger.js"

const addLogger = (req, res, next) => {
    req.logger = Logger
    next()
}

export default addLogger