const mongoose = require("mongoose");
var Schema= mongoose.Schema;
const {Burial}=require("./Burial")
const ExhumationSchema = new mongoose.Schema({
    PurposeExhumation:{type: String , enum:["Przeniesienie","Badania sekcyjne","Pogłepienie grobu"], required:true},
    DateExhumation:{type:Date, require:true},
    Datereburial:{type:Date, require:true},
    ChangeOfBurialPlace:{type:Boolean,require:true},
    Visible:{type:Boolean,require:true,default:true},
    Scribe:{type:String},
    Burial:{type: Schema.Types.ObjectId, ref: ' BurialSchema', required:true},

})
const Exhumation = mongoose.model("Exhumation", ExhumationSchema);
async function showlist(req,resp){
    
    Exhumation .find((err, docs) => {
        if (!err) {
           
             res.render("listexumation", {
             list: docs,
             
             })
            
           
        } else {
        console.log("Błąd pobierania danych /Exhumation/list" + err)
        }
        })
}

module.exports={showlist}