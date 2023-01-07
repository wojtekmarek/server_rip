const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt")


const userSchema = new mongoose.Schema({

    email: { type: String, required: true },
    password: { type: String, required: true },
    status: { type: Boolean, required: true, default: false }
})
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    })
    return token
}
const User = mongoose.model("Userdb", userSchema)
const UserController = {
    deleteuser:function(req,res){
        User.findByIdAndRemove(req,(err)=>{
            if(!err){
                res.status(207);
                res.send("delete");
            }else{
                res.status(500);
                res.send("err"+err);

            }
        })
    },
    saveuserdata:function(req,res){
       User.findOneAndUpdate({email:req.email},{password:req.password}, 
            (err, doc) => {
                if(!err){
                    res.status(200);
                    res.send("Ok");
                }else{
                    res.status(500);
                    res.send("Coś poszło nie tak przy zmianie hasła"+err);
                }
            })


    },
    saveuserdataovner:function(req){
        return new Promise((resolve, reject) => {
        User.findOneAndUpdate({email:req.email},{password:req.password}, 
             (err, doc) => {
                 if(!err){
                    console.log(true);
                    resolve(true);
                 }else{
                    console.log(false);
                    resolve(false);
                 }
             })
            })
 
     },
    validate: function (data) {
        const schema = Joi.object({
            email: Joi.string().email().required().label("Email"),
            password: passwordComplexity().required().label("Password"),
        })
        return schema.validate(data)
    },
    loginuser: async function (req, res) {
        const user = await User.findOne({ email: req.email })
        if (!user)
            return res.status(401).send({ message: "Błędny email lub hasło!" })
        /*do dodania hash hasla const validPassword = await bcrypt.compare(
             req.body.password,
             user.password
         )
         if (!validPassword)*/
        if (req.password != user.password) {
            res.status(401).send({ message: " Błędny email lub hasło!" })
        } else {

            const token = user.generateAuthToken();
            const id = user.id;
            console.log(id + " " + token);
            res.status(200).send({ data: { token, id }, message: "Zalogowano!" })
        }
    },
    register: async function (req, res) {
        
        User.find({ email: req.email },
            (err, doc) => {
                if (!err) {

                    if (doc[0] !== undefined) {
                        res.status(200);
                        res.send("204");
                    } else {
                        var user = new User()
                        user.email = req.email
                        user.password = req.password
                        user.status = false
                        user.save((err) => {
                            if (!err) {
                                res.status(200).send("200")
                            } else {
                                res.status(200).send({ message: "500" })
                                console.log("Błąd podczas dodawaniauser: " + err)
                            }
                        })

                    }
                } else {
                    res.status(200).send({ message: "500" })
                    console.log("Błąd podczas wyszukiwania user: " + err)

                }
            })
    }
}
const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    })
    return schema.validate(data)
}

function insert(req, res) {
    var user = new User()
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
/*
       async function  register(req, res) {
        var chceckuser= await User.findOne({ email: req.body.email });
        //console.log(chceckuser);
        if(!chceckuser){
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

        }else{
            res.status(409).send({ message: "Użytkownik o podanym loginie istnieje" });
        }
        
       }*/
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
module.exports = { User, validate, update, insert, UserController }