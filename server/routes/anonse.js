const router = require("express").Router()
const Announcement  = require('../models/Announcement ');

router.get('/try', async(req, res)=>{
    const anonse= await Announcement.query()
    res.send(anonse);
     
    });
    
router.get('/list', async(req, res)=>{
        const anonselist= await Announcement.query()
        res.render("listanonse", {
            list: anonselist,
            
            })
         
        });
router.get('/listanonse',async(req,res)=>{
    const anonselist= await Announcement.query()
    console.log(typeof anonselist);
    if(anonselist==undefined){
        res.status(500).send({ message: "Blad serwera nie pobrano ogloszen" });
    }else{
        res.json(anonselist);
    }
   
})


    module.exports = router