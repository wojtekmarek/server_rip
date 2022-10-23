const router = require("express").Router();
const {update,insert,showadd,getovnerriptoclient,getlistovnernew,getlist,showedit,deleteovnerrip} = require('../models/schema/OvnerRip');
     
       
         router.get("/listovnernew", (req, res) => {

            getlistovnernew(res);
                    
             });

       router.get("/getdataovnerrip",async (req,res) =>{
        getovnerriptoclient(req,res);
        
            
               })
       
       router.get("/list", (req, res) => {
            getlist(res);
       })
       router.get("/addOrEdit", (req, res) => {
        showadd(req,res);
        
        
       })
       router.post("/addtomongobase", (req, res) => {
        if (req.body._id == "") {
        insert(req, res)
        } else {
        update(req, res)
        }
       })

       router.get("/:id", (req, res) => {
        showedit(req,res);
       })

       router.get("/delete/?:id&&:email", (req, res) => {
        deleteovnerrip(req,res);
       })
    
module.exports = router