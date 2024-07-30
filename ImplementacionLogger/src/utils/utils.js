import {fileURLToPath} from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import validator from "validator"
import { sessionDTO } from "../dao/DTOs/users.dto.js"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.EMAIL_GMAIL,
        pass: process.env.CODE_GMAIL
    }
})

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

export const ticketMailGenerator = async (user) => {
	try {
		let result = await transporter.sendMail({
			from: process.env.EMAIL_GMAIL,
			to: user.purchaser,
			subject: `¡Su compra ha sido recibida! ${user.code}`,
			html: `
			<div>
				<h1>Hemos recibido su compra</h1>
				<h2>En los próximos correos le informaremos sobre el estado de su compra!</h2>
				<br>
				<h3>Información sobre la compra</h3>
				<p>Id pedido: ${user.code}</p>
				<p>Fecha pedido: ${user.purchaseTime.split(";")[0]} ${user.purchaseTime.split(";")[1]}</p>
				<p>Cantidad: $${user.amount}</p>
				<p>Estado: En preparación</p>
				<br>
				<p>¡Le mantendremos informado!</p>
			</div>
			`
		})
		return result
	}
	catch (err){
		return {"error": err}
	}
}