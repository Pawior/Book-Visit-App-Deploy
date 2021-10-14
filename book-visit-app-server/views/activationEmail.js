const express = require('express')
const app = express();
app.use(express.static(__dirname + '../public'))

const activationEmail = (token, email) => {
    return `
 <div style="background-color: white; padding: 15px; border-radius: 5px; border: 2px solid darkblue; text-align: center; max-width: 500px">
 <img cid:logo@cid />
 <h3 style="color: royalblue;">Hi! We are Book Visit App team</h3>
 <p style="color: royalblue">We are sending your account activation link: </p>
 <button style="border: 1px solid darkblue; background-color: royalblue; height: 40px; width: 100px; border-radius: 5px">
 <a style="text-decoration: none; color: white; font-weight: bold;"
 href="${process.env.NODE_SERVER_IP}/active?token=${token}&email=${email}">
 Activation link
 </a>
 </button>
 </div>`
}

module.exports = activationEmail;