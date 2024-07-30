import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: process.env.EMAIL_GMAIL,
        pass: process.env.CODE_GMAIL
        /* user: "fcarrasco.test@gmail.com",
        pass: "wazk vufv snkt kybq" */
    }
})

console.log(process.env.EMAIL_GMAIL)