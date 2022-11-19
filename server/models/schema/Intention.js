const { response } = require("express");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
var Schema= mongoose.Schema;
/*const {Payment,PaymentSchema}=require("./Payment");
const {Mass,MassSchema}=require("./Mass");
const{UserSchema}=require("./User");*/
const IntentionShema = new mongoose.Schema({
    
    
    Accepted:{type: Boolean, required:true, default:false},
    Paid_Off:{type: Boolean, required:true},
    Textintens:{type: String, required:true},    
    Mass:{type: Schema.Types.ObjectId, ref: 'MassSchema', required:true},
    Ovner:{type: Schema.Types.ObjectId, ref: 'PaymentSchema', required:true}
    
  

   });

   const Intention = mongoose.model("Intention", IntentionShema);

   const IntentionController={
    
     add:function(req){
          
          return new Promise((resolve, reject) => {
              // console.log("addintencion");
              // console.log(req);
               var intencion=new Intention();
               intencion.Paid_Off=req.Paid_Off;
               intencion.Textintens=req.Textintens;
               intencion.Mass=req.Mass;
               intencion.Ovner=req.Ovner;
              // console.log(intencion);     
                 intencion.save((err, doc) => {
                  if (!err) {
                   // console.log(doc._id);
                    resolve([true,doc._id]);
                  } else {
                 // console.log("Błąd podczas dodawania intencji: " + err)
                  resolve([false,err]);
                  }
                  }) 
                          
                     })
     },
    showlist:function(req,res){

     Intention.aggregate([{
          $lookup:
              {
                  from: 'masses',
                  localField: 'Mass',
                  foreignField: '_id',
                  as: 'massdate'
              }
      }]).exec(function (err, docs) {
         
          if (!err) {
              // console.log(docs[0]);
              //  console.log(docs[0].massdate[0].Date_Of_even);
             docs.forEach(element => {
               element.Date=element.massdate[0].Date_Of_even.toISOString().slice(0,10).split("-").reverse().join("-");
               element.Time=element.massdate[0].Date_Of_even.toISOString().slice(11,16);
               element.Massid=element.massdate[0]._id;
               if(element.Accepted)
               {element.Acceptedstring="Zatwierdzono";}
               else{element.Acceptedstring="Nie zatwierdzono";}
             });
                res.render("listintention", {
                list: docs,
                
                });
               
              
           } else {
           console.log("Błąd pobierania danych /inten/list" + err)
           }
     });

  
   },
  deleteintencion: async function(req,res)
{   const{PaymentController}=require("./Payment");
    PaymentController.deletepayment({Intention:req.id})
    .then(response=>{
      if(response[0]){
        console.log("paymentdelete=>deletemassnumber")
        const{MassController}=require("./Mass");
        MassController.subtractionintens(req.Massid)
         .then(response=>{
          console.log("deletemassnumber=>deleteintens")
                if(response[0]){
        Intention.findByIdAndRemove(req.id, (err, doc) => {
        if (!err) {
          res.json({status:true});
        } else {
           console.log("Błąd podczas usuwania: " + err);
           res.json({Status: "faile",Blad:err});
        }
        })}else {
          res.json({Status: "faile",Blad:response[1]})
        }

       })
      }else {
        res.json({Status: "faile",Blad:response[1]})
      }
     
      
    })
    
},
showedit:function(req,res){
  console.log(req.id);
  id=ObjectId(req.id);
  console.log(typeof req.id);
  Intention.aggregate([{ $match: ({ _id:id })},{
    $lookup:
        {
            from: 'masses',
            localField: 'Mass',
            foreignField: '_id',
            as: 'massdate'
        }
}
]).exec(function (err, docs) {
  docs[0].Date=docs[0].massdate[0].Date_Of_even.toISOString().slice(0,10).split("-").reverse().join("-");
 docs[0].Time=docs[0].massdate[0].Date_Of_even.toISOString().slice(11,16);
    if (!err) {
      console.log(docs);
      console.log(docs[0].massdate[0]);
    
     res.render("addoreditIntention",{
      viewTitle:"Edycja Intencji",
       action:"/inten/update",
       Intention:docs[0],
       massdate:docs[0].massdate[0]
      
    });
  }
    else{
        console.log("something wrong with showedit mass");
        res.send(err);
    } });
},
update:function(req,res){
 // console.log(req.Accepted);
 var data={Textintens:req.Textintens};
 var id=ObjectId(req._id);
 if(req.Accepted==undefined){
  
  data.Accepted=false;
 }else{
  data.Accepted=true;
 }
 console.log(data);
 
 Intention.findOneAndUpdate(
  { _id:id },data,
  (err, doc) => {
    
  if (!err) {
    res.redirect("/inten/list")
  } else {
  console.log("Błąd podczas edycji Mszy: " + err)
  res.send("Coś nie tak z edycją intencji")
  }
  })

}
}
   module.exports={IntentionShema,Intention,IntentionController};