const router = require("express").Router();

const{ExumationController}=require("../models/schema/Exhumation");



    router.get("/list", (req, res) => {
      ExumationController.showlist(req,res);
   })
   router.get("/listforclient", (req, res) => {
    console.log(req.body);
   })
   
   router.get("/add", (req, res) => {
    ExumationController.showadd(req,res);
   })
   router.get("/edit/:id", (req, res) => {
    
   //console.log(req.params);
   
   ExumationController.showedit(req.params,res);
   })
   
   router.get("/getdataexhumationforclient", (req, res) => {
    console.log(req.query);
    ExumationController.getdataforclient(req.query.listidburial,res);
  // console.log(req.body.data);
   
  
   })
   router.get("/delete", (req, res) => {
    console.log(req.query)
    ExumationController.delete(req.query,res);
   })
   router.post("/addtomongobase", (req, res) => {
    //console.log(req.body);   
    ExumationController.add(req.body,res);
   })
   router.post("/update", (req, res) => {
    console.log(req.body);   
    ExumationController.update(req.body,res);
   })


   

module.exports = router