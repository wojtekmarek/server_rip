const {OvnerRip}=require("./OvnerRip")
const mongoose = require("mongoose");
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
   const GraveQuarters= mongoose.model("GraveQuarters", GraveQuartersSchema)
 
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
    gravequarter.DatePayment=req.body.DatePayment
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
    GraveQuarters.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
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
                    GraveQuartersdate:gravedate
                   
                    
    
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
            listgrave=docs;
           let  listid= [];
           var listidenable=[];           
            for(let i=0;i <10; i++){
                listidenable.push(i+1);
            }
            docs.forEach(x =>{
                listid.push(x.IdGraveQuaters);
                
            });      
           /* console.log(docs);   
            console.log(listid);   
            console.log(listid.length); 
            */ 
            var to_erase=[];

            for(j=0;j<listidenable.length;j++)
            {
                for(k=0;k<listid.length;k++)
                {
                    if(listidenable[j]==listid[k])
                    {
                        
                        listidenable.splice(j,1);
                    }

                }
            }
      
        }
       
    
    OvnerRip.find((err,listu)=>{
        if (!err) {
           
           //console.log(listidenable);
            res.render("addOREditgrave", {
                viewTitle: "Dodaj kwatere",
                action:"/gravequarters/addtomongobase",
                listu: listu,
                listid:listidenable,
                defaultid:"none",
                pickid:"block",
                

                
                })
           
            }
       else {
            console.log("Błąd pobierania danych user" + err)
            }
    })
            
})
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
   module.exports={GraveQuarters,update, insert,showadd,showedit,deletegrave,showlist}