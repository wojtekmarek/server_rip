const router = require("express").Router()
const Announcement  = require('../models/Announcement ');
const knex = require('knex');

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


router.get('/add', async(req, res)=>{
    //knex('Announcement').insert({title:"lok",annonse:"It is a long established fact that a reader will ",status:"visible"});
    //const anonselist= await  Announcement.query()
    const anonselist= await  knex.select().from('Announcement').timeout(1000,{ cancel: true     });
    res.render("listanonse", {
        list: anonselist,
        
        })
     
    });


    module.exports = router