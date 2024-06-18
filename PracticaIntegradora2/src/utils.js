import {fileURLToPath} from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import exphbs from "express-handlebars"

// Configuración para handlebars

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

// Configuración Bcrypt

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)


// Cookie extractor

export const cookieExtractor = (req,res) => {
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
		result =  {
			_id: credentials.data._id,
			firstName: credentials.data.firstName,
			lastName: credentials.data.lastName,
			email: credentials.data.email,
			age: credentials.data.age,
			edit: credentials.data.edit,
			cartId: credentials.data.cartId
		}
	})
	return result
}