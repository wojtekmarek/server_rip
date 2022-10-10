const mongoose = require("mongoose");
const OvnerRipSchema = new mongoose.Schema({
    Name: String,
    LastName:String,
    email: {type: String, required:true,unique:true},
    Street:String,
    HomeNumber: Number,
    HometwoNumber: Number,
    city: String,
    Pesel:Number,
    ovner:{type: String,default:"nieznany"}
   })
   const OvnerRip = mongoose.model("OvnerRip", OvnerRipSchema)
 
   function insert(req, res) {
    var ovnerRip = new OvnerRip()
    ovnerRip.Name = req.body.Name
    ovnerRip.LastName = req.body.LastName
    ovnerRip.email = req.body.email
    ovnerRip.Street = req.body.Street
    ovnerRip.HomeNumber = req.body.HomeNumber
    ovnerRip.HometwoNumber = req.body.HometwoNumber
    ovnerRip.city = req.body.city
    ovnerRip.Pesel = req.body.Pesel
    ovnerRip.ovner=req.body.ovner
    ovnerRip.save((err, doc) => {
    if (!err) {
    res.redirect("/ovnerrip/list")
    } else {
    console.log("Błąd podczas dodawania OvnerRipa: " + err)
    }
    })
   }
   function update(req, res) {
    OvnerRip.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
    if (!err) {
    res.redirect("/ovnerrip/list")
    } else {
    console.log("Błąd podczas aktualizowania danych: " + err)
    }
    }
    )
}
   module.exports={OvnerRip,update, insert}