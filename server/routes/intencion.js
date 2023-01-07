const router = require("express").Router();
const{IntentionController}=require("../models/schema/Intention")

router.get("/list", (req, res) => {
    
    IntentionController.showlist(req,res);
   })
router.get("/editview/:id", (req,res)=>{
    IntentionController.showedit(req.params,res);
})
router.get("/delete", async (req, res) => {
   await IntentionController.validdeleteintencion(req.query,res)
   .then(valid=>{
    if(valid){
    IntentionController.deleteintencion(req.query,res);
   }else{
    res.status(400);
    res.send("Nieprawidłowe dane żadania");
   }
})
   
   })
router.get("/checkpaystatus",(req,res)=>{
    console.log(req.body.id);
    IntentionController.checkpaystatus(req.body.id,res);
})

router.get("/myintecion",(req,res)=>{
    console.log(req.query);
    if(req.query.Ovner!==undefined)
    { console.log("req.params");
    IntentionController.getintectionforclient(req.query.Ovner,res);

    }else{
        res.status(401);
        res.send("Niepoprawne zapytanie");

    }
   
})
router.post("/cancel",(req,res)=>{
    console.log(req.body);
    IntentionController.cancel(req.body,res);
})

router.post("/editintencion",(req,res)=>{
   IntentionController.editintencion(req.body,res);
})
router.post("/update",(req,res)=>{
    console.log(req.body);
    IntentionController.update(req.body,res);
})
module.exports = router