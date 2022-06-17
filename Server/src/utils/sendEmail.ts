import nodemailer from "nodemailer";

export const sendEmail = async(email: string, subject: string, text: string) => {
const emailUser = process.env.EMAIL_USERNAME;
const pass = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
        user: emailUser,
        pass: pass,
    },
})

const mailOptions = {
    from: emailUser,
    to: email,
    subject: subject,
    html: text,
}

transporter.sendMail(mailOptions, (err, data) => {
    if (err) { 
         console.log(err) 
        }else { 
            console.log(data.response) 
        } 
})
}

