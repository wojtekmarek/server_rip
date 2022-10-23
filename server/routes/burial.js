const router = require("express").Router();
const{update,insert,showadd,showedit,showlist,showlistclient,findburial,burialexhumation}=require("../models/schema/Burials")


    router.get("/list", (req, res) => {
    showlist(req,res);
   })
   router.get("/addoredit", async (req, res) => {
    //console.log("first burial");
    //console.log(req.query.id);
    //console.log(req.params.id);
    showadd(req.query.id,res);
    
   })
   router.post("/addtomongobase", (req, res) => {
    /* pamietać o dodaniu do listy grobów
    if (req.body._id == "") {
    insert(req, res);
    } else {
    update(req, res);
    }*/
   })
   
   router.get("/exhumation", (req, res) => {
    burialexhumation(req,res);
   })
   router.get("/listclient", (req, res) => {
    showlistclient(req,res);
   })
   router.get("/findburial", (req, res) => {
    findburial(req,res);
   })

module.exports = router