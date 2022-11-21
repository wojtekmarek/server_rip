const router = require("express").Router()
const{GraveController}=require("../models/schema/GraveQuarters")


router.get("/sendquaterdetail", async (req, res) => {
    //console.log(req.params.id);
    //console.log(req.query.id);
    GraveController.sendquaterdetails(req.query.id,res);
   })

router.get("/list", (req, res) => {
    GraveController.showlist(req,res);
   })
   router.get("/addoredit", async (req, res) => {
    GraveController.showadd(req,res);
    
   })
   router.post("/addtomongobase", (req, res) => {
    if (req.body._id == "") {
        GraveController.insert(req, res);
    } else {
        GraveController.update(req, res);
    }
   })
   router.get("/check", (req, res) => {
    //console.log("ok path");
    GraveController.checkburial(req,res);
   })
   router.get("/:id", (req, res) => {
    GraveController.showedit(req,res);
   })
   router.get("/delete/:id", (req, res) => {
    GraveController.deletegrave(req,res);
   })
 
 

module.exports = router