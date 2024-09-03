import winston from "winston";
import { __dirname } from "./utils.js";

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
}

const devLogger = winston.createLogger({
    levels: levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({ level: "debug" }),
        new winston.transports.File({ filename: `${__dirname}/errors.log`, level: "error" })
    ]
});

const prodLogger = winston.createLogger({
    levels: levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({ filename: "./error.log", level: "error" })
    ]
});

let Logger;

switch (process.env.NODE_ENV) {
    case "DEV":
        Logger = devLogger;
        break;
    case "PROD":
        Logger = prodLogger;
        break;
    default:
        Logger = prodLogger;
        break;
}

export default Logger;