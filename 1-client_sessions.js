const express = require("express");
const sessions = require("client-sessions"); // a session package made by Mozilla
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

//setting up Mozilla sessions (client-sessions)
app.use(sessions({
  cookieName: "session",
  secret: "Woosfsadf123sad",
  duration: 30 * 60 * 1000 // 30 mins
}));

//adding a session to the user
req.session.userId = user._id;


