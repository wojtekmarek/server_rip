const mongoose = require("mongoose");
var Schema= mongoose.Schema;
/*const {Payment,PaymentSchema}=require("./Payment");
const {Mass,MassSchema}=require("./Mass");
const{UserSchema}=require("./User");*/
const IntentionShema = new mongoose.Schema({
    
    
    Accepted:{type: Boolean, required:true, default:false},
    Paid_Off:{type: Boolean, required:true},
    Textintens:{type: String, required:true},    
    Mass:{type: Schema.Types.ObjectId, ref: 'MassSchema', required:true},
    Ovner:{type: Schema.Types.ObjectId, ref: 'PaymentSchema', required:true}
    
  

   });

   const Intention = mongoose.model("Intention", IntentionShema);

   const IntentionController={
    showlist:function(req,res){
    Intention.find((err, docs) => {
        if (!err) {
           
            
             res.render("listintention", {
             list: docs,
             
             });
            
           
        } else {
        console.log("Błąd pobierania danych /inten/list" + err)
        }
        })
   }
}
   module.exports={IntentionShema,Intention,IntentionController};