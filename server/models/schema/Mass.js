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
         res.render("addoreditMass",{
           action:"/mass/addtodb",
           Mass:doc,
           today:today
        });
      }
        else{

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
   
       
       mass.save((err, doc) => {
       if (!err) {
       res.redirect("/mass/list")
       } else {
       console.log("Błąd podczas dodawania Mszy: " + err)
       }
       })
  },
  showadd:function (req,res){
    res.render("addoreditMass",{
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
   addintenciontomass:function(mass,Number_enable_intensions,Number_intension){
    console.log(mass+" "+Number_enable_intensions+" "+Number_intension);
    // res.send({"intencion_ available":true});
    const { IntentionController } = require("./Intention");
    IntentionController.find({Mass_id:req}, (err, doc) => {})


   },
       checkavailableaddinstans:function(req,res){
      //console.log(req);
      Mass.findById(req.idmass,(err,doc)=>{
        if(!err){
          if(doc.Number_enable_intensions>doc.Number_intension)
            { //console.log(doc);
              this.addintenciontomass(req.idmass,doc.Number_enable_intensions,doc.Number_intension);
          }else{
            console.log({"intencion_ available":false});
           
            //res.send({"intencion_ available":false});
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
    }

  }
  
   
   
   module.exports={Mass,MassSchema,MassController};