import {fileURLToPath} from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"
import { sessionDTO } from "../dao/DTOs/users.dto.js"

// Configuración para handlebars

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

// Configuración Bcrypt

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)


// Cookie extractor

export const cookieExtractor = (req) => {
	let token = null
	if (req?.signedCookies["user"]) {
		token = req.signedCookies["user"]
	}
	else if (req && req.cookies && req?.headers?.authorization) {
		token = req?.headers?.authorization.split(" ")[1]
	}
	return token
}

export const generateToken = (data) => {
	const token = jwt.sign({ data }, process.env.SECRET_JWT, {expiresIn: "24h"})
	return token
}

export const tokenExtractor = (token) => {
	let result = null
	jwt.verify(token, process.env.SECRET_JWT, (error, credentials) => {
		if (error) {return null}
		result = new sessionDTO(credentials.data)
	})
	return result
}

export const dataExtractor = (req) => {
	return tokenExtractor(cookieExtractor(req))
}

export const createCookie = (res, data) => {
	res.cookie("user", generateToken(data), {httpOnly:true, secure:true, maxAge: 86400000, signed:true})
}

export const deleteCookie = (res) => {
	res.clearCookie("user")
}

export const refreshCookie = (res, data) => {
	deleteCookie(res)
	createCookie(res, data)
}

export const registerValidator = (fName, lName, age, email, password) => {
	let invalidStringChars = "1234567890¿¡?=)(/&%$#\"!@¨*+{}[]^`~,.-_:;<>|°"
	let invalid = "¿¡?=)(/&%$#\"!@¨*+{}[]^`~,-_:;<>|°áéíóúÁÉÍÓÚÄËÏÖÜQWERTYUIOPÑLKJHGFDSAZXCVBNMñ"
	let DfName = !invalidStringChars.split('').some(char => fName.includes(char))
	let DlName = !invalidStringChars.split('').some(char => lName.includes(char))
	let Dage = ((parseInt(age) < 150) && (parseInt(age) > 4))
	let Demail = validator.isEmail(email) && !invalid.split('').some(char => email.split("@")[0].includes(char))
	let dpassword = password.trim() !== "" && !password.split("").some((char) => char === " ");
	return (DfName && DlName && Dage && Demail && dpassword)
}

export const fecha = () => {
	let fecha = new Date()
	let time = `${fecha.getHours()}:${(fecha.getMinutes() >= 10) ? fecha.getMinutes() : `0${fecha.getMinutes()}`}:${fecha.getSeconds()}`
	let date = `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}`
	return `${date};${time}`
}

export const ticketCodeGenerator = (date, email, amount) => {
	return createHash(`${date}${email}EasterEgg${amount}`).replace("/", "")
}