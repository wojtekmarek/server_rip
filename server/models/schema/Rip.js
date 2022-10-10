const mongoose = require("mongoose");
const RipSchema = new mongoose.Schema({
    TypeRip: String,
    Payment: Boolean
   })
   const OvnerRip = mongoose.model("Rip", RipSchema)
   mongoose.connect(
    "mongodb://localhost:27017/RipDB",
    {
    useNewUrlParser: true
    },
    err => {
    if (!err) {
    console.log("Connection succeeded")
    } else {
    console.log("Error in connection: " + err)
    }
    }
   )
   module.exports=OvnerRip