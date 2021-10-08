const express = require('express')
const app = express();
const http = require('http').createServer(app)
const socketio = require('socket.io')
const io = socketio(http)
const cors = require('cors')
const PORT = process.env.PORT || 5000
const mandrill = require('node-mandrill')('4c64da003e622abc52a6174e12aff7a0-us5')
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
}
app.use(cors(corsOptions));
app.use(express.json());

io.on('connection', (socket) => {
    console.log('a user connected')
    io.on('send-email', (userInfo) => {
        //send an e-mail to jim rubenstein
        mandrill('/messages/send', {
            message: {
                to: [{ email: 'remxin7@gmail.com', name: 'Dawid N' }],
                from_email: 'dawid.book.app@gmail.com',
                subject: "Hey, what's up?",
                text: "Hello, I sent this message using mandrill."
            }
        }, function (error, response) {
            if (error) console.log(JSON.stringify(error));
            else console.log(response);
        });
    })
})

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
