const router = require("express").Router();
const {OvnerRip,update,insert} = require('../models/schema/OvnerRip');
const { User } = require("../models/schema/User");
const{GraveQuarters}=require("../models/schema/GraveQuarters");


    
/*
    router.post("/", async (req, res) => {
        try {
            const { error } = validate(req.body)
            if (error)
                return res.status(400).send({ message: error.details[0].message })
            const user = await User.findOne({ email: req.body.email })
            if (user)
                return res
            .status(409)
            .send({ message: "Użytkownik o takim emailu istnieje!" })
            const salt = await bcrypt.genSalt(Number(process.env.SALT))
             const hashPassword = await bcrypt.hash(req.body.password, salt)
            await new User({ ...req.body, password: hashPassword }).save()
            res.status(201).send({ message: "Utworzono użytkownika" })
        } catch (error) {
             res.status(500).send({ message: "Wewnętrzny błąd serwera" })
        }
    })*/ 
          router.get("/title", (req, res) => {
        res.send(`
        <h3 style="text-align:center">Baza danych OvnerRipów</h3>
        <h4 style="text-align:center">Kliknij <a href="/ovnerrip/list"> tutaj</a>, aby uzyskać dostęp do bazy.</h4>`)
       });
       
         router.get("/listovnernew", (req, res) => {
                    OvnerRip.aggregate([{
                        $lookup:
                            {
                                from: 'gravequarters',
                                localField: 'email',
                                foreignField: 'ovnerripid',
                                as: 'quaters'
                            }
                    }]).exec(function (err, docs) {
                        console.log(docs);
                        for(let val of docs.entries()){
                            console.log(val[1].quaters);
                        }
                
                
                        if (!err) {
                            res.render('listovnernew', {
                                list: docs
                            });
                        } else {
                            console.log('Błąd pobierania danych' + err);
                        }
                    });
             });

       router.get("/getdataovnerrip",async (req,res) =>{
        //dopisactokeny
        const {email} = req.query;
              console.log(email) 
              if(email!==undefined){
                const ovner=  await OvnerRip.find({email:email})
      
                 if (ovner) {
                     console.log(ovner);
                     res.json(ovner);
              
                 } else {
                     console.log("Błąd pobierania danych" )
                     res.send("niepobrano")
                     }
              }
            
               })
       
       router.get("/list", (req, res) => {
        OvnerRip.find((err, docs) => {
        if (!err) {
           
             res.render("list", {
             list: docs,
             
             })
            
           
        } else {
        console.log("Błąd pobierania danych" + err)
        }
        })
       })
       router.get("/addOrEdit", (req, res) => {
        User.find({status:true},(err,listu)=>{
            if (!err) {
                res.render("addOrEdit", {
                    viewTitle: "Dodaj OvnerRipa",
                    action:"/ovnerrip/addtomongobase",
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
        OvnerRip.findById(req.params.id, (err, doc) => {
        if (!err) {
        res.render("addOrEdit", {
        viewTitle: "Zaktualizuj dane Dysponeta kwatery",
        OvnerRip: doc
        });
        }
        })
       })
       router.get("/delete/:id", (req, res) => {
        OvnerRip.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
        res.redirect("/ovnerrip/list")
        } else {
        console.log("Błąd podczas usuwania: " + err)
        }
        })
       })
    
module.exports = router