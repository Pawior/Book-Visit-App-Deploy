const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.NODE_GMAIL_SENDER_MAIL,
        pass: process.env.NODE_GMAIL_SENDER_PASSWORD

    }
})


module.exports = { transporter }