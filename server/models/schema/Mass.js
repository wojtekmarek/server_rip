const mongoose = require("mongoose");

const MassSchema = new mongoose.Schema({
    
    
    Date_Of_even:{type: Date, required:true},
    Numer_enable_intensions:{type: Number, required:true,default:0},
    Number_intension:{type:Number , required:true,default:0},    
    Enable_intensions:{type: Boolean,require:true, default:false}//pole do wyszukiwania bez widoku
    
  

   });

   const Mass = mongoose.model("Mass", MassSchema);

   function showlist(req,res){
    Mass.find((err, docs) => {
        if (!err) {
           
            
             res.render("listmass", {
             list: docs,
             
             });
            
           
        } else {
        console.log("Błąd pobierania danych /mass/list" + err)
        }
        })
   }
   module.exports={Mass,MassSchema,showlist};