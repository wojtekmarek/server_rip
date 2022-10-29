const router = require("express").Router();
const{showlist}=require("../models/schema/Exhumation")
const{showadd,add,showedit}=require("../models/schema/Exhumation");



    router.get("/list", (req, res) => {
    showlist(req,res);
   })
   
   router.get("/add", (req, res) => {
    showadd(req,res);
   })
   router.get("/edit/:id", (req, res) => {
    console.log(req.query);
   console.log(req.body);
   
    showedit(req.query,res);
   })

   router.post("/addtomongobase", (req, res) => {
    //console.log(req.body);   
    add(req.body,res);
   })

   

module.exports = router