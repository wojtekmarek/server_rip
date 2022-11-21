const res = require("express/lib/response");
const mongoose = require("mongoose");
const { showedit } = require("./Exhumation");


const MassSchema = new mongoose.Schema({
    
    
    Date_Of_even:{type: Date, required:true},
    Number_enable_intensions:{type: Number, required:true,default:0},
    Number_intension:{type:Number , required:true,default:0},    
    Enable_intensions:{type: Boolean,require:true, default:false}//pole do wyszukiwania bez widoku
    
  

   });

   const Mass = mongoose.model("Mass", MassSchema);


  
   
   const MassController={
    showedit: function(req,res){
      Mass.findById(req.params.id, (err, doc) => {
       
        if (!err) {
          today=new Date();
          console.log(doc);
          doc.Date=doc.Date_Of_even.getDate()+"-"+(doc.Date_Of_even.getMonth()+1)+"-"+doc.Date_Of_even.getFullYear()
          doc.Time=(doc.Date_Of_even.getHours()-1)+":"+doc.Date_Of_even.getMinutes()
          console.log(doc.Date);
          console.log(doc.Time);
          console.log(today)
         res.render("addoreditmass",{
           action:"/mass/addtodb",
           Mass:doc,
           today:today
        });
      }
        else{
            console.log("something wrong with showedit mass")
        } });
      },
      
   addnewtodb:function (req,res){
   
   /*console.log(req.Date_Of_even);
   console.log(req.Date_Of_even.slice(6,10));
   console.log((Number(req.Date_Of_even.slice(3,5))-1).toString());
   console.log(req.Date_Of_even.slice(0,2));*/
   date=new Date(req.Date_Of_even.slice(6,10),(Number(req.Date_Of_even.slice(3,5))-1).toString(),
    req.Date_Of_even.slice(0,2),(Number(req.Time_Of_even.slice(0,2))+1).toString(),req.Time_Of_even.slice(3,5));
   console.log(date);
      var mass= new Mass()
       mass.Date_Of_even=date;
     mass.Number_enable_intensions=Number(req.Number_enable_intensions);
   if(mass.Number_enable_intensions>0)
   {mass.Enable_intensions=true;}
       
       mass.save((err, doc) => {
       if (!err) {
       res.redirect("/mass/list")
       } else {
       console.log("Błąd podczas dodawania Mszy: " + err)
       }
       })
  },
  showadd:function (req,res){
    res.render("addoreditmass",{
         action:"/mass/addtodb",
         
    });
  },
  showlist:function (req,res){
    Mass.find((err, docs) => {
        if (!err) {
          docs.forEach(element => {
            element.Date=element.Date_Of_even.toISOString().slice(0,10).split("-").reverse().join("-");
            element.Time=element.Date_Of_even.toISOString().slice(11,16);
          });

           console.log(docs);
           
             res.render("listmass", {
             list: docs,
             
             
             });
            
           
        } else {
        console.log("Błąd pobierania danych /mass/list" + err)
        }
        })
   },
   checkcandelete:function(req,res){
    console.log(req);    
    const { Intention } = require("./Intention");
    Intention.find({Mass_id:req}, (err, doc) => {
      if (!err) {
        if(doc!=[]){

          res.send({"intencion":false});
        }else{
          res.send({"intencion":true});
        }
      }
      
      else{
        console.log("Błąd pobierania danych przy usuwaniu mass" + err)
      }});
   },
   changeintensnumerinmass:function(req,date){
   //console.log(typeof Number_intension);
   return new Promise((resolve, reject) => {
   var mass={ Number_intension:Number(date.Number_intension)+1,
            Date_Of_even:date.Date_Of_even,
          Number_enable_intensions:Number(date.Number_enable_intensions),}
   if(mass.Number_enable_intensions==mass.Number_intension)
   {mass.Enable_intensions=true;}
   else{mass.Enable_intensions=false;}

   //console.log(mass);
   //console.log(typeof mass);
   
   Mass.findOneAndUpdate(
    { _id: req.Mass },
    mass, 
    (err, doc) => {
      
    if (!err) {
      resolve([true]);
    } else {
    console.log("Błąd podczas edycji Mszy: " + err)
    resolve([false,err]);
    }
    })
  });
   },
   addintenciontomass:function(req,data,res){
    //console.log(Mass+" "+Number_enable_intensions+" "+Number_intension);
    // res.send({"intencion_ available":true});
    const { IntentionController } = require("./Intention");
    var intencion_id;
    IntentionController.add(req)
    .then(respond=>{
      console.log("then1");
      console.log(respond[0]);
      //console.log(respond[1]);
      
      if(respond[0]){
        intencion_id=respond[1];
        this.changeintensnumerinmass(req,data)
           .then(respond=>{
            console.log("then2");
           console.log(respond[0]);
           const{PaymentController}=require("./Payment");
           PaymentController.createnew(req={
             Title:"Intencja",
             Status:"Utworzona",
             Amount:req.Amount,
             Intention:intencion_id
           }) 
              .then(respond=>{
                console.log("then3");
                console.log(respond[0]);
                if(respond[0]){
                 res.json({Intention:intencion_id,Payment_id:respond[1]});
                }else{
                  return false;
                }
              });
        })
       
      }else{
        res.json({err:respond[1]})
      }
     
    })
    
    //add catch


   },
       checkavailableaddinstans:function(req,res){
      //console.log(req);
      Mass.findById(req.Mass,(err,doc)=>{
        if(!err){
          if(doc.Number_enable_intensions>doc.Number_intension)
            { //console.log(doc);
              this.addintenciontomass(req,doc,res);
          }else{
            //console.log({"intencion_ available":false});
           
            res.send({"intencion_ available":false});
          }
        }else{
          console.log("Błąd pobierania danych przy sprawdzeniu dostepnosciintenci mass" + err)
        }
      }
      )
    },
    availablemass:function(req,res){
     
        let now= new Date();
        Mass.find({ 
          Date_Of_even: {
                
                $gt: now
            },
            Enable_intensions:true

        } ,{_id:1, Date_Of_even:1}
        ,(err, docs) => {
            if (!err) {
                console.log(docs);
                
                res.send(docs);
            
           
          
       } else {
       console.log("Błąd pobierania dostępnych mszy intencjit" + err)
       res.status(404);
       }
       })
    },
    delete:function(req,res){
      Mass.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
        res.json({status:true});
        } else {
        console.log("Błąd podczas usuwania mszy: " + err);
        }
        }) 
    },
    subtractionintens:function(req,res){
      return new Promise((resolve, reject) => {
        Mass.findOneAndUpdate(
          { _id: req },
          {"$inc": {"Number_intension":-1}}, 
          (err, doc) => {
            
          if (!err) {
            resolve([true]);
          } else {
          console.log("Błąd podczas edycji Mszy: " + err)
          resolve([false,err]);
          }
          })
      })
    }

  }
  
   
   
   module.exports={Mass,MassSchema,MassController};