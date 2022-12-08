const mongoose = require("mongoose");
var Schema= mongoose.Schema;
const {Burial,BurialSchema}=require("./Burials")
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
                    res.status(404);
                    res.send("Pochówki klienta nie mają exhumacji");
                }
            }else{
                res.status(500);
                res.send("Bład pobierania exumaci dal klient"+err);
            }
        })

    }
}

async function showlist(req,res){
    
    Exhumation .find((err, docs) => {
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
}
function viewithid(req,res){
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
}
function viewwitidgrave(req,res){
    Burial.find({ GraveQuaters:req},'_id' ,(err,doc)=>{
        if (!err) {
            

            res.render("addExhumation", {
                viewTitle: "Dodaj eksumacje",
                action:"/exhumation/addtomongobase" ,
                listburial:doc,
                idburaildisable:"",
                idburailbool:false          
               });

}});
}
function vieadd(res){

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
   

}
async function showadd(req,res){
    //console.log(typeof req.query.name);
    //console.log(req.query.name);
 
    switch(req.query.name){
        case "add":
            //console.log(req.query.name);
            vieadd(res);
            break;
        case 'grave':
            console.log(req.query.id);
            viewwitidgrave(req.query.id,res);
                break;
        case 'burial':
            console.log(req.query.id);
            viewithid(req.query.id,res);
                break;
        case 'listdelete':
            console.log(req.query.id);
            viewithid(req.query.id,res);
                break;
       // default:res.redirect("/exhumation/list");
    }
}
async function add(req,res){
    console.log(req);
    //console.log(req.GraveQuartersnumber._id);
    
    
    let conwert_DatereBurial=req.Datereburial.split("-").reverse().join("-")+"T14:48:00.000+09:00";
    let conwert_DateExumation=req.DateExhumation.split("-").reverse().join("-")+"T14:48:00.000+09:00";
    const Datereburial = new Date(conwert_DatereBurial);
    const DateExhumation =new Date(conwert_DateExumation);
    
    //const burialdata=JSON.parse(req.BurialNumber);

   


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
  }
  function showedit(req,res){
    console.log(req);
    Exhumation.findById(req,(err,doc)=>{
        if (!err) {
            
            console.log(doc);
            console.log(doc.DateExhumation);
            doc.DateExhumation=doc.DateExhumation.toISOString().slice(0,10).split("-").reverse().join("-");
            doc.Datereburial=doc.Datereburial.toISOString().slice(0,10).split("-").reverse().join("-");
             console.log(doc[0].DateExhumation);
            res.render("addExhumation", {
                viewTitle: "Edytuj eksumacje",
                action:"/exhumation/update" ,
                listburial:doc,
                exhumation:doc,
                idburaildisable:"disabled",
                idburailbool:true    
               });
           
           
           
        }else{
            console.log("Błąd pobierania danych exumation" + err);}
    });
   

}
  
module.exports={showlist,add,showadd,showedit,ExumationController}