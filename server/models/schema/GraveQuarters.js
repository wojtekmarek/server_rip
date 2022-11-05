
const mongoose = require("mongoose");
const {OvnerRip} = require("./OvnerRip");

const GraveQuartersSchema = new mongoose.Schema({
    IdGraveQuaters:{type: Number, required:true},
    TypeOF:{type: String , enum:["murowany","ziemny"]},
    Payment:{type: Boolean},
    ovnerripid:{type: String, required:true},
    NumberenableTraditionalBurials:{type: Number, required:true},
    NumberenableUrnBurials:{type: Number, required:true},
    NumberTraditionalBurials:{type: Number, required:true},
    NumberUrnBurials:{type: Number, required:true},
    DatePayment:{type:Date},
    MethodOfPayment:{type: String , enum:["gotówka","przelew","blik"]}
   })
   const GraveQuarters= mongoose.model("GraveQuarters", GraveQuartersSchema);
   
   function insert(req, res) {

    //console.log("adquater"+req.body.IdGraveQuaters);
    var gravequarter = new GraveQuarters()
    gravequarter.IdGraveQuaters=req.body.IdGraveQuaters
    gravequarter.TypeOF=req.body.TypeOF
    gravequarter.Payment=req.body.Payment
    gravequarter.ovnerripid=req.body.ovnerripid
    gravequarter.NumberenableTraditionalBurials=req.body.NumberenableTraditionalBurials
    gravequarter.NumberenableUrnBurials=req.body.NumberenableUrnBurials
    gravequarter.NumberTraditionalBurials=req.body.NumberTraditionalBurials
    gravequarter.NumberUrnBurials=req.body.NumberUrnBurials
    gravequarter.DatePayment=new Date(req.body.DatePayment.split("-").reverse().join("-")+"T14:48:00.000+09:00")
    gravequarter.MethodOfPayment=req.body.MethodOfPayment
    
    gravequarter.save((err, doc) => {
    if (!err) {
    res.redirect("/gravequarters/list")
    } else {
    console.log("Błąd podczas dodawania GraveQuarters: " + err)
    }
    })
   }

   function update(req, res) {
    console.log("updatequater");
    console.log(req.body);
    req.body.DatePayment=new Date(req.body.DatePayment.split("-").reverse().join("-")+"T14:48:00.000+09:00");
    console.log(req.body);
    GraveQuarters.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    (err, doc) => {
    if (!err) {
    res.redirect("/gravequarters/list")
    } else {
    console.log("Błąd podczas aktualizowania danych: " + err)
    }
    }
    )
}
async function showedit(req,res){
   
    GraveQuarters.findById(req.params.id, (err, doc) => {
       
            
        
        if (!err) {
            
             var gravedate=doc.DatePayment.toISOString().slice(0,10).split("-").reverse().join("-");
             
            OvnerRip.find((err,listu)=>{
                if (!err) {
                    
                    res.render("addOrEditgrave", {
                    viewTitle: "Zaktualizuj dane kwatery",
                    action:"/gravequarters/addtomongobase",
                    GraveQuarters: doc,
                    listu: listu,
                    defaultid:"block",
                    pickid:"none",
                    GraveQuartersdate:gravedate,
                    showaddburial:""
                   
                    
    
                    });
                }else {
                    console.log("Błąd pobierania danych user" + err)
                    }
            })
        }})
}
async function showadd(req,res)

{    
    GraveQuarters.find({}, {IdGraveQuaters:1, _id:0},(err, docs) => {
        if (!err) {
            
            var listid=[];
           var listallid= [];
           var listidenable=[];           
            for(let i=0;i <150; i++){
                listallid.push(i+1);
            }
            docs.forEach(x =>{
                listid.push(x.IdGraveQuaters);
                
            });      
            listid.sort();           
            //console.log(listid);   
          //  console.log(listid.length); 
            
     var k=0;
        for(j=0;j<listallid.length;)
        {   
             //  console.log(listallid[j]);   
//console.log(listid[k]); 
                if(listallid[j]==listid[k])
                {
                   
                    j++;
                    k++;
                    //listidenable.splice(j,1);
                }else{
                    listidenable.push(j+1);
                    j++;
                    
                }

            }
    
    
    OvnerRip.find((err,listu)=>{
        if (!err) {
           
     //      console.log(listidenable);
            res.render("addOrEditgrave", {
                viewTitle: "Dodaj kwatere",
                action:"/gravequarters/addtomongobase",
                listu: listu,
                listid:listidenable,
                defaultid:"none",
                pickid:"block",
                showaddburial:"disabled"
                

                
                })
           
            }
       else {
            console.log("Błąd pobierania danych user" + err)
            }
    })
            
}})
}
async function deletegrave(reg,res)
{
    GraveQuarters.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
        res.redirect("/gravequarters/list")
        } else {
        console.log("Błąd podczas usuwania: " + err)
        }
        })
}
async function showlist(req,res){
   
    OvnerRip.find((err,listu)=>{
        if (!err) {
            //console.log("ok");
        }});
   
    
   
    GraveQuarters.find((err, docs) => {
        if (!err) {
           
             res.render("listgrave", {
             list: docs,
             
             })
            
           
        } else {
        console.log("Błąd pobierania danych /gravequarters/list" + err)
        }
        })
}
function checkburial(req,res){
    console.log("in check gravelist");
    GraveQuarters.find((err, docs) => {
        if (!err) {
             var  listtosend=[];
             var i=0;
            docs.forEach(element => {
                //console.log(Number(element.NumberUrnBurials));
               // console.log( Number(element.NumberTraditionalBurials));
                if(Number(element.NumberUrnBurials)>0 || Number(element.NumberTraditionalBurials)>0){
                    listtosend[i]=true;
                    i++;

                }else{
                    listtosend[i]=false;
                    i++;
                }
                
            });
            console.log(typeof docs);
             res.send(listtosend);
            
           
        } else {
            res.status(500).send({ message: "Blad serwera nie pobrano listy grobow" });
        }
        })
}
const findnotpay= async ()=>
{
    return new Promise((resolve, reject) => {
    let now= new Date();
    //console.log(now);
    var weekago= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6);
    GraveQuarters.find({ 
        DatePayment: {
            
            $lt: weekago
        }
    } ,{_id:0, IdGraveQuaters:1, ovnerripid:1, DatePayment:1}
    ,(err, docs) => {
        if (!err) {
            console.log(docs);
            
            resolve(docs);
        
       
      
   } else {
   console.log("Błąd pobierania danych /gravequarters/list" + err)
   resolve(err);
   }
   })})
}
async function setnotpay(){
    let now= new Date();
    
    GraveQuarters.find({ //query today up to tonight
        DatePayment: {
            
            $lt: wnow
        }
    } ,{_id:0,Payment:1}
    ,(err, docs) => {
        if (!err) {
            //console.log(docs);
           return docs;
        
       
      
   } else {
   console.log("Błąd pobierania danych /gravequarters/list" + err)
   }
   })
}
   module.exports={GraveQuarters,GraveQuartersSchema,update, insert,showadd,showedit,deletegrave,showlist,checkburial,findnotpay}