const mongoose = require("mongoose");
var Schema= mongoose.Schema;
const PaymentSchema= new mongoose.Schema({
    
    Burialtype:{type: String , enum:["Tradycyjny","Urnowy"], required:true},
    Namedeceased:{type: String, required:true},
    LastNamedeceased:{type: String, required:true},    
    DateOfDeath:{type:Date, required:true},
    DateBurial:{type:Date, required:true},
    GraveQuaters:{type: Schema.Types.ObjectId, ref: 'GraveQuartersSchema', required:true},
    GraveQuartersnumber:{type: Number, required:true}


   })
   const Payment = mongoose.model("Payment", PaymentSchema);

   module.exports={Payment,PaymentSchema}