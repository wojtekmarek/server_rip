const router = require("express").Router()
const {User,update,insert,UserController} = require('../models/schema/User')

router.get("/saveuserdata",(req,res)=>{
       console.log(req.query);
       UserController.saveuserdata(req.query,res);
       

})
router.get("/userdata",async (req, res) => {
              const {id} = req.query;
              console.log(id)
            const user =  await User.findById(id)
      
               if (user) {
                     console.log(user);
                     res.json(user);
              
              } else {
                     console.log("Błąd pobierania danych" )
                     res.send("niepobrano")
                     }
               })
      
       router.get("/listuser", (req, res) => {
        User.find((err, docs) => {
        if (!err) {
           
        res.render("listuser", {
        list: docs
       
        })
        } else {
        console.log("Błąd pobierania danych" + err)
        }
        })
       })
       router.get("/addoreditu", (req, res) => {
        res.render("addoreditu", {
        viewTitle: "Dodaj uzytkownika",
        action:"/userdb/addtomongobaseu"
        
        })
       })
       router.post("/addtomongobaseu", (req, res) => {
        if (req.body._id == "") {
        insert(req, res)
        } else {
        update(req, res)
        }
       })
       router.post("/registeruser", (req, res) => {
        //add validate data
        UserController.register(req.body, res)
        //dodac przekierowanie
       })
      
       router.get("/:id", (req, res) => {
        User.findById(req.params.id, (err, doc) => {
        if (!err) {
            //  console.log(doc);
        res.render("addoreditu", {
        viewTitle: "Zaktualizuj dane uzytkownika",
       User: doc,
       action:"/userdb/addtomongobaseu"

        });
        }
        })
       })
       router.get("/deleteuser/:id", (req, res) => {
        User.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
        res.redirect("/userdb/listuser")
        } else {
        console.log("Błąd podczas usuwania: " + err)
        }
        })
       })
    
module.exports = router