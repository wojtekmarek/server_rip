const knexconf = require('../../config/database');
const Model= require('objection').Model;

//console.log(knexconf)
Model.knex(knexconf)
 
class Announcement extends Model{
  static get tableName() {
    return 'Announcement'
  }
  
}
async function insert(req, res) {
 
   //     console.log(req.date);
        let time_to_conwert=req.date.split("-").reverse().join("-")+"T14:48:00.000+09:00";
        const date = new Date(time_to_conwert);
        //console.log(date);
        let newtime=date.toISOString().slice(0,10).split("-").reverse().join("-");
        //console.log(newtime);
        var anonse={title:req.title,annonse:req.annonse,status:req.status,time_event:date,created_at:new Date};
         //console.log(anonse);

  try {
    const tx = await Announcement.transaction(async trx =>  {
        const anonsInserted = await Announcement.query(trx).insert(anonse);
        
        res.redirect("/anonse/list");
      
    });
  } catch(err) {
   
    console.log(err);
  }

 }

 async function deleteanons(req, res) {

  
  var id=req;
  //console.log(id);
 
  
  try {
    const tx = await Announcement.transaction(async trx =>  {
        const anonsInserted = await Announcement.query(trx).deleteById(id);
        res.redirect("/anonse/list");
      
    });
  } catch(err) {
   
    console.log(err);
  }

 }
 async function update(req, res) {
  var id=req._id;
 // console.log(id);
   //     console.log(req.date);
        let time_to_conwert=req.date.split("-").reverse().join("-")+"T14:48:00.000+09:00";
        const date = new Date(time_to_conwert);
        const datecreate=new Date(req.created_at);
        var anonse={title:req.title,annonse:req.annonse,status:req.status,time_event:date,created_at:datecreate};
         //console.log(anonse);

  try {
   
        const anonsedit = await Announcement.query().update(anonse).where('id',id);
     
        
        res.redirect("/anonse/list");
      
    
  } catch(err) {
   
    console.log(err);
  }

 }

 async function getanonse(req) {
  var id=req;
 // console.log(id);
  var anons
  try {
   
        const anonsfind = await Announcement.query().findById(id);
        if (!anonsfind) {
          return err
        }
       // console.log(anonsfind);
        anons= anonsfind
      
    }
   catch(err) {
   
    console.log(err);
  }
  anons.date=anons.time_event.toISOString().slice(0,10).split("-").reverse().join("-");
  //console.log(anons.date);
 return anons

 }

module.exports = {Announcement,insert,update,deleteanons,getanonse}