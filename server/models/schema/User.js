const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { status } = require("express/lib/response");

const userSchema = new mongoose.Schema({

    email: { type: String, required: true },
    password: { type: String, required: true },
    status:{type: Boolean,required:true,default:false}
   })
   userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",})
    return token
    }
   const User = mongoose.model("Userdb", userSchema)
  
   const validate = (data) => {
    const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    })
    return schema.validate(data)
    }

    function insert(req, res) {
        var user= new User()
        user.email = req.body.email
        user.password = req.body.password
        user.status = req.body.status
        user.save((err, doc) => {
        if (!err) {
        res.redirect("/userdb/listuser")
        } else {
        console.log("Błąd podczas dodawaniauser: " + err)
        }
        })
       }

       function register(req, res) {
        var user= new User()
        user.email = req.body.email
        user.password = req.body.password
        user.status = false
        user.save((err, doc) => {
        if (!err) {
            res.status(201).send({ message: "Utworzono użytkownika" })
        } else {
        console.log("Błąd podczas dodawaniauser: " + err)
        }
        })
       }
       function update(req, res) {
        User.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        { new: true },
        (err, doc) => {
        if (!err) {
        res.redirect("/userdb/listuser")
        } else {
        console.log("Błąd podczas aktualizowania danych: " + err)
        }
        }
        )
    }
   module.exports={User,validate,update,insert,register}