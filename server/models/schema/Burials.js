const mongoose = require("mongoose");
var Schema = mongoose.Schema;



const BurialSchema = new mongoose.Schema({

    Burialtype: { type: String, enum: ["Tradycyjny", "Urnowy"], required: true },
    Namedeceased: { type: String, required: true },
    LastNamedeceased: { type: String, required: true },
    DateOfBirth: { type: Date, required: true },
    DateOfDeath: { type: Date, required: true },
    DateBurial: { type: Date, required: true },
    GraveQuaters: { type: Schema.Types.ObjectId, ref: 'GraveQuartersSchema', required: true },
    GraveQuartersnumber: { type: Number, required: true },
    Archive: { type: Boolean, require: true, default: false }


})
const Burial = mongoose.model("Burial", BurialSchema);

async function showlist(req, res) {
    // 
    Burial.find({ Archive: false }, (err, docs) => {
        if (!err) {
            docs.forEach(docs => {
                docs.DateOfDeathstring = docs.DateOfDeath.toISOString().slice(0, 10).split("-").reverse().join("-");
                docs.DateBurialstring = docs.DateBurial.toISOString().slice(0, 10).split("-").reverse().join("-");
                docs.DateOfBirthString = docs.DateOfBirth.toISOString().slice(0, 10).split("-").reverse().join("-");
                //console.log(docs._id+"  "+docs.DateOfBirth);
            });

            res.render("listburial", {
                list: docs,

            })


        } else {
            console.log("Błąd pobierania danych /gravequarters/list" + err)
        }
    })
}

async function showedit(req, res) {
    console.log(req.params.id);
    Burial.findById(req.params.id, (err, doc) => {
        if (!err) {




            doc.DateOfDeathstring = doc.DateOfDeath.toISOString().slice(0, 10).split("-").reverse().join("-");
            doc.DateBurialstring = doc.DateBurial.toISOString().slice(0, 10).split("-").reverse().join("-");
            doc.DateOfBirthString = doc.DateOfBirth.toISOString().slice(0, 10).split("-").reverse().join("-");
            console.log(doc.DateOfBirthString);
            res.render("editBurial", {
                viewTitle: "Edytuj pochówek",
                action: "/burial/addtomongobase",
                burial: doc,
                burialtype: doc.Burialtype,
                stateedit: true
            });


        } else {
            console.log("Błąd pobierania danych burial" + err)
        }
    })
}
async function showadd(req, res) {
    //console.log(req);
    const { GraveController } = require("./GraveQuarters")
    GraveController.addburialls(req, res);

}
async function showlistclient(req, res) {
    res.send("W opracowaniu");
}
async function updatecountburial(req, res) {
    console.log(req.TypeOFburialone);
    console.log(typeof req.TypeOFburialone);
    var gravedata = JSON.parse(req.GraveQuartersnumber);
    var addburiall = {};
    if (req.TypeOFburialone == "Tradycyjny") {


        addburiall = { NumberTraditionalBurials: Number(gravedata.gravetraditional) + 1 };

    } else if (req.TypeOFburialone == "Urnowy") {
        addburiall = { NumberUrnBurials: Number(gravedata.graveurn) + 1 };
    } else { console.log("Error checking the type of burial " + err); }
    console.log(addburiall);
    const { GraveQuarters } = require("./GraveQuarters")
    GraveQuarters.findOneAndUpdate(
        { _id: gravedata._id },
        addburiall,
        { new: true },
        (err, doc) => {
            if (!err) {
                res.redirect("/burial/list");
            } else {
                console.log("Błąd podczas aktualizowania danych: " + err);
            }
        }
    )


}
function update(req, res) {
    //console.log(req.body);
    var updatedata = {
        Namedeceased: req.body.Namedeceased,
        LastNamedeceased: req.body.LastNamedeceased,
        DateBurial: new Date(req.body.DateBurial.split("-").reverse().join("-") + "T14:48:00.000+09:00"),
        DateOfBirth: new Date(req.body.DateOfBirth.split("-").reverse().join("-") + "T14:48:00.000+09:00"),

    }
    //console.log(updatedata);
    Burial.findOneAndUpdate(
        { _id: req.body._idBurial },
        updatedata,
        { new: true },
        (err, doc) => {
            if (!err) {
                res.redirect("/burial/list")
            } else {
                console.log("Błąd podczas aktualizowania danych: " + err)
            }
        }
    )
}
async function insert(req, res) {
    //console.log(req);
    //console.log(req.GraveQuartersnumber._id);
    let conwert_DateOfDeath = req.DateOfDeath.split("-").reverse().join("-") + "T14:48:00.000+09:00";
    let conwert_DateBurial = req.DateBurial.split("-").reverse().join("-") + "T14:48:00.000+09:00";
    let conwert_DateOfBirth = req.DateOfBirth.split("-").reverse().join("-") + "T14:48:00.000+09:00";
    const DateOfDeath = new Date(conwert_DateOfDeath);
    const DateBurial = new Date(conwert_DateBurial);
    const DateOfBirth = new Date(conwert_DateOfBirth);
    const gravedata = JSON.parse(req.GraveQuartersnumber);

    var burial = new Burial()
    burial.Burialtype = req.TypeOFburialone;
    burial.Namedeceased = req.Namedeceased;
    burial.LastNamedeceased = req.LastNamedeceased;
    burial.DateOfDeath = DateOfDeath;
    burial.DateBurial = DateBurial;
    burial.DateOfBirth = DateOfBirth;
    burial.GraveQuaters = gravedata._id;
    burial.GraveQuartersnumber = gravedata.id;
    burial.Archive = false;


    burial.save((err, doc) => {
        if (!err) {
            updatecountburial(req, res);

        } else {
            console.log("Błąd podczas dodawania Burials: " + err)
        }
    })
}
const BurialControler = {
    setarchiwe: function (req) {
        Burial.findOneAndUpdate(
            { _id: req },
            { Archive: true },
            (err, doc) => {
                if (!err) {
                    const { GraveController } = require("./GraveQuarters")
                    if (doc.Burialtype === "Urnowy") {

                        GraveController.setenableburialafterexumation(doc.GraveQuaters, { "$inc": { "NumberUrnBurials": -1 } });
                    } else {
                        GraveController.setenableburialafterexumation(doc.GraveQuaters, { "$inc": { "NumberTraditionalBurials": -1 } });
                    }
                } else {
                    return false
                }
            }
        )
    },
    serchforclient: async function (req, res) {
        console.log(req);
        var search = {};
        // DateOfDeath:req.DateDeath.split("-").reverse().join("-")+"T14:48:00.000+09:00"
        if (req.Name !== "" && req.LastName !== "" && req.Date == "") {
            search = {
                Namedeceased: req.Name,
                LastNamedeceased: req.LastName,
            };
            this.serchforclientindb(search, res);
        }
        else if (req.Name === "" && req.LastName !== "") {
            {
                search = {
                    LastNamedeceased: req.LastName,
                };
                this.serchforclientindb(search, res);
            }

        }
        else if (req.Name !== "" && req.LastName === "") {
            {
                search = {
                    Namedeceased: req.Name,
                };
                this.serchforclientindb(search, res);
            }
        }
        else if (req.Name !== "" && req.LastName !== "" && req.Date !== "") {
            {

                let dateserch = new Date(req.Date);
                let lesdataserch = new Date(dateserch.getTime() + 863999999)

                console.log(dateserch);
                console.log(lesdataserch);
                search = {
                    Namedeceased: req.Name,
                    LastNamedeceased: req.LastName,
                    DateOfDeath: { "$gte": dateserch, "$lt": lesdataserch }

                };
                this.serchforclientindb(search, res);
            }
        }

        else {
            res.status(401);
            res.send("Niepoprawne dane");
        }


    },
    serchforclientindb: async function (req, res) {
        console.log(req);
        Burial.find(
            req, (err, doc) => {
                if (!err) {
                    console.log(doc);
                    res.status(200);
                    res.send(doc);

                } else {
                    console.log("Błąd podczas wyszukiwania danych o pochowkach dla klienta: " + err)
                }
            })
    }

}


module.exports = { Burial, BurialSchema, showlist, showedit, showadd, showlistclient, BurialControler, insert, update }