const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const sessions = require("client-sessions"); // a session package made by Mozilla

let app = express();

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/auth_from_scratch");
app.set("view engine", "pug");

//setting up Mozilla sessions (client-sessions)
app.use(sessions({
  cookieName: "session",
  secret: "Woosfsadf123sad",
  duration: 30 * 60 * 1000 // 30 mins
}));


//================
//     MODELS    |
//================

let User = mongoose.model("User", new mongoose.Schema({
  firstName:  {type: String, required: true},
  lastName:   {type: String, required:true},
  email:      {type: String, required: true},
  password:   {type:String, required: true}
}))

//================
//     ROUTES    |
//================
app.get("/", (req, res) => {
  res.render("index")
})

//REGISTER ROUTES
//===============
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  console.log("req.body is: ", req.body);
  let user = new User(req.body);

  user.save((err) => {
    if(err) {
      let error = "Something bad happend! please try again.";

      if(err.code === 11000) {
        error = "That email is already taken, please try another";
      }
      console.log(error)
      return res.render("register", {error});
    }
    // if nothing failed
    console.log(user)
    res.redirect("/dashboard");
  })
});

//LOGIN ROUTES
//=============
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  console.log("req.body: ", req.body);
  User.findOne({email: req.body.email}, (err, user) => {
    if(err || !user || req.body.password !== user.password) {
      return res.render("login", {
        error: "Incorrect email / password."
      });
    }
    req.session.userId = user._id; // adding and encrypting a session to the user
    console.log('Session found')
    res.redirect("/dashboard");
  })
});

//the dashboard is the page that is shown when user is logged in
app.get("/dashboard", (req, res) => {

  //if user dont have a session - redirect him to login
  if(!(req.session && req.session.userId)) {
    return res.redirect("/login");
  }

  //if user have a session, but its session dont match any of the session in DB - redirect him
  User.findById(req.session.userId, (err, user) => {
    if(err) {
      return next(err);
    }

    if(!user) {
      return res.redirect("/login");
    }
    // if user's session match DB session
    res.render("dashboard");
  })
  res.render("login")
});

//c9
//app.listen(process.env.PORT, process.env.IP, () => console.log("Auth From Scratch is running"));
//localhost
app.listen(3000 , () => console.log("Auth From Scratch is running"));