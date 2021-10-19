const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const url = require('url')
const fs = require('fs')
const path = require('path')

// ---- email templates ----
const activationEmailT = require('../views/activationEmail')
const confirmEmailT = require("../views/confirmEmail")
const successfullyDoneEmailT = require("../views/successfullDoneOrder")

// ---- databases ----
const { Orders, Workers, Clients } = require('../initialize/firebase');

// ---- token ----
const ACCESS_TOKEN = process.env.JWT_TOKEN

// ---- declaring nodemailer transporter ----
const { transporter } = require('../initialize/nodemailer');
const { join } = require('path');

// -------- send email route --------
const sendVerEmail = async (req, res) => {
    const snapshot = await Workers.get()
    const list = snapshot.docs.map((doc) => doc.data())
    const user = list.find((u) => req.body.email === u.email)
    if (!user) {
        res.sendStatus(401)
    }
    const payload = { email: user.email }
    const token = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: '3m' })

    let mailOptions = {
        from: "Book Visit App",
        to: user.email,
        subject: 'Activation Email',
        html: activationEmailT(token, user.email),
        attachments: [{
            filename: 'logo.png',
            path: './public/images/logo/logo.png',
            cid: 'logo@cid'
        }],
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log(err.message)
        }
        console.log('success in sending email')
    })
    res.send('sucess in sending email')
}

const activationFromEmail = (req, res) => {
    const current_url = new URL(`${process.env.NODE_SERVER_IP}${req.url}`)
    const search_params = current_url.searchParams;
    const token = search_params.get('token')
    const email = search_params.get('email')
    // console.log(email)
    jwt.verify(token, ACCESS_TOKEN, async (err, data) => {
        if (err) {
            return res.sendStatus(403)
        }
        // ---- updating active in database ----
        console.log("user account activated")
        const snapshot = await Workers.get()
        const list = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        const user = list.find(u => u.email === email)
        // console.log(user)
        await Workers.doc(user.id).update({ active: true })
        res.sendFile(path.join(__dirname + "/../views/accountActivated.html"))
        // res.sendFile(fs.readFile(__dirname, "..", 'views', 'accountActivated.html'))
        //  ({ ...doc.data(), id: doc.id })

    })
}

const confirmOrderEmail = async (req, res) => {
    const snapshot = await Clients.get()
    const list = snapshot.docs.map((doc) => doc.data())
    const user = list.find((u) => req.body.email === u.email)

    orderInfo = req.body
    let mailOptions = {
        from: "Book Visit App",
        to: user.email,
        subject: 'Order Confirmation',
        html: confirmEmailT(orderInfo),

    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log(err.message)
        }
        console.log('success in sending email')
    })
    res.send('sucess in sending email')
}

const orderSuccessfullyDoneEmail = async (req, res) => {
    const snapshot = await Clients.get()
    const list = snapshot.docs.map((doc) => doc.data())
    const user = list.find((u) => req.body.email === u.email)

    orderInfo = req.body
    let mailOptions = {
        from: "Book Visit App",
        to: user.email,
        subject: 'Order done!',
        html: successfullyDoneEmailT(orderInfo)

    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            return console.log(err.message)
        }
        console.log('success in sending email')
    })
    res.send('sucess in sending email')
}

module.exports = { sendVerEmail, activationFromEmail, confirmOrderEmail, orderSuccessfullyDoneEmail }