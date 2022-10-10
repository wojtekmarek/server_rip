const mongoose = require("mongoose");
const GraveQuartersSchema = new mongoose.Schema({
    IdGraveQuaters:Number,
    TypeOF:String,
    Payment:String,
    ovnerripid:{type: String, required:true},
   })
   const GraveQuarters= mongoose.model("GraveQuarters", GraveQuartersSchema)
 
   function insert(req, res) {
    console.log("adquater"+req.body.IdGraveQuaters);
    var gravequarter = new GraveQuarters()
    gravequarter.IdGraveQuaters=req.body.IdGraveQuaters
    gravequarter.TypeOF=req.body.TypeOF
    gravequarter.Payment=req.body.Payment
    gravequarter.ovnerripid=req.body.ovnerripid
    gravequarter.save((err, doc) => {
    if (!err) {
    res.redirect("/gravequarters/list")
    } else {
    console.log("Błąd podczas dodawania GraveQuarters: " + err)
    }
    })
   }
   function update(req, res) {
    console.log("updatequater");
    GraveQuarters.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
    if (!err) {
    res.redirect("/gravequarters/list")
    } else {
    console.log("Błąd podczas aktualizowania danych: " + err)
    }
    }
    )
}
   module.exports={GraveQuarters,update, insert}