const router = require("express").Router();
const{showlist}=require("../models/schema/Exhumation")
const{showadd,add,showedit,ExumationController}=require("../models/schema/Exhumation");



    router.get("/list", (req, res) => {
    showlist(req,res);
   })
   router.get("/listforclient", (req, res) => {
    console.log(req.body);
   })
   
   router.get("/add", (req, res) => {
    showadd(req,res);
   })
   router.get("/edit/:id", (req, res) => {
    console.log(req.query);
   console.log(req.body);
   
    showedit(req.query,res);
   })
   
   router.get("/getdataexhumationforclient", (req, res) => {
    console.log(req.query);
    ExumationController.getdataforclient(req.query.listidburial,res);
  // console.log(req.body.data);
   
  
   })

   router.post("/addtomongobase", (req, res) => {
    //console.log(req.body);   
    add(req.body,res);
   })


   

module.exports = router