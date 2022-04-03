//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-Parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require('bcryptjs');
//
// const salt = bcrypt.genSaltSync(10);
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose= require('passport-Local-Mongoose');

const app = express();

app.use(express.static("public"));
app.set('view engine' ,'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'abhinay Use Secret Key',
  resave: false,
  saveUninitialized: false
//  cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema =  new mongoose.Schema ( {
  email:String,
  password:String
});


userSchema.plugin(passportLocalMongoose);

// const secret = process.env.SECRETS;
//
// userSchema.plugin(encrypt, { secret: secret ,encryptedFields: ['password']});


const usermodel = new mongoose.model("user" , userSchema);


passport.use(usermodel.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(usermodel.serializeUser());
passport.deserializeUser(usermodel.deserializeUser());


app.get("/",function(req,res){
  res.render("home")
})

app.get("/login",function(req,res){
  res.render("login")
})

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/")
})
app.get("/register",function(req,res){
  res.render("register")
})

app.get("/Secrets" , function(req , res){
  if(req.isAuthenticated ())
  {
    res.render("Secrets");
  }
  else{
    res.redirect("/login");
  }
})

app.post("/register", function(req ,res){

  usermodel.register({username:req.body.username} , req.body.password , function(err , user){
if(err){
  console.log(err);
  res.redirect("/register")
}else{
  passport.authenticate("local")(req,res ,function(){
    res.redirect("/Secrets")
  })
}

  })
  // const newUser = new usermodel({
  //   email:req.body.username,
  //   password: bcrypt.hashSync(req.body.password , salt)
  // });
  // newUser.save(function(err){
  //   if(err){
  //     res.render(err);
  //   }else{
  //     res.render("Secrets");
  //
  //   }
  // });
});


app.post("/login", function(req ,res){


const user = new usermodel({
  username: req.body.username,
  password:  req.body.password
});

req.login(user,function(err){
  if(err){
  console.log(err);
  res.send("wrong username or password")
}else{
  passport.authenticate("local")(req,res ,function(){
    res.redirect("/Secrets")
  })
}
})
  //const username = req.body.username;
  //const   password =  bcrypt.compareSync(req.body.password);
// usermodel.findOne({emai:username},function(err ,finduser){
// if(err){
//   console.log(err);
// }  else{
//
//   if(finduser){
//
//   if (bcrypt.compareSync(req.body.password, finduser.password)) {
//
//
//       res.render("Secrets")
//     }
//     else{
//       res.send("wrong username or password")
//     }
//   }
// }
// })

});


app.listen(3000, function(){
console.log("server started on port 3000");
})
