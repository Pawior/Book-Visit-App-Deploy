const express = require('express')
const app = express();
const http = require('http').createServer(app)
const socketio = require('socket.io')
const io = socketio(http)
const nodemailer = require('nodemailer');
const { getMaxListeners } = require('process');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'dawid.book.app@gmail.com',
        pass: 'zaq1@WSXQwEr!'

    }
})
const PORT = process.env.PORT || 5000

app.use(express.json());

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('send-email', (userInfo) => {
        console.log('emai ' + userInfo.email)
        let mailOptions = {
            from: "Book Visit App",
            to: 'jasiu.book.app@gmail.com',
            subject: 'My first Email!',
            text: "This is my first email. I am so excited"
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return console.log(err.message)
            }
            console.log('success in sending email')
        })
    })
})

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
