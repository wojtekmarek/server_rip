const router = require("express").Router();
const{BurialControler,update,insert,showadd,showedit,showlist,showlistclient,burialexhumation}=require("../models/schema/Burials")

router.get("/serchforclient", (req, res) => {
    //console.log(req);
    BurialControler.serchforclient(req.query,res);
   })
    router.get("/list", (req, res) => {
    showlist(req,res);
   })
   router.get("/addoredit", async (req, res) => {
    //console.log("first burial");
    //console.log(req.query.id);
    //console.log(req.params.id);
    showadd(req.query.id,res);
    
   })
 
   router.get("/:id", (req, res) => {
    showedit(req,res);
   })

   router.get("/listclient", (req, res) => {
    showlistclient(req,res);
   })
   
   router.post("/addtomongobase", (req, res) => {
    console.log(req.body);
    
    //pamietać o dodaniu do listy grobów
    if (req.body._idBurial == "undefined") {
    insert(req.body, res);
    } 
    //dac elseif
    else {
        console.log("update burial");
    update(req, res);
    }

   })

module.exports = router