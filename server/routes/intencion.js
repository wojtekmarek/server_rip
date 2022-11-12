const router = require("express").Router();
const{IntentionController}=require("../models/schema/Intention")

router.get("/list", (req, res) => {
    
    IntentionController.showlist(req,res);
   })
   
router.post("/addtodb",(req,res)=>{

    res.send("inprogres");
})
module.exports = router