const { User } = require("./User");


const mongoose = require("mongoose");
const OvnerRipSchema = new mongoose.Schema({
    Name: {type: String},
    LastName:{type: String},
    email: {type: String, required:true,unique:true},
    Street:{type: String},
    HomeNumber: {type: Number},
    HometwoNumber:{type: Number},
    city: {type: String},
    Pesel:{type: Number},
    ovner:{type: String,default:"nieznany"}
   })
   const OvnerRip = mongoose.model("OvnerRip", OvnerRipSchema);
   
   function insert(req, res) {
    var ovnerRip = new OvnerRip()
    ovnerRip.Name = req.body.Name
    ovnerRip.LastName = req.body.LastName
    ovnerRip.email = req.body.email
    ovnerRip.Street = req.body.Street
    ovnerRip.HomeNumber = req.body.HomeNumber
    ovnerRip.HometwoNumber = req.body.HometwoNumber
    ovnerRip.city = req.body.city
    ovnerRip.Pesel = req.body.Pesel
    ovnerRip.ovner=req.body.ovner
    ovnerRip.save((err, doc) => {
    if (!err) {
    res.redirect("/ovnerrip/list")
    } else {
    console.log("Błąd podczas dodawania OvnerRipa: " + err)
    }
    })
   }
   function update(req, res) {
    OvnerRip.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
    if (!err) {
    res.redirect("/ovnerrip/list")
    } else {
    console.log("Błąd podczas aktualizowania danych: " + err)
    }
    }
    )
    }
    function showadd(req,res){
        User.find({status:true},(err,listu)=>{
            if (!err) {
                res.render("addOrEdit", {
                    viewTitle: "Dodaj Dysponeta kwatery",
                    action:"/ovnerrip/addtomongobase",
                    listu: listu,
                    editdisable:"",
                    editvisibleselect:"block",
                    editdisableinput:"none"
                    })
               
                }
           else {
                console.log("Błąd pobierania danych user" + err)
                }
        })
    }

   async function getovnerriptoclient(req,res){
     //dopisactokeny
     const {email} = req.query;
    // console.log(email) 
     if(email!==undefined){
       const ovner=  await OvnerRip.find({email:email})

        if (ovner) {
           // console.log(ovner);
            res.json(ovner);
     
        } else {
            console.log("Błąd pobierania danych" )
            res.send("niepobrano")
            }
     }
   }

  function getlistovnernew(res){
    OvnerRip.aggregate([{
        $lookup:
            {
                from: 'gravequarters',
                localField: 'email',
                foreignField: 'ovnerripid',
                as: 'quaters'
            }
    }]).exec(function (err, docs) {
       // console.log(docs);
        for(let val of docs.entries()){
         //   console.log(val[1].quaters);
        }


        if (!err) {
           // console.log(docs);
            res.render('listovnernew', {
                list: docs
            });
        } else {
            console.log('Błąd pobierania danych' + err);
        }
    });


  }
    function getlist(res){
        OvnerRip.find((err, docs) => {
            if (!err) {
               //docs.forEach(x=>console.log(x.email));
                 res.render("list", {
                 list: docs,
                 
                 })
                
               
            } else {
            console.log("Błąd pobierania danych" + err)
            }
            })
    }      
    function showedit(req,res){
        OvnerRip.findById(req.params.id, (err, doc) => {
            if (!err) {
            res.render("addOrEdit", {
            viewTitle: "Zaktualizuj dane Dysponeta kwatery",
            OvnerRip: doc,
            action:"/ovnerrip/addtomongobase",
            editdisable:"disabled",
            editvisibleselect:"none",
            editdisableinput:"block"
            });
            }
            })
    }
    function deleteovnerrip(req,res)
    {  
        console.log(req.params.email);
        const{GraveQuarters}=require("./GraveQuarters");
        GraveQuarters.find({ovnerripid:req.params.email},(err, doc) => {
            if(!err&&doc[0]!=undefined){
                console.log(typeof doc[0]);
                console.log("nie można usunąć");
                res.redirect("/ovnerrip/list/?error:nodelete");
            }else {
                //console.log(" można usunąć");
                 OvnerRip.findByIdAndRemove(req.params.id, (err, doc) => {
            if (!err) {
            res.redirect("/ovnerrip/list/?error:nodelete");
            } else {
            console.log("Błąd podczas usuwania: " + err);
            }
            }) 
            }})
       
    }
 
   module.exports={OvnerRip,update, insert,showadd,getovnerriptoclient,getlistovnernew,getlist,showedit,deleteovnerrip}