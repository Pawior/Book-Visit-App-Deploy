const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv").config();

// ---- basic app and port configuration ----
const PORT = process.env.NODE_SERVER_PORT || 5000;
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "/book-visit-app/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/book-visit-app/build", "index.html"));
});

//---------- routes ----------
const emailActRoutes = require("./routes/emailSendRoutes");
app.use(emailActRoutes);

console.log(process.env.NODE_SERVER_PORT);
console.log(process.env.NODE_SERVER_IP);
console.log(process.env.CLIENT_IP);
// ---- listening ----
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
