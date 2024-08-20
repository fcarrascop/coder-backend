import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.EMAIL_GMAIL,
        pass: process.env.CODE_GMAIL
    }
})