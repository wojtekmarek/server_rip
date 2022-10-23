const mongoose = require("mongoose");
var Schema= mongoose.Schema;
const {GraveQuarters}=require("./GraveQuarters")
const BurialSchema = new mongoose.Schema({
    
    Burialtype:{type: String , enum:["Tradycyjny","Urnowy"], required:true},
    Namedeceased:{type: String, required:true},
    LastNamedeceased:{type: String, required:true},    
    DateOfDeath:{type:Date, required:true},
    DateBurial:{type:Date, required:true},
    GraveQuaters:{type: Schema.Types.ObjectId, ref: 'GraveQuartersSchema', required:true},
    GraveQuartersnumber:{type: Number, required:true}


   })
   const Burial = mongoose.model("Burial", BurialSchema);
  
   async function showlist(req,res){

    Burial.find((err, docs) => {
        if (!err) {
           
             res.render("listburial", {
             list: docs,
             
             })
            
           
        } else {
        console.log("Błąd pobierania danych /gravequarters/list" + err)
        }
        })
   }

   async function showedit(req,res){
   
    Burial.findById(req.params.id, (err, doc) => {
       
            
        
        if (!err) {
           
            
             var dateofdeath=doc.DateOfDeath.toISOString().slice(0,10).split("-").reverse().join("-");
             var dateburial=doc.DateBurial.toISOString().slice(0,10).split("-").reverse().join("-");
             
             GraveQuarters.findById(GraveQuaters,"IdGraveQuaters",(err,gravequarterid)=>{
                if (!err) {
                    
                    res.render("addOrEditgrave", {
                    viewTitle: "Zaktualizuj dane pochówku",
                    action:"/gravequarters/addtomongobase",
                    GraveQuarters: doc,
                    listu: listg,
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
async function showadd(req,res){
    //console.log(req);
    if(req==undefined)
    {
        GraveQuarters.find({},'IdGraveQuaters NumberenableUrnBurials NumberenableTraditionalBurials'
        +' NumberUrnBurials NumberTraditionalBurials',(err,doc)=>{
            if (!err) {
                res.render("addOrEditBurial", {
                    viewTitle: "Dodaj pochówek",
                    action:"/burial/addtomongobase",                
                    addingviaquarters:false,
                    addingvianewburial:true,
                    GraveQuarters: doc});
               
               
               
            }else{
                console.log("Błąd pobierania danych user" + err);}
        });


    }else{
        GraveQuarters.findById(req,'IdGraveQuaters NumberenableUrnBurials'
        +' NumberenableTraditionalBurials NumberUrnBurials NumberTraditionalBurials',(err,doc)=>{
            if (!err) {
                res.render("addOrEditBurial", {
                    viewTitle: "Dodaj pochówek",
                    action:"/burial/addtomongobase",                
                    addingviaquarters:true,
                    addingvianewburial:false,
                    GraveQuarters: doc});
               
               
               
            }else{
                console.log("Błąd pobierania danych user" + err);}
        });
    }
    
   
}
async function showlistclient(req,res){
    res.send("W opracowaniu");
}

async function findburial(req,res){
    res.send("W opracowaniu");
}
function burialexhumation(req,res){

}
   module.exports={Burial,showlist,showedit,showadd,showlistclient,findburial,burialexhumation}