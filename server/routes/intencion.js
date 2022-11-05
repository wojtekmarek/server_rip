const router = require("express").Router();
const{showlist}=require("../models/schema/Intention")

router.get("/list", (req, res) => {
    
    showlist(req,res);
   })
   

module.exports = router