const router = require("express").Router()
const{update,insert,deletegrave,showadd,showedit,showlist,checkburial}=require("../models/schema/GraveQuarters")




router.get("/list", (req, res) => {
    showlist(req,res);
   })
   router.get("/addOrEdit", async (req, res) => {
    showadd(req,res);
    
   })
   router.post("/addtomongobase", (req, res) => {
    if (req.body._id == "") {
    insert(req, res);
    } else {
    update(req, res);
    }
   })
   router.get("/check", (req, res) => {
    console.log("ok path");
   checkburial(req,res);
   })
   router.get("/:id", (req, res) => {
    showedit(req,res);
   })
   router.get("/delete/:id", (req, res) => {
    deletegrave(req,res);
   })
 
 

module.exports = router