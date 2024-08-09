import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.EMAIL_GMAIL,
        pass: process.env.CODE_GMAIL
    }
})

export const ticketGenerator = async (user) => {
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

export const recoveryEmail = async (user, link) => {
    let result =  await transporter.sendMail({
        from: process.env.EMAIL_GMAIL,
        to: user.email,
        subject: "Recuperación de contraseña",
        html: `
			<h1>Recuperación de contraseña</h1>
			<p>Estimado/a ${user.firstName} ${user.lastName}, se ha recibido la petición de recuperación de contraseña</p>
			<p>Para recuperar su contraseña, haga click en el siguiente enlace:${link}</p>
			<p>Si no ha solicitado la recuperación de contraseña, por favor ignore este mensaje</p>
        `
    })
	return result
}