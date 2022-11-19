const router = require("express").Router();
const{IntentionController}=require("../models/schema/Intention")

router.get("/list", (req, res) => {
    
    IntentionController.showlist(req,res);
   })
router.get("/editview/:id", (req,res)=>{
    IntentionController.showedit(req.params,res);
})
router.get("/delete", (req, res) => {
    //console.log(req.query);
    IntentionController.deleteintencion(req.query,res);
   })
   
router.post("/update",(req,res)=>{
    console.log(req.body);
    IntentionController.update(req.body,res);
})
module.exports = router