const router = require("express").Router()
const{GraveQuarters,update,insert}=require("../models/schema/GraveQuarters")
const {OvnerRip}=require("../models/schema/OvnerRip")


router.get("/list", (req, res) => {
    GraveQuarters.find((err, docs) => {
    if (!err) {
       
         res.render("listgrave", {
         list: docs,
         
         })
        
       
    } else {
    console.log("Błąd pobierania danych /gravequarters/list" + err)
    }
    })
   })
   router.get("/addOrEdit", (req, res) => {
    OvnerRip.find((err,listu)=>{
        if (!err) {
            res.render("addOREditgrave", {
                viewTitle: "Dodaj kwatere",
                action:"/gravequarters/addtomongobase",
                listu: listu
                })
           
            }
       else {
            console.log("Błąd pobierania danych user" + err)
            }
    })
    
   })
   router.post("/addtomongobase", (req, res) => {
    if (req.body._id == "") {
    insert(req, res)
    } else {
    update(req, res)
    }
   })
   router.get("/:id", (req, res) => {
    GraveQuarters.findById(req.params.id, (err, doc) => {
    if (!err) {
    res.render("addOrEditgrave", {
    viewTitle: "Zaktualizuj dane kwatery",
    GraveQuarters: doc
    });
    }
    })
   })
   router.get("/delete/:id", (req, res) => {
    GraveQuarters.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
    res.redirect("/gravequarters/list")
    } else {
    console.log("Błąd podczas usuwania: " + err)
    }
    })
   })

module.exports = router