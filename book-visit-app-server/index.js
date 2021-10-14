const express = require('express')
const app = express();
const http = require('http').createServer(app)
const cors = require('cors')

const dotenv = require('dotenv').config()

// ---- getting local views ----
const activationEmailT = require('./views/activationEmail')

// ---- initialize token ----
const ACCESS_TOKEN = process.env.JWT_TOKEN

// ---- initialize nodemailer transporter ----
const { transporter } = require('./initialize/nodemailer')


// ---- getting firestore collections ----
const { Orders, Workers, Clients } = require('./initialize/firebase');

// ---- basic app and port configuration ----
const PORT = process.env.NODE_SERVER_PORT
app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(cors());

//---------- routes ----------
const emailActRoutes = require('./routes/emailSendRoutes')
app.use(emailActRoutes)


// ---- listening ----
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
