const mongoose = require("mongoose");



const OrderSchema = new mongoose.Schema({
    
    
    Create_at:{type: Date, required:true,default:new Date()},
   
    
  

   });

   const Order = mongoose.model("Order", OrderSchema);

module.exports={OrderSchema,Order};