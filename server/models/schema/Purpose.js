const { User } = require("./User");
const mongoose = require("mongoose");

const PurposeShema = new mongoose.Schema({
    PurposeUser: {type: String, required:true,unique:true},
    PurposeText:{type: String, required:true},
    Gift: {type: Number},
    HometwoNumber:{type: Number},
    Printed: {type: Boolean,default:false },
    
   })
   const Purpose = mongoose.model("Purpose", PurposeShema);