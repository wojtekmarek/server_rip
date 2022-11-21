const router = require("express").Router()
const {Announcement,insert,update,deleteanons,getanonse}  = require('../models/Announcement ');
const knex = require('knex');
const { query } = require("express");

router.get('/try', async(req, res)=>{
    const anonse= await Announcement.query()
    res.send(anonse);
     
    });
    
router.get('/list', async(req, res)=>{
        const anonselist= await Announcement.query()
      anonselist.forEach(dateevent => { 
        let time=dateevent.time_event;
        
        let date=dateevent.created_at;
        if(time != null){
            dateevent.time_event = time.toISOString().slice(0,10).split("-").reverse().join("-");
           
        }
        if(date != null){
            dateevent.created_at = date.toISOString().slice(0,10).split("-").reverse().join("-");
           
        }
            
            //console.log( dateevent.toString().slice(0,10).split("-").reverse().join("-"));
        });
       // console.log(anonselist[0]);
        res.render("listanonse", {
            list: anonselist,
            
            })
         
        });

router.get('/listanonse',async(req,res)=>{
    const anonselist= await Announcement.query()
    
    if(anonselist==undefined){
        res.status(500).send({ message: "Blad serwera nie pobrano ogloszen" });
    }else{
        res.json(anonselist);
    }
   
})
//zmienic sciezke
router.post("/addanonse", async (req, res) => { 
    console.log("infunction");
    
        insert(req.body, res);
    
})
router.post("/editanonse", async (req, res) => { 
   // console.log("ieditanonse");
  //  console.log(req.body);
        update(req.body, res);
    
})
router.get('/addview', (req, res)=>{
    res.render("addoreditannonse", {
        action:"/anonse/addanonse",
        viewTitle:"Dodaj ogłoszenie"
        
        })
    });
    router.get('/editview/:id', async(req, res)=>{
        var anons= await getanonse(req.params.id)
       if(anons){
        //console.log(anons);
            
        res.render("addoreditannonse", {
            action:"/anonse/editanonse",
            viewTitle:"Edytuj ogłoszenie",
            Anonse:anons
            
            })
       }
           
          
        
        });
        router.get('/delete/:id', async(req, res)=>{
           // console.log('delete fun');
           // console.log(req.params.id);
            
            deleteanons(req.params.id,res);
            });
    module.exports = router