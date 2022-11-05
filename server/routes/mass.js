const router = require("express").Router();
const{showlist}=require("../models/schema/Mass")

router.get("/list", (req, res) => {
    
    showlist(req,res);
   })
   

module.exports = router