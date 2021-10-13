const express = require("express");
const app = express();
const http = require("http").createServer(app);
const socketio = require("socket.io");
const io = socketio(http);
const cors = require("cors");
const url = require("url");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv").config();
const { getMaxListeners } = require("process");

// ---- initialize token ----
const ACCESS_TOKEN = process.env.JWT_TOKEN;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.NODE_GMAIL_SENDER_MAIL,
    pass: process.env.NODE_GMAIL_SENDER_PASSWORD,
  },
});
const PORT = process.env.PORT || 5000;
// ------ firebase -------

//------------------------
const { Orders, Workers, Clients } = require("./initialize/firebase");

app.use(express.json());
app.use(cors());

//---- routes ----
app.post("/send-email", async (req, res) => {
  console.log(req);
  const snapshot = await Workers.get();
  const list = snapshot.docs.map((doc) => doc.data());
  // console.log(list)
  const user = list.find((u) => req.body.email === u.email);
  if (!user) {
    res.sendStatus(401);
  }
  const payload = { email: user.email };
  // console.log('payload', payload)
  // console.log(user.email)
  const token = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: "3m" });

  let mailOptions = {
    from: "Book Visit App",
    to: user.email,
    subject: "My first Email!",
    html: `
    <div style="background-color: royalblue; padding: 15px; border-radius: 5px;">
        <h3 style="color: white;">Hi! We are Book Visit App team</h3>
        <p style="color: white">We are sending your account activation link: </p>
        <button style="border: 1px solid darkblue; background-color: white; height: 40px; width: 100px; border-radius: 5px">
            <a style="text-decoration: none; color: black; font-weight: bold;"
            href="http://localhost:5000/active?token=${token}&email=${user.email}">
            Your activation link
            </a>
        </button>
    </div>`,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("success in sending email");
  });
});

app.get("/active", (req, res) => {
  const current_url = new URL(`http://localhost:5000${req.url}`);
  const search_params = current_url.searchParams;
  const token = search_params.get("token");
  const email = search_params.get("email");
  console.log(email);
  jwt.verify(token, ACCESS_TOKEN, async (err, data) => {
    if (err) {
      //   return res.sendStatus(403);
      return res.send("This link has expired");
    }
    // ---- updating active in database ----
    console.log("user account activated");
    const snapshot = await Workers.get();
    const list = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const user = list.find((u) => u.email === email);
    console.log(user);
    await Workers.doc(user.id).update({ active: true });
    //  ({ ...doc.data(), id: doc.id })
  });
});

// dac app.listen

// io.on('connection', (socket) => {
//     console.log('a user connected')

//     socket.on('send-email', (userInfo) => {
//         console.log('emai ' + userInfo.email)
//         let mailOptions = {
//             from: "Book Visit App",
//             to: 'jasiu.book.app@gmail.com',
//             subject: 'My first Email!',
//             text: "This is my first email. I am so excited"
//         }
//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 return console.log(err.message)
//             }
//             console.log('success in sending email')
//         })
//     })
// })

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
