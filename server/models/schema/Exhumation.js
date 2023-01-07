const mongoose = require("mongoose");
var Schema= mongoose.Schema;
const {Burial,BurialSchema,BurialControler}=require("./Burials")
const ExhumationSchema = new mongoose.Schema({
    PurposeExhumation:{type: String , enum:["Przeniesienie","Badania sekcyjne","Pogłepienie grobu"], required:true},
    DateExhumation:{type:Date, require:true},
    Datereburial:{type:Date, require:true},
    ChangeOfBurialPlace:{type:Boolean,require:true},
    Visible:{type:Boolean,require:true,default:true},
    Scribe:{type:String},
    Burial:{type: Schema.Types.ObjectId, ref: 'BurialSchema', required:true},

})
const Exhumation = mongoose.model("Exhumation", ExhumationSchema);


const ExumationController={
    getdataforclient:function(req,res){
        Exhumation.find({Burial:req},(err, doc) => {
            if (!err) {
                if(doc[0]!=undefined){
                    res.status(200);
                    res.send(doc);
                }else{
                    res.status(204);
                    res.send("Pochówki klienta nie mają exhumacji");
                }
            }else{
                res.status(500);
                res.send("Bład pobierania exumaci dal klient"+err);
            }
        })

    },
      viewithid:function(req,res){
            Burial.find({ _id:req},'_id' ,(err,doc)=>{
                if (!err) {
                    
        
                    res.render("addExhumation", {
                        viewTitle: "Dodaj eksumacje",
                        action:"/exhumation/addtomongobase" ,
                        listburial:doc,
                        idburaildisable:"disabled",
                        idburailbool:true          
                       });
        
        }});
        },
        showadd:function(req,res){
            //console.log(typeof req.query.name);
            //console.log(req.query.name);
         
            switch(req.query.name){
                case "add":
                    //console.log(req.query.name);
                    this.vieadd(res);
                    break;
                case 'grave':
                    console.log(req.query.id);
                    this.viewwitidgrave(req.query.id,res);
                        break;
                case 'burial':
                    console.log(req.query.id);
                    this.viewithid(req.query.id,res);
                        break;
                case 'listdelete':
                    console.log(req.query.id);
                    this.viewithid(req.query.id,res);
                        break;
               // default:res.redirect("/exhumation/list");
            }
        },
        showlist:async function (req,res){
    
            Exhumation .find({Visible:true},(err, docs) => {
                if (!err) {
                   //console.log(docs[0]);
                   docs.forEach(element => {
                    element.DateExhumationString=element.DateExhumation.toISOString().slice(0,10).split("-").reverse().join("-");
                    element.DatereburialString=element.Datereburial.toISOString().slice(0,10).split("-").reverse().join("-");
                    
                   });
                     res.render("listexumation", {
                     list: docs,
                     
                     })
                    
                   
                } else {
                console.log("Błąd pobierania danych /Exhumation/list" + err)
                }
                })
        },
         viewwitidgrave:function(req,res){
            Burial.find({ GraveQuaters:req},'_id' ,(err,doc)=>{
                if (!err) {
                    
        
                    res.render("addExhumation", {
                        viewTitle: "Dodaj eksumacje",
                        action:"/exhumation/addtomongobase" ,
                        listburial:doc,
                        idburaildisable:"",
                        idburailbool:false          
                       });
        
        }else{
            res.send("nie znaleziono kwatery");
            console.log("nie znaleziono kwatery"+err)
        }});
        },
        vieadd:function (res){

            Burial.find({},'_id' ,(err,doc)=>{
                if (!err) {
                    
        
                    res.render("addExhumation", {
                        viewTitle: "Dodaj eksumacje",
                        action:"/exhumation/addtomongobase" ,
                        listburial:doc,
                        idburaildisable:"",
                        idburailbool:false    
                       });
                   
                   
                   
                }else{
                    console.log("Błąd pobierania danych burial" + err);}
            });
           
        
        },
       add: async function (req,res){
            console.log(req);
            //console.log(req.GraveQuartersnumber._id);
            
            
            let conwert_DatereBurial=req.Datereburial.split("-").reverse().join("-")+"T14:48:00.000+09:00";
            let conwert_DateExumation=req.DateExhumation.split("-").reverse().join("-")+"T14:48:00.000+09:00";
            const Datereburial = new Date(conwert_DatereBurial);
            const DateExhumation =new Date(conwert_DateExumation);
            
            //const burialdata=JSON.parse(req.BurialNumber);
            if(req.PurposeExhumation==="Przeniesienie")
            {
                
                BurialControler.setarchiwe(req.BurialNumber);
            }
           
        
        
              var exhumation = new Exhumation()
        
              exhumation.PurposeExhumation=req.PurposeExhumation,
              exhumation.DateExhumation=DateExhumation,
              exhumation.Datereburial=Datereburial,
              exhumation.ChangeOfBurialPlace=req.ChangeOfBurialPlace,
              exhumation.Visible=true,
              exhumation.Scribe=req.Scribe,
              exhumation.Burial=req.BurialNumber,
              
            
              exhumation.save((err, doc) => {
              if (!err) {
                  res.redirect("/exhumation/list")
             
              } else {
              console.log("Błąd podczas dodawania eksumacji: " + err)
              }
              })
          }, 
          showedit: function (req,res){
            console.log(req);
           
            Exhumation.findById(req.id,(err,doc)=>{
                if (!err) {
                    
                    console.log(doc);
                    console.log(doc.DateExhumation);
                    let DateExhumation=doc.DateExhumation.toISOString().slice(0,10).split("-").reverse().join("-");
                    let Datereburial=doc.Datereburial.toISOString().slice(0,10).split("-").reverse().join("-");
                     
                    res.render("addExhumation", {
                        viewTitle: "Edytuj eksumacje",
                        action:"/exhumation/update" ,
                        listburial:[{id:doc.Burial}],
                        exhumation:doc,
                        DateExhumation:DateExhumation,
                        Datereburial:Datereburial,
                        idburaildisable:"disabled",
                        idburailbool:true,
                        edit:"disabled"  
                       });
                   
                   
                   
                }else{
                    console.log("Błąd pobierania danych exumation" + err);}
            });
           
        
        },
        update:function(req,res){
            var updatedata = {
                Scribe: req.Scribe,
                Datereburial: new Date(req.Datereburial.split("-").reverse().join("-") + "T14:48:00.000+09:00"),
                
                

            }
            //console.log(updatedata);
            Exhumation.findOneAndUpdate(
                { _id: req._idExhumation },
                updatedata,
                { new: true },
                (err, doc) => {
                    if (!err) {
                        res.redirect("/exhumation/list")
                    } else {
                        console.log("Błąd podczas aktualizowania danych eksumacji: " + err)
                    }
                }
            )
        },
        delete:function(req,res){
            Exhumation.findOneAndUpdate(
                { _id: req.id},{Visible:false}, (err, doc) => {
                if (!err) {
                    res.sendStatus(200);
                } else {
                    res.sendStatus(500);
                    console.log("Błąd podczas usuwania: " + err)
                }
            })
        }
        
}

/* do updateif(req.PurposeExhumation==="Przeniesienie")
            {
                
                BurialControler.setarchiwe(req.BurialNumber);
            } */





  
module.exports={ExumationController}