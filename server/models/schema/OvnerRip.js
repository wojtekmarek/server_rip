const { User } = require("./User");


const mongoose = require("mongoose");

const OvnerRipSchema = new mongoose.Schema({
    Name: { type: String, require },
    LastName: { type: String, require },
    email: { type: String, required: true },
    Street: { type: String, require },
    HomeNumber: { type: String, require },
    HometwoNumber: { type: String, require },
    city: { type: String, require },
    Pesel: { type: String, require },
    ovner: { type: String, default: "nieznany" }
})
const OvnerRip = mongoose.model("OvnerRip", OvnerRipSchema);
const OvnerRipController = {
    deleteovnerrip: function (req, res) {
        console.log(req.email);
        const { GraveQuarters } = require("./GraveQuarters");
        GraveQuarters.find({ ovnerripid: req.email }, (err, doc) => {
            if (!err && doc[0] != undefined) {
                
                console.log(typeof doc[0]);
                console.log("nie można usunąć");
                res.sendStatus(207);
                //res.redirect("/ovnerrip/list/?error:nodelete");
            } else {
                //console.log(" można usunąć");
                OvnerRip.findByIdAndRemove(req.id, (err, doc) => {
                    if (!err) {
                        res.sendStatus(200);
                        //res.redirect("/ovnerrip/list");
                    } else {
                        console.log("Błąd podczas usuwania: " + err);
                    }
                })
            }
        })

    },
    checkbeforedeleteuser: function (req) {
        return new Promise((resolve, reject) => {
            OvnerRip.findOne({ email: req.email }, (err, doc) => {
                console.log(doc);
                if (!err) {
                    if (doc !== null) {
                        resolve(true);
                    } else {

                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            })
        })
    },
    showadd: function (req, res) {
        var sendlist=[];
           User.aggregate([{
      $lookup:
      {
        from: 'ovnerrips',
        localField: 'email',
        foreignField: 'email',
        as: 'ovner'
      }
    }]).exec(function (err, docs) {

      if (!err&&docs[0]!==undefined) {
        console.log(docs);
        docs.forEach(element=>{
            console.log(element.ovner[0])
            if(element.ovner[0]===undefined&&element.status)
            {sendlist.push(element);}
        })
        console.log(sendlist);
        res.render("addoredit", {
            viewTitle: "Dodaj Dysponeta kwatery",
            action: "/ovnerrip/addtomongobase",
            listu: sendlist,
            editdisable: "",
            editvisibleselect: "block",
            editdisableinput: "none"
        })

      }else {
        console.log("Błąd pobierania danych user" + err)
    }
    })
       
    },

    saveuserdata: async function (req, res) {
        console.log(req);
        OvnerRip.findOneAndUpdate({ email: req.email }, {

            Name: req.Name,
            LastName: req.LastName,
            email: req.email,
            Street: req.Street,
            HomeNumber: req.HomeNumber,
            HometwoNumber: req.HometwoNumber,
            city: req.city,
            Pesel: req.Pesel

        }, (err, doc) => {
            if (!err) {
                res.status(200);
                res.send("Ok");

            } else {
                console.log("Błąd podczas edycji OvnerRipa: " + err)
            }
        })
    }
}
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
    ovnerRip.ovner = req.body.ovner
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

async function getovnerriptoclient(req, res) {
    //dopisactokeny
    console.log(req.email);
    if (req.email !== undefined) {
       OvnerRip.find({ email: req.email },(err,doc)=>{
        if (!err) {
             console.log(doc);
            res.send(doc);

        } else {
            console.log("Błąd pobierania danych dla klienta uzytkownika ")
            res.send("niepobrano")
        }
       })


        
    }
}

function getlistovnernew(res) {
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
        for (let val of docs.entries()) {
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
function getlist(res) {
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
function showedit(req, res) {
    OvnerRip.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("addoredit", {
                viewTitle: "Zaktualizuj dane Dysponeta kwatery",
                OvnerRip: doc,
                action: "/ovnerrip/addtomongobase",
                editdisable: "disabled",
                editvisibleselect: "none",
                editdisableinput: "block"
            });
        }
    })
}

async function findburialtoclientindb(doc, i) {
    var { Burial } = require("./Burials");
    return new Promise((resolve, reject) => {
        Burial.find({ GraveQuartersnumber: doc.IdGraveQuaters }, (err, docs) => {
            if (!err) {
                console.log(i);
                console.log("wysz");
                // console.log(doc[i]);

                resolve(docs);
            }
            else {
                console.log("Błąd wyszukiwania pochowku  dla klienta " + err);
            }
        })
    })
}
async function findburialtoclient(doc) {

    return new Promise(async (resolve, reject) => {
        var list = {};
        //console.log(typeof doc);


        //console.log(list.burial);
        //console.log(list);


        // console.log(Object.keys(doc).length);
        for (var i = 0; (i + 1) < Object.keys(doc).length; i++) {
            //console.log(i);

            if (doc[i].NumberUrnBurials > 0 || doc[i].NumberTraditionalBurials > 0) {  // console.log(i +"pobieranie");

                //console.log("szukam pochowkow dla klienta");
                const check = await findburialtoclientindb(doc[i], i)
                    .then(response => {
                        // console.log(response);
                        list[i] = Object.assign(
                            {
                                "_id": doc[i]._id,
                                "IdGraveQuaters": doc[i].IdGraveQuaters,
                                "TypeOF": doc[i].TypeOF,
                                "Payment": doc[i].Payment,
                                "ovnerripid": doc[i].ovnerripid,
                                "DatePayment": doc[i].DatePayment,
                                "NumberTraditionalBurials": doc[i].NumberTraditionalBurials,
                                "NumberUrnBurials": doc[0].NumberUrnBurials,
                                "NumberenableTraditionalBurials": doc[i].NumberenableTraditionalBurials,
                                "NumberenableUrnBurials": doc[i].NumberenableUrnBurials,
                                "MethodOfPayment": doc[i].MethodOfPayment
                            },
                            { "Burial": response }
                        );


                    })



                // return list[i];



                // return list[i]={"text":"Błąd wyszukiwania pochowku  dla klienta " , err};

            } else {
                //console.log(i +"nie trzeba pobieranie");
                list[i] = Object.assign(
                    {
                        "_id": doc[i]._id,
                        "IdGraveQuaters": doc[i].IdGraveQuaters,
                        "TypeOF": doc[i].TypeOF,
                        "Payment": doc[i].Payment,
                        "ovnerripid": doc[i].ovnerripid,
                        "DatePayment": doc[i].DatePayment,
                        "NumberTraditionalBurials": doc[i].NumberTraditionalBurials,
                        "NumberUrnBurials": doc[0].NumberUrnBurials,
                        "NumberenableTraditionalBurials": doc[i].NumberenableTraditionalBurials,
                        "NumberenableUrnBurials": doc[i].NumberenableUrnBurials,
                        "MethodOfPayment": doc[i].MethodOfPayment
                    },
                    { "Burial": [] }
                );

            }

        }

        resolve(list);


    })
}
async function getburialforclient(req, res) {
    console.log(req);
    const { GraveQuarters } = require("./GraveQuarters");

    GraveQuarters.find({ ovnerripid: req }, async (err, doc) => {
        if (!err) {
            console.log(doc);

            if (doc[0] != undefined) {
                const listtosend = await findburialtoclient(doc)
                    .then(response => {

                        res.send(response);
                    })

            } else {
                res.status(404);
                res.send("uzytkownik nie ma kwater");
            }
        } else {
            console.log("Błąd wyszukiwania kwater dla klienta " + err);
            res.status(300);

        }
    })

}

module.exports = { OvnerRip, update, insert, getovnerriptoclient, getlistovnernew, getlist, showedit, getburialforclient, OvnerRipController }