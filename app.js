//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-Parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine' ,'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema =  new mongoose.Schema ( {
  email:String,
  password:String
});

const secret = process.env.SECRETS;

userSchema.plugin(encrypt, { secret: secret ,encryptedFields: ['password']});


const usermodel = new mongoose.model("user" , userSchema);

app.get("/",function(req,res){
  res.render("home")
})

app.get("/login",function(req,res){
  res.render("login")
})

app.get("/register",function(req,res){
  res.render("register")
})

app.post("/register", function(req ,res){
  const newUser = new usermodel({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      res.render(err);
    }else{
      res.render("Secrets");

    }
  });
});


app.post("/login", function(req ,res){

  const username = req.body.username;
  const   password = req.body.password;
usermodel.findOne({emai:username},function(err ,finduser){
if(err){
  console.log(err);
}  else{
  if(finduser){
    if(finduser.password===password){
      res.render("Secrets")
    }
    else{
      res.send("wrong username or password")
    }
  }
}
})

});


app.listen(3000, function(){
console.log("server started on port 3000");
})
