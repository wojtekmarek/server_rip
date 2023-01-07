
const res = require("express/lib/response");
const mongoose = require("mongoose");
const { OvnerRip } = require("./OvnerRip");
//lista wszystkich kwater
var listallid = [];
for (let i = 0; i < 185; i++) {
    listallid.push(i + 1);
}

const GraveQuartersSchema = new mongoose.Schema({
    IdGraveQuaters: { type: Number, required: true },
    TypeOF: { type: String, enum: ["murowany", "ziemny"] },
    Payment: { type: Boolean },
    ovnerripid: { type: String, required: true },//change type fiel to ovneripname
    NumberenableTraditionalBurials: { type: Number, required: true },
    NumberenableUrnBurials: { type: Number, required: true },
    NumberTraditionalBurials: { type: Number, required: true },
    NumberUrnBurials: { type: Number, required: true },
    DatePayment: { type: Date },
    MethodOfPayment: { type: String, enum: ["gotówka", "przelew", "blik"] }
})
const GraveQuarters = mongoose.model("GraveQuarters", GraveQuartersSchema);
const { Burial } = require("./Burials");

const GraveController = {
    addburialls: function (req, res) {

        if (req == undefined) {
            GraveQuarters.find({}, 'IdGraveQuaters NumberenableUrnBurials NumberenableTraditionalBurials'
                + ' NumberUrnBurials NumberTraditionalBurials', (err, doc) => {
                    if (!err) {
                        res.render("addburial", {
                            viewTitle: "Dodaj pochówek",
                            action: "/burial/addtomongobase",
                            addingviaquarters: false,
                            addingvianewburial: true,
                            GraveQuarters: doc,
                            burialtype:false,
                            stateedit:false
                        });



                    } else {
                        console.log("Błąd pobierania danych user" + err);
                    }
                });


        } else {
            GraveQuarters.findById(req, 'IdGraveQuaters NumberenableUrnBurials'
                + ' NumberenableTraditionalBurials NumberUrnBurials NumberTraditionalBurials', (err, doc) => {
                    if (!err) {
                        res.render("addBurial", {
                            viewTitle: "Dodaj pochówek",
                            action: "/burial/addtomongobase",
                            addingviaquarters: true,
                            addingvianewburial: false,
                            GraveQuarters: doc
                        });



                    } else {
                        console.log("Błąd pobierania danych user" + err);
                    }
                });
        }
    },
    insert: function (req, res) {

        //console.log("adquater"+req.body.IdGraveQuaters);
        var gravequarter = new GraveQuarters()
        gravequarter.IdGraveQuaters = req.body.IdGraveQuaters
        gravequarter.TypeOF = req.body.TypeOF
        gravequarter.Payment = req.body.Payment
        gravequarter.ovnerripid = req.body.ovnerripid
        gravequarter.NumberenableTraditionalBurials = req.body.NumberenableTraditionalBurials
        gravequarter.NumberenableUrnBurials = req.body.NumberenableUrnBurials
        gravequarter.NumberTraditionalBurials = 0
        gravequarter.NumberUrnBurials = 0
        gravequarter.DatePayment = new Date(req.body.DatePayment.split("-").reverse().join("-") + "T14:48:00.000+09:00")
        gravequarter.MethodOfPayment = req.body.MethodOfPayment

        gravequarter.save((err, doc) => {
            if (!err) {
                res.redirect("/gravequarters/list")
            } else {
                console.log("Błąd podczas dodawania GraveQuarters: " + err)
            }
        })
    },
    update: function (req, res) {
        console.log("updatequater");
        console.log(req.body);
        req.body.DatePayment = new Date(req.body.DatePayment.split("-").reverse().join("-") + "T14:48:00.000+09:00");
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
    },
    setenableburialafterexumation:function(req,upddate){

        GraveQuarters.findOneAndUpdate({_id:req},
            upddate,
            (err, doc) => {
                if (!err) {
                   return true;
                } else {
                    return false;
                }
            }
        )
    },
    showedit: async function (req, res) {

        GraveQuarters.findById(req.params.id, (err, doc) => {



            if (!err) {

                var gravedate = doc.DatePayment.toISOString().slice(0, 10).split("-").reverse().join("-");

                OvnerRip.find((err, listu) => {
                    if (!err) {

                        res.render("addoreditgrave", {
                            viewTitle: "Zaktualizuj dane kwatery",
                            action: "/gravequarters/addtomongobase",
                            GraveQuarters: doc,
                            listu: listu,
                            defaultid: "block",
                            pickid: "none",
                            GraveQuartersdate: gravedate,
                            showaddburial: "",
                            idadd: "IdGraveQuatershidden",
                            idedit: "IdGraveQuaters",
                            require: "",
                            edit: true



                        });
                    } else {
                        console.log("Błąd pobierania danych user" + err)
                    }
                })
            }
        })
    },
    showadd: async function (req, res) {
        GraveQuarters.find({}, { IdGraveQuaters: 1, _id: 0 }, (err, docs) => {
            if (!err) {

                var listid = [];
                var listidenable = [];

                docs.forEach(x => {
                    listid.push(x.IdGraveQuaters);

                });
                listid.sort(function (a, b) { return a - b });
                //console.log(listid);  
                //console.log(typeof listid[0]);  
                //  console.log(listid.length); 

                var k = 0;
                for (j = 0; j < listallid.length;) {
                    //  console.log(listallid[j]);   
                    //console.log(listid[k]); 
                    if (listallid[j] == listid[k]) {

                        j++;
                        k++;
                        //listidenable.splice(j,1);
                    } else {
                        listidenable.push(j + 1);
                        j++;

                    }

                }


                OvnerRip.find((err, listu) => {
                    if (!err) {

                        console.log(listidenable);
                        res.render("addoreditgrave", {
                            viewTitle: "Dodaj kwatere",
                            action: "/gravequarters/addtomongobase",
                            listu: listu,
                            listid: listidenable,
                            defaultid: "none",
                            pickid: "block",
                            showaddburial: "disabled",
                            idadd: "IdGraveQuaters",
                            idedit: "IdGraveQuatershidden",
                            require: "require",
                            edit: false




                        })

                    }
                    else {
                        console.log("Błąd pobierania danych user" + err)
                    }
                })

            }
        })
    },
    deletegrave: async function (req, res) {
        const { Burial } = require("./Burials");

        Burial.find({ GraveQuartersnumber: req.nrquater }, (err, doc) => {
            if (!err && doc[0] != undefined) {

                console.log(typeof doc[0]);
                console.log("nie można usunąć");
                res.sendStatus(207);
                //res.redirect("/ovnerrip/list/?error:nodelete");
            } else {
                //console.log(" można usunąć");
                GraveQuarters.findByIdAndRemove(req.id, (err, doc) => {
                    if (!err) {
                        res.sendStatus(200);
                    } else {
                        console.log("Błąd podczas usuwania: " + err)
                    }
                })
            }
        })
        
    },
    showlist: async function (req, res) {


        GraveQuarters.find((err, docs) => {
            if (!err) {
                docs.forEach(element => {
                    if (element.Payment == true) {
                        element.PaymentString = "Tak";
                    } else {
                        element.PaymentString = "Nie";
                    }
                })
                res.render("listgrave", {
                    list: docs,

                })


            } else {
                console.log("Błąd pobierania danych /gravequarters/list" + err)
            }
        })
    },
    checkburial: function (req, res) {
        console.log("in check gravelist");
        GraveQuarters.find((err, docs) => {
            if (!err) {
                var listquaterwithburial = [];
                var listtosend = [];
                var index = 0;


                //uzyskanie kwater ktore maja pochowki
                docs.forEach(element => {
                    //console.log(Number(element.NumberUrnBurials));
                    // console.log( Number(element.NumberTraditionalBurials));
                    if (Number(element.NumberUrnBurials) > 0 || Number(element.NumberTraditionalBurials) > 0) {
                        listquaterwithburial.push(element.IdGraveQuaters);


                    }


                });
                //console.log(listquaterwithburial);
                listquaterwithburial.sort(function (a, b) { return a - b });
                console.log(listquaterwithburial);
                // console.log(typeof docs);
                //ustawienie flag dla kwater
                for (i = 1; i <= listallid.length; i++) {
                    if (i == listquaterwithburial[index]) {
                        listtosend[i - 1] = true;

                        index++
                    } else {
                        listtosend[i - 1] = false;
                    }
                }
                console.log(listtosend);
                res.send(listtosend);


            } else {
                res.status(500).send({ message: "Blad serwera nie pobrano listy grobow" });
            }
        })
    },
    findnotpay: function async() {
        return new Promise((resolve, reject) => {
            let now = new Date();
            //console.log(now);
            var weekago = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6);
            GraveQuarters.find({
                DatePayment: {

                    $lt: weekago
                }
            }, { _id: 0, IdGraveQuaters: 1, ovnerripid: 1, DatePayment: 1 }
                , (err, docs) => {
                    if (!err) {
                        console.log(docs);

                        resolve(docs);



                    } else {
                        console.log("Błąd pobierania danych /gravequarters/list" + err)
                        resolve(err);
                    }
                })
        })
    },
    setnotpay: async function () {
        let now = new Date();

        GraveQuarters.find({ //query today up to tonight
            DatePayment: {

                $lt: now
            }
        }, { _id: 0, Payment: 1 }
            , (err, docs) => {
                if (!err) {
                    //console.log(docs);
                    return docs;



                } else {
                    console.log("Błąd pobierania danych /gravequarters/list" + err)
                }
            })
    },
    sendquaterdetails: function (req, res) {

        GraveQuarters.find({ IdGraveQuaters: req }, (err, doc) => {
            if (!err) {
                console.log("finddetailforclient");
                console.log(doc);
                //console.log(doc[0].NumberTraditionalBurials);
                //console.log(doc[0].NumberUrnBurials);

                if (doc[0] != undefined && (doc[0].NumberTraditionalBurials > 0 || doc[0].NumberUrnBurials > 0)) {
                    console.log("finddetailforclient condicion");
                    Burial.find({ GraveQuaters: doc[0]._id }, (err, doc) => {
                        if (!err) {
                            res.send(doc);
                        } else {
                            res.status(404);
                            res.send("blad przy wyszukiwaniu pochowkow");
                        }
                    })
                } else {
                    res.status(404);
                    res.send("kwatera nie ma pochowkow");
                }




            } else {
                console.log("Błąd pobierania danych /gravequartersdetail" + err);
            }
        })

    }

}












module.exports = { GraveQuarters, GraveQuartersSchema, GraveController }